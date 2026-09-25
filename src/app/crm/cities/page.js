import Link from "next/link";
import { MapPinned, Plus } from "lucide-react";

import FilterBar from "@/components/crm/FilterBar";
import { FormModal, QuickAction } from "@/components/crm/forms";
import { Badge, DataTable, EmptyState, Field, Input, Notice, PageHeader, Pagination, withParams } from "@/components/crm/ui";
import { pageOf } from "@/lib/crm/filters";
import { num, rupees } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import { CITY_STATUS, listServiceCities } from "@/lib/crm/stores/catalog";
import { ensureCitiesSeeded } from "@/lib/crm/stores/lookups";

import { cityFlagAction, createCityAction } from "./actions";

export const metadata = { title: "Cities" };
export const dynamic = "force-dynamic";

/**
 * Operational cities: where MedicoBharat takes bookings and runs home
 * collection. A city added here appears in every city picker (bookings,
 * customers, partners, filters) at once — they all read service_cities.
 */
export default async function CitiesPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("catalog.view", "/crm/cities");
  await ensureCitiesSeeded();
  const { limit, offset } = pageOf(sp);
  const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
  const filters = { search: one(sp.q).slice(0, 80), status: one(sp.status) || null };
  const list = await listServiceCities({ ...filters, limit, offset });

  const canManage = has(user, "catalog.manage");
  const showRevenue = has(user, "revenue.view");
  const href = (changes) => withParams("/crm/cities", sp, changes);

  const columns = [
    { key: "name", label: "City", hideable: false },
    { key: "status", label: "Status" },
    { key: "collection", label: "Home collection" },
    { key: "areas", label: "Areas", align: "right" },
    { key: "partners", label: "Partners", align: "right" },
    { key: "bookings", label: "Bookings 30d", align: "right" },
    ...(showRevenue ? [{ key: "revenue", label: "Revenue 30d", align: "right" }] : []),
    { key: "leads", label: "Leads 30d", align: "right" },
    ...(canManage ? [{ key: "actions", label: "" }] : []),
  ];

  const toggles = (c) =>
    canManage && (
      <span className="flex flex-wrap gap-1.5">
        <QuickAction action={cityFlagAction} fields={{ id: c.id, flag: "status", value: c.status === "active" ? "inactive" : "active" }} size="sm">
          {c.status === "active" ? "Deactivate" : "Activate"}
        </QuickAction>
        <QuickAction action={cityFlagAction} fields={{ id: c.id, flag: "collection", value: c.collection_available ? "0" : "1" }} size="sm" variant="ghost">
          {c.collection_available ? "Pause collection" : "Resume collection"}
        </QuickAction>
      </span>
    );

  const addCity = canManage && (
    <FormModal
      action={createCityAction}
      label="Add city"
      icon={<Plus className="h-4 w-4" aria-hidden />}
      title="Add a service city"
      description="It appears in every city picker in the CRM straight away."
      submitLabel="Add city"
    >
      <Field label="City name" required htmlFor="city-name">
        <Input id="city-name" name="name" required maxLength={80} placeholder="e.g. Gorakhpur" />
      </Field>
      <Field label="State" htmlFor="city-state">
        <Input id="city-state" name="state" defaultValue="Uttar Pradesh" maxLength={80} />
      </Field>
      <label className="flex min-h-10 items-center gap-2.5 text-[13.5px] font-medium text-slate-700">
        <input type="checkbox" name="collection" defaultChecked className="h-4.5 w-4.5 accent-blue-600" />
        Home collection available
      </label>
    </FormModal>
  );

  return (
    <>
      <PageHeader
        title="Cities"
        description="Operational cities — where bookings are taken and samples collected. The website's city pages are managed separately in the website admin (/admin/cities)."
        actions={addCity}
      />

      {sp.created && (
        <div className="mb-4">
          <Notice tone="emerald">City added.</Notice>
        </div>
      )}

      <FilterBar
        search={{ placeholder: "City or state" }}
        filters={[{ name: "status", label: "Status", options: Object.entries(CITY_STATUS).map(([value, s]) => ({ value, label: s.label })) }]}
      />

      <DataTable
        id="cities-table"
        columns={columns}
        rows={list.rows}
        rowHref={(c) => `/crm/cities/${c.id}`}
        cells={(c) => ({
          name: (
            <span>
              {c.name}
              <span className="block text-[11.5px] font-normal text-slate-500">{c.state}</span>
            </span>
          ),
          status: <Badge tone={CITY_STATUS[c.status]?.tone}>{CITY_STATUS[c.status]?.label ?? c.status}</Badge>,
          collection: c.collection_available ? <Badge tone="emerald" dot={false}>Available</Badge> : <Badge tone="amber" dot={false}>Paused</Badge>,
          areas: num(c.areas),
          partners: num(c.partners),
          bookings: num(c.bookings_30d),
          revenue: rupees(c.revenue_30d),
          leads: num(c.leads_30d),
          actions: toggles(c),
        })}
        card={(c) => (
          <div>
            <Link href={`/crm/cities/${c.id}`} className="block">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-slate-900">{c.name}</p>
                  <p className="text-[12.5px] text-slate-500">
                    {c.state} · {num(c.areas)} areas · {num(c.partners)} partners
                  </p>
                </div>
                <Badge tone={CITY_STATUS[c.status]?.tone}>{CITY_STATUS[c.status]?.label ?? c.status}</Badge>
              </div>
              <p className="mt-2 text-[13px] text-slate-600 tabular-nums">
                30 days: {num(c.bookings_30d)} bookings · {num(c.leads_30d)} leads{showRevenue ? ` · ${rupees(c.revenue_30d)}` : ""}
              </p>
              {!c.collection_available && (
                <p className="mt-1.5">
                  <Badge tone="amber" dot={false}>Home collection paused</Badge>
                </p>
              )}
            </Link>
            {canManage && <div className="mt-3 border-t border-slate-100 pt-3">{toggles(c)}</div>}
          </div>
        )}
        empty={
          <EmptyState
            icon={<MapPinned className="h-5 w-5" />}
            title={filters.search || filters.status ? "No cities match" : "No service cities yet"}
            hint={filters.search || filters.status ? "Clear the search or the status filter." : "Add the cities where you take bookings."}
            action={!filters.search && !filters.status ? addCity : null}
          />
        }
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(p) => href({ page: p > 1 ? p : null })} />}
      />
    </>
  );
}
