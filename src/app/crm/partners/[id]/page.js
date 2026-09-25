import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  ClipboardList,
  HandCoins,
  KeyRound,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Tag,
  UserPlus,
} from "lucide-react";

import FilterBar from "@/components/crm/FilterBar";
import { ActionForm, ConfirmAction, FormModal, QuickAction, SubmitButton } from "@/components/crm/forms";
import GenerateSettlement from "@/components/crm/partners/GenerateSettlement";
import { AgreementBadge, PartnerRecordBadge } from "@/components/crm/partners/badges";
import {
  Badge,
  BookingStatusBadge,
  ButtonLink,
  Card,
  DataTable,
  EmptyState,
  Facts,
  Field,
  Input,
  KpiCard,
  Notice,
  PageHeader,
  Pagination,
  PartnerStatusBadge,
  Tabs,
  Timeline,
  btn,
  withParams,
} from "@/components/crm/ui";
import { activityLink } from "@/lib/crm/activity";
import {
  BOOKING_STATUSES,
  PARTNER_STATUSES,
  SETTLEMENT_STATUS,
  bookingCode,
  partnerCode,
  settlementCode,
} from "@/lib/crm/constants";
import { pageOf } from "@/lib/crm/filters";
import { date, dateTime, day, hours, num, phone, rupees, telHref, waHref } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import { listBookings } from "@/lib/crm/stores/bookings";
import {
  getPartner,
  listPartnerLogins,
  listPartnerPricing,
  maskAccount,
  partnerActivity,
  partnerStats,
} from "@/lib/crm/stores/partners";
import { listSettlements } from "@/lib/crm/stores/settlements";

import {
  archivePartnerAction,
  createPartnerLoginAction,
  partnerLoginStatusAction,
  partnerPriceAction,
} from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: partnerCode(id) };
}

/**
 * One lab partner: contact, performance, its orders, its own price list,
 * settlements, sign-in accounts and everything that happened with it. Tabs are
 * URL-driven (?tab=) so each loads only its own data.
 */
