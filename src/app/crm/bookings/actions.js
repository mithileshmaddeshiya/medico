"use server";

/**
 * Booking actions. Each one: check the permission (crmAction), apply the
 * user's scope (a partner or collector can only act on their own records —
 * enforced again inside the store's locked read), call the store, refresh.
 *
 * Every action returns { ok, message } or { ok: false, error } through run();
 * no raw error reaches the screen.
 */
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

import { crmAction, has, run, scopeOf, UserError } from "@/lib/crm/guard";
import {
  addNote,
  archiveBooking,
  assignCollector,
  assignPartner,
  createBooking,
  labProgress,
  partnerRespond,
  recordPayment,
  setBookingStatus,
  setPaymentStatus,
  updateBooking,
  updateCollection,
} from "@/lib/crm/stores/bookings";
import { rejectReport, sendReport, verifyReport } from "@/lib/crm/stores/reports";
import { BOOKING_STATUS, bookingCode } from "@/lib/crm/constants";
import { query } from "@/lib/db";
import { logActivity } from "@/lib/crm/activity";
// A datetime-local value is IST wall-clock time; the DB stores UTC.
import { istLocalToUtc } from "@/lib/crm/stores/finance";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

/** The booking form posts its lines as JSON in one hidden field. */
function readItems(fd) {
  try {
    const items = JSON.parse(s(fd, "items") || "[]");
    return Array.isArray(items) ? items.slice(0, 40) : [];
  } catch {
    return [];
  }
}

function readBookingForm(fd) {
  return {
    name: s(fd, "name"),
    phone: s(fd, "phone"),
    altPhone: s(fd, "altPhone"),
    email: s(fd, "email"),
    age: s(fd, "age"),
    gender: s(fd, "gender"),
    address: s(fd, "address"),
    cityId: s(fd, "cityId") || null,
    area: s(fd, "area"),
    landmark: s(fd, "landmark"),
    items: readItems(fd),
    discount: s(fd, "discount"),
    collectionFee: s(fd, "collectionFee"),
    source: s(fd, "source"),
    collectionDate: s(fd, "collectionDate"),
    collectionSlot: s(fd, "collectionSlot"),
    paymentMode: s(fd, "paymentMode"),
    notes: s(fd, "notes"),
    partnerNotes: s(fd, "partnerNotes"),
  };
}

export async function createBookingAction(prev, fd) {
  let id;
  const result = await run("bookings/create", async () => {
    const user = await crmAction("bookings.manage");
    const input = readBookingForm(fd);
    if (has(user, "bookings.assign")) {
      input.collectorId = s(fd, "collectorId") || null;
      input.partnerId = s(fd, "partnerId") || null;
    }
    input.leadId = s(fd, "leadId") || null;
    const paid = Number(s(fd, "paidNow"));
    if (paid > 0) input.payment = { amount: paid, mode: s(fd, "paidMode") || input.paymentMode || "cash", reference: s(fd, "paidRef") };
    ({ id } = await createBooking(input, { user }));
    return { ok: true };
  });
  if (result.ok && id) redirect(`/crm/bookings/${id}?created=1`);
  return result;
}

export async function updateBookingAction(prev, fd) {
  const id = s(fd, "id");
  const result = await run("bookings/update", async () => {
    const user = await crmAction("bookings.manage");
    const input = readBookingForm(fd);
    if (s(fd, "itemsTouched") !== "1") delete input.items;
    await updateBooking(id, input, { user });
    return { ok: true };
  });
  if (result.ok) redirect(`/crm/bookings/${id}?saved=1`);
  return result;
}

export async function statusAction(prev, fd) {
  return run("bookings/status", async () => {
    const user = await crmAction("bookings.manage");
    const status = s(fd, "status");
    await setBookingStatus(s(fd, "id"), status, { user, reason: s(fd, "reason") });
    refresh();
    return { ok: true, message: `Moved to ${BOOKING_STATUS[status]?.label ?? status}.` };
  });
}

