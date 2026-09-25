/**
 * Partner settlements — what MedicoBharat owes a lab for a period. Server only.
 *
 * ── A SETTLEMENT IS A SNAPSHOT ───────────────────────────────────────────
 * Generating one copies, per booking, the customer price, the partner's cost
 * and the difference into settlement_items. A booking edited afterwards does
 * not silently change a statement the lab has already been sent; to redo one,
 * void it (its items go 'void', which frees the bookings) and generate again.
 *
 * settlement_items.active_booking is UNIQUE, so the database itself refuses
 * to put one booking into two live settlements — two people pressing
 * "Generate" at once cannot pay a lab twice.
 *
 * ── WHAT A PARTNER SEES ──────────────────────────────────────────────────
 * Their own settlements only (scope.partnerId), and never the customer price
 * or MedicoBharat's margin: shapeForPartner() strips those before a row leaves
 * this file.
 *
 * Net payable = partner_payable + adjustments (adjustments are signed).
 */
import { query, transaction } from "@/lib/db";

import { logActivity, notify } from "../activity";
import { PAYMENT_MODE, SETTLEMENT_STATUS, bookingCode, settlementCode } from "../constants";
import { range } from "../dates";
import { dateRangeOf } from "../filters";
import { UserError } from "../guard";

const r2 = (n) => Math.round(Number(n || 0) * 100) / 100;
const text = (value, max) => String(value ?? "").trim().slice(0, max);
const ymdOk = (v) => /^\d{4}-\d{2}-\d{2}$/.test(String(v ?? ""));

/** Statuses whose money is still owed (not paid, not void). */
export const OPEN_SETTLEMENT = ["pending", "processing", "on_hold"];

/** Booking statuses whose lab work is finished and can be paid for. */
export const SETTLEABLE_STATUSES = ["report_ready", "report_delivered", "completed"];

/**
 * The WHERE fragment for "a booking this partner can be paid for and has not
 * been yet". Shared by generation, the partner's "unsettled earnings" and the
 * payable figures on the partner list, so all three always agree.
 */
export function eligibleWhere(alias = "b") {
  return {
    sql: [
      `${alias}.deleted_at IS NULL`,
      `${alias}.partner_status = 'accepted'`,
      `${alias}.status IN ('report_ready','report_delivered','completed')`,
      `NOT EXISTS (SELECT 1 FROM settlement_items si WHERE si.booking_id = ${alias}.id AND si.status = 'active')`,
    ],
    params: [],
  };
}

/** Unsettled earnings of one partner: { count, amount }. */
export async function unsettledFor(partnerId) {
  const e = eligibleWhere();
  const [[row]] = await query(
    `SELECT COUNT(*) AS n, COALESCE(SUM(b.partner_cost), 0) AS amount
     FROM bookings b WHERE b.partner_id = ? AND ${e.sql.join(" AND ")}`,
    [Number(partnerId) || 0]
  );
  return { count: Number(row.n), amount: Number(row.amount) };
}

/** Per partner: bookings ready to be settled (the "Ready to settle" card). */
export async function unsettledByPartner() {
  const e = eligibleWhere();
  const [rows] = await query(
    `SELECT b.partner_id, p.name AS partner_name, COUNT(*) AS n, COALESCE(SUM(b.partner_cost), 0) AS amount,
            MIN(COALESCE(b.report_ready_at, b.created_at)) AS oldest
     FROM bookings b JOIN partners p ON p.id = b.partner_id
     WHERE ${e.sql.join(" AND ")}
     GROUP BY b.partner_id, p.name
     ORDER BY amount DESC
     LIMIT 50`
  );
  return rows.map((r) => ({ ...r, n: Number(r.n), amount: Number(r.amount) }));
}

/** Owed on generated-but-unpaid statements for one partner. */
export async function unpaidSettlementsFor(partnerId) {
  const [[row]] = await query(
    `SELECT COUNT(*) AS n, COALESCE(SUM(partner_payable + adjustments - paid_amount), 0) AS amount
     FROM settlements WHERE partner_id = ? AND status IN ('pending','processing','on_hold')`,
    [Number(partnerId) || 0]
  );
  return { count: Number(row.n), amount: Math.max(0, Number(row.amount)) };
}

