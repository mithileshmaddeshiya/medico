/**
 * Image uploads. Every one of them comes out the other side as WebP.
 * Server only — sharp is a native module and must never reach the browser.
 *
 * ── WHAT HAPPENS TO AN UPLOAD ────────────────────────────────────────────
 *   1. The bytes are read into memory (capped, see MAX_UPLOAD_BYTES).
 *   2. sharp reads the real header. The file's *extension* is not consulted
 *      and not trusted — a .webp that is actually an HTML file is rejected
 *      here, before anything is stored.
 *   3. EXIF orientation is applied and then the whole metadata block is
 *      dropped. Phone photos carry GPS coordinates; publishing the exact
 *      house a sample was collected from is a privacy failure, and it is the
 *      default unless something strips it.
 *   4. It is resized down to fit MAX_EDGE — never up. Upscaling a small image
 *      makes a bigger file with no more detail.
 *   5. It is encoded as WebP and stored with its real width and height.
 *
 * ── WHY WEBP, AND WHY NO ORIGINAL IS KEPT ────────────────────────────────
 * WebP is 25–35% smaller than JPEG at the same quality and is supported
 * everywhere this site's traffic comes from. On an audience that is largely on
 * phones on mobile data, that difference is the LCP, and the LCP is a ranking
 * signal — which is the whole reason the panel converts rather than offering
 * it as an option somebody forgets to tick.
 *
 * ⚠ ONE EXCEPTION, AND IT IS IMPORTANT: share cards must NOT be WebP.
 * WhatsApp and several other scrapers refuse a WebP og:image and render a blank
 * grey box instead — the site already learned this the hard way, see
 * LAB_OG_IMAGE in src/data/lab/defaults.js. So `ogCard()` below exists and
 * emits JPEG. The rule is "content images are WebP, share cards are JPEG", and
 * the panel picks the right one by where the image is being used rather than
 * asking the person uploading it to know that.
 */
import sharp from "sharp";

import { dbConfigured, query } from "@/lib/db";

import { audit } from "./audit";
import { visible } from "./softDelete";

/** 12 MB. A modern phone photo is 3–6 MB; this leaves room without inviting a raw. */
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

/**
 * The longest edge any stored image may have.
 *
 * 1920 matches the top of `deviceSizes` in next.config.mjs, which was capped
 * there because nothing on the site is wider. Storing a 4000px original would
 * mean next/image has a source it can never use a pixel of.
 */
const MAX_EDGE = 1920;

/** What sharp is allowed to have decoded. Anything else is refused. */
const ACCEPTED = new Set(["jpeg", "jpg", "png", "webp", "avif", "gif", "tiff", "svg"]);

export const slugifyName = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "") // drop the extension
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "image";

/**
 * The public URL for a stored image.
 *
 * The slug is in the path purely for search engines and for anyone reading the
 * HTML: `/media/41/thyroid-test-at-home.webp` says what the picture is, which
 * a bare id does not, and an image URL is one of the things Google Images
 * reads. The id is what the route actually looks up, so renaming an image
 * never breaks a page that already references it.
 */
export const mediaUrl = (item) =>
  item?.id ? `/media/${item.id}/${item.slug || "image"}.webp` : null;

/* ── Encoding ─────────────────────────────────────────────────────────────── */

/**
 * Turn arbitrary uploaded bytes into a WebP buffer plus its dimensions.
 *
 * Throws a sentence that can be shown to the person uploading — every failure
 * here is something they can act on ("that file is not an image", "that is too
 * big"), not an internal error.
 */
export async function toWebp(buffer, { maxEdge = MAX_EDGE, quality = 82 } = {}) {
  if (!buffer?.length) throw new Error("That file was empty.");
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error(`That file is ${(buffer.length / 1024 / 1024).toFixed(1)} MB — the limit is 12 MB.`);
  }

  let image = sharp(buffer, { animated: true, failOn: "error" });

  let meta;
  try {
    meta = await image.metadata();
  } catch {
    throw new Error("That file is not an image we can read.");
  }

  if (!ACCEPTED.has(String(meta.format))) {
    throw new Error(`We cannot convert a ${meta.format ?? "file"} of that type.`);
  }

  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) throw new Error("That image has no readable dimensions.");

  const data = await image
    // Apply the EXIF rotation, then drop EXIF entirely — see the header note.
    .rotate()
    .resize({
      width: Math.min(width, maxEdge),
      height: Math.min(height, maxEdge),
      fit: "inside",
      withoutEnlargement: true, // never upscale
    })
    .webp({ quality, effort: 5 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data.data,
    width: data.info.width,
    height: data.info.height,
    from: meta.format,
    originalBytes: buffer.length,
  };
}

/**
 * A 1200×630 JPEG share card — the one thing that must not be WebP.
 *
 * `cover` rather than `inside`: an og:image has to BE 1200×630, and a letterboxed
 * one renders with grey bars in every preview that shows it.
 */
export async function toOgCard(buffer) {
  const { data, info } = await sharp(buffer, { failOn: "error" })
    .rotate()
    .resize({ width: 1200, height: 630, fit: "cover", position: "attention" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });

  return { buffer: data, width: info.width, height: info.height };
}

