/**
 * Runs before every page request. Two jobs, in this order.
 *
 * ⚠ THIS FILE IS `proxy.js`, NOT `middleware.js`. Next.js 16 renamed the
 * convention; a file called middleware.js in this project is simply not loaded,
 * and the failure is silent — no redirect fires, the admin gate never runs, and
 * nothing in the console says why. See
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
 *
 * ── 1. THE ADMIN GATE ────────────────────────────────────────────────────
 * A request to /admin without a session cookie is bounced to the sign-in page
 * before the route renders. This is a CHEAP check and nothing more: it looks
 * for the presence of a cookie, never at whether it is valid. Validation needs
 * the database and belongs where it can be done properly — every admin page
 * and every server action calls requireUser() from src/lib/admin/guard.js.
 *
 * That split is deliberate and worth stating plainly, because "the middleware
 * checks auth" is a very common way to end up with none: a Server Action is
 * its own HTTP endpoint and a layout's check does not run for it, so a gate
 * here would be an illusion of protection over an unprotected API. What this
 * saves is a wasted render and a confusing flash of an empty dashboard for
 * someone who is simply signed out.
 *
 * ── 2. RUNTIME REDIRECTS ─────────────────────────────────────────────────
 * The rules in seo_redirects, added from the panel without a deploy — a post
 * that moved, a campaign URL, a printed typo. The permanent rules in
 * next.config.mjs stay exactly where they are; that file's comment explains
 * why those particular URLs must keep redirecting for years, and they should
 * not be editable from a web form.
 *
 * Proxy runs on the Node.js runtime by default in Next 16, which is what makes
 * a MySQL lookup possible here at all — on the Edge runtime mysql2 cannot load.
 *
 * ── THE COST, AND WHAT IS DONE ABOUT IT ──────────────────────────────────
 * This is in the path of every page view, so an unconditional database round
 * trip would put MySQL's latency on every request the site serves. The map is
 * therefore memoised for a minute inside src/lib/admin/seoStore.js, and the
 * matcher below excludes static files, the image optimiser and API routes so
 * this function is not even entered for them.
 *
 * Next's own documentation warns not to rely on module globals here, because a
 * proxy may run in a fresh isolate. That is true and the memo is written to
 * survive it: a cold isolate simply does one query and caches it again. The
 * memo is an optimisation, never a correctness assumption.
 */
import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/admin/auth";
import { activeRedirects, countRedirectHit } from "@/lib/admin/seoStore";

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;

  /* ── 1. Admin ──────────────────────────────────────────────────────────── */
  if (pathname.startsWith("/admin")) {
    // The sign-in page itself must stay reachable, or this is a loop.
    if (pathname === "/admin/login") return NextResponse.next();

    if (!request.cookies.get(SESSION_COOKIE)) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", pathname + search);
      return NextResponse.redirect(login);
    }

    /*
     * The whole panel is noindex, and it is set here rather than page by page
     * so it cannot be forgotten on a new screen. An admin URL in Google's index
     * is both an invitation and, on a healthcare site, a live listing of where
     * the patient data is.
     */
    const response = NextResponse.next();
    response.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
    return response;
  }

  /* ── 2. Redirects ──────────────────────────────────────────────────────── */
  const rules = await activeRedirects();
  if (!rules.size) return NextResponse.next();

  // Matched without the trailing slash and without the query, so /old-page/,
  // /old-page and /old-page?utm_source=… all hit the same rule. The query is
  // then carried across to the destination: dropping it would lose the
  // campaign attribution on exactly the links most likely to be redirected.
  const key = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const rule = rules.get(key);
  if (!rule) return NextResponse.next();

  const destination = rule.to.startsWith("http")
    ? new URL(rule.to)
    : new URL(rule.to, request.url);

  if (search && !destination.search) destination.search = search;

  // Counted, never awaited — a redirect must not wait on a statistics write.
  countRedirectHit(key);

  return NextResponse.redirect(destination, rule.code);
}

export const config = {
  /*
   * Everything except the things that can never be redirected or gated:
   * Next's own assets, the image optimiser, the API routes (they answer their
   * own callers and a redirect would break a POST), the media route (it serves
   * image bytes on a hot path) and any URL with a file extension.
   *
   * The sitemap and robots deliberately ARE matched: an old sitemap URL is
   * exactly the kind of thing that gets redirected.
   */
  matcher: [
    "/((?!_next/static|_next/image|api/|media/|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