/* ── Read ─────────────────────────────────────────────────────────────── */

const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

/** URL search params → listSettlements filters (the page and the export share it). */
export function settlementFiltersFrom(sp) {
  const r = dateRangeOf(sp);
  return {
    partnerId: one(sp.partner) || null,
    status: one(sp.status) || null,
    search: String(one(sp.q)).slice(0, 80),
    ...(r ? { fromDay: r.fromDay, toDay: r.toDay, rangeLabel: r.label } : {}),
  };
}

const PARTNER_HIDDEN = ["gross_amount", "margin", "notes", "created_by_name"];
const ITEM_HIDDEN = ["customer_amount", "margin"];

const strip = (row, keys) => Object.fromEntries(Object.entries(row).filter(([k]) => !keys.includes(k)));

export function shapeForPartner(s) {
  if (!s) return s;
  const out = strip(s, PARTNER_HIDDEN);
  if (Array.isArray(s.items)) out.items = s.items.map((i) => strip(i, ITEM_HIDDEN));
  return out;
}

/** Numbers as numbers, and the net figure every screen shows. */
function shape(row) {
  const payable = Number(row.partner_payable);
  const adjustments = Number(row.adjustments);
  return {
    ...row,
    gross_amount: Number(row.gross_amount),
    partner_payable: payable,
    margin: Number(row.margin),
    adjustments,
    paid_amount: Number(row.paid_amount),
    net_payable: r2(payable + adjustments),
    bookings_count: Number(row.bookings_count),
  };
}

/**
 * filters: { partnerId, status, fromDay, toDay (period overlap), search, limit, offset }
 */
