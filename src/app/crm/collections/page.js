import Link from "next/link";
import { CalendarDays, Truck, UserX } from "lucide-react";

import CollectionActions, { AssignCollector, addressOf } from "@/components/crm/dashboard/CollectionActions";
import { SummaryStrip } from "@/components/crm/dashboard/parts";
import FilterBar from "@/components/crm/FilterBar";
import {
  Badge,
  BookingStatusBadge,
  CollectionBadge,
  DataTable,
  EmptyState,
  PageHeader,
  Pagination,
  PaymentStatusBadge,
  btn,
  cx,
  withParams,
} from "@/components/crm/ui";
import { COLLECTION_STATUSES, bookingCode } from "@/lib/crm/constants";
import { day, phone, rupees, todayIST } from "@/lib/crm/format";
import { pageOf } from "@/lib/crm/filters";
import { has, requirePerm, scopeOf } from "@/lib/crm/guard";
import { listCollections, listUnassignedCollections } from "@/lib/crm/stores/dashboard";
import { listCities, listCollectors } from "@/lib/crm/stores/lookups";

export const metadata = { title: "Collections" };
export const dynamic = "force-dynamic";

const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
const validDay = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);

/**
 * The collector's day. A collector sees only the collections assigned to
 * them (scope, enforced in SQL and again by every action); staff see the
 * whole day with filters, plus the collections nobody has been sent to yet.
 *
 * Sorted by time slot, so the list reads as the route for the day. Every
 * card has the phone, the map, what to collect, and the next step as a
 * thumb-sized button.
 */