export default async function PartnerProfile({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await requirePerm("partners.view", `/crm/partners/${id}`);
  const p = await getPartner(id);
  if (!p) notFound();

  const canManage = has(user, "partners.manage");
  const canSettleView = has(user, "settlements.view");
  const canSettle = has(user, "settlements.manage");
  const canMoney = canSettleView || has(user, "revenue.view");
  const stats = (await partnerStats([p.id])).get(Number(p.id));

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "orders", label: "Orders", count: stats.assigned },
    { key: "pricing", label: "Pricing" },
    ...(canSettleView ? [{ key: "settlements", label: "Settlements" }] : []),
    { key: "logins", label: "Logins" },
    { key: "activity", label: "Activity" },
  ];
  const tab = TABS.find((t) => t.key === sp.tab)?.key ?? "overview";
  const base = `/crm/partners/${p.id}`;
  const tabHref = (key) => (key === "overview" ? base : `${base}?tab=${key}`);

  return (
    <>
      <PageHeader
        eyebrow={
          <span className="flex flex-wrap items-center gap-2">
            {partnerCode(p.id)} <PartnerRecordBadge status={p.status} />
          </span>
        }
        title={p.name}
        description={[p.contact_person, p.city_name || p.city, p.joined_on && `Partner since ${day(p.joined_on)}`].filter(Boolean).join(" · ")}
        back={{ href: "/crm/partners", label: "Lab partners" }}
        actions={
          <>
            {p.phone && (
              <>
                <a href={telHref(p.phone)} className={btn("secondary")}>
                  <Phone className="h-4 w-4" aria-hidden /> Call
                </a>
                <a href={waHref(p.phone, `Hello ${p.contact_person || p.name}, this is MedicoBharat.`)} target="_blank" rel="noreferrer" className={btn("secondary")}>
                  <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
                </a>
              </>
            )}
            {p.email && (
              <a href={`mailto:${p.email}`} className={btn("secondary")}>
                <Mail className="h-4 w-4" aria-hidden /> Email
              </a>
            )}
            {canManage && (
              <ButtonLink href={`${base}/edit`}>
                <Pencil className="h-4 w-4" aria-hidden /> Edit
              </ButtonLink>
            )}
            {canSettle && <GenerateSettlement partner={p} label="Create settlement" />}
          </>
        }
      />

      {sp.created && (
        <div className="mb-4">
          <Notice tone="emerald" title={`${p.name} added`}>
            Next: set its prices in the Pricing tab and create a login so the lab can accept orders.
          </Notice>
        </div>
      )}
      {sp.saved && (
        <div className="mb-4">
          <Notice tone="emerald">Changes saved.</Notice>
        </div>
      )}
      {p.status !== "active" && (
        <div className="mb-4">
          <Notice tone="amber">This lab is {p.status}. It cannot be sent new orders until it is active again.</Notice>
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-5">
        <KpiCard label="Orders assigned" value={num(stats.assigned)} sub="All time" />
        <KpiCard label="Completed" value={num(stats.completed)} sub="Report in" tone="emerald" />
        <KpiCard label="Open orders" value={num(stats.pending)} sub={stats.awaiting ? `${stats.awaiting} awaiting acceptance` : "In progress"} />
        <KpiCard label="Cancelled / rejected" value={`${num(stats.cancelled)} / ${num(stats.rejected)}`} />
        <KpiCard label="Avg report turnaround" value={hours(stats.avg_tat_hours)} sub="Sample received → report" />
        {canMoney && (
          <>
            <KpiCard label="Revenue generated" value={rupees(stats.revenue)} sub="Customer value of its orders" />
            <KpiCard label="Amount payable" value={rupees(stats.payable_pending)} sub="Unsettled + unpaid statements" tone="amber" />
            <KpiCard label="Amount paid" value={rupees(stats.paid_total)} sub="Settlements paid" tone="emerald" />
            <KpiCard label="Pending settlement" value={rupees(stats.unsettled)} sub={`${num(stats.unsettled_count)} orders not yet on a statement`} />
          </>
        )}
      </div>

      <Tabs tabs={TABS.map((t) => ({ ...t, href: tabHref(t.key) }))} active={tab} />

      {tab === "overview" && <Overview p={p} canBank={canSettle} canManage={canManage} />}
      {tab === "orders" && <Orders p={p} sp={sp} canMoney={canMoney} />}
      {tab === "pricing" && <Pricing p={p} sp={sp} canManage={canManage} />}
      {tab === "settlements" && canSettleView && <Settlements p={p} canSettle={canSettle} />}
      {tab === "logins" && <Logins p={p} canManage={canManage} />}
      {tab === "activity" && <PartnerActivity p={p} />}
    </>
  );
}

/* ── Overview ───────────────────────────────────────────────────────────── */

function Overview({ p, canBank, canManage }) {
  const account = p.bank_account ? (canBank ? p.bank_account : maskAccount(p.bank_account)) : "";
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="min-w-0 space-y-5 lg:col-span-2">
        <Card title="Lab details">
          <Facts
            items={[
              { label: "Owner / contact person", value: p.contact_person },
              { label: "Mobile", value: p.phone ? <a href={telHref(p.phone)} className="text-blue-700 hover:underline">{phone(p.phone)}</a> : "" },
              { label: "Alternate number", value: p.alt_phone },
              { label: "Email", value: p.email ? <a href={`mailto:${p.email}`} className="text-blue-700 hover:underline">{p.email}</a> : "" },
              { label: "Address", value: p.address, wide: true },
              { label: "City", value: p.city_name || p.city },
              { label: "Joined", value: p.joined_on ? day(p.joined_on) : "" },
              { label: "Agreement", value: <AgreementBadge status={p.agreement_status} /> },
              { label: "Default share", value: p.default_share_pct !== null ? `${Number(p.default_share_pct)}%` : "" },
              { label: "Cities served", value: p.cities.length ? p.cities.map((c) => c.name).join(", ") : "", wide: true },
            ]}
          />
        </Card>
        <Card title="Services & pricing">
          <Facts
            cols={1}
            items={[
              { label: "Services / tests offered", value: p.services ? <span className="whitespace-pre-line">{p.services}</span> : "" },
              { label: "Pricing note", value: p.pricing_note ? <span className="whitespace-pre-line">{p.pricing_note}</span> : "" },
            ]}
          />
        </Card>
      </div>
      <div className="space-y-5">
        <Card title="Business & bank" description={canBank ? null : "Account number masked — only staff who pay settlements see it in full."}>
          <Facts
            cols={1}
            items={[
              { label: "GSTIN", value: p.gstin },
              { label: "Bank", value: p.bank_name },
              { label: "Account number", value: account ? <span className="font-mono tabular-nums">{account}</span> : "" },
              { label: "IFSC", value: p.bank_ifsc },
              { label: "UPI ID", value: p.upi_id },
            ]}
          />
        </Card>
        {p.notes && (
          <Card title="Internal notes">
            <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-700">{p.notes}</p>
          </Card>
        )}
        <Card title="Record">
          <Facts
            cols={1}
            items={[
              { label: "Added", value: `${dateTime(p.created_at)}${p.created_by_name ? ` · ${p.created_by_name}` : ""}` },
              { label: "Last updated", value: dateTime(p.updated_at) },
            ]}
          />
        </Card>
        {canManage && (
          <ConfirmAction
            action={archivePartnerAction}
            fields={{ id: p.id }}
            label="Remove partner"
            variant="ghost"
            className="w-full text-slate-500"
            title={`Remove ${p.name}?`}
            body="It disappears from the partner list and its logins are disabled. Its orders, settlements and history are kept. A lab with open orders cannot be removed."
            confirmLabel="Remove"
          />
        )}
      </div>
    </div>
  );
}

