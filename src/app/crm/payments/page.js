import Link from "next/link";
import { Banknote, CalendarDays, Download, Globe, Hourglass, IndianRupee, Plus, Smartphone, Undo2, Wallet } from "lucide-react";

import {
  Badge,
  ButtonLink,
  Card,
  DataTable,
  EmptyState,
  KpiCard,
  PageHeader,
  Pagination,
  PaymentModeBadge,
  btn,
  withParams,
} from "@/components/crm/ui";
import { ConfirmAction, QuickAction } from "@/components/crm/forms";
import FilterBar, { ColumnToggle } from "@/components/crm/FilterBar";
import ShareBar from "@/components/crm/finance/ShareBar";
import { MODE_COLOR } from "@/components/crm/finance/palette";
import { has, requirePerm } from "@/lib/crm/guard";
import { PAYMENT_MODES, TXN_STATUS, TXN_STATUSES, bookingCode, paymentCode } from "@/lib/crm/constants";
import { range } from "@/lib/crm/dates";
import { pageOf } from "@/lib/crm/filters";
import { dateTime, phone, rupees, rupeesShort, time } from "@/lib/crm/format";
import { collectionByMode, listPayments, paymentFiltersFrom, paymentKpis } from "@/lib/crm/stores/finance";
import { listStaff } from "@/lib/crm/stores/lookups";

import { paymentStatusAction } from "../bookings/actions";

export const metadata = { title: "Payments" };
export const dynamic = "force-dynamic";

/**
 * Money in. The strip on top is cash actually received (status 'paid'),
 * in IST periods, each against the same stretch of the previous period;
 * pending payments are shown apart as "Pending amount", never as revenue.
 * Below: every payment row, filtered and paginated in SQL, with the two
 * corrections staff may make — confirm a pending payment, or void a mistake.
 * A verified gateway payment is locked: it can only be refunded.
 */