export async function listSettlements(filters = {}, scope = {}) {
  const where = [];
  const params = [];
  if (scope?.none) where.push("1 = 0");
  if (scope?.partnerId) {
    where.push("s.partner_id = ?");
    params.push(scope.partnerId);
  } else if (filters.partnerId) {
    where.push("s.partner_id = ?");
    params.push(Number(filters.partnerId) || 0);
  }
  if (filters.status && SETTLEMENT_STATUS[filters.status]) {
    where.push("s.status = ?");
    params.push(filters.status);
  }
  // A settlement belongs to a range when its period overlaps it.
  if (filters.fromDay) {
    where.push("s.period_to >= ?");
    params.push(filters.fromDay);
  }
  if (filters.toDay) {
    where.push("s.period_from <= ?");
    params.push(filters.toDay);
  }
  if (filters.search) {
    const q = String(filters.search).trim();
    const code = /^\s*(?:st)?\s*0*(\d+)\s*$/i.exec(q);
    const ors = ["p.name LIKE ?", "s.reference LIKE ?"];
    const like = `%${q.replace(/[%_]/g, "\\$&")}%`;
    params.push(like, like);
    if (code) {
      ors.push("s.id = ?");
      params.push(Number(code[1]));
    }
    where.push(`(${ors.join(" OR ")})`);
  }

  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 25));
  const offset = Math.max(0, Number(filters.offset) || 0);

  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT s.*, p.name AS partner_name, p.city AS partner_city
       FROM settlements s JOIN partners p ON p.id = s.partner_id
       ${clause}
       ORDER BY s.id DESC LIMIT ${limit} OFFSET ${offset}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM settlements s JOIN partners p ON p.id = s.partner_id ${clause}`, params),
  ]);
  const shaped = rows.map(shape);
  return { rows: scope?.partnerId ? shaped.map(shapeForPartner) : shaped, total: Number(count.n), limit, offset };
}

/** The KPI strip on the staff settlements page. */
export async function settlementKpis() {
  const month = range("month");
  const [[row]] = await query(
    `SELECT
       COALESCE(SUM(CASE WHEN status = 'pending' THEN partner_payable + adjustments - paid_amount END), 0) AS pending_amount,
       SUM(status = 'pending') AS pending_n,
       COALESCE(SUM(CASE WHEN status = 'processing' THEN partner_payable + adjustments - paid_amount END), 0) AS processing_amount,
       SUM(status = 'processing') AS processing_n,
       COALESCE(SUM(CASE WHEN status = 'paid' AND paid_on >= ? AND paid_on <= ? THEN paid_amount END), 0) AS paid_month,
       SUM(status = 'paid' AND paid_on >= ? AND paid_on <= ?) AS paid_month_n,
       COALESCE(SUM(CASE WHEN status = 'on_hold' THEN partner_payable + adjustments - paid_amount END), 0) AS hold_amount,
       SUM(status = 'on_hold') AS hold_n
     FROM settlements`,
    [month.fromDay, month.toDay, month.fromDay, month.toDay]
  );
  return Object.fromEntries(Object.entries(row).map(([k, v]) => [k, Number(v ?? 0)]));
}

export async function getSettlement(id, scope = {}) {
  const sid = Number(id) || 0;
  const where = ["s.id = ?"];
  const params = [sid];
  if (scope?.none) where.push("1 = 0");
  if (scope?.partnerId) {
    where.push("s.partner_id = ?");
    params.push(scope.partnerId);
  }
  const [rows] = await query(
    `SELECT s.*, p.name AS partner_name, p.city AS partner_city, p.gstin AS partner_gstin,
            p.bank_name, p.bank_account, p.bank_ifsc, p.upi_id, p.contact_person, p.phone AS partner_phone,
            p.email AS partner_email, p.address AS partner_address, u.name AS created_by_name
     FROM settlements s
     JOIN partners p ON p.id = s.partner_id
     LEFT JOIN admin_users u ON u.id = s.created_by
     WHERE ${where.join(" AND ")} LIMIT 1`,
    params
  );
  if (!rows[0]) return null;

  // Patient FIRST name only: a statement travels (email, print), and the lab
  // needs enough to recognise the order, not the patient's full identity.
  const [items] = await query(
    `SELECT si.id, si.booking_id, si.customer_amount, si.partner_amount, si.margin, si.status,
            b.created_at AS booked_at, b.report_ready_at, SUBSTRING_INDEX(TRIM(b.patient_name), ' ', 1) AS patient_first,
            (SELECT GROUP_CONCAT(i.name ORDER BY i.id SEPARATOR ' + ') FROM booking_items i
              WHERE i.booking_id = b.id AND i.status = 'active') AS items_label
     FROM settlement_items si JOIN bookings b ON b.id = si.booking_id
     WHERE si.settlement_id = ?
     ORDER BY b.id`,
    [sid]
  );
  const s = {
    ...shape(rows[0]),
    items: items.map((i) => ({
      ...i,
      customer_amount: Number(i.customer_amount),
      partner_amount: Number(i.partner_amount),
      margin: Number(i.margin),
    })),
  };
  return scope?.partnerId ? shapeForPartner(s) : s;
}

/* ── Write ────────────────────────────────────────────────────────────── */

/**
 * Build a settlement for one partner and period from every eligible booking
 * (see eligibleWhere) whose report came in within the period — IST days,
 * inclusive; a booking with no report_ready_at falls back to its booking date.
 */
export async function generateSettlement({ partnerId, fromDay, toDay, notes = "" }, { user }) {
  if (!ymdOk(fromDay) || !ymdOk(toDay)) throw new UserError("Pick the period's start and end dates.");
  const period = range("custom", { from: fromDay, to: toDay });
  if (!period) throw new UserError("Pick a valid period.");

  let out;
  try {
    out = await transaction(async (conn) => {
      const [[partner]] = await conn.execute("SELECT id, name, status FROM partners WHERE id = ? FOR UPDATE", [Number(partnerId) || 0]);
      if (!partner || partner.status === "deleted") throw new UserError("Pick a lab partner.");

      const e = eligibleWhere();
      const [bookings] = await conn.execute(
        `SELECT b.id, b.final_amount, b.partner_cost FROM bookings b
         WHERE b.partner_id = ? AND ${e.sql.join(" AND ")}
           AND COALESCE(b.report_ready_at, b.created_at) >= ? AND COALESCE(b.report_ready_at, b.created_at) < ?
         ORDER BY b.id
         FOR UPDATE`,
        [partner.id, period.from, period.to]
      );
      if (!bookings.length) {
        throw new UserError("No completed, unsettled orders for this lab in that period.");
      }

      const gross = r2(bookings.reduce((a, b) => a + Number(b.final_amount), 0));
      const payable = r2(bookings.reduce((a, b) => a + Number(b.partner_cost), 0));
      const margin = r2(gross - payable);

      const [res] = await conn.execute(
        `INSERT INTO settlements (partner_id, period_from, period_to, bookings_count, gross_amount, partner_payable, margin, notes, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [partner.id, period.fromDay, period.toDay, bookings.length, gross, payable, margin, text(notes, 1000), user?.id ?? null]
      );
      const sid = res.insertId;
      for (const b of bookings) {
        const c = r2(b.final_amount);
        const p = r2(b.partner_cost);
        await conn.execute(
          "INSERT INTO settlement_items (settlement_id, booking_id, customer_amount, partner_amount, margin) VALUES (?, ?, ?, ?, ?)",
          [sid, b.id, c, p, r2(c - p)]
        );
      }

      await logActivity({
        conn,
        user,
        action: "create",
        entity: "settlements",
        entityId: sid,
        partnerId: partner.id,
        summary: `Generated ${settlementCode(sid)} for ${partner.name}: ${bookings.length} orders, payable ₹${payable.toLocaleString("en-IN")} (${period.fromDay} → ${period.toDay})`,
        after: { bookings: bookings.map((b) => bookingCode(b.id)), gross_amount: gross, partner_payable: payable, margin },
      });
      return { id: sid, partner, payable, count: bookings.length };
    });
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      throw new UserError("Some of these orders were just settled by someone else. Refresh and try again.");
    }
    throw err;
  }

  await notify({
    type: "settlement.new",
    title: `New payment statement ${settlementCode(out.id)}`,
    body: `${out.count} orders · ₹${out.payable.toLocaleString("en-IN")}`,
    link: `/crm/settlements/${out.id}`,
    partnerId: out.partner.id,
  });
  return out;
}

