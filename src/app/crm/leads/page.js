import Link from "next/link";
import {
  BadgeIndianRupee,
  CalendarClock,
  CheckCircle2,
  Download,
  Percent,
  Phone,
  PhoneCall,
  PhoneMissed,
  Plus,
  UserPlus,
} from "lucide-react";

import { Badge, ButtonLink, DataTable, EmptyState, KpiCard, PageHeader, Pagination, SourceBadge, Tabs, btn, cx, withParams } from "@/components/crm/ui";
import FilterBar, { ColumnToggle } from "@/components/crm/FilterBar";
import LeadBulkBar from "@/components/crm/leads/LeadBulkBar";
import { LEAD_STATUSES, leadCode, leadStatus } from "@/lib/crm/constants";
import { pageOf } from "@/lib/crm/filters";
import { date, day, isPast, num, pct, phone, rupeesShort, telHref } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import { LEAD_CHANNELS, NEEDS_REASON, fromNow, leadFiltersFrom, leadKpis, leadStatusCounts, listLeads } from "@/lib/crm/stores/leads";
import { listCities, listStaff } from "@/lib/crm/stores/lookups";

import { leadBulkAction } from "./actions";

export const metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const PERIODS = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "month", label: "This month" },
];

/**
 * The call centre's lead list: website enquiries and staff-entered leads in
 * one pipeline. The KPI strip answers "how is calling going" for a period;
 * the tabs are the pipeline; filters, search and bulk assign/status do the
 * rest. Everything is filtered in SQL, 25 a page.
 */