/* ── Storage ──────────────────────────────────────────────────────────────── */

/**
 * Convert an upload and store it. Returns the media row (without its bytes).
 *
 * `alt` is asked for at upload time on purpose. An image with no alt text is
 * invisible to a screen reader and worth nothing in Google Images, and alt
 * text added "later" is alt text that is never added. The panel warns when it
 * is empty rather than blocking — a decorative image legitimately has none.
 */
export async function storeUpload(file, { alt = "", title = "", folder = "general", user } = {}) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const converted = await toWebp(buffer);

  const slug = slugifyName(title || file.name);

  const [result] = await query(
    `INSERT INTO media
       (slug, alt, title, width, height, bytes, original_name, original_type,
        original_bytes, folder, data, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      slug,
      String(alt ?? "").slice(0, 255),
      String(title ?? file.name ?? "").slice(0, 160),
      converted.width,
      converted.height,
      converted.buffer.length,
      String(file.name ?? "").slice(0, 255),
      String(file.type ?? converted.from).slice(0, 60),
      converted.originalBytes,
      String(folder ?? "general").slice(0, 60),
      converted.buffer,
      user?.id ?? null,
    ]
  );

  const saved = {
    id: result.insertId,
    slug,
    alt,
    title,
    width: converted.width,
    height: converted.height,
    bytes: converted.buffer.length,
    folder,
    from: converted.from,
    originalBytes: converted.originalBytes,
  };

  await audit({
    user,
    action: "upload",
    entity: "media",
    entityId: saved.id,
    summary: `${converted.from} → webp, ${Math.round(
      (1 - converted.buffer.length / converted.originalBytes) * 100
    )}% smaller`,
    after: saved,
  });

  return { ...saved, url: mediaUrl(saved) };
}

/**
 * One image's bytes, for the /media route.
 *
 * Three outcomes, and the route needs to tell them apart: the row (found),
 * null (deleted or never existed — a real 404), or a throw (the database is
 * unreachable, which is a 503 and NOT a 404). Answering an outage with "not
 * found" would tell a crawler the image is permanently gone and get it dropped
 * from image search over a five-minute blip.
 */
export async function mediaBytes(id) {
  if (!dbConfigured()) {
    throw new Error("DB_HOST / DB_USER / DB_NAME are not set — images live in MySQL");
  }

  const [rows] = await query(
    `SELECT data, bytes, updated_at FROM media WHERE id = ? AND status = 'active' LIMIT 1`,
    [Number(id) || 0]
  );
  return rows[0] ?? null;
}

/** The library listing, newest first. Never selects `data` — that is the point. */
export async function listMedia({
  folder = null,
  search = "",
  includeDeleted = false,
  limit = 60,
  offset = 0,
} = {}) {
  const where = [visible("", includeDeleted)];
  const params = [];

  if (folder) {
    where.push("folder = ?");
    params.push(folder);
  }
  if (search) {
    where.push("(slug LIKE ? OR alt LIKE ? OR title LIKE ? OR original_name LIKE ?)");
    const like = `%${search}%`;
    params.push(like, like, like, like);
  }

  const [rows] = await query(
    `SELECT id, slug, alt, title, width, height, bytes, folder, original_type,
            original_bytes, status, created_at
     FROM media
     WHERE ${where.join(" AND ")}
     ORDER BY id DESC
     LIMIT ${Math.min(200, Number(limit) || 60)} OFFSET ${Math.max(0, Number(offset) || 0)}`,
    params
  );

  return rows.map((row) => ({ ...row, url: mediaUrl(row) }));
}

/** One image's metadata by id — used to resolve a hero or OG reference. */
export async function getMedia(id) {
  if (!id) return null;
  const [rows] = await query(
    `SELECT id, slug, alt, title, width, height, bytes, folder, status
     FROM media WHERE id = ? LIMIT 1`,
    [Number(id) || 0]
  );
  const row = rows[0];
  return row ? { ...row, url: mediaUrl(row) } : null;
}

/** Folder names in use, with counts — the library's left-hand filter. */
export async function mediaFolders() {
  const [rows] = await query(
    `SELECT folder, COUNT(*) AS n FROM media WHERE status = 'active'
     GROUP BY folder ORDER BY folder`
  );
  return rows;
}

/** Library totals for the dashboard: how much the WebP conversion has saved. */
export async function mediaSavings() {
  const [rows] = await query(
    `SELECT COUNT(*) AS files,
            COALESCE(SUM(bytes), 0) AS webp_bytes,
            COALESCE(SUM(original_bytes), 0) AS original_bytes
     FROM media WHERE status = 'active'`
  );
  const row = rows[0] ?? {};
  const original = Number(row.original_bytes) || 0;
  const webp = Number(row.webp_bytes) || 0;
  return {
    files: Number(row.files) || 0,
    webpBytes: webp,
    originalBytes: original,
    savedPct: original ? Math.round((1 - webp / original) * 100) : 0,
  };
}
