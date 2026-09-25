/**
 * GET  /api/crm/v1/bookings — the booking list; same filters as /crm/bookings
 *      (?q, tab, status, range, from, to, city, test, partner, collector,
 *      payment, source, report, sort, page, limit ≤ 100). Scoped: partners
 *      get their own orders without customer contact or price fields.
 * POST /api/crm/v1/bookings — create an offline booking (bookings.manage).
 *      Body: { name, phone, age?, gender?, address?, cityId?, area?, landmark?,
 *      items: [{ testId, qty?, price? } | { name, price }], discount?,
 *      collectionFee?, source?, collectionDate?, collectionSlot?, paymentMode?,
 *      notes?, collectorId?, partnerId?, leadId?, payment?: { amount, mode, reference } }
 */
import { endpoint } from "@/lib/crm/api";
import { bookingFiltersFrom, pageOf } from "@/lib/crm/filters";
import { has } from "@/lib/crm/guard";
import { createBooking, getBooking, listBookings } from "@/lib/crm/stores/bookings";

export const dynamic = "force-dynamic";

export const GET = endpoint(["bookings.view", "collections.view"], async ({ scope, query }) => {
  const { limit, offset } = pageOf(query, Math.min(100, Number(query.limit) || 25));
  const list = await listBookings({ ...bookingFiltersFrom(query), limit, offset }, scope);
  return { data: list.rows, meta: { total: list.total, limit, offset } };
});

export const POST = endpoint(
  "bookings.manage",
  async ({ user, body }) => {
    const input = { ...body };
    if (!has(user, "bookings.assign")) {
      delete input.collectorId;
      delete input.partnerId;
    }
    if (input.payment && !has(user, "payments.manage")) delete input.payment;
    const { id } = await createBooking(input, { user });
    return getBooking(id);
  },
  { status: 201 }
);
