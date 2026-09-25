import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarClock,
  ClipboardList,
  Download,
  Eye,
  FileText,
  MessageCircle,
  Pencil,
  Phone,
  PhoneCall,
  Plus,
  Wallet,
} from "lucide-react";

import {
  Badge,
  BookingStatusBadge,
  ButtonLink,
  Card,
  DataTable,
  EmptyState,
  Facts,
  KpiCard,
  Notice,
  PageHeader,
  Pagination,
  PaymentModeBadge,
  PaymentStatusBadge,
  SourceBadge,
  Tabs,
  Textarea,
  Timeline,
  btn,
  withParams,
} from "@/components/crm/ui";
import { ActionForm, FormModal, SubmitButton } from "@/components/crm/forms";
import { CallFields, FollowUpFields } from "@/components/crm/leads/fields";
import {
  CALL_OUTCOME,
  GENDERS,
  REFUND_STATUS,
  SOURCE,
  TXN_STATUS,
  bookingCode,
  customerCode,
  leadCode,
  paymentCode,
} from "@/lib/crm/constants";
import { date, dateTime, isPast, phone, rupees, telHref, waHref } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import { listBookings, listNotes } from "@/lib/crm/stores/bookings";
import {
  customerBookingIds,
  customerJourney,
  customerMoney,
  customerNotifications,
  customerReports,
  getCustomer,
} from "@/lib/crm/stores/customers";
import { duration, followUpsFor, fromNow, listCalls } from "@/lib/crm/stores/leads";
import { listStaff } from "@/lib/crm/stores/lookups";

import { logCallAction } from "../../calls/actions";
import { scheduleFollowUpAction } from "../../follow-ups/actions";
import { customerNoteAction } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: customerCode(id) };
}

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "bookings", label: "Bookings" },
  { key: "payments", label: "Payments" },
  { key: "communication", label: "Communication" },
  { key: "reports", label: "Reports" },
];

/**
 * One customer, everything about them: who they are, what they booked, what
 * they paid, every call and note, every report — and the journey that ties
 * it together. Each tab loads only its own data.
 */
