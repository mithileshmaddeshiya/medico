/**
 * The lab partner's home screen — what /crm renders for a partner account
 * (`<PartnerDashboard user={user} />`, user from getCrmUser with isPartner).
 *
 * Mobile-first: a lab technician opens this on a phone between samples, so
 * the first screen is "what needs me now" with one-tap Accept / Received
 * buttons (the same server actions as the order page), then the numbers.
 *
 * Every query here is filtered to user.partnerId in SQL and selects only what
 * a lab may see: patient name, age/gender, city, tests and the lab's own
 * amount — never the customer's phone, address, price or MedicoBharat's margin.
 */
import Link from "next/link";
import {
  AlarmClock,
  Bell,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FlaskConical,
  Hourglass,
  Inbox,
  TestTube2,
  Upload,
  Wallet,
} from "lucide-react";

import { ConfirmAction, QuickAction } from "@/components/crm/forms";
import { Card, EmptyState, KpiCard, PageHeader, Timeline, btn } from "@/components/crm/ui";
import { listNotifications } from "@/lib/crm/activity";
import { SETTLEMENT_STATUS, bookingCode } from "@/lib/crm/constants";
import { range } from "@/lib/crm/dates";
import { ago, dateTime, day, num, rupees } from "@/lib/crm/format";
import { has } from "@/lib/crm/guard";
import { unpaidSettlementsFor, unsettledFor } from "@/lib/crm/stores/settlements";
import { query } from "@/lib/db";

import { labProgressAction, partnerRespondAction } from "../bookings/actions";

const LIVE_REPORT = "EXISTS (SELECT 1 FROM reports r WHERE r.booking_id = b.id AND r.status IN ('uploaded','verified','sent'))";
const ITEMS = `(SELECT GROUP_CONCAT(i.name ORDER BY i.id SEPARATOR ' + ') FROM booking_items i
                WHERE i.booking_id = b.id AND i.status = 'active') AS items_label`;
// The columns a lab may see of an order — nothing else is selected.
const SAFE_COLS = `b.id, b.patient_name, b.age, b.gender, b.city, b.status, b.partner_status, b.partner_cost,
                   b.partner_assigned_at, b.collected_at, b.report_due_at, ${ITEMS}`;

