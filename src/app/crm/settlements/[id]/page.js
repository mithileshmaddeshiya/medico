import Link from "next/link";
import { notFound } from "next/navigation";
import { Ban, CheckCircle2, FileDown, PauseCircle, PlayCircle, PlusCircle, Undo2 } from "lucide-react";

import { ConfirmAction, FormModal, QuickAction } from "@/components/crm/forms";
import {
  Badge,
  Card,
  DataTable,
  EmptyState,
  Facts,
  Field,
  Input,
  Notice,
  PageHeader,
  Select,
  Timeline,
  btn,
} from "@/components/crm/ui";
import { recordHistory } from "@/lib/crm/activity";
import { PAYMENT_MODE, PAYMENT_MODES, SETTLEMENT_STATUS, bookingCode, partnerCode, settlementCode } from "@/lib/crm/constants";
import { istDay } from "@/lib/crm/dates";
import { date, dateTime, day, rupees } from "@/lib/crm/format";
import { has, requirePerm, scopeOf } from "@/lib/crm/guard";
import { maskAccount } from "@/lib/crm/stores/partners";
import { getSettlement } from "@/lib/crm/stores/settlements";

import { adjustSettlementAction, settlementStatusAction } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: settlementCode(id) };
}

/**
 * One settlement statement. Staff see each order's customer price, the lab's
 * cost and MedicoBharat's margin, and can adjust, hold, pay or void it. The lab
 * sees the same statement with only its own figures (getSettlement strips the
 * rest when scoped to a partner).
 */
