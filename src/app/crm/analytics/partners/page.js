import Link from "next/link";
import { AlertTriangle,CheckCircle2, Clock, Handshake, IndianRupee, Timer } from "lucide-react";

import { Badge, DataTable, EmptyState, KpiCard, PageHeader, withParams } from "@/components/crm/ui";
import FilterBar from "@/components/crm/FilterBar";
import ChartFrame from "@/components/crm/charts/ChartFrame";
import BarChart from "@/components/crm/charts/BarChart";
import StatTile from "@/components/crm/charts/StatTile";
import RangeControl from "@/components/crm/charts/RangeControl";
import { has, requirePerm } from "@/lib/crm/guard";
import { partnerCode } from "@/lib/crm/constants";
import { hours, num, pct, rupees, rupeesShort } from "@/lib/crm/format";
import { PARTNER_SORTS, RANGE_PRESETS, analyticsRange, getPartnerAnalytics } from "@/lib/crm/stores/analytics";
import { listPartnerOptions } from "@/lib/crm/stores/lookups";

import { AnalyticsTabs } from "../shared";

export const metadata = { title: "Partner analytics" };
export const dynamic = "force-dynamic";

const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

/**
 * How each lab partner performs over a period: orders sent, how many they
 * accept and how fast, how quickly reports come back, how many are late,
 * and — for roles with revenue.view — what the lab earned us.
 *
 * Aggregated in SQL per partner (getPartnerAnalytics); sorting is a URL
 * param, so a sorted view is shareable. Partners themselves never reach this
 * page (analytics.view is forbidden to the partner role).
 */
