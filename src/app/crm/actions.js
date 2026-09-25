"use server";

/**
 * CRM-wide actions: sign out, and the signed-in user's own profile.
 */
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

import { query } from "@/lib/db";
import { revokeAllSessions, signOut } from "@/lib/admin/auth";
import { hashPassword, verifyPassword } from "@/lib/admin/password";
import { logActivity } from "@/lib/crm/activity";
import { crmAction, run, UserError } from "@/lib/crm/guard";

export async function crmSignOut() {
  const user = await crmAction().catch(() => null);
  if (user) await logActivity({ user, action: "logout", entity: "admin_users", entityId: user.id, summary: "Signed out" });
  await signOut();
  redirect("/crm/login");
}

export async function updateProfile(prev, formData) {
  return run("profile", async () => {
    const user = await crmAction();
    const name = String(formData.get("name") ?? "").trim().slice(0, 80);
    const phone = String(formData.get("phone") ?? "").replace(/\D/g, "").slice(-10);
    if (!name) throw new UserError("Enter your name.");
    await query("UPDATE admin_users SET name = ?, phone = ? WHERE id = ?", [name, phone, user.id]);
    await logActivity({ user, action: "update", entity: "admin_users", entityId: user.id, summary: "Updated own profile" });
    refresh();
    return { ok: true, message: "Profile saved." };
  });
}

export async function changePassword(prev, formData) {
  return run("password", async () => {
    const user = await crmAction();
    const current = String(formData.get("current") ?? "");
    const next = String(formData.get("next") ?? "");
    const confirm = String(formData.get("confirm") ?? "");
    if (next.length < 10) throw new UserError("Use at least 10 characters.");
    if (next !== confirm) throw new UserError("The two new passwords do not match.");

    const [[row]] = await query("SELECT password_hash FROM admin_users WHERE id = ?", [user.id]);
    if (!row || !(await verifyPassword(current, row.password_hash))) throw new UserError("Your current password is not right.");

    await query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [await hashPassword(next), user.id]);
    // Every other device is signed out; this one gets a fresh sign-in.
    await revokeAllSessions(user.id);
    await logActivity({ user, action: "update", entity: "admin_users", entityId: user.id, summary: "Changed own password" });
    redirect("/crm/login?changed=1");
  });
}
