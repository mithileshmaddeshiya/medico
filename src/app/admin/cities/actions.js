"use server";

import { revalidatePath } from "next/cache";

import { saveCity } from "@/lib/admin/cityStore";
import { actionUser, NotAllowed } from "@/lib/admin/guard";

export async function saveCityAction(a, b) {
  const formData = b instanceof FormData ? b : a;

  try {
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
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    if (err?.digest?.startsWith?.("NEXT_")) throw err;
    console.error("[admin/cities] action failed", err);
    return { ok: false, error: "That did not save." };
  }
}
