import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightCircle, CalendarClock, ClipboardList, MessageCircle, Phone, PhoneCall, UserCheck, XCircle } from "lucide-react";

import {
  Badge,
  BookingStatusBadge,
  Card,
  EmptyState,
  Facts,
  Field,
  Notice,
  PageHeader,
  Select,
  SourceBadge,
  Stepper,
  Textarea,
  Timeline,
  btn,
} from "@/components/crm/ui";
import { ActionForm, ConfirmAction, FormModal, QuickAction, SubmitButton } from "@/components/crm/forms";
import FollowUpActions from "@/components/crm/leads/FollowUpActions";
import { CallFields, FollowUpFields } from "@/components/crm/leads/fields";
import { recordHistory } from "@/lib/crm/activity";
import { CALL_OUTCOME, LEAD_STATUS, bookingCode, customerCode, leadCode, leadStatus } from "@/lib/crm/constants";
import { date, dateTime, day, isPast, phone, rupees, telHref, waHref } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import { listNotes } from "@/lib/crm/stores/bookings";
import { OPEN_LEAD, duration, followUpsFor, fromNow, getLead, listCalls } from "@/lib/crm/stores/leads";
import { listStaff } from "@/lib/crm/stores/lookups";

import { logCallAction } from "../../calls/actions";
import {
  cancelFollowUpAction,
  completeFollowUpAction,
  rescheduleFollowUpAction,
  scheduleFollowUpAction,
} from "../../follow-ups/actions";
import { assignLeadAction, leadNoteAction, leadStatusAction } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: leadCode(id) };
}

const STEPS = ["new", "contacted", "follow_up", "booked", "completed"].map((k) => ({ key: k, label: LEAD_STATUS[k].label }));
const WEBSITE_FORM = { form: "Website enquiry form", cart_cod: "Website cart · pay at collection", cart_online: "Website cart · online payment" };
const FU_ACTIONS = { complete: completeFollowUpAction, reschedule: rescheduleFollowUpAction, cancel: cancelFollowUpAction };

/**
 * One lead: who, what they want, where it stands, and everything that has
 * happened to it. The primary action is always the next one — call, schedule
 * a call-back, convert to a booking.
 */
