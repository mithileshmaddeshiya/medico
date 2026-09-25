import { redirect } from "next/navigation";
import { Clock, PiggyBank, Receipt, TrendingUp, Undo2, Wallet } from "lucide-react";

import { KpiCard, Notice, PageHeader } from "@/components/crm/ui";
import ChartFrame from "@/components/crm/charts/ChartFrame";
import LineChart from "@/components/crm/charts/LineChart";
import ColumnChart from "@/components/crm/charts/ColumnChart";
import BarChart from "@/components/crm/charts/BarChart";
import ShareBar from "@/components/crm/charts/ShareBar";
import StatTile from "@/components/crm/charts/StatTile";
import RangeControl from "@/components/crm/charts/RangeControl";
import { ORDINAL, SERIES, xLabel } from "@/components/crm/charts/scale";
import { has, requirePerm } from "@/lib/crm/guard";
import { EXPENSE_CATEGORY, PAYMENT_MODES } from "@/lib/crm/constants";
import { num, pct, rupees, rupeesShort } from "@/lib/crm/format";
import { RANGE_PRESETS, analyticsRange, getFinanceAnalytics } from "@/lib/crm/stores/analytics";
import { syncPending } from "@/lib/crm/sync";

import { AnalyticsTabs } from "../shared";

export const metadata = { title: "Financial analytics" };
export const dynamic = "force-dynamic";

/**
 * Money over a period, on two clearly labelled bases (see the header of
 * src/lib/crm/stores/analytics.js):
 *   Cash     payments received minus refunds processed — what hit the bank
 *   Accrual  bookings whose report is in — what was earned, what the lab
 *            costs, and the margin left
 * Estimated profit = accrual margin − expenses. The monthly section always
 * shows the last 12 months, whatever range is picked above it.
 *
 * Needs analytics.view AND revenue.view.
 */
