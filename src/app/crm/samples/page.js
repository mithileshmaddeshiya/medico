import Link from "next/link";
import { TestTube2 } from "lucide-react";

import { SummaryStrip } from "@/components/crm/dashboard/parts";
import FilterBar from "@/components/crm/FilterBar";
import { QuickAction } from "@/components/crm/forms";
import {
  Badge,
  BookingStatusBadge,
  DataTable,
  EmptyState,
  PageHeader,
  Pagination,
  PartnerStatusBadge,
  Tabs,
  withParams,
} from "@/components/crm/ui";
import { bookingCode } from "@/lib/crm/constants";
import { dateTime } from "@/lib/crm/format";
import { pageOf } from "@/lib/crm/filters";
import { has, requirePerm, scopeOf } from "@/lib/crm/guard";
import { slaSettings, waited } from "@/lib/crm/sla";
import { SAMPLE_TABS, listSamples } from "@/lib/crm/stores/dashboard";
import { listCities, listPartnerOptions } from "@/lib/crm/stores/lookups";

import { labProgressAction } from "../bookings/actions";

export const metadata = { title: "Samples" };
export const dynamic = "force-dynamic";

const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

/**
 * Where every sample is between the patient's arm and the lab's report:
 * collected and in transit, received, processing. A sample in transit longer
 * than the SLA (Settings → sample receive hours) is flagged delayed.
 *
 * Staff with bookings.manage can mark a sample received (or processing) on
 * the lab's behalf — the same labProgress() the lab itself uses, so the
 * activity log says who did it. A lab partner sees only its own samples.
 */
