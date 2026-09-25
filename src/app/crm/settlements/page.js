import Link from "next/link";
import { CalendarCheck, Clock3, Download, HandCoins, PauseCircle, Wallet } from "lucide-react";

import FilterBar from "@/components/crm/FilterBar";
import GenerateSettlement from "@/components/crm/partners/GenerateSettlement";
import {
  Badge,
  Card,
  DataTable,
  EmptyState,
  KpiCard,
  PageHeader,
  Pagination,
  btn,
  withParams,
} from "@/components/crm/ui";
import { query } from "@/lib/db";
import { SETTLEMENT_STATUS, SETTLEMENT_STATUSES, settlementCode } from "@/lib/crm/constants";
import { pageOf } from "@/lib/crm/filters";
import { date, day, num, rupees } from "@/lib/crm/format";
import { has, requirePerm, scopeOf } from "@/lib/crm/guard";
import {
  listSettlements,
  settlementFiltersFrom,
  settlementKpis,
  unpaidSettlementsFor,
  unsettledByPartner,
  unsettledFor,
} from "@/lib/crm/stores/settlements";

export const metadata = { title: "Settlements" };
export const dynamic = "force-dynamic";

const StatusBadge = ({ status }) => (
  <Badge tone={SETTLEMENT_STATUS[status]?.tone ?? "slate"}>{SETTLEMENT_STATUS[status]?.label ?? status}</Badge>
);

/**
 * Staff: every partner settlement, what is owed and what was paid, and which
 * labs have completed orders not yet on a statement.
 * A lab partner: "Payments" — its own statements, what it has earned but not
 * yet been billed for, and what has been paid. Never the customer price or
 * MedicoBharat's margin (stripped in the store).
 */