export default async function FinanceAnalyticsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("analytics.view", "/crm/analytics/finance");
  if (!has(user, "revenue.view")) redirect("/crm/denied");
  const { key, r, prev } = analyticsRange(sp);

  await syncPending();
  const a = await getFinanceAnalytics(r, prev);

  const compare = `vs previous ${r.days} days`;
  const per = a.unit === "day" ? "day" : "month";
  const keysLong = a.keys.map((k) => xLabel(k, true));
  const m = a.months;
  const mLong = m.keys.map((k) => xLabel(k, true));
  const noCash = a.cash.paid === 0 && a.cash.refunded === 0;

  const modes = PAYMENT_MODES.map((pm) => ({ label: pm.label, value: a.modes[pm.key]?.amount ?? 0, count: a.modes[pm.key]?.count ?? 0 }));
  const expenses = a.expenseCategories.map((e) => ({
    label: EXPENSE_CATEGORY[e.key]?.label ?? e.key,
    value: e.amount,
    sub: `${num(e.count)} ${e.count === 1 ? "entry" : "entries"}`,
  }));
  const pendingTotal = a.pending.reduce((s, p) => s + p.due, 0);
  const pendingCount = a.pending.reduce((s, p) => s + p.count, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="Financial analytics"
        description={`Cash received, earned revenue, lab costs, margin and expenses · ${r.label}.`}
      />
      <AnalyticsTabs active="finance" sp={sp} user={user} />
      <RangeControl path="/crm/analytics/finance" sp={sp} presets={RANGE_PRESETS} active={key} r={r} />

      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        <StatTile
          label="Cash revenue, net of refunds"
          value={rupeesShort(a.cash.net)}
          current={a.cash.net}
          previous={a.prevCash.net}
          compareLabel={compare}
          sub={`${rupees(a.cash.paid)} received in ${num(a.cash.payments)} payments − ${rupees(a.cash.refunded)} refunded`}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-2">
          <KpiCard
            label="Booked revenue (accrual)"
            value={rupeesShort(a.accrual.revenue)}
            current={a.accrual.revenue}
            previous={a.prevAccrual.revenue}
            compareLabel={compare}
            sub={`${num(a.accrual.bookings)} bookings with report in`}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KpiCard
            label="Margin (accrual)"
            value={rupeesShort(a.accrual.margin)}
            current={a.accrual.margin}
            previous={a.prevAccrual.margin}
            compareLabel={compare}
            sub={`${pct(a.accrual.marginPct, 1)} of booked revenue`}
            icon={<Wallet className="h-4 w-4" />}
            tone="emerald"
          />
          <KpiCard
            label="Expenses"
            value={rupeesShort(a.expenses.amount)}
            current={a.expenses.amount}
            previous={a.prevExpenses.amount}
            upIsGood={false}
            compareLabel={compare}
            sub={`${num(a.expenses.count)} entries`}
            icon={<Receipt className="h-4 w-4" />}
            tone="amber"
          />
          <KpiCard
            label="Estimated profit"
            value={rupeesShort(a.profit)}
            current={a.profit}
            previous={a.prevProfit}
            compareLabel={compare}
            sub="Margin − expenses"
            icon={<PiggyBank className="h-4 w-4" />}
            tone="teal"
          />
          <KpiCard
            label="Refunds processed"
            value={rupeesShort(a.cash.refunded)}
            current={a.cash.refunded}
            previous={a.prevCash.refunded}
            upIsGood={false}
            compareLabel={compare}
            sub={`${num(a.cash.refunds)} refunds · before ${num(a.prevCash.refunds)}`}
            icon={<Undo2 className="h-4 w-4" />}
            tone="rose"
          />
          <KpiCard
            label="Pending payments (now)"
            value={rupeesShort(pendingTotal)}
            sub={`${num(pendingCount)} bookings with money due`}
            icon={<Clock className="h-4 w-4" />}
            tone="violet"
          />
        </div>
      </div>

      <div className="mb-5">
        <Notice tone="slate" title="Cash vs accrual">
          <strong>Cash</strong> is money that actually moved: payments marked paid (by the day received) minus refunds (by the day
          processed). <strong>Accrual</strong> is money earned: bookings not cancelled whose report is ready or later, by booking
          date — their price is booked revenue, the lab&apos;s share is partner cost, the rest is margin.{" "}
          <strong>Estimated profit</strong> is accrual margin minus expenses.
        </Notice>
      </div>

      <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-500">Selected period</h2>
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <ChartFrame
          className="lg:col-span-2"
          title={a.unit === "day" ? "Daily revenue (cash)" : "Revenue by month (cash)"}
          description={
            a.unit === "day"
              ? "Cash received per IST day, net of processed refunds."
              : "Ranges over 92 days are shown by month. Cash received, net of processed refunds."
          }
          empty={noCash ? "No payments in this period — try a longer range." : null}
          table={{
            columns: [{ label: a.unit === "day" ? "Day" : "Month" }, { label: "Received", format: "rupees" }, { label: "Refunded", format: "rupees" }, { label: "Net", format: "rupees" }],
            rows: a.keys.map((_, i) => [keysLong[i], a.cashLine.paid[i], a.cashLine.refunded[i], a.cashLine.net[i]]),
          }}
        >
          <LineChart keys={a.keys} format="rupees" series={[{ name: `Net revenue per ${per}`, values: a.cashLine.net, color: SERIES[0] }]} />
        </ChartFrame>

        <ChartFrame
          title="Payment methods"
          description="Cash received in the period, by how it was paid."
          empty={a.cash.paid === 0 ? "No payments in this period — try a longer range." : null}
          table={{
            columns: [{ label: "Method" }, { label: "Payments", format: "count" }, { label: "Amount", format: "rupees" }, { label: "Share", format: "pct" }],
            rows: modes.map((md) => [md.label, md.count, md.value, a.cash.paid ? (md.value / a.cash.paid) * 100 : 0]),
          }}
        >
          <ShareBar format="rupees" parts={modes} />
        </ChartFrame>

        <ChartFrame
          title="Pending payments by age"
          description="Money still due today on bookings that are not cancelled, by how old the booking is. A snapshot — not tied to the range."
          empty={pendingCount === 0 ? "Nothing is pending — every active booking is paid." : null}
          table={{
            columns: [{ label: "Booking age" }, { label: "Bookings", format: "count" }, { label: "Amount due", format: "rupees" }],
            rows: a.pending.map((p) => [p.label, p.count, p.due]),
          }}
        >
          <BarChart
            format="rupees"
            items={a.pending.map((p, i) => ({ label: p.label, value: p.due, sub: `${num(p.count)} bookings`, color: ORDINAL[i] }))}
          />
        </ChartFrame>

        <ChartFrame
          title="Refunds"
          description="Refunds processed in the period."
          table={{
            columns: [{ label: "Period" }, { label: "Refunds", format: "count" }, { label: "Amount", format: "rupees" }],
            rows: [
              ["This period", a.cash.refunds, a.cash.refunded],
              ["Previous period", a.prevCash.refunds, a.prevCash.refunded],
            ],
          }}
        >
          <dl className="grid grid-cols-2 gap-3">
            {[
              ["Amount refunded", rupees(a.cash.refunded), `before ${rupees(a.prevCash.refunded)}`],
              ["Refunds", num(a.cash.refunds), `before ${num(a.prevCash.refunds)}`],
              ["Share of cash received", pct(a.cash.paid ? (a.cash.refunded / a.cash.paid) * 100 : null, 1), "refunded ÷ received"],
              ["Payments received", num(a.cash.payments), rupees(a.cash.paid)],
            ].map(([label, v, sub]) => (
              <div key={label} className="rounded-xl bg-slate-50 px-3 py-2.5">
                <dt className="text-[11.5px] font-medium text-slate-500">{label}</dt>
                <dd className="mt-0.5 text-[17px] font-semibold text-slate-900">{v}</dd>
                <dd className="text-[11.5px] text-slate-500">{sub}</dd>
              </div>
            ))}
          </dl>
        </ChartFrame>

        <ChartFrame
          title="Expenses by category"
          description="Active expenses in the period, by the day they were spent."
          empty={expenses.length === 0 ? "No expenses recorded in this period." : null}
          table={{
            columns: [{ label: "Category" }, { label: "Entries", format: "count" }, { label: "Amount", format: "rupees" }],
            rows: a.expenseCategories.map((e) => [EXPENSE_CATEGORY[e.key]?.label ?? e.key, e.count, e.amount]),
          }}
        >
          <BarChart format="rupees" items={expenses} />
        </ChartFrame>
      </div>

      <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-500">
        Last 12 months · {xLabel(m.keys[0], true)} – {xLabel(m.keys[m.keys.length - 1], true)}
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartFrame
          className="lg:col-span-2"
          title="Monthly revenue (cash)"
          description="Cash received per month, net of processed refunds."
          empty={m.cash.every((v) => v === 0) ? "No payments in the last 12 months." : null}
          table={{ columns: [{ label: "Month" }, { label: "Net cash", format: "rupees" }], rows: m.keys.map((_, i) => [mLong[i], m.cash[i]]) }}
        >
          <ColumnChart keys={m.keys} values={m.cash} name="Net cash revenue" format="rupees" />
        </ChartFrame>

        <ChartFrame
          title="Partner cost vs margin"
          description="Accrual, by booking month: what the labs cost and the margin left, on one ₹ axis."
          empty={m.revenue.every((v) => v === 0) ? "No bookings with a finished report in the last 12 months." : null}
          legend={[
            { label: "Partner cost", color: SERIES[0], mark: "line" },
            { label: "Margin", color: SERIES[1], mark: "line" },
          ]}
          table={{
            columns: [{ label: "Month" }, { label: "Booked revenue", format: "rupees" }, { label: "Partner cost", format: "rupees" }, { label: "Margin", format: "rupees" }],
            rows: m.keys.map((_, i) => [mLong[i], m.revenue[i], m.cost[i], m.margin[i]]),
          }}
        >
          <LineChart
            keys={m.keys}
            format="rupees"
            series={[
              { name: "Partner cost", values: m.cost, color: SERIES[0] },
              { name: "Margin", values: m.margin, color: SERIES[1] },
            ]}
          />
        </ChartFrame>

        <ChartFrame
          title="Estimated profit by month"
          description="Accrual margin minus expenses. Months below zero hang under the line in red."
          empty={m.revenue.every((v) => v === 0) && m.expenses.every((v) => v === 0) ? "No earned revenue or expenses in the last 12 months." : null}
          table={{
            columns: [{ label: "Month" }, { label: "Margin", format: "rupees" }, { label: "Expenses", format: "rupees" }, { label: "Est. profit", format: "rupees" }],
            rows: m.keys.map((_, i) => [mLong[i], m.margin[i], m.expenses[i], m.profit[i]]),
          }}
        >
          <ColumnChart keys={m.keys} values={m.profit} name="Estimated profit" format="rupees" />
        </ChartFrame>
      </div>
    </div>
  );
}
