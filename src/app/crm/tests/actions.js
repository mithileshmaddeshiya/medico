"use server";

/**
 * Test and package actions (the packages screens use these too).
 *
 * These write the rows the public website renders and checkout charges, so
 * after any change the site can see, the public pages are revalidated — the
 * same list of paths the website admin revalidates (src/app/admin/tests/
 * actions.js), so both panels leave the site in the same state.
 */
import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { crmAction, run } from "@/lib/crm/guard";
import { createCatalogItem, moveCatalogItem, updateCatalogItem } from "@/lib/crm/stores/catalog";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

function refreshPublicPages() {
  for (const path of ["/", "/lab-test", "/sitemap/lab-test.xml", "/admin/tests"]) {
    try {
      revalidatePath(path);
    } catch {
      /* outside a request scope */
    }
  }
  try {
    revalidatePath("/lab-test/[city]", "page");
  } catch {
    /* as above */
  }
}

function readForm(fd) {
  return {
    name: s(fd, "name"),
    code: s(fd, "code"),
    category: s(fd, "category"),
    sampleType: s(fd, "sampleType"),
    fasting: fd.get("fasting") === "on",
    tatHours: s(fd, "tatHours"),
    callForPrice: fd.get("callForPrice") === "on",
    price: s(fd, "price"),
    mrp: s(fd, "mrp"),
    partnerPrice: s(fd, "partnerPrice"),
    params: s(fd, "params"),
    includes: s(fd, "includes"),
    description: s(fd, "description"),
    packageTests: fd.getAll("packageTests").map(String),
    showOnSite: fd.get("showOnSite") === "on",
  };
}

export async function createCatalogAction(prev, fd) {
  const isPackage = s(fd, "kind") === "package";
  let id;
  const result = await run("catalog/create", async () => {
    const user = await crmAction("catalog.manage");
    const out = await createCatalogItem(readForm(fd), { user, isPackage });
    id = out.id;
    if (out.onSite) refreshPublicPages();
    return { ok: true };
  });
  if (result.ok && id) redirect(`/crm/${isPackage ? "packages" : "tests"}/${encodeURIComponent(id)}?created=1`);
  return result;
}

export async function updateCatalogAction(prev, fd) {
  return run("catalog/update", async () => {
    const user = await crmAction("catalog.manage");
    const out = await updateCatalogItem(s(fd, "id"), readForm(fd), { user });
    if (out.siteTouched) refreshPublicPages();
    refresh();
    return { ok: true, message: out.changed ? (out.siteTouched ? "Saved. The website shows it within a minute." : "Saved.") : "Nothing changed." };
  });
}

export async function moveCatalogAction(prev, fd) {
  return run("catalog/move", async () => {
    const user = await crmAction("catalog.manage");
    const out = await moveCatalogItem(s(fd, "id"), s(fd, "move"), { user });
    if (out.siteTouched) refreshPublicPages();
    refresh();
    return { ok: true, message: `${out.verb.charAt(0).toUpperCase()}${out.verb.slice(1)}.` };
  });
}
