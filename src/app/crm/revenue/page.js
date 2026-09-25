import { Download, HandCoins, IndianRupee, PiggyBank, TrendingUp } from "lucide-react";

import { Card, KpiCard, Notice, PageHeader, btn, cx, withParams } from "@/components/crm/ui";
import FilterBar from "@/components/crm/FilterBar";
import BreakdownTable from "@/components/crm/finance/BreakdownTable";
import ShareBar from "@/components/crm/finance/ShareBar";
import TrendChart from "@/components/crm/finance/TrendChart";
import { MODE_COLOR, SERIES } from "@/components/crm/finance/palette";
import { has, requirePerm } from "@/lib/crm/guard";
import { PAYMENT_MODES } from "@/lib/crm/constants";
import { range } from "@/lib/crm/dates";
import { dateRangeOf } from "@/lib/crm/filters";
import { num, pct, rupees, rupeesShort } from "@/lib/crm/format";
import { revenueReport } from "@/lib/crm/stores/finance";

export const metadata = { title: "Revenue & P&L" };
export const dynamic = "force-dynamic";

const RANGES = [
  { value: "", label: "This month" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last 12 months" },
  { value: "custom", label: "Custom…" },
];

const shortDay = (ymd) =>
  new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-IN", { timeZone: "UTC", day: "numeric", month: "short" });
const longDay = (ymd) =>
  new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-IN", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric" });
const monthLabel = (ym, long = false) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-IN", { timeZone: "UTC", month: long ? "long" : "short", year: long ? "numeric" : "2-digit" });

/**
 * The owner's money view for a period, in two clearly separated halves:
 *
 *   CASH     what actually moved — collected, refunded, net — by received
 *            date. This is the bank balance's story.
 *   ACCRUAL  what was earned — bookings whose report became ready in the
 *            period, at their bill and lab cost — minus expenses, giving an
 *            estimated net profit. This is the business's story.
 *
 * They answer different questions and rarely match; every figure says which
 * one it is. Each chart has its numbers in a table beside or under it.
 */
