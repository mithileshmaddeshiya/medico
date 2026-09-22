import Link from "next/link";

import {
  ButtonLink,
  Empty,
  Input,
  PageHeader,
  Pill,
  rupees,
  Row,
  Stat,
  StatusPill,
  Table,
  Tabs,
  Td,
  when,
} from "@/components/admin/ui";
import { requireUser } from "@/lib/admin/guard";
import { dashboardStats, listOrders, ORDER_STATUSES } from "@/lib/admin/opsStore";

export const metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

/**
 * Every checkout, online and pay-at-collection.
 *
 * ── THE TWO TOTALS ARE KEPT APART ────────────────────────────────────────
 * "Collected" is paid orders. "Expected" is what pay-at-collection orders
 * come to — money somebody intends to hand over at the door, which is not the
 * same thing and is never added into the first figure. Reporting intent as
 * income is how a number ends up in front of someone who acts on it.
 */
export default async function OrdersPage({ searchParams }) {
  await requireUser("/admin/orders");

  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : null;
  const method = typeof params.method === "string" ? params.method : null;
  const search = typeof params.q === "string" ? params.q : "";
  const page = Math.max(1, Number(params.page) || 1);

  const [{ rows, total }, stats] = await Promise.all([
    listOrders({
      status,
      method,
      search,
      includeArchived: status === "archived",
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    dashboardStats(),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="What the server actually charged, priced from its own list at the moment of checkout."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Collected"
          value={rupees(stats.orders.revenue)}
          sub={`${Number(stats.orders.paid ?? 0)} paid orders, all time`}
          tone="emerald"
        />
        <Stat
          label="Expected at collection"
          value={rupees(stats.orders.expected)}
          sub={`${Number(stats.orders.at_collection ?? 0)} waiting — not counted as revenue until paid`}
        />
        <Stat label="Orders" value={Number(stats.orders.total ?? 0)} sub="Every checkout ever started" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          basePath="/admin/orders"
          active={status}
          tabs={[
            { key: null, label: "All" },
            ...ORDER_STATUSES.map((s) => ({ key: s.key, label: s.label })),
            { key: "archived", label: "Archived" },
          ]}
        />

        <form className="flex items-center gap-2" action="/admin/orders">
          {status && <input type="hidden" name="status" value={status} />}
          <Input
            name="q"
            defaultValue={search}
            placeholder="Name, phone or order id"
            className="w-52"
            aria-label="Search orders"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-3 py-2 text-[13px] font-semibold text-white hover:bg-slate-800"
          >
            Search
          </button>
        </form>
      </div>

      {rows.length ? (
        <Table head={["#", "Customer", "City", "Lines", "Amount", "Pay", "Status", "When", ""]}>
          {rows.map((order) => (
            <Row key={order.id} muted={order.status === "archived"}>
              <Td className="font-mono text-[12px] text-slate-500">{order.id}</Td>

              <Td className="font-semibold text-slate-900">
                <Link href={`/admin/orders/${order.id}`} className="hover:text-emerald-700">
                  {order.customer_name}
                </Link>
                <a
                  href={`tel:+91${order.customer_phone}`}
                  className="ml-2 font-normal text-emerald-700 hover:text-emerald-800"
                >
                  {order.customer_phone}
                </a>
              </Td>

              <Td>{order.customer_city}</Td>
              <Td>{order.line_count}</Td>

              <Td className="font-semibold text-slate-900">
                {rupees(order.amount)}
                {Number(order.mrp_total) > Number(order.amount) && (
                  <span className="ml-1.5 text-[11.5px] font-normal text-slate-400 line-through">
                    {rupees(order.mrp_total)}
                  </span>
                )}
              </Td>

              <Td>
                <Pill tone={order.payment_method === "online" ? "indigo" : "sky"}>
                  {order.payment_method === "online" ? "online" : "at door"}
                </Pill>
              </Td>

              <Td>
                <StatusPill status={order.status} />
              </Td>

              <Td className="whitespace-nowrap text-slate-500">
                {when(order.created_at, { time: true })}
              </Td>

              <Td>
                <ButtonLink href={`/admin/orders/${order.id}`} className="px-2 py-1 text-[12px]">
                  Open
                </ButtonLink>
              </Td>
            </Row>
          ))}
        </Table>
      ) : (
        <Empty
          title={status || search ? "Nothing matches" : "No orders yet"}
          hint={
            status || search
              ? "Try another status or clear the search."
              : "Checkouts appear here the moment one is started — including the ones that never get paid, which is the useful part."
          }
          action={(status || search) && <ButtonLink href="/admin/orders">Clear filters</ButtonLink>}
        />
      )}

      {pages > 1 && (
        <nav className="flex items-center justify-center gap-2" aria-label="Pages">
          {page > 1 && <ButtonLink href={href(params, page - 1)}>Previous</ButtonLink>}
          <span className="text-[12.5px] text-slate-500">
            Page {page} of {pages}
          </span>
          {page < pages && <ButtonLink href={href(params, page + 1)}>Next</ButtonLink>}
        </nav>
      )}
    </>
  );
}

function href(params, page) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...params, page })) {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  }
  return `/admin/orders?${query}`;
}
