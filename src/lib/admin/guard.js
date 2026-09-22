/**
 * The one door into the admin panel. Server only.
 *
 * Every admin page and every server action starts with `requireUser()` or
 * `requireRole()`. There is no "the layout already checked it" — a Server
 * Action is its own HTTP endpoint that anyone can POST to directly, and a
 * layout's check does not run for it. Treating each action as unauthenticated
 * until it says otherwise is the only version of this that is actually closed.
 *
 * `cache` from React makes the lookup once per request no matter how many
 * callers ask.
 */
import { cache } from "react";
import { redirect } from "next/navigation";

import { can, currentUser } from "./auth";

/** The signed-in user, looked up at most once per request. */
export const getUser = cache(currentUser);

/**
 * The signed-in user, or a redirect to the sign-in page.
 *
 * `next` carries where they were headed so the form can send them back there
 * instead of dumping everyone on the dashboard after a session expires
 * mid-edit.
 */
export async function requireUser(next = "/admin") {
  const user = await getUser();
  if (!user) redirect(`/admin/login?next=${encodeURIComponent(next)}`);
  return user;
}

/** As requireUser, but also refuses a role below `minimum`. */
export async function requireRole(minimum, next = "/admin") {
  const user = await requireUser(next);
  if (!can(user, minimum)) redirect("/admin?denied=1");
  return user;
}

/**
 * The server-action form of the same check.
 *
 * An action cannot redirect a fetch the way a page can — the caller is a form
 * post expecting `{ ok, error }` back — so this throws a value the action's
 * wrapper turns into that shape. Used by ./action.js.
 */
export class NotAllowed extends Error {
  constructor(message = "You are not allowed to do that.") {
    super(message);
    this.name = "NotAllowed";
  }
}

export async function actionUser(minimum = "editor") {
  const user = await getUser();
  if (!user) throw new NotAllowed("Your session has expired. Sign in again.");
  if (!can(user, minimum)) {
    throw new NotAllowed(
      minimum === "owner"
        ? "Only an owner can change this."
        : "Your account has read-only access."
    );
  }
  return user;
}
