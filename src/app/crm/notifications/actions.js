"use server";

import { refresh } from "next/cache";

import { markAllRead, markRead } from "@/lib/crm/activity";
import { crmAction, run } from "@/lib/crm/guard";

export async function markReadAction(prev, fd) {
  return run("notifications/read", async () => {
    const user = await crmAction();
    await markRead(user, fd.get("id"));
    refresh();
    return { ok: true };
  });
}

export async function markAllReadAction() {
  return run("notifications/read-all", async () => {
    const user = await crmAction();
    await markAllRead(user);
    refresh();
    return { ok: true, message: "All caught up." };
  });
}
