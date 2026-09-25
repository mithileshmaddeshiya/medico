import Link from "next/link";
import { ClipboardList, Download, Plus } from "lucide-react";

import { query } from "@/lib/db";
import {
  Badge,
  BookingStatusBadge,
  ButtonLink,
  DataTable,
  EmptyState,
  Notice,
  PageHeader,
  Pagination,
  PartnerStatusBadge,
  PaymentStatusBadge,
  SourceBadge,
  Tabs,
  btn,
  withParams,
} from "@/components/crm/ui";
import FilterBar, { ColumnToggle } from "@/components/crm/FilterBar";
import BulkBar from "@/components/crm/BulkBar";
import { has, requirePerm, scopeOf } from "@/lib/crm/guard";
import {
  BOOKING_STATUSES,
  PARTNER_STATUSES,
  PAYMENT_STATUSES,
  REPORT_STATUSES,
  SOURCES,
  bookingCode,
} from "@/lib/crm/constants";
import { BOOKING_TABS, bookingFiltersFrom, pageOf } from "@/lib/crm/filters";
import { date, day, phone, rupees } from "@/lib/crm/format";
import { listBookings, scopeWhere } from "@/lib/crm/stores/bookings";
import { listBookableTests, listCities, listCollectors, listPartnerOptions } from "@/lib/crm/stores/lookups";
import { syncPending } from "@/lib/crm/sync";

import { bulkAction } from "./actions";

export const metadata = { title: "Bookings" };
export const dynamic = "force-dynamic";

/**
 * Every booking, from every source, in one list — filtered and paginated in
 * SQL (25 a page), never in the browser. Tabs are the workflow stages; the
 * filter row covers the rest. On a phone each row is a card.
 *
 * A lab partner lands here as "Orders" and sees only its own, without the
 * customer's phone, address or price (forPartner() in the store).
 */
