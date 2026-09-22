import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  Card,
  Empty,
  PageHeader,
  Pill,
  rupees,
  Row,
  Stat,
  StatusPill,
  Table,
  Td,
  when,
} from "@/components/admin/ui";
import { recentAudit } from "@/lib/admin/audit";
import { requireUser } from "@/lib/admin/guard";
import { mediaSavings } from "@/lib/admin/media";
import { dashboardStats, listLeads } from "@/lib/admin/opsStore";
import { seoHealth } from "@/lib/admin/seoStore";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic"; // live counts, never a cached page

/**
 * The front page of the panel.
 *
 * ── WHAT IT SHOWS AND WHY ────────────────────────────────────────────────
 * Two questions, in order: is there anybody waiting for a phone call, and did
 * anything break. Everything else is secondary and sits below.
 *
 * "Untouched leads" is first because it is the only number here that costs
 * money while you look at it. A lead sitting at `new` is a person who filled
 * in a form expecting to be called; the site tells them a phlebotomist will be
 * in touch, and that is a promise the panel exists to keep.
 *
 * ── REVENUE IS PAID ORDERS ONLY ──────────────────────────────────────────
 * `pending_collection` is money somebody intends to hand over at the door. It
 * is reported beside revenue under its own name, never added to it. A back
 * office that reports intent as income is one that eventually reports a number
 * to somebody who acts on it.
 */