export default async function PaymentsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("payments.view", "/crm/payments");
  const filters = paymentFiltersFrom(sp);
  const { limit, offset } = pageOf(sp);
  const modeRange = filters.from ? { from: filters.from, to: filters.to, label: filters.rangeLabel } : range("month");

  const [k, list, byMode, staff] = await Promise.all([
    paymentKpis(),
    listPayments({ ...filters, limit, offset }),
    collectionByMode(modeRange),
    listStaff(),
  ]);

  const canManage = has(user, "payments.manage");
  const canExport = has(user, "export.data");
  const href = (changes) => withParams("/crm/payments", sp, changes);
  const filtered = Boolean(filters.search || filters.from || filters.mode || filters.status || filters.collectorId);

  const columns = [
    { key: "txn", label: "Txn", hideable: false },
    { key: "booking", label: "Booking" },
    { key: "customer", label: "Customer" },
    { key: "amount", label: "Amount", align: "right" },
    { key: "mode", label: "Mode" },
    { key: "status", label: "Status" },
    { key: "by", label: "Collected by" },
    { key: "ref", label: "Reference" },
    { key: "notes", label: "Notes" },
    ...(canManage ? [{ key: "actions", label: "", hideable: false }] : []),
  ];

  const modeTotal = byMode.reduce((a, m) => a + m.amount, 0);

  return (
    <>
      <PageHeader
        title="Payments"
        description="Money received against bookings — cash, UPI and online — and what is still due."
        actions={
          <>
            {canExport && (
              <a href={withParams("/api/crm/export/payments", sp, { format: "xls", page: null })} className={btn("secondary")}>
                <Download className="h-4 w-4" aria-hidden /> Export
              </a>
            )}
            {canManage && (
              <ButtonLink href="/crm/payments/new" variant="primary">
                <Plus className="h-4 w-4" aria-hidden /> Record payment
              </ButtonLink>
            )}
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <KpiCard label="Today's collection" value={rupeesShort(k.today)} current={k.today} previous={k.yesterday} compareLabel="vs yesterday" spark={k.spark} icon={<Wallet className="h-4 w-4" />} />
        <KpiCard label="This week" value={rupeesShort(k.week)} current={k.week} previous={k.lastWeek} compareLabel="vs same days last week" icon={<CalendarDays className="h-4 w-4" />} />
        <KpiCard label="This month" value={rupeesShort(k.month)} current={k.month} previous={k.lastMonth} compareLabel="vs same days last month" icon={<IndianRupee className="h-4 w-4" />} />
        <KpiCard label="Total revenue (all time)" value={rupeesShort(k.allTimeNet)} sub="Received, net of processed refunds" tone="emerald" icon={<IndianRupee className="h-4 w-4" />} />
        <KpiCard
          label="Pending amount"
          value={rupeesShort(k.pendingAmount)}
          sub={`Due on ${k.pendingBookings.toLocaleString("en-IN")} open booking${k.pendingBookings === 1 ? "" : "s"} · not revenue`}
          tone="amber"
          icon={<Hourglass className="h-4 w-4" />}
        />
        <KpiCard label="Refunds this month" value={rupeesShort(k.refunds)} current={k.refunds} previous={k.refundsPrev} upIsGood={false} compareLabel="vs same days last month" href="/crm/refunds?status=processed" tone="rose" icon={<Undo2 className="h-4 w-4" />} />
        <KpiCard label="Online revenue · month" value={rupeesShort(k.online)} current={k.online} previous={k.onlinePrev} compareLabel="vs last month" tone="sky" icon={<Globe className="h-4 w-4" />} />
        <KpiCard label="Cash revenue · month" value={rupeesShort(k.cash)} current={k.cash} previous={k.cashPrev} compareLabel="vs last month" tone="amber" icon={<Banknote className="h-4 w-4" />} />
        <KpiCard label="UPI revenue · month" value={rupeesShort(k.upi)} current={k.upi} previous={k.upiPrev} compareLabel="vs last month" tone="violet" icon={<Smartphone className="h-4 w-4" />} />
      </div>

      <FilterBar
        search={{ placeholder: "PAY code, booking ID, UTR, customer name or mobile" }}
        filters={[
          { name: "range", label: "Any date", type: "range" },
          { name: "mode", label: "Mode", options: PAYMENT_MODES.map((m) => ({ value: m.key, label: m.label })) },
          { name: "status", label: "Status", options: TXN_STATUSES.map((s) => ({ value: s.key, label: s.label })) },
          { name: "collector", label: "Collected by", options: staff.map((s) => ({ value: String(s.id), label: s.name || s.email })) },
        ]}
      >
        <ColumnToggle tableId="payments-table" columns={columns} />
      </FilterBar>

      <div className="mb-4">
        <Card
          title="Collection by mode"
          description={`Money received (paid) · ${modeRange.label ?? "selected period"} · ${rupees(modeTotal)}`}
        >
          <ShareBar
            label={`Collection by payment mode, ${modeRange.label ?? "selected period"}`}
            segments={PAYMENT_MODES.map((m) => {
              const row = byMode.find((x) => x.mode === m.key);
              return {
                key: m.key,
                label: m.label,
                value: row?.amount ?? 0,
                display: rupees(row?.amount ?? 0),
                sub: row ? `${row.count} txn` : null,
                color: MODE_COLOR[m.key],
              };
            })}
            empty="No money received in this period."
          />
        </Card>
      </div>

      <DataTable
        id="payments-table"
        columns={columns}
        rows={list.rows}
        cells={(p) => ({
          txn: (
            <span className="whitespace-nowrap">
              <span className="font-semibold text-slate-900">{paymentCode(p.id)}</span>
              <span className="block text-[11.5px] text-slate-500">{dateTime(p.received_at)}</span>
            </span>
          ),
          booking: p.booking_id ? (
            <Link href={`/crm/bookings/${p.booking_id}`} className="font-medium text-blue-700 hover:underline">
              {bookingCode(p.booking_id)}
            </Link>
          ) : (
            <span className="text-slate-400">—</span>
          ),
          customer: <Customer p={p} />,
          amount: <span className="font-semibold text-slate-900">{rupees(p.amount)}</span>,
          mode: <PaymentModeBadge mode={p.mode} />,
          status: <TxnBadge status={p.status} gateway={p.gateway_payment_id} />,
          by: <span className="whitespace-nowrap">{p.collected_by_name || (p.gateway_payment_id ? "Website" : "—")}</span>,
          ref: <span className="block max-w-[10rem] truncate font-mono text-[12px]">{p.reference || p.gateway_payment_id || "—"}</span>,
          notes: <span className="line-clamp-2 max-w-[14rem] text-[12.5px] text-slate-500">{p.notes || "—"}</span>,
          actions: <RowActions p={p} canManage={canManage} />,
        })}
        card={(p) => (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-500">
                  {paymentCode(p.id)} · {time(p.received_at)}
                  {p.booking_id && (
                    <>
                      {" · "}
                      <Link href={`/crm/bookings/${p.booking_id}`} className="text-blue-700">
                        {bookingCode(p.booking_id)}
                      </Link>
                    </>
                  )}
                </p>
                <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{p.patient_name || p.customer_name || "—"}</p>
                <p className="mt-0.5 text-[12.5px] text-slate-500">{dateTime(p.received_at)}{p.collected_by_name ? ` · by ${p.collected_by_name}` : ""}</p>
              </div>
              <p className="shrink-0 text-[15px] font-semibold text-slate-900 tabular-nums">{rupees(p.amount)}</p>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <PaymentModeBadge mode={p.mode} />
              <TxnBadge status={p.status} gateway={p.gateway_payment_id} />
              {p.reference && <span className="truncate font-mono text-[11.5px] text-slate-500">{p.reference}</span>}
            </div>
            {canManage && (
              <div className="mt-3 flex flex-wrap gap-2 empty:hidden">
                <RowActions p={p} canManage={canManage} />
              </div>
            )}
          </div>
        )}
        empty={
          <EmptyState
            icon={<Wallet className="h-5 w-5" />}
            title={filtered ? "No payments match these filters" : "No payments yet"}
            hint={filtered ? "Try a wider date range or clear the filters." : "Payments appear here when they are recorded on a booking or verified from the website."}
            action={
              canManage ? (
                <ButtonLink href="/crm/payments/new" variant="primary">
                  <Plus className="h-4 w-4" aria-hidden /> Record payment
                </ButtonLink>
              ) : null
            }
          />
        }
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="px-1 pt-3 text-[12.5px] text-slate-600">
              In this view: <span className="font-semibold text-slate-900 tabular-nums">{rupees(list.paidSum)}</span> received
              {list.pendingSum > 0 && (
                <>
                  {" · "}
                  <span className="font-semibold tabular-nums text-orange-700">{rupees(list.pendingSum)}</span> pending
                </>
              )}
            </p>
            <Pagination total={list.total} limit={limit} offset={offset} hrefFor={(pg) => href({ page: pg > 1 ? pg : null })} />
          </div>
        }
      />
    </>
  );
}