function greeting() {
  const h = Number(new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false }));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default async function PartnerDashboard({ user }) {
  const pid = Number(user?.partnerId) || -1;
  const today = range("today");
  const month = range("month");
  const canLab = has(user, "reports.manage") || has(user, "bookings.manage");

  const [[labRows], [[k]], [[uploaded]], unsettled, unpaid, [[last]], [awaiting], [toReceive], [overdue], notes] = await Promise.all([
    query("SELECT name, city FROM partners WHERE id = ?", [pid]),
    query(
      `SELECT
         SUM(b.partner_assigned_at >= ? AND b.partner_assigned_at < ?) AS today,
         SUM(b.partner_status = 'pending' AND b.status NOT IN ('cancelled','completed')) AS awaiting,
         SUM(b.partner_status = 'accepted' AND b.status IN ('booked','confirmed','collection_assigned','sample_collected')) AS pending_samples,
         SUM(b.partner_status = 'accepted' AND b.status = 'processing') AS processing,
         SUM(b.partner_status = 'accepted' AND b.status IN ('sample_received','processing') AND NOT ${LIVE_REPORT}) AS reports_pending,
         SUM(b.partner_status = 'accepted' AND b.status IN ('report_ready','report_delivered','completed')
             AND COALESCE(b.report_ready_at, b.completed_at, b.updated_at) >= ?) AS completed_month
       FROM bookings b
       WHERE b.deleted_at IS NULL AND b.partner_id = ? AND b.partner_status <> 'rejected'`,
      [today.from, today.to, month.from, pid]
    ),
    query(
      `SELECT COUNT(DISTINCT r.booking_id) AS n FROM reports r JOIN bookings b ON b.id = r.booking_id
       WHERE b.partner_id = ? AND b.partner_status = 'accepted' AND r.status <> 'rejected' AND r.uploaded_at >= ?`,
      [pid, month.from]
    ),
    unsettledFor(pid),
    unpaidSettlementsFor(pid),
    query(
      `SELECT id, partner_payable + adjustments AS net, paid_amount, status, period_from, period_to, paid_on
       FROM settlements WHERE partner_id = ? AND status <> 'void' ORDER BY id DESC LIMIT 1`,
      [pid]
    ),
    query(
      `SELECT ${SAFE_COLS} FROM bookings b
       WHERE b.deleted_at IS NULL AND b.partner_id = ? AND b.partner_status = 'pending' AND b.status NOT IN ('cancelled','completed')
       ORDER BY b.partner_assigned_at ASC LIMIT 10`,
      [pid]
    ),
    query(
      `SELECT ${SAFE_COLS} FROM bookings b
       WHERE b.deleted_at IS NULL AND b.partner_id = ? AND b.partner_status = 'accepted' AND b.status = 'sample_collected'
       ORDER BY b.collected_at ASC LIMIT 10`,
      [pid]
    ),
    query(
      `SELECT ${SAFE_COLS} FROM bookings b
       WHERE b.deleted_at IS NULL AND b.partner_id = ? AND b.partner_status = 'accepted'
         AND b.status IN ('sample_received','processing') AND b.report_ready_at IS NULL
         AND b.report_due_at IS NOT NULL AND b.report_due_at < UTC_TIMESTAMP() AND NOT ${LIVE_REPORT}
       ORDER BY b.report_due_at ASC LIMIT 10`,
      [pid]
    ),
    listNotifications(user, { limit: 6 }),
  ]);

  const lab = labRows[0];
  const n = (v) => Number(v ?? 0);
  const actionCount = awaiting.length + toReceive.length + overdue.length;
  const lastNet = last ? Number(last.net) : null;

  return (
    <>
      <PageHeader
        eyebrow={lab ? `${lab.name}${lab.city ? ` · ${lab.city}` : ""}` : "Lab partner"}
        title={`${greeting()}${user?.name ? `, ${String(user.name).split(" ")[0]}` : ""}`}
        description={actionCount ? `${actionCount} order${actionCount === 1 ? "" : "s"} need${actionCount === 1 ? "s" : ""} your action.` : "Nothing waiting on you right now."}
        actions={
          <Link href="/crm/bookings" className={btn("primary")}>
            <ClipboardList className="h-4 w-4" aria-hidden /> All orders
          </Link>
        }
      />

      {!lab && (
        <div className="mb-5 rounded-2xl bg-amber-50 px-4 py-3 text-[13px] text-amber-900 ring-1 ring-inset ring-amber-600/20">
          This login is not linked to a lab yet. Ask MedicoBharat to link it — until then no orders can be shown.
        </div>
      )}

      {/* What needs the lab now */}
      <Card
        className="mb-5"
        title="Needs your action"
        description="New orders to accept first, then samples to mark received, then reports that are late."
      >
        {actionCount === 0 ? (
          <EmptyState compact icon={<CheckCircle2 className="h-5 w-5" />} title="You are all caught up" hint="New orders appear here the moment MedicoBharat sends them, and you are notified." />
        ) : (
          <ul className="space-y-2.5">
            {awaiting.map((b) => (
              <ActionRow key={`a${b.id}`} b={b} tone="amber" icon={<Inbox className="h-4 w-4" />} note={`Sent ${ago(b.partner_assigned_at)}`}>
                <QuickAction action={partnerRespondAction} fields={{ id: b.id, decision: "accept" }} variant="success" className="w-full sm:w-auto">
                  <CheckCircle2 className="h-4 w-4" aria-hidden /> Accept
                </QuickAction>
                <ConfirmAction
                  action={partnerRespondAction}
                  fields={{ id: b.id, decision: "reject" }}
                  label="Reject"
                  className="w-full sm:w-auto"
                  title={`Reject ${bookingCode(b.id)}?`}
                  body="MedicoBharat will send it to another lab."
                  reason
                  reasonLabel="Why can you not take it?"
                  confirmLabel="Reject order"
                />
              </ActionRow>
            ))}
            {toReceive.map((b) => (
              <ActionRow key={`r${b.id}`} b={b} tone="violet" icon={<TestTube2 className="h-4 w-4" />} note={`Collected ${ago(b.collected_at)} — on its way to you`}>
                {canLab ? (
                  <QuickAction action={labProgressAction} fields={{ id: b.id, stage: "sample_received" }} variant="primary" className="w-full sm:w-auto">
                    Sample received
                  </QuickAction>
                ) : (
                  <Link href={`/crm/bookings/${b.id}`} className={btn("secondary", "md", "w-full sm:w-auto")}>
                    Open order
                  </Link>
                )}
              </ActionRow>
            ))}
            {overdue.map((b) => (
              <ActionRow key={`o${b.id}`} b={b} tone="rose" icon={<AlarmClock className="h-4 w-4" />} note={`Report was due ${ago(b.report_due_at)}`}>
                <Link href={`/crm/bookings/${b.id}#report`} className={btn("primary", "md", "w-full sm:w-auto")}>
                  <Upload className="h-4 w-4" aria-hidden /> Upload report
                </Link>
              </ActionRow>
            ))}
          </ul>
        )}
      </Card>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Today's orders" value={num(n(k?.today))} sub="Sent to you today" icon={<ClipboardList className="h-4 w-4" />} href="/crm/bookings" />
        <KpiCard label="Pending acceptance" value={num(n(k?.awaiting))} sub="Accept or reject" icon={<Hourglass className="h-4 w-4" />} tone="amber" href="/crm/bookings?partnerStatus=pending" />
        <KpiCard label="Pending samples" value={num(n(k?.pending_samples))} sub="Accepted, not yet received" icon={<TestTube2 className="h-4 w-4" />} tone="violet" />
        <KpiCard label="Processing" value={num(n(k?.processing))} sub="In your lab now" icon={<FlaskConical className="h-4 w-4" />} tone="sky" href="/crm/bookings?status=processing" />
        <KpiCard label="Reports pending" value={num(n(k?.reports_pending))} sub="Received, no report yet" icon={<FileCheck2 className="h-4 w-4" />} tone="rose" href="/crm/reports" />
        <KpiCard label="Reports uploaded" value={num(n(uploaded?.n))} sub="This month" icon={<Upload className="h-4 w-4" />} tone="teal" />
        <KpiCard label="Completed orders" value={num(n(k?.completed_month))} sub="This month" icon={<CheckCircle2 className="h-4 w-4" />} tone="emerald" />
        <KpiCard
          label="Payment pending"
          value={rupees(unsettled.amount + unpaid.amount)}
          sub={`${rupees(unsettled.amount)} not yet billed · ${rupees(unpaid.amount)} billed`}
          icon={<Wallet className="h-4 w-4" />}
          tone="amber"
          href="/crm/settlements"
        />
        <KpiCard
          label="Last settlement"
          value={lastNet === null ? "—" : rupees(lastNet)}
          sub={last ? `${SETTLEMENT_STATUS[last.status]?.label ?? last.status} · ${day(last.period_from)} – ${day(last.period_to)}` : "No statement yet"}
          icon={<Wallet className="h-4 w-4" />}
          tone="emerald"
          href={last ? `/crm/settlements/${last.id}` : "/crm/settlements"}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Recent notifications" actions={<Link href="/crm/notifications" className="text-[12.5px] font-semibold text-blue-700 hover:underline">See all</Link>}>
          <Timeline
            items={notes.map((x) => ({
              id: x.id,
              title: x.title,
              body: x.body || null,
              meta: dateTime(x.created_at),
              href: x.link || null,
              tone: { success: "emerald", warning: "amber", danger: "rose", info: "blue" }[x.severity] ?? "blue",
            }))}
            empty={<EmptyState compact icon={<Bell className="h-5 w-5" />} title="No notifications yet" />}
          />
        </Card>
        <div className="grid gap-3 self-start">
          <QuickLink href="/crm/bookings" icon={<ClipboardList className="h-5 w-5" />} title="Orders" hint="Accept orders, mark samples received" />
          <QuickLink href="/crm/reports" icon={<FileCheck2 className="h-5 w-5" />} title="Reports" hint="Upload and track your reports" />
          <QuickLink href="/crm/settlements" icon={<Wallet className="h-5 w-5" />} title="Payments" hint="Statements and payments from MedicoBharat" />
        </div>
      </div>
    </>
  );
}

