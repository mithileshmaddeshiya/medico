"use server";

import { revalidatePath } from "next/cache";

import { actionUser, NotAllowed } from "@/lib/admin/guard";
import { setLeadFollowUp, setLeadStatus } from "@/lib/admin/opsStore";

/**
 * Lead actions.
 *
 * The status and the follow-up fields are the only parts of a lead the panel
 * writes. A customer's name, phone number and address are what they typed into
 * the form; correcting a typo by hand would make the record disagree with what
 * was actually submitted, and that record is the evidence that somebody asked
 * us to come to their house. A correction goes in a note beside it.
 */
async function wrap(fn) {
  try {
    return (await fn()) ?? { ok: true };
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    if (err?.digest?.startsWith?.("NEXT_")) throw err;
    console.error("[admin/leads] action failed", err);
    return { ok: false, error: "That did not save." };
  }
}

export async function moveLead(previous, formData) {
  return wrap(async () => {
    const user = await actionUser("editor");
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "");

    const result = await setLeadStatus(id, status, { user });
    if (!result.ok) return result;

    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${id}`);
    revalidatePath("/admin");

    return { ok: true, message: `Moved to ${status.replace(/_/g, " ")}.` };
  });
}

export async function assignLead(previous, formData) {
  return wrap(async () => {
    const user = await actionUser("editor");
    const id = String(formData.get("id") ?? "");

    await setLeadFollowUp(
      id,
      {
        assignedTo: formData.get("assignedTo"),
        followUpOn: formData.get("followUpOn") || null,
      },
      { user }
    );

    revalidatePath(`/admin/leads/${id}`);
    return { ok: true, message: "Saved." };
  });
}