/* ── Orders ─────────────────────────────────────────────────────────────── */

async function Orders({ p, sp, canMoney }) {
  const { limit, offset } = pageOf(sp);
  const status = BOOKING_STATUSES.find((s) => s.key === sp.status)?.key;
  const partnerStatus = PARTNER_STATUSES.find((s) => s.key === sp.partnerStatus)?.key;
  const list = await listBookings(
    { partnerId: p.id, status: status ? [status] : undefined, partnerStatus, search: String(sp.q ?? "").slice(0, 80), limit, offset },
    {}
  );
  const href = (changes) => withParams(`/crm/partners/${p.id}`, sp, changes);
  const columns = [
    { key: "code", label: "Booking", hideable: false },
    { key: "patient", label: "Patient" },
    { key: "tests", label: "Tests" },
    { key: "status", label: "Status" },
    { key: "lab", label: "Lab response" },
    ...(canMoney ? [{ key: "amount", label: "Customer", align: "right" }, { key: "cost", label: "Lab cost", align: "right" }] : []),
    { key: "date", label: "Booked" },
  ];
  return (
    <>
      <FilterBar
        search={{ placeholder: "Booking ID or patient name" }}
        filters={[
          { name: "status", label: "Status", options: BOOKING_STATUSES.map((s) => ({ value: s.key, label: s.label })) },
          { name: "partnerStatus", label: "Lab response", options: PARTNER_STATUSES.filter((s) => s.key !== "unassigned").map((s) => ({ value: s.key, label: s.label })) },
        ]}
      />
      <DataTable
        id="partner-orders"
        columns={columns}
        rows={list.rows}
        rowHref={(b) => `/crm/bookings/${b.id}`}
        cells={(b) => ({
          code: bookingCode(b.id),
          patient: <span className="whitespace-nowrap">{b.patient_name}{b.city ? <span className="block text-[11.5px] text-slate-500">{b.city}</span> : null}</span>,
          tests: <span className="line-clamp-2 max-w-[16rem]">{b.items_label || "—"}</span>,
          status: <BookingStatusBadge status={b.status} />,
          lab: <PartnerStatusBadge status={b.partner_status} />,
          amount: rupees(b.final_amount),
          cost: rupees(b.partner_cost),
          date: <span className="whitespace-nowrap">{date(b.created_at)}</span>,
        })}
        card={(b) => (
          <Link href={`/crm/bookings/${b.id}`} className="block">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-500">{bookingCode(b.id)} · {date(b.created_at)}</p>
                <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{b.patient_name}</p>
                <p className="mt-0.5 line-clamp-1 text-[13px] text-slate-600">{b.items_label || "—"}</p>
              </div>
              {canMoney && <p className="shrink-0 text-[14px] font-semibold tabular-nums">{rupees(b.partner_cost)}</p>}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <BookingStatusBadge status={b.status} />
              <PartnerStatusBadge status={b.partner_status} />
            </div>
          </Link>
        )}
        empty={<EmptyState icon={<ClipboardList className="h-5 w-5" />} title="No orders here" hint="Orders appear once a booking is sent to this lab from its booking page or the bookings list." />}
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(n) => href({ page: n > 1 ? n : null })} />}
      />
    </>
  );
}