function RowActions({ p, canManage }) {
  if (!canManage) return null;
  if (p.gateway_payment_id) return <span className="text-[11.5px] text-slate-400" title="Verified online payment — refund it instead">Locked</span>;
  return (
    <div className="flex items-center justify-end gap-1.5">
      {p.status === "pending" && (
        <QuickAction action={paymentStatusAction} fields={{ paymentId: p.id, status: "paid" }} size="sm" variant="soft" pendingLabel="Saving…">
          Mark paid
        </QuickAction>
      )}
      {p.status !== "void" && (
        <ConfirmAction
          action={paymentStatusAction}
          fields={{ paymentId: p.id, status: "void" }}
          label="Void"
          size="sm"
          variant="ghost"
          title={`Void ${paymentCode(p.id)}?`}
          body={`${rupees(p.amount)} ${p.mode.toUpperCase()} stays on record, marked void, and no longer counts as paid on ${bookingCode(p.booking_id)}.`}
          reason
          confirmLabel="Void payment"
        />
      )}
    </div>
  );
}

function Customer({ p }) {
  const name = p.patient_name || p.customer_name;
  const mobile = p.patient_phone || p.customer_phone;
  return name ? (
    <span className="whitespace-nowrap">
      <span className="font-medium text-slate-900">{name}</span>
      {mobile && <span className="block text-[11.5px] text-slate-500">{phone(mobile)}</span>}
    </span>
  ) : (
    <span className="text-slate-400">—</span>
  );
}

function TxnBadge({ status, gateway }) {
  const s = TXN_STATUS[status];
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <Badge tone={s?.tone ?? "slate"}>{s?.label ?? status}</Badge>
      {gateway && (
        <Badge tone="blue" dot={false} title="Verified by the payment gateway">
          Gateway
        </Badge>
      )}
    </span>
  );
}
