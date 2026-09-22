/**
 * The upload endpoint. POST multipart/form-data, get back a media record.
 *
 * A route handler rather than a Server Action because the editor and the media
 * library both want a real upload with progress and an immediate URL back —
 * and because an action that takes a 12 MB file has to serialise it through
 * the action protocol, which is not what that protocol is for.
 *
 * ── EVERY REQUEST IS TREATED AS UNAUTHENTICATED ──────────────────────────
 * src/proxy.js checks for a session cookie before an /admin page renders, but
 * this is /api and anyone can POST to it directly with any cookie they like.
 * So the session is validated here, from the database, on every call — and
 * then the role, because a viewer may read the whole panel and must not be
 * able to put a file on the public site.
 *
 * Whatever arrives is converted to WebP by src/lib/admin/media.js, which reads
 * the real file header rather than trusting the extension or the declared MIME
 * type. A .webp that is actually HTML never becomes a stored file.
 */
import { can } from "@/lib/admin/auth";
import { getUser } from "@/lib/admin/guard";
import { MAX_UPLOAD_BYTES, storeUpload } from "@/lib/admin/media";

export const runtime = "nodejs"; // sharp is a native module
export const dynamic = "force-dynamic";

export async function POST(request) {
  const user = await getUser();
  if (!user) {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  if (!can(user, "editor")) {
    return Response.json(
      { ok: false, error: "Your account has read-only access." },
      { status: 403 }
    );
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ ok: false, error: "That upload did not arrive intact." }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
    return Response.json({ ok: false, error: "No file was attached." }, { status: 400 });
  }

  // Checked before the bytes are read into memory as well as inside toWebp —
  // the point of this one is to refuse a 200 MB upload without buffering it.
  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json(
      { ok: false, error: `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 12 MB.` },
      { status: 413 }
    );
  }

  try {
    const media = await storeUpload(file, {
      alt: form.get("alt") ?? "",
      title: form.get("title") ?? "",
      folder: form.get("folder") ?? "general",
      user,
    });

    return Response.json({ ok: true, media });
  } catch (err) {
    // toWebp throws sentences meant for the person uploading ("that file is
    // not an image we can read"), so the message is passed through. Anything
    // else is logged and answered generically.
    const known = /image|file|MB|convert|dimensions|empty/i.test(err?.message ?? "");
    if (!known) console.error("[admin/upload] the upload failed", err);

    return Response.json(
      { ok: false, error: known ? err.message : "That upload could not be processed." },
      { status: known ? 400 : 500 }
    );
  }
}
