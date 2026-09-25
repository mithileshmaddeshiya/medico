import { notFound } from "next/navigation";

import CustomerForm from "@/components/crm/customers/CustomerForm";
import { PageHeader } from "@/components/crm/ui";
import { customerCode } from "@/lib/crm/constants";
import { requirePerm } from "@/lib/crm/guard";
import { getCustomer } from "@/lib/crm/stores/customers";
import { listAreas, listCities } from "@/lib/crm/stores/lookups";

import { updateCustomerAction } from "../../actions";

export const metadata = { title: "Edit customer" };
export const dynamic = "force-dynamic";

/** Edit a profile. Existing bookings keep the patient details they were booked with. */
export default async function EditCustomer({ params }) {
  const { id } = await params;
  await requirePerm("customers.manage", `/crm/customers/${id}/edit`);
  const [c, cities, areas] = await Promise.all([getCustomer(id), listCities({ includeInactive: true }), listAreas()]);
  if (!c || c.status === "deleted") notFound();

  return (
    <>
      <PageHeader
        eyebrow={customerCode(c.id)}
        title={`Edit ${c.name}`}
        description="Changes apply to the profile and to new bookings. Existing bookings keep the details they were made with."
        back={{ href: `/crm/customers/${c.id}`, label: c.name }}
      />
      <CustomerForm
        mode="edit"
        action={updateCustomerAction}
        cities={cities}
        areas={areas}
        initial={{
          id: c.id,
          name: c.name,
          phone: c.phone,
          alt_phone: c.alt_phone,
          email: c.email,
          age: c.age ?? "",
          gender: c.gender,
          address: c.address,
          city_id: c.city_id ?? "",
          city: c.city,
          area: c.area,
          landmark: c.landmark,
          notes: c.notes,
        }}
      />
    </>
  );
}
