/**
 * SLA alerts: the bookings that have waited longer than the business said
 * they may. Server only.
 *
 * The thresholds are the owner's (/crm/settings, read through getSlaSettings);
 * the rules are here, in one place, so the dashboard panel, the owner
 * overview and the bell all agree on what "delayed" means.
 *
 *   sample_delay     collected, not yet received by the lab after N hours
 *   report_delayed   report due time + grace has passed, no report uploaded
 *   partner_pending  the lab has not accepted/rejected an order after N hours
 *   payment_pending  open booking still owes money N days after booking
 *   followup_overdue a scheduled call-back whose time has passed
 *
 * Every figure is computed in SQL — a count and the few oldest rows — so the
 * cost does not grow with the size of the bookings table beyond what the
 * status index already narrows.
 */
import { query } from "@/lib/db";

import { notify } from "./activity";
import { OPEN_STATUSES, SLA_DEFAULTS, bookingCode } from "./constants";
import { getSlaSettings } from "./stores/system";

/** Thresholds, never failing: a settings read error falls back to the defaults. */
export async function slaSettings() {
  try {
    return { ...SLA_DEFAULTS, ...((await getSlaSettings()) ?? {}) };
  } catch (err) {
    console.error("[crm/sla] could not read SLA settings — using defaults", err);
    return { ...SLA_DEFAULTS };
  }
}

const n = (v, fallback) => (Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) : fallback);
const inList = (list) => list.map(() => "?").join(",");

/** How long something has waited, from minutes: "45 min", "7 h", "2 d 3 h". */
export function waited(minutes) {
  const m = Math.max(0, Math.round(Number(minutes) || 0));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  return h % 24 ? `${d} d ${h % 24} h` : `${d} d`;
}

const bookingItem = (r, sub) => ({
  bookingId: r.id,
  href: `/crm/bookings/${r.id}`,
  title: `${bookingCode(r.id)} · ${r.patient_name}`,
  sub,
  since: r.since,
  waitMin: Number(r.wait_min),
});

/**
 * The alert definitions. Each has a WHERE (on bookings `b`, or follow-ups
 * `f`), its params, the item query's extra columns, and how to word an item.
 */
function definitions(s) {
  const open = OPEN_STATUSES;
  return {
    sample_delay: {
      label: "Sample receiving delay",
      icon: "sample",
      severity: "warning",
      perm: "bookings.view",
      from: "bookings b LEFT JOIN partners p ON p.id = b.partner_id",
      where: "b.deleted_at IS NULL AND b.status = 'sample_collected' AND b.collected_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL ? HOUR)",
      params: [n(s.sample_receive_hours, SLA_DEFAULTS.sample_receive_hours)],
      select: "b.id, b.patient_name, b.collected_at AS since, TIMESTAMPDIFF(MINUTE, b.collected_at, UTC_TIMESTAMP()) AS wait_min, p.name AS partner_name",
      order: "b.collected_at ASC",
      item: (r) => bookingItem(r, `Collected ${waited(r.wait_min)} ago · ${r.partner_name || "no lab assigned"}`),
    },
    report_delayed: {
      label: "Report delayed",
      icon: "report",
      severity: "danger",
      perm: "reports.view",
      from: "bookings b LEFT JOIN partners p ON p.id = b.partner_id",
      where:
        "b.deleted_at IS NULL AND b.status IN ('sample_received','processing') AND b.report_due_at IS NOT NULL AND b.report_due_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL ? HOUR)",
      params: [n(s.report_grace_hours, SLA_DEFAULTS.report_grace_hours)],
      select: "b.id, b.patient_name, b.report_due_at AS since, TIMESTAMPDIFF(MINUTE, b.report_due_at, UTC_TIMESTAMP()) AS wait_min, p.name AS partner_name",
      order: "b.report_due_at ASC",
      item: (r) => bookingItem(r, `${waited(r.wait_min)} past due · ${r.partner_name || "no lab"}`),
    },
    partner_pending: {
      label: "Partner action required",
      icon: "partner",
      severity: "warning",
      perm: "bookings.assign",
      from: "bookings b LEFT JOIN partners p ON p.id = b.partner_id",
      where: `b.deleted_at IS NULL AND b.partner_status = 'pending' AND b.status IN (${inList(open)}) AND b.partner_assigned_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL ? HOUR)`,
      params: [...open, n(s.partner_accept_hours, SLA_DEFAULTS.partner_accept_hours)],
      select: "b.id, b.patient_name, b.partner_assigned_at AS since, TIMESTAMPDIFF(MINUTE, b.partner_assigned_at, UTC_TIMESTAMP()) AS wait_min, p.name AS partner_name",
      order: "b.partner_assigned_at ASC",
      item: (r) => bookingItem(r, `${r.partner_name || "Lab"} has not answered in ${waited(r.wait_min)}`),
    },
    payment_pending: {
      label: "Payment pending",
      icon: "payment",
      severity: "warning",
      perm: "payments.view",
      from: "bookings b",
      where: `b.deleted_at IS NULL AND b.payment_status IN ('pending','partial','failed') AND b.status IN (${inList(open)})
              AND b.final_amount - b.paid_amount + b.refunded_amount > 0
              AND b.created_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL ? DAY)`,
      params: [...open, n(s.payment_pending_days, SLA_DEFAULTS.payment_pending_days)],
      select:
        "b.id, b.patient_name, b.created_at AS since, TIMESTAMPDIFF(MINUTE, b.created_at, UTC_TIMESTAMP()) AS wait_min, (b.final_amount - b.paid_amount + b.refunded_amount) AS due",
      order: "b.created_at ASC",
      item: (r) => bookingItem(r, `₹${Number(r.due).toLocaleString("en-IN")} due · booked ${waited(r.wait_min)} ago`),
    },
    followup_overdue: {
      label: "Follow-ups overdue",
      icon: "followup",
      severity: "warning",
      perm: "leads.view",
      from: "follow_ups f LEFT JOIN leads l ON l.id = f.lead_id LEFT JOIN customers c ON c.id = f.customer_id LEFT JOIN admin_users u ON u.id = f.assigned_user_id",
      where: "f.status = 'pending' AND f.due_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL ? HOUR)",
      params: [n(s.followup_overdue_hours, SLA_DEFAULTS.followup_overdue_hours)],
      select:
        "f.id, f.booking_id, f.lead_id, f.customer_id, f.note, f.due_at AS since, TIMESTAMPDIFF(MINUTE, f.due_at, UTC_TIMESTAMP()) AS wait_min, COALESCE(l.name, c.name, '') AS who, u.name AS assignee",
      order: "f.due_at ASC",
      item: (r) => ({
        bookingId: r.booking_id ?? null,
        href: r.booking_id
          ? `/crm/bookings/${r.booking_id}`
          : r.lead_id
            ? `/crm/leads/${r.lead_id}`
            : r.customer_id
              ? `/crm/customers/${r.customer_id}`
              : "/crm/follow-ups",
        title: r.who || (r.booking_id ? bookingCode(r.booking_id) : "Follow-up"),
        sub: `${waited(r.wait_min)} overdue${r.assignee ? ` · ${r.assignee}` : ""}${r.note ? ` · ${String(r.note).slice(0, 60)}` : ""}`,
        since: r.since,
        waitMin: Number(r.wait_min),
      }),
    },
  };
}

