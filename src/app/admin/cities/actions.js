"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createCity, saveCity, updateCityFacts } from "@/lib/admin/cityStore";
import { actionUser, NotAllowed } from "@/lib/admin/guard";

async function wrap(fn) {
  try {
    return (await fn()) ?? { ok: true };
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    if (err?.digest?.startsWith?.("NEXT_")) throw err; // redirect()
    console.error("[admin/cities] action failed", err);
    return { ok: false, error: "That did not save." };
  }
}

/** The facts form: the same fields on /admin/cities/new and a panel city's edit page. */
const factsFrom = (formData) => ({
  slug: formData.get("slug"),
  name: formData.get("name"),
  state: formData.get("state"),
  areaContext: formData.get("areaContext"),
  areas: formData.get("areas"),
  aliases: formData.get("aliases"),
  postalCode: formData.get("postalCode"),
  lat: formData.get("lat"),
  lng: formData.get("lng"),
  gbp: formData.get("gbp"),
  order: formData.get("order"),
  status: formData.get("status"),
});

export async function saveCityAction(a, b) {
  const formData = b instanceof FormData ? b : a;

  return wrap(async () => {
    const user = await actionUser("editor");

    const result = await saveCity(
      {
        slug: formData.get("slug"),
        title: formData.get("title"),
        description: formData.get("description"),
        keywords: String(formData.get("keywords") ?? "")
          .split(",")
          .map((word) => word.trim())
          .filter(Boolean),
        h1: formData.get("h1"),
        heroMediaId: formData.get("heroMediaId"),
        heroAlt: formData.get("heroAlt"),
        priority: formData.get("priority"),
        status: formData.get("status"),
      },
      { user }
    );
    if (!result.ok) return result;

    revalidatePath("/admin/cities");
    return { ok: true, message: "Saved. The city page is serving it now." };
  });
}

/** Create a city page, then open its edit screen. */
export async function createCityAction(a, b) {
  const formData = b instanceof FormData ? b : a;

  return wrap(async () => {
    const user = await actionUser("editor");
    const result = await createCity(factsFrom(formData), { user });
    if (!result.ok) return result;

    revalidatePath("/admin/cities");
    redirect(`/admin/cities/${result.slug}?created=1`);
  });
}

/** Save the facts of a city added in the panel. */
export async function saveCityFactsAction(a, b) {
  const formData = b instanceof FormData ? b : a;

  return wrap(async () => {
    const user = await actionUser("editor");
    const result = await updateCityFacts(factsFrom(formData), { user });
    if (!result.ok) return result;

    revalidatePath("/admin/cities");
    revalidatePath(`/admin/cities/${result.slug}`);
    return { ok: true, message: "City details saved." };
  });
}
