import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Download,
  Eye,
  FlaskConical,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  ShieldCheck,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";

import {
  Badge,
  BookingStatusBadge,
  ButtonLink,
  Card,
  CollectionBadge,
  EmptyState,
  Facts,
  Field,
  Input,
  Notice,
  PageHeader,
  PartnerStatusBadge,
  PaymentModeBadge,
  PaymentStatusBadge,
  ReportStatusBadge,
  Select,
  SourceBadge,
  Stepper,
  Textarea,
  Timeline,
  btn,
} from "@/components/crm/ui";
import { ActionForm, ConfirmAction, FormModal, QuickAction, SubmitButton } from "@/components/crm/forms";
import ReportUpload from "@/components/crm/ReportUpload";
import { recordHistory } from "@/lib/crm/activity";
import {
  BOOKING_STATUS,
  BOOKING_STATUSES,
  COLLECTION_SLOTS,
  PAYMENT_MODES,
  PIPELINE,
  TXN_STATUS,
  bookingCode,
  customerCode,
  paymentCode,
} from "@/lib/crm/constants";
import { ago, date, dateTime, day, isPast, mapHref, phone, rupees, telHref, waHref } from "@/lib/crm/format";
import { has, requirePerm, scopeOf } from "@/lib/crm/guard";
import { getBooking, listNotes } from "@/lib/crm/stores/bookings";
import { listCollectors, listPartnerOptions } from "@/lib/crm/stores/lookups";

import {
  archiveBookingAction,
  assignCollectorAction,
  assignPartnerAction,
  collectionAction,
  labProgressAction,
  noteAction,
  partnerRemarkAction,
  partnerRespondAction,
  paymentAction,
  paymentStatusAction,
  rejectReportAction,
  sendReportAction,
  statusAction,
  verifyReportAction,
} from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: bookingCode(id) };
}

const STEPS = BOOKING_STATUSES.filter((s) => PIPELINE.includes(s.key)).map((s) => ({ key: s.key, label: s.label }));

/**
 * One booking, start to finish. What shows depends on who is looking:
 *
 *   staff      everything; the next workflow step is the primary button
 *   collector  (only their own collections) the address, phone and the
 *              collection buttons — no money beyond what to collect
 *   partner    (only their own orders) patient, tests, lab instructions,
 *              accept/reject, sample received, upload report — never the
 *              customer's phone, address, price or internal notes
 */
