import { notFound } from "next/navigation";

import {
  ButtonLink,
  Card,
  PageHeader,
  Pill,
  Row,
  StatusPill,
  Table,
  Td,
  rupees,
  when,
} from "@/components/admin/ui";
import { requireUser } from "@/lib/admin/guard";
import { getCart } from "@/lib/admin/opsStore";

export const dynamic = "force-dynamic";

export const metadata = { title: "Cart" };

/**
 * One cart, and every tap that built it.
 *
 * `cart_items` holds the CURRENT contents — a row with qty 0 was in the cart
 * and was taken out, which is why removed items still appear. `cart_events` is
 * the sequence: add, increment, decrement, remove, clear, checkout. Read
 * together they say not just what someone wanted but where they changed their
 * mind, which is the part a total cannot tell you.
 */
export default async function CartPage({ params }) {
  await requireUser("/admin/carts");

  const { id } = await params;
  const cart = await getCart(id);
  if (!cart) notFound();

  const live = cart.items.filter((item) => item.qty > 0);
  const removed = cart.items.filter((item) => item.qty === 0);
  const total = live.reduce((sum, item) => sum + Number(item.unit_price ?? 0) * item.qty, 0);

  return (
    <>
      <PageHeader
        title="Cart"
        subtitle={
          <>
            <code className="text-[12px]">{cart.id}</code> · started{" "}
            {when(cart.created_at, { time: true })}
          </>
        }
      >
        <ButtonLink href="/admin/carts">Back</ButtonLink>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <StatusPill status={cart.status} />
        {cart.city && <Pill tone="sky">{cart.city}</Pill>}
        {cart.page_path && (
          <Pill tone="slate">
            <span className="font-mono">{cart.page_path}</span>
          </Pill>
        )}
      </div>

      <Card title="In the cart now">
        {live.length ? (
          <>
            <Table head={["Test", "Qty", "Each", "Line"]}>
              {live.map((item) => (
                <Row key={item.test_id}>
                  <Td className="font-medium text-slate-900">
                    {item.test_name}
                    <span className="ml-2 font-mono text-[11px] text-slate-400">{item.test_id}</span>
                  </Td>
                  <Td>{item.qty}</Td>
                  <Td>{rupees(item.unit_price)}</Td>
                  <Td className="font-semibold">{rupees(Number(item.unit_price ?? 0) * item.qty)}</Td>
                </Row>
              ))}
            </Table>
            <p className="mt-3 text-right text-[15px] font-extrabold text-slate-900">
              {rupees(total)}
            </p>
          </>
        ) : (
          <p className="text-[13px] text-slate-500">Empty.</p>
        )}
      </Card>

      {removed.length > 0 && (
        <Card
          title="Taken back out"
          subtitle="Still recorded, because what somebody removed is as informative as what they kept."
        >
          <ul className="flex flex-wrap gap-2">
            {removed.map((item) => (
              <li
                key={item.test_id}
                className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-600"
              >
                {item.test_name} · {rupees(item.unit_price)}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="Every tap" subtitle="Newest first.">
        {cart.events.length ? (
          <Table head={["Action", "Test", "From", "To", "Page", "When"]}>
            {cart.events.map((event) => (
              <Row key={event.id}>
                <Td>
                  <StatusPill status={event.action} />
                </Td>
                <Td className="font-mono text-[11.5px] text-slate-600">{event.test_id ?? "—"}</Td>
                <Td>{event.qty_before ?? "—"}</Td>
                <Td>{event.qty_after ?? "—"}</Td>
                <Td className="max-w-[14rem] truncate font-mono text-[11.5px] text-slate-500">
                  {event.page_path ?? "—"}
                </Td>
                <Td className="whitespace-nowrap text-slate-500">
                  {when(event.created_at, { time: true })}
                </Td>
              </Row>
            ))}
          </Table>
        ) : (
          <p className="text-[13px] text-slate-500">No events recorded.</p>
        )}
      </Card>
    </>
  );
}