async function lockSettlement(conn, id) {
  const [[s]] = await conn.execute(
    `SELECT s.*, p.name AS partner_name FROM settlements s JOIN partners p ON p.id = s.partner_id
     WHERE s.id = ? FOR UPDATE`,
    [Number(id) || 0]
  );
  if (!s) throw new UserError("That settlement was not found.");
  return s;
}

const appendNote = (notes, line) => text(`${notes ?? ""}\n${line}`.trim(), 1000);

/** A signed correction (a missed test, a returned sample …) with its reason. */
export async function addAdjustment(id, { amount, reason }, { user }) {
  const value = r2(amount);
  if (!Number.isFinite(value) || value === 0) throw new UserError("Enter the adjustment — negative to deduct.");
  if (!text(reason, 200)) throw new UserError("Say why the amount is being adjusted.");

  return transaction(async (conn) => {
    const s = await lockSettlement(conn, id);
    if (!OPEN_SETTLEMENT.includes(s.status)) throw new UserError("A paid or void settlement cannot be adjusted.");
    const before = r2(s.adjustments);
    const after = r2(before + value);
    if (r2(Number(s.partner_payable) + after) < 0) throw new UserError("That would make the amount payable negative.");

    const sign = value > 0 ? "+" : "−";
    await conn.execute("UPDATE settlements SET adjustments = ?, notes = ? WHERE id = ?", [
      after,
      appendNote(s.notes, `Adjustment ${sign}₹${Math.abs(value)}: ${text(reason, 200)}`),
      s.id,
    ]);
    await logActivity({
      conn,
      user,
      action: "adjust",
      entity: "settlements",
      entityId: s.id,
      partnerId: s.partner_id,
      summary: `${settlementCode(s.id)}: adjustment ${sign}₹${Math.abs(value).toLocaleString("en-IN")} — ${text(reason, 120)}`,
      before: { adjustments: before },
      after: { adjustments: after, reason: text(reason, 200) },
    });
    return { ok: true };
  });
}

const NEXT = {
  pending: ["processing", "on_hold", "paid", "void"],
  processing: ["pending", "on_hold", "paid", "void"],
  on_hold: ["pending", "processing", "paid", "void"],
  paid: [],
  void: [],
};

/**
 * Move a settlement: processing, on hold (reason), paid (amount, mode,
 * reference, date), void (reason — frees its bookings), or back to pending.
 */