export async function assignCollectorAction(prev, fd) {
  return run("bookings/collector", async () => {
    const user = await crmAction("bookings.assign");
    await assignCollector(
      s(fd, "id"),
      { collectorId: s(fd, "collectorId") || null, date: s(fd, "collectionDate") || undefined, slot: s(fd, "collectionSlot") || undefined },
      { user }
    );
    refresh();
    return { ok: true, message: s(fd, "collectorId") ? "Collector assigned." : "Collector removed." };
  });
}

export async function assignPartnerAction(prev, fd) {
  return run("bookings/partner", async () => {
    const user = await crmAction("bookings.assign");
    await assignPartner(s(fd, "id"), { partnerId: s(fd, "partnerId") || null }, { user });
    refresh();
    return { ok: true, message: s(fd, "partnerId") ? "Sent to the lab. They will be asked to accept." : "Lab removed." };
  });
}

/** Partner portal: accept / reject. */
export async function partnerRespondAction(prev, fd) {
  return run("bookings/respond", async () => {
    const user = await crmAction();
    if (!user.isPartner) throw new UserError("Only the lab can accept or reject its order.");
    const accept = s(fd, "decision") === "accept";
    await partnerRespond(s(fd, "id"), { accept, reason: s(fd, "reason") }, { user, scope: scopeOf(user) });
    refresh();
    return { ok: true, message: accept ? "Order accepted." : "Order rejected. MedicoBharat has been told." };
  });
}

/** Lab progress: sample received / processing — the lab, or staff on its behalf. */
export async function labProgressAction(prev, fd) {
  return run("bookings/lab", async () => {
    const user = await crmAction(["bookings.manage", "reports.manage"]);
    const stage = s(fd, "stage");
    await labProgress(s(fd, "id"), stage, { user, scope: scopeOf(user), note: s(fd, "note") });
    refresh();
    return { ok: true, message: stage === "sample_received" ? "Sample marked received." : "Marked processing." };
  });
}

/** Collector buttons. */
export async function collectionAction(prev, fd) {
  return run("bookings/collection", async () => {
    const user = await crmAction("collections.manage");
    const status = s(fd, "status");
    await updateCollection(s(fd, "id"), status, { user, scope: scopeOf(user), note: s(fd, "note") || s(fd, "reason") });
    refresh();
    const labels = { confirmed: "Confirmed with the customer.", on_the_way: "Marked on the way.", arrived: "Marked arrived.", collected: "Sample collected.", failed: "Marked failed." };
    return { ok: true, message: labels[status] ?? "Updated." };
  });
}

export async function paymentAction(prev, fd) {
  return run("bookings/payment", async () => {
    const user = await crmAction("payments.manage");
    await recordPayment(
      s(fd, "id"),
      { amount: s(fd, "amount"), mode: s(fd, "mode"), reference: s(fd, "reference"), notes: s(fd, "notes"), status: s(fd, "status") || "paid", receivedAt: istLocalToUtc(s(fd, "receivedAt")) },
      { user, scope: scopeOf(user) }
    );
    refresh();
    return { ok: true, message: "Payment recorded." };
  });
}

export async function paymentStatusAction(prev, fd) {
  return run("bookings/payment-status", async () => {
    const user = await crmAction("payments.manage");
    await setPaymentStatus(s(fd, "paymentId"), s(fd, "status"), { user, reason: s(fd, "reason") });
    refresh();
    return { ok: true, message: "Payment updated." };
  });
}

export async function noteAction(prev, fd) {
  return run("bookings/note", async () => {
    const user = await crmAction(["bookings.manage", "collections.manage"]);
    await addNote("booking", s(fd, "id"), s(fd, "body"), { user, scope: scopeOf(user) });
    refresh();
    return { ok: true, message: "Note added." };
  });
}

