"use server";

import { revalidatePath } from "next/cache";

import { actionUser, NotAllowed } from "@/lib/admin/guard";
import { setOrderStatus } from "@/lib/admin/opsStore";

/**
 * Order actions.
 *
 * The only field the panel writes is `status`, and not even all of its values
 * — `paid` is refused in src/lib/admin/opsStore.js because a payment is proven
 * by a verified Razorpay signature and by nothing else. Amounts, line items
 * and the payment ids are never editable: they are the record of what the
 * server actually charged, and a back office that can rewrite them turns a
 * transaction log into an opinion.
 */
export async function moveOrder(a, b) {
  const formData = b instanceof FormData ? b : a;

  try {
    const user = await actionUser("editor");
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "");
    const reason = String(formData.get("reason") ?? "");

    const result = await setOrderStatus(id, status, { user, reason });
    if (!result.ok) return result;

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin");

    return { ok: true, message: `Order marked ${status.replace(/_/g, " ")}.` };
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    if (err?.digest?.startsWith?.("NEXT_")) throw err;
    console.error("[admin/orders] action failed", err);
    return { ok: false, error: "That did not save." };
  }
}
