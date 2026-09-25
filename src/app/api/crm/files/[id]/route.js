/**
 * Serves a CRM file (a report, a prescription) — only to someone allowed to
 * see it. readFile() in src/lib/crm/stores/reports.js makes that decision:
 * a lab partner gets only files stamped with their own partner_id.
 *
 * ?download=1 forces a download; otherwise PDFs and images open in the tab.
 * Never cached by a shared cache: these are patients' medical reports.
 */
import { apiUser, scopeOf } from "@/lib/crm/guard";
import { logActivity } from "@/lib/crm/activity";
import { readFile } from "@/lib/crm/stores/reports";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const user = await apiUser();
  if (user instanceof Response) return user;

  const { id } = await params;
  try {
    const file = await readFile(id, user, scopeOf(user));
    if (!file) return Response.json({ ok: false, error: "Not found." }, { status: 404 });

    const download = request.nextUrl.searchParams.get("download") === "1";
    if (file.kind === "report") {
      await logActivity({
        user,
        action: download ? "download" : "view",
        entity: file.entity,
        entityId: file.entity_id,
        partnerId: file.partner_id,
        summary: `${download ? "Downloaded" : "Opened"} ${file.filename}`,
      });
    }

    return new Response(file.data, {
      headers: {
        "Content-Type": file.mime,
        "Content-Length": String(file.bytes),
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${file.filename.replace(/"/g, "")}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch (err) {
    console.error("[crm/files]", err);
    return Response.json({ ok: false, error: "Could not read the file." }, { status: 500 });
  }
}
