import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";

import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import DeleteButton from "@/components/admin/DeleteButton";
import {
  ButtonLink,
  Card,
  Field,
  Input,
  PageHeader,
  rupees,
  Row,
  Select,
  StatusPill,
  Table,
  Td,
  Textarea,
  when,
} from "@/components/admin/ui";
import { recentAudit } from "@/lib/admin/audit";
import { requireUser } from "@/lib/admin/guard";
import { getLead, LEAD_STAGES } from "@/lib/admin/opsStore";

import { deleteRecord, noteRecord } from "../../actions";
import { assignLead, moveLead } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const lead = await getLead(id);
  return { title: lead ? `${lead.name} · lead` : "Lead" };
}

/**
 * One lead, everything known about it, and the two things the panel may change
 * about it: where it is in the pipeline and who is chasing it.
 *
 * The customer's own details are shown as text, not inputs. See the note in
 * ../actions.js for why — a form submission is evidence, and evidence that can
 * be quietly retyped is not evidence.
 */
export default async function LeadPage({ params }) {
  await requireUser("/admin/leads");

  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const history = await recentAudit({ entity: "leads", entityId: id, limit: 20 });
  const whatsapp = `https://wa.me/91${lead.phone}`;

  return (
    <>
      <PageHeader title={lead.name} subtitle={`Lead #${lead.id} · ${when(lead.created_at, { time: true })}`}>
        <a
          href={`tel:+91${lead.phone}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-[13px] font-semibold text-white hover:bg-emerald-700"
        >
          <Phone className="h-4 w-4" /> Call {lead.phone}
        </a>
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <ButtonLink href="/admin/leads">Back</ButtonLink>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Card title="What they submitted">
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Detail label="Name" value={lead.name} />
              <Detail
                label="Phone"
                value={
                  <a href={`tel:+91${lead.phone}`} className="text-emerald-700 hover:text-emerald-800">
                    +91 {lead.phone}
                  </a>
                }
              />
              <Detail label="City" value={lead.city} />
              <Detail label="Source" value={sourceLabel(lead.source)} />
              <Detail label="Address" value={lead.address || "—"} wide />
              <Detail label="Tests asked for" value={lead.test || "—"} wide />
            </dl>

            <p className="mt-5 border-t border-slate-100 pt-4 text-[12px] leading-relaxed text-slate-500">
              These are the words the customer typed. They are deliberately not editable — a
              correction belongs in a note below, where it is dated and attributed, rather than
              overwriting what was actually submitted.
            </p>
          </Card>

          {lead.orders.length > 0 && (
            <Card
              title="Order"
              subtitle="Priced by the server from its own list at checkout — not from anything the browser sent."
            >
              {lead.orders.map((order) => (
                <div key={order.id} className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-[14px] font-bold text-slate-900 hover:text-emerald-700"
                    >
                      Order #{order.id}
                    </Link>
                    <div className="flex items-center gap-2">
                      <StatusPill status={order.status} />
                      <span className="text-[15px] font-extrabold text-slate-900">
                        {rupees(order.amount)}
                      </span>
                    </div>
                  </div>

                  {Array.isArray(order.items) && order.items.length > 0 && (
                    <Table head={["Test", "Qty", "Each", "Total"]}>
                      {order.items.map((item, i) => (
                        <Row key={i}>
                          <Td className="font-medium text-slate-900">{item.name}</Td>
                          <Td>{item.qty}</Td>
                          <Td>{rupees(item.price)}</Td>
                          <Td className="font-semibold">{rupees(item.total)}</Td>
                        </Row>
                      ))}
                    </Table>
                  )}
                </div>
              ))}
            </Card>
          )}

          <Card
            title="Notes"
            subtitle="What was said on the call. Append-only and attributed — a note is a record, not a scratchpad."
          >
            <ActionForm action={noteRecord} reset className="space-y-3">
              <input type="hidden" name="entity" value="lead" />
              <input type="hidden" name="id" value={lead.id} />
              <Textarea
                name="body"
                rows={3}
                required
                placeholder="Called at 4pm — asked to ring back after Tuesday, wants the full body checkup for both parents."
              />
              <SubmitButton pendingLabel="Adding…">Add note</SubmitButton>
            </ActionForm>

            {lead.notes.length > 0 && (
              <ul className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                {lead.notes.map((note) => (
                  <li key={note.id} className="rounded-xl bg-slate-50 px-3.5 py-3">
                    <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-700">
                      {note.body}
                    </p>
                    <p className="mt-1.5 text-[11.5px] text-slate-500">
                      {note.user_email} · {when(note.created_at, { time: true })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Stage">
            <ActionForm action={moveLead} className="space-y-3">
              <input type="hidden" name="id" value={lead.id} />
              <Field label="Where is this now?">
                <Select name="status" defaultValue={lead.status}>
                  {LEAD_STAGES.map((stage) => (
                    <option key={stage.key} value={stage.key}>
                      {stage.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <SubmitButton className="w-full">Update stage</SubmitButton>
            </ActionForm>
          </Card>

          <Card title="Follow-up">
            <ActionForm action={assignLead} className="space-y-3">
              <input type="hidden" name="id" value={lead.id} />
              <Field label="Who is handling it">
                <Input name="assignedTo" defaultValue={lead.assigned_to ?? ""} placeholder="Name" />
              </Field>
              <Field label="Call back on">
                <Input
                  name="followUpOn"
                  type="date"
                  defaultValue={lead.follow_up_on ? String(lead.follow_up_on).slice(0, 10) : ""}
                />
              </Field>
              <SubmitButton variant="secondary" className="w-full">
                Save
              </SubmitButton>
            </ActionForm>
          </Card>

          <Card title="History" subtitle="Every change to this lead.">
            {history.length ? (
              <ul className="space-y-2.5">
                {history.map((entry) => (
                  <li key={entry.id} className="text-[12px] leading-relaxed">
                    <p className="text-slate-700">{entry.summary}</p>
                    <p className="text-slate-400">
                      {entry.user_email || "system"} · {when(entry.created_at, { time: true })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12.5px] text-slate-500">No changes since it arrived.</p>
            )}
          </Card>

          <Card title="Remove">
            <p className="mb-3 text-[12.5px] leading-relaxed text-slate-600">
              Archiving hides this lead from the working lists. The row, the order it is attached to
              and this history all stay in the database — use it for a test submission or a
              duplicate, not for a lead that simply went cold. That is what the{" "}
              <strong className="font-semibold">Lost</strong> stage is for.
            </p>
            <DeleteButton
              action={deleteRecord}
              entity="leads"
              id={lead.id}
              label="lead"
              mode="delete"
            />
          </Card>
        </div>
      </div>
    </>
  );
}

function Detail({ label, value, wide = false }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-[11.5px] font-bold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-[13.5px] leading-relaxed text-slate-800">{value}</dd>
    </div>
  );
}

const sourceLabel = (source) =>
  ({
    form: "Enquiry form",
    cart_cod: "Cart — pay at collection",
    cart_online: "Cart — paid online",
  })[source] ?? source;
