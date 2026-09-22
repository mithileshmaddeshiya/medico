"use server";

import { revalidatePath } from "next/cache";

import { audit } from "@/lib/admin/audit";
import { revokeAllSessions } from "@/lib/admin/auth";
import { actionUser, NotAllowed } from "@/lib/admin/guard";
import { hashPassword, passwordProblem } from "@/lib/admin/password";
import { query } from "@/lib/db";

/**
 * Account management. Owner only, every action.
 *
 * ── CHANGING A PASSWORD SIGNS THAT PERSON OUT EVERYWHERE ─────────────────
 * That is the point of changing it. If the reason is "their laptop was
 * stolen", a new password that leaves the old session alive has done nothing —
 * the thief's cookie still works. revokeAllSessions() is therefore not
 * optional and not a checkbox.
 *
 * The same applies to disabling an account, and there the session check in
 * currentUser() does the other half: it re-reads the user's status on every
 * request, so a disabled account stops working on the next click rather than
 * whenever its cookie happens to expire.
 */
const form = (a, b) => (b instanceof FormData ? b : a);

async function wrap(fn) {
  try {
    return (await fn()) ?? { ok: true };
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    if (err?.digest?.startsWith?.("NEXT_")) throw err;
    if (err?.code === "ER_DUP_ENTRY") {
      return { ok: false, error: "There is already an account with that email." };
    }
    console.error("[admin/users] action failed", err);
    return { ok: false, error: "That did not save." };
  }
}

export async function createUserAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("owner");

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "editor");
    const password = String(formData.get("password") ?? "");

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return { ok: false, error: "That does not look like an email address." };
    }
    if (!["owner", "editor", "viewer"].includes(role)) {
      return { ok: false, error: "Unknown role." };
    }

    const problem = passwordProblem(password);
    if (problem) return { ok: false, error: problem };

    const [result] = await query(
      `INSERT INTO admin_users (email, name, password_hash, role) VALUES (?, ?, ?, ?)`,
      [email.slice(0, 160), name.slice(0, 80), await hashPassword(password), role]
    );

    await audit({
      user,
      action: "create",
      entity: "admin_users",
      entityId: result.insertId,
      summary: `added ${email} as ${role}`,
      after: { email, name, role },
    });

    revalidatePath("/admin/users");
    return { ok: true, message: `${email} can sign in now. Tell them the password in person, not by email.` };
  });
}

export async function setPasswordAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("owner");
    const id = Number(formData.get("id")) || 0;
    const password = String(formData.get("password") ?? "");

    const problem = passwordProblem(password);
    if (problem) return { ok: false, error: problem };

    const [rows] = await query("SELECT email FROM admin_users WHERE id = ?", [id]);
    if (!rows[0]) return { ok: false, error: "No such account." };

    await query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [
      await hashPassword(password),
      id,
    ]);

    // Every existing sign-in for that person, gone. See the header.
    await revokeAllSessions(id);

    await audit({
      user,
      action: "update",
      entity: "admin_users",
      entityId: id,
      summary: `password reset for ${rows[0].email}; all their sessions revoked`,
    });

    revalidatePath("/admin/users");
    return {
      ok: true,
      message: "Password changed, and they have been signed out on every device.",
    };
  });
}

export async function setRoleAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("owner");
    const id = Number(formData.get("id")) || 0;
    const role = String(formData.get("role") ?? "");

    if (!["owner", "editor", "viewer"].includes(role)) return { ok: false, error: "Unknown role." };

    // Demoting yourself out of owner locks the owner-only screens against you,
    // and if you are the only owner it locks everybody out permanently.
    if (Number(id) === Number(user.id) && role !== "owner") {
      return { ok: false, error: "You cannot take the owner role away from yourself." };
    }

    const [rows] = await query("SELECT email, role FROM admin_users WHERE id = ?", [id]);
    if (!rows[0]) return { ok: false, error: "No such account." };

    await query("UPDATE admin_users SET role = ? WHERE id = ?", [role, id]);

    await audit({
      user,
      action: "update",
      entity: "admin_users",
      entityId: id,
      summary: `${rows[0].email}: ${rows[0].role} → ${role}`,
      before: { role: rows[0].role },
      after: { role },
    });

    revalidatePath("/admin/users");
    return { ok: true, message: "Role updated." };
  });
}

export async function setUserStatusAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("owner");
    const id = Number(formData.get("id")) || 0;
    const status = String(formData.get("status") ?? "");

    if (!["active", "disabled"].includes(status)) return { ok: false, error: "Unknown status." };
    if (Number(id) === Number(user.id) && status !== "active") {
      return { ok: false, error: "You cannot disable the account you are signed in with." };
    }

    const [rows] = await query("SELECT email FROM admin_users WHERE id = ?", [id]);
    if (!rows[0]) return { ok: false, error: "No such account." };

    await query("UPDATE admin_users SET status = ?, deleted_at = NULL WHERE id = ?", [status, id]);
    if (status !== "active") await revokeAllSessions(id);

    await audit({
      user,
      action: status === "active" ? "restore" : "archive",
      entity: "admin_users",
      entityId: id,
      summary: `${rows[0].email} ${status === "active" ? "re-enabled" : "disabled and signed out"}`,
    });

    revalidatePath("/admin/users");
    return {
      ok: true,
      message:
        status === "active"
          ? "They can sign in again."
          : "Disabled. Any session they had is dead on their next click.",
    };
  });
}

/** Sign one person out of every device without touching their password. */
export async function revokeSessionsAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("owner");
    const id = Number(formData.get("id")) || 0;

    await revokeAllSessions(id);
    await audit({
      user,
      action: "update",
      entity: "admin_users",
      entityId: id,
      summary: "all sessions revoked",
    });

    revalidatePath("/admin/users");
    return { ok: true, message: "Signed out everywhere." };
  });
}
