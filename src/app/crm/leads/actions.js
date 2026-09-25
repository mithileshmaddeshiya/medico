"use server";

/**
 * Lead actions. Each checks leads.manage, calls the store (which validates,
 * writes the activity row and raises notifications) and refreshes.
 */
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

import { LEAD_STATUS, leadCode } from "@/lib/crm/constants";
import { crmAction, run, UserError } from "@/lib/crm/guard";
import { addNote } from "@/lib/crm/stores/bookings";
import { assignLead, createLead, setLeadStatus } from "@/lib/crm/stores/leads";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

export async function createLeadAction(prev, fd) {
  let id;
  const result = await run("leads/create", async () => {
    const user = await crmAction("leads.manage");
    const out = await createLead(
      {
        name: s(fd, "name"),
        phone: s(fd, "phone"),
        channel: s(fd, "channel"),
        test: s(fd, "test"),
        interestedPackage: s(fd, "interestedPackage"),
        city: s(fd, "city"),
        area: s(fd, "area"),
        address: s(fd, "address"),
        assignedUserId: s(fd, "assignedUserId"),
        followUpAt: s(fd, "followUpAt"),
        followUpNote: s(fd, "followUpNote"),
        notes: s(fd, "notes"),
        call:
          s(fd, "logCall") === "1"
            ? { direction: s(fd, "direction"), outcome: s(fd, "outcome"), durationMin: s(fd, "durationMin"), notes: s(fd, "callNotes") }
            : null,
      },
      { user, force: s(fd, "force") === "1" }
    );
    if (out.duplicate) {
      const d = out.duplicate;
      return {
        ok: false,
        duplicate: { id: d.id, code: leadCode(d.id), name: d.name, status: LEAD_STATUS[d.crm_status]?.label ?? d.crm_status, createdAt: new Date(d.created_at).toISOString() },
      };
    }
    id = out.id;
    return { ok: true };
  });
  if (result.ok && id) redirect(`/crm/leads/${id}?created=1`);
  return result;
}

export async function leadStatusAction(prev, fd) {
  return run("leads/status", async () => {
    const user = await crmAction("leads.manage");
    const status = s(fd, "status");
    const out = await setLeadStatus(s(fd, "id"), status, { user, reason: s(fd, "reason") });
    refresh();
    return { ok: true, message: out.changed ? `Moved to ${LEAD_STATUS[status]?.label ?? status}.` : "No change." };
  });
}

export async function assignLeadAction(prev, fd) {
  return run("leads/assign", async () => {
    const user = await crmAction("leads.manage");
    await assignLead(s(fd, "id"), s(fd, "assignedUserId") || null, { user });
    refresh();
    return { ok: true, message: s(fd, "assignedUserId") ? "Lead assigned." : "Lead unassigned." };
  });
}

export async function leadNoteAction(prev, fd) {
  return run("leads/note", async () => {
    const user = await crmAction("leads.manage");
    await addNote("lead", s(fd, "id"), s(fd, "body"), { user });
    refresh();
    return { ok: true, message: "Note added." };
  });
}

/**
 * Bulk actions from the leads table. Each lead goes through the same store
 * call as a single change, so each gets its own activity row and checks.
 */
export async function leadBulkAction(prev, fd) {
  return run("leads/bulk", async () => {
    const user = await crmAction("leads.manage");
    const ids = fd.getAll("ids").map(String).filter(Boolean).slice(0, 100);
    if (!ids.length) throw new UserError("Select at least one lead.");
    const op = s(fd, "op");
    if (!["status", "assign"].includes(op)) throw new UserError("Pick an action.");

    let done = 0;
    const failed = [];
    for (const id of ids) {
      try {
        if (op === "status") await setLeadStatus(id, s(fd, "status"), { user, reason: s(fd, "reason") });
        else await assignLead(id, s(fd, "assignedUserId") || null, { user });
        done += 1;
      } catch (err) {
        failed.push(`${leadCode(id)}: ${err?.userMessage ?? "failed"}`);
        if (!err?.userMessage) console.error("[crm/leads/bulk]", err);
      }
    }
    refresh();
    if (failed.length && !done) return { ok: false, error: failed.slice(0, 3).join(" · ") };
    return { ok: true, message: `${done} updated${failed.length ? `, ${failed.length} skipped (${failed.slice(0, 2).join(" · ")})` : ""}.` };
  });
}
