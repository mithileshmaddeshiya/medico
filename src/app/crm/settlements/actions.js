"use server";

/**
 * Settlement actions — generate, adjust, move status, mark paid, void. All
 * need settlements.manage (which a partner can never hold), and all go through
 * src/lib/crm/stores/settlements.js, which locks the row, validates the move
 * and writes the activity row and the partner's notification.
 */
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

import { SETTLEMENT_STATUS, settlementCode } from "@/lib/crm/constants";
import { crmAction, run, UserError } from "@/lib/crm/guard";
import { addAdjustment, generateSettlement, setSettlementStatus } from "@/lib/crm/stores/settlements";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

export async function generateSettlementAction(prev, fd) {
  let id;
  const result = await run("settlements/generate", async () => {
    const user = await crmAction("settlements.manage");
    if (!s(fd, "partnerId")) throw new UserError("Pick a lab partner.");
    ({ id } = await generateSettlement(
      { partnerId: s(fd, "partnerId"), fromDay: s(fd, "from"), toDay: s(fd, "to"), notes: s(fd, "notes") },
      { user }
    ));
    return { ok: true };
  });
  if (result.ok && id) redirect(`/crm/settlements/${id}?created=1`);
  return result;
}

export async function adjustSettlementAction(prev, fd) {
  return run("settlements/adjust", async () => {
    const user = await crmAction("settlements.manage");
    const raw = s(fd, "amount").replace(/[,₹\s]/g, "").replace(/^−/, "-");
    if (!/^[+-]?\d+(\.\d{1,2})?$/.test(raw)) throw new UserError("Enter the amount, e.g. 150 or -150.");
    await addAdjustment(s(fd, "id"), { amount: Number(raw), reason: s(fd, "reason") }, { user });
    refresh();
    return { ok: true, message: "Adjustment added." };
  });
}

export async function settlementStatusAction(prev, fd) {
  return run("settlements/status", async () => {
    const user = await crmAction("settlements.manage");
    const status = s(fd, "status");
    await setSettlementStatus(s(fd, "id"), status, {
      user,
      reason: s(fd, "reason"),
      payment: { amount: s(fd, "amount"), mode: s(fd, "mode"), reference: s(fd, "reference"), paidOn: s(fd, "paidOn") },
    });
    refresh();
    return {
      ok: true,
      message:
        status === "paid"
          ? `${settlementCode(s(fd, "id"))} marked paid. The lab has been notified.`
          : status === "void"
            ? "Voided. Its orders can go on a new settlement."
            : `Moved to ${SETTLEMENT_STATUS[status]?.label ?? status}.`,
    };
  });
}
