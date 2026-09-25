/**
 * URL search params → store filters. One parser per list, shared by the page
 * that renders the list and the export that downloads it, so "export what I
 * am looking at" is always exactly what is on screen.
 */
import { range } from "./dates";

export const PAGE_SIZE = 25;

const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

export function pageOf(sp, size = PAGE_SIZE) {
  const page = Math.max(1, Math.floor(Number(one(sp.page)) || 1));
  return { page, limit: size, offset: (page - 1) * size };
}

/** { range, from, to } → { from, to, fromDay, toDay, label } or null. */
export function dateRangeOf(sp, fallback = null) {
  const name = one(sp.range) || fallback;
  if (!name) return null;
  return range(name, { from: one(sp.from), to: one(sp.to) });
}

/** Booking list tabs → status sets. */
export const BOOKING_TABS = [
  { key: "all", label: "All", statuses: null },
  { key: "new", label: "New", statuses: ["booked", "confirmed"] },
  { key: "collection", label: "Collection", statuses: ["collection_assigned", "sample_collected"] },
  { key: "lab", label: "In lab", statuses: ["sample_received", "processing"] },
  { key: "report", label: "Report ready", statuses: ["report_ready"] },
  { key: "done", label: "Delivered", statuses: ["report_delivered", "completed"] },
  { key: "cancelled", label: "Cancelled", statuses: ["cancelled"] },
];

export function bookingFiltersFrom(sp) {
  const r = dateRangeOf(sp);
  const tab = BOOKING_TABS.find((t) => t.key === one(sp.tab)) ?? BOOKING_TABS[0];
  const status = one(sp.status);
  return {
    ...(r ? { from: r.from, to: r.to, fromDay: r.fromDay, toDay: r.toDay } : {}),
    dateField: one(sp.dateField) === "collection" ? "collection" : "created",
    cityId: one(sp.city) || null,
    area: one(sp.area) || null,
    testId: one(sp.test) || null,
    partnerId: one(sp.partner) === "none" ? null : one(sp.partner) || null,
    unassignedPartner: one(sp.partner) === "none",
    collectorId: one(sp.collector) === "none" ? null : one(sp.collector) || null,
    unassignedCollector: one(sp.collector) === "none",
    status: status ? [status] : tab.statuses ?? undefined,
    paymentStatus: one(sp.payment) || null,
    source: one(sp.source) || null,
    reportStatus: one(sp.report) || null,
    partnerStatus: one(sp.partnerStatus) || null,
    customerId: one(sp.customer) || null,
    search: one(sp.q).slice(0, 80),
    sort: one(sp.sort) || "newest",
    rangeLabel: r?.label ?? null,
    tab: tab.key,
  };
}
