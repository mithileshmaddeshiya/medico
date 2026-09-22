"use server";

import { revalidatePath } from "next/cache";

import { actionUser, NotAllowed } from "@/lib/admin/guard";
import {
  markReviewed,
  removeRedirect,
  saveRedirect,
  saveRoute,
} from "@/lib/admin/seoStore";

/**
 * SEO actions, all restricted to an owner.
 *
 * Not because editors are not trusted with words, but because everything here
 * is site-wide and slow to notice: a noindex on the home page, a redirect that
 * loops, a lastmod that starts lying. Each one is reversible in seconds and
 * invisible for weeks, which is the combination that makes the higher bar
 * worth it. Article-level SEO — which is most of it — stays with editors, in
 * the editor.
 */
const form = (a, b) => (b instanceof FormData ? b : a);

async function wrap(fn) {
  try {
    return (await fn()) ?? { ok: true };
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    if (err?.digest?.startsWith?.("NEXT_")) throw err;
    console.error("[admin/seo] action failed", err);
    return { ok: false, error: "That did not save." };
  }
}

export async function saveRouteAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("owner");

    const result = await saveRoute(
      {
        route: formData.get("route"),
        label: formData.get("label"),
        title: formData.get("title"),
        description: formData.get("description"),
        keywords: String(formData.get("keywords") ?? "")
          .split(",")
          .map((word) => word.trim())
          .filter(Boolean),
        canonical: formData.get("canonical"),
        noindex: formData.get("noindex") === "on",
        nofollow: formData.get("nofollow") === "on",
        inSitemap: formData.get("inSitemap") === "on",
        priority: formData.get("priority"),
        changefreq: formData.get("changefreq"),
      },
      { user }
    );
    if (!result.ok) return result;

    revalidatePath("/admin/seo");
    return { ok: true, message: "Saved. The page is serving it now." };
  });
}

export async function markReviewedAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("owner");
    await markReviewed(formData.get("route"), { user });

    revalidatePath("/admin/seo");
    return { ok: true, message: "Stamped with today's date in the sitemap." };
  });
}

export async function saveRedirectAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("owner");

    const result = await saveRedirect(
      {
        source: formData.get("source"),
        destination: formData.get("destination"),
        code: formData.get("code"),
        note: formData.get("note"),
      },
      { user }
    );
    if (!result.ok) return result;

    revalidatePath("/admin/seo/redirects");
    return { ok: true, message: "Live. It takes up to a minute to apply everywhere." };
  });
}

export async function removeRedirectAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("owner");
    const result = await removeRedirect(formData.get("id"), {
      user,
      mode: formData.get("mode") === "delete" ? "delete" : "archive",
    });
    if (!result.ok) return result;

    revalidatePath("/admin/seo/redirects");
    return { ok: true, message: "Switched off. The rule is still here and can be re-enabled." };
  });
}
