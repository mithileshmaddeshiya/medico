/**
 * Sign-in, sessions and "who is this request". Server only.
 *
 * ── HOW THE SESSION WORKS ────────────────────────────────────────────────
 * On a successful sign-in we mint 32 random bytes, put them in an HttpOnly
 * cookie, and store only their SHA-256 in admin_sessions. So the database
 * never holds anything that can be replayed as a login: a leaked dump gives an
 * attacker a hash, and a hash is not a cookie.
 *
 * The row — rather than a self-contained signed token — is what makes "sign
 * this device out" and "sign everybody out" real actions instead of a wait for
 * an expiry. Revoking sets status = 'revoked'; like everywhere else in the
 * panel, nothing is deleted.
 *
 * ── WHAT COUNTS AS SIGNED IN ─────────────────────────────────────────────
 * Every request: the session row is active and unexpired, AND its user is
 * still `active`. Checking the user each time is the point — disabling an
 * account has to take effect on the next click, not whenever their cookie
 * happens to run out.
 */
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";

import { query } from "@/lib/db";

import { hashPassword, needsRehash, verifyPassword } from "./password";

export const SESSION_COOKIE = "mb_admin";

/** Two weeks. Long enough not to be a daily annoyance, short enough to matter. */
const SESSION_DAYS = 14;

const sha256 = (value) => createHash("sha256").update(String(value)).digest("hex");

/* ── Roles ────────────────────────────────────────────────────────────────
   Three, and they are about blast radius rather than job titles:

     owner   everything, including other people's accounts and the SEO
             settings that decide what Google is told about the whole site
     editor  content and day-to-day operations — leads, orders, posts, tests,
             media. Cannot add an admin and cannot rewrite the site's robots
             rules, which are the two things a mistake cannot be undone from
             quickly.
     viewer  read only. For someone who needs the numbers and nothing else.

   `can()` takes the MINIMUM role, so a check reads as "at least an editor". */
const RANK = { viewer: 1, editor: 2, owner: 3 };

/**
 * The roles this panel understands. The CRM adds more (manager, support,
 * collector, accounts, partner — see src/lib/crm/permissions.js); those have
 * no rank here, so `can()` refuses them everything and requireUser() sends
 * them to /crm instead of showing them leads, orders and settings.
 */
export const isAdminRole = (role) => Object.hasOwn(RANK, role);

export const can = (user, minimum = "editor") =>
  Boolean(user) && (RANK[user.role] ?? 0) >= (RANK[minimum] ?? 99);

/* ── Sign in ─────────────────────────────────────────────────────────────── */

const clientIp = (h) =>
  (h.get("x-forwarded-for") ?? "").split(",")[0].trim().slice(0, 45) || null;

/**
 * Check an email and password and, if they match, start a session.
 *
 * Returns `{ ok: true, user }` or `{ ok: false, error }` — one error string
 * for every failure, deliberately. "No such account" and "wrong password" as
 * separate messages hand an attacker a free way to confirm which email
 * addresses are real.
 */
export async function signIn(email, password) {
  const wanted = String(email ?? "").trim().toLowerCase().slice(0, 160);
  const [rows] = await query(
    `SELECT id, email, name, role, status, password_hash
     FROM admin_users WHERE email = ? LIMIT 1`,
    [wanted]
  );

  const user = rows[0];
  const generic = { ok: false, error: "That email and password do not match." };

  /*
   * Verify even when there is no such user, against a throwaway hash.
   *
   * Without it, an unknown email answers in under a millisecond while a known
   * one takes the ~50ms scrypt costs — which is a usable oracle for finding
   * out who has an account here. Doing the work either way removes it.
   */
  if (!user) {
    await verifyPassword(password, await hashPassword("timing-equaliser-not-a-real-password"));
    return generic;
  }

  if (!(await verifyPassword(password, user.password_hash))) return generic;

  // Disabled and deleted accounts get their own message: the credentials were
  // right, so there is nothing left to leak, and "it says my password is wrong"
  // for an account somebody switched off is a support call for no reason.
  if (user.status !== "active") {
    return { ok: false, error: "That account has been disabled. Ask an owner to re-enable it." };
  }

  // Upgrade the stored hash silently if the cost parameters have gone up since
  // it was written. This is the only moment the plaintext is available.
  if (needsRehash(user.password_hash)) {
    await query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [
      await hashPassword(password),
      user.id,
    ]);
  }

  await startSession(user.id);
  await query("UPDATE admin_users SET last_login_at = UTC_TIMESTAMP() WHERE id = ?", [user.id]);

  return {
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}

/** Mint a token, store its hash, set the cookie. */
export async function startSession(userId) {
  const token = randomBytes(32).toString("base64url");
  const h = await headers();

  await query(
    `INSERT INTO admin_sessions (user_id, token_hash, ip, user_agent, expires_at)
     VALUES (?, ?, ?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? DAY))`,
    [userId, sha256(token), clientIp(h), (h.get("user-agent") ?? "").slice(0, 255), SESSION_DAYS]
  );

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true, // JavaScript on the page can never read it, so an XSS cannot steal it
    sameSite: "lax", // a POST from another origin arrives with no cookie — CSRF, closed
    secure: process.env.NODE_ENV === "production", // plain http on localhost still works
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });

  return token;
}

/**
 * The signed-in user for this request, or null.
 *
 * Memoised per request with React's cache so a page, its layout and three
 * server actions do not each run the same query — see the caller in ./guard.js.
 */
export async function currentUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [rows] = await query(
    `SELECT s.id AS session_id, u.id, u.email, u.name, u.role, u.partner_id
     FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
     WHERE s.token_hash = ?
       AND s.status = 'active'
       AND s.expires_at > UTC_TIMESTAMP()
       AND u.status = 'active'
     LIMIT 1`,
    [sha256(token)]
  );

  const user = rows[0];
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    // Set only on a lab partner's account; the CRM scopes every query a
    // partner makes to it (src/lib/crm/guard.js).
    partnerId: user.partner_id ? Number(user.partner_id) : null,
    sessionId: user.session_id,
  };
}

/** Sign out this device: revoke the row, clear the cookie. */
export async function signOut() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (token) {
    await query("UPDATE admin_sessions SET status = 'revoked' WHERE token_hash = ?", [
      sha256(token),
    ]);
  }

  jar.delete(SESSION_COOKIE);
}

/** Sign one user out everywhere — used when a password changes or an account is disabled. */
export const revokeAllSessions = (userId) =>
  query("UPDATE admin_sessions SET status = 'revoked' WHERE user_id = ? AND status = 'active'", [
    userId,
  ]);

/* ── CSRF ─────────────────────────────────────────────────────────────────
   SameSite=Lax already stops a cross-site form POST from carrying the session
   cookie, and Next.js Server Actions refuse a request whose Origin does not
   match the host. This is the third layer, for the plain route handlers that
   accept uploads: a token tied to the session, checked on the way in. */

export const csrfTokenFor = (sessionId) =>
  sha256(`${sessionId}:${process.env.DB_PASS ?? "mb"}:csrf`);

export function csrfOk(token, sessionId) {
  const expected = Buffer.from(csrfTokenFor(sessionId));
  const given = Buffer.from(String(token ?? ""));
  return expected.length === given.length && timingSafeEqual(expected, given);
}
