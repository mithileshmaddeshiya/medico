/**
 * The library listing the media picker reads. GET only.
 *
 * Authenticated on every call, from the database, for the same reason the
 * upload route is: this is /api and the proxy's cookie check does not make a
 * request trustworthy. A `viewer` may read it — the library is not sensitive
 * and the picker is used in read-only screens — but a signed-out caller may
 * not, because the folder names and file names of an unpublished campaign are
 * not public information.
 */
import { listMedia } from "@/lib/admin/media";
import { getUser } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const user = await getUser();
  if (!user) return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });

  const params = request.nextUrl.searchParams;

  try {
    const media = await listMedia({
      search: params.get("search") ?? "",
      folder: params.get("folder") || null,
      limit: Math.min(120, Number(params.get("limit")) || 60),
    });

    return Response.json({ ok: true, media });
  } catch (err) {
    console.error("[admin/media] the listing failed", err);
    return Response.json({ ok: false, error: "The library could not be read." }, { status: 500 });
  }
}