export default async function BookingsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm(["bookings.view"], "/crm/bookings");
  const scope = scopeOf(user);
  const partner = user.isPartner;
  const filters = bookingFiltersFrom(sp);
  const { limit, offset } = pageOf(sp);

  if (!partner) await syncPending();

  const s = scopeWhere(scope);
  const [list, tabCounts, cities, partners, collectors, tests] = await Promise.all([
    listBookings({ ...filters, limit, offset }, scope),
    query(
      `SELECT b.status, COUNT(*) AS n FROM bookings b WHERE b.deleted_at IS NULL ${s.sql.length ? `AND ${s.sql.join(" AND ")}` : ""} GROUP BY b.status`,
      s.params
    ).then(([rows]) => Object.fromEntries(rows.map((r) => [r.status, Number(r.n)]))),
    partner ? [] : listCities(),
    partner ? [] : listPartnerOptions(),
    partner ? [] : listCollectors(),
    partner ? [] : listBookableTests(),
  ]);

  const count = (statuses) =>
    statuses ? statuses.reduce((a, st) => a + (tabCounts[st] ?? 0), 0) : Object.values(tabCounts).reduce((a, b) => a + b, 0);
  const canAssign = has(user, "bookings.assign");
  const canManage = has(user, "bookings.manage");
  const canExport = has(user, "export.data");

  const columns = partner
    ? [
        { key: "code", label: "Order", hideable: false },
        { key: "patient", label: "Patient" },
        { key: "tests", label: "Tests" },
        { key: "accept", label: "Your response" },
        { key: "status", label: "Status" },
        { key: "cost", label: "Your amount", align: "right" },
        { key: "date", label: "Booked", sortKey: "newest" },
      ]
    : [
        { key: "code", label: "Booking", hideable: false },
        { key: "patient", label: "Customer" },
        { key: "tests", label: "Tests" },
        { key: "source", label: "Source" },
        { key: "status", label: "Status" },
        { key: "collection", label: "Collection", sortKey: "collection" },
        { key: "lab", label: "Lab" },
        { key: "payment", label: "Payment" },
        { key: "amount", label: "Amount", align: "right", sortKey: "amount" },
        { key: "date", label: "Booked", sortKey: "newest" },
      ];

  const href = (changes) => withParams("/crm/bookings", sp, changes);

  return (
    <>
      <PageHeader
        title={partner ? "Orders" : "Bookings"}
        description={
          partner
            ? "Orders MedicoBharat has sent to your lab. Accept them, mark samples received, and upload reports."
            : "Every booking — website, phone, WhatsApp, walk-in — through one workflow."
        }
        actions={
          <>
            {canExport && (
              <a href={withParams("/api/crm/export/bookings", sp, { format: "xls", page: null })} className={btn("secondary")}>
                <Download className="h-4 w-4" aria-hidden /> Export
              </a>
            )}
            {canManage && (
              <ButtonLink href="/crm/bookings/new" variant="primary">
                <Plus className="h-4 w-4" aria-hidden /> New booking
              </ButtonLink>
            )}
          </>
        }
      />

      {sp.deleted && <div className="mb-4"><Notice tone="slate">Booking deleted. It is kept in the activity log and can be restored by the owner.</Notice></div>}

      <Tabs
        active={filters.tab}
        tabs={BOOKING_TABS.map((t) => ({ key: t.key, label: t.label, href: href({ tab: t.key === "all" ? null : t.key, status: null, page: null }), count: count(t.statuses) }))}
      />

      <FilterBar
        search={{ placeholder: partner ? "Order ID or patient name" : "Booking ID, name or mobile" }}
        filters={
          partner
            ? [
                { name: "partnerStatus", label: "Response", options: PARTNER_STATUSES.filter((p) => p.key !== "unassigned").map((p) => ({ value: p.key, label: p.label })) },
                { name: "report", label: "Report", options: REPORT_STATUSES.map((r) => ({ value: r.key, label: r.label })) },
                { name: "range", label: "Any date", type: "range" },
              ]
            : [
                { name: "range", label: "Any date", type: "range" },
                { name: "status", label: "Status", options: BOOKING_STATUSES.map((x) => ({ value: x.key, label: x.label })) },
                { name: "city", label: "City", options: cities.map((c) => ({ value: String(c.id), label: c.name })) },
                { name: "test", label: "Test / package", options: tests.map((t) => ({ value: t.id, label: `${t.isPackage ? "📦 " : ""}${t.name}` })) },
                { name: "partner", label: "Lab", options: [{ value: "none", label: "No lab yet" }, ...partners.map((p) => ({ value: String(p.id), label: p.name }))] },
                { name: "collector", label: "Collector", options: [{ value: "none", label: "Not assigned" }, ...collectors.map((c) => ({ value: String(c.id), label: c.name || c.email }))] },
                { name: "payment", label: "Payment", options: PAYMENT_STATUSES.map((x) => ({ value: x.key, label: x.label })) },
                { name: "source", label: "Source", options: SOURCES.map((x) => ({ value: x.key, label: x.label })) },
                { name: "report", label: "Report", options: REPORT_STATUSES.map((x) => ({ value: x.key, label: x.label })) },
              ]
        }
      >
        <ColumnToggle tableId="bookings-table" columns={columns} />
      </FilterBar>

      {(canAssign || canManage) && !partner && list.rows.length > 0 && (
        <BulkBar
          action={bulkAction}
          formId="bookings-bulk"
          partners={canAssign ? partners.map((p) => ({ value: String(p.id), label: p.name })) : null}
          collectors={canAssign ? collectors.map((c) => ({ value: String(c.id), label: c.name || c.email })) : null}
          statuses={canManage ? BOOKING_STATUSES.map((x) => ({ value: x.key, label: x.label })) : null}
        />
      )}

      <DataTable
        id="bookings-table"
        columns={columns}
        rows={list.rows}
        select={(canAssign || canManage) && !partner ? { form: "bookings-bulk" } : null}
        rowHref={(b) => `/crm/bookings/${b.id}`}
        sort={{ current: filters.sort, hrefFor: (k) => href({ sort: k, page: null }) }}
        cells={(b) =>
          partner
            ? {
                code: bookingCode(b.id),
                patient: (
                  <span>
                    {b.patient_name}
                    <span className="block text-[11.5px] text-slate-500">
                      {[b.age ? `${b.age} y` : null, b.gender || null].filter(Boolean).join(" · ") || "—"}
                    </span>
                  </span>
                ),
                tests: <span className="line-clamp-2 max-w-[18rem]">{b.items_label}</span>,
                accept: <PartnerStatusBadge status={b.partner_status} />,
                status: <BookingStatusBadge status={b.status} />,
                cost: rupees(b.partner_cost),
                date: date(b.created_at),
              }
            : {
                code: (
                  <span className="whitespace-nowrap">
                    {bookingCode(b.id)}
                  </span>
                ),
                patient: (
                  <span className="whitespace-nowrap">
                    <span className="font-medium text-slate-900">{b.patient_name}</span>
                    <span className="block text-[11.5px] text-slate-500">{phone(b.patient_phone)}{b.city ? ` · ${b.city}` : ""}</span>
                  </span>
                ),
                tests: <span className="line-clamp-2 max-w-[16rem]">{b.items_label || "—"}</span>,
                source: <SourceBadge source={b.source} />,
                status: <BookingStatusBadge status={b.status} />,
                collection: b.collection_date ? (
                  <span className="whitespace-nowrap">
                    {day(b.collection_date)}
                    <span className="block text-[11.5px] text-slate-500">{b.collection_slot || "Any time"}{b.collector_name ? ` · ${b.collector_name}` : ""}</span>
                  </span>
                ) : (
                  <span className="text-slate-400">Not scheduled</span>
                ),
                lab: b.partner_name ? (
                  <span className="whitespace-nowrap">
                    {b.partner_name}
                    {b.partner_status !== "accepted" && (
                      <span className="block">
                        <PartnerStatusBadge status={b.partner_status} />
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                ),
                payment: <PaymentStatusBadge status={b.payment_status} />,
                amount: rupees(b.final_amount),
                date: <span className="whitespace-nowrap">{date(b.created_at)}</span>,
              }
        }
        card={(b) => (
          <Link href={`/crm/bookings/${b.id}`} className="block">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                  {bookingCode(b.id)} {!partner && <SourceBadge source={b.source} />}
                </p>
                <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{b.patient_name}</p>
                <p className="mt-0.5 line-clamp-1 text-[13px] text-slate-600">{b.items_label || "—"}</p>
              </div>
              <p className="shrink-0 text-[15px] font-semibold text-slate-900 tabular-nums">
                {partner ? rupees(b.partner_cost) : rupees(b.final_amount)}
              </p>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <BookingStatusBadge status={b.status} />
              {partner ? <PartnerStatusBadge status={b.partner_status} /> : <PaymentStatusBadge status={b.payment_status} />}
              {!partner && b.collection_date && (
                <Badge tone="slate" dot={false}>
                  {day(b.collection_date)} {b.collection_slot ? `· ${b.collection_slot}` : ""}
                </Badge>
              )}
            </div>
          </Link>
        )}
        empty={
          <EmptyState
            icon={<ClipboardList className="h-5 w-5" />}
            title={filters.search || filters.from || filters.status ? "No bookings match these filters" : partner ? "No orders yet" : "No bookings yet"}
            hint={
              filters.search || filters.from || filters.status
                ? "Try a wider date range, another tab, or clear the filters."
                : partner
                  ? "When MedicoBharat sends your lab an order, it appears here and you are notified."
                  : "Website bookings appear here automatically. Phone and walk-in bookings are added with New booking."
            }
            action={
              canManage && !partner ? (
                <ButtonLink href="/crm/bookings/new" variant="primary">
                  <Plus className="h-4 w-4" aria-hidden /> New booking
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
