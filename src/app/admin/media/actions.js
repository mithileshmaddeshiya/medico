"use server";

import { revalidatePath } from "next/cache";

import { audit } from "@/lib/admin/audit";
import { actionUser, NotAllowed } from "@/lib/admin/guard";
import { query } from "@/lib/db";

/**
 * Edit an image's description.
 *
 * Alt text is the only thing about a stored image the panel can change. The
 * bytes cannot be edited, and there is deliberately no "replace this file"
 * that keeps the id: /media/<id>/… is cached `immutable` for a year, so
 * swapping the bytes behind an id would leave every browser and CDN that has
 * already seen it serving the old picture indefinitely. Re-uploading makes a
 * new row with a new URL, which is the same discipline the site already
 * follows for its static images.
 */
export async function updateAltAction(a, b) {
  const formData = b instanceof FormData ? b : a;

  try {
    const user = await actionUser("editor");
    const id = Number(formData.get("id")) || 0;
    const alt = String(formData.get("alt") ?? "").slice(0, 255);
    const title = String(formData.get("title") ?? "").slice(0, 160);

    const [rows] = await query("SELECT alt, title FROM media WHERE id = ? LIMIT 1", [id]);
    if (!rows[0]) return { ok: false, error: "That image is not here any more." };

    await query("UPDATE media SET alt = ?, title = ? WHERE id = ?", [alt, title, id]);

    await audit({
      user,
      action: "update",
      entity: "media",
      entityId: id,
      summary: alt ? `described as “${alt.slice(0, 80)}”` : "description cleared",
      before: rows[0],
      after: { alt, title },
    });

    revalidatePath("/admin/media");
    return { ok: true, message: "Saved." };
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    if (err?.digest?.startsWith?.("NEXT_")) throw err;
    console.error("[admin/media] action failed", err);
    return { ok: false, error: "That did not save." };
  }
}
