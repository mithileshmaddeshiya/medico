"use server";

/**
 * The sign-in action.
 *
 * ── RATE LIMITING ────────────────────────────────────────────────────────
 * Five failures from one IP in fifteen minutes and that IP is refused for a
 * while, counted from admin_audit rather than from memory. In-process counters
 * are useless here for two reasons: a serverless deployment may answer the
 * next attempt from a different instance with an empty counter, and a restart
 * clears the count entirely. The audit table is shared and durable, which is
 * what a limiter needs to be, and the rows are worth having anyway — a burst
 * of failures against one address is exactly what you want a record of.
 *
 * It is a speed bump, not a defence. The defence is scrypt on the password
 * (src/lib/admin/password.js), which makes each guess cost real CPU whether or
 * not the request is throttled.
 */
import { redirect } from "next/navigation";

import { audit } from "@/lib/admin/audit";
import { signIn } from "@/lib/admin/auth";
import { safeNext } from "@/lib/admin/guard";
import { query } from "@/lib/db";

const WINDOW_MINUTES = 15;
const MAX_FAILURES = 5;

async function tooManyAttempts(ip) {
  if (!ip) return false;

  const [rows] = await query(
    `SELECT COUNT(*) AS n FROM admin_audit
     WHERE action = 'login_failed' AND ip = ?
       AND created_at > DATE_SUB(UTC_TIMESTAMP(), INTERVAL ? MINUTE)`,
    [ip, WINDOW_MINUTES]
  );

  return Number(rows[0]?.n ?? 0) >= MAX_FAILURES;
}

export async function loginAction(previous, formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Enter your email and password." };
  }

  const { headers } = await import("next/headers");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  try {
    if (await tooManyAttempts(ip)) {
      return {
        ok: false,
        error: `Too many failed attempts. Wait ${WINDOW_MINUTES} minutes, or ask an owner to reset your password.`,
      };
    }

    const result = await signIn(email, password);

    if (!result.ok) {
      // The email is recorded because "somebody tried this address forty times"
      // is the useful half of the record. The password never is, anywhere.
      await audit({
        action: "login_failed",
        entity: "admin_users",
        entityId: email.slice(0, 120),
        summary: "wrong email or password",
      });
      return result;
    }

    await audit({
      user: result.user,
      action: "login",
      entity: "admin_users",
      entityId: result.user.id,
      summary: "signed in",
    });
  } catch (err) {
    console.error("[admin] sign-in failed", err);
    return {
      ok: false,
      error:
        "Could not reach the database. Check DB_HOST / DB_USER / DB_NAME, and that this IP is allowed in Remote MySQL.",
    };
  }

  // Only ever to a path inside the panel or the lab report tool — see
  // safeNext() for why an unvalidated `next` here is an open redirect.
  redirect(safeNext(next));
}
