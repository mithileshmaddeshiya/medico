"use server";

import { refresh } from "next/cache";

import { crmAction, run } from "@/lib/crm/guard";
import { SLA_FIELDS, saveSlaSettings } from "@/lib/crm/stores/system";

/** Save the SLA timings (settings table, keys crm.sla.*). */
export async function saveSlaAction(prev, fd) {
  return run("settings/sla", async () => {
    const user = await crmAction("settings.manage");
    const input = Object.fromEntries(SLA_FIELDS.map((f) => [f.key, String(fd.get(f.key) ?? "")]));
    const changed = await saveSlaSettings(input, { user });
    refresh();
    return { ok: true, message: changed ? "SLA timings saved. Alerts use them from now on." : "Nothing changed." };
  });
}