export default async function CustomerProfile({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await requirePerm("customers.view", `/crm/customers/${id}`);
  const c = await getCustomer(id);
  if (!c || c.status === "deleted") notFound();

  const tab = TABS.some((t) => t.key === sp.tab) ? sp.tab : "overview";
  const s = c.stats;
  const base = `/crm/customers/${c.id}`;

  return (
    <>
      <PageHeader
        eyebrow={
          <span className="flex flex-wrap items-center gap-2">
            {customerCode(c.id)} <SourceBadge source={SOURCE[c.source] ? c.source : "other"} />
          </span>
        }
        title={c.name}
        description={[phone(c.phone), c.city_name || c.city, `Customer since ${date(c.created_at)}`].filter(Boolean).join(" · ")}
        back={{ href: "/crm/customers", label: "Customers" }}
        actions={
          <>
            <a href={telHref(c.phone)} className={btn("secondary")}>
              <Phone className="h-4 w-4" aria-hidden /> Call
            </a>
            <a href={waHref(c.phone, `Hello ${c.name}, this is MedicoBharat.`)} target="_blank" rel="noreferrer" className={btn("secondary")}>
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
            </a>
            {has(user, "customers.manage") && (
              <ButtonLink href={`${base}/edit`}>
                <Pencil className="h-4 w-4" aria-hidden /> Edit
              </ButtonLink>
            )}
            {has(user, "bookings.manage") && (
              <ButtonLink href={`/crm/bookings/new?customer=${c.id}`} variant="primary">
                <Plus className="h-4 w-4" aria-hidden /> New booking
              </ButtonLink>
            )}
          </>
        }
      />

      {sp.created && (
        <div className="mb-4">
          <Notice tone="emerald" title="Customer created">
            Book a test for them with New booking, or log the call you are on under Communication.
          </Notice>
        </div>
      )}
      {sp.saved && (
        <div className="mb-4">
          <Notice tone="emerald">Changes saved.</Notice>
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard label="Bookings" value={s.bookings} sub={s.openBookings ? `${s.openBookings} open` : "None open"} href={`${base}?tab=bookings`} />
        <KpiCard label="Tests booked" value={s.tests} sub="Excluding cancelled" tone="violet" />
        <KpiCard label="Total spent" value={rupees(s.spent)} sub={s.refunded ? `${rupees(s.refunded)} refunded` : "Paid, net of refunds"} tone="emerald" href={`${base}?tab=payments`} />
        <KpiCard label="Pending amount" value={rupees(s.pendingAmount)} sub={s.pendingAmount ? "Still to collect" : "Nothing due"} tone="amber" />
        <KpiCard label="Last booking" value={s.lastBooking ? date(s.lastBooking) : "—"} sub={s.lastBooking ? fromNowPast(s.lastBooking) : "Never booked"} tone="slate" />
      </div>

      <Tabs
        active={tab}
        tabs={TABS.map((t) => ({ key: t.key, label: t.label, href: t.key === "overview" ? base : `${base}?tab=${t.key}`, count: t.key === "bookings" ? s.bookings : undefined }))}
      />

      {tab === "overview" && <Overview c={c} />}
      {tab === "bookings" && <BookingsTab c={c} sp={sp} canBook={has(user, "bookings.manage")} />}
      {tab === "payments" && <PaymentsTab c={c} />}
      {tab === "communication" && <CommunicationTab c={c} user={user} />}
      {tab === "reports" && <ReportsTab c={c} canOpen={has(user, "reports.view")} />}
    </>
  );
}

/** "3 days ago" for the KPI tile (format.ago falls back to a date after a week). */
function fromNowPast(value) {
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 60) return `${days} days ago`;
  return `${Math.round(days / 30)} months ago`;
}

/* ── Overview ─────────────────────────────────────────────────────────── */

async function Overview({ c }) {
  const j = await customerJourney(c);
  const items = [];
  const push = (at, item) => at && items.push({ ...item, at: new Date(at).getTime(), meta: item.meta ?? dateTime(at) });
  const sentFor = new Set(j.reports.map((r) => r.booking_id));

  for (const l of j.leads) {
    push(l.created_at, {
      id: `l${l.id}`,
      title: `Enquiry ${leadCode(l.id)} · ${SOURCE[l.channel]?.label ?? "Website"}`,
      body: [l.test, l.interested_package].filter(Boolean).join(" · ") || null,
      href: `/crm/leads/${l.id}`,
      tone: "sky",
    });
  }
  for (const b of j.bookings) {
    const code = bookingCode(b.id);
    push(b.created_at, {
      id: `b${b.id}`,
      title: `Booked ${code} · ${rupees(b.final_amount)}`,
      body: b.items_label || null,
      href: `/crm/bookings/${b.id}`,
      tone: "blue",
    });
    push(b.collected_at, { id: `bc${b.id}`, title: `Sample collected · ${code}`, href: `/crm/bookings/${b.id}#collection`, tone: "indigo" });
    push(b.sample_received_at, {
      id: `bl${b.id}`,
      title: `Received by lab · ${code}`,
      body: b.partner_name || null,
      href: `/crm/bookings/${b.id}#report`,
      tone: "violet",
    });
    push(b.report_ready_at, { id: `br${b.id}`, title: `Report ready · ${code}`, href: `/crm/bookings/${b.id}#report`, tone: "teal" });
    if (!sentFor.has(b.id)) push(b.delivered_at, { id: `bd${b.id}`, title: `Report delivered · ${code}`, href: `/crm/bookings/${b.id}#report`, tone: "emerald" });
    push(b.cancelled_at, { id: `bx${b.id}`, title: `Cancelled ${code}`, body: b.cancel_reason || null, href: `/crm/bookings/${b.id}`, tone: "rose" });
  }
  for (const r of j.reports) {
    push(r.sent_at, {
      id: `r${r.id}`,
      title: `Report sent${r.sent_via ? ` by ${r.sent_via}` : ""} · ${bookingCode(r.booking_id)}`,
      href: `/crm/bookings/${r.booking_id}#report`,
      tone: "emerald",
    });
  }
  for (const call of j.calls) {
    push(call.called_at, {
      id: `c${call.id}`,
      title: `${call.direction === "inbound" ? "Inbound" : "Outbound"} call · ${CALL_OUTCOME[call.outcome]?.label ?? call.outcome}${call.duration_sec ? ` · ${duration(call.duration_sec)}` : ""}`,
      body: call.notes || null,
      meta: `${call.user_name ? `${call.user_name} · ` : ""}${dateTime(call.called_at)}`,
      href: call.lead_id ? `/crm/leads/${call.lead_id}` : `/crm/calls?q=${c.phone}`,
      tone: CALL_OUTCOME[call.outcome]?.tone ?? "slate",
    });
  }
  for (const p of j.payments) {
    push(p.received_at, {
      id: `p${p.id}`,
      title: `${p.status === "paid" ? "Paid" : "Payment pending"} ${rupees(p.amount)} · ${p.mode.replace("_", " ").toUpperCase()}`,
      body: p.booking_id ? bookingCode(p.booking_id) : null,
      href: p.booking_id ? `/crm/bookings/${p.booking_id}` : null,
      tone: p.status === "paid" ? "emerald" : "orange",
    });
  }
  for (const r of j.refunds) {
    push(r.processed_at, { id: `rf${r.id}`, title: `Refunded ${rupees(r.amount)} · ${bookingCode(r.booking_id)}`, href: `/crm/bookings/${r.booking_id}`, tone: "violet" });
  }
  items.sort((a, z) => z.at - a.at);

  const gender = GENDERS.find((g) => g.key === c.gender)?.label ?? "";
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="min-w-0 space-y-5 lg:col-span-2">
        <Card title="Journey" description="Booking → call → collection → lab → report → payment → delivery, newest first.">
          <Timeline
            items={items.slice(0, 150)}
            empty={<EmptyState compact icon={<ClipboardList className="h-5 w-5" />} title="Nothing yet" hint="Bookings, calls and payments will appear here as they happen." />}
          />
        </Card>
      </div>
      <div className="space-y-5">
        <Card title="Personal information">
          <Facts
            cols={1}
            items={[
              { label: "Mobile", value: <a href={telHref(c.phone)} className="text-blue-700 hover:underline">{phone(c.phone)}</a> },
              { label: "Alternate mobile", value: c.alt_phone ? <a href={telHref(c.alt_phone)} className="text-blue-700 hover:underline">{c.alt_phone}</a> : "" },
              { label: "Email", value: c.email },
              { label: "Age / gender", value: [c.age ? `${c.age} y` : null, gender || null].filter(Boolean).join(" · ") },
              { label: "Address", value: [c.address, c.area, c.landmark && `near ${c.landmark}`, c.city_name || c.city].filter(Boolean).join(", ") },
              { label: "Came from", value: SOURCE[c.source]?.label ?? c.source },
              { label: "Added", value: `${dateTime(c.created_at)}${c.created_by_name ? ` · ${c.created_by_name}` : ""}` },
            ]}
          />
        </Card>
        {c.notes && (
          <Card title="Profile notes">
            <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-700">{c.notes}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ── Bookings ─────────────────────────────────────────────────────────── */

async function BookingsTab({ c, sp, canBook }) {
  const page = Math.max(1, Math.floor(Number(sp.page) || 1));
  const limit = 25;
  const offset = (page - 1) * limit;
  const list = await listBookings({ customerId: c.id, limit, offset });
  const columns = [
    { key: "code", label: "Booking" },
    { key: "tests", label: "Tests" },
    { key: "source", label: "Source" },
    { key: "status", label: "Status" },
    { key: "payment", label: "Payment" },
    { key: "amount", label: "Amount", align: "right" },
    { key: "date", label: "Booked" },
  ];
  return (
    <DataTable
      id="customer-bookings"
      columns={columns}
      rows={list.rows}
      rowHref={(b) => `/crm/bookings/${b.id}`}
      cells={(b) => ({
        code: <span className="whitespace-nowrap">{bookingCode(b.id)}</span>,
        tests: <span className="line-clamp-2 max-w-[18rem]">{b.items_label || "—"}</span>,
        source: <SourceBadge source={b.source} />,
        status: <BookingStatusBadge status={b.status} />,
        payment: <PaymentStatusBadge status={b.payment_status} />,
        amount: rupees(b.final_amount),
        date: <span className="whitespace-nowrap">{date(b.created_at)}</span>,
      })}
      card={(b) => (
        <Link href={`/crm/bookings/${b.id}`} className="block">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                {bookingCode(b.id)} <SourceBadge source={b.source} />
              </p>
              <p className="mt-0.5 line-clamp-2 text-[13.5px] text-slate-800">{b.items_label || "—"}</p>
              <p className="mt-0.5 text-[12px] text-slate-500">{date(b.created_at)}</p>
            </div>
            <p className="shrink-0 text-[15px] font-semibold tabular-nums text-slate-900">{rupees(b.final_amount)}</p>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <BookingStatusBadge status={b.status} />
            <PaymentStatusBadge status={b.payment_status} />
          </div>
        </Link>
      )}
      empty={
        <EmptyState
          icon={<ClipboardList className="h-5 w-5" />}
          title="No bookings yet"
          hint="Book their first test — the details are filled in from this profile."
          action={
            canBook ? (
              <ButtonLink href={`/crm/bookings/new?customer=${c.id}`} variant="primary">
                <Plus className="h-4 w-4" aria-hidden /> New booking
              </ButtonLink>
            ) : null
          }
        />
      }
      footer={
        <Pagination
          total={list.total}
          limit={limit}
          offset={offset}
          hrefFor={(p) => withParams(`/crm/customers/${c.id}`, { tab: "bookings" }, { page: p > 1 ? p : null })}
        />
      }
    />
  );
}

/* ── Payments ─────────────────────────────────────────────────────────── */

async function PaymentsTab({ c }) {
  const { payments, refunds } = await customerMoney(c.id);
  const paid = payments.filter((p) => p.status === "paid").reduce((a, p) => a + Number(p.amount), 0);
  const refunded = refunds.filter((r) => r.status === "processed").reduce((a, r) => a + Number(r.amount), 0);
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="min-w-0 space-y-5 lg:col-span-2">
        <Card title="Payments" description={`${payments.length} recorded`}>
          {payments.length ? (
            <ul className="divide-y divide-slate-100">
              {payments.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium text-slate-900">
                      {rupees(p.amount)} <span className="font-normal text-slate-500">· {paymentCode(p.id)}</span>
                    </p>
                    <p className="text-[11.5px] text-slate-500">
                      {dateTime(p.received_at)}
                      {p.booking_id && (
                        <>
                          {" · "}
                          <Link href={`/crm/bookings/${p.booking_id}`} className="text-blue-700 hover:underline">
                            {bookingCode(p.booking_id)}
                          </Link>
                        </>
                      )}
                      {p.collected_by_name ? ` · ${p.collected_by_name}` : ""}
                      {p.reference ? ` · ${p.reference}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PaymentModeBadge mode={p.mode} />
                    <Badge tone={TXN_STATUS[p.status]?.tone}>{TXN_STATUS[p.status]?.label ?? p.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState compact icon={<Wallet className="h-5 w-5" />} title="No payments recorded" hint="Payments are recorded on each booking." />
          )}
        </Card>
        <Card title="Refunds">
          {refunds.length ? (
            <ul className="divide-y divide-slate-100">
              {refunds.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium text-slate-900">{rupees(r.amount)}</p>
                    <p className="text-[11.5px] text-slate-500">
                      {date(r.created_at)} ·{" "}
                      <Link href={`/crm/bookings/${r.booking_id}`} className="text-blue-700 hover:underline">
                        {bookingCode(r.booking_id)}
                      </Link>
                      {r.reason ? ` · ${r.reason}` : ""}
                    </p>
                  </div>
                  <Badge tone={REFUND_STATUS[r.status]?.tone}>{REFUND_STATUS[r.status]?.label ?? r.status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-slate-500">No refunds.</p>
          )}
        </Card>
      </div>
      <Card title="Summary">
        <Facts
          cols={1}
          items={[
            { label: "Received", value: rupees(paid) },
            { label: "Refunded", value: rupees(refunded) },
            { label: "Net spent", value: <span className="font-semibold">{rupees(c.stats.spent)}</span> },
            {
              label: "Still to collect",
              value: <span className={c.stats.pendingAmount ? "font-semibold text-orange-700" : ""}>{rupees(c.stats.pendingAmount)}</span>,
            },
          ]}
        />
      </Card>
    </div>
  );
}

/* ── Communication ────────────────────────────────────────────────────── */

async function CommunicationTab({ c, user }) {
  const canCall = has(user, "leads.manage");
  const canNote = has(user, "customers.manage");
  const bookingIds = await customerBookingIds(c.id);
  const [calls, notes, followUps, notifications, staff] = await Promise.all([
    listCalls({ customerId: c.id, customerPhone: c.phone, limit: 50 }),
    listNotes("customer", c.id),
    followUpsFor({ customerId: c.id }),
    customerNotifications(bookingIds),
    canCall ? listStaff() : [],
  ]);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="min-w-0 space-y-5 lg:col-span-2">
        <Card
          title="Calls"
          description={`${calls.total} with this number`}
          actions={
            canCall ? (
              <FormModal
                action={logCallAction}
                fields={{ customerId: c.id, phone: c.phone, name: c.name }}
                label="Log call"
                size="sm"
                variant="soft"
                icon={<PhoneCall className="h-3.5 w-3.5" aria-hidden />}
                title={`Log a call with ${c.name}`}
                description={phone(c.phone)}
                submitLabel="Log call"
              >
                <CallFields p="cust-call" phone={false} name={false} />
              </FormModal>
            ) : null
          }
        >
          {calls.rows.length ? (
            <ul className="divide-y divide-slate-100">
              {calls.rows.map((call) => (
                <li key={call.id} className="py-2.5 first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13.5px] font-medium text-slate-900">
                      {call.direction === "inbound" ? "Inbound" : "Outbound"}
                      {call.duration_sec ? <span className="font-normal text-slate-500"> · {duration(call.duration_sec)}</span> : null}
                    </p>
                    <Badge tone={CALL_OUTCOME[call.outcome]?.tone}>{CALL_OUTCOME[call.outcome]?.label ?? call.outcome}</Badge>
                  </div>
                  {call.notes && <p className="mt-0.5 text-[13px] text-slate-700">{call.notes}</p>}
                  <p className="mt-0.5 text-[11.5px] text-slate-500">
                    {dateTime(call.called_at)}
                    {call.user_name ? ` · ${call.user_name}` : ""}
                    {call.lead_id && (
                      <>
                        {" · "}
                        <Link href={`/crm/leads/${call.lead_id}`} className="text-blue-700 hover:underline">
                          {leadCode(call.lead_id)}
                        </Link>
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState compact icon={<PhoneCall className="h-5 w-5" />} title="No calls logged" hint={canCall ? "Log the call you are on with Log call." : null} />
          )}
        </Card>

        <Card title="Booking notifications" description="Alerts the team received about this customer's bookings.">
          {notifications.length ? (
            <ul className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <li key={n.id} className="py-2.5 first:pt-0">
                  <Link href={n.link} className="text-[13.5px] font-medium text-slate-900 hover:text-blue-700">
                    {n.title}
                  </Link>
                  {n.body && <p className="text-[12.5px] text-slate-600">{n.body}</p>}
                  <p className="text-[11.5px] text-slate-400">{dateTime(n.created_at)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-slate-500">No notifications about their bookings.</p>
          )}
        </Card>
      </div>

      <div className="space-y-5">
        <Card
          title="Follow-ups"
          actions={
            canCall ? (
              <FormModal
                action={scheduleFollowUpAction}
                fields={{ customerId: c.id }}
                label="Schedule"
                size="sm"
                variant="soft"
                icon={<CalendarClock className="h-3.5 w-3.5" aria-hidden />}
                title={`Call back ${c.name}`}
                submitLabel="Schedule"
              >
                <FollowUpFields p="cust-fu" staff={staff} />
              </FormModal>
            ) : null
          }
        >
          {followUps.length ? (
            <ul className="space-y-2">
              {followUps.slice(0, 20).map((f) => (
                <li key={f.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-slate-900">{dateTime(f.due_at)}</p>
                    <FollowUpBadge f={f} />
                  </div>
                  {f.note && <p className="mt-0.5 text-[12.5px] text-slate-600">{f.note}</p>}
                  <p className="mt-0.5 text-[11.5px] text-slate-400">{f.assignee_name ? `For ${f.assignee_name}` : "Unassigned"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-slate-500">No follow-ups.</p>
          )}
        </Card>

        <Card title="Notes" description="Internal. Every note is dated and signed.">
          {canNote && (
            <ActionForm action={customerNoteAction} reset className="mb-4 space-y-2">
              <input type="hidden" name="id" value={c.id} />
              <Textarea name="body" rows={2} maxLength={2000} placeholder="Add a note — preference, complaint, context…" aria-label="Note" required />
              <SubmitButton size="sm" variant="secondary">
                Add note
              </SubmitButton>
            </ActionForm>
          )}
          <Timeline
            items={notes.map((n) => ({ id: n.id, title: n.body, meta: `${n.user_name || n.user_email || "—"} · ${dateTime(n.created_at)}`, tone: "amber" }))}
            empty={<p className="text-[13px] text-slate-500">No notes yet.</p>}
          />
        </Card>
      </div>
    </div>
  );
}

function FollowUpBadge({ f }) {
  if (f.status === "done") return <Badge tone="emerald">Done</Badge>;
  if (f.status === "cancelled") return <Badge tone="slate">Cancelled</Badge>;
  return <Badge tone={isPast(f.due_at) ? "rose" : "amber"}>{fromNow(f.due_at)}</Badge>;
}

/* ── Reports ──────────────────────────────────────────────────────────── */

async function ReportsTab({ c, canOpen }) {
  const reports = await customerReports(c.id);
  if (!reports.length) {
    return (
      <Card>
        <EmptyState icon={<FileText className="h-5 w-5" />} title="No reports yet" hint="Reports uploaded by the lab on this customer's bookings appear here." />
      </Card>
    );
  }
  return (
    <Card title="Reports" description={`${reports.length} file${reports.length === 1 ? "" : "s"} across their bookings`}>
      <ul className="divide-y divide-slate-100">
        {reports.map((r) => (
          <li key={r.id} className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-slate-900">{r.items_label || r.filename}</p>
              <p className="mt-0.5 text-[12px] text-slate-500">
                {date(r.uploaded_at)} ·{" "}
                <Link href={`/crm/bookings/${r.booking_id}#report`} className="text-blue-700 hover:underline">
                  {bookingCode(r.booking_id)}
                </Link>
                {r.partner_name ? ` · ${r.partner_name}` : ""} · v{r.version}
                {r.sent_at ? ` · sent ${date(r.sent_at)}${r.sent_via ? ` by ${r.sent_via}` : ""}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge tone={{ uploaded: "amber", verified: "blue", sent: "emerald" }[r.status]}>{r.status}</Badge>
              {canOpen && (
                <>
                  <a href={`/api/crm/files/${r.file_id}`} target="_blank" rel="noreferrer" className={btn("secondary", "sm")}>
                    <Eye className="h-3.5 w-3.5" aria-hidden /> View
                  </a>
                  <a href={`/api/crm/files/${r.file_id}?download=1`} className={btn("secondary", "sm")}>
                    <Download className="h-3.5 w-3.5" aria-hidden /> Download
                  </a>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