const ROW_TONES = {
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
  rose: "bg-rose-50 text-rose-700",
};

function ActionRow({ b, tone, icon, note, children }) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
      <Link href={`/crm/bookings/${b.id}`} className="flex min-w-0 items-start gap-3">
        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${ROW_TONES[tone]}`} aria-hidden>
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block text-[12px] font-semibold text-slate-500">
            {bookingCode(b.id)}
            {b.city ? ` · ${b.city}` : ""}
          </span>
          <span className="block truncate text-[14.5px] font-semibold text-slate-900">
            {b.patient_name}
            {b.age || b.gender ? <span className="font-normal text-slate-500"> · {[b.age && `${b.age} y`, b.gender].filter(Boolean).join(", ")}</span> : null}
          </span>
          <span className="block line-clamp-1 text-[13px] text-slate-600">{b.items_label || "—"}</span>
          <span className="mt-0.5 block text-[12px] text-slate-500">
            {note} · Your amount {rupees(b.partner_cost)}
          </span>
        </span>
      </Link>
      <div className="grid auto-cols-fr grid-flow-col gap-2 sm:flex sm:shrink-0">{children}</div>
    </li>
  );
}

function QuickLink({ href, icon, title, hint }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 transition-colors hover:border-blue-300">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-slate-900">{title}</span>
        <span className="block text-[12.5px] text-slate-500">{hint}</span>
      </span>
    </Link>
  );
}
