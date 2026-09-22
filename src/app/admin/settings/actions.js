"use server";

import { revalidatePath } from "next/cache";

import { actionUser, NotAllowed } from "@/lib/admin/guard";
import { SETTINGS, saveSettings } from "@/lib/admin/settings";

export async function saveSettingsAction(a, b) {
  const formData = b instanceof FormData ? b : a;

  try {
    const user = await actionUser("owner");

    const input = {};
    for (const item of SETTINGS) {
      input[item.key] =
        item.type === "boolean" ? formData.get(item.key) === "on" : formData.get(item.key);
    }

    await saveSettings(input, { user });

    revalidatePath("/admin/settings");
    // The settings show on every public page, so the whole site is refreshed.
    try {
      revalidatePath("/", "layout");
    } catch {
      /* outside a request scope */
    }

    return { ok: true, message: "Saved." };
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    if (err?.digest?.startsWith?.("NEXT_")) throw err;
    console.error("[admin/settings] action failed", err);
    return { ok: false, error: "That did not save." };
  }
}
