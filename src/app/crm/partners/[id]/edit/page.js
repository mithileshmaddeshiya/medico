import { notFound } from "next/navigation";

import PartnerForm from "@/components/crm/partners/PartnerForm";
import { PageHeader } from "@/components/crm/ui";
import { partnerCode } from "@/lib/crm/constants";
import { requirePerm } from "@/lib/crm/guard";
import { getPartner } from "@/lib/crm/stores/partners";
import { listCities } from "@/lib/crm/stores/lookups";

import { savePartnerAction } from "../../actions";

export const metadata = { title: "Edit lab partner" };
export const dynamic = "force-dynamic";

/** Edit a partner. Every changed field is logged with its old and new value. */
export default async function EditPartner({ params }) {
  const { id } = await params;
  await requirePerm("partners.manage", `/crm/partners/${id}/edit`);
  const [partner, cities] = await Promise.all([getPartner(id), listCities({ includeInactive: true })]);
  if (!partner) notFound();
  return (
    <>
      <PageHeader
        eyebrow={partnerCode(partner.id)}
        title={`Edit ${partner.name}`}
        description="Changes are logged with who made them and the old value."
        back={{ href: `/crm/partners/${partner.id}`, label: partner.name }}
      />
      <div className="mx-auto max-w-4xl">
        <PartnerForm action={savePartnerAction} partner={partner} cities={cities} cancelHref={`/crm/partners/${partner.id}`} />
      </div>
    </>
  );
}
