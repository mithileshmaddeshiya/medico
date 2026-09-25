import Link from "next/link";
import { CheckCircle2, Download, Undo2 } from "lucide-react";

import {
  Badge,
  DataTable,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Pagination,
  PaymentModeBadge,
  Select,
  Tabs,
  btn,
  withParams,
} from "@/components/crm/ui";
import { ConfirmAction, FormModal, QuickAction } from "@/components/crm/forms";
import FilterBar from "@/components/crm/FilterBar";
import RefundRequestFields from "@/components/crm/finance/RefundRequestFields";
import { has, requirePerm } from "@/lib/crm/guard";
import { PAYMENT_MODES, REFUND_STATUS, REFUND_STATUSES, bookingCode } from "@/lib/crm/constants";
import { istDay } from "@/lib/crm/dates";
import { pageOf } from "@/lib/crm/filters";
import { date, dateTime, phone, rupees } from "@/lib/crm/format";
import { listRefunds, refundCode, refundFiltersFrom } from "@/lib/crm/stores/finance";

import { refundStepAction, requestRefundAction } from "./actions";

export const metadata = { title: "Refunds" };
export const dynamic = "force-dynamic";

/**
 * Money going back to customers, as a four-step trail: requested → approved
 * → processed (or rejected). Only a processed refund changes the booking's
 * figures and counts against revenue; each step is logged with before/after.
 * The amount is capped by what was actually paid, net of other refunds.
 */
export default async function RefundsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm(["payments.view", "refunds.manage"], "/crm/refunds");
  const filters = refundFiltersFrom(sp);
  const { limit, offset } = pageOf(sp);
  const list = await listRefunds({ ...filters, limit, offset });

  const canAct = has(user, "refunds.manage");
  const canExport = has(user, "export.data") && has(user, "payments.view");
  const href = (changes) => withParams("/crm/refunds", sp, changes);
  const all = Object.values(list.counts).reduce((a, b) => a + b, 0);
  const today = istDay();

  const columns = [
    { key: "code", label: "Refund", hideable: false },
    { key: "booking", label: "Booking" },
    { key: "customer", label: "Customer" },
    { key: "amount", label: "Amount", align: "right" },
    { key: "mode", label: "Via" },
    { key: "status", label: "Status" },
    { key: "reason", label: "Reason" },
    { key: "requested", label: "Requested by" },
    { key: "processed", label: "Processed" },
    ...(canAct ? [{ key: "actions", label: "" }] : []),
  ];

  const request = canAct ? (
    <FormModal
      action={requestRefundAction}
      label="Request refund"
      title="Request a refund"
      description="It goes to the accounts team to approve, then to pay out."
      submitLabel="Request refund"
      icon={<Undo2 className="h-4 w-4" aria-hidden />}
    >
      <RefundRequestFields initialCode={sp.booking ? bookingCode(Number(sp.booking) || 0) : ""} />
    </FormModal>
  ) : null;

  return (
    <>
      <PageHeader
        title="Refunds"
        description="Refund requests, approvals and payouts. Only processed refunds reduce revenue."
        actions={
          <>
            {canExport && (
              <a href={withParams("/api/crm/export/refunds", sp, { format: "xls", page: null })} className={btn("secondary")}>
                <Download className="h-4 w-4" aria-hidden /> Export
              </a>
            )}
            {request}
          </>
        }
      />

      <Tabs
        active={filters.status ?? "all"}
        tabs={[
          { key: "all", label: "All", href: href({ status: null, page: null }), count: all },
          ...REFUND_STATUSES.map((s) => ({ key: s.key, label: s.label, href: href({ status: s.key, page: null }), count: list.counts[s.key] ?? 0 })),
        ]}
      />

      <FilterBar
        search={{ placeholder: "Booking ID, RF code, customer, mobile or UTR" }}
        filters={[
          { name: "range", label: "Any date", type: "range" },
          { name: "mode", label: "Via", options: PAYMENT_MODES.map((m) => ({ value: m.key, label: m.label })) },
        ]}
      />

      <DataTable
        id="refunds-table"
        columns={columns}
        rows={list.rows}
        cells={(r) => ({
          code: (
            <span className="whitespace-nowrap">
              <span className="font-semibold text-slate-900">{refundCode(r.id)}</span>
              <span className="block text-[11.5px] text-slate-500">{date(r.created_at)}</span>
            </span>
          ),
          booking: (
            <Link href={`/crm/bookings/${r.booking_id}`} className="font-medium text-blue-700 hover:underline">
              {bookingCode(r.booking_id)}
            </Link>
          ),
          customer: (
            <span className="whitespace-nowrap">
              <span className="font-medium text-slate-900">{r.patient_name ?? "—"}</span>
              {r.patient_phone && <span className="block text-[11.5px] text-slate-500">{phone(r.patient_phone)}</span>}
            </span>
          ),
          amount: <span className="font-semibold text-slate-900">{rupees(r.amount)}</span>,
          mode: <PaymentModeBadge mode={r.mode} />,
          status: <RefundBadge status={r.status} />,
          reason: <span className="line-clamp-2 max-w-[16rem] text-[12.5px]">{r.reason || "—"}</span>,
          requested: <span className="whitespace-nowrap">{r.requested_by_name ?? "—"}</span>,
          processed:
            r.status === "processed" ? (
              <span className="whitespace-nowrap text-[12.5px]">
                {dateTime(r.processed_at)}
                <span className="block text-slate-500">
                  {r.reference ? <span className="font-mono">{r.reference}</span> : "No ref"}
                  {r.processed_by_name ? ` · ${r.processed_by_name}` : ""}
                </span>
              </span>
            ) : (
              <span className="text-slate-400">—</span>
            ),
          actions: <RefundActions r={r} today={today} />,
        })}
        card={(r) => (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-500">
                  {refundCode(r.id)} ·{" "}
                  <Link href={`/crm/bookings/${r.booking_id}`} className="text-blue-700">
                    {bookingCode(r.booking_id)}
                  </Link>{" "}
                  · {date(r.created_at)}
                </p>
                <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{r.patient_name ?? "—"}</p>
                <p className="mt-0.5 line-clamp-2 text-[13px] text-slate-600">{r.reason || "—"}</p>
              </div>
              <p className="shrink-0 text-[15px] font-semibold text-slate-900 tabular-nums">{rupees(r.amount)}</p>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <RefundBadge status={r.status} />
              <PaymentModeBadge mode={r.mode} />
              {r.status === "processed" && <span className="text-[12px] text-slate-500">{dateTime(r.processed_at)}</span>}
            </div>
            {canAct && ["requested", "approved"].includes(r.status) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <RefundActions r={r} today={today} />
              </div>
            )}
          </div>
        )}
        empty={
          <EmptyState
            icon={<Undo2 className="h-5 w-5" />}
            title={filters.status || filters.search || filters.from ? "No refunds match" : "No refunds yet"}
            hint={
              filters.status || filters.search || filters.from
                ? "Try another tab or clear the filters."
                : "When a customer is owed money back, request a refund here with the booking ID."
            }
            action={request}
          />
        }
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="px-1 pt-3 text-[12.5px] text-slate-600">
              In this view: <span className="font-semibold text-slate-900 tabular-nums">{rupees(list.amount)}</span>
            </p>
            <Pagination total={list.total} limit={limit} offset={offset} hrefFor={(pg) => href({ page: pg > 1 ? pg : null })} />
          </div>
        }
      />
    </>
  );
}

