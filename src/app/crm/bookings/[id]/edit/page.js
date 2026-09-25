import { notFound } from "next/navigation";

import BookingForm from "@/components/crm/BookingForm";
import { Notice, PageHeader } from "@/components/crm/ui";
import { bookingCode } from "@/lib/crm/constants";
import { requirePerm } from "@/lib/crm/guard";
import { getBooking } from "@/lib/crm/stores/bookings";
import { listAreas, listBookableTests, listCities } from "@/lib/crm/stores/lookups";

import { updateBookingAction } from "../../actions";

export const metadata = { title: "Edit booking" };
export const dynamic = "force-dynamic";

export default async function EditBooking({ params }) {
  const { id } = await params;
  await requirePerm("bookings.manage", `/crm/bookings/${id}/edit`);
  const [b, tests, cities, areas] = await Promise.all([getBooking(id), listBookableTests(), listCities({ includeInactive: true }), listAreas()]);
  if (!b) notFound();

  const ymd = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

  return (
    <>
      <PageHeader title={`Edit ${bookingCode(b.id)}`} description={b.patient_name} back={{ href: `/crm/bookings/${b.id}`, label: bookingCode(b.id) }} />
      {b.order_id && (
        <div className="mb-5">
          <Notice tone="amber" title="This booking came from the website">
            Its tests and prices are what the customer was charged online. Change them only to correct a real mistake — the change is recorded in the activity log.
          </Notice>
        </div>
      )}
      {b.status === "cancelled" ? (
        <Notice tone="slate">Reopen this booking before editing it.</Notice>
      ) : (
        <BookingForm
          mode="edit"
          action={updateBookingAction}
          tests={tests}
          cities={cities}
          areas={areas}
          initial={{
            id: b.id,
            name: b.patient_name,
            phone: b.patient_phone,
            altPhone: b.alt_phone,
            age: b.age ?? "",
            gender: b.gender,
            address: b.address,
            cityId: b.city_id ?? "",
            area: b.area,
            landmark: b.landmark,
            source: b.source,
            collectionDate: ymd(b.collection_date),
            collectionSlot: b.collection_slot,
            paymentMode: b.payment_mode,
            discount: Number(b.discount) || "",
            collectionFee: Number(b.collection_fee) || "",
            notes: b.notes,
            partnerNotes: b.partner_notes,
            items: b.items.map((i) => ({
              testId: i.test_id,
              name: i.name,
              qty: Number(i.qty),
              price: Number(i.unit_price),
              isPackage: Boolean(i.is_package),
            })),
          }}
        />
      )}
    </>
  );
}
