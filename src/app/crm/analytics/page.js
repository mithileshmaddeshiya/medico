import { Clock, IndianRupee, Percent, Repeat, XCircle } from "lucide-react";

import { KpiCard, PageHeader } from "@/components/crm/ui";
import ChartFrame from "@/components/crm/charts/ChartFrame";
import LineChart from "@/components/crm/charts/LineChart";
import BarChart from "@/components/crm/charts/BarChart";
import ShareBar from "@/components/crm/charts/ShareBar";
import StatTile from "@/components/crm/charts/StatTile";
import RangeControl from "@/components/crm/charts/RangeControl";
import { ORDINAL, SERIES, fmt, xLabel } from "@/components/crm/charts/scale";
import { has, requirePerm } from "@/lib/crm/guard";
import { hours, num, pct, rupeesShort } from "@/lib/crm/format";
import { RANGE_PRESETS, analyticsRange, getBusinessAnalytics } from "@/lib/crm/stores/analytics";
import { syncPending } from "@/lib/crm/sync";

import { AnalyticsTabs, EMPTY_BOOKINGS } from "./shared";

export const metadata = { title: "Business analytics" };
export const dynamic = "force-dynamic";

/**
 * How the business is doing over a chosen period: bookings, cash, lead
 * conversion, where bookings come from, what is booked, how often people
 * come back and how fast reports turn around. Every figure is aggregated in
 * SQL (src/lib/crm/stores/analytics.js); this page only lays it out.
 *
 * Revenue appears only for roles with revenue.view — the rest of the page
 * is operational and open to anyone with analytics.view.
 */
