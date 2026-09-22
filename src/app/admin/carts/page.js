import Link from "next/link";

import {
  ButtonLink,
  Empty,
  Note,
  PageHeader,
  Row,
  StatusPill,
  Table,
  Tabs,
  Td,
  rupees,
  when,
} from "@/components/admin/ui";
import { requireUser } from "@/lib/admin/guard";
import { listCarts } from "@/lib/admin/opsStore";

export const metadata = { title: "Carts" };
export const dynamic = "force-dynamic";

/**
 * Carts, including the ones nobody finished.
 *
 * This is the most directly actionable list in the panel and the least
 * obvious. Someone picked three tests, saw the total and stopped — a warm
 * prospect with a known basket. There is no phone number attached, which is
 * exactly why the pattern is worth reading: a test that is repeatedly added
 * and then abandoned is usually priced wrong, and a cart cleared at the same
 * step every time is a step that is broken.
 */
export default async function CartsPage({ searchParams }) {
  await requireUser("/admin/carts");

  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "active";
  const carts = await listCarts({ status: status === "all" ? null : status, limit: 100 });

  return (
    <>
      <PageHeader
        title="Carts"
        subtitle="Every basket the site has seen, finished or not."
      />

      <Tabs
        basePath="/admin/carts"
        active={status}
        tabs={[
          { key: "active", label: "Still open" },
          { key: "checked_out", label: "Checked out" },
          { key: "cleared", label: "Emptied" },
          { key: "all", label: "All" },
        ]}
      />

      {status === "active" && (
        <Note title="An open cart is not a lead — and that is the point">
          Nobody here has given a phone number, so there is no one to call. What this list is for is
          the pattern: a test that is added and abandoned again and again is usually priced wrong,
          and a cart that is emptied at the same point every time is a step that is not working.
          Open one to see the tap-by-tap trail.
        </Note>
      )}

      {carts.length ? (
        <Table head={["Cart", "City", "Items", "Value", "Taps", "Status", "Last touched", ""]}>
          {carts.map((cart) => (
            <Row key={cart.id}>
              <Td className="font-mono text-[11.5px] text-slate-500">{cart.id.slice(0, 8)}…</Td>
              <Td>{cart.city ?? "—"}</Td>
              <Td>{Number(cart.items) || 0}</Td>
              <Td className="font-semibold text-slate-900">{rupees(cart.value)}</Td>
              <Td className="text-slate-500">{Number(cart.taps) || 0}</Td>
              <Td>
                <StatusPill status={cart.status} />
              </Td>
              <Td className="whitespace-nowrap text-slate-500">{when(cart.updated_at, { time: true })}</Td>
              <Td>
                <ButtonLink href={`/admin/carts/${cart.id}`} className="px-2 py-1 text-[12px]">
                  Open
                </ButtonLink>
              </Td>
            </Row>
          ))}
        </Table>
      ) : (
        <Empty
          title="Nothing here"
          hint="Carts appear as soon as somebody adds their first test on a city page."
        />
      )}
    </>
  );
}
