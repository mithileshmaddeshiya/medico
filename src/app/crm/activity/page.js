import Link from "next/link";
import { Activity, Download } from "lucide-react";

import FilterBar from "@/components/crm/FilterBar";
import { ChangesTable, deviceOf, diffOf, linkOf } from "@/components/crm/system/ActivityChanges";
import { Badge, EmptyState, PageHeader, Pagination, SURFACE, btn, cx, withParams } from "@/components/crm/ui";
import { listActivity } from "@/lib/crm/activity";
import { activityFiltersFrom } from "@/lib/crm/exporters/system";
import { pageOf } from "@/lib/crm/filters";
import { dateTime } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import { ROLE_LABEL } from "@/lib/crm/permissions";
import { listStaff } from "@/lib/crm/stores/lookups";

export const metadata = { title: "Activity log" };
export const dynamic = "force-dynamic";

const ENTITIES = [
  ["bookings", "Bookings"],
  ["customers", "Customers"],
  ["leads", "Leads"],
  ["calls", "Calls"],
  ["follow_ups", "Follow-ups"],
  ["partners", "Lab partners"],
  ["payments", "Payments"],
  ["refunds", "Refunds"],
  ["expenses", "Expenses"],
  ["settlements", "Settlements"],
  ["reports", "Reports"],
  ["lab_tests", "Tests & packages"],
  ["service_cities", "Cities"],
  ["service_areas", "Areas"],
  ["admin_users", "Users & sign-ins"],
  ["roles", "Role permissions"],
  ["settings", "Settings"],
];
const ENTITY_LABEL = Object.fromEntries(ENTITIES);

const ACTIONS = [
  "create", "update", "status", "assign", "accept", "reject", "upload", "verify", "send", "payment",
  "refund", "note", "delete", "archive", "restore", "export", "login", "logout",
];

const ROLE_TONE = { owner: "violet", partner: "indigo", system: "slate" };

/**
 * Who did what, when. listActivity() decides what each person may see: a
 * lab partner only rows about their own lab, staff without activity.view
 * only their own actions. IP and device are shown to activity.view only.
 */
export default async function ActivityPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm(null, "/crm/activity");
  const full = has(user, "activity.view");
  const filters = activityFiltersFrom(sp, user);
  const { limit, offset } = pageOf(sp);

  const [list, staff] = await Promise.all([listActivity(user, { ...filters, limit, offset }), full ? listStaff() : []]);
  const canExport = full && has(user, "export.data");
  const href = (changes) => withParams("/crm/activity", sp, changes);
  const filtered = Boolean(filters.from || filters.actorId || filters.entity || filters.action || filters.search);

  return (
    <>
      <PageHeader
        title={full ? "Activity log" : user.isPartner ? "Activity" : "Your activity"}
        description={
          full
            ? "Every change in the CRM and the website admin: who, what, when, and what it was before."
            : user.isPartner
              ? "Changes made on your lab's orders, reports and settlements."
              : "Changes you have made. The full log is visible to managers and the owner."
        }
        actions={
          canExport && (
            <a href={withParams("/api/crm/export/activity", sp, { format: "xls", page: null })} className={btn("secondary")}>
              <Download className="h-4 w-4" aria-hidden /> Export
            </a>
          )
        }
      />

      <FilterBar
        search={{ placeholder: "Summary, record id or email" }}
        filters={[
          { name: "range", label: "Any date", type: "range" },
          ...(full ? [{ name: "actor", label: "Person", options: staff.map((s) => ({ value: String(s.id), label: s.name || s.email })) }] : []),
          { name: "entity", label: "Record", options: ENTITIES.map(([value, label]) => ({ value, label })) },
          { name: "action", label: "Action", options: ACTIONS.map((a) => ({ value: a, label: a.charAt(0).toUpperCase() + a.slice(1) })) },
        ]}
      />

      {list.rows.length ? (
        <ol className={cx(SURFACE, "divide-y divide-slate-100 overflow-hidden")}>
          {list.rows.map((row) => {
            const changes = diffOf(row);
            const link = linkOf(row);
            const device = full ? deviceOf(row.user_agent) : null;
            return (
              <li key={row.id} className="px-4 py-3.5 sm:px-5">
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
                      <span className="font-semibold text-slate-900">{row.user_name || row.user_email || "System"}</span>
                      <Badge tone={ROLE_TONE[row.user_role] ?? "blue"} dot={false}>
                        {ROLE_LABEL[row.user_role] ?? (row.user_role || "Website admin")}
                      </Badge>
                      <span className="text-[11.5px] uppercase tracking-[0.05em] text-slate-400">{row.action}</span>
                    </p>
                    <p className="mt-1 text-[14px] leading-snug text-slate-800">{row.summary || `${row.action} ${ENTITY_LABEL[row.entity] ?? row.entity}`}</p>
                    <p className="mt-1 flex flex-wrap gap-x-2 text-[12px] text-slate-500">
                      <span>{ENTITY_LABEL[row.entity] ?? row.entity}</span>
                      {row.entity_id && (
                        link ? (
                          <Link href={link} className="font-medium text-blue-700 hover:underline">
                            {row.entity === "bookings" ? `MB${row.entity_id}` : row.entity_id} →
                          </Link>
                        ) : (
                          <span>#{row.entity_id}</span>
                        )
                      )}
                      {!row.entity_id && link && (
                        <Link href={link} className="font-medium text-blue-700 hover:underline">
                          Open →
                        </Link>
                      )}
                    </p>
                  </div>
                  <div className="shrink-0 text-[12px] text-slate-500 sm:text-right">
                    <time dateTime={new Date(row.created_at).toISOString()}>{dateTime(row.created_at)}</time>
                    {full && (row.ip || device) && (
                      <p className="mt-0.5 text-[11.5px] text-slate-400">{[device, row.ip].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                </div>
                {changes.length > 0 && (
                  <details className="group mt-2">
                    <summary className="inline-flex min-h-8 cursor-pointer select-none items-center text-[12.5px] font-semibold text-blue-700 hover:text-blue-800">
                      Changes ({changes.length})
                    </summary>
                    <div className="mt-2">
                      <ChangesTable changes={changes} />
                    </div>
                  </details>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <div className={SURFACE}>
          <EmptyState
            icon={<Activity className="h-5 w-5" />}
            title={filtered ? "Nothing matches these filters" : "No activity yet"}
            hint={filtered ? "Try a wider date range or clear a filter." : "Changes appear here as people work."}
          />
        </div>
      )}
      <Pagination total={list.total} limit={limit} offset={offset} hrefFor={(p) => href({ page: p > 1 ? p : null })} />
    </>
  );
}
