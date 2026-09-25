/**
 * GET    /api/crm/v1/bookings/:id — one booking with items, reports, payments
 *        (scoped; a partner gets the partner view).
 * PATCH  /api/crm/v1/bookings/:id — any of, applied in this order:
 *          { fields: { name, phone, address, … } }            bookings.manage
 *          { collectorId, collectionDate?, slot? }             bookings.assign
 *          { partnerId }                                       bookings.assign
 *          { partnerDecision: "accept"|"reject", reason }      the lab itself
 *          { labStage: "sample_received"|"processing", note }  the lab, or staff
 *          { status, reason }                                  bookings.manage
 * DELETE /api/crm/v1/bookings/:id — soft delete, owner only, reversible.
 */
import { endpoint, notFound } from "@/lib/crm/api";
import { has, UserError } from "@/lib/crm/guard";
import {
  archiveBooking,
  assignCollector,
  assignPartner,
  getBooking,
  labProgress,
  partnerRespond,
  setBookingStatus,
  updateBooking,
} from "@/lib/crm/stores/bookings";

export const dynamic = "force-dynamic";

export const GET = endpoint(["bookings.view", "collections.view"], async ({ scope, params }) => {
  return (await getBooking(params.id, scope)) ?? notFound();
});

export const PATCH = endpoint(null, async ({ user, scope, params, body }) => {
  const id = params.id;
  if (!(await getBooking(id, scope))) return notFound();
  const need = (perm) => {
    if (!has(user, perm)) throw new UserError(`Your role cannot do that (${perm}).`);
  };

  if (body.fields) {
    need("bookings.manage");
    await updateBooking(id, body.fields, { user });
  }
  if ("collectorId" in body) {
    need("bookings.assign");
    await assignCollector(id, { collectorId: body.collectorId, date: body.collectionDate, slot: body.slot }, { user });
  }
  if ("partnerId" in body) {
    need("bookings.assign");
    await assignPartner(id, { partnerId: body.partnerId }, { user });
  }
  if (body.partnerDecision) {
    if (!user.isPartner) throw new UserError("Only the lab answers its own order.");
    await partnerRespond(id, { accept: body.partnerDecision === "accept", reason: body.reason }, { user, scope });
  }
  if (body.labStage) {
    if (!user.isPartner) need("bookings.manage");
    await labProgress(id, body.labStage, { user, scope, note: body.note ?? "" });
  }
  if (body.status) {
    need("bookings.manage");
    await setBookingStatus(id, body.status, { user, reason: body.reason ?? "" });
  }
  return getBooking(id, scope);
});

export const DELETE = endpoint("bookings.manage", async ({ user, params }) => {
  if (user.role !== "owner") throw new UserError("Only the owner can delete a booking.");
  await archiveBooking(params.id, { user });
  return { id: Number(params.id), deleted: true };
});