export default async function RevenuePage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("revenue.view", "/crm/revenue");
  const r = dateRangeOf(sp, "month") ?? range("month");
  const rep = await revenueReport(r);
  const t = rep.totals;
  const b = rep.before;
  const canExport = has(user, "export.data");
  const cmp = `vs previous ${rep.range.days} days`;

  // Daily columns up to ~3 months; beyond that, one column per month.
  const monthly = r.days > 92;
  const periods = monthly
    ? Object.values(
        rep.daily.reduce((acc, d) => {
          const key = d.day.slice(0, 7);
          const p = (acc[key] ??= { key, collected: 0, refunds: 0, net: 0, bookedRevenue: 0, margin: 0, newBookings: 0, expenses: 0 });
          for (const f of ["collected", "refunds", "net", "bookedRevenue", "margin", "newBookings", "expenses"]) p[f] += d[f];
          return acc;
        }, {})
      )
    : rep.daily.map((d) => ({ ...d, key: d.day }));

  const points = periods.map((p) => ({
    key: p.key,
    tick: monthly ? monthLabel(p.key) : shortDay(p.key),
    title: monthly ? monthLabel(p.key, true) : longDay(p.key),
    value: p.net,
    rows: [
      ["Net cash", rupees(p.net)],
      ["Collected", rupees(p.collected)],
      ["Refunds", rupees(p.refunds)],
      ["Booked revenue", rupees(p.bookedRevenue)],
      ["New bookings", num(p.newBookings)],
    ],
  }));

  const maxCity = Math.max(1, ...rep.city.map((c) => c.revenue));
  const maxPartner = Math.max(1, ...rep.partner.map((c) => c.revenue));
  const channelTotal = rep.channel.reduce((a, c) => a + c.revenue, 0) || 1;
  const modeTotal = rep.mode.reduce((a, m) => a + m.amount, 0);

  return (
    <>
      <PageHeader
        title="Revenue & P&L"
        description="Cash that moved, and profit that was earned, for the period you pick. Each figure says which it is."
        actions={
          canExport ? (
            <a href={withParams("/api/crm/export/revenue", sp, { format: "xls" })} className={btn("secondary")}>
              <Download className="h-4 w-4" aria-hidden /> Export daily
            </a>
          ) : null
        }
      />

      <FilterBar filters={[{ name: "range", label: "This month", type: "range", options: RANGES }]} />

      <p className="-mt-1 mb-4 text-[12.5px] text-slate-500">
        {rep.range.label} · {rep.range.fromDay} → {rep.range.toDay} (IST) · compared with {rep.previous?.fromDay} → {rep.previous?.toDay}
      </p>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Net cash in · cash" value={rupeesShort(t.netCash)} current={t.netCash} previous={b?.netCash} compareLabel={cmp} sub="Collected − refunds processed" icon={<IndianRupee className="h-4 w-4" />} />
        <KpiCard label="Booked revenue · accrual" value={rupeesShort(t.bookedRevenue)} current={t.bookedRevenue} previous={b?.bookedRevenue} compareLabel={cmp} sub={`${num(t.earnedBookings)} bookings reached report ready`} icon={<TrendingUp className="h-4 w-4" />} tone="sky" />
        <KpiCard label="Gross margin · accrual" value={rupeesShort(t.grossMargin)} current={t.grossMargin} previous={b?.grossMargin} compareLabel={cmp} sub={`${pct(t.marginPct, 1)} of booked revenue`} icon={<HandCoins className="h-4 w-4" />} tone="emerald" />
        <KpiCard label="Est. net profit · accrual" value={rupeesShort(t.netProfit)} current={t.netProfit} previous={b?.netProfit} compareLabel={cmp} sub="Gross margin − expenses" icon={<PiggyBank className="h-4 w-4" />} tone={t.netProfit < 0 ? "rose" : "emerald"} />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card title="Cash view" description="Money that actually moved in the period, by the date it moved.">
          <PL
            rows={[
              ["Collected (payments received)", t.collected],
              ["Refunds processed", -t.refunds],
              ["Net cash in", t.netCash, "total"],
              ["Paid to labs (settlements)", -t.settlementsPaid, null, `${num(t.settlementsCount)} settlement${t.settlementsCount === 1 ? "" : "s"}`],
              ["Expenses", -t.expenses],
              ["Net cash after costs", t.netCash - t.settlementsPaid - t.expenses, "total"],
            ]}
          />
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            Not included: {rupees(rep.pendingAmount)} still due from customers across all open bookings (pending is not revenue).
          </p>
        </Card>
        <Card title="Accrual view (estimate)" description="Bookings whose report became ready in the period, at their bill and lab cost.">
          <PL
            rows={[
              ["Booked revenue", t.bookedRevenue, null, `${num(t.earnedBookings)} bookings`],
              ["Partner (lab) cost", -t.partnerCost],
              ["Gross margin", t.grossMargin, "total", pct(t.marginPct, 1)],
              ["Expenses", -t.expenses],
              ["Estimated net profit", t.netProfit, "total"],
            ]}
          />
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            An estimate: it uses each booking&apos;s lab cost as recorded, and does not include tax. Settlements are cash, so they are on the left, not here.
          </p>
        </Card>
      </div>

      <div className="mb-4">
        <Card title={`Net cash in, ${monthly ? "by month" : "by day"}`} description="Collected minus refunds processed, IST. Hover or tab through a column for its figures.">
          <TrendChart points={points} label={`Net cash in by ${monthly ? "month" : "day"}, ${rep.range.label}`} />
          <details className="mt-3 group">
            <summary className="cursor-pointer text-[12.5px] font-semibold text-blue-700">Show as table</summary>
            <div className="mt-2 max-h-80 overflow-auto">
              <table className="w-full min-w-[34rem] text-[12.5px] tabular-nums">
                <caption className="sr-only">Net cash in by {monthly ? "month" : "day"}</caption>
                <thead className="sticky top-0 bg-white text-slate-500">
                  <tr>
                    {[monthly ? "Month" : "Day", "Collected", "Refunds", "Net cash", "Booked revenue", "Margin", "Expenses", "New bookings"].map((h, i) => (
                      <th key={h} scope="col" className={cx("pb-1.5 font-semibold", i ? "text-right" : "text-left")}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((p) => (
                    <tr key={p.key} className="border-t border-slate-100 text-slate-700">
                      <th scope="row" className="py-1 text-left font-medium">
                        {monthly ? monthLabel(p.key, true) : shortDay(p.key)}
                      </th>
                      <td className="text-right">{rupees(p.collected)}</td>
                      <td className="text-right">{rupees(p.refunds)}</td>
                      <td className="text-right font-semibold text-slate-900">{rupees(p.net)}</td>
                      <td className="text-right">{rupees(p.bookedRevenue)}</td>
                      <td className="text-right">{rupees(p.margin)}</td>
                      <td className="text-right">{rupees(p.expenses)}</td>
                      <td className="text-right">{num(p.newBookings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </Card>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card title="By payment mode · cash" description={`Payments received in the period · ${rupees(modeTotal)}`}>
          <ShareBar
            label={`Cash collected by payment mode, ${rep.range.label}`}
            segments={PAYMENT_MODES.map((m) => {
              const row = rep.mode.find((x) => x.mode === m.key);
              return { key: m.key, label: m.label, value: row?.amount ?? 0, display: rupees(row?.amount ?? 0), sub: row ? `${row.count} txn` : null, color: MODE_COLOR[m.key] };
            })}
            empty="No payments received in this period."
          />
        </Card>
        <Card title="Online vs offline · accrual" description="Website bookings against phone, WhatsApp, walk-in and the rest.">
          <BreakdownTable
            caption="Booked revenue by channel"
            labelHeader="Channel"
            columns={[{ label: "Bookings" }, { label: "Revenue" }, { label: "Share" }, { label: "Margin" }]}
            rows={rep.channel.map((c, i) => ({
              key: c.label,
              label: c.label === "online" ? "Online (website)" : "Offline",
              bar: c.revenue / channelTotal,
              color: SERIES[i],
              cells: [num(c.count), rupees(c.revenue), pct((c.revenue / channelTotal) * 100, 0), `${rupees(c.margin)} · ${pct(c.marginPct, 0)}`],
            }))}
          />
        </Card>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card title="By city · accrual" description="Top 12 cities by booked revenue in the period.">
          <BreakdownTable
            caption="Booked revenue and margin by city"
            labelHeader="City"
            columns={[{ label: "Bookings" }, { label: "Revenue" }, { label: "Margin" }]}
            rows={rep.city.map((c) => ({
              key: c.label,
              label: c.label,
              bar: c.revenue / maxCity,
              cells: [num(c.count), rupees(c.revenue), `${rupees(c.margin)} · ${pct(c.marginPct, 0)}`],
            }))}
            empty="No bookings reached report ready in this period."
          />
        </Card>
        <Card title="By lab partner · accrual" description="Revenue, lab cost and what MedicoBharat keeps, per lab.">
          <BreakdownTable
            caption="Booked revenue, lab cost and margin by lab partner"
            labelHeader="Lab"
            columns={[{ label: "Bookings" }, { label: "Revenue" }, { label: "Lab cost" }, { label: "Margin" }]}
            rows={rep.partner.map((c) => ({
              key: String(c.id ?? "none"),
              label: c.label,
              bar: c.revenue / maxPartner,
              cells: [num(c.count), rupees(c.revenue), rupees(c.cost), `${rupees(c.margin)} · ${pct(c.marginPct, 0)}`],
            }))}
            empty="No bookings reached report ready in this period."
          />
        </Card>
      </div>

      {t.bookedRevenue > 0 && t.partnerCost === 0 && (
        <Notice tone="amber" title="Lab costs look missing">
          None of these bookings has a partner cost recorded, so the margin shows the whole bill. Set lab prices on the tests or partners to get a real margin.
        </Notice>
      )}
    </>
  );
}

/** A P&L statement: label, amount (negative = money out), totals ruled off. */
function PL({ rows }) {
  return (
    <dl className="text-[13.5px]">
      {rows.map(([label, value, kind, note]) => (
        <div
          key={label}
          className={cx(
            "flex items-baseline justify-between gap-3 py-1.5",
            kind === "total" ? "mt-1 border-t border-slate-200 pt-2 font-semibold text-slate-900" : "text-slate-600"
          )}
        >
          <dt>
            {label}
            {note && <span className="ml-1.5 text-[12px] font-normal text-slate-400">{note}</span>}
          </dt>
          <dd className={cx("tabular-nums", value < 0 && kind !== "total" ? "text-slate-600" : "", kind === "total" && value < 0 ? "text-rose-700" : "")}>
            {value < 0 ? `− ${rupees(Math.abs(value))}` : rupees(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