export default async function BusinessAnalyticsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("analytics.view", "/crm/analytics");
  const withRevenue = has(user, "revenue.view");
  const { key, r, prev } = analyticsRange(sp);

  await syncPending();
  const a = await getBusinessAnalytics(r, prev, { withRevenue });

  const none = a.totals.bookings === 0;
  const keysLong = a.keys.map((k) => xLabel(k, true));
  const per = a.unit === "day" ? "day" : "month";
  const compare = `vs previous ${r.days} days`;

  // Channels: online = website; calls = phone + WhatsApp.
  const src = a.sources;
  const online = src.website ?? 0;
  const calls = (src.phone ?? 0) + (src.whatsapp ?? 0);
  const otherChannels = a.active - online - calls;

  const f = a.funnel;
  const funnel = [
    { label: "Leads", value: f.total },
    { label: "Contacted", value: f.contacted },
    { label: "Booked", value: f.booked },
    { label: "Report delivered / completed", value: f.completed },
  ].map((s, i) => ({ ...s, color: ORDINAL[i], sub: f.total && i ? `${((s.value / f.total) * 100).toFixed(0)}% of leads` : undefined }));

  const tat = a.tat;
  const repeat = a.repeat;

  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="Business analytics"
        description={`Bookings, leads, channels and turnaround · ${r.label}.`}
      />
      <AnalyticsTabs active="business" sp={sp} user={user} />
      <RangeControl path="/crm/analytics" sp={sp} presets={RANGE_PRESETS} active={key} r={r} />

      {/* Headline figures */}
      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        <StatTile
          label="Bookings"
          value={num(a.totals.bookings)}
          current={a.totals.bookings}
          previous={a.prevTotals.bookings}
          compareLabel={compare}
          sub={`${num(a.totals.bookings - a.totals.cancelled)} active · ${num(a.totals.cancelled)} cancelled`}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-2">
          {withRevenue && (
            <KpiCard
              label="Revenue (cash, net of refunds)"
              value={rupeesShort(a.cash.net)}
              current={a.cash.net}
              previous={a.prevCash.net}
              compareLabel={compare}
              icon={<IndianRupee className="h-4 w-4" />}
            />
          )}
          <KpiCard
            label="Lead conversion"
            value={pct(f.conversion, 1)}
            current={f.conversion ?? undefined}
            previous={a.prevFunnel.conversion ?? 0}
            compareLabel={compare}
            sub={`${num(f.booked)} of ${num(f.total)} leads · before ${pct(a.prevFunnel.conversion, 1)}`}
            icon={<Percent className="h-4 w-4" />}
            tone="violet"
          />
          <KpiCard
            label="Cancellation rate"
            value={pct(a.totals.cancelRate, 1)}
            current={a.totals.cancelRate ?? undefined}
            previous={a.prevTotals.cancelRate ?? 0}
            upIsGood={false}
            compareLabel={compare}
            sub={`before ${pct(a.prevTotals.cancelRate, 1)}`}
            icon={<XCircle className="h-4 w-4" />}
            tone="rose"
          />
          <KpiCard
            label="Avg report turnaround"
            value={hours(tat.avgHours)}
            current={tat.avgHours ?? undefined}
            previous={a.prevTat.avgHours ?? 0}
            upIsGood={false}
            compareLabel={compare}
            sub="Sample received → report ready"
            icon={<Clock className="h-4 w-4" />}
            tone="amber"
          />
          <KpiCard
            label="Repeat customers"
            value={pct(repeat.repeatPct, 0)}
            current={repeat.repeatPct ?? undefined}
            previous={a.prevRepeat.repeatPct ?? 0}
            compareLabel={compare}
            sub={`${num(repeat.repeat)} of ${num(repeat.customers)} customers`}
            icon={<Repeat className="h-4 w-4" />}
            tone="teal"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartFrame
          className="lg:col-span-2"
          title="Booking trend"
          description={`Bookings created per ${per} (IST), and how many of them were later cancelled.`}
          legend={[
            { label: "Bookings", color: SERIES[0], mark: "line" },
            { label: "Cancelled", color: SERIES[1], mark: "line" },
          ]}
          empty={none ? EMPTY_BOOKINGS : null}
          table={{
            columns: [{ label: a.unit === "day" ? "Day" : "Month" }, { label: "Bookings", format: "count" }, { label: "Cancelled", format: "count" }],
            rows: a.keys.map((_, i) => [keysLong[i], a.trend.bookings[i], a.trend.cancelled[i]]),
          }}
        >
          <LineChart
            keys={a.keys}
            series={[
              { name: "Bookings", values: a.trend.bookings, color: SERIES[0] },
              { name: "Cancelled", values: a.trend.cancelled, color: SERIES[1] },
            ]}
          />
        </ChartFrame>

        {withRevenue && (
          <ChartFrame
            title="Revenue trend"
            description={`Cash received per ${per}, net of processed refunds.`}
            empty={a.cash.paid === 0 && a.cash.refunded === 0 ? "No payments in this period — try a longer range." : null}
            note="Cash basis: payments marked paid, by the day received, minus refunds by the day processed."
            table={{
              columns: [{ label: a.unit === "day" ? "Day" : "Month" }, { label: "Received", format: "rupees" }, { label: "Refunded", format: "rupees" }, { label: "Net", format: "rupees" }],
              rows: a.keys.map((_, i) => [keysLong[i], a.cashLine.paid[i], a.cashLine.refunded[i], a.cashLine.net[i]]),
            }}
          >
            <LineChart keys={a.keys} format="rupees" series={[{ name: "Net revenue", values: a.cashLine.net, color: SERIES[0] }]} />
          </ChartFrame>
        )}

        <ChartFrame
          title="Cancellation rate"
          description={`Share of each ${per}'s bookings that were cancelled · ${pct(a.totals.cancelRate, 1)} over the period.`}
          empty={none ? EMPTY_BOOKINGS : null}
          table={{
            columns: [{ label: a.unit === "day" ? "Day" : "Month" }, { label: "Bookings", format: "count" }, { label: "Cancelled", format: "count" }, { label: "Rate", format: "pct" }],
            rows: a.keys.map((_, i) => [keysLong[i], a.trend.bookings[i], a.trend.cancelled[i], a.trend.cancelRate[i]]),
          }}
        >
          <LineChart keys={a.keys} format="pct" series={[{ name: "Cancelled", values: a.trend.cancelRate, color: SERIES[1] }]} />
        </ChartFrame>

        <ChartFrame
          title="Lead conversion"
          description={`Leads received in the period and how far they got · ${pct(f.conversion, 1)} booked.`}
          empty={f.total === 0 ? "No leads in this period — try a longer range." : null}
          table={{
            columns: [{ label: "Stage" }, { label: "Leads", format: "count" }, { label: "Of all leads", format: "pct" }],
            rows: funnel.map((s) => [s.label, s.value, f.total ? (s.value / f.total) * 100 : 0]),
          }}
        >
          <BarChart items={funnel} max={f.total} />
        </ChartFrame>

        <ChartFrame
          title="Bookings by city"
          description="Active (not cancelled) bookings, top 10 cities."
          empty={a.active === 0 ? EMPTY_BOOKINGS : null}
          table={{ columns: [{ label: "City" }, { label: "Bookings", format: "count" }], rows: a.cities.map((c) => [c.label, c.value]) }}
        >
          <BarChart items={a.cities} />
        </ChartFrame>

        <ChartFrame
          title="Most booked tests"
          description="Top 10 tests and packages by times booked, cancelled bookings excluded."
          empty={a.tests.length === 0 ? EMPTY_BOOKINGS : null}
          table={{
            columns: [{ label: "Test / package" }, { label: "Type" }, { label: "Times booked", format: "count" }],
            rows: a.tests.map((t) => [t.label, t.pkg ? "Package" : "Test", t.value]),
          }}
        >
          <BarChart items={a.tests.map((t) => ({ ...t, sub: t.pkg ? "Package" : undefined }))} />
        </ChartFrame>

        <ChartFrame
          title="Online vs offline"
          description="Active bookings made on the website vs by staff (calls, WhatsApp, walk-ins, referrals)."
          empty={a.active === 0 ? EMPTY_BOOKINGS : null}
          table={{
            columns: [{ label: "Channel" }, { label: "Bookings", format: "count" }, { label: "Share", format: "pct" }],
            rows: [
              ["Online (website)", online, (online / (a.active || 1)) * 100],
              ["Offline", a.active - online, ((a.active - online) / (a.active || 1)) * 100],
            ],
          }}
        >
          <ShareBar
            parts={[
              { label: "Online (website)", value: online },
              { label: "Offline", value: a.active - online },
            ]}
          />
        </ChartFrame>

        <ChartFrame
          title="Call vs website bookings"
          description="Where active bookings came from: the website, a phone call or WhatsApp, or elsewhere."
          empty={a.active === 0 ? EMPTY_BOOKINGS : null}
          table={{
            columns: [{ label: "Channel" }, { label: "Bookings", format: "count" }, { label: "Share", format: "pct" }],
            rows: [
              ["Website", online, (online / (a.active || 1)) * 100],
              ["Phone & WhatsApp", calls, (calls / (a.active || 1)) * 100],
              ["Walk-in, referral & other", otherChannels, (otherChannels / (a.active || 1)) * 100],
            ],
          }}
        >
          <ShareBar
            parts={[
              { label: "Website", value: online },
              { label: "Phone & WhatsApp", value: calls },
              { label: "Walk-in, referral & other", value: otherChannels },
            ]}
          />
        </ChartFrame>

        <ChartFrame
          title="Repeat customers"
          description="Customers who booked in the period, and how many have booked at least twice."
          empty={repeat.customers === 0 ? EMPTY_BOOKINGS : null}
          note={`${num(repeat.repeatInRange)} customers booked two or more times within this period alone.`}
          table={{
            columns: [{ label: "Customers" }, { label: "Count", format: "count" }, { label: "Share", format: "pct" }],
            rows: [
              ["Repeat (2+ bookings to date)", repeat.repeat, repeat.repeatPct ?? 0],
              ["First-time", repeat.customers - repeat.repeat, 100 - (repeat.repeatPct ?? 0)],
            ],
          }}
        >
          <ShareBar
            parts={[
              { label: "Repeat (2+ bookings)", value: repeat.repeat },
              { label: "First-time", value: repeat.customers - repeat.repeat },
            ]}
          />
        </ChartFrame>

        <ChartFrame
          title="Report turnaround"
          description="Hours from the lab receiving the sample to the report being ready, for bookings made in the period."
          empty={tat.count === 0 ? "No reports finished for this period's bookings yet — try a longer range." : null}
          note={
            tat.sample < tat.count
              ? `Median and 90th percentile are from the latest ${num(tat.sample)} of ${num(tat.count)} reports.`
              : `${num(tat.count)} reports.`
          }
          table={{
            columns: [{ label: "Turnaround" }, { label: "Reports", format: "count" }, { label: "Share", format: "pct" }],
            rows: tat.buckets.map((bk) => [bk.label, bk.value, tat.count ? (bk.value / tat.count) * 100 : 0]),
          }}
        >
          <dl className="mb-4 grid grid-cols-3 gap-3">
            {[
              ["Average", tat.avgHours],
              ["Median", tat.p50],
              ["90% within", tat.p90],
            ].map(([label, v]) => (
              <div key={label} className="rounded-xl bg-slate-50 px-3 py-2.5">
                <dt className="text-[11.5px] font-medium text-slate-500">{label}</dt>
                <dd className="mt-0.5 text-[17px] font-semibold text-slate-900">{fmt("hours", v)}</dd>
              </div>
            ))}
          </dl>
          <BarChart items={tat.buckets.map((bk, i) => ({ ...bk, color: ORDINAL[i] }))} />
        </ChartFrame>
      </div>
    </div>
  );
}