export default async function LeadDetail({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await requirePerm("leads.view", `/crm/leads/${id}`);
  const l = await getLead(id);
  if (!l || l.deleted_at) notFound();

  const canManage = has(user, "leads.manage");
  const canBook = has(user, "bookings.manage");
  const [history, notes, calls, followUps, staff] = await Promise.all([
    recordHistory(user, "leads", l.id),
    listNotes("lead", l.id),
    listCalls({ leadId: l.id, limit: 50 }),
    followUpsFor({ leadId: l.id }),
    canManage ? listStaff() : [],
  ]);

  const status = l.crm_status;
  const open = OPEN_LEAD.includes(status);
  const closed = ["not_interested", "cancelled"].includes(status);
  const booking = l.bookings[0] ?? null;
  const pending = followUps.filter((f) => f.status === "pending");

  // One story, newest first. Calls come from the call log itself (their
  // "call" rows in the activity log would only repeat them).
  const timeline = [
    ...history
      .filter((h) => h.action !== "call")
      .map((h) => ({
        id: `a${h.id}`,
        at: new Date(h.created_at).getTime(),
        title: h.summary,
        meta: `${h.user_name || h.user_email || "System"} · ${dateTime(h.created_at)}`,
        tone: { status: "blue", assign: "sky", create: "indigo", follow_up: "amber" }[h.action] ?? "slate",
      })),
    ...calls.rows.map((c) => ({
      id: `c${c.id}`,
      at: new Date(c.called_at).getTime(),
      title: `${c.direction === "inbound" ? "Inbound" : "Outbound"} call · ${CALL_OUTCOME[c.outcome]?.label ?? c.outcome}${c.duration_sec ? ` · ${duration(c.duration_sec)}` : ""}`,
      body: c.notes || null,
      meta: `${c.user_name || "—"} · ${dateTime(c.called_at)}`,
      tone: CALL_OUTCOME[c.outcome]?.tone ?? "slate",
    })),
    ...followUps
      .filter((f) => f.done_at)
      .map((f) => ({
        id: `f${f.id}`,
        at: new Date(f.done_at).getTime(),
        title: `Follow-up ${f.status === "done" ? "done" : "cancelled"}${f.note ? ` · ${f.note}` : ""}`,
        meta: `${f.done_by_name || "—"} · ${dateTime(f.done_at)}`,
        tone: f.status === "done" ? "emerald" : "slate",
      })),
    ...notes.map((n) => ({
      id: `n${n.id}`,
      at: new Date(n.created_at).getTime(),
      title: n.body,
      meta: `Note · ${n.user_name || n.user_email || "—"} · ${dateTime(n.created_at)}`,
      tone: "amber",
    })),
  ].sort((a, z) => z.at - a.at);

  return (
    <>
      <PageHeader
        eyebrow={
          <span className="flex flex-wrap items-center gap-2">
            {leadCode(l.id)} <SourceBadge source={l.channel || "website"} />
          </span>
        }
        title={l.name}
        description={[phone(l.phone), l.city, `Created ${dateTime(l.created_at)}`].filter(Boolean).join(" · ")}
        back={{ href: "/crm/leads", label: "Leads" }}
        actions={
          <>
            <a href={telHref(l.phone)} className={btn("secondary")}>
              <Phone className="h-4 w-4" aria-hidden /> Call
            </a>
            <a href={waHref(l.phone, `Hello ${l.name}, this is MedicoBharat about your enquiry${l.test ? ` for ${l.test}` : ""}.`)} target="_blank" rel="noreferrer" className={btn("secondary")}>
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
            </a>
            {booking ? (
              <Link href={`/crm/bookings/${booking.id}`} className={btn("soft")}>
                <ClipboardList className="h-4 w-4" aria-hidden /> {bookingCode(booking.id)}
              </Link>
            ) : (
              canBook &&
              !closed && (
                <Link href={`/crm/bookings/new?lead=${l.id}`} className={btn("primary")}>
                  <ArrowRightCircle className="h-4 w-4" aria-hidden /> Convert to booking
                </Link>
              )
            )}
          </>
        }
      />

      {sp.created && (
        <div className="mb-4">
          <Notice tone="emerald" title={`Lead ${leadCode(l.id)} created`}>
            Convert it to a booking when they are ready, or schedule a call-back below.
          </Notice>
        </div>
      )}
      {closed && (
        <div className="mb-4">
          <Notice tone="slate" title={leadStatus(status).label} icon={<XCircle className="h-4 w-4" aria-hidden />}>
            Closed {l.status_changed_at ? dateTime(l.status_changed_at) : ""}. The reason is in the history below.
          </Notice>
        </div>
      )}

      {/* Where it stands */}
      <section className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone={leadStatus(status).tone}>{leadStatus(status).label}</Badge>
          {pending[0] && <Badge tone={isPast(pending[0].due_at) ? "rose" : "amber"}>Call back {fromNow(pending[0].due_at)}</Badge>}
          {l.assigned_name && <Badge tone="slate" dot={false}>{l.assigned_name}</Badge>}
        </div>
        <Stepper steps={STEPS} current={status} cancelled={closed} />
        {canManage && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            {status === "new" && (
              <QuickAction action={leadStatusAction} fields={{ id: l.id, status: "contacted" }} variant="primary">
                <PhoneCall className="h-4 w-4" aria-hidden /> Mark contacted
              </QuickAction>
            )}
            {status === "follow_up" && (
              <QuickAction action={leadStatusAction} fields={{ id: l.id, status: "contacted" }}>
                Back to contacted
              </QuickAction>
            )}
            {open && (
              <a href="#follow-up" className={btn(status === "new" ? "secondary" : "primary")}>
                <CalendarClock className="h-4 w-4" aria-hidden /> Schedule follow-up
              </a>
            )}
            {status === "booked" && (
              <QuickAction action={leadStatusAction} fields={{ id: l.id, status: "completed" }} variant="success">
                Mark completed
              </QuickAction>
            )}
            {closed && (
              <QuickAction action={leadStatusAction} fields={{ id: l.id, status: "contacted" }} variant="primary">
                Reopen lead
              </QuickAction>
            )}
            {(open || status === "booked") && (
              <>
                <ConfirmAction
                  action={leadStatusAction}
                  fields={{ id: l.id, status: "not_interested" }}
                  label="Not interested"
                  variant="ghost"
                  title="Mark as not interested?"
                  body="Pending call-backs are cancelled. The lead can be reopened later."
                  reason
                  reasonLabel="Why? (price, went elsewhere, no need…)"
                  confirmLabel="Not interested"
                />
                <ConfirmAction
                  action={leadStatusAction}
                  fields={{ id: l.id, status: "cancelled" }}
                  label="Cancel lead"
                  variant="ghost"
                  title="Cancel this lead?"
                  body="Use this for duplicates, wrong numbers and test entries."
                  reason
                  reasonLabel="Why is it being cancelled?"
                  confirmLabel="Cancel lead"
                />
              </>
            )}
          </div>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <Card title="Enquiry">
            <Facts
              items={[
                { label: "Mobile", value: <a href={telHref(l.phone)} className="text-blue-700 hover:underline">{phone(l.phone)}</a> },
                { label: "Came in by", value: <SourceBadge source={l.channel || "website"} /> },
                { label: "Interested test", value: l.test },
                { label: "Interested package", value: l.interested_package },
                { label: "City", value: l.city },
                { label: "Area", value: l.area },
                ...(l.address ? [{ label: "Address", value: l.address, wide: true }] : []),
                ...(WEBSITE_FORM[l.source] && l.channel === "website" ? [{ label: "Website", value: WEBSITE_FORM[l.source] }] : []),
                ...(l.notes ? [{ label: "Notes", value: <span className="whitespace-pre-line">{l.notes}</span>, wide: true }] : []),
                { label: "Created by", value: l.created_by_name || (l.channel === "website" ? "Website" : "—") },
                ...(l.status_changed_at ? [{ label: "Status changed", value: dateTime(l.status_changed_at) }] : []),
              ]}
            />
          </Card>

          <Card
            title="Calls"
            description={`${calls.total} logged`}
            actions={
              canManage ? (
                <FormModal
                  action={logCallAction}
                  fields={{ leadId: l.id, phone: l.phone, name: l.name }}
                  label="Log call"
                  size="sm"
                  variant="soft"
                  icon={<PhoneCall className="h-3.5 w-3.5" aria-hidden />}
                  title={`Log a call with ${l.name}`}
                  description={phone(l.phone)}
                  submitLabel="Log call"
                >
                  <CallFields p="lead-call" phone={false} name={false} />
                </FormModal>
              ) : null
            }
          >
            {calls.rows.length ? (
              <ul className="divide-y divide-slate-100">
                {calls.rows.map((c) => (
                  <li key={c.id} className="py-2.5 first:pt-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[13.5px] font-medium text-slate-900">
                        {c.direction === "inbound" ? "Inbound" : "Outbound"}
                        {c.duration_sec ? <span className="font-normal text-slate-500"> · {duration(c.duration_sec)}</span> : null}
                      </p>
                      <Badge tone={CALL_OUTCOME[c.outcome]?.tone}>{CALL_OUTCOME[c.outcome]?.label ?? c.outcome}</Badge>
                    </div>
                    {c.notes && <p className="mt-0.5 text-[13px] text-slate-700">{c.notes}</p>}
                    <p className="mt-0.5 text-[11.5px] text-slate-500">
                      {dateTime(c.called_at)}
                      {c.user_name ? ` · ${c.user_name}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState compact icon={<PhoneCall className="h-5 w-5" />} title="No calls yet" hint={canManage ? "Call them, then log the outcome here." : null} />
            )}
          </Card>

          <Card title="History" description="Every change, call, follow-up and note.">
            {canManage && (
              <ActionForm action={leadNoteAction} reset className="mb-4 space-y-2">
                <input type="hidden" name="id" value={l.id} />
                <Textarea name="body" rows={2} maxLength={2000} placeholder="Add a note — what they said, what they need…" aria-label="Note" required />
                <SubmitButton size="sm" variant="secondary">
                  Add note
                </SubmitButton>
              </ActionForm>
            )}
            <Timeline items={timeline} empty={<p className="text-[13px] text-slate-500">Nothing yet.</p>} />
          </Card>
        </div>

        <div className="space-y-5">
          {(booking || l.customer) && (
            <Card title="Linked records">
              <Facts
                cols={1}
                items={[
                  ...(l.customer
                    ? [
                        {
                          label: "Customer",
                          value: has(user, "customers.view") ? (
                            <Link href={`/crm/customers/${l.customer.id}`} className="inline-flex items-center gap-1.5 text-blue-700 hover:underline">
                              <UserCheck className="h-4 w-4" aria-hidden /> {l.customer.name} · {customerCode(l.customer.id)}
                            </Link>
                          ) : (
                            l.customer.name
                          ),
                        },
                      ]
                    : []),
                  ...l.bookings.map((b) => ({
                    label: `Booking ${bookingCode(b.id)}`,
                    value: (
                      <Link href={`/crm/bookings/${b.id}`} className="inline-flex flex-wrap items-center gap-2 hover:text-blue-700">
                        <BookingStatusBadge status={b.status} /> {rupees(b.final_amount)} · {date(b.created_at)}
                      </Link>
                    ),
                  })),
                ]}
              />
            </Card>
          )}

          <Card title="Owner">
            {canManage ? (
              <ActionForm action={assignLeadAction} className="flex flex-col gap-2 sm:flex-row sm:items-end lg:flex-col lg:items-stretch">
                <input type="hidden" name="id" value={l.id} />
                <Field label="Assigned to" htmlFor="assignedUserId" className="flex-1">
                  <Select id="assignedUserId" name="assignedUserId" defaultValue={l.assigned_user_id ? String(l.assigned_user_id) : ""}>
                    <option value="">Nobody</option>
                    {staff.map((u) => (
                      <option key={u.id} value={String(u.id)}>
                        {u.name || u.email}
                      </option>
                    ))}
                  </Select>
                </Field>
                <SubmitButton variant="secondary">Save</SubmitButton>
              </ActionForm>
            ) : (
              <p className="text-[13.5px] text-slate-700">{l.assigned_name || l.assigned_to || "Nobody"}</p>
            )}
            {!l.assigned_user_id && l.assigned_to && (
              <p className="mt-2 text-[12px] text-slate-500">Admin panel note: “{l.assigned_to}”</p>
            )}
          </Card>

          <Card id="follow-up" title="Follow-ups" description={pending.length ? `${pending.length} pending` : "Nothing pending"}>
            {followUps.length > 0 && (
              <ul className="mb-4 space-y-2">
                {followUps.slice(0, 15).map((f) => (
                  <li key={f.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-medium text-slate-900">{dateTime(f.due_at)}</p>
                      {f.status === "pending" ? (
                        <Badge tone={isPast(f.due_at) ? "rose" : "amber"}>{fromNow(f.due_at)}</Badge>
                      ) : (
                        <Badge tone={f.status === "done" ? "emerald" : "slate"}>{f.status === "done" ? "Done" : "Cancelled"}</Badge>
                      )}
                    </div>
                    {f.note && <p className="mt-0.5 text-[12.5px] text-slate-600">{f.note}</p>}
                    <p className="mt-0.5 text-[11.5px] text-slate-400">{f.assignee_name ? `For ${f.assignee_name}` : "Unassigned"}</p>
                    {canManage && f.status === "pending" && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        <FollowUpActions f={f} actions={FU_ACTIONS} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {!followUps.length && l.follow_up_on && (
              <p className="mb-4 text-[12.5px] text-slate-500">Admin panel call-back date: {day(l.follow_up_on)}</p>
            )}
            {canManage && (open || status === "booked") ? (
              <ActionForm action={scheduleFollowUpAction} reset className="space-y-3 border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                <input type="hidden" name="leadId" value={l.id} />
                <FollowUpFields p="lead-fu" staff={staff} assignee={l.assigned_user_id ?? ""} />
                <SubmitButton variant="secondary" className="w-full">
                  <CalendarClock className="h-4 w-4" aria-hidden /> Schedule follow-up
                </SubmitButton>
              </ActionForm>
            ) : (
              !followUps.length && <p className="text-[13px] text-slate-500">{closed ? "Reopen the lead to schedule a call-back." : "No follow-ups."}</p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
