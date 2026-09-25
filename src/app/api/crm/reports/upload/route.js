/**
 * POST multipart/form-data: bookingId, file, remarks
 *
 * A route handler rather than a Server Action because a report scan is
 * routinely a few MB, well over a Server Action's default body limit. The
 * session cookie is SameSite=Lax (a cross-site POST arrives without it) and
 * the Origin is checked below, which together close CSRF for this endpoint.
 *
 * Partners may upload for their own accepted orders; staff need
 * reports.manage. The file's real type is sniffed from its bytes.
 */
import { revalidatePath } from "next/cache";

import { apiUser, has, scopeOf } from "@/lib/crm/guard";
import { MAX_REPORT_BYTES, uploadReport } from "@/lib/crm/stores/reports";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const user = await apiUser();
  if (user instanceof Response) return user;
  if (!user.isPartner && !has(user, "reports.manage")) {
    return Response.json({ ok: false, error: "Your role cannot upload reports." }, { status: 403 });
  }

  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return Response.json({ ok: false, error: "Refused." }, { status: 403 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ ok: false, error: "The upload did not arrive complete. Try again." }, { status: 400 });
  }

  const file = form.get("file");
  const bookingId = Number(form.get("bookingId")) || 0;
  if (!bookingId || !file || typeof file === "string") {
    return Response.json({ ok: false, error: "Choose a file to upload." }, { status: 400 });
  }
  if (file.size > MAX_REPORT_BYTES) {
    return Response.json({ ok: false, error: "That file is larger than 8 MB." }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const out = await uploadReport(
      bookingId,
      { buffer, filename: file.name, remarks: String(form.get("remarks") ?? "") },
      { user, scope: scopeOf(user) }
    );
    revalidatePath(`/crm/bookings/${bookingId}`);
    return Response.json({ ok: true, reportId: out.reportId, version: out.version });
  } catch (err) {
    if (err?.userMessage) return Response.json({ ok: false, error: err.userMessage }, { status: 400 });
    console.error("[crm/reports/upload]", err);
    return Response.json({ ok: false, error: "The report could not be saved. Try again." }, { status: 500 });
  }
}