export default async function CollectionsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("collections.view", "/crm/collections");
  const scope = scopeOf(user);
  const collector = Boolean(scope.collectorId);

  const today = todayIST();
  const tomorrow = todayIST(1);
  const date = validDay(one(sp.date)) ?? today;
  const { limit, offset } = pageOf(sp);
  const filters = {
    day: date,
    collectorId: collector ? null : one(sp.collector) || null,
    cityId: collector ? null : one(sp.city) || null,
    status: COLLECTION_STATUSES.some((s) => s.key === one(sp.status)) ? one(sp.status) : null,
  };

  const can = {
    collect: has(user, "collections.manage"),
    pay: has(user, "payments.manage"),
    note: has(user, "bookings.manage") || has(user, "collections.manage"),
    assign: has(user, "bookings.assign") && !collector,
  };
  const showUnassigned = can.assign && !filters.collectorId && !filters.status;

  const [list, unassigned, collectors, cities] = await Promise.all([
    listCollections(filters, scope, { limit, offset, assignedOnly: showUnassigned }),
    showUnassigned ? listUnassignedCollections({ day: date, cityId: filters.cityId }) : [],
    collector ? [] : listCollectors(),
    collector ? [] : listCities(),
  ]);

  const href = (changes) => withParams("/crm/collections", sp, changes);
  const dayLabel = date === today ? "today" : date === tomorrow ? "tomorrow" : day(`${date}T00:00:00Z`);
  const s = list.summary;

  const statusCell = (b) => (
    <span className="flex flex-wrap gap-1">
      <CollectionBadge status={b.collection_status} />
      {b.status !== "collection_assigned" && b.status !== "confirmed" && b.status !== "booked" && <BookingStatusBadge status={b.status} />}
    </span>
  );
  const money = (b) =>
    b.due > 0 ? (
      <span className="whitespace-nowrap">
        <span className="font-semibold text-orange-700">Collect {rupees(b.due)}</span>
        <span className="mt-0.5 block">
          <PaymentStatusBadge status={b.payment_status} />
        </span>
      </span>
    ) : (
      <PaymentStatusBadge status={b.payment_status} />
    );
  const instructions = (b) =>
    [b.collection_note && `Collector: ${b.collection_note}`, !collector && b.notes && `Internal: ${b.notes}`].filter(Boolean);

  return (
    <>
      <PageHeader
        title={collector ? "My collections" : "Collections"}
        description={
          collector
            ? `Your home collections for ${dayLabel}, in slot order.`
            : `Home collections for ${dayLabel} — who is going where, and what is done.`
        }
      />

      {/* Date switcher: Today / Tomorrow / pick a date (a plain GET form, no script needed). */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[
          [today, "Today"],
          [tomorrow, "Tomorrow"],
        ].map(([d, label]) => (
          <Link
            key={d}
            href={href({ date: d === today ? null : d, page: null })}
            aria-current={date === d ? "page" : undefined}
            className={btn(date === d ? "primary" : "secondary", "md")}
          >
            {label}
          </Link>
        ))}
        <form action="/crm/collections" className="flex items-center gap-2">
          {Object.entries(sp)
            .filter(([k]) => !["date", "page"].includes(k))
            .map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={one(v)} />
            ))}
          <label className="sr-only" htmlFor="pick-date">
            Pick a date
          </label>
          <input
            id="pick-date"
            type="date"
            name="date"
            defaultValue={date}
            className="h-10 rounded-xl border-0 bg-white px-3 text-[14px] text-slate-900 ring-1 ring-inset ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button type="submit" className={btn("secondary", "md")}>
            <CalendarDays className="h-4 w-4" aria-hidden /> Go
          </button>
        </form>
      </div>

      {!collector && (
        <FilterBar
          filters={[
            {
              name: "collector",
              label: "Collector",
              options: [{ value: "none", label: "Not assigned" }, ...collectors.map((c) => ({ value: String(c.id), label: c.name || c.email }))],
            },
            { name: "city", label: "City", options: cities.map((c) => ({ value: String(c.id), label: c.name })) },
            { name: "status", label: "Collection status", options: COLLECTION_STATUSES.filter((x) => x.key !== "cancelled").map((x) => ({ value: x.key, label: x.label })) },
          ]}
        />
      )}

      <SummaryStrip
        items={[
          ...(collector ? [] : [{ label: "Scheduled", value: s.total }]),
          { label: collector ? "Assigned to you" : "Assigned", value: s.assigned, tone: "blue" },
          { label: "Done", value: s.done, tone: "emerald" },
          { label: "Failed", value: s.failed, tone: s.failed ? "rose" : "slate" },
          { label: "Pending", value: s.pending, tone: s.pending ? "amber" : "slate" },
          ...(collector ? [] : [{ label: "Not assigned", value: s.unassigned, tone: s.unassigned ? "amber" : "slate", href: s.unassigned ? href({ collector: "none", page: null }) : undefined }]),
        ]}
      />

      {showUnassigned && unassigned.length > 0 && (
        <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 sm:p-4" aria-labelledby="unassigned-h">
          <h2 id="unassigned-h" className="mb-3 flex items-center gap-2 text-[14.5px] font-semibold text-slate-900">
            <UserX className="h-4 w-4 text-amber-700" aria-hidden /> Not assigned yet
            <span className="rounded-full bg-amber-100 px-2 py-px text-[12px] font-semibold text-amber-800 tabular-nums">{unassigned.length}</span>
          </h2>
          <ul className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {unassigned.map((b) => (
              <li key={b.id} className="rounded-xl border border-slate-200/80 bg-white p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/crm/bookings/${b.id}`} className="text-[12px] font-semibold text-slate-500 hover:text-blue-700">
                      {bookingCode(b.id)}
                    </Link>
                    <p className="truncate text-[14.5px] font-semibold text-slate-900">{b.patient_name}</p>
                    <p className="truncate text-[12.5px] text-slate-500">{[b.area, b.city].filter(Boolean).join(", ") || "No area"}</p>
                  </div>
                  <Badge tone="slate" dot={false}>
                    {b.collection_slot || "Any time"}
                  </Badge>
                </div>
                <p className="mt-1.5 line-clamp-1 text-[12.5px] text-slate-600">{b.items_label || "—"}</p>
                <div className="mt-3">
                  <AssignCollector b={b} collectors={collectors} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <DataTable
        id="collections-table"
        columns={[
          { key: "slot", label: "Slot" },
          { key: "customer", label: "Customer" },
          { key: "address", label: "Address" },
          { key: "tests", label: "Tests" },
          ...(collector ? [] : [{ key: "collector", label: "Collector" }]),
          { key: "status", label: "Status" },
          { key: "money", label: "Payment" },
          { key: "actions", label: "Actions", align: "right" },
        ]}
        rows={list.rows}
        cells={(b) => ({
          slot: <span className="whitespace-nowrap font-semibold text-slate-900">{b.collection_slot || "Any time"}</span>,
          customer: (
            <span className="block min-w-[10rem]">
              <Link href={`/crm/bookings/${b.id}`} className="font-medium text-slate-900 hover:text-blue-700">
                {b.patient_name}
              </Link>
              <span className="block text-[11.5px] text-slate-500">
                {bookingCode(b.id)} · {phone(b.patient_phone)}
              </span>
            </span>
          ),
          address: (
            <span className="block max-w-[16rem]">
              <span className="line-clamp-2">{addressOf(b) || "—"}</span>
              {instructions(b).map((t) => (
                <span key={t} className="mt-0.5 block text-[11.5px] text-amber-800">
                  {t}
                </span>
              ))}
            </span>
          ),
          tests: <span className="line-clamp-2 max-w-[12rem]">{b.items_label || "—"}</span>,
          collector: b.collector_name || <span className="text-slate-400">—</span>,
          status: statusCell(b),
          money: money(b),
          actions: (
            <span className="flex flex-col items-end gap-1.5">
              {!b.collector_id && can.assign && <AssignCollector b={b} collectors={collectors} compact />}
              <CollectionActions b={b} can={can} compact />
            </span>
          ),
        })}
        card={(b) => (
          <article>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                  <Link href={`/crm/bookings/${b.id}`} className="hover:text-blue-700">
                    {bookingCode(b.id)}
                  </Link>
                  <span aria-hidden>·</span>
                  <span className="text-slate-800">{b.collection_slot || "Any time"}</span>
                </p>
                <p className="mt-0.5 truncate text-[16px] font-semibold text-slate-900">{b.patient_name}</p>
                <p className="text-[13px] text-slate-600">
                  {phone(b.patient_phone)}
                  {b.alt_phone ? ` · alt ${b.alt_phone}` : ""}
                </p>
              </div>
              <CollectionBadge status={b.collection_status} />
            </div>

            <p className="mt-2 text-[13px] leading-snug text-slate-700">{addressOf(b) || "No address on the booking"}</p>
            <p className="mt-1.5 text-[13px] text-slate-600">
              <span className="font-medium text-slate-800">Tests:</span> {b.items_label || "—"}
            </p>
            {!collector && b.collector_name && <p className="mt-1 text-[12.5px] text-slate-500">Collector: {b.collector_name}</p>}

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {b.due > 0 ? (
                <Badge tone="orange">Collect {rupees(b.due)}</Badge>
              ) : (
                <PaymentStatusBadge status={b.payment_status} />
              )}
              {b.status !== "collection_assigned" && b.status !== "confirmed" && b.status !== "booked" && <BookingStatusBadge status={b.status} />}
            </div>

            {instructions(b).length > 0 && (
              <div className="mt-2 rounded-lg bg-amber-50 px-2.5 py-2 text-[12.5px] leading-snug text-amber-900 ring-1 ring-inset ring-amber-600/15">
                {instructions(b).map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            )}

            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
              {!b.collector_id && can.assign && <AssignCollector b={b} collectors={collectors} />}
              <CollectionActions b={b} can={can} />
            </div>
          </article>
        )}
        empty={
          <EmptyState
            icon={<Truck className="h-5 w-5" />}
            title={
              filters.collectorId || filters.cityId || filters.status
                ? "No collections match these filters"
                : showUnassigned && unassigned.length
                  ? `Nothing assigned yet for ${dayLabel}`
                  : `No collections scheduled for ${dayLabel}`
            }
            hint={
              collector
                ? "When a collection is assigned to you, it appears here and you get a notification."
                : showUnassigned && unassigned.length
                  ? "Assign a collector to the bookings above."
                  : "Bookings with a collection date appear here. Pick another day to look ahead."
            }
            action={
              date !== tomorrow ? (
                <Link href={href({ date: tomorrow, page: null })} className={cx(btn("secondary"))}>
                  See tomorrow
                </Link>
              ) : null
            }
          />
        }
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(p) => href({ page: p > 1 ? p : null })} />}
      />
    </>
  );
}
