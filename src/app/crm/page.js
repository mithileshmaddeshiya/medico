import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  BadgeIndianRupee,
  ClipboardList,
  FileClock,
  FlaskConical,
  Gauge,
  MapPinned,
  Plus,
  TestTube2,
  Truck,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

import { ActivityFeed, Meter } from "@/components/crm/dashboard/parts";
import AlertsPanel from "@/components/crm/dashboard/AlertsPanel";
import WorkflowBoard from "@/components/crm/dashboard/WorkflowBoard";
import { Badge, Card, KpiCard, PageHeader, btn } from "@/components/crm/ui";
import { listActivity } from "@/lib/crm/activity";
import { num, rupeesShort } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import { navFor } from "@/lib/crm/nav";
import { computeAlerts, raiseSlaNotifications } from "@/lib/crm/sla";
import { dashboardData, todayHeader } from "@/lib/crm/stores/dashboard";
import { syncPending } from "@/lib/crm/sync";

import PartnerDashboard from "./_partner/PartnerDashboard";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  { href: "/crm/bookings/new", label: "New booking", icon: ClipboardList, perm: "bookings.manage" },
  { href: "/crm/customers/new", label: "New customer", icon: Users, perm: "customers.manage" },
  { href: "/crm/leads/new", label: "Add lead", icon: UserPlus, perm: "leads.manage" },
  { href: "/crm/partners/new", label: "Add partner", icon: FlaskConical, perm: "partners.manage" },
  { href: "/crm/tests/new", label: "Add test", icon: TestTube2, perm: "catalog.manage" },
  { href: "/crm/payments/new", label: "Record payment", icon: Wallet, perm: "payments.manage" },
];

/**
 * The operations command center. One screen answers "what needs doing now":
 * today's numbers, where every open booking sits in the pipeline and what
 * has waited too long, what just happened, and who is doing today's
 * collections.
 *
 * Who lands here:
 *   partner    → their own portal dashboard
 *   collector  → /crm/collections (their day)
 *   no dashboard.view → the first screen they may open
 *
 * Every figure is an aggregate query (src/lib/crm/stores/dashboard.js), run
 * in parallel; the page never loads a table into memory.
 */
