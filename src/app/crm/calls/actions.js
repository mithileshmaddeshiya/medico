"use server";

/**
 * Logging a call — from the call log, a lead, or a customer profile. The
 * number is matched to its lead and customer on the server (logCall in
 * src/lib/crm/stores/leads.js).
 */
import { refresh } from "next/cache";

import { leadCode } from "@/lib/crm/constants";
import { crmAction, run } from "@/lib/crm/guard";
import { logCall } from "@/lib/crm/stores/leads";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

export async function logCallAction(prev, fd) {
  return run("calls/log", async () => {
    const user = await crmAction("leads.manage");
    const out = await logCall(
      {
        phone: s(fd, "phone"),
        name: s(fd, "name"),
        direction: s(fd, "direction"),
        outcome: s(fd, "outcome"),
        durationMin: s(fd, "durationMin"),
        notes: s(fd, "notes"),
        calledAt: s(fd, "calledAt"),
        test: s(fd, "test"),
        leadId: s(fd, "leadId") || null,
        customerId: s(fd, "customerId") || null,
        bookingId: s(fd, "bookingId") || null,
        createLead: s(fd, "createLead") === "1",
      },
      { user }
    );
    refresh();
    return {
      ok: true,
      message: out.createdLead
        ? `Call logged and lead ${leadCode(out.createdLead)} created.`
        : out.leadId && !s(fd, "leadId")
          ? `Call logged on lead ${leadCode(out.leadId)}.`
          : "Call logged.",
    };
  });
}
