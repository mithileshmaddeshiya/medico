import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";

import { QuickAction } from "@/components/crm/forms";
import { ButtonLink, EmptyState, PageHeader, SURFACE, Tabs, btn, cx, withParams } from "@/components/crm/ui";
import { listNotifications } from "@/lib/crm/activity";
import { ago, dateTime } from "@/lib/crm/format";
import { requirePerm } from "@/lib/crm/guard";

import { markAllReadAction, markReadAction } from "./actions";

export const metadata = { title: "Notifications" };
export const dynamic = "force-dynamic";

const PAGE = 30;
const SEVERITY = {
  info: { dot: "bg-blue-500", label: "Info" },
  success: { dot: "bg-emerald-500", label: "Done" },
  warning: { dot: "bg-amber-500", label: "Needs attention" },
  danger: { dot: "bg-rose-500", label: "Urgent" },
};

/**
 * Every notification the signed-in user may see (listNotifications applies
 * the audience rules), newest first, with a cursor for older ones.
 */
export default async function NotificationsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm(null, "/crm/notifications");
  const unreadOnly = sp.unread === "1";
  const before = Number(sp.before) || null;
  // One extra row says whether there is an older page.
  const rows = await listNotifications(user, { limit: PAGE + 1, before, unreadOnly });
  const items = rows.slice(0, PAGE);
  const older = rows.length > PAGE ? items[items.length - 1].id : null;

  return (
    <>
      <PageHeader
        title="Notifications"
        description="New bookings, lab responses, reports and delays that concern you."
        actions={
          <QuickAction action={markAllReadAction} variant="secondary">
            <CheckCheck className="h-4 w-4" aria-hidden /> Mark all read
          </QuickAction>
        }
      />
      <Tabs
        active={unreadOnly ? "unread" : "all"}
        tabs={[
          { key: "all", label: "All", href: "/crm/notifications" },
          { key: "unread", label: "Unread", href: "/crm/notifications?unread=1" },
        ]}
      />

      {items.length ? (
        <ul className={cx(SURFACE, "divide-y divide-slate-100 overflow-hidden")}>
          {items.map((n) => {
            const sev = SEVERITY[n.severity] ?? SEVERITY.info;
            return (
              <li key={n.id} className={cx("flex gap-3 px-4 py-3.5 sm:px-5", !n.is_read && "bg-blue-50/40")}>
                <span aria-hidden className={cx("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", sev.dot)} />
                <div className="min-w-0 flex-1">
                  <p className={cx("text-[14px] leading-snug text-slate-900", !n.is_read && "font-semibold")}>
                    <span className="sr-only">{sev.label}: </span>
                    {n.link ? (
                      <Link href={n.link} className="hover:text-blue-700">
                        {n.title}
                      </Link>
                    ) : (
                      n.title
                    )}
                  </p>
                  {n.body && <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{n.body}</p>}
                  <p className="mt-1 text-[11.5px] text-slate-400" title={dateTime(n.created_at)}>
                    {ago(n.created_at)}
                    {!n.is_read && <span className="ml-1.5 font-semibold text-blue-700">· New</span>}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center">
                  {n.link && (
                    <Link href={n.link} className={btn("ghost", "sm")}>
                      Open
                    </Link>
                  )}
                  {!n.is_read && (
                    <QuickAction action={markReadAction} fields={{ id: n.id }} size="sm" variant="ghost">
                      Mark read
                    </QuickAction>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={SURFACE}>
          <EmptyState
            icon={<Bell className="h-5 w-5" />}
            title="You are all caught up"
            hint={before ? "There is nothing older than this." : unreadOnly ? "No unread notifications." : "Notifications about your work will appear here."}
            action={before || unreadOnly ? <ButtonLink href="/crm/notifications">See all notifications</ButtonLink> : null}
          />
        </div>
      )}

      {(older || before) && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          {before ? (
            <Link href={withParams("/crm/notifications", sp, { before: null })} className={btn("ghost", "md")}>
              ← Newest
            </Link>
          ) : (
            <span />
          )}
          {older && (
            <Link href={withParams("/crm/notifications", sp, { before: older })} className={btn("secondary", "md")}>
              Load older
            </Link>
          )}
        </div>
      )}
    </>
  );
}
