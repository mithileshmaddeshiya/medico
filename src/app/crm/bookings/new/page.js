import { notFound } from "next/navigation";

import { query } from "@/lib/db";
import BookingForm from "@/components/crm/BookingForm";
import { Notice, PageHeader } from "@/components/crm/ui";
import { leadCode } from "@/lib/crm/constants";
import { has, requirePerm } from "@/lib/crm/guard";
import { listAreas, listBookableTests, listCities, listCollectors, listPartnerOptions } from "@/lib/crm/stores/lookups";

import { createBookingAction } from "../actions";

export const metadata = { title: "New booking" };
export const dynamic = "force-dynamic";

/**
 * Offline booking: phone, WhatsApp, walk-in, referral. Uses the same workflow
 * as a website booking from the moment it is saved. ?lead=<id> converts a
 * lead — the form is filled from it and the lead is marked Booked on save.
 * ?customer=<id> starts from a known customer.
 */
export default async function NewBooking({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("bookings.manage", "/crm/bookings/new");
  const canAssign = has(user, "bookings.assign");

  const [tests, cities, areas, partners, collectors] = await Promise.all([
    listBookableTests(),
    listCities(),
    listAreas(),
    canAssign ? listPartnerOptions() : null,
    canAssign ? listCollectors() : null,
  ]);

  let initial = {};
  let lead = null;
  if (sp.lead) {
    const [[row]] = await query("SELECT * FROM leads WHERE id = ?", [Number(sp.lead) || 0]);
    if (!row) notFound();
    lead = row;
    const city = cities.find((c) => c.name.toLowerCase() === String(row.city ?? "").toLowerCase());
    const channel = { phone: "phone", whatsapp: "whatsapp", walk_in: "walk_in", referral: "referral", partner: "partner" }[row.channel];
    initial = {
      leadId: row.id,
      name: row.name,
      phone: row.phone,
      address: row.address,
      cityId: city?.id ?? "",
      area: row.area ?? "",
      source: channel ?? (row.source === "form" ? "website" : "phone"),
      notes: [row.test && `Enquired: ${row.test}`, row.interested_package && `Package: ${row.interested_package}`].filter(Boolean).join("\n"),
    };
  } else if (sp.customer) {
    const [[c]] = await query("SELECT * FROM customers WHERE id = ?", [Number(sp.customer) || 0]);
    if (c) {
      initial = {
        name: c.name,
        phone: c.phone,
        altPhone: c.alt_phone,
        email: c.email,
        age: c.age ?? "",
        gender: c.gender,
        address: c.address,
        cityId: c.city_id ?? "",
        area: c.area,
        landmark: c.landmark,
      };
    }
  }

  return (
    <>
      <PageHeader
        title="New booking"
        description="Phone, WhatsApp, walk-in or referral booking. It follows the same workflow as a website booking."
        back={{ href: lead ? `/crm/leads/${lead.id}` : "/crm/bookings", label: lead ? `Lead ${leadCode(lead.id)}` : "Bookings" }}
      />
      {lead && (
        <div className="mb-5">
          <Notice tone="blue" title={`Converting lead ${leadCode(lead.id)} · ${lead.name}`}>
            The lead will be marked Booked and linked to this booking when you save.
          </Notice>
        </div>
      )}
      <BookingForm
        action={createBookingAction}
        initial={initial}
        tests={tests}
        cities={cities}
        areas={areas}
        partners={partners}
        collectors={collectors}
        canTakePayment={has(user, "payments.manage")}
      />
    </>
  );
}