/* ── Pricing ────────────────────────────────────────────────────────────── */

async function Pricing({ p, sp, canManage }) {
  const { limit, offset } = pageOf(sp, 50);
  const list = await listPartnerPricing(p.id, { search: String(sp.q ?? "").slice(0, 80), overridesOnly: sp.own === "1", limit, offset });
  const href = (changes) => withParams(`/crm/partners/${p.id}`, sp, changes);
  const priceForm = (t) =>
    canManage ? (
      <ActionForm action={partnerPriceAction} className="flex items-center justify-end gap-1.5">
        <input type="hidden" name="partnerId" value={p.id} />
        <input type="hidden" name="testId" value={t.id} />
        <Input
          name="price"
          inputMode="decimal"
          aria-label={`${p.name}'s price for ${t.name}`}
          placeholder={t.partner_price !== null ? String(Number(t.partner_price)) : "—"}
          defaultValue={t.own_price !== null ? String(Number(t.own_price)) : ""}
          className="h-9 w-24 py-0 text-right tabular-nums"
        />
        <SubmitButton size="sm" variant="secondary" pendingLabel="…">
          Save
        </SubmitButton>
      </ActionForm>
    ) : t.own_price !== null ? (
      rupees(t.own_price, { decimals: 0 })
    ) : (
      <span className="text-slate-400">Standard</span>
    );

  return (
    <>
      <Notice tone="slate" title="How lab cost is worked out">
        A booking sent to this lab uses its own price for a test when one is set here, otherwise the test&apos;s standard partner price.
        Existing bookings keep the cost they were priced at. Clear a price and save to go back to the standard one.
      </Notice>
      <div className="mt-4">
        <FilterBar
          search={{ placeholder: "Test or package name / code" }}
          filters={[{ name: "own", label: "Prices", options: [{ value: "1", label: "Only this lab's own prices" }] }]}
        />
      </div>
      <DataTable
        id="partner-pricing"
        columns={[
          { key: "test", label: "Test / package", hideable: false },
          { key: "customer", label: "Customer price", align: "right" },
          { key: "standard", label: "Standard partner price", align: "right" },
          { key: "own", label: `${p.name} price`, align: "right" },
          { key: "margin", label: "Margin", align: "right" },
        ]}
        rows={list.rows}
        cells={(t) => ({
          test: (
            <span className="block min-w-[12rem]">
              <span className="font-medium text-slate-900">{t.name}</span>
              <span className="block text-[11.5px] text-slate-500">
                {[t.code, t.is_package ? "Package" : null, t.status === "hidden" ? "Hidden on site" : null].filter(Boolean).join(" · ") || t.id}
              </span>
            </span>
          ),
          customer: t.price !== null ? rupees(t.price) : <span className="text-slate-400">Call for price</span>,
          standard: t.partner_price !== null ? rupees(t.partner_price) : <span className="text-slate-400">Not set</span>,
          own: priceForm(t),
          margin: <Margin t={t} />,
        })}
        card={(t) => (
          <div>
            <p className="text-[14px] font-semibold text-slate-900">{t.name}</p>
            <p className="mt-0.5 text-[12.5px] text-slate-500">
              Customer {t.price !== null ? rupees(t.price) : "—"} · Standard {t.partner_price !== null ? rupees(t.partner_price) : "not set"} · Margin <Margin t={t} />
            </p>
            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
              <span className="text-[12.5px] font-semibold text-slate-700">This lab&apos;s price</span>
              {priceForm(t)}
            </div>
          </div>
        )}
        empty={<EmptyState compact icon={<Tag className="h-5 w-5" />} title="No tests match" hint="Try another name, or clear the filter." />}
        footer={<Pagination total={list.total} limit={list.limit} offset={list.offset} hrefFor={(n) => href({ page: n > 1 ? n : null })} />}
      />
    </>
  );
}

