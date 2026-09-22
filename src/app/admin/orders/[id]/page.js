import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";

import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import DeleteButton from "@/components/admin/DeleteButton";
import {
  ButtonLink,
  Card,
  Field,
  Input,
  Note,
  PageHeader,
  Pill,
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
import { getOrder, ORDER_STATUSES } from "@/lib/admin/opsStore";

import { deleteRecord, noteRecord } from "../../actions";
import { moveOrder } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Order #${id}` };
}

export default async function OrderPage({ params }) {
  await requireUser("/admin/orders");

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const history = await recentAudit({ entity: "orders", entityId: id, limit: 20 });
  const saved = Number(order.mrp_total) - Number(order.amount);

  return (
    <>
      <PageHeader
        title={`Order #${order.id}`}
        subtitle={`${order.customer_name} · ${when(order.created_at, { time: true })}`}
      >
        <a
          href={`tel:+91${order.customer_phone}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-[13px] font-semibold text-white hover:bg-emerald-700"
        >
          <Phone className="h-4 w-4" /> {order.customer_phone}
        </a>
        <ButtonLink href="/admin/orders">Back</ButtonLink>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Card title="What was ordered" subtitle="Priced by the server, not by the browser.">
            <Table head={["Test", "Qty", "Each", "MRP", "Line total"]}>
              {order.items.map((item) => (
                <Row key={item.id}>
                  <Td className="font-medium text-slate-900">
                    {item.test_name}
                    <span className="ml-2 font-mono text-[11px] text-slate-400">{item.test_id}</span>
                  </Td>
                  <Td>{item.qty}</Td>
                  <Td>{rupees(item.unit_price)}</Td>
                  <Td className="text-slate-400">{rupees(item.unit_mrp)}</Td>
                  <Td className="font-semibold text-slate-900">{rupees(item.line_total)}</Td>
                </Row>
              ))}
            </Table>

            <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-slate-500">MRP total</dt>
                <dd className="text-slate-500 line-through">{rupees(order.mrp_total)}</dd>
              </div>
              {saved > 0 && (
                <div className="flex justify-between">
                  <dt className="text-slate-600">Discount</dt>
                  <dd className="font-semibold text-emerald-700">−{rupees(saved)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-100 pt-2 text-[15px]">
                <dt className="font-bold text-slate-900">Charged</dt>
                <dd className="font-extrabold text-slate-900">{rupees(order.amount)}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Customer">
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Detail label="Name" value={order.customer_name} />
              <Detail
                label="Phone"
                value={
                  <a
                    href={`tel:+91${order.customer_phone}`}
                    className="text-emerald-700 hover:text-emerald-800"
                  >
                    +91 {order.customer_phone}
                  </a>
                }
              />
              <Detail label="City" value={order.customer_city} />
              <Detail label="Price list used" value={order.price_list_city || "default"} />
              <Detail label="Address" value={order.customer_address || "—"} wide />
              {order.lead_id && (
                <Detail
                  label="Lead"
                  value={
                    <Link href={`/admin/leads/${order.lead_id}`} className="text-emerald-700 hover:text-emerald-800">
                      #{order.lead_id}
                    </Link>
                  }
                />
              )}
              {order.cart_id && <Detail label="Cart" value={<code className="text-[11.5px]">{order.cart_id}</code>} />}
            </dl>
          </Card>

          {order.payment_method === "online" && (
            <Card title="Payment">
              <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <Detail label="Razorpay order" value={<code className="text-[12px]">{order.razorpay_order_id || "—"}</code>} />
                <Detail label="Razorpay payment" value={<code className="text-[12px]">{order.razorpay_payment_id || "—"}</code>} />
                <Detail label="Paid at" value={when(order.paid_at, { time: true })} />
                <Detail label="Currency" value={order.currency} />
              </dl>
            </Card>
          )}

          <Card title="Notes">
            <ActionForm action={noteRecord} reset className="space-y-3">
              <input type="hidden" name="entity" value="order" />
              <input type="hidden" name="id" value={order.id} />
              <Textarea
                name="body"
                rows={3}
                required
                placeholder="Refund of ₹400 sent by UPI on 12 Sep — customer cancelled one of the two packages."
              />
              <SubmitButton pendingLabel="Adding…">Add note</SubmitButton>
            </ActionForm>

            {order.notes.length > 0 && (
              <ul className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                {order.notes.map((note) => (
                  <li key={note.id} className="rounded-xl bg-slate-50 px-3.5 py-3">
                    <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-700">{note.body}</p>
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
          <Card title="Status">
            <div className="mb-3 flex items-center gap-2">
              <StatusPill status={order.status} />
              <Pill tone={order.payment_method === "online" ? "indigo" : "sky"}>
                {order.payment_method === "online" ? "paid online" : "pay at collection"}
              </Pill>
            </div>

            <ActionForm action={moveOrder} className="space-y-3">
              <input type="hidden" name="id" value={order.id} />
              <Field label="Change to">
                <Select name="status" defaultValue={order.status}>
                  {ORDER_STATUSES.filter((s) => s.key !== "paid").map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Why" hint="Goes into the history beside the change.">
                <Input name="reason" placeholder="Customer cancelled on the phone" />
              </Field>
              <SubmitButton className="w-full">Update</SubmitButton>
            </ActionForm>

            <div className="mt-4">
              <Note tone="warn" title="“Paid” is not in that list">
                An order becomes paid when a Razorpay signature verifies, and never because someone
                ticked a box here. If money arrived another way — UPI, cash at the door — record it
                as a note, which is dated and attributed. That keeps this row an accurate account of
                what the payment gateway actually did.
              </Note>
            </div>
          </Card>

          <Card title="History">
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
              <p className="text-[12.5px] text-slate-500">Nothing has changed since checkout.</p>
            )}
          </Card>

          <Card title="Archive">
            <p className="mb-3 text-[12.5px] leading-relaxed text-slate-600">
              Takes the order out of the working lists and out of the revenue figures. The row, its
              lines and its payment ids all stay exactly as they are — this is for a duplicate or a
              test checkout, not for an order that went wrong.
            </p>
            <DeleteButton action={deleteRecord} entity="orders" id={order.id} label="order" />
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
