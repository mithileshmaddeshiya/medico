import CustomerForm from "@/components/crm/customers/CustomerForm";
import { PageHeader } from "@/components/crm/ui";
import { requirePerm } from "@/lib/crm/guard";
import { listAreas, listCities } from "@/lib/crm/stores/lookups";

import { createCustomerAction } from "../actions";

export const metadata = { title: "New customer" };
export const dynamic = "force-dynamic";

/**
 * A customer added by hand — an enquiry who has not booked yet, a walk-in.
 * Bookings create their customer automatically, so this is the exception.
 */
export default async function NewCustomer({ searchParams }) {
  const sp = await searchParams;
  await requirePerm("customers.manage", "/crm/customers/new");
  const [cities, areas] = await Promise.all([listCities(), listAreas()]);
  const digits = String(sp.phone ?? "").replace(/\D/g, "").slice(-10);

  return (
    <>
      <PageHeader
        title="New customer"
        description="One profile per mobile number. If the number is already on file you will be taken to that profile instead."
        back={{ href: "/crm/customers", label: "Customers" }}
      />
      <CustomerForm action={createCustomerAction} cities={cities} areas={areas} initial={{ phone: digits }} />
    </>
  );
}