export const ALERT_TYPES = ["report_delayed", "sample_delay", "partner_pending", "payment_pending", "followup_overdue"];

/**
 * [{ type, label, icon, severity, perm, count, items: [{ bookingId, href, title, sub, since, waitMin }] }]
 * `types` limits which alerts are computed (the caller filters by permission).
 */
export async function computeAlerts({ limitPerType = 4, types = ALERT_TYPES, settings = null } = {}) {
  const s = settings ?? (await slaSettings());
  const defs = definitions(s);
  const lim = Math.min(100, Math.max(1, Number(limitPerType) || 4));
  const wanted = ALERT_TYPES.filter((t) => types.includes(t));

  return Promise.all(
    wanted.map(async (type) => {
      const d = defs[type];
      try {
        const [[rows], [[count]]] = await Promise.all([
          query(`SELECT ${d.select} FROM ${d.from} WHERE ${d.where} ORDER BY ${d.order} LIMIT ${lim}`, d.params),
          query(`SELECT COUNT(*) AS n FROM ${d.from} WHERE ${d.where}`, d.params),
        ]);
        return { type, label: d.label, icon: d.icon, severity: d.severity, perm: d.perm, count: Number(count.n), items: rows.map(d.item) };
      } catch (err) {
        // One broken rule (a table not migrated yet) must not blank the panel.
        console.error(`[crm/sla] ${type} failed`, err);
        return { type, label: d.label, icon: d.icon, severity: d.severity, perm: d.perm, count: 0, items: [], error: true };
      }
    })
  );
}

const NOTIFY_TITLES = {
  sample_delay: (i) => `Sample not received · ${i.title}`,
  report_delayed: (i) => `Report delayed · ${i.title}`,
  partner_pending: (i) => `Lab has not accepted · ${i.title}`,
  payment_pending: (i) => `Payment pending · ${i.title}`,
  followup_overdue: (i) => `Follow-up overdue · ${i.title}`,
};

/**
 * Raise a notification for every SLA breach that has not had one — at most
 * once per record per alert type (a same-type, same-link notification in the
 * last 7 days counts as already raised). The whole pass runs at most once
 * every 5 minutes per server process. Never throws.
 */
export async function raiseSlaNotifications() {
  const now = Date.now();
  if (globalThis.__mbCrmSlaAt && now - globalThis.__mbCrmSlaAt < 5 * 60_000) return 0;
  globalThis.__mbCrmSlaAt = now;

  let raised = 0;
  try {
    const alerts = await computeAlerts({ limitPerType: 50 });
    for (const a of alerts) {
      if (!a.items.length) continue;
      const type = `sla.${a.type}`.slice(0, 40);
      const links = [...new Set(a.items.map((i) => i.href))];
      const [seen] = await query(
        `SELECT DISTINCT link FROM notifications
         WHERE type = ? AND created_at > DATE_SUB(UTC_TIMESTAMP(), INTERVAL 7 DAY) AND link IN (${inList(links)})`,
        [type, ...links]
      );
      const already = new Set(seen.map((r) => r.link));
      for (const item of a.items) {
        if (already.has(item.href)) continue;
        already.add(item.href);
        await notify({
          type,
          title: NOTIFY_TITLES[a.type](item),
          body: item.sub,
          link: item.href,
          perm: a.perm,
          severity: a.severity,
        });
        raised += 1;
      }
    }
  } catch (err) {
    console.error("[crm/sla] notification pass failed", err);
  }
  return raised;
}