export default async function Dashboard({ searchParams }) {
  const user = await requireUser("/admin");
  const { denied } = await searchParams;

  const [stats, seo, media, recent, untouched] = await Promise.all([
    dashboardStats(),
    seoHealth(),
    mediaSavings(),
    recentAudit({ limit: 8 }),
    listLeads({ status: "new", limit: 6 }),
  ]);

  const n = (value) => Number(value ?? 0);

  return (
    <>
      <PageHeader
        title={`Good ${greeting()}, ${user.name?.split(" ")[0] || "there"}`}
        subtitle="Everything the site is doing right now."
      />

      {denied && (
        <p
          role="alert"
          className="rounded-xl bg-amber-50 px-4 py-3 text-[13px] font-medium text-amber-900 ring-1 ring-inset ring-amber-600/20"
        >
          That screen needs an owner account. Your role is <strong>{user.role}</strong>.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Waiting for a call"
          value={n(stats.leads.untouched)}
          sub={
            n(stats.leads.untouched)
              ? "Leads still at “new”. Each one is a person expecting to hear back."
              : "Nobody is waiting. "
          }
          tone={n(stats.leads.untouched) ? "slate" : "emerald"}
          href="/admin/leads?status=new"
        />
        <Stat
          label="Leads today"
          value={n(stats.leads.today)}
          sub={`${n(stats.leads.week)} in the last 7 days · ${n(stats.leads.total)} all time`}
          href="/admin/leads"
        />
        <Stat
          label="Revenue, 30 days"
          value={rupees(stats.orders.revenue_30d)}
          sub={`${rupees(stats.orders.expected)} more expected at collection`}
          tone="emerald"
          href="/admin/orders?status=paid"
        />
        <Stat
          label="Carts left open"
          value={n(stats.carts.open)}
          sub={`${n(stats.carts.stale)} untouched for a day · ${n(stats.carts.converted)} checked out`}
          href="/admin/carts"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Leads waiting"
          subtitle="Oldest first is not the order here — newest, because a fresh lead converts best when it is called within the hour."
          footer={
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-emerald-700 hover:text-emerald-800"
            >
              All leads <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {untouched.rows.length ? (
            <ul className="divide-y divide-slate-100">
              {untouched.rows.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold text-slate-900">
                        {lead.name}
                        <span className="ml-2 font-normal text-slate-500">{lead.phone}</span>
                      </p>
                      <p className="mt-0.5 truncate text-[12px] text-slate-500">
                        {lead.city}
                        {lead.test ? ` · ${lead.test}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11.5px] text-slate-400">
                      {when(lead.created_at, { time: true })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              title="Nothing waiting"
              hint="Every lead has been picked up. New ones appear here the moment a form is submitted."
            />
          )}
        </Card>

        <Card
          title="Search health"
          subtitle="Facts about what the site is publishing — each one links to the list that fixes it."
        >
          <dl className="space-y-3">
            <Health
              label="Published articles"
              value={`${n(seo.posts.total)}`}
              detail={
                n(seo.posts.total)
                  ? `average SEO score ${n(seo.posts.average)} · ${n(seo.posts.strong)} strong, ${n(seo.posts.weak)} weak`
                  : "Nothing published from the panel yet — the guides in content/blogs are still being served from disk."
              }
              href="/admin/blogs?status=published"
            />
            <Health
              label="Articles with no meta description"
              value={n(seo.postsWithoutDescription)}
              detail="Google writes its own snippet when one is missing, and it usually picks a worse sentence than you would."
              tone={n(seo.postsWithoutDescription) ? "warn" : "ok"}
              href="/admin/blogs"
            />
            <Health
              label="Images with no alt text"
              value={n(seo.imagesWithoutAlt)}
              detail="Invisible to a screen reader and worth nothing in image search."
              tone={n(seo.imagesWithoutAlt) ? "warn" : "ok"}
              href="/admin/media"
            />
            <Health
              label="Pages set to noindex"
              value={n(seo.noindexed)}
              detail="Deliberate is fine. Accidental is a page that can never rank."
              tone={n(seo.noindexed) ? "warn" : "ok"}
              href="/admin/seo"
            />
            <Health
              label="Live redirects"
              value={n(seo.redirects)}
              detail="Rules served from the panel, on top of the permanent ones in next.config.mjs."
              href="/admin/seo/redirects"
            />
          </dl>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Most booked"
          subtitle="Across every order ever placed — what to keep at the top of the grid."
        >
          {stats.topTests.length ? (
            <Table head={["Test", "Units", "Orders"]}>
              {stats.topTests.map((test) => (
                <Row key={test.test_name}>
                  <Td className="font-medium text-slate-900">{test.test_name}</Td>
                  <Td>{n(test.qty)}</Td>
                  <Td>{n(test.orders)}</Td>
                </Row>
              ))}
            </Table>
          ) : (
            <Empty title="No orders yet" hint="This fills in as checkouts come through." />
          )}
        </Card>

        <Card
          title="Recent changes"
          subtitle="Every write the panel makes is recorded, with who made it."
          footer={
            <Link
              href="/admin/audit"
              className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Full history <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {recent.length ? (
            <ul className="divide-y divide-slate-100">
              {recent.map((entry) => (
                <li key={entry.id} className="flex items-baseline justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-slate-800">
                      <StatusPill status={entry.action} /> <span className="ml-1">{entry.summary}</span>
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-slate-500">{entry.user_email || "system"}</p>
                  </div>
                  <span className="shrink-0 text-[11.5px] text-slate-400">
                    {when(entry.created_at, { time: true })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="Nothing yet" hint="Changes show up here as soon as anyone makes one." />
          )}
        </Card>
      </div>

      {media.files > 0 && (
        <p className="text-center text-[12px] text-slate-500">
          {media.files} image{media.files === 1 ? "" : "s"} in the library, converted to WebP —{" "}
          <strong className="font-semibold text-emerald-700">{media.savedPct}% smaller</strong> than
          what was uploaded ({Math.round(media.originalBytes / 1024 / 1024)} MB →{" "}
          {Math.round(media.webpBytes / 1024 / 1024)} MB).
        </p>
      )}
    </>
  );
}

function Health({ label, value, detail, tone = "ok", href }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <div className="min-w-0">
        <dt className="text-[13px] font-semibold text-slate-800">
          {href ? (
            <Link href={href} className="hover:text-emerald-700">
              {label}
            </Link>
          ) : (
            label
          )}
        </dt>
        <dd className="mt-0.5 text-[12px] leading-relaxed text-slate-500">{detail}</dd>
      </div>
      <Pill tone={tone === "warn" ? "amber" : "emerald"}>{value}</Pill>
    </div>
  );
}

/** Morning / afternoon / evening in IST, which is where everyone using this is. */
function greeting() {
  const hour = Number(
    new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false })
  );
  return hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
}
