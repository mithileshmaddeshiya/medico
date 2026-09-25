"use server";

/**
 * Account actions. The rules (own role, owners, last owner, sessions) live
 * in src/lib/crm/stores/system.js so no screen can skip them.
 */
import { refresh } from "next/cache";

import { crmAction, run } from "@/lib/crm/guard";
import { createUser, resetUserPassword, updateUser } from "@/lib/crm/stores/system";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

export async function createUserAction(prev, fd) {
  return run("users/create", async () => {
    const user = await crmAction("users.manage");
    await createUser(
      {
        name: s(fd, "name"),
        email: s(fd, "email"),
        phone: s(fd, "phone"),
        role: s(fd, "role"),
        partnerId: s(fd, "partnerId"),
        password: String(fd.get("password") ?? ""),
      },
      { user }
    );
    refresh();
    return { ok: true, message: "Account created. Give them the password in person or by phone, not by email." };
  });
}

export async function updateUserAction(prev, fd) {
  return run("users/update", async () => {
    const user = await crmAction("users.manage");
    const input = { name: s(fd, "name"), phone: s(fd, "phone"), partnerId: s(fd, "partnerId") };
    if (fd.has("role")) input.role = s(fd, "role");
    if (fd.has("status")) input.status = s(fd, "status");
    const out = await updateUser(s(fd, "id"), input, { user });
    refresh();
    if (!out.changed) return { ok: true, message: "Nothing changed." };
    return { ok: true, message: out.revoked ? "Saved. They have been signed out everywhere." : "Saved." };
  });
}

/** Enable / disable in one tap (disabling signs them out everywhere). */
export async function userStatusAction(prev, fd) {
  return run("users/status", async () => {
    const user = await crmAction("users.manage");
    const status = s(fd, "status");
    await updateUser(s(fd, "id"), { status }, { user });
    refresh();
    return { ok: true, message: status === "active" ? "They can sign in again." : "Disabled and signed out everywhere." };
  });
}

export async function resetPasswordAction(prev, fd) {
  return run("users/password", async () => {
    const user = await crmAction("users.manage");
    const password = String(fd.get("password") ?? "");
    if (password !== String(fd.get("confirm") ?? "")) return { ok: false, error: "The two passwords do not match." };
    await resetUserPassword(s(fd, "id"), password, { user });
    refresh();
    return { ok: true, message: "Temporary password set. They have been signed out everywhere." };
  });
}
