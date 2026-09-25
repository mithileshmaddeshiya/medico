import Link from "next/link";
import { CalendarCheck2, CalendarClock, Phone } from "lucide-react";

import { Badge, EmptyState, Notice, PageHeader, Pagination, SURFACE, Tabs, btn, cx, withParams } from "@/components/crm/ui";
import FilterBar from "@/components/crm/FilterBar";
import FollowUpActions from "@/components/crm/leads/FollowUpActions";
import { customerCode, leadCode, leadStatus } from "@/lib/crm/constants";
import { pageOf } from "@/lib/crm/filters";
import { dateTime, isPast, phone, telHref } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import { FOLLOW_UP_TABS, followUpCounts, fromNow, listFollowUps } from "@/lib/crm/stores/leads";
import { listStaff } from "@/lib/crm/stores/lookups";

import { cancelFollowUpAction, completeFollowUpAction, rescheduleFollowUpAction } from "./actions";

export const metadata = { title: "Follow-ups" };
export const dynamic = "force-dynamic";

const ACTIONS = { complete: completeFollowUpAction, reschedule: rescheduleFollowUpAction, cancel: cancelFollowUpAction };

/**
 * The call-back board: overdue first, then today, then later. Staff who
 * manage leads see everyone's (and can narrow to one person); everyone else
 * sees their own. Follow-ups are created from a lead or a customer profile.
 */
export default async function FollowUpsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("leads.view", "/crm/follow-ups");
  const canManage = has(user, "leads.manage");
  const { limit, offset } = pageOf(sp);

  const wanted = String(sp.assignee ?? "");
  const assigneeId = canManage ? (wanted === "me" ? user.id : wanted === "none" ? "none" : Number(wanted) || null) : user.id;

  const counts = await followUpCounts({ assigneeId });
  const tab = FOLLOW_UP_TABS.some((t) => t.key === sp.tab) ? sp.tab : counts.overdue ? "overdue" : "today";
  const [list, staff] = await Promise.all([listFollowUps({ tab, assigneeId, limit, offset }), canManage ? listStaff() : []]);
  const href = (changes) => withParams("/crm/follow-ups", sp, changes);

  return (
    <>
      <PageHeader
        title="Follow-ups"
        description={canManage ? "Every scheduled call-back, overdue first." : "Your scheduled call-backs, overdue first."}
        actions={
          <Link href="/crm/leads" className={btn("secondary")}>
            Leads
          </Link>
        }
      />

      <Tabs active={tab} tabs={FOLLOW_UP_TABS.map((t) => ({ key: t.key, label: t.label, href: href({ tab: t.key, page: null }), count: counts[t.key] }))} />

      {canManage && (
        <FilterBar
          filters={[
            {
              name: "assignee",
              label: "Assigned",
              options: [{ value: "me", label: "Mine" }, { value: "none", label: "Nobody" }, ...staff.map((u) => ({ value: String(u.id), label: u.name || u.email }))],
            },
          ]}
        />
      )}

      {tab === "overdue" && list.total > 0 && (
        <div className="mb-4">
          <Notice tone="rose" title={`${list.total} call-back${list.total === 1 ? " is" : "s are"} overdue`}>
            Call them now, or reschedule to a time that will actually happen.
          </Notice>
        </div>
      )}

      {list.rows.length ? (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.rows.map((f) => (
            <FollowUpCard key={f.id} f={f} canManage={canManage} />
          ))}
        </ul>
      ) : (
        <div className={SURFACE}>
          <EmptyState
            icon={tab === "done" ? <CalendarCheck2 className="h-5 w-5" /> : <CalendarClock className="h-5 w-5" />}
            title={{ overdue: "Nothing overdue", today: "Nothing left for today", upcoming: "Nothing scheduled ahead", done: "Nothing done yet" }[tab]}
            hint="Schedule a call-back from a lead or a customer profile."
            action={
              <Link href="/crm/leads" className={btn("secondary")}>
                Open leads
              </Link>
            }
          />
        </div>
      )}
      <Pagination total={list.total} limit={limit} offset={offset} hrefFor={(p) => href({ page: p > 1 ? p : null })} />
    </>
  );
}

function FollowUpCard({ f, canManage }) {
  const name = f.lead_name || f.customer_name || "Unknown";
  const number = f.lead_phone || f.customer_phone;
  const link = f.lead_id ? `/crm/leads/${f.lead_id}` : f.customer_id ? `/crm/customers/${f.customer_id}` : null;
  const pending = f.status === "pending";
  const late = pending && isPast(f.due_at);
  const interest = [f.lead_test, f.lead_package].filter(Boolean).join(" · ");

  return (
    <li className={cx(SURFACE, "flex flex-col p-4", late && "border-rose-200")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-slate-500">
            {f.lead_id ? leadCode(f.lead_id) : f.customer_id ? customerCode(f.customer_id) : "—"}
            {f.lead_id && f.lead_status ? ` · ${leadStatus(f.lead_status).label}` : ""}
          </p>
          {link ? (
            <Link href={link} className="mt-0.5 block truncate text-[15px] font-semibold text-slate-900 hover:text-blue-700">
              {name}
            </Link>
          ) : (
            <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{name}</p>
          )}
          {number && <p className="text-[13px] text-slate-600">{phone(number)}</p>}
        </div>
        {number && pending && (
          <a href={telHref(number)} className={btn("primary", "md", "h-10 w-10 shrink-0 px-0")} aria-label={`Call ${name}`}>
            <Phone className="h-4 w-4" aria-hidden />
          </a>
        )}
      </div>

      <div className="mt-3 space-y-1 text-[13px]">
        {f.note && <p className="text-slate-800">{f.note}</p>}
        {interest && <p className="text-slate-500">Interested in {interest}</p>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {pending ? (
          <Badge tone={late ? "rose" : "amber"}>{fromNow(f.due_at)}</Badge>
        ) : (
          <Badge tone={f.status === "done" ? "emerald" : "slate"}>{f.status === "done" ? "Done" : "Cancelled"}</Badge>
        )}
        <span className={cx("text-[12px]", late ? "font-semibold text-rose-700" : "text-slate-500")}>{dateTime(f.due_at)}</span>
      </div>
      <p className="mt-1 text-[12px] text-slate-500">
        {f.assignee_name ? `For ${f.assignee_name}` : "Unassigned"}
        {!pending && f.done_at ? ` · closed ${dateTime(f.done_at)}${f.done_by_name ? ` by ${f.done_by_name}` : ""}` : ""}
      </p>

      {canManage && pending && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
          <FollowUpActions f={f} actions={ACTIONS} />
        </div>
      )}
    </li>
  );
}
