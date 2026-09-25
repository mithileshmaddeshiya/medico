import TestForm from "@/components/crm/catalog/TestForm";
import { PageHeader } from "@/components/crm/ui";
import { has, requirePerm } from "@/lib/crm/guard";

import { createCatalogAction } from "../actions";

export const metadata = { title: "New test" };
export const dynamic = "force-dynamic";

/** A new single test. It starts off the website unless "Show on website" is ticked. */
export default async function NewTestPage() {
  const user = await requirePerm("catalog.manage", "/crm/tests/new");
  return (
    <>
      <PageHeader
        back={{ href: "/crm/tests", label: "Tests" }}
        title="New test"
        description="Price, partner price, sample and turnaround. New tests stay off the website until you tick “Show on website”."
      />
      <TestForm action={createCatalogAction} kind="test" showMargin={has(user, "revenue.view")} />
    </>
  );
}
