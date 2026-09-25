import LeadForm from "@/components/crm/leads/LeadForm";
import { PageHeader } from "@/components/crm/ui";
import { requirePerm } from "@/lib/crm/guard";
import { LEAD_CHANNELS, defaultFollowUpInput } from "@/lib/crm/stores/leads";
import { listAreas, listBookableTests, listCities, listStaff } from "@/lib/crm/stores/lookups";

import { createLeadAction } from "../actions";

export const metadata = { title: "New lead" };
export const dynamic = "force-dynamic";

/** A phone, WhatsApp or walk-in enquiry, typed in while the person is on the line. */
export default async function NewLead() {
  const user = await requirePerm("leads.manage", "/crm/leads/new");
  const [tests, cities, areas, staff] = await Promise.all([listBookableTests(), listCities(), listAreas(), listStaff()]);

  return (
    <>
      <PageHeader
        title="New lead"
        description="Mobile and name are enough to start. The call, a call-back and the owner can be set in the same save."
        back={{ href: "/crm/leads", label: "Leads" }}
      />
      <LeadForm
        action={createLeadAction}
        channels={LEAD_CHANNELS.filter((c) => c.key !== "website")}
        tests={tests.filter((t) => !t.isPackage).map((t) => ({ id: t.id, name: t.name }))}
        packages={tests.filter((t) => t.isPackage).map((t) => ({ id: t.id, name: t.name }))}
        cities={cities.map((c) => ({ id: c.id, name: c.name }))}
        areas={areas.map((a) => ({ id: a.id, city_id: a.city_id, name: a.name }))}
        staff={staff.map((u) => ({ id: u.id, name: u.name, email: u.email }))}
        userId={user.id}
        defaultFollowUp={defaultFollowUpInput()}
      />
    </>
  );
}