/** The partner's remarks on an order (what the lab wants MedicoBharat to know). */
export async function partnerRemarkAction(prev, fd) {
  return run("bookings/remark", async () => {
    const user = await crmAction();
    if (!user.isPartner) throw new UserError("Only the lab adds lab remarks.");
    const body = s(fd, "body").slice(0, 500);
    if (!body) throw new UserError("The remark is empty.");
    const [res] = await query(
      "UPDATE bookings SET partner_notes = LEFT(TRIM(CONCAT(partner_notes, '\n', ?)), 1000) WHERE id = ? AND partner_id = ?",
      [body, Number(s(fd, "id")) || 0, user.partnerId]
    );
    if (!res.affectedRows) throw new UserError("That order is not assigned to you.");
    await logActivity({ user, action: "note", entity: "bookings", entityId: s(fd, "id"), partnerId: user.partnerId, summary: `Lab remark on ${bookingCode(s(fd, "id"))}: ${body.slice(0, 120)}` });
    refresh();
    return { ok: true, message: "Remark added." };
  });
}

export async function verifyReportAction(prev, fd) {
  return run("reports/verify", async () => {
    const user = await crmAction("reports.verify");
    await verifyReport(s(fd, "reportId"), { user });
    refresh();
    return { ok: true, message: "Report verified." };
  });
}

export async function rejectReportAction(prev, fd) {
  return run("reports/reject", async () => {
    const user = await crmAction("reports.verify");
    await rejectReport(s(fd, "reportId"), { user, reason: s(fd, "reason") });
    refresh();
    return { ok: true, message: "Sent back to the lab." };
  });
}

export async function sendReportAction(prev, fd) {
  return run("reports/send", async () => {
    const user = await crmAction("reports.verify");
    await sendReport(s(fd, "reportId"), { user, via: s(fd, "via") });
    refresh();
    return { ok: true, message: "Marked delivered to the patient." };
  });
}

export async function archiveBookingAction(prev, fd) {
  const restore = s(fd, "restore") === "1";
  const result = await run("bookings/archive", async () => {
    const user = await crmAction("bookings.manage");
    if (user.role !== "owner") throw new UserError("Only the owner can delete a booking.");
    await archiveBooking(s(fd, "id"), { user, restore });
    return { ok: true };
  });
  if (result.ok && !restore) redirect("/crm/bookings?deleted=1");
  if (result.ok) refresh();
  return result.ok ? { ok: true, message: "Restored." } : result;
}

/**
 * Bulk actions from the bookings table: the selected ids arrive as "ids".
 * Each booking goes through the same store function as a single change, so
 * each gets its own activity row and its own validation — one that cannot
 * move is reported, the rest still move.
 */
export async function bulkAction(prev, fd) {
  return run("bookings/bulk", async () => {
    const ids = fd.getAll("ids").map(String).filter(Boolean).slice(0, 100);
    if (!ids.length) throw new UserError("Select at least one booking.");
    const op = s(fd, "op");

    let user;
    if (op === "partner" || op === "collector") user = await crmAction("bookings.assign");
    else user = await crmAction("bookings.manage");

    let done = 0;
    const failed = [];
    for (const id of ids) {
      try {
        if (op === "status") await setBookingStatus(id, s(fd, "status"), { user, reason: s(fd, "reason") });
        else if (op === "partner") await assignPartner(id, { partnerId: s(fd, "partnerId") || null }, { user });
        else if (op === "collector") await assignCollector(id, { collectorId: s(fd, "collectorId") || null }, { user });
        else throw new UserError("Pick an action.");
        done += 1;
      } catch (err) {
        failed.push(`${bookingCode(id)}: ${err?.userMessage ?? "failed"}`);
      }
    }
    refresh();
    if (failed.length && !done) return { ok: false, error: failed.slice(0, 3).join(" · ") };
    return { ok: true, message: `${done} updated${failed.length ? `, ${failed.length} skipped (${failed.slice(0, 2).join(" · ")})` : ""}.` };
  });
}