function Margin({ t }) {
  const cost = t.own_price !== null ? Number(t.own_price) : t.partner_price !== null ? Number(t.partner_price) : null;
  if (t.price === null || cost === null) return <span className="text-slate-400">—</span>;
  const m = Number(t.price) - cost;
  return <span className={m < 0 ? "font-semibold text-rose-700" : ""}>{rupees(m)}</span>;
}

/* ── Settlements ────────────────────────────────────────────────────────── */

async function Settlements({ p, canSettle }) {
  const list = await listSettlements({ partnerId: p.id, limit: 50 }, {});
  return (
    <DataTable
      id="partner-settlements"
      columns={[
        { key: "code", label: "Statement", hideable: false },
        { key: "period", label: "Period" },
        { key: "count", label: "Orders", align: "right" },
        { key: "payable", label: "Net payable", align: "right" },
        { key: "paid", label: "Paid", align: "right" },
        { key: "status", label: "Status" },
      ]}
      rows={list.rows}
      rowHref={(s) => `/crm/settlements/${s.id}`}
      cells={(s) => ({
        code: settlementCode(s.id),
        period: <span className="whitespace-nowrap">{day(s.period_from)} – {day(s.period_to)}</span>,
        count: num(s.bookings_count),
        payable: rupees(s.net_payable),
        paid: s.paid_on ? <span className="whitespace-nowrap">{rupees(s.paid_amount)}<span className="block text-[11px] text-slate-500">{day(s.paid_on)}</span></span> : "—",
        status: <Badge tone={SETTLEMENT_STATUS[s.status]?.tone}>{SETTLEMENT_STATUS[s.status]?.label ?? s.status}</Badge>,
      })}
      card={(s) => (
        <Link href={`/crm/settlements/${s.id}`} className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-slate-500">{settlementCode(s.id)}</p>
            <p className="mt-0.5 text-[14px] font-semibold text-slate-900">{day(s.period_from)} – {day(s.period_to)}</p>
            <p className="mt-0.5 text-[12.5px] text-slate-500">{num(s.bookings_count)} orders</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[15px] font-semibold tabular-nums">{rupees(s.net_payable)}</p>
            <Badge tone={SETTLEMENT_STATUS[s.status]?.tone}>{SETTLEMENT_STATUS[s.status]?.label ?? s.status}</Badge>
          </div>
        </Link>
      )}
      empty={
        <EmptyState
          icon={<HandCoins className="h-5 w-5" />}
          title="No settlements yet"
          hint="Generate one when this lab has completed orders to be paid for."
          action={canSettle ? <GenerateSettlement partner={p} /> : null}
        />
      }
    />
  );
}

