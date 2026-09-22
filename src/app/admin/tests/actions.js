"use server";

import { revalidatePath } from "next/cache";

import { removeCategory, saveCategory, saveTest, setTestActive } from "@/lib/admin/catalogStore";
import { actionUser, NotAllowed } from "@/lib/admin/guard";

/**
 * Catalogue actions.
 *
 * ── THESE CHANGE WHAT THE NEXT CUSTOMER IS CHARGED ───────────────────────
 * Checkout prices the cart from lab_tests with `fresh: true` — no cache (see
 * getTests in src/lib/labStore.js). A price saved here is charged seconds
 * later. Validation therefore lives in catalogStore.validateTest and is
 * refused loudly rather than coerced quietly: a price that fails to parse must
 * not silently become 0.
 *
 * The public pages are revalidated after every write so the grid matches the
 * price list without waiting out the 60-second window they revalidate on.
 */
const form = (a, b) => (b instanceof FormData ? b : a);

async function wrap(fn) {
  try {
    return (await fn()) ?? { ok: true };
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    if (err?.digest?.startsWith?.("NEXT_")) throw err;
    console.error("[admin/tests] action failed", err);
    return { ok: false, error: "That did not save." };
  }
}

/** Every page that shows a price, so a change is visible immediately. */
function refreshPublicPages() {
  for (const path of ["/", "/lab-test", "/sitemap/lab-test.xml"]) {
    try {
      revalidatePath(path);
    } catch {
      /* outside a request scope */
    }
  }
  try {
    // Every /lab-test/<city> at once — they all render the same price list.
    revalidatePath("/lab-test/[city]", "page");
  } catch {
    /* as above */
  }
}

export async function saveTestAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("editor");

    const result = await saveTest(
      {
        id: formData.get("id"),
        originalId: formData.get("originalId"),
        name: formData.get("name"),
        includes: formData.get("includes"),
        isPackage: formData.get("isPackage") === "on",
        params: formData.get("params"),
        callForPrice: formData.get("callForPrice") === "on",
        price: formData.get("price"),
        mrp: formData.get("mrp"),
        fasting: formData.get("fasting") === "on",
        icon: formData.get("icon"),
        tint: formData.get("tint"),
        sortOrder: formData.get("sortOrder"),
        description: formData.get("description"),
        metaTitle: formData.get("metaTitle"),
        metaDescription: formData.get("metaDescription"),
        imageMediaId: formData.get("imageMediaId"),
        tags: formData.getAll("tags"),
      },
      { user }
    );

    if (!result.ok) return result;

    revalidatePath("/admin/tests");
    refreshPublicPages();

    return { ok: true, message: "Saved. The site is showing it now." };
  });
}

export async function toggleTestAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("editor");
    const active = formData.get("active") === "1";

    await setTestActive(formData.get("id"), active, { user });

    revalidatePath("/admin/tests");
    refreshPublicPages();

    return { ok: true, message: active ? "Back on the site." : "Hidden from the site." };
  });
}

export async function saveCategoryAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("editor");

    const result = await saveCategory(
      {
        key: formData.get("key"),
        label: formData.get("label"),
        heading: formData.get("heading"),
        sortOrder: formData.get("sortOrder"),
      },
      { user }
    );
    if (!result.ok) return result;

    revalidatePath("/admin/tests/categories");
    refreshPublicPages();

    return { ok: true, message: "Chip saved." };
  });
}

export async function removeCategoryAction(a, b) {
  const formData = form(a, b);

  return wrap(async () => {
    const user = await actionUser("editor");
    const result = await removeCategory(formData.get("key"), { user });
    if (!result.ok) return result;

    revalidatePath("/admin/tests/categories");
    refreshPublicPages();

    return { ok: true, message: "Chip removed. The row is still in the database." };
  });
}