export default async function LeadsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("leads.view", "/crm/leads");
  const filters = leadFiltersFrom(sp, { user });
  const { limit, offset } = pageOf(sp);
  const period = PERIODS.some((p) => p.key === sp.period) ? sp.period : "7d";

  const [list, counts, kpi, cities, staff] = await Promise.all([
    listLeads({ ...filters, limit, offset }),
    leadStatusCounts(filters),
    leadKpis(period),
    listCities({ includeInactive: true }),
    listStaff(),
  ]);

  const canManage = has(user, "leads.manage");
  const canExport = has(user, "export.data");
  const href = (changes) => withParams("/crm/leads", sp, changes);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const filtered = Boolean(filters.search || filters.from || filters.channel || filters.city || filters.assignedUserId || filters.unassigned);

  const columns = [
    { key: "lead", label: "Lead", hideable: false },
    { key: "channel", label: "Channel" },
    { key: "interest", label: "Interested in" },
    { key: "place", label: "City / area" },
    { key: "status", label: "Status" },
    { key: "assigned", label: "Assigned" },
    { key: "follow", label: "Follow-up" },
    { key: "created", label: "Created" },
  ];

  return (
    <>
      <PageHeader
        title="Leads"
        description="Every enquiry — website form, phone, WhatsApp, walk-in — worked to a booking."
        actions={
          <>
            {canExport && (
              <a href={withParams("/api/crm/export/leads", sp, { format: "xls", page: null, period: null })} className={btn("secondary")}>
                <Download className="h-4 w-4" aria-hidden /> Export
              </a>
            )}
            <ButtonLink href="/crm/calls">
              <PhoneCall className="h-4 w-4" aria-hidden /> Call log
            </ButtonLink>
            {canManage && (
              <ButtonLink href="/crm/leads/new" variant="primary">
                <Plus className="h-4 w-4" aria-hidden /> New lead
              </ButtonLink>
            )}
          </>
        }
      />

      {/* KPI period — its own URL key, so it never changes the list below. */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12.5px] font-semibold text-slate-500">Performance · {kpi.label}</p>
        <div className="inline-flex rounded-xl bg-white p-1 ring-1 ring-inset ring-slate-200" role="group" aria-label="KPI period">
          {PERIODS.map((p) => (
            <Link
              key={p.key}
              href={href({ period: p.key === "7d" ? null : p.key })}
              aria-current={p.key === period ? "true" : undefined}
              scroll={false}
              className={cx(
                "rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold transition-colors",
                p.key === period ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        <KpiCard label="Total calls" value={num(kpi.calls)} icon={<PhoneCall className="h-4 w-4" />} href={`/crm/calls?range=${period}`} />
        <KpiCard label="Missed calls" value={num(kpi.missed)} sub="Inbound, not answered" tone="rose" icon={<PhoneMissed className="h-4 w-4" />} href={`/crm/calls?range=${period}&direction=inbound&outcome=missed`} />
        <KpiCard label="New leads" value={num(kpi.newLeads)} tone="sky" icon={<UserPlus className="h-4 w-4" />} />
        <KpiCard
          label="Follow-ups due today"
          value={num(kpi.dueToday)}
          sub={kpi.overdue ? `${kpi.overdue} overdue` : "None overdue"}
          tone="amber"
          icon={<CalendarClock className="h-4 w-4" />}
          href={kpi.overdue ? "/crm/follow-ups?tab=overdue" : "/crm/follow-ups"}
        />
        <KpiCard label="Converted leads" value={num(kpi.converted)} sub="Of leads created in the period" tone="emerald" icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Conversion" value={pct(kpi.conversion)} sub={`${kpi.converted} of ${kpi.newLeads}`} tone="violet" icon={<Percent className="h-4 w-4" />} />
        {/* Revenue is shown only to roles that may see revenue. */}
        {has(user, "revenue.view") ? (
          <KpiCard
            label="Revenue from call leads"
            value={rupeesShort(kpi.revenue)}
            sub={`${kpi.revenueBookings} phone/WhatsApp booking${kpi.revenueBookings === 1 ? "" : "s"}`}
            tone="teal"
            icon={<BadgeIndianRupee className="h-4 w-4" />}
          />
        ) : (
          <KpiCard
            label="Bookings from call leads"
            value={num(kpi.revenueBookings)}
            sub="Phone and WhatsApp bookings"
            tone="teal"
            icon={<BadgeIndianRupee className="h-4 w-4" />}
          />
        )}
      </div>

      <Tabs
        active={filters.status ?? "all"}
        tabs={[
          { key: "all", label: "All", href: href({ status: null, page: null }), count: total },
          ...LEAD_STATUSES.map((s) => ({ key: s.key, label: s.label, href: href({ status: s.key, page: null }), count: counts[s.key] ?? 0 })),
        ]}
      />

      <FilterBar
        search={{ placeholder: "Name, mobile or LD code" }}
        filters={[
          { name: "range", label: "Any date", type: "range" },
          { name: "channel", label: "Channel", options: LEAD_CHANNELS.map((c) => ({ value: c.key, label: c.label })) },
          { name: "city", label: "City", options: cities.map((c) => ({ value: c.name, label: c.name })) },
          {
            name: "assigned",
            label: "Assigned",
            options: [{ value: "me", label: "Me" }, { value: "none", label: "Nobody" }, ...staff.map((u) => ({ value: String(u.id), label: u.name || u.email }))],
          },
        ]}
      >
        <ColumnToggle tableId="leads-table" columns={columns} />
      </FilterBar>

      {canManage && list.rows.length > 0 && (
        <LeadBulkBar
          action={leadBulkAction}
          formId="leads-bulk"
          staff={staff.map((u) => ({ value: String(u.id), label: u.name || u.email }))}
          statuses={LEAD_STATUSES.filter((s) => s.key !== "booked").map((s) => ({ value: s.key, label: s.label }))}
          needsReason={NEEDS_REASON}
        />
      )}

      <DataTable
        id="leads-table"
        columns={columns}
        rows={list.rows}
        select={canManage ? { form: "leads-bulk" } : null}
        rowHref={(l) => `/crm/leads/${l.id}`}
        cells={(l) => ({
          lead: (
            <span className="whitespace-nowrap">
              <span className="font-medium text-slate-900">{l.name}</span>
              <span className="block text-[11.5px] font-normal text-slate-500">
                {leadCode(l.id)} · {phone(l.phone)}
              </span>
            </span>
          ),
          channel: <SourceBadge source={l.channel || "website"} />,
          interest: (
            <span className="line-clamp-2 max-w-[15rem]">
              {[l.test, l.interested_package].filter(Boolean).join(" · ") || <span className="text-slate-400">—</span>}
            </span>
          ),
          place: (
            <span className="whitespace-nowrap">
              {l.city || <span className="text-slate-400">—</span>}
              {l.area && <span className="block text-[11.5px] text-slate-500">{l.area}</span>}
            </span>
          ),
          status: <LeadStatusBadge status={l.crm_status} />,
          assigned: l.assigned_name || l.assigned_to || <span className="text-slate-400">—</span>,
          follow: <FollowUpCell l={l} />,
          created: <span className="whitespace-nowrap">{date(l.created_at)}</span>,
        })}
        card={(l) => (
          <div>
            <div className="flex items-start justify-between gap-3">
              <Link href={`/crm/leads/${l.id}`} className="min-w-0">
                <p className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                  {leadCode(l.id)} <SourceBadge source={l.channel || "website"} />
                </p>
                <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{l.name}</p>
                <p className="mt-0.5 line-clamp-1 text-[13px] text-slate-600">
                  {[l.test, l.interested_package, l.city].filter(Boolean).join(" · ") || phone(l.phone)}
                </p>
              </Link>
              <a href={telHref(l.phone)} className={btn("primary", "md", "h-10 w-10 shrink-0 px-0")} aria-label={`Call ${l.name}`}>
                <Phone className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <LeadStatusBadge status={l.crm_status} />
              <FollowUpCell l={l} badge />
              {(l.assigned_name || l.assigned_to) && (
                <Badge tone="slate" dot={false}>
                  {l.assigned_name || l.assigned_to}
                </Badge>
              )}
            </div>
          </div>
        )}
        empty={
          <EmptyState
            icon={<UserPlus className="h-5 w-5" />}
            title={filtered || filters.status ? "No leads match these filters" : "No leads yet"}
            hint={
              filtered || filters.status
                ? "Try another tab, a wider date range, or clear the filters."
                : "Website enquiries land here automatically. Add phone, WhatsApp and walk-in enquiries with New lead."
            }
            action={
              canManage ? (
                <ButtonLink href="/crm/leads/new" variant="primary">
                  <Plus className="h-4 w-4" aria-hidden /> New lead
                </ButtonLink>
              ) : null
            }
          />
        }
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(p) => href({ page: p > 1 ? p : null })} />}
      />
    </>
  );
}

function LeadStatusBadge({ status }) {
  const s = leadStatus(status);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

/** Next pending follow-up (or the admin panel's older call-back date); overdue in rose. */
function FollowUpCell({ l, badge = false }) {
  if (l.next_follow_up) {
    const late = isPast(l.next_follow_up);
    return badge ? (
      <Badge tone={late ? "rose" : "amber"}>{fromNow(l.next_follow_up)}</Badge>
    ) : (
      <span className={cx("whitespace-nowrap", late && "font-semibold text-rose-700")}>
        {date(l.next_follow_up)}
        <span className={cx("block text-[11.5px]", late ? "text-rose-600" : "text-slate-500")}>{fromNow(l.next_follow_up)}</span>
      </span>
    );
  }
  if (l.follow_up_on) {
    return badge ? <Badge tone="slate">Call back {day(l.follow_up_on)}</Badge> : <span className="whitespace-nowrap text-slate-600">{day(l.follow_up_on)}</span>;
  }
  return badge ? null : <span className="text-slate-400">—</span>;
}
