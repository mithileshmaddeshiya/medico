"use server";

import { audit } from "@/lib/admin/audit";
import { NotAllowed, actionUser } from "@/lib/admin/guard";

/**
 * Record that a lab report was generated, and by whom.
 *
 * The PDF itself is built in the browser and never reaches the server (see
 * src/lib/labReport/coverPage.js), so this row is the only trace it leaves —
 * which is the point of having one: "who issued this report under our name"
 * is a question with an answer.
 */
export async function recordLabReport({ patientName, labName, reportDate, bookingId }) {
  try {
    const user = await actionUser("editor");
    await audit({
      user,
      action: "create",
      entity: "lab_report",
      entityId: String(bookingId ?? "").slice(0, 64),
      summary: `lab report for ${String(patientName ?? "").slice(0, 80)} · ${String(labName ?? "").slice(0, 80)} · ${String(reportDate ?? "").slice(0, 10)}`,
    });
    return { ok: true };
  } catch (err) {
    if (err instanceof NotAllowed) return { ok: false, error: err.message };
    console.error("[lab-report] could not record the report", err);
    return { ok: false, error: "The report was made but could not be recorded." };
  }
}