export default async function DashboardPage() {
  const user = await requirePerm(null, "/crm");
  if (user.isPartner) return <PartnerDashboard user={user} />;
  if (user.role === "collector") redirect("/crm/collections");
  if (!has(user, "dashboard.view")) {
    const first = navFor(user)
      .flatMap((s) => s.items)
      .find((i) => i.href !== "/crm" && i.perm);
    redirect(first?.href ?? "/crm/denied");
  }

  const money = has(user, "revenue.view") || has(user, "payments.view");
  const alertTypes = [
    has(user, "reports.view") || has(user, "bookings.view") ? "report_delayed" : null,
    has(user, "bookings.view") ? "sample_delay" : null,
    has(user, "bookings.view") ? "partner_pending" : null,
    money ? "payment_pending" : null,
    has(user, "leads.view") ? "followup_overdue" : null,
  ].filter(Boolean);

  // Website orders that a hook missed become bookings before we count them.
  await syncPending();
  // Serverless: a fire-and-forget promise may be frozen mid-write, so the
  // notification pass is awaited — and can never take the page down.
  try {
    await raiseSlaNotifications();
  } catch (err) {
    console.error("[crm/dashboard] SLA notification pass failed", err);
  }

  const head = todayHeader();
  const [data, alerts, activity] = await Promise.all([
    dashboardData({ money }),
    computeAlerts({ limitPerType: 3, types: alertTypes }),
    listActivity(user, { limit: 12 }),
  ]);
  const k = data.kpis;
  const alertCount = (type) => alerts.find((a) => a.type === type)?.count ?? 0;
  const link = (perm, href) => ([].concat(perm).some((p) => has(user, p)) ? href : undefined);
  const firstName = String(user.name || user.email || "").split(/[\s@]/)[0];
  const actions = QUICK_ACTIONS.filter((a) => has(user, a.perm));
  const icon = (Icon) => <Icon className="h-4 w-4" aria-hidden />;

  return (
    <>
      <PageHeader
        eyebrow={head.dateLabel}
        title={`${head.greeting}${firstName ? `, ${firstName}` : ""}`}
        description={
          data.pipeline.openTotal
            ? `${num(data.pipeline.openTotal)} open bookings in the pipeline${alerts.some((a) => a.count) ? ` · ${num(alerts.reduce((s, a) => s + a.count, 0))} need attention` : ""}.`
            : "No open bookings right now."
        }
        actions={
          has(user, "executive.view") ? (
            <Link href="/crm/executive" className={btn("secondary")}>
              <Gauge className="h-4 w-4" aria-hidden /> Owner overview
            </Link>
          ) : null
        }
      />

      {actions.length > 0 && (
        <nav aria-label="Quick actions" className="-mx-4 mb-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ul className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap">
            {actions.map((a, i) => (
              <li key={a.href}>
                <Link href={a.href} className={btn(i === 0 ? "primary" : "secondary", "md")}>
                  {i === 0 ? <Plus className="h-4 w-4" aria-hidden /> : icon(a.icon)} {a.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Today in numbers */}
      <section aria-label="Today in numbers" className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Today's bookings"
          value={num(k.bookings.today)}
          current={k.bookings.today}
          previous={k.bookings.yesterday}
          compareLabel="vs yesterday"
          spark={k.bookings.spark}
          icon={icon(ClipboardList)}
          href={link("bookings.view", "/crm/bookings?range=today")}
        />
        <KpiCard
          label="Today's collections"
          value={`${num(k.collections.collected)} / ${num(k.collections.scheduled)}`}
          sub="collected / scheduled"
          current={k.collections.collected}
          previous={k.collections.collectedYesterday}
          compareLabel="vs yesterday"
          spark={k.collections.spark}
          icon={icon(Truck)}
          tone="sky"
          href={link("collections.view", "/crm/collections")}
        />
        <KpiCard
          label="Pending samples"
          value={num(k.samples.now)}
          sub={alertCount("sample_delay") ? `${num(alertCount("sample_delay"))} past SLA` : "collected, not at lab"}
          current={k.samples.now}
          previous={k.samples.yesterday}
          upIsGood={false}
          compareLabel="vs this time yesterday"
          icon={icon(TestTube2)}
          tone="indigo"
          href={link("bookings.view", "/crm/samples")}
        />
        <KpiCard
          label="Reports pending"
          value={num(k.reports.now)}
          sub={alertCount("report_delayed") ? `${num(alertCount("report_delayed"))} delayed` : "in lab, no report yet"}
          current={k.reports.now}
          previous={k.reports.yesterday}
          upIsGood={false}
          compareLabel="vs this time yesterday"
          icon={icon(FileClock)}
          tone="amber"
          href={link("reports.view", "/crm/reports")}
        />
        {k.revenue && (
          <KpiCard
            label="Today's revenue"
            value={rupeesShort(k.revenue.today)}
            sub="received, net of refunds"
            current={k.revenue.today}
            previous={k.revenue.yesterday}
            compareLabel="vs yesterday"
            spark={k.revenue.spark}
            icon={icon(BadgeIndianRupee)}
            tone="emerald"
            href={link("payments.view", "/crm/payments?range=today")}
          />
        )}
        <KpiCard
          label="Pending payments"
          value={money ? rupeesShort(k.due.amount) : num(k.due.count)}
          sub={money ? `due on ${num(k.due.count)} open ${k.due.count === 1 ? "booking" : "bookings"}` : "open bookings with money due"}
          icon={icon(Wallet)}
          tone="rose"
          href={link("bookings.view", "/crm/bookings?payment=pending")}
        />
        <KpiCard
          label="Active lab partners"
          value={`${num(k.partners.active)} / ${num(k.partners.total)}`}
          sub="with an order in 30 days"
          current={k.partners.active}
          previous={k.partners.previous}
          compareLabel="vs previous 30 days"
          icon={icon(FlaskConical)}
          tone="violet"
          href={link("partners.view", "/crm/partners")}
        />
        <KpiCard
          label="New leads today"
          value={num(k.leads.today)}
          sub={`${num(k.leads.converted)} converted today`}
          current={k.leads.today}
          previous={k.leads.yesterday}
          compareLabel="vs yesterday"
          spark={k.leads.spark}
          icon={icon(UserPlus)}
          tone="teal"
          href={link("leads.view", "/crm/leads?range=today")}
        />
      </section>

      {/* The pipeline */}
      <Card
        className="mb-5"
        title="Live workflow"
        description="Every open booking by stage — longest waiting first."
        actions={
          has(user, "bookings.view") ? (
            <Link href="/crm/bookings" className="text-[12.5px] font-semibold text-blue-700 hover:underline">
              All bookings →
            </Link>
          ) : null
        }
      >
        <WorkflowBoard pipeline={data.pipeline} items={data.items} showMoney={money} />
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <Card title="SLA alerts" description="What has waited longer than your SLA settings allow.">
            <AlertsPanel alerts={alerts} />
          </Card>

          <Card
            title="Recent activity"
            actions={
              <Link href="/crm/activity" className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-blue-700 hover:underline">
                <Activity className="h-3.5 w-3.5" aria-hidden /> Full log
              </Link>
            }
          >
            <ActivityFeed rows={activity.rows} today={data.today} />
          </Card>
        </div>

        <div className="space-y-5">
          {has(user, "collections.view") && (
            <Card
              title="Today's collections"
              description="By collector"
              actions={
                <Link href="/crm/collections" className="text-[12.5px] font-semibold text-blue-700 hover:underline">
                  Open →
                </Link>
              }
            >
              {data.collectors.length ? (
                <ul className="space-y-3">
                  {data.collectors.map((c) => (
                    <li key={c.collectorId ?? "none"}>
                      <Link
                        href={`/crm/collections?collector=${c.collectorId ?? "none"}`}
                        className="block rounded-md hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600"
                      >
                        <span className="flex items-baseline justify-between gap-2 text-[13px]">
                          <span className={c.collectorId ? "truncate font-medium text-slate-800" : "truncate font-semibold text-orange-700"}>
                            {c.collectorId ? c.name || "Unnamed collector" : "Not assigned yet"}
                          </span>
                          <span className="shrink-0 text-slate-600 tabular-nums">
                            {c.done}/{c.total} done
                          </span>
                        </span>
                        {c.collectorId ? (
                          <>
                            <span className="mt-1 block">
                              <Meter value={c.done} max={c.total} label={`${c.name}: ${c.done} of ${c.total} collected`} tone="emerald" />
                            </span>
                            <span className="mt-1 block text-[11.5px] text-slate-500">
                              {c.pending} pending{c.failed ? ` · ${c.failed} failed` : ""}
                            </span>
                          </>
                        ) : (
                          <span className="mt-0.5 block text-[11.5px] text-slate-500">Assign a collector to these bookings</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-slate-500">No collections scheduled for today.</p>
              )}
            </Card>
          )}

          {(has(user, "partners.view") || has(user, "bookings.view")) && (
            <Card title="Lab partners" description="Open orders and what is waiting on them">
              {data.partnerTop.length ? (
                <ul className="divide-y divide-slate-100">
                  {data.partnerTop.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        {has(user, "partners.view") ? (
                          <Link href={`/crm/partners/${p.id}`} className="block truncate text-[13px] font-medium text-slate-800 hover:text-blue-700">
                            {p.name}
                          </Link>
                        ) : (
                          <p className="truncate text-[13px] font-medium text-slate-800">{p.name}</p>
                        )}
                        <p className="mt-0.5 flex flex-wrap gap-1">
                          {p.pending > 0 && <Badge tone="amber">{p.pending} awaiting acceptance</Badge>}
                          {p.inLab > 0 && <Badge tone="violet">{p.inLab} in lab</Badge>}
                        </p>
                      </div>
                      <p className="shrink-0 text-right">
                        <span className="block text-[16px] font-semibold text-slate-900 tabular-nums">{p.open}</span>
                        <span className="block text-[11px] text-slate-500">open</span>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-slate-500">No open orders with any lab.</p>
              )}
            </Card>
          )}

          {has(user, "leads.view") && (
            <Card
              title="Leads today"
              actions={
                <Link href="/crm/leads" className="text-[12.5px] font-semibold text-blue-700 hover:underline">
                  Leads →
                </Link>
              }
            >
              <dl className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["New", k.leads.created],
                  ["Contacted", k.leads.contacted],
                  ["Converted", k.leads.converted],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 px-2 py-2.5">
                    <dt className="text-[11.5px] font-medium text-slate-500">{label}</dt>
                    <dd className="mt-0.5 text-[20px] font-semibold leading-none text-slate-900 tabular-nums">{num(value)}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}

          {has(user, "bookings.view") && (
            <Card title="Top city this month">
              {data.topCity ? (
                <Link
                  href={data.topCity.cityId ? `/crm/bookings?city=${data.topCity.cityId}&range=month` : "/crm/bookings?range=month"}
                  className="flex items-center gap-3 rounded-md hover:bg-slate-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MapPinned className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold text-slate-900">{data.topCity.city}</span>
                    <span className="block text-[12.5px] text-slate-500">
                      {num(data.topCity.n)} {data.topCity.n === 1 ? "booking" : "bookings"} this month
                    </span>
                  </span>
                </Link>
              ) : (
                <p className="text-[13px] text-slate-500">No bookings this month yet.</p>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
