import Link from "next/link";
import { Clock, Download, Phone, PhoneCall, PhoneIncoming, PhoneMissed, PhoneOutgoing } from "lucide-react";

import { Badge, DataTable, EmptyState, KpiCard, PageHeader, Pagination, btn, withParams } from "@/components/crm/ui";
import { FormModal } from "@/components/crm/forms";
import FilterBar from "@/components/crm/FilterBar";
import { CallFields } from "@/components/crm/leads/fields";
import { CALL_OUTCOME, CALL_OUTCOMES, customerCode, leadCode } from "@/lib/crm/constants";
import { pageOf } from "@/lib/crm/filters";
import { dateTime, num, phone, telHref } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import { callFiltersFrom, callStats, duration, listCalls } from "@/lib/crm/stores/leads";
import { listStaff } from "@/lib/crm/stores/lookups";

import { logCallAction } from "./actions";

export const metadata = { title: "Calls" };
export const dynamic = "force-dynamic";

// FilterBar's default ranges plus "last 7 days", which the leads KPI strip
// links to. (Spelled out: a value exported from a client module is only a
// reference on the server.)
const RANGES = [
  { value: "", label: "Any date" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This week" },
  { value: "7d", label: "Last 7 days" },
  { value: "month", label: "This month" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "custom", label: "Custom…" },
];

/**
 * The call log: every inbound and outbound call, who took it and how it
 * went. The KPI strip describes exactly the calls the filters select.
 */
export default async function CallsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("leads.view", "/crm/calls");
  const filters = callFiltersFrom(sp, { user });
  const { limit, offset } = pageOf(sp);

  const [list, stats, staff] = await Promise.all([listCalls({ ...filters, limit, offset }), callStats(filters), listStaff()]);

  const canManage = has(user, "leads.manage");
  const canExport = has(user, "export.data");
  const href = (changes) => withParams("/crm/calls", sp, changes);
  const filtered = Boolean(filters.search || filters.from || filters.direction || filters.outcome || filters.userId);
  const scope = filters.rangeLabel ?? "All time";

  const logButton = canManage ? (
    <FormModal
      action={logCallAction}
      label="Log a call"
      icon={<PhoneCall className="h-4 w-4" aria-hidden />}
      title="Log a call"
      description="The number is matched to its lead and customer automatically."
      submitLabel="Log call"
    >
      <CallFields p="log" createLead defaultDirection="inbound" />
    </FormModal>
  ) : null;

  const columns = [
    { key: "who", label: "Caller", hideable: false },
    { key: "direction", label: "Direction" },
    { key: "outcome", label: "Outcome" },
    { key: "duration", label: "Duration", align: "right" },
    { key: "link", label: "Lead / customer" },
    { key: "notes", label: "Notes" },
    { key: "staff", label: "Staff" },
    { key: "when", label: "When" },
  ];

  return (
    <>
      <PageHeader
        title="Calls"
        description="Every call in and out, with its outcome — the call centre's record of work."
        actions={
          <>
            {canExport && (
              <a href={withParams("/api/crm/export/calls", sp, { format: "xls", page: null })} className={btn("secondary")}>
                <Download className="h-4 w-4" aria-hidden /> Export
              </a>
            )}
            {logButton}
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiCard label="Total calls" value={num(stats.total)} sub={scope} icon={<PhoneCall className="h-4 w-4" />} />
        <KpiCard label="Inbound" value={num(stats.inbound)} tone="sky" icon={<PhoneIncoming className="h-4 w-4" />} href={href({ direction: "inbound", outcome: null, page: null })} />
        <KpiCard
          label="Outbound"
          value={num(stats.outbound)}
          sub={stats.unreached ? `${stats.unreached} not reached` : null}
          tone="indigo"
          icon={<PhoneOutgoing className="h-4 w-4" />}
          href={href({ direction: "outbound", outcome: null, page: null })}
        />
        <KpiCard label="Missed" value={num(stats.missed)} sub="Inbound, not answered" tone="rose" icon={<PhoneMissed className="h-4 w-4" />} href={href({ direction: "inbound", outcome: "missed", page: null })} />
        <KpiCard label="Avg. duration" value={stats.avgSec ? duration(stats.avgSec) : "—"} sub="Answered calls" tone="slate" icon={<Clock className="h-4 w-4" />} />
      </div>

      <FilterBar
        search={{ placeholder: "Mobile or name" }}
        filters={[
          { name: "range", label: "Any date", type: "range", options: RANGES },
          { name: "direction", label: "Direction", options: [{ value: "inbound", label: "Inbound" }, { value: "outbound", label: "Outbound" }] },
          { name: "outcome", label: "Outcome", options: CALL_OUTCOMES.map((o) => ({ value: o.key, label: o.label })) },
          { name: "staff", label: "Staff", options: [{ value: "me", label: "Me" }, ...staff.map((u) => ({ value: String(u.id), label: u.name || u.email }))] },
        ]}
      />

      <DataTable
        id="calls-table"
        columns={columns}
        rows={list.rows}
        cells={(c) => ({
          who: (
            <span className="whitespace-nowrap">
              <span className="font-medium text-slate-900">{c.name || c.lead_name || c.customer_name || "Unknown"}</span>
              <a href={telHref(c.phone)} className="block text-[11.5px] text-blue-700 hover:underline">
                {phone(c.phone)}
              </a>
            </span>
          ),
          direction: <DirectionLabel direction={c.direction} />,
          outcome: <Badge tone={CALL_OUTCOME[c.outcome]?.tone}>{CALL_OUTCOME[c.outcome]?.label ?? c.outcome}</Badge>,
          duration: duration(c.duration_sec),
          link: <Links c={c} />,
          notes: <span className="line-clamp-2 max-w-[16rem] text-slate-600">{c.notes || "—"}</span>,
          staff: c.user_name || <span className="text-slate-400">—</span>,
          when: <span className="whitespace-nowrap">{dateTime(c.called_at)}</span>,
        })}
        card={(c) => (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-500">
                  <DirectionLabel direction={c.direction} /> · {dateTime(c.called_at)}
                </p>
                <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{c.name || c.lead_name || c.customer_name || phone(c.phone)}</p>
                {c.notes && <p className="mt-0.5 line-clamp-2 text-[13px] text-slate-600">{c.notes}</p>}
              </div>
              <a href={telHref(c.phone)} className={btn("primary", "md", "h-10 w-10 shrink-0 px-0")} aria-label={`Call ${phone(c.phone)}`}>
                <Phone className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <Badge tone={CALL_OUTCOME[c.outcome]?.tone}>{CALL_OUTCOME[c.outcome]?.label ?? c.outcome}</Badge>
              {c.duration_sec > 0 && <Badge tone="slate" dot={false}>{duration(c.duration_sec)}</Badge>}
              <Links c={c} />
            </div>
          </div>
        )}
        empty={
          <EmptyState
            icon={<PhoneCall className="h-5 w-5" />}
            title={filtered ? "No calls match these filters" : "No calls logged yet"}
            hint={filtered ? "Try a wider date range or clear the filters." : "Log each call as it ends — outcome and a line of notes is enough."}
            action={logButton}
          />
        }
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(p) => href({ page: p > 1 ? p : null })} />}
      />
    </>
  );
}

function DirectionLabel({ direction }) {
  return direction === "inbound" ? (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-sky-700">
      <PhoneIncoming className="h-3.5 w-3.5" aria-hidden /> Inbound
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-indigo-700">
      <PhoneOutgoing className="h-3.5 w-3.5" aria-hidden /> Outbound
    </span>
  );
}

function Links({ c }) {
  if (!c.lead_id && !c.customer_id) return <span className="text-slate-400">—</span>;
  return (
    <span className="inline-flex flex-wrap gap-x-2 text-[12.5px]">
      {c.lead_id && (
        <Link href={`/crm/leads/${c.lead_id}`} className="font-semibold text-blue-700 hover:underline">
          {leadCode(c.lead_id)}
        </Link>
      )}
      {c.customer_id && (
        <Link href={`/crm/customers/${c.customer_id}`} className="font-semibold text-blue-700 hover:underline">
          {customerCode(c.customer_id)}
        </Link>
      )}
    </span>
  );
}
