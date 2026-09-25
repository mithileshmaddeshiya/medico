/**
 * POST /api/crm/v1/bookings/:id/payments — record money against a booking.
 * Body: { amount, mode: cash|upi|online|card|bank_transfer|other,
 *         status?: paid|pending|failed, reference?, notes?, receivedAt? }
 * Collectors may record for their own collections (scoped).
 */
import { endpoint } from "@/lib/crm/api";
import { getBooking, recordPayment } from "@/lib/crm/stores/bookings";

export const dynamic = "force-dynamic";

export const POST = endpoint(
  "payments.manage",
  async ({ user, scope, params, body }) => {
    const { paymentId } = await recordPayment(params.id, body, { user, scope });
    const booking = await getBooking(params.id, scope);
    return { paymentId, payment_status: booking?.payment_status, paid_amount: booking?.paid_amount };
  },
  { status: 201 }
);
