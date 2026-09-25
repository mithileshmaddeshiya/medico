/**
 * The CRM's JSON API plumbing (/api/crm/v1/*). Server only.
 *
 * The screens use Server Actions; this API exposes the SAME store functions
 * over plain HTTP for integrations (a phone system logging calls, a WhatsApp
 * bot creating leads, a future mobile app). One set of rules: validation,
 * scoping and the activity log all live in the stores, not here.
 *
 *   export const GET = endpoint("bookings.view", async ({ user, scope, params, query, body }) => data)
 *
 * - auth: the CRM session cookie (same as the screens), checked by apiUser()
 * - writes: JSON body; the Origin must match the host (CSRF). The session
 *   cookie is SameSite=Lax; this closes the remaining gap
 * - errors: UserError → 400 with its message; anything else → 500 with a
 *   generic message (details only in the server log)
 * - responses: { ok: true, data, ...meta } | { ok: false, error }
 */
import { apiUser, scopeOf } from "./guard";

export function endpoint(perm, fn, { status = 200 } = {}) {
  return async (request, ctx) => {
    const user = await apiUser(perm);
    if (user instanceof Response) return user;

    const write = !["GET", "HEAD"].includes(request.method);
    if (write) {
      const origin = request.headers.get("origin");
      if (origin && new URL(origin).host !== request.headers.get("host")) {
        return Response.json({ ok: false, error: "Cross-origin request refused." }, { status: 403 });
      }
    }

    let body = {};
    if (write && request.headers.get("content-type")?.includes("application/json")) {
      try {
        body = (await request.json()) ?? {};
      } catch {
        return Response.json({ ok: false, error: "The body is not valid JSON." }, { status: 400 });
      }
    }

    try {
      const params = ctx?.params ? await ctx.params : {};
      const query = Object.fromEntries(request.nextUrl.searchParams.entries());
      const result = await fn({ user, scope: scopeOf(user), request, params, body, query });
      if (result instanceof Response) return result;
      const shaped = result && typeof result === "object" && "data" in result && "meta" in result ? result : { data: result, meta: {} };
      return Response.json({ ok: true, data: shaped.data, ...shaped.meta }, { status, headers: { "Cache-Control": "no-store" } });
    } catch (err) {
      if (err?.userMessage) return Response.json({ ok: false, error: err.userMessage }, { status: 400 });
      console.error(`[crm/api] ${request.method} ${request.nextUrl.pathname}`, err);
      return Response.json({ ok: false, error: "Something went wrong." }, { status: 500 });
    }
  };
}

export const notFound = () => Response.json({ ok: false, error: "Not found." }, { status: 404 });