export default async function SettlementsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("settlements.view", "/crm/settlements");
  if (user.isPartner) return <PartnerPayments user={user} sp={sp} />;

  const filters = settlementFiltersFrom(sp);
  const { limit, offset } = pageOf(sp);
  const canManage = has(user, "settlements.manage");
  const canExport = has(user, "export.data");

  const [list, kpis, ready, partners] = await Promise.all([
    listSettlements({ ...filters, limit, offset }, scopeOf(user)),
    settlementKpis(),
    unsettledByPartner(),
    query("SELECT id, name FROM partners WHERE status <> 'deleted' ORDER BY status = 'active' DESC, name").then(([r]) => r),
  ]);
  const href = (changes) => withParams("/crm/settlements", sp, changes);
  const filtered = Boolean(filters.partnerId || filters.status || filters.fromDay || filters.search);

  return (
    <>
      <PageHeader
        title="Settlements"
        description="What MedicoBharat owes each lab for completed orders — generated per period, then paid and recorded."
        actions={
          <>
            {canExport && (
              <a href={withParams("/api/crm/export/settlements", sp, { format: "xls", page: null })} className={btn("secondary")}>
                <Download className="h-4 w-4" aria-hidden /> Export
              </a>
            )}
            {canManage && <GenerateSettlement partners={partners} />}
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Pending payable" value={rupees(kpis.pending_amount)} sub={`${num(kpis.pending_n)} statements`} icon={<Clock3 className="h-4 w-4" />} tone="amber" href={href({ status: "pending", page: null })} />
        <KpiCard label="Processing" value={rupees(kpis.processing_amount)} sub={`${num(kpis.processing_n)} statements`} icon={<Wallet className="h-4 w-4" />} href={href({ status: "processing", page: null })} />
        <KpiCard label="Paid this month" value={rupees(kpis.paid_month)} sub={`${num(kpis.paid_month_n)} statements`} icon={<CalendarCheck className="h-4 w-4" />} tone="emerald" href={href({ status: "paid", page: null })} />
        <KpiCard label="On hold" value={rupees(kpis.hold_amount)} sub={`${num(kpis.hold_n)} statements`} icon={<PauseCircle className="h-4 w-4" />} tone="rose" href={href({ status: "on_hold", page: null })} />
      </div>

      {ready.length > 0 && (
        <Card
          className="mb-5"
          title="Ready to settle"
          description="Completed, accepted orders that are not on any statement yet."
        >
          <ul className="divide-y divide-slate-100">
            {ready.map((r) => (
              <li key={r.partner_id} className="flex flex-col gap-2 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link href={`/crm/partners/${r.partner_id}`} className="text-[13.5px] font-semibold text-slate-900 hover:text-blue-700">
                    {r.partner_name}
                  </Link>
                  <p className="text-[12px] text-slate-500">
                    {num(r.n)} orders · oldest {date(r.oldest)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="text-[14px] font-semibold tabular-nums text-slate-900">{rupees(r.amount)}</span>
                  {canManage && <GenerateSettlement partner={{ id: r.partner_id, name: r.partner_name }} label="Settle" variant="soft" size="sm" />}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <FilterBar
        search={{ placeholder: "Statement no., lab or UTR" }}
        filters={[
          { name: "partner", label: "Lab", options: partners.map((p) => ({ value: String(p.id), label: p.name })) },
          { name: "status", label: "Status", options: SETTLEMENT_STATUSES.map((s) => ({ value: s.key, label: s.label })) },
          { name: "range", label: "Any period", type: "range" },
        ]}
      />

      <DataTable
        id="settlements-table"
        columns={[
          { key: "code", label: "Statement", hideable: false },
          { key: "lab", label: "Lab" },
          { key: "period", label: "Period" },
          { key: "count", label: "Orders", align: "right" },
          { key: "gross", label: "Customer price", align: "right" },
          { key: "payable", label: "Partner cost", align: "right" },
          { key: "margin", label: "MB margin", align: "right" },
          { key: "net", label: "Net payable", align: "right" },
          { key: "paid", label: "Paid", align: "right" },
          { key: "status", label: "Status" },
        ]}
        rows={list.rows}
        rowHref={(s) => `/crm/settlements/${s.id}`}
        cells={(s) => ({
          code: settlementCode(s.id),
          lab: <span className="whitespace-nowrap">{s.partner_name}</span>,
          period: <span className="whitespace-nowrap">{day(s.period_from)} – {day(s.period_to)}</span>,
          count: num(s.bookings_count),
          gross: rupees(s.gross_amount),
          payable: rupees(s.partner_payable),
          margin: <span className={s.margin < 0 ? "font-semibold text-rose-700" : ""}>{rupees(s.margin)}</span>,
          net: (
            <span className="whitespace-nowrap font-semibold text-slate-900">
              {rupees(s.net_payable)}
              {s.adjustments !== 0 && <span className="block text-[11px] font-normal text-slate-500">adj. {s.adjustments > 0 ? "+" : "−"}{rupees(Math.abs(s.adjustments))}</span>}
            </span>
          ),
          paid: s.status === "paid" ? <span className="whitespace-nowrap">{rupees(s.paid_amount)}<span className="block text-[11px] text-slate-500">{day(s.paid_on)}</span></span> : "—",
          status: <StatusBadge status={s.status} />,
        })}
        card={(s) => (
          <Link href={`/crm/settlements/${s.id}`} className="block">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-500">{settlementCode(s.id)} · {num(s.bookings_count)} orders</p>
                <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{s.partner_name}</p>
                <p className="mt-0.5 text-[13px] text-slate-600">{day(s.period_from)} – {day(s.period_to)}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[15px] font-semibold tabular-nums text-slate-900">{rupees(s.net_payable)}</p>
                <p className="text-[11.5px] text-slate-500 tabular-nums">margin {rupees(s.margin)}</p>
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <StatusBadge status={s.status} />
              {s.status === "paid" && <Badge tone="slate" dot={false}>Paid {day(s.paid_on)}</Badge>}
            </div>
          </Link>
        )}
        empty={
          <EmptyState
            icon={<HandCoins className="h-5 w-5" />}
            title={filtered ? "No settlements match these filters" : "No settlements yet"}
            hint={filtered ? "Clear the filters or pick another period." : "Generate a settlement for a lab and period once it has completed orders."}
            action={canManage && !filtered ? <GenerateSettlement partners={partners} /> : null}
          />
        }
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(n) => href({ page: n > 1 ? n : null })} />}
      />
    </>
  );
}

/* ── The lab partner's own "Payments" ───────────────────────────────────── */

async function PartnerPayments({ user, sp }) {
  const { limit, offset } = pageOf(sp);
  const scope = scopeOf(user);
  const [list, unsettled, unpaid, [[last]]] = await Promise.all([
    listSettlements({ status: sp.status || null, limit, offset }, scope),
    unsettledFor(user.partnerId),
    unpaidSettlementsFor(user.partnerId),
    query(
      "SELECT id, paid_amount, paid_on, reference FROM settlements WHERE partner_id = ? AND status = 'paid' ORDER BY paid_on DESC, id DESC LIMIT 1",
      [user.partnerId]
    ),
  ]);
  const href = (changes) => withParams("/crm/settlements", sp, changes);

  return (
    <>
      <PageHeader title="Payments" description="Your statements from MedicoBharat, what has been paid and what is on its way." />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <KpiCard label="Unsettled earnings so far" value={rupees(unsettled.amount)} sub={`${num(unsettled.count)} completed orders not yet on a statement`} icon={<Clock3 className="h-4 w-4" />} tone="amber" />
        <KpiCard label="Payment pending" value={rupees(unpaid.amount)} sub={`${num(unpaid.count)} statements awaiting payment`} icon={<Wallet className="h-4 w-4" />} />
        <KpiCard
          label="Last payment"
          value={last ? rupees(last.paid_amount) : "—"}
          sub={last ? `${day(last.paid_on)}${last.reference ? ` · Ref ${last.reference}` : ""}` : "No payment yet"}
          icon={<CalendarCheck className="h-4 w-4" />}
          tone="emerald"
        />
      </div>

      <FilterBar filters={[{ name: "status", label: "Status", options: SETTLEMENT_STATUSES.filter((s) => s.key !== "void").map((s) => ({ value: s.key, label: s.label })) }]} />

      <DataTable
        id="partner-payments"
        columns={[
          { key: "code", label: "Statement", hideable: false },
          { key: "period", label: "Period" },
          { key: "count", label: "Orders", align: "right" },
          { key: "payable", label: "Your payable", align: "right" },
          { key: "paid", label: "Paid", align: "right" },
          { key: "status", label: "Status" },
          { key: "ref", label: "Reference" },
          { key: "on", label: "Paid on" },
        ]}
        rows={list.rows}
        rowHref={(s) => `/crm/settlements/${s.id}`}
        cells={(s) => ({
          code: settlementCode(s.id),
          period: <span className="whitespace-nowrap">{day(s.period_from)} – {day(s.period_to)}</span>,
          count: num(s.bookings_count),
          payable: <span className="font-semibold text-slate-900">{rupees(s.net_payable)}</span>,
          paid: s.status === "paid" ? rupees(s.paid_amount) : "—",
          status: <StatusBadge status={s.status} />,
          ref: s.reference || "—",
          on: s.paid_on ? day(s.paid_on) : "—",
        })}
        card={(s) => (
          <Link href={`/crm/settlements/${s.id}`} className="block">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-500">{settlementCode(s.id)} · {num(s.bookings_count)} orders</p>
                <p className="mt-0.5 text-[14.5px] font-semibold text-slate-900">{day(s.period_from)} – {day(s.period_to)}</p>
                {s.status === "paid" && (
                  <p className="mt-0.5 text-[12.5px] text-slate-600">
                    Paid {day(s.paid_on)}
                    {s.reference ? ` · Ref ${s.reference}` : ""}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[15px] font-semibold tabular-nums text-slate-900">{rupees(s.net_payable)}</p>
                <StatusBadge status={s.status} />
              </div>
            </div>
          </Link>
        )}
        empty={
          <EmptyState
            icon={<HandCoins className="h-5 w-5" />}
            title="No statements yet"
            hint="MedicoBharat raises a statement for your completed orders each cycle. It appears here, and you are notified when it is paid."
          />
        }
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(n) => href({ page: n > 1 ? n : null })} />}
      />
    </>
  );
}
