/**
 * Exports owned by the catalogue and system screens:
 *
 *   activity  the activity log, with the same filters as /crm/activity and
 *             the same visibility (listActivity restricts partners and
 *             staff without activity.view — the export cannot widen it)
 *   tests     tests and packages, with the same filters as /crm/tests
 *             (?kind=packages for the packages list). The margin column is
 *             filled only for users who may see revenue.
 */
import { listActivity } from "../activity";
import { TEST_CATEGORY } from "../constants";
import { drain, registerExport } from "../exports";
import { dateRangeOf } from "../filters";
import { has } from "../guard";
import { ROLE_LABEL } from "../permissions";
import { catalogFiltersFrom, listCatalog, TEST_STATUS } from "../stores/catalog";

const d = (v) => (v ? new Date(v).toISOString().replace("T", " ").slice(0, 16) : "");
const n = (v) => (v === null || v === undefined || v === "" ? "" : Number(v));

/** /crm/activity's URL → listActivity filters. Shared with the page. */
export function activityFiltersFrom(sp, user) {
  const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
  const r = dateRangeOf(sp);
  const full = user.role === "owner" || user.perms.includes("activity.view");
  return {
    // listActivity compares against whole days (it appends 00:00:00 / 23:59:59).
    from: r?.fromDay ?? null,
    to: r?.toDay ?? null,
    actorId: full && one(sp.actor) ? Number(one(sp.actor)) || null : null,
    entity: one(sp.entity) || null,
    action: one(sp.action) || null,
    search: one(sp.q).slice(0, 80),
  };
}

registerExport("activity", {
  perm: "activity.view",
  title: "Activity log",
  columns: [
    ["Time (UTC)", (a) => d(a.created_at)],
    ["User", (a) => a.user_name || a.user_email || "System"],
    ["Email", (a) => a.user_email],
    ["Role", (a) => ROLE_LABEL[a.user_role] ?? a.user_role],
    ["Action", (a) => a.action],
    ["Record type", (a) => a.entity],
    ["Record id", (a) => a.entity_id],
    ["Summary", (a) => a.summary],
    ["IP", (a) => a.ip ?? ""],
    ["Device", (a) => a.user_agent ?? ""],
  ],
  fetch: (sp, { user }) => drain((page) => listActivity(user, { ...activityFiltersFrom(sp, user), ...page })),
});

registerExport("tests", {
  perm: "catalog.view",
  title: "Tests and packages",
  columns: [
    ["Id", (t) => t.id],
    ["Code", (t) => t.code],
    ["Name", (t) => t.name],
    ["Package", (t) => (t.is_package ? "Yes" : "No")],
    ["Category", (t) => TEST_CATEGORY[t.crm_category]?.label ?? t.crm_category],
    ["Sample", (t) => t.sample_type],
    ["Fasting", (t) => (t.fasting ? "Yes" : "No")],
    ["TAT (hours)", (t) => n(t.tat_hours)],
    ["Parameters", (t) => n(t.params)],
    ["Price", (t) => (t.price === null ? "Call for price" : t.price)],
    ["MRP", (t) => n(t.mrp)],
    ["Discount %", (t) => n(t.discount_pct)],
    ["Partner price", (t) => n(t.partner_price)],
    ["Margin", (t) => (t.showMargin ? n(t.margin) : "")],
    ["On website", (t) => (t.on_site ? "Yes" : "No")],
    ["Status", (t) => TEST_STATUS[t.status]?.label ?? t.status],
    ["Includes", (t) => t.includes],
  ],
  fetch: async (sp, { user }) => {
    const showMargin = has(user, "revenue.view");
    const rows = await drain((page) =>
      listCatalog({ ...catalogFiltersFrom(sp), isPackage: sp.kind === "packages", ...page })
    );
    return rows.map((r) => ({ ...r, showMargin }));
  },
});
