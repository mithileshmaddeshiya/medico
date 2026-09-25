import Link from "next/link";
import { Download, Phone, Plus, Users } from "lucide-react";

import { Badge, ButtonLink, DataTable, EmptyState, PageHeader, Pagination, btn, withParams } from "@/components/crm/ui";
import FilterBar, { ColumnToggle } from "@/components/crm/FilterBar";
import { customerCode } from "@/lib/crm/constants";
import { pageOf } from "@/lib/crm/filters";
import { date, phone, rupees, telHref } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import { customerFiltersFrom, listCustomers } from "@/lib/crm/stores/customers";
import { listCities } from "@/lib/crm/stores/lookups";

export const metadata = { title: "Customers" };
export const dynamic = "force-dynamic";

/**
 * Every customer — one per mobile number, from the website and from staff
 * alike — with what they have booked and spent. Filtered, sorted and
 * paginated in SQL; a card per customer on a phone.
 */
export default async function CustomersPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("customers.view", "/crm/customers");
  const filters = customerFiltersFrom(sp);
  const { limit, offset } = pageOf(sp);

  const [list, cities] = await Promise.all([listCustomers({ ...filters, limit, offset }), listCities({ includeInactive: true })]);

  const canManage = has(user, "customers.manage");
  const canExport = has(user, "export.data");
  const href = (changes) => withParams("/crm/customers", sp, changes);
  const filtered = Boolean(filters.search || filters.from || filters.cityId || filters.pending);

  const columns = [
    { key: "customer", label: "Customer", hideable: false },
    { key: "city", label: "City / area" },
    { key: "bookings", label: "Bookings", align: "right", sortKey: "bookings" },
    { key: "spent", label: "Total spent", align: "right", sortKey: "spent" },
    { key: "last", label: "Last booking", sortKey: "last" },
    { key: "pending", label: "Open" },
    { key: "added", label: "Added", sortKey: "newest" },
  ];

  return (
    <>
      <PageHeader
        title="Customers"
        description="One profile per mobile number — every booking, payment, call and report in one place."
        actions={
          <>
            {canExport && (
              <a href={withParams("/api/crm/export/customers", sp, { format: "xls", page: null })} className={btn("secondary")}>
                <Download className="h-4 w-4" aria-hidden /> Export
              </a>
            )}
            {canManage && (
              <ButtonLink href="/crm/customers/new" variant="primary">
                <Plus className="h-4 w-4" aria-hidden /> New customer
              </ButtonLink>
            )}
          </>
        }
      />

      <FilterBar
        search={{ placeholder: "Name, mobile, email or CU code" }}
        filters={[
          { name: "city", label: "City", options: cities.map((c) => ({ value: String(c.id), label: c.name })) },
          { name: "pending", label: "Open booking", options: [{ value: "1", label: "Has an open booking" }] },
          { name: "range", label: "Added any time", type: "range" },
        ]}
      >
        <ColumnToggle tableId="customers-table" columns={columns} />
      </FilterBar>

      <DataTable
        id="customers-table"
        columns={columns}
        rows={list.rows}
        rowHref={(c) => `/crm/customers/${c.id}`}
        sort={{ current: filters.sort, hrefFor: (k) => href({ sort: k === "newest" ? null : k, page: null }) }}
        cells={(c) => ({
          customer: (
            <span className="whitespace-nowrap">
              <span className="font-medium text-slate-900">{c.name}</span>
              <span className="block text-[11.5px] font-normal text-slate-500">
                {customerCode(c.id)} · {phone(c.phone)}
              </span>
            </span>
          ),
          city: (
            <span className="whitespace-nowrap">
              {c.city_name || c.city || <span className="text-slate-400">—</span>}
              {c.area && <span className="block text-[11.5px] text-slate-500">{c.area}</span>}
            </span>
          ),
          bookings: Number(c.bookings_count),
          spent: rupees(c.total_spent),
          last: c.last_booking ? <span className="whitespace-nowrap">{date(c.last_booking)}</span> : <span className="text-slate-400">Never</span>,
          pending: Number(c.pending_bookings) ? <Badge tone="amber">{Number(c.pending_bookings)} open</Badge> : <span className="text-slate-400">—</span>,
          added: <span className="whitespace-nowrap">{date(c.created_at)}</span>,
        })}
        card={(c) => (
          <div>
            <div className="flex items-start justify-between gap-3">
              <Link href={`/crm/customers/${c.id}`} className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-500">{customerCode(c.id)}</p>
                <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{c.name}</p>
                <p className="mt-0.5 text-[13px] text-slate-600">
                  {phone(c.phone)}
                  {c.city_name || c.city ? ` · ${c.city_name || c.city}` : ""}
                </p>
              </Link>
              <a href={telHref(c.phone)} className={btn("secondary", "md", "h-10 w-10 shrink-0 px-0")} aria-label={`Call ${c.name}`}>
                <Phone className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <Badge tone="slate" dot={false}>
                {Number(c.bookings_count)} booking{Number(c.bookings_count) === 1 ? "" : "s"}
              </Badge>
              <Badge tone="emerald" dot={false}>
                {rupees(c.total_spent)} spent
              </Badge>
              {Number(c.pending_bookings) > 0 && <Badge tone="amber">{Number(c.pending_bookings)} open</Badge>}
            </div>
          </div>
        )}
        empty={
          <EmptyState
            icon={<Users className="h-5 w-5" />}
            title={filtered ? "No customers match these filters" : "No customers yet"}
            hint={
              filtered
                ? "Try another spelling, a wider date range, or clear the filters."
                : "Customers are created automatically with every booking. Add one by hand for an enquiry that has not booked yet."
            }
            action={
              canManage ? (
                <ButtonLink href="/crm/customers/new" variant="primary">
                  <Plus className="h-4 w-4" aria-hidden /> New customer
                </ButtonLink>
              ) : null
            }
          />
        }
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(p) => href({ page: p > 1 ? p : null })} />}
      />
    </>
  );
}