export async function setSettlementStatus(id, status, { user, reason = "", payment = {} }) {
  if (!SETTLEMENT_STATUS[status]) throw new UserError("Unknown status.");
  if (["on_hold", "void"].includes(status) && !text(reason, 300)) {
    throw new UserError(status === "void" ? "Say why this settlement is being voided." : "Say why it is on hold.");
  }

  const out = await transaction(async (conn) => {
    const s = await lockSettlement(conn, id);
    if (s.status === status) throw new UserError(`Already ${SETTLEMENT_STATUS[status].label.toLowerCase()}.`);
    if (!NEXT[s.status]?.includes(status)) {
      throw new UserError(`A ${SETTLEMENT_STATUS[s.status].label.toLowerCase()} settlement cannot be moved to ${SETTLEMENT_STATUS[status].label.toLowerCase()}.`);
    }

    const sets = { status };
    const after = { status };
    let noteLine = "";

    if (status === "paid") {
      const amount = r2(payment.amount);
      if (!(amount > 0)) throw new UserError("Enter the amount paid.");
      if (!PAYMENT_MODE[payment.mode]) throw new UserError("Pick how it was paid.");
      const paidOn = ymdOk(payment.paidOn) ? payment.paidOn : null;
      if (!paidOn) throw new UserError("Enter the date it was paid.");
      Object.assign(sets, { paid_amount: amount, mode: payment.mode, reference: text(payment.reference, 120), paid_on: paidOn });
      Object.assign(after, { paid_amount: amount, mode: payment.mode, reference: text(payment.reference, 120), paid_on: paidOn });
      const net = r2(Number(s.partner_payable) + Number(s.adjustments));
      if (Math.abs(amount - net) > 0.009) noteLine = `Paid ₹${amount} against ₹${net} payable${reason ? `: ${text(reason, 200)}` : ""}`;
    } else if (reason) {
      noteLine = `${SETTLEMENT_STATUS[status].label}: ${text(reason, 250)}`;
    }
    if (noteLine) sets.notes = appendNote(s.notes, noteLine);

    const cols = Object.keys(sets);
    await conn.execute(`UPDATE settlements SET ${cols.map((c) => `${c} = ?`).join(", ")} WHERE id = ?`, [...cols.map((c) => sets[c]), s.id]);

    // Void frees the bookings for the next settlement (see the header).
    if (status === "void") {
      await conn.execute("UPDATE settlement_items SET status = 'void' WHERE settlement_id = ? AND status = 'active'", [s.id]);
    }

    await logActivity({
      conn,
      user,
      action: status === "paid" ? "payment" : "status",
      entity: "settlements",
      entityId: s.id,
      partnerId: s.partner_id,
      summary:
        status === "paid"
          ? `${settlementCode(s.id)} paid ₹${Number(sets.paid_amount).toLocaleString("en-IN")} to ${s.partner_name} by ${PAYMENT_MODE[sets.mode].label}${sets.reference ? ` (${sets.reference})` : ""}`
          : `${settlementCode(s.id)}: ${SETTLEMENT_STATUS[s.status].label} → ${SETTLEMENT_STATUS[status].label}${reason ? ` (${text(reason, 100)})` : ""}`,
      before: { status: s.status, paid_amount: s.paid_amount },
      after: { ...after, ...(reason ? { reason: text(reason, 300) } : {}) },
    });
    return { s, sets };
  });

  const { s, sets } = out;
  if (status === "paid") {
    await notify({
      type: "settlement.paid",
      title: "Settlement paid",
      body: `${settlementCode(s.id)} · ₹${Number(sets.paid_amount).toLocaleString("en-IN")}${sets.reference ? ` · Ref ${sets.reference}` : ""}`,
      link: `/crm/settlements/${s.id}`,
      partnerId: s.partner_id,
      severity: "success",
    });
  } else if (status === "on_hold") {
    await notify({
      type: "settlement.hold",
      title: `Payment ${settlementCode(s.id)} on hold`,
      body: text(reason, 160),
      link: `/crm/settlements/${s.id}`,
      partnerId: s.partner_id,
      severity: "warning",
    });
  } else if (status === "void") {
    await notify({
      type: "settlement.void",
      title: `Statement ${settlementCode(s.id)} withdrawn`,
      body: "Its orders will appear on a corrected statement.",
      link: "/crm/settlements",
      partnerId: s.partner_id,
      severity: "warning",
    });
  }
  return { ok: true };
}
