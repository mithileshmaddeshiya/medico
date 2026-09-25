"use server";

/**
 * Follow-up actions: schedule (from a lead or a customer), done, reschedule,
 * cancel. The store keeps the lead's status in step (new/contacted →
 * follow-up when one is scheduled, back to contacted when the last is done).
 */
import { refresh } from "next/cache";

import { crmAction, run } from "@/lib/crm/guard";
import { cancelFollowUp, completeFollowUp, rescheduleFollowUp, scheduleFollowUp } from "@/lib/crm/stores/leads";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

export async function scheduleFollowUpAction(prev, fd) {
  return run("follow-ups/schedule", async () => {
    const user = await crmAction("leads.manage");
    await scheduleFollowUp(
      {
        leadId: s(fd, "leadId") || null,
        customerId: s(fd, "customerId") || null,
        bookingId: s(fd, "bookingId") || null,
        dueAt: s(fd, "dueAt"),
        assignedUserId: s(fd, "assignedUserId") || null,
        note: s(fd, "note"),
      },
      { user }
    );
    refresh();
    return { ok: true, message: "Follow-up scheduled." };
  });
}

export async function completeFollowUpAction(prev, fd) {
  return run("follow-ups/done", async () => {
    const user = await crmAction("leads.manage");
    const call = s(fd, "logCall") === "1" ? { outcome: s(fd, "outcome"), durationMin: s(fd, "durationMin") } : null;
    await completeFollowUp(s(fd, "id"), { user, note: s(fd, "note"), call });
    refresh();
    return { ok: true, message: call ? "Done, and the call is logged." : "Marked done." };
  });
}

export async function rescheduleFollowUpAction(prev, fd) {
  return run("follow-ups/reschedule", async () => {
    const user = await crmAction("leads.manage");
    await rescheduleFollowUp(s(fd, "id"), s(fd, "dueAt"), { user });
    refresh();
    return { ok: true, message: "Rescheduled." };
  });
}

export async function cancelFollowUpAction(prev, fd) {
  return run("follow-ups/cancel", async () => {
    const user = await crmAction("leads.manage");
    await cancelFollowUp(s(fd, "id"), { user, reason: s(fd, "reason") });
    refresh();
    return { ok: true, message: "Follow-up cancelled." };
  });
}
