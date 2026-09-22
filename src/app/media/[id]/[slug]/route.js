/**
 * Serves an uploaded image: /media/<id>/<anything>.webp
 *
 * ── WHY IMAGES COME OUT OF THE DATABASE ──────────────────────────────────
 * Because the alternative does not work where this site runs. An upload
 * written into public/ appears fine in `next dev` and is silently lost on
 * Vercel, whose filesystem is read-only at runtime — the file exists for one
 * request and is gone on the next cold start. Bytes in a row work in both
 * places, and they make the panel's soft-delete rule real: a "deleted" image is
 * still recoverable, which an unlinked file is not.
 *
 * ── WHY THE SLUG IS IN THE URL AND IGNORED ───────────────────────────────
 * `/media/41/thyroid-test-at-home.webp` tells a reader, and Google Images,
 * what the picture is; `/media/41` tells them nothing, and the file name is
 * one of the few things an image search can read. Only the id is looked up, so
 * renaming an image never breaks a page that already links to the old name.
 *
 * ── CACHING ──────────────────────────────────────────────────────────────
 * `immutable`, for a year, matching `minimumCacheTTL` in next.config.mjs. It
 * is safe because the content at an id genuinely never changes: the panel has
 * no "replace this image" that keeps the id — re-uploading makes a new row
 * with a new URL. That is the same discipline the site already follows for its
 * static images, where changing one means changing its filename.
 *
 * An ETag is sent as well, so a client that does revalidate gets a 304 instead
 * of the bytes.
 */
import { mediaBytes } from "@/lib/admin/media";

/** Bytes come from MySQL, so this can never be prerendered. */
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = await params;

  let row;
  try {
    row = await mediaBytes(id);
  } catch (err) {
    /*
     * The database is unreachable. That is a 503, not a 404.
     *
     * The distinction matters more than it looks: a 404 tells a crawler the
     * image is permanently gone and is enough to have it dropped from image
     * search, whereas a 503 says "try again later" and costs nothing. Answering
     * a five-minute outage with a 404 would be a self-inflicted deindexing.
     */
    console.error(`[media] could not read image ${id}`, err);
    return new Response("Temporarily unavailable", {
      status: 503,
      headers: { "Retry-After": "60", "Cache-Control": "no-store" },
    });
  }

  // A deleted or missing image is a real 404. Substituting a placeholder would
  // hide a broken reference on a live page, which is the thing worth knowing.
  if (!row) return new Response("Not found", { status: 404 });

  // Weak ETag from the row's own identity: the bytes at an id do not change,
  // and updated_at moves if the alt text is edited, which costs nothing.
  const etag = `W/"m${id}-${row.bytes}"`;
  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  return new Response(row.data, {
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": String(row.bytes),
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: etag,
      // Nothing here is per-user, but an image route that can be framed into a
      // different origin's page is a tracking vector; this costs nothing.
      "X-Content-Type-Options": "nosniff",
    },
  });
}