function RefundBadge({ status }) {
  const s = REFUND_STATUS[status];
  return <Badge tone={s?.tone ?? "slate"}>{s?.label ?? status}</Badge>;
}

/** The next step(s) for a refund. Rendered only for refunds.manage (the page checks). */
function RefundActions({ r, today }) {
  if (!["requested", "approved"].includes(r.status)) return null;
  return (
    <div className="flex items-center justify-end gap-1.5">
      {r.status === "requested" && (
        <QuickAction action={refundStepAction} fields={{ id: r.id, to: "approved" }} size="sm" variant="soft" pendingLabel="Approving…">
          Approve
        </QuickAction>
      )}
      {r.status === "approved" && (
        <FormModal
          action={refundStepAction}
          fields={{ id: r.id, to: "processed" }}
          label="Mark processed"
          size="sm"
          variant="success"
          icon={<CheckCircle2 className="h-3.5 w-3.5" aria-hidden />}
          title={`Refund ${refundCode(r.id)} paid out?`}
          description={`${rupees(r.amount)} to ${r.patient_name ?? "the customer"} · ${bookingCode(r.booking_id)}`}
          submitLabel="Mark processed"
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Paid via" htmlFor={`rp-mode-${r.id}`}>
              <Select id={`rp-mode-${r.id}`} name="mode" defaultValue={r.mode}>
                {PAYMENT_MODES.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Processed on" htmlFor={`rp-date-${r.id}`}>
              <Input id={`rp-date-${r.id}`} name="processedAt" type="date" defaultValue={today} max={today} />
            </Field>
          </div>
          <Field label="Transaction ID / UTR" htmlFor={`rp-ref-${r.id}`} hint="Required unless it was paid back in cash.">
            <Input id={`rp-ref-${r.id}`} name="reference" maxLength={120} autoComplete="off" />
          </Field>
        </FormModal>
      )}
      <ConfirmAction
        action={refundStepAction}
        fields={{ id: r.id, to: "rejected" }}
        label="Reject"
        size="sm"
        variant="ghost"
        title={`Reject refund ${refundCode(r.id)}?`}
        body={`${rupees(r.amount)} on ${bookingCode(r.booking_id)} will not be paid. The request stays on record.`}
        reason
        confirmLabel="Reject refund"
      />
    </div>
  );
}
