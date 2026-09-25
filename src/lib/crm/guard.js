/**
 * The door into the CRM. Server only.
 *
 * Same rule as the admin panel (src/lib/admin/guard.js): every page calls
 * requirePerm() and every server action / route handler calls crmAction() or
 * apiUser(). A layout's check does not run for a Server Action, so nothing is
 * inherited.
 *
 * The CRM user is the admin session user plus:
 *   perms      the effective permission set (defaults + owner overrides)
 *   partnerId  set for a lab partner; every store function that lists or
 *              reads records takes `scope` from scopeOf(user) and filters on it
 *   isPartner  shorthand
 */
import { cache } from "react";
import { redirect } from "next/navigation";

import { query } from "@/lib/db";
import { getUser } from "@/lib/admin/guard";
import { NotAllowed } from "@/lib/admin/guard";

import { permsFor } from "./permissions";

export { NotAllowed };

/** Owner overrides of the default permission sets, read once per request. */
const roleOverrides = cache(async () => {
  try {
    const [rows] = await query("SELECT role, perms_json FROM crm_role_permissions");
    return Object.fromEntries(
      rows.map((r) => [r.role, typeof r.perms_json === "string" ? JSON.parse(r.perms_json) : r.perms_json])
    );
  } catch (err) {
    console.error("[crm] could not read role permissions — using defaults", err);
    return {};
  }
});

export const getCrmUser = cache(async () => {
  const user = await getUser();
  if (!user) return null;

  const perms = permsFor(user.role, await roleOverrides());
  const isPartner = user.role === "partner";

  // A partner account that is not linked to a partner sees nothing at all,
  // rather than falling through to an unscoped query.
  return {
    ...user,
    perms: [...perms],
    isPartner,
    partnerId: isPartner ? user.partnerId ?? -1 : null,
  };
});

export const has = (user, perm) =>
  Boolean(user) && (user.role === "owner" || user.perms.includes(perm));

/**
 * The filter every store function applies. `{ partnerId }` for a partner,
 * `{ collectorId }` for a collector (they see their own collections only),
 * `{}` for everyone else.
 */
export function scopeOf(user) {
  if (!user) return { none: true };
  if (user.isPartner) return { partnerId: user.partnerId };
  if (user.role === "collector") return { collectorId: user.id };
  return {};
}

/** Pages: signed in with `perm` (any of, if an array), or redirect. */
export async function requirePerm(perm, next = "/crm") {
  const user = await getCrmUser();
  if (!user) redirect(`/crm/login?next=${encodeURIComponent(next)}`);
  const wanted = Array.isArray(perm) ? perm : perm ? [perm] : [];
  if (wanted.length && !wanted.some((p) => has(user, p))) redirect("/crm/denied");
  return user;
}

/** Server actions: the same check, thrown as NotAllowed for the action wrapper. */
export async function crmAction(perm) {
  const user = await getCrmUser();
  if (!user) throw new NotAllowed("Your session has expired. Sign in again.");
  const wanted = Array.isArray(perm) ? perm : perm ? [perm] : [];
  if (wanted.length && !wanted.some((p) => has(user, p))) {
    throw new NotAllowed("Your role does not allow this.");
  }
  return user;
}

/**
 * Route handlers: the user or a JSON error Response. Usage:
 *   const auth = await apiUser("bookings.view");
 *   if (auth instanceof Response) return auth;
 */
export async function apiUser(perm) {
  const user = await getCrmUser();
  if (!user) return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  const wanted = Array.isArray(perm) ? perm : perm ? [perm] : [];
  if (wanted.length && !wanted.some((p) => has(user, p))) {
    return Response.json({ ok: false, error: "Not allowed." }, { status: 403 });
  }
  return user;
}

/**
 * Wraps a server action body: returns `{ ok, message?, error? }`, never a raw
 * error. Next's own control-flow throws (redirect, notFound) pass through.
 */
export async function run(label, fn) {
  try {
    return (await fn()) ?? { ok: true };
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    if (err?.digest?.startsWith?.("NEXT_")) throw err;
    if (err?.userMessage) return { ok: false, error: err.userMessage };
    console.error(`[crm/${label}] action failed`, err);
    return { ok: false, error: "That did not save. Please try again." };
  }
}

/** An error whose message is safe to show the user. */
export class UserError extends Error {
  constructor(message) {
    super(message);
    this.userMessage = message;
  }
}
