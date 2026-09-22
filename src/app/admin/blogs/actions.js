"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { changeRoute, removePost, savePost, setStatus } from "@/lib/admin/blogStore";
import { actionUser, NotAllowed } from "@/lib/admin/guard";

/**
 * Article actions.
 *
 * The editor posts JSON for the parts that are not flat strings — keywords,
 * takeaways, FAQs — because a FormData field is a string and these are lists
 * whose length the person controls. They are parsed here, defensively: a
 * malformed blob becomes an empty list rather than a 500, since the thing on
 * the other end is somebody's half-finished article.
 */
const form = (a, b) => (b instanceof FormData ? b : a);

const jsonField = (formData, name, fallback) => {
  try {
    const raw = formData.get(name);
    if (!raw) return fallback;
    const parsed = JSON.parse(String(raw));
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

async function wrap(fn) {
  try {
    return (await fn()) ?? { ok: true };
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    if (err?.digest?.startsWith?.("NEXT_")) throw err;
    console.error("[admin/blogs] action failed", err);
    return { ok: false, error: "That did not save. Nothing was lost — try again." };
  }
}

export async function savePostAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("editor");

    const input = {
      id: formData.get("id") ? Number(formData.get("id")) : null,
      category: formData.get("category"),
      city: formData.get("city"),
      cityName: formData.get("cityName"),
      title: formData.get("title"),
      description: formData.get("description"),
      focusKeyword: formData.get("focusKeyword"),
      keywords: jsonField(formData, "keywords", []),
      bodyHtml: formData.get("bodyHtml"),
      takeaways: jsonField(formData, "takeaways", []),
      faqs: jsonField(formData, "faqs", []),
      heroMediaId: formData.get("heroMediaId") || null,
      heroAlt: formData.get("heroAlt"),
      canonical: formData.get("canonical"),
      noindex: formData.get("noindex") === "on",
      nofollow: formData.get("nofollow") === "on",
      inSitemap: formData.get("inSitemap") === "on",
      priority: formData.get("priority"),
      changefreq: formData.get("changefreq"),
      sortOrder: formData.get("sortOrder"),
      publishedAt: formData.get("publishedAt") || null,
      updatedOn: formData.get("updatedOn") || null,
    };

    const result = await savePost(input, { user });
    if (!result.ok) return result;

    revalidatePath("/admin/blogs");

    // A new post gets its id in the URL, so a second save updates rather than
    // creating a duplicate. Redirect rather than returning the id, because the
    // form's hidden id field is rendered on the server.
    if (result.created) redirect(`/admin/blogs/${result.id}?created=1`);

    return { ok: true, message: `Saved. SEO score ${result.score}.`, score: result.score };
  });
}

export async function setPostStatusAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("editor");
    const id = formData.get("id");
    const status = String(formData.get("status") ?? "");

    const result = await setStatus(id, status, { user });
    if (!result.ok) return result;

    revalidatePath("/admin/blogs");
    revalidatePath(`/admin/blogs/${id}`);

    return {
      ok: true,
      message:
        status === "published"
          ? "Published. It is live now and in the sitemap."
          : status === "archived"
            ? "Archived — off the site, still here."
            : "Back to draft. The URL now 404s until you publish it again.",
    };
  });
}

export async function changeRouteAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("editor");
    const id = formData.get("id");

    const result = await changeRoute(
      id,
      { category: formData.get("category"), city: formData.get("city") },
      { user }
    );
    if (!result.ok) return result;

    revalidatePath("/admin/blogs");
    revalidatePath(`/admin/blogs/${id}`);

    return result.unchanged
      ? { ok: true, message: "That is already the URL." }
      : { ok: true, message: `Moved to ${result.to}, with a 308 from the old URL.` };
  });
}

/**
 * Delete an article, writing the redirect at the same time.
 *
 * This exists separately from the generic deleteRecord because of that
 * redirect: a published article's URL is linked from other posts and sitting
 * in Google's index, and a 404 there throws away everything the page earned.
 */
export async function deletePostAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("editor");

    const result = await removePost(formData.get("id"), {
      user,
      redirectTo: String(formData.get("redirectTo") ?? "").trim(),
      mode: formData.get("mode") === "archive" ? "archive" : "delete",
    });
    if (!result.ok) return result;

    revalidatePath("/admin/blogs");

    return {
      ok: true,
      message: result.redirected
        ? "In the bin, and the old URL now redirects. Nothing was permanently removed."
        : "In the bin. Nothing was permanently removed — restore it from the Deleted tab.",
    };
  });
}