export default async function SamplesPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("bookings.view", "/crm/samples");
  const scope = scopeOf(user);
  const partner = user.isPartner;
  const tab = SAMPLE_TABS.some((t) => t.key === one(sp.tab)) ? one(sp.tab) : "awaiting";
  const { limit, offset } = pageOf(sp);

  const settings = await slaSettings();
  const hoursLimit = Number(settings.sample_receive_hours) || 6;

  const [data, cities, partners] = await Promise.all([
    listSamples(
      { tab, search: one(sp.q).slice(0, 80), cityId: partner ? null : one(sp.city) || null, partnerId: partner ? null : one(sp.partner) || null, limit, offset },
      scope,
      hoursLimit
    ),
    partner ? [] : listCities(),
    partner ? [] : listPartnerOptions(),
  ]);

  // Staff act for the lab with bookings.manage; the lab itself on its accepted orders.
  const canAct = (b) => (partner ? b.partner_status === "accepted" && has(user, "reports.manage") : has(user, "bookings.manage"));
  const href = (changes) => withParams("/crm/samples", sp, changes);
  const c = data.counts;

  const delay = (b) => {
    if (b.transit_min === null) return <span className="text-slate-400">—</span>;
    const label = waited(b.transit_min);
    return b.delayed ? (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span className="font-semibold text-rose-700">{label}</span>
        <Badge tone="rose">Delayed</Badge>
      </span>
    ) : (
      <span className="text-slate-700">{label}</span>
    );
  };

  const action = (b) => {
    if (!canAct(b)) return null;
    if (b.status === "sample_collected") {
      return (
        <QuickAction action={labProgressAction} fields={{ id: b.id, stage: "sample_received" }} variant="primary" size="sm">
          Mark received
        </QuickAction>
      );
    }
    if (b.status === "sample_received") {
      return (
        <QuickAction action={labProgressAction} fields={{ id: b.id, stage: "processing" }} variant="secondary" size="sm">
          Mark processing
        </QuickAction>
      );
    }
    return null;
  };

  const columns = [
    { key: "code", label: "Booking" },
    { key: "patient", label: "Patient" },
    { key: "tests", label: "Tests" },
    { key: "collected", label: "Collected" },
    ...(partner ? [] : [{ key: "collector", label: "Collector" }]),
    ...(partner ? [] : [{ key: "lab", label: "Lab" }]),
    { key: "received", label: "Received" },
    { key: "delay", label: tab === "awaiting" ? "Waiting" : "Transit time" },
    { key: "actions", label: "", align: "right" },
  ];

  return (
    <>
      <PageHeader
        title="Samples"
        description={`Collected → received by the lab → processing. A sample not at the lab within ${hoursLimit} h of collection is flagged delayed.`}
      />

      <SummaryStrip
        items={[
          { label: "Awaiting lab", value: c.awaiting, tone: c.awaiting ? "amber" : "slate", href: href({ tab: null, page: null }) },
          { label: "Delayed", value: c.delayed, tone: c.delayed ? "rose" : "slate" },
          { label: "Received", value: c.received, tone: "blue" },
          { label: "Processing", value: c.processing },
          { label: "Collected today", value: c.today, tone: "emerald" },
        ]}
      />

      <Tabs
        active={tab}
        tabs={SAMPLE_TABS.map((t) => ({
          key: t.key,
          label: t.label,
          href: href({ tab: t.key === "awaiting" ? null : t.key, page: null }),
          count: c[t.key],
        }))}
      />

      <FilterBar
        search={{ placeholder: "Booking ID or patient name" }}
        filters={
          partner
            ? []
            : [
                { name: "city", label: "City", options: cities.map((x) => ({ value: String(x.id), label: x.name })) },
                { name: "partner", label: "Lab", options: [{ value: "none", label: "No lab yet" }, ...partners.map((p) => ({ value: String(p.id), label: p.name }))] },
              ]
        }
      />

      <DataTable
        id="samples-table"
        columns={columns}
        rows={data.rows}
        rowHref={(b) => `/crm/bookings/${b.id}`}
        cells={(b) => ({
          code: <span className="whitespace-nowrap">{bookingCode(b.id)}</span>,
          patient: (
            <span className="whitespace-nowrap">
              <span className="font-medium text-slate-900">{b.patient_name}</span>
              <span className="block text-[11.5px] text-slate-500">{[b.age ? `${b.age} y` : null, b.gender || null, b.city || null].filter(Boolean).join(" · ") || "—"}</span>
            </span>
          ),
          tests: <span className="line-clamp-2 max-w-[14rem]">{b.items_label || "—"}</span>,
          collected: <span className="whitespace-nowrap">{dateTime(b.collected_at)}</span>,
          collector: b.collector_name || <span className="text-slate-400">—</span>,
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
            <Badge tone="amber">No lab</Badge>
          ),
          received: b.sample_received_at ? (
            <span className="whitespace-nowrap">
              {dateTime(b.sample_received_at)}
              {b.status !== "sample_received" && (
                <span className="block">
                  <BookingStatusBadge status={b.status} />
                </span>
              )}
            </span>
          ) : (
            <span className="text-slate-400">Not yet</span>
          ),
          delay: delay(b),
          actions: action(b),
        })}
        card={(b) => (
          <div>
            <Link href={`/crm/bookings/${b.id}`} className="block">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-slate-500">{bookingCode(b.id)}</p>
                  <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{b.patient_name}</p>
                  <p className="mt-0.5 line-clamp-1 text-[13px] text-slate-600">{b.items_label || "—"}</p>
                </div>
                <div className="shrink-0 text-right text-[12.5px]">{delay(b)}</div>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[12.5px]">
                <div>
                  <dt className="text-slate-500">Collected</dt>
                  <dd className="text-slate-800">{dateTime(b.collected_at)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Received</dt>
                  <dd className="text-slate-800">{b.sample_received_at ? dateTime(b.sample_received_at) : "Not yet"}</dd>
                </div>
                {!partner && (
                  <>
                    <div>
                      <dt className="text-slate-500">Collector</dt>
                      <dd className="text-slate-800">{b.collector_name || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Lab</dt>
                      <dd className="text-slate-800">{b.partner_name || "No lab"}</dd>
                    </div>
                  </>
                )}
              </dl>
            </Link>
            {action(b) && <div className="mt-3 flex border-t border-slate-100 pt-3 [&_button]:h-10 [&_button]:w-full">{action(b)}</div>}
          </div>
        )}
        empty={
          <EmptyState
            icon={<TestTube2 className="h-5 w-5" />}
            title={
              one(sp.q) || one(sp.city) || one(sp.partner)
                ? "No samples match these filters"
                : tab === "awaiting"
                  ? "No samples waiting for the lab"
                  : tab === "today"
                    ? "No samples collected today"
                    : tab === "received"
                      ? "No samples just received"
                      : "Nothing in processing"
            }
            hint={tab === "awaiting" ? "When a collector marks a sample collected, it appears here until the lab receives it." : "Try another tab."}
          />
        }
        footer={<Pagination total={data.total} limit={limit} offset={offset} hrefFor={(p) => href({ page: p > 1 ? p : null })} />}
      />
    </>
  );
}
