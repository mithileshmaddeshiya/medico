"use server";

/**
 * Record payment from the Finance screen. The money is written by the same
 * store function the booking page uses (recordPayment), so the booking's
 * payment status, the activity row and the notification all follow — this
 * action only adds the IST → UTC conversion of "received at" and sends the
 * user to the booking afterwards.
 */
import { redirect } from "next/navigation";

import { crmAction, run, scopeOf } from "@/lib/crm/guard";
import { recordPayment } from "@/lib/crm/stores/bookings";
import { istLocalToUtc } from "@/lib/crm/stores/finance";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

export async function recordPaymentAction(prev, fd) {
  const bookingId = Number(s(fd, "bookingId")) || 0;
  const result = await run("finance/payment", async () => {
    const user = await crmAction("payments.manage");
    await recordPayment(
      bookingId,
      {
        amount: s(fd, "amount"),
        mode: s(fd, "mode"),
        status: s(fd, "status") || "paid",
        reference: s(fd, "reference"),
        notes: s(fd, "notes"),
        receivedAt: istLocalToUtc(s(fd, "receivedAt")),
      },
      { user, scope: scopeOf(user) }
    );
    return { ok: true };
  });
  if (result.ok) redirect(`/crm/bookings/${bookingId}?paid=1`);
  return result;
}
