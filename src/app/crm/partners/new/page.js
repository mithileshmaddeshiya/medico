import PartnerForm from "@/components/crm/partners/PartnerForm";
import { PageHeader } from "@/components/crm/ui";
import { requirePerm } from "@/lib/crm/guard";
import { listCities } from "@/lib/crm/stores/lookups";

import { savePartnerAction } from "../actions";

export const metadata = { title: "Add lab partner" };
export const dynamic = "force-dynamic";

/** A new lab partner. Logins and per-test prices are added from its profile once saved. */
export default async function NewPartner() {
  await requirePerm("partners.manage", "/crm/partners/new");
  const cities = await listCities({ includeInactive: true });
  return (
    <>
      <PageHeader
        title="Add lab partner"
        description="The lab's details, the cities it serves and where to pay it. Logins and prices come next, on its profile."
        back={{ href: "/crm/partners", label: "Lab partners" }}
      />
      <div className="mx-auto max-w-4xl">
        <PartnerForm action={savePartnerAction} cities={cities} cancelHref="/crm/partners" />
      </div>
    </>
  );
}