export default async function SettlementDetail({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await requirePerm("settlements.view", `/crm/settlements/${id}`);
  const partner = user.isPartner;
  const s = await getSettlement(id, scopeOf(user));
  if (!s) notFound();

  const canManage = !partner && has(user, "settlements.manage");
  const history = await recordHistory(user, "settlements", s.id);
  const open = ["pending", "processing", "on_hold"].includes(s.status);
  const st = SETTLEMENT_STATUS[s.status];
  const liveItems = s.items.filter((i) => i.status === "active" || s.status === "void");
  const totals = liveItems.reduce(
    (a, i) => ({ customer: a.customer + (i.customer_amount ?? 0), partner: a.partner + i.partner_amount, margin: a.margin + (i.margin ?? 0) }),
    { customer: 0, partner: 0, margin: 0 }
  );
  const account = s.bank_account ? (canManage ? s.bank_account : maskAccount(s.bank_account)) : "";

  const columns = partner
    ? [
        { key: "code", label: "Order", hideable: false },
        { key: "date", label: "Report / booked" },
        { key: "patient", label: "Patient" },
        { key: "tests", label: "Tests" },
        { key: "payable", label: "Your amount", align: "right" },
      ]
    : [
        { key: "code", label: "Booking", hideable: false },
        { key: "date", label: "Report / booked" },
        { key: "patient", label: "Patient" },
        { key: "tests", label: "Tests" },
        { key: "customer", label: "Customer price", align: "right" },
        { key: "payable", label: "Partner payable", align: "right" },
        { key: "margin", label: "MB margin", align: "right" },
      ];

  return (
    <>
      <PageHeader
        eyebrow={
          <span className="flex flex-wrap items-center gap-2">
            {partner ? "Payment statement" : "Settlement"} {settlementCode(s.id)} <Badge tone={st?.tone}>{st?.label ?? s.status}</Badge>
          </span>
        }
        title={partner ? `${day(s.period_from)} – ${day(s.period_to)}` : s.partner_name}
        description={
          partner
            ? `${s.bookings_count} orders · generated ${date(s.created_at)}`
            : `${partnerCode(s.partner_id)} · ${day(s.period_from)} – ${day(s.period_to)} · ${s.bookings_count} orders · generated ${dateTime(s.created_at)}${s.created_by_name ? ` by ${s.created_by_name}` : ""}`
        }
        back={{ href: "/crm/settlements", label: partner ? "Payments" : "Settlements" }}
        actions={
          <a href={`/api/crm/settlements/${s.id}/pdf`} className={btn("secondary")}>
            <FileDown className="h-4 w-4" aria-hidden /> Download PDF
          </a>
        }
      />

      {sp.created && (
        <div className="mb-4">
          <Notice tone="emerald" title={`${settlementCode(s.id)} generated`}>
            The lab has been notified. Mark it processing when the payment is being prepared, and paid once it is sent.
          </Notice>
        </div>
      )}
      {s.status === "void" && (
        <div className="mb-4">
          <Notice tone="slate" title="This statement is void">
            Its orders are free to go on another settlement.
          </Notice>
        </div>
      )}
      {s.status === "on_hold" && (
        <div className="mb-4">
          <Notice tone="amber" title="Payment on hold">
            {partner ? "MedicoBharat will contact you about this statement." : "See the notes and activity for why."}
          </Notice>
        </div>
      )}

      {/* The money */}
      <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {!partner && <Figure label="Customer price" value={rupees(s.gross_amount, { decimals: 2 })} />}
        <Figure label={partner ? "Your amount" : "Partner cost"} value={rupees(s.partner_payable, { decimals: 2 })} />
        {!partner && <Figure label="MedicoBharat margin" value={rupees(s.margin, { decimals: 2 })} tone={s.margin < 0 ? "text-rose-700" : "text-emerald-700"} />}
        {s.adjustments !== 0 && <Figure label="Adjustments" value={`${s.adjustments > 0 ? "+" : "−"}${rupees(Math.abs(s.adjustments), { decimals: 2 })}`} />}
        <Figure label="Net payable" value={rupees(s.net_payable, { decimals: 2 })} strong />
        {s.status === "paid" && <Figure label="Paid" value={rupees(s.paid_amount, { decimals: 2 })} tone="text-emerald-700" strong />}
      </section>

      {canManage && open && (
        <section className="mb-5 flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center">
          <FormModal
            action={settlementStatusAction}
            fields={{ id: s.id, status: "paid" }}
            label="Mark paid"
            variant="success"
            icon={<CheckCircle2 className="h-4 w-4" aria-hidden />}
            title={`Mark ${settlementCode(s.id)} paid`}
            description={`${s.partner_name} · ${rupees(s.net_payable, { decimals: 2 })} payable`}
            submitLabel="Mark paid"
          >
            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount paid" required htmlFor="pay-amount">
                <Input id="pay-amount" name="amount" inputMode="decimal" required defaultValue={s.net_payable > 0 ? s.net_payable : ""} />
              </Field>
              <Field label="Mode" required htmlFor="pay-mode">
                <Select id="pay-mode" name="mode" defaultValue="bank_transfer">
                  {PAYMENT_MODES.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Reference / UTR" htmlFor="pay-ref">
                <Input id="pay-ref" name="reference" maxLength={120} />
              </Field>
              <Field label="Paid on" required htmlFor="pay-on">
                <Input id="pay-on" name="paidOn" type="date" required defaultValue={istDay()} max={istDay()} />
              </Field>
            </div>
            <Field label="Note (if the amount differs)" htmlFor="pay-note">
              <Input id="pay-note" name="reason" maxLength={200} />
            </Field>
          </FormModal>
          {s.status !== "processing" && (
            <QuickAction action={settlementStatusAction} fields={{ id: s.id, status: "processing" }} variant="secondary">
              <PlayCircle className="h-4 w-4" aria-hidden /> Processing
            </QuickAction>
          )}
          {s.status !== "pending" && (
            <QuickAction action={settlementStatusAction} fields={{ id: s.id, status: "pending" }} variant="ghost">
              <Undo2 className="h-4 w-4" aria-hidden /> Back to pending
            </QuickAction>
          )}
          {s.status !== "on_hold" && (
            <ConfirmAction
              action={settlementStatusAction}
              fields={{ id: s.id, status: "on_hold" }}
              label="On hold"
              icon={<PauseCircle className="h-4 w-4" aria-hidden />}
              title="Put this payment on hold?"
              body="The lab is told the payment is on hold."
              reason
              reasonLabel="Why?"
              confirmLabel="Put on hold"
              confirmVariant="primary"
            />
          )}
          <FormModal
            action={adjustSettlementAction}
            fields={{ id: s.id }}
            label="Add adjustment"
            variant="secondary"
            icon={<PlusCircle className="h-4 w-4" aria-hidden />}
            title="Adjust the amount payable"
            description="Positive adds to what the lab is paid; negative deducts."
            submitLabel="Add adjustment"
            modalSize="sm"
          >
            <Field label="Amount (₹)" required htmlFor="adj-amount" hint="e.g. 150 or -150">
              <Input id="adj-amount" name="amount" inputMode="decimal" required />
            </Field>
            <Field label="Reason" required htmlFor="adj-reason">
              <Input id="adj-reason" name="reason" required maxLength={200} />
            </Field>
          </FormModal>
          <div className="sm:ml-auto">
            <ConfirmAction
              action={settlementStatusAction}
              fields={{ id: s.id, status: "void" }}
              label="Void"
              variant="ghost"
              className="w-full text-rose-700"
              icon={<Ban className="h-4 w-4" aria-hidden />}
              title={`Void ${settlementCode(s.id)}?`}
              body="The statement stays on record, marked void, and its orders become available for a new settlement. The lab is told it has been withdrawn."
              reason
              reasonLabel="Why is it being voided?"
              confirmLabel="Void statement"
            />
          </div>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <DataTable
            id="settlement-items"
            columns={columns}
            rows={s.items}
            rowHref={(i) => `/crm/bookings/${i.booking_id}`}
            cells={(i) => ({
              code: (
                <span className="whitespace-nowrap">
                  {bookingCode(i.booking_id)}
                  {i.status === "void" && s.status !== "void" && <Badge className="ml-1.5">void</Badge>}
                </span>
              ),
              date: <span className="whitespace-nowrap">{date(i.report_ready_at ?? i.booked_at)}</span>,
              patient: i.patient_first,
              tests: <span className="line-clamp-2 max-w-[16rem]">{i.items_label || "—"}</span>,
              customer: rupees(i.customer_amount, { decimals: 2 }),
              payable: rupees(i.partner_amount, { decimals: 2 }),
              margin: <span className={i.margin < 0 ? "font-semibold text-rose-700" : ""}>{rupees(i.margin, { decimals: 2 })}</span>,
            })}
            card={(i) => (
              <Link href={`/crm/bookings/${i.booking_id}`} className="block">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-slate-500">
                      {bookingCode(i.booking_id)} · {date(i.report_ready_at ?? i.booked_at)}
                    </p>
                    <p className="mt-0.5 text-[14px] font-semibold text-slate-900">{i.patient_first}</p>
                    <p className="mt-0.5 line-clamp-1 text-[12.5px] text-slate-600">{i.items_label || "—"}</p>
                  </div>
                  <p className="shrink-0 text-[14px] font-semibold tabular-nums">{rupees(i.partner_amount, { decimals: 2 })}</p>
                </div>
                {!partner && (
                  <p className="mt-2 text-[12px] text-slate-500 tabular-nums">
                    Customer {rupees(i.customer_amount, { decimals: 2 })} − lab {rupees(i.partner_amount, { decimals: 2 })} = margin {rupees(i.margin, { decimals: 2 })}
                  </p>
                )}
              </Link>
            )}
            empty={<EmptyState compact title="No orders on this statement" />}
            footer={
              <div className="mt-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3">
                <dl className="space-y-1.5 text-[13px]">
                  {!partner && <Row label="Customer price" value={rupees(totals.customer, { decimals: 2 })} />}
                  <Row label={partner ? "Your amount" : "Partner payable"} value={rupees(totals.partner, { decimals: 2 })} />
                  {!partner && <Row label="MedicoBharat margin (customer − partner)" value={rupees(totals.margin, { decimals: 2 })} />}
                  {s.adjustments !== 0 && <Row label="Adjustments" value={`${s.adjustments > 0 ? "+" : "−"}${rupees(Math.abs(s.adjustments), { decimals: 2 })}`} />}
                  <Row label="Net payable" value={rupees(s.net_payable, { decimals: 2 })} strong />
                </dl>
              </div>
            }
          />
        </div>

        <div className="space-y-5">
          <Card title={partner ? "Payment" : "Payment & lab"}>
            <Facts
              cols={1}
              items={[
                { label: "Status", value: <Badge tone={st?.tone}>{st?.label ?? s.status}</Badge> },
                ...(s.status === "paid"
                  ? [
                      { label: "Paid", value: `${rupees(s.paid_amount, { decimals: 2 })} on ${day(s.paid_on)}` },
                      { label: "Mode", value: PAYMENT_MODE[s.mode]?.label ?? s.mode },
                      { label: "Reference / UTR", value: s.reference },
                    ]
                  : []),
                ...(!partner ? [{ label: "Lab", value: <Link href={`/crm/partners/${s.partner_id}`} className="text-blue-700 hover:underline">{s.partner_name}</Link> }] : []),
                { label: "GSTIN", value: s.partner_gstin },
                { label: "Bank", value: [s.bank_name, s.bank_ifsc].filter(Boolean).join(" · ") },
                { label: "Account", value: account ? <span className="font-mono">{account}</span> : "" },
                { label: "UPI", value: s.upi_id },
              ]}
            />
          </Card>
          {!partner && s.notes && (
            <Card title="Notes">
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-700">{s.notes}</p>
            </Card>
          )}
          <Card title="Activity">
            <Timeline
              items={history.map((h) => ({
                id: h.id,
                title: h.summary,
                meta: `${h.user_name || h.user_email || "MedicoBharat"} · ${dateTime(h.created_at)}`,
                tone: { create: "blue", payment: "emerald", adjust: "amber", status: "sky", export: "slate" }[h.action] ?? "slate",
              }))}
              empty={<p className="text-[13px] text-slate-500">Nothing yet.</p>}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

function Figure({ label, value, strong = false, tone = "text-slate-900" }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
      <p className="text-[12.5px] font-medium text-slate-500">{label}</p>
      <p className={`mt-1.5 text-[20px] leading-none tracking-tight tabular-nums ${strong ? "font-bold" : "font-semibold"} ${tone}`}>{value}</p>
    </div>
  );
}

function Row({ label, value, strong = false }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className={strong ? "font-semibold text-slate-900" : "text-slate-500"}>{label}</dt>
      <dd className={`tabular-nums ${strong ? "font-semibold text-slate-900" : "text-slate-700"}`}>{value}</dd>
    </div>
  );
}
