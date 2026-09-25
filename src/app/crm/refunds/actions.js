"use server";

/**
 * Refund actions: request, approve, reject, mark processed. The rules (how
 * much can be refunded, which step may follow which, recomputing the
 * booking's payment status) live in src/lib/crm/stores/finance.js.
 */
import { refresh } from "next/cache";

import { crmAction, run } from "@/lib/crm/guard";
import { moveRefund, refundLookup, requestRefund } from "@/lib/crm/stores/finance";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

/** For the request dialog: paid / refundable on a booking code. Read-only. */
export async function lookupRefundBooking(code) {
  try {
    await crmAction("refunds.manage");
    const b = await refundLookup(String(code ?? "").slice(0, 20));
    return b ? { ok: true, booking: b } : { ok: false, error: "No booking with that ID." };
  } catch (err) {
    return { ok: false, error: err?.name === "NotAllowed" ? err.message : "Could not look that up." };
  }
}

export async function requestRefundAction(prev, fd) {
  return run("finance/refund-request", async () => {
    const user = await crmAction("refunds.manage");
    await requestRefund(
      { booking: s(fd, "booking"), amount: s(fd, "amount"), mode: s(fd, "mode"), reason: s(fd, "reason"), paymentId: s(fd, "paymentId") },
      { user }
    );
    refresh();
    return { ok: true, message: "Refund requested." };
  });
}

export async function refundStepAction(prev, fd) {
  return run("finance/refund-step", async () => {
    const user = await crmAction("refunds.manage");
    const to = s(fd, "to");
    await moveRefund(s(fd, "id"), to, {
      user,
      reason: s(fd, "reason"),
      reference: s(fd, "reference"),
      mode: s(fd, "mode"),
      processedAt: s(fd, "processedAt"),
    });
    refresh();
    return { ok: true, message: { approved: "Refund approved.", rejected: "Refund rejected.", processed: "Refund marked processed." }[to] ?? "Updated." };
  });
}
