import Link from "next/link";
import { MapPin, Plus, Trash2 } from "lucide-react";

import FilterBar from "@/components/crm/FilterBar";
import { ConfirmAction, FormModal, QuickAction } from "@/components/crm/forms";
import { Badge, DataTable, EmptyState, Field, Input, PageHeader, Pagination, Select, withParams } from "@/components/crm/ui";
import { pageOf } from "@/lib/crm/filters";
import { has, requirePerm } from "@/lib/crm/guard";
import { CITY_STATUS, listServiceAreas } from "@/lib/crm/stores/catalog";
import { listCities } from "@/lib/crm/stores/lookups";

import { areaFlagAction, createAreaAction, updateAreaAction } from "../cities/actions";

export const metadata = { title: "Service areas" };
export const dynamic = "force-dynamic";

/**
 * Every locality across every service city, in one list: filter by city,
 * search by name or pincode, add, rename, pause collection, remove.
 */
export default async function AreasPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("catalog.view", "/crm/areas");
  const { limit, offset } = pageOf(sp);
  const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
  const filters = { cityId: one(sp.city) || null, search: one(sp.q).slice(0, 80), status: one(sp.status) || null };

  const [list, cities] = await Promise.all([listServiceAreas({ ...filters, limit, offset }), listCities({ includeInactive: true })]);
  const canManage = has(user, "catalog.manage");
  const href = (changes) => withParams("/crm/areas", sp, changes);
  const filtered = Boolean(filters.cityId || filters.search || filters.status);

  const columns = [
    { key: "name", label: "Area", hideable: false },
    { key: "city", label: "City" },
    { key: "pincode", label: "Pincode" },
    { key: "status", label: "Status" },
    { key: "collection", label: "Home collection" },
    ...(canManage ? [{ key: "actions", label: "" }] : []),
  ];

  const controls = (a) =>
    canManage && (
      <span className="flex flex-wrap gap-1.5">
        <FormModal action={updateAreaAction} fields={{ id: a.id }} label="Edit" variant="ghost" size="sm" title="Edit area" modalSize="sm">
          <Field label="Area name" required htmlFor={`an-${a.id}`}>
            <Input id={`an-${a.id}`} name="name" defaultValue={a.name} required maxLength={120} />
          </Field>
          <Field label="Pincode" htmlFor={`ap-${a.id}`}>
            <Input id={`ap-${a.id}`} name="pincode" defaultValue={a.pincode} inputMode="numeric" maxLength={6} />
          </Field>
        </FormModal>
        <QuickAction action={areaFlagAction} fields={{ id: a.id, flag: "status", value: a.status === "active" ? "inactive" : "active" }} size="sm">
          {a.status === "active" ? "Deactivate" : "Activate"}
        </QuickAction>
        <QuickAction action={areaFlagAction} fields={{ id: a.id, flag: "collection", value: a.collection_available ? "0" : "1" }} size="sm" variant="ghost">
          {a.collection_available ? "Pause collection" : "Resume collection"}
        </QuickAction>
        <ConfirmAction
          action={areaFlagAction}
          fields={{ id: a.id, flag: "status", value: "deleted" }}
          label="Remove"
          size="sm"
          variant="ghost"
          icon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
          title={`Remove ${a.name}?`}
          body="It disappears from the booking form. Past bookings keep the area name. Adding it again brings it back."
          confirmLabel="Remove"
        />
      </span>
    );

  const addArea = canManage && cities.length > 0 && (
    <FormModal action={createAreaAction} label="Add area" icon={<Plus className="h-4 w-4" aria-hidden />} title="Add a service area" submitLabel="Add area">
      <Field label="City" required htmlFor="area-city">
        <Select id="area-city" name="cityId" required defaultValue={filters.cityId ?? ""}>
          <option value="" disabled>
            Pick a city
          </option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.status !== "active" ? " (inactive)" : ""}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Area name" required htmlFor="area-name">
        <Input id="area-name" name="name" required maxLength={120} placeholder="e.g. Civil Lines" />
      </Field>
      <Field label="Pincode" htmlFor="area-pin">
        <Input id="area-pin" name="pincode" inputMode="numeric" maxLength={6} placeholder="6 digits" />
      </Field>
    </FormModal>
  );

  return (
    <>
      <PageHeader title="Service areas" description="Localities within each service city, used by the booking form and collection routing." actions={addArea} />

      <FilterBar
        search={{ placeholder: "Area or pincode" }}
        filters={[
          { name: "city", label: "City", options: cities.map((c) => ({ value: String(c.id), label: c.name })) },
          { name: "status", label: "Status", options: Object.entries(CITY_STATUS).map(([value, s]) => ({ value, label: s.label })) },
        ]}
      />

      <DataTable
        id="areas-table"
        columns={columns}
        rows={list.rows}
        cells={(a) => ({
          name: a.name,
          city: (
            <Link href={`/crm/cities/${a.city_id}`} className="hover:text-blue-700">
              {a.city_name}
            </Link>
          ),
          pincode: a.pincode || <span className="text-slate-400">—</span>,
          status: <Badge tone={CITY_STATUS[a.status]?.tone}>{CITY_STATUS[a.status]?.label ?? a.status}</Badge>,
          collection: a.collection_available ? <Badge tone="emerald" dot={false}>Available</Badge> : <Badge tone="amber" dot={false}>Paused</Badge>,
          actions: controls(a),
        })}
        card={(a) => (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-slate-900">{a.name}</p>
                <p className="text-[12.5px] text-slate-500">
                  <Link href={`/crm/cities/${a.city_id}`} className="hover:text-blue-700">
                    {a.city_name}
                  </Link>
                  {a.pincode ? ` · ${a.pincode}` : ""}
                </p>
              </div>
              <Badge tone={CITY_STATUS[a.status]?.tone}>{CITY_STATUS[a.status]?.label ?? a.status}</Badge>
            </div>
            {!a.collection_available && (
              <p className="mt-1.5">
                <Badge tone="amber" dot={false}>Collection paused</Badge>
              </p>
            )}
            {canManage && <div className="mt-3 border-t border-slate-100 pt-3">{controls(a)}</div>}
          </div>
        )}
        empty={
          <EmptyState
            icon={<MapPin className="h-5 w-5" />}
            title={filtered ? "No areas match" : "No service areas yet"}
            hint={filtered ? "Pick another city or clear the search." : cities.length ? "Add the localities you collect from." : "Add a city first, then its areas."}
            action={filtered ? null : cities.length ? addArea : <Link href="/crm/cities" className="font-semibold text-blue-700">Go to cities</Link>}
          />
        }
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(p) => href({ page: p > 1 ? p : null })} />}
      />
    </>
  );
}
