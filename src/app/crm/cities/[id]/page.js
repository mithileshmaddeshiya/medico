import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";

import { ConfirmAction, FormModal, QuickAction } from "@/components/crm/forms";
import { Badge, BookingStatusBadge, Card, EmptyState, Field, Input, Notice, PageHeader, Timeline } from "@/components/crm/ui";
import { recordHistory } from "@/lib/crm/activity";
import { bookingCode, partnerCode } from "@/lib/crm/constants";
import { ago, date, rupees } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import { CITY_STATUS, getServiceCity } from "@/lib/crm/stores/catalog";

import { areaFlagAction, cityFlagAction, createAreaAction, updateAreaAction, updateCityAction } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await getServiceCity(id).catch(() => null);
  return { title: data?.city?.name ?? "City" };
}

/**
 * One service city: its areas (add / rename / toggle), the lab partners who
 * serve it (managed on each partner's page), and its latest bookings.
 */
export default async function CityDetail({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await requirePerm("catalog.view", `/crm/cities/${id}`);
  const data = await getServiceCity(id);
  if (!data || data.city.status === "deleted") notFound();
  const { city, areas, partners, bookings } = data;

  const canManage = has(user, "catalog.manage");
  const canBookings = has(user, "bookings.view");
  const canPartners = has(user, "partners.view");
  const history = await recordHistory(user, "service_cities", city.id, { limit: 20 });

  return (
    <>
      <PageHeader
        back={{ href: "/crm/cities", label: "Cities" }}
        title={city.name}
        description={`${city.state} · ${areas.length} areas · ${partners.length} lab partners`}
        actions={
          canManage && (
            <>
              <FormModal
                action={updateCityAction}
                fields={{ id: city.id }}
                label="Rename"
                variant="secondary"
                icon={<Pencil className="h-4 w-4" aria-hidden />}
                title="Edit city"
                description="Bookings and customers already in this city keep their link to it."
              >
                <Field label="City name" required htmlFor="edit-city-name">
                  <Input id="edit-city-name" name="name" defaultValue={city.name} required maxLength={80} />
                </Field>
                <Field label="State" htmlFor="edit-city-state">
                  <Input id="edit-city-state" name="state" defaultValue={city.state} maxLength={80} />
                </Field>
              </FormModal>
              <QuickAction action={cityFlagAction} fields={{ id: city.id, flag: "collection", value: city.collection_available ? "0" : "1" }}>
                {city.collection_available ? "Pause collection" : "Resume collection"}
              </QuickAction>
              <QuickAction
                action={cityFlagAction}
                fields={{ id: city.id, flag: "status", value: city.status === "active" ? "inactive" : "active" }}
                variant={city.status === "active" ? "secondary" : "primary"}
              >
                {city.status === "active" ? "Deactivate" : "Activate"}
              </QuickAction>
            </>
          )
        }
      />

      {sp.created && (
        <div className="mb-4">
          <Notice tone="emerald" title="City added">Add its areas below so bookings can pick a locality.</Notice>
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-1.5">
        <Badge tone={CITY_STATUS[city.status]?.tone}>{CITY_STATUS[city.status]?.label ?? city.status}</Badge>
        {city.collection_available ? <Badge tone="emerald" dot={false}>Home collection available</Badge> : <Badge tone="amber" dot={false}>Home collection paused</Badge>}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card
            title="Areas"
            description="Localities in this city. Inactive areas are hidden from the booking form."
            actions={
              canManage && (
                <FormModal
                  action={createAreaAction}
                  fields={{ cityId: city.id }}
                  label="Add area"
                  size="sm"
                  icon={<Plus className="h-4 w-4" aria-hidden />}
                  title={`Add an area in ${city.name}`}
                  submitLabel="Add area"
                >
                  <Field label="Area name" required htmlFor="area-name">
                    <Input id="area-name" name="name" required maxLength={120} placeholder="e.g. Civil Lines" />
                  </Field>
                  <Field label="Pincode" htmlFor="area-pin">
                    <Input id="area-pin" name="pincode" inputMode="numeric" maxLength={6} placeholder="6 digits" />
                  </Field>
                </FormModal>
              )
            }
          >
            {areas.length ? (
              <ul className="-mx-4 -my-4 divide-y divide-slate-100 sm:-mx-5">
                {areas.map((a) => (
                  <li key={a.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-slate-900">
                        {a.name} {a.pincode && <span className="text-[12.5px] font-normal text-slate-500">· {a.pincode}</span>}
                      </p>
                      <p className="mt-1 flex flex-wrap gap-1.5">
                        <Badge tone={CITY_STATUS[a.status]?.tone}>{CITY_STATUS[a.status]?.label ?? a.status}</Badge>
                        {!a.collection_available && <Badge tone="amber" dot={false}>Collection paused</Badge>}
                      </p>
                    </div>
                    {canManage && (
                      <div className="flex flex-wrap gap-1.5">
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
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState compact icon={<MapPin className="h-5 w-5" />} title="No areas yet" hint={canManage ? "Add the localities you collect from." : "No localities have been added for this city."} />
            )}
          </Card>

          <Card title="Recent bookings">
            {bookings.length ? (
              <ul className="-mx-4 -my-4 divide-y divide-slate-100 sm:-mx-5">
                {bookings.map((b) => (
                  <li key={b.id}>
                    {canBookings ? (
                      <Link href={`/crm/bookings/${b.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 sm:px-5">
                        <BookingLine b={b} />
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                        <BookingLine b={b} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState compact title="No bookings in this city yet" />
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Lab partners serving it" description="Set on each partner's page.">
            {partners.length ? (
              <ul className="space-y-2">
                {partners.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2 text-[13.5px]">
                    {canPartners ? (
                      <Link href={`/crm/partners/${p.id}`} className="min-w-0 truncate font-medium text-slate-900 hover:text-blue-700">
                        {p.name}
                      </Link>
                    ) : (
                      <span className="min-w-0 truncate font-medium text-slate-900">{p.name}</span>
                    )}
                    <span className="shrink-0 text-[12px] text-slate-500">
                      {partnerCode(p.id)}
                      {p.status !== "active" && ` · ${p.status}`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-slate-500">No lab partner serves this city yet.</p>
            )}
          </Card>

          <Card title="History">
            <Timeline
              items={history.map((h) => ({ id: h.id, title: h.summary || h.action, meta: `${h.user_name || h.user_email || "System"} · ${ago(h.created_at)}` }))}
              empty={<p className="text-[13px] text-slate-500">No changes recorded yet.</p>}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

function BookingLine({ b }) {
  return (
    <>
      <span className="min-w-0">
        <span className="block truncate text-[13.5px] font-medium text-slate-900">
          {bookingCode(b.id)} · {b.patient_name}
        </span>
        <span className="block text-[12px] text-slate-500">
          {date(b.created_at)}
          {b.area ? ` · ${b.area}` : ""}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <BookingStatusBadge status={b.status} />
        <span className="text-[12.5px] tabular-nums text-slate-600">{rupees(b.final_amount)}</span>
      </span>
    </>
  );
}
