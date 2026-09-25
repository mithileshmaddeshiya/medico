"use server";

/**
 * Role permission actions. One role per save; the store refuses the owner
 * role, strips anything a partner may never hold, and logs before/after.
 */
import { refresh } from "next/cache";

import { crmAction, run } from "@/lib/crm/guard";
import { ROLE_LABEL } from "@/lib/crm/permissions";
import { saveRolePerms } from "@/lib/crm/stores/system";

export async function saveRoleAction(prev, fd) {
  return run("roles/save", async () => {
    const user = await crmAction("roles.manage");
    const role = String(fd.get("role") ?? "");
    const out = await saveRolePerms(role, fd.getAll("perms").map(String), { user });
    refresh();
    if (!out.changed) return { ok: true, message: "Nothing changed." };
    return { ok: true, message: `${ROLE_LABEL[role] ?? role} saved (${out.added.length} added, ${out.removed.length} removed). It applies on their next click.` };
  });
}

export async function resetRoleAction(prev, fd) {
  return run("roles/reset", async () => {
    const user = await crmAction("roles.manage");
    const role = String(fd.get("role") ?? "");
    await saveRolePerms(role, [], { user, reset: true });
    refresh();
    return { ok: true, message: `${ROLE_LABEL[role] ?? role} is back to the default permissions.` };
  });
}
