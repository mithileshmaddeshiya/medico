import Link from "next/link";
import { Download, FlaskConical, Plus } from "lucide-react";

import FilterBar, { ColumnToggle } from "@/components/crm/FilterBar";
import {
  Badge,
  ButtonLink,
  DataTable,
  EmptyState,
  Notice,
  PageHeader,
  Pagination,
  btn,
  withParams,
} from "@/components/crm/ui";
import { AgreementBadge, PartnerRecordBadge } from "@/components/crm/partners/badges";
import { partnerCode } from "@/lib/crm/constants";
import { pageOf } from "@/lib/crm/filters";
import { hours, num, phone, rupees } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import {
  AGREEMENT_STATUSES,
  PARTNER_RECORD_STATUSES,
  listPartners,
  partnerFiltersFrom,
} from "@/lib/crm/stores/partners";
import { listCities } from "@/lib/crm/stores/lookups";

export const metadata = { title: "Lab partners" };
export const dynamic = "force-dynamic";

/**
 * Every lab MedicoBharat sends samples to, with how each is performing:
 * orders assigned, open, completed, report turnaround, the revenue its orders
 * brought in and what MedicoBharat still owes it. Figures are computed from
 * bookings and settlements for the partners on this page only.
 */
export default async function PartnersPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("partners.view", "/crm/partners");
  const filters = partnerFiltersFrom(sp);
  const { limit, offset } = pageOf(sp);

  const [list, cities] = await Promise.all([listPartners({ ...filters, limit, offset }), listCities()]);

  const canManage = has(user, "partners.manage");
  const canExport = has(user, "export.data");
  const canMoney = has(user, "revenue.view") || has(user, "settlements.view");
  const href = (changes) => withParams("/crm/partners", sp, changes);
  const filtered = Boolean(filters.search || filters.status || filters.cityId || filters.agreement);

  const columns = [
    { key: "lab", label: "Lab", hideable: false },
    { key: "contact", label: "Contact" },
    { key: "status", label: "Status" },
    { key: "agreement", label: "Agreement" },
    { key: "assigned", label: "Assigned", align: "right" },
    { key: "pending", label: "Open", align: "right" },
    { key: "completed", label: "Completed", align: "right" },
    { key: "tat", label: "Avg turnaround", align: "right" },
    ...(canMoney
      ? [
          { key: "revenue", label: "Revenue", align: "right" },
          { key: "payable", label: "Payable pending", align: "right" },
        ]
      : []),
  ];

  return (
    <>
      <PageHeader
        title="Lab partners"
        description="Labs that process MedicoBharat samples — their workload, turnaround and what is owed to them."
        actions={
          <>
            {canExport && (
              <a href={withParams("/api/crm/export/partners", sp, { format: "xls", page: null })} className={btn("secondary")}>
                <Download className="h-4 w-4" aria-hidden /> Export
              </a>
            )}
            {canManage && (
              <ButtonLink href="/crm/partners/new" variant="primary">
                <Plus className="h-4 w-4" aria-hidden /> Add partner
              </ButtonLink>
            )}
          </>
        }
      />

      {sp.removed && (
        <div className="mb-4">
          <Notice tone="slate">Partner removed. Its orders, settlements and history are kept.</Notice>
        </div>
      )}

      <FilterBar
        search={{ placeholder: "Lab, contact person or mobile" }}
        filters={[
          { name: "status", label: "Status", options: PARTNER_RECORD_STATUSES.map((s) => ({ value: s.key, label: s.label })) },
          { name: "city", label: "City", options: cities.map((c) => ({ value: String(c.id), label: c.name })) },
          { name: "agreement", label: "Agreement", options: AGREEMENT_STATUSES.map((a) => ({ value: a.key, label: a.label })) },
        ]}
      >
        <ColumnToggle tableId="partners-table" columns={columns} />
      </FilterBar>

      <DataTable
        id="partners-table"
        columns={columns}
        rows={list.rows}
        rowHref={(p) => `/crm/partners/${p.id}`}
        cells={(p) => ({
          lab: (
            <span className="block min-w-[12rem]">
              {p.name}
              <span className="block text-[11.5px] font-normal text-slate-500">
                {partnerCode(p.id)}
                {p.city ? ` · ${p.city}` : ""}
              </span>
            </span>
          ),
          contact: (
            <span className="whitespace-nowrap">
              {p.contact_person || <span className="text-slate-400">—</span>}
              {p.phone && <span className="block text-[11.5px] text-slate-500">{phone(p.phone)}</span>}
            </span>
          ),
          status: <PartnerRecordBadge status={p.status} />,
          agreement: <AgreementBadge status={p.agreement_status} />,
          assigned: num(p.assigned),
          pending: p.awaiting ? (
            <span className="whitespace-nowrap">
              {num(p.pending)}
              <span className="block text-[11px] font-semibold text-amber-700">{p.awaiting} to accept</span>
            </span>
          ) : (
            num(p.pending)
          ),
          completed: num(p.completed),
          tat: hours(p.avg_tat_hours),
          revenue: rupees(p.revenue),
          payable: Number(p.payable_pending) > 0 ? <span className="font-semibold text-slate-900">{rupees(p.payable_pending)}</span> : rupees(0),
        })}
        card={(p) => (
          <Link href={`/crm/partners/${p.id}`} className="block">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-500">
                  {partnerCode(p.id)}
                  {p.city ? ` · ${p.city}` : ""}
                </p>
                <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{p.name}</p>
                <p className="mt-0.5 text-[13px] text-slate-600">
                  {[p.contact_person, p.phone && phone(p.phone)].filter(Boolean).join(" · ") || "No contact yet"}
                </p>
              </div>
              {canMoney && Number(p.payable_pending) > 0 && (
                <div className="shrink-0 text-right">
                  <p className="text-[11px] text-slate-500">Payable</p>
                  <p className="text-[15px] font-semibold text-slate-900 tabular-nums">{rupees(p.payable_pending)}</p>
                </div>
              )}
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <PartnerRecordBadge status={p.status} />
              <AgreementBadge status={p.agreement_status} />
              {p.awaiting > 0 && <Badge tone="amber">{p.awaiting} to accept</Badge>}
            </div>
            <dl className="mt-3 grid grid-cols-4 gap-2 border-t border-slate-100 pt-2.5 text-center text-[12px]">
              <Stat label="Assigned" value={num(p.assigned)} />
              <Stat label="Open" value={num(p.pending)} />
              <Stat label="Done" value={num(p.completed)} />
              <Stat label="TAT" value={hours(p.avg_tat_hours)} />
            </dl>
          </Link>
        )}
        empty={
          <EmptyState
            icon={<FlaskConical className="h-5 w-5" />}
            title={filtered ? "No labs match these filters" : "No lab partners yet"}
            hint={filtered ? "Clear the filters or search for another name." : "Add the labs you send samples to, then assign bookings to them."}
            action={
              canManage && !filtered ? (
                <ButtonLink href="/crm/partners/new" variant="primary">
                  <Plus className="h-4 w-4" aria-hidden /> Add partner
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

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900 tabular-nums">{value}</dd>
    </div>
  );
}