export default async function PartnerAnalyticsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("analytics.view", "/crm/analytics/partners");
  const money = has(user, "revenue.view");
  const { key, r, prev } = analyticsRange(sp);

  let sort = one(sp.sort) || "orders";
  if (!PARTNER_SORTS[sort] || (PARTNER_SORTS[sort].money && !money)) sort = "orders";
  const partnerId = one(sp.partner) || null;

  const [rows, prevRows, partners] = await Promise.all([
    getPartnerAnalytics(r, { partnerId, sort }),
    getPartnerAnalytics(prev, { partnerId }),
    listPartnerOptions(),
  ]);

  const sum = (list, f) => list.reduce((a, p) => a + (p[f] ?? 0), 0);
  const totals = (list) => {
    const accepted = sum(list, "accepted");
    const rejected = sum(list, "rejected");
    const revenue = sum(list, "revenue");
    const cost = sum(list, "cost");
    // Averages weighted by volume, not a mean of per-lab means.
    const wavg = (f, w) => {
      const withV = list.filter((p) => p[f] !== null);
      const weight = withV.reduce((a, p) => a + (p[w] || 1), 0);
      return weight ? withV.reduce((a, p) => a + p[f] * (p[w] || 1), 0) / weight : null;
    };
    return {
      assigned: sum(list, "assigned"),
      accepted,
      rejected,
      completed: sum(list, "completed"),
      overdue: sum(list, "overdue"),
      acceptRate: accepted + rejected ? (accepted / (accepted + rejected)) * 100 : null,
      acceptHours: wavg("acceptHours", "accepted"),
      tatHours: wavg("tatHours", "completed"),
      revenue,
      cost,
      margin: revenue - cost,
    };
  };
  const t = totals(rows);
  const tp = totals(prevRows);
  const compare = `vs previous ${r.days} days`;
  const none = rows.length === 0;

  const byOrders = [...rows].sort((x, y) => y.assigned - x.assigned).slice(0, 10);
  const byTat = rows.filter((p) => p.tatHours !== null).sort((x, y) => x.tatHours - y.tatHours).slice(0, 10);
  const canOpen = has(user, "partners.view");
  const detail = (p) => (canOpen ? `/crm/partners/${p.id}` : undefined);

  const columns = [
    { key: "name", label: "Partner" },
    { key: "assigned", label: "Assigned", align: "right", sortKey: "orders" },
    { key: "accept", label: "Accepted", align: "right", sortKey: "accept" },
    { key: "rejected", label: "Rejected", align: "right" },
    { key: "completed", label: "Reports done", align: "right" },
    { key: "response", label: "Avg response", align: "right", sortKey: "response" },
    { key: "tat", label: "Avg TAT", align: "right", sortKey: "tat" },
    { key: "overdue", label: "Late reports", align: "right", sortKey: "overdue" },
    ...(money
      ? [
          { key: "revenue", label: "Revenue", align: "right", sortKey: "revenue" },
          { key: "cost", label: "Partner cost", align: "right" },
          { key: "margin", label: "Margin", align: "right", sortKey: "margin" },
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="Partner analytics"
        description={`Orders, acceptance, turnaround and late reports per lab partner · ${r.label}.`}
      />
      <AnalyticsTabs active="partners" sp={sp} user={user} />
      <RangeControl path="/crm/analytics/partners" sp={sp} presets={RANGE_PRESETS} active={key} r={r} keep={["partner", "sort"]} />
      <FilterBar filters={[{ name: "partner", label: "Partner", options: partners.map((p) => ({ value: String(p.id), label: p.name })) }]} />

      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        <StatTile
          label="Orders assigned to labs"
          value={num(t.assigned)}
          current={t.assigned}
          previous={tp.assigned}
          compareLabel={compare}
          sub={`${num(t.completed)} reports done · ${num(t.rejected)} rejected`}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-2">
          <KpiCard
            label="Acceptance rate"
            value={pct(t.acceptRate, 0)}
            current={t.acceptRate ?? undefined}
            previous={tp.acceptRate ?? 0}
            compareLabel={compare}
            sub={`${num(t.accepted)} accepted · ${num(t.rejected)} rejected`}
            icon={<CheckCircle2 className="h-4 w-4" />}
            tone="emerald"
          />
          <KpiCard
            label="Avg time to accept"
            value={hours(t.acceptHours)}
            current={t.acceptHours ?? undefined}
            previous={tp.acceptHours ?? 0}
            upIsGood={false}
            compareLabel={compare}
            icon={<Timer className="h-4 w-4" />}
            tone="violet"
          />
          <KpiCard
            label="Avg report turnaround"
            value={hours(t.tatHours)}
            current={t.tatHours ?? undefined}
            previous={tp.tatHours ?? 0}
            upIsGood={false}
            compareLabel={compare}
            sub="Sample received → report ready"
            icon={<Clock className="h-4 w-4" />}
            tone="amber"
          />
          <KpiCard
            label="Late / overdue reports"
            value={num(t.overdue)}
            current={t.overdue}
            previous={tp.overdue}
            upIsGood={false}
            compareLabel={compare}
            icon={<AlertTriangle className="h-4 w-4" />}
            tone="rose"
          />
          {money && (
            <KpiCard
              label="Margin on lab orders"
              value={rupeesShort(t.margin)}
              current={t.margin}
              previous={tp.margin}
              compareLabel={compare}
              sub={`${rupeesShort(t.revenue)} revenue − ${rupeesShort(t.cost)} lab cost`}
              icon={<IndianRupee className="h-4 w-4" />}
            />
          )}
        </div>
      </div>

      {none ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white">
          <EmptyState
            icon={<Handshake className="h-5 w-5" />}
            title="No lab orders in this period"
            hint="No booking made in this period was sent to a lab partner. Try a longer range or clear the partner filter."
          />
        </div>
      ) : (
        <>
          <div className="mb-5 grid gap-4 lg:grid-cols-2">
            <ChartFrame
              title="Orders by partner"
              description="Orders assigned in the period, top 10 labs."
              table={{ columns: [{ label: "Partner" }, { label: "Orders", format: "count" }], rows: byOrders.map((p) => [p.name, p.assigned]) }}
            >
              <BarChart items={byOrders.map((p) => ({ label: p.name, value: p.assigned, href: detail(p) }))} />
            </ChartFrame>
            <ChartFrame
              title="Report turnaround by partner"
              description="Average hours from sample received to report ready, fastest first."
              empty={byTat.length === 0 ? "No reports finished for this period's orders yet — try a longer range." : null}
              table={{ columns: [{ label: "Partner" }, { label: "Avg TAT", format: "hours" }], rows: byTat.map((p) => [p.name, p.tatHours]) }}
            >
              <BarChart
                format="hours"
                note="Lower is better — shorter bars are faster labs."
                items={byTat.map((p) => ({ label: p.name, value: p.tatHours, href: detail(p) }))}
              />
            </ChartFrame>
          </div>

          <DataTable
            id="partner-analytics"
            columns={columns}
            rows={rows}
            sort={{ current: sort, hrefFor: (k) => withParams("/crm/analytics/partners", sp, { sort: k }) }}
            rowHref={canOpen ? detail : undefined}
            cells={(p) => ({
              name: (
                <span className="flex flex-col">
                  <span>{p.name}</span>
                  <span className="text-[11.5px] font-normal text-slate-500">
                    {partnerCode(p.id)}
                    {p.city ? ` · ${p.city}` : ""}
                  </span>
                </span>
              ),
              assigned: num(p.assigned),
              accept: (
                <span>
                  {num(p.accepted)} <span className="text-slate-500">({pct(p.acceptRate, 0)})</span>
                </span>
              ),
              rejected: num(p.rejected),
              completed: num(p.completed),
              response: hours(p.acceptHours),
              tat: hours(p.tatHours),
              overdue: p.overdue ? <Badge tone="rose">{num(p.overdue)}</Badge> : "0",
              revenue: rupees(p.revenue),
              cost: rupees(p.cost),
              margin: (
                <span>
                  {rupees(p.margin)} <span className="text-slate-500">({pct(p.marginPct, 0)})</span>
                </span>
              ),
            })}
            card={(p) => (
              <div>
                <div className="flex items-start justify-between gap-2">
                  {canOpen ? (
                    <Link href={detail(p)} className="font-semibold text-slate-900 hover:text-blue-700">
                      {p.name}
                    </Link>
                  ) : (
                    <span className="font-semibold text-slate-900">{p.name}</span>
                  )}
                  {p.overdue > 0 && <Badge tone="rose">{num(p.overdue)} late</Badge>}
                </div>
                <dl className="mt-2 grid grid-cols-3 gap-2 text-[12.5px]">
                  {[
                    ["Assigned", num(p.assigned)],
                    ["Accepted", pct(p.acceptRate, 0)],
                    ["Rejected", num(p.rejected)],
                    ["Response", hours(p.acceptHours)],
                    ["TAT", hours(p.tatHours)],
                    ["Reports", num(p.completed)],
                    ...(money
                      ? [
                          ["Revenue", rupeesShort(p.revenue)],
                          ["Lab cost", rupeesShort(p.cost)],
                          ["Margin", `${rupeesShort(p.margin)} · ${pct(p.marginPct, 0)}`],
                        ]
                      : []),
                  ].map(([label, v]) => (
                    <div key={label}>
                      <dt className="text-slate-500">{label}</dt>
                      <dd className="font-semibold text-slate-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          />
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            Assigned and rejected count every assignment made in the period (from the activity log), including orders later moved
            to another lab. The other figures cover this period&apos;s bookings that are with the lab now; revenue and cost count
            only bookings whose report is in (accrual basis).
          </p>
        </>
      )}
    </div>
  );
}
