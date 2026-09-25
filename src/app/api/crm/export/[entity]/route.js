/**
 * GET /api/crm/export/<entity>?format=csv|xls&<filters>
 *
 * Needs export.data AND the entity's own view permission. A partner cannot
 * export at all (export.data is forbidden to partners in permissions.js).
 * Every export is written to the activity log — a spreadsheet of patients'
 * names and phone numbers leaving the building is exactly the event an owner
 * wants a record of.
 */
import { logActivity } from "@/lib/crm/activity";
import { EXPORTS, toCsv, toXls } from "@/lib/crm/exports";
import "@/lib/crm/exportsRegistry";
import { apiUser, has, scopeOf } from "@/lib/crm/guard";
import { istDay } from "@/lib/crm/dates";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { entity } = await params;
  const def = EXPORTS[entity];
  if (!def) return Response.json({ ok: false, error: "Unknown export." }, { status: 404 });

  const user = await apiUser("export.data");
  if (user instanceof Response) return user;
  if (![].concat(def.perm).some((p) => has(user, p))) {
    return Response.json({ ok: false, error: "Not allowed." }, { status: 403 });
  }

  const sp = Object.fromEntries(request.nextUrl.searchParams.entries());
  const format = sp.format === "csv" ? "csv" : "xls";

  try {
    const rows = await def.fetch(sp, { user, scope: scopeOf(user) });
    await logActivity({
      user,
      action: "export",
      entity,
      summary: `Exported ${rows.length} ${def.title.toLowerCase()} as ${format.toUpperCase()}`,
      after: { filters: sp },
    });

    const name = `medicobharat-${entity}-${istDay()}.${format}`;
    const body = format === "csv" ? toCsv(def.columns, rows) : toXls(def.title, def.columns, rows);
    return new Response(body, {
      headers: {
        "Content-Type": format === "csv" ? "text/csv; charset=utf-8" : "application/vnd.ms-excel; charset=utf-8",
        "Content-Disposition": `attachment; filename="${name}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error(`[crm/export/${entity}]`, err);
    return Response.json({ ok: false, error: "The export failed. Try a smaller date range." }, { status: 500 });
  }
}