export default async function BookingDetail({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await requirePerm(["bookings.view", "collections.view"], `/crm/bookings/${id}`);
  const scope = scopeOf(user);
  const b = await getBooking(id, scope);
  if (!b) notFound();

  if (user.isPartner) return <PartnerView b={b} user={user} />;

  const canManage = has(user, "bookings.manage");
  const canAssign = has(user, "bookings.assign");
  const canCollect = has(user, "collections.manage");
  const canPay = has(user, "payments.manage");
  const canVerify = has(user, "reports.verify");
  const canUpload = has(user, "reports.manage");
  const canReports = has(user, "reports.view");
  const collectorOnly = user.role === "collector";

  const [history, notes, collectors, partners] = await Promise.all([
    recordHistory(user, "bookings", b.id),
    listNotes("booking", b.id),
    canAssign ? listCollectors() : [],
    canAssign ? listPartnerOptions({ cityId: b.city_id }) : [],
  ]);

  const cancelled = b.status === "cancelled";
  const live = b.reports.find((r) => ["uploaded", "verified", "sent"].includes(r.status));
  const due = Math.max(0, Number(b.final_amount) - Number(b.paid_amount) + Number(b.refunded_amount));
  const margin = Number(b.final_amount) - Number(b.partner_cost);
  const address = [b.address, b.area, b.landmark && `near ${b.landmark}`, b.city].filter(Boolean).join(", ");

  const timeline = [
    ...history.map((h) => ({
      id: `a${h.id}`,
      at: new Date(h.created_at).getTime(),
      title: h.summary,
      meta: `${h.user_name || h.user_email || "System"} · ${dateTime(h.created_at)}`,
      tone: { status: "blue", payment: "emerald", upload: "violet", verify: "teal", send: "emerald", reject: "rose", assign: "sky", collection: "indigo", accept: "emerald" }[h.action] ?? "slate",
    })),
    ...notes.map((n) => ({
      id: `n${n.id}`,
      at: new Date(n.created_at).getTime(),
      title: n.body,
      meta: `Note · ${n.user_name || n.user_email} · ${dateTime(n.created_at)}`,
      tone: "amber",
    })),
  ].sort((a, z) => z.at - a.at);

  return (
    <>
      <PageHeader
        eyebrow={
          <span className="flex flex-wrap items-center gap-2">
            {bookingCode(b.id)} <SourceBadge source={b.source} />
          </span>
        }
        title={b.patient_name}
        description={[b.age && `${b.age} y`, b.gender, collectorOnly ? null : `Booked ${dateTime(b.created_at)}`].filter(Boolean).join(" · ")}
        back={{ href: collectorOnly ? "/crm/collections" : "/crm/bookings", label: collectorOnly ? "Collections" : "Bookings" }}
        actions={
          <>
            <a href={telHref(b.patient_phone)} className={btn("secondary")}>
              <Phone className="h-4 w-4" aria-hidden /> Call
            </a>
            <a href={waHref(b.patient_phone, `Hello ${b.patient_name}, this is MedicoBharat about your booking ${bookingCode(b.id)}.`)} target="_blank" rel="noreferrer" className={btn("secondary")}>
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
            </a>
            {canManage && !cancelled && (
              <ButtonLink href={`/crm/bookings/${b.id}/edit`}>
                <Pencil className="h-4 w-4" aria-hidden /> Edit
              </ButtonLink>
            )}
          </>
        }
      />

      {sp.created && <div className="mb-4"><Notice tone="emerald" title={`Booking ${bookingCode(b.id)} created`}>Assign a collector and a lab below when you are ready.</Notice></div>}
      {sp.saved && <div className="mb-4"><Notice tone="emerald">Changes saved.</Notice></div>}
      {cancelled && (
        <div className="mb-4">
          <Notice tone="rose" title="Cancelled" icon={<XCircle className="h-4 w-4" />}>
            {b.cancel_reason || "No reason recorded."} · {dateTime(b.cancelled_at)}
          </Notice>
        </div>
      )}

      {/* Where it stands */}
      <section className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <BookingStatusBadge status={b.status} />
          <CollectionBadge status={b.collection_status} />
          {b.partner_id && <PartnerStatusBadge status={b.partner_status} />}
          <ReportStatusBadge status={b.report_status} />
          {!collectorOnly && <PaymentStatusBadge status={b.payment_status} />}
        </div>
        <Stepper steps={STEPS} current={b.status} cancelled={cancelled} />
        {canManage && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <NextStep b={b} live={live} />
            <MoveTo b={b} />
            {!cancelled ? (
              <ConfirmAction
                action={statusAction}
                fields={{ id: b.id, status: "cancelled" }}
                label="Cancel booking"
                variant="ghost"
                title={`Cancel ${bookingCode(b.id)}?`}
                body="The collector and the lab are told. It can be reopened later."
                reason
                reasonLabel="Why is it being cancelled?"
                confirmLabel="Cancel booking"
              />
            ) : (
              <QuickAction action={statusAction} fields={{ id: b.id, status: "booked" }} variant="primary">
                Reopen booking
              </QuickAction>
            )}
          </div>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          {/* Tests and money */}
          {!collectorOnly && (
            <Card title="Tests & amount" actions={<PaymentModeBadge mode={b.payment_mode} />}>
              <ul className="divide-y divide-slate-100">
                {b.items.map((i) => (
                  <li key={i.id} className="flex items-start justify-between gap-3 py-2.5 first:pt-0">
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-medium text-slate-900">
                        {i.name}
                        {i.qty > 1 && <span className="text-slate-500"> × {i.qty}</span>}
                      </p>
                      {i.is_package ? <p className="text-[11.5px] text-slate-500">Package</p> : null}
                    </div>
                    <div className="text-right text-[13.5px] tabular-nums">
                      <p className="font-medium">{rupees(i.line_total)}</p>
                      {has(user, "revenue.view") && <p className="text-[11.5px] text-slate-500">Lab {rupees(Number(i.partner_cost) * i.qty)}</p>}
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-[13px]">
                <Row label="Subtotal" value={rupees(b.subtotal)} />
                {Number(b.discount) > 0 && <Row label="Discount" value={`− ${rupees(b.discount)}`} />}
                {Number(b.collection_fee) > 0 && <Row label="Home collection" value={rupees(b.collection_fee)} />}
                <Row label="Total" value={rupees(b.final_amount)} strong />
                <Row label="Paid" value={rupees(b.paid_amount)} />
                {Number(b.refunded_amount) > 0 && <Row label="Refunded" value={rupees(b.refunded_amount)} />}
                {due > 0 && !cancelled && <Row label="Still to collect" value={rupees(due)} tone="text-orange-700" strong />}
                {has(user, "revenue.view") && (
                  <Row label="MedicoBharat margin" value={`${rupees(margin)}${Number(b.final_amount) ? ` · ${Math.round((margin / Number(b.final_amount)) * 100)}%` : ""}`} tone="text-slate-500" />
                )}
              </dl>
            </Card>
          )}

          {/* Collection */}
          <Card
            id="collection"
            title="Home collection"
            actions={<CollectionBadge status={b.collection_status} />}
            description={b.collection_date ? `${day(b.collection_date)} · ${b.collection_slot || "any time"}` : "Not scheduled yet"}
          >
            <Facts
              items={[
                { label: "Collector", value: b.collector_name ? `${b.collector_name}${b.collector_phone ? ` · ${phone(b.collector_phone)}` : ""}` : "Not assigned" },
                { label: "Mobile", value: <a href={telHref(b.patient_phone)} className="text-blue-700 hover:underline">{phone(b.patient_phone)}</a> },
                ...(b.alt_phone ? [{ label: "Alternate", value: <a href={telHref(b.alt_phone)} className="text-blue-700 hover:underline">{b.alt_phone}</a> }] : []),
                {
                  label: "Address",
                  wide: true,
                  value: address ? (
                    <a href={mapHref(address)} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1.5 text-blue-700 hover:underline">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {address}
                    </a>
                  ) : (
                    ""
                  ),
                },
                ...(b.arrived_at ? [{ label: "Arrived", value: dateTime(b.arrived_at) }] : []),
                ...(b.collected_at ? [{ label: "Collected", value: dateTime(b.collected_at) }] : []),
                ...(b.collection_note ? [{ label: "Collector's note", value: b.collection_note, wide: true }] : []),
                ...(collectorOnly && due > 0 ? [{ label: "Collect from customer", value: <span className="font-semibold text-orange-700">{rupees(due)}</span> }] : []),
              ]}
            />

            {!cancelled && canCollect && b.collector_id && b.collection_status !== "collected" && (
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:flex sm:flex-wrap">
                {b.collection_status === "assigned" && <QuickAction action={collectionAction} fields={{ id: b.id, status: "confirmed" }}>Confirmed with customer</QuickAction>}
                {["assigned", "confirmed"].includes(b.collection_status) && <QuickAction action={collectionAction} fields={{ id: b.id, status: "on_the_way" }}>On the way</QuickAction>}
                {["assigned", "confirmed", "on_the_way"].includes(b.collection_status) && <QuickAction action={collectionAction} fields={{ id: b.id, status: "arrived" }}>Arrived</QuickAction>}
                <QuickAction action={collectionAction} fields={{ id: b.id, status: "collected" }} variant="success">
                  <CheckCircle2 className="h-4 w-4" aria-hidden /> Sample collected
                </QuickAction>
                <ConfirmAction
                  action={collectionAction}
                  fields={{ id: b.id, status: "failed" }}
                  label="Failed"
                  variant="ghost"
                  title="Collection failed"
                  body="Say what happened — customer not home, refused, wrong address…"
                  reason
                  confirmLabel="Mark failed"
                />
              </div>
            )}

            {canAssign && !cancelled && b.collection_status !== "collected" && (
              <ActionForm action={assignCollectorAction} className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-[1fr_9.5rem_9.5rem_auto] sm:items-end">
                <input type="hidden" name="id" value={b.id} />
                <Field label={b.collector_id ? "Reassign collector" : "Assign collector"} htmlFor="collectorId">
                  <Select id="collectorId" name="collectorId" defaultValue={b.collector_id ? String(b.collector_id) : ""}>
                    <option value="">Nobody</option>
                    {collectors.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.name || c.email}
                        {c.role !== "collector" ? ` (${c.role})` : ""}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Date" htmlFor="collectionDate">
                  <Input id="collectionDate" name="collectionDate" type="date" defaultValue={b.collection_date ? new Date(b.collection_date).toISOString().slice(0, 10) : ""} />
                </Field>
                <Field label="Slot" htmlFor="collectionSlot">
                  <Select id="collectionSlot" name="collectionSlot" defaultValue={b.collection_slot}>
                    <option value="">Any time</option>
                    {COLLECTION_SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </Field>
                <SubmitButton variant="secondary">
                  <Truck className="h-4 w-4" aria-hidden /> Save
                </SubmitButton>
              </ActionForm>
            )}
          </Card>

          {/* Lab & report */}
          {!collectorOnly && (
            <Card id="report" title="Lab & report" actions={<ReportStatusBadge status={b.report_status} />}>
              <Facts
                items={[
                  { label: "Lab partner", value: b.partner_name ? <Link href={`/crm/partners/${b.partner_id}`} className="text-blue-700 hover:underline">{b.partner_name}</Link> : "Not assigned" },
                  ...(b.partner_id ? [{ label: "Lab response", value: <PartnerStatusBadge status={b.partner_status} /> }] : []),
                  ...(b.partner_reject_reason ? [{ label: "Rejected because", value: b.partner_reject_reason, wide: true }] : []),
                  ...(b.sample_received_at ? [{ label: "Sample received", value: dateTime(b.sample_received_at) }] : []),
                  ...(b.report_due_at ? [{ label: "Report due", value: <DueAt at={b.report_due_at} done={Boolean(b.report_ready_at)} /> }] : []),
                  ...(b.partner_notes ? [{ label: "Lab instructions / remarks", value: <span className="whitespace-pre-line">{b.partner_notes}</span>, wide: true }] : []),
                ]}
              />

              {canAssign && !cancelled && PIPELINE.indexOf(b.status) < PIPELINE.indexOf("report_ready") && (
                <ActionForm action={assignPartnerAction} className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-end">
                  <input type="hidden" name="id" value={b.id} />
                  <Field label={b.partner_id ? "Send to a different lab" : "Send to lab"} className="flex-1" htmlFor="partnerId">
                    <Select id="partnerId" name="partnerId" defaultValue={b.partner_id ? String(b.partner_id) : ""}>
                      <option value="">No lab</option>
                      {partners.map((p) => (
                        <option key={p.id} value={String(p.id)}>
                          {p.name}
                          {Number(p.serves_city) ? " ✓ serves this city" : p.city ? ` — ${p.city}` : ""}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <SubmitButton variant="secondary">
                    <FlaskConical className="h-4 w-4" aria-hidden /> {b.partner_id ? "Reassign" : "Send"}
                  </SubmitButton>
                </ActionForm>
              )}

              {/* Report versions */}
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="mb-2.5 text-[12.5px] font-semibold text-slate-700">Report</p>
                {b.reports.length ? (
                  <ul className="space-y-2">
                    {b.reports.map((r) => (
                      <li key={r.id} className="rounded-xl border border-slate-200 p-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-medium text-slate-900">
                              v{r.version} · {r.filename}
                            </p>
                            <p className="mt-0.5 text-[11.5px] text-slate-500">
                              Uploaded by {r.uploaded_by_name || "—"} · {dateTime(r.uploaded_at)}
                              {r.verified_at && ` · verified by ${r.verified_by_name || "—"} ${ago(r.verified_at)}`}
                              {r.sent_at && ` · sent by ${r.sent_by_name || "—"} via ${r.sent_via} ${ago(r.sent_at)}`}
                            </p>
                            {r.remarks && <p className="mt-1 text-[12.5px] text-slate-600">{r.remarks}</p>}
                          </div>
                          <Badge tone={{ uploaded: "amber", verified: "blue", sent: "emerald", rejected: "rose", replaced: "slate" }[r.status]}>{r.status}</Badge>
                        </div>
                        {canReports && (
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            <a href={`/api/crm/files/${r.file_id}`} target="_blank" rel="noreferrer" className={btn("secondary", "sm")}>
                              <Eye className="h-3.5 w-3.5" aria-hidden /> Preview
                            </a>
                            <a href={`/api/crm/files/${r.file_id}?download=1`} className={btn("secondary", "sm")}>
                              <Download className="h-3.5 w-3.5" aria-hidden /> Download
                            </a>
                            {canVerify && r.status === "uploaded" && (
                              <QuickAction action={verifyReportAction} fields={{ reportId: r.id }} size="sm" variant="soft">
                                <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Verify
                              </QuickAction>
                            )}
                            {canVerify && ["uploaded", "verified", "sent"].includes(r.status) && (
                              <FormModal action={sendReportAction} fields={{ reportId: r.id }} label={r.status === "sent" ? "Mark re-sent" : "Mark sent"} size="sm" variant={r.status === "verified" ? "primary" : "secondary"} title="Report delivered to the patient" submitLabel="Mark sent">
                                <Field label="Sent by" htmlFor={`via-${r.id}`}>
                                  <Select id={`via-${r.id}`} name="via" defaultValue="whatsapp">
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="email">Email</option>
                                    <option value="print">Printed copy</option>
                                    <option value="sms">SMS link</option>
                                    <option value="other">Other</option>
                                  </Select>
                                </Field>
                                <a
                                  href={waHref(b.patient_phone, `Hello ${b.patient_name}, your MedicoBharat report for booking ${bookingCode(b.id)} is ready.`)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-700 hover:underline"
                                >
                                  <MessageCircle className="h-4 w-4" aria-hidden /> Open WhatsApp chat with {phone(b.patient_phone)}
                                </a>
                              </FormModal>
                            )}
                            {canVerify && ["uploaded", "verified"].includes(r.status) && (
                              <ConfirmAction action={rejectReportAction} fields={{ reportId: r.id }} label="Send back" size="sm" variant="ghost" title="Send the report back to the lab" reason reasonLabel="What is wrong with it?" confirmLabel="Send back" />
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13px] text-slate-500">No report yet.</p>
                )}
                {canUpload && !cancelled && PIPELINE.indexOf(b.status) >= PIPELINE.indexOf("sample_collected") && (
                  <div className="mt-3">
                    <ReportUpload bookingId={b.id} replacing={Boolean(live)} />
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Payments */}
          {(has(user, "payments.view") || canPay) && (
            <Card
              title="Payments"
              actions={
                canPay && !cancelled ? (
                  <FormModal action={paymentAction} fields={{ id: b.id }} label="Record payment" size="sm" variant="soft" icon={<Wallet className="h-3.5 w-3.5" aria-hidden />} title="Record a payment" description={`${bookingCode(b.id)} · ${due > 0 ? `${rupees(due)} due` : "fully paid"}`} submitLabel="Record">
                    <PaymentFields due={due} />
                  </FormModal>
                ) : null
              }
            >
              {b.payments.length ? (
                <ul className="divide-y divide-slate-100">
                  {b.payments.map((p) => (
                    <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0">
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-medium text-slate-900">
                          {rupees(p.amount)} <span className="font-normal text-slate-500">· {paymentCode(p.id)}</span>
                        </p>
                        <p className="text-[11.5px] text-slate-500">
                          {dateTime(p.received_at)}
                          {p.collected_by_name ? ` · ${p.collected_by_name}` : ""}
                          {p.reference ? ` · ${p.reference}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <PaymentModeBadge mode={p.mode} />
                        <Badge tone={TXN_STATUS[p.status]?.tone}>{TXN_STATUS[p.status]?.label ?? p.status}</Badge>
                        {canPay && !p.gateway_payment_id && p.status === "pending" && (
                          <QuickAction action={paymentStatusAction} fields={{ paymentId: p.id, status: "paid" }} size="sm" variant="soft">
                            Mark paid
                          </QuickAction>
                        )}
                        {canPay && !p.gateway_payment_id && p.status !== "void" && (
                          <ConfirmAction action={paymentStatusAction} fields={{ paymentId: p.id, status: "void" }} label="Void" size="sm" variant="ghost" title="Void this payment?" body="It stays on record, marked void, and no longer counts as paid." reason confirmLabel="Void" />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState compact icon={<Wallet className="h-5 w-5" />} title="No payment recorded" hint={due > 0 ? `${rupees(due)} is due.` : null} />
              )}
              {b.refunds.length > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="mb-1.5 text-[12px] font-semibold text-slate-600">Refunds</p>
                  {b.refunds.map((r) => (
                    <p key={r.id} className="text-[12.5px] text-slate-600">
                      {rupees(r.amount)} · {r.status} · {r.reason || "—"} · {date(r.created_at)}
                    </p>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Side column */}
        <div className="space-y-5">
          {!collectorOnly && (
            <Card title="Customer">
              <Facts
                cols={1}
                items={[
                  {
                    label: "Profile",
                    value: has(user, "customers.view") ? (
                      <Link href={`/crm/customers/${b.customer_id}`} className="text-blue-700 hover:underline">
                        {b.customer_name} · {customerCode(b.customer_id)}
                      </Link>
                    ) : (
                      b.customer_name
                    ),
                  },
                  { label: "Mobile", value: phone(b.patient_phone) },
                  ...(b.customer_email ? [{ label: "Email", value: b.customer_email }] : []),
                  ...(b.lead_id ? [{ label: "From lead", value: <Link href={`/crm/leads/${b.lead_id}`} className="text-blue-700 hover:underline">View lead</Link> }] : []),
                  ...(b.order_id ? [{ label: "Website order", value: `#${b.order_id}` }] : []),
                  { label: "Created by", value: b.created_by_name || (b.source === "website" ? "Website" : "—") },
                  { label: "Last updated", value: `${dateTime(b.updated_at)}${b.updated_by_name ? ` · ${b.updated_by_name}` : ""}` },
                ]}
              />
            </Card>
          )}

          {b.notes && !collectorOnly && (
            <Card title="Internal notes">
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-700">{b.notes}</p>
            </Card>
          )}

          <Card title="Activity" description="Every change, who made it and when.">
            {(canManage || canCollect) && (
              <ActionForm action={noteAction} reset className="mb-4 space-y-2">
                <input type="hidden" name="id" value={b.id} />
                <Textarea name="body" rows={2} maxLength={2000} placeholder="Add a note — call outcome, customer request…" aria-label="Note" required />
                <SubmitButton size="sm" variant="secondary">
                  Add note
                </SubmitButton>
              </ActionForm>
            )}
            <Timeline items={timeline} empty={<p className="text-[13px] text-slate-500">Nothing yet.</p>} />
          </Card>

          {user.role === "owner" && (
            <ConfirmAction
              action={archiveBookingAction}
              fields={{ id: b.id }}
              label="Delete booking"
              variant="ghost"
              className="w-full text-slate-500"
              title={`Delete ${bookingCode(b.id)}?`}
              body="It disappears from every list and report. The record and its history are kept and it can be restored from the activity log."
              confirmLabel="Delete"
            />
          )}
        </div>
      </div>
    </>
  );
}

function Row({ label, value, strong = false, tone = "" }) {
  return (
    <div className={`flex justify-between gap-3 ${tone}`}>
      <dt className={strong ? "font-semibold text-slate-900" : "text-slate-500"}>{label}</dt>
      <dd className={`tabular-nums ${strong ? "font-semibold text-slate-900" : ""}`}>{value}</dd>
    </div>
  );
}

function DueAt({ at, done }) {
  const late = !done && isPast(at);
  return (
    <span className={late ? "font-semibold text-rose-700" : ""}>
      {dateTime(at)} {late && <Badge tone="rose">Delayed</Badge>}
    </span>
  );
}

/** The single most likely next step, as the primary button. */
function NextStep({ b, live }) {
  const step = (status, label, variant = "primary") => (
    <QuickAction action={statusAction} fields={{ id: b.id, status }} variant={variant}>
      {label}
    </QuickAction>
  );
  const lab = (stage, label) => (
    <QuickAction action={labProgressAction} fields={{ id: b.id, stage }} variant="primary">
      {label}
    </QuickAction>
  );
  switch (b.status) {
    case "booked":
      return step("confirmed", "Confirm booking");
    case "confirmed":
      return b.collector_id ? step("collection_assigned", "Collection assigned") : <a href="#collection" className={btn("primary")}>Assign collector ↓</a>;
    case "collection_assigned":
      return step("sample_collected", "Mark sample collected", "success");
    case "sample_collected":
      return lab("sample_received", "Mark received by lab");
    case "sample_received":
      return lab("processing", "Mark processing");
    case "processing":
      return live ? step("report_ready", "Report ready") : <a href="#report" className={btn("primary")}>Upload report ↓</a>;
    case "report_ready":
      return <a href="#report" className={btn("primary")}>Verify & send report ↓</a>;
    case "report_delivered":
      return step("completed", "Mark completed", "success");
    default:
      return null;
  }
}

/** Manual status change: any later stage, or one step back. */
function MoveTo({ b }) {
  if (b.status === "cancelled" || b.status === "completed") return null;
  const at = PIPELINE.indexOf(b.status);
  const options = PIPELINE.filter((s, i) => i !== at && i >= at - 1);
  return (
    <FormModal action={statusAction} fields={{ id: b.id }} label="Move to…" variant="secondary" title="Change status" description={`Now: ${BOOKING_STATUS[b.status].label}. Forward to any stage, or back one step to correct a mistake.`} submitLabel="Change status" modalSize="sm">
      <Field label="New status" htmlFor="status">
        <Select id="status" name="status" defaultValue={options.find((s) => PIPELINE.indexOf(s) > at) ?? options[0]}>
          {options.map((s) => (
            <option key={s} value={s}>
              {BOOKING_STATUS[s].label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Reason (optional)" htmlFor="reason">
        <Input id="reason" name="reason" maxLength={300} />
      </Field>
    </FormModal>
  );
}

function PaymentFields({ due }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Amount" required htmlFor="amount">
          <Input id="amount" name="amount" inputMode="decimal" required defaultValue={due > 0 ? due : ""} />
        </Field>
        <Field label="Mode" required htmlFor="mode">
          <Select id="mode" name="mode" defaultValue="upi">
            {PAYMENT_MODES.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Status" htmlFor="pstatus">
          <Select id="pstatus" name="status" defaultValue="paid">
            <option value="paid">Received</option>
            <option value="pending">Pending (promised)</option>
            <option value="failed">Failed</option>
          </Select>
        </Field>
        <Field label="Received at" htmlFor="receivedAt">
          <Input id="receivedAt" name="receivedAt" type="datetime-local" />
        </Field>
      </div>
      <Field label="Transaction ID / UTR" htmlFor="reference">
        <Input id="reference" name="reference" maxLength={120} />
      </Field>
      <Field label="Notes" htmlFor="pnotes">
        <Input id="pnotes" name="notes" maxLength={500} />
      </Field>
    </>
  );
}

/* ── The lab partner's view of an order ─────────────────────────────── */

async function PartnerView({ b, user }) {
  const history = await recordHistory(user, "bookings", b.id);
  const live = b.reports.find((r) => ["uploaded", "verified", "sent"].includes(r.status));
  const accepted = b.partner_status === "accepted";
  const at = PIPELINE.indexOf(b.status);

  return (
    <>
      <PageHeader
        eyebrow={`Order ${bookingCode(b.id)}`}
        title={b.patient_name}
        description={[b.age && `${b.age} years`, b.gender, b.city].filter(Boolean).join(" · ")}
        back={{ href: "/crm/bookings", label: "Orders" }}
      />

      <section className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <PartnerStatusBadge status={b.partner_status} />
          <BookingStatusBadge status={b.status} />
          <ReportStatusBadge status={b.report_status} />
        </div>

        {b.status === "cancelled" ? (
          <Notice tone="rose" title="MedicoBharat cancelled this order">
            No further work is needed.
          </Notice>
        ) : b.partner_status === "pending" ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <QuickAction action={partnerRespondAction} fields={{ id: b.id, decision: "accept" }} variant="success" size="lg">
              <CheckCircle2 className="h-5 w-5" aria-hidden /> Accept order
            </QuickAction>
            <ConfirmAction action={partnerRespondAction} fields={{ id: b.id, decision: "reject" }} label="Reject" size="lg" title="Reject this order?" body="MedicoBharat will reassign it to another lab." reason reasonLabel="Why can you not take it?" confirmLabel="Reject order" />
          </div>
        ) : accepted ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {at >= PIPELINE.indexOf("sample_collected") && at < PIPELINE.indexOf("sample_received") && (
              <QuickAction action={labProgressAction} fields={{ id: b.id, stage: "sample_received" }} variant="primary" size="lg">
                Sample received
              </QuickAction>
            )}
            {at === PIPELINE.indexOf("sample_received") && (
              <QuickAction action={labProgressAction} fields={{ id: b.id, stage: "processing" }} variant="primary" size="lg">
                Start processing
              </QuickAction>
            )}
            {at < PIPELINE.indexOf("sample_collected") && (
              <p className="text-[13px] text-slate-600">Waiting for the sample to be collected. You will be notified when it is on its way.</p>
            )}
            {at >= PIPELINE.indexOf("report_ready") && <p className="text-[13px] text-emerald-700">Report submitted. Thank you.</p>}
          </div>
        ) : (
          <Notice tone="slate">You rejected this order: {b.partner_reject_reason}</Notice>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <Card title="Tests to run">
            <ul className="divide-y divide-slate-100">
              {b.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3 py-2.5 first:pt-0 text-[13.5px]">
                  <span className="font-medium text-slate-900">
                    {i.name}
                    {i.qty > 1 && ` × ${i.qty}`}
                  </span>
                  <span className="tabular-nums text-slate-600">{rupees(Number(i.partner_cost) * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-[14px] font-semibold">
              <span>Your amount</span>
              <span className="tabular-nums">{rupees(b.partner_cost)}</span>
            </div>
          </Card>

          <Card title="Report" actions={<ReportStatusBadge status={b.report_status} />}>
            {b.reports.length > 0 && (
              <ul className="mb-3 space-y-2">
                {b.reports.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3">
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-medium">v{r.version} · {r.filename}</p>
                      <p className="text-[11.5px] text-slate-500">
                        {dateTime(r.uploaded_at)} · {r.status}
                        {r.remarks ? ` · ${r.remarks}` : ""}
                      </p>
                    </div>
                    <a href={`/api/crm/files/${r.file_id}`} target="_blank" rel="noreferrer" className={btn("secondary", "sm")}>
                      <Eye className="h-3.5 w-3.5" aria-hidden /> View
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {accepted && b.status !== "cancelled" && at >= PIPELINE.indexOf("sample_collected") ? (
              <ReportUpload bookingId={b.id} replacing={Boolean(live)} />
            ) : (
              !b.reports.length && <p className="text-[13px] text-slate-500">You can upload the report once the order is accepted and the sample collected.</p>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Order details">
            <Facts
              cols={1}
              items={[
                { label: "Sent to you", value: dateTime(b.partner_assigned_at) },
                ...(b.collected_at ? [{ label: "Sample collected", value: dateTime(b.collected_at) }] : []),
                ...(b.sample_received_at ? [{ label: "Received by you", value: dateTime(b.sample_received_at) }] : []),
                ...(b.report_due_at ? [{ label: "Report due", value: <DueAt at={b.report_due_at} done={Boolean(b.report_ready_at)} /> }] : []),
                ...(b.partner_notes ? [{ label: "Instructions & remarks", value: <span className="whitespace-pre-line">{b.partner_notes}</span> }] : []),
              ]}
            />
            {accepted && b.status !== "cancelled" && (
              <ActionForm action={partnerRemarkAction} reset className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <input type="hidden" name="id" value={b.id} />
                <Textarea name="body" rows={2} maxLength={500} placeholder="Add a remark for MedicoBharat" aria-label="Remark" required />
                <SubmitButton size="sm" variant="secondary">
                  Add remark
                </SubmitButton>
              </ActionForm>
            )}
          </Card>
          <Card title="Activity">
            <Timeline
              items={history.map((h) => ({ id: h.id, title: h.summary, meta: `${h.user_name || "MedicoBharat"} · ${dateTime(h.created_at)}` }))}
              empty={<p className="text-[13px] text-slate-500">Nothing yet.</p>}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