/* ── Logins ─────────────────────────────────────────────────────────────── */

async function Logins({ p, canManage }) {
  const logins = await listPartnerLogins(p.id);
  return (
    <Card
      title="Partner logins"
      description="People at the lab who sign in to accept orders, upload reports and see their payments. They only ever see this lab's orders."
      actions={
        canManage ? (
          <FormModal
            action={createPartnerLoginAction}
            fields={{ partnerId: p.id }}
            label="Create partner login"
            size="sm"
            variant="soft"
            icon={<UserPlus className="h-3.5 w-3.5" aria-hidden />}
            title="Create partner login"
            description={`For someone at ${p.name}. They sign in at /crm/login.`}
            submitLabel="Create login"
          >
            <Field label="Name" required htmlFor="pl-name">
              <Input id="pl-name" name="name" required maxLength={80} defaultValue={p.contact_person ?? ""} />
            </Field>
            <Field label="Email (used to sign in)" required htmlFor="pl-email">
              <Input id="pl-email" name="email" type="email" required maxLength={160} defaultValue={p.email ?? ""} autoComplete="off" />
            </Field>
            <Field label="Temporary password" required htmlFor="pl-password" hint="At least 10 characters. They can change it from their profile.">
              <Input id="pl-password" name="password" type="text" required minLength={10} autoComplete="new-password" />
            </Field>
          </FormModal>
        ) : null
      }
    >
      {logins.length ? (
        <ul className="divide-y divide-slate-100">
          {logins.map((l) => (
            <li key={l.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-[13.5px] font-medium text-slate-900">
                  {l.name || l.email}
                  <Badge tone={l.status === "active" ? "emerald" : "slate"}>{l.status === "active" ? "Active" : "Disabled"}</Badge>
                </p>
                <p className="mt-0.5 text-[12px] text-slate-500">
                  {l.email} · Last sign-in {l.last_login_at ? dateTime(l.last_login_at) : "never"}
                </p>
              </div>
              {canManage &&
                (l.status === "active" ? (
                  <ConfirmAction
                    action={partnerLoginStatusAction}
                    fields={{ partnerId: p.id, userId: l.id, status: "disabled" }}
                    label="Disable"
                    size="sm"
                    title={`Disable ${l.email}?`}
                    body="They are signed out on every device immediately and cannot sign in until re-enabled."
                    confirmLabel="Disable login"
                  />
                ) : (
                  <QuickAction action={partnerLoginStatusAction} fields={{ partnerId: p.id, userId: l.id, status: "active" }} size="sm" variant="soft">
                    Enable
                  </QuickAction>
                ))}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState compact icon={<KeyRound className="h-5 w-5" />} title="No logins yet" hint="Without a login the lab cannot accept orders or upload reports itself — staff have to do it for them." />
      )}
    </Card>
  );
}

/* ── Activity ───────────────────────────────────────────────────────────── */

async function PartnerActivity({ p }) {
  const rows = await partnerActivity(p.id);
  return (
    <Card title="Activity" description="Changes to this lab, and every order, report and settlement event involving it.">
      <Timeline
        items={rows.map((a) => ({
          id: a.id,
          title: a.summary || `${a.action} ${a.entity}`,
          meta: `${a.user_name || a.user_email || "System"} · ${dateTime(a.created_at)}`,
          href: activityLink(a),
          tone: { create: "emerald", update: "blue", payment: "emerald", accept: "emerald", reject: "rose", assign: "sky", delete: "rose", archive: "rose" }[a.action] ?? "slate",
        }))}
        empty={<EmptyState compact icon={<Activity className="h-5 w-5" />} title="Nothing yet" />}
      />
    </Card>
  );
}
