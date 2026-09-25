import TestForm from "@/components/crm/catalog/TestForm";
import { PageHeader } from "@/components/crm/ui";
import { has, requirePerm } from "@/lib/crm/guard";
import { listPackableTests } from "@/lib/crm/stores/catalog";

import { createCatalogAction } from "../../tests/actions";

export const metadata = { title: "New package" };
export const dynamic = "force-dynamic";

/** A new checkup package built from single tests. Starts off the website unless ticked. */
export default async function NewPackagePage() {
  const user = await requirePerm("catalog.manage", "/crm/packages/new");
  const tests = await listPackableTests();
  return (
    <>
      <PageHeader
        back={{ href: "/crm/packages", label: "Packages" }}
        title="New package"
        description="Bundle tests at one price. New packages stay off the website until you tick “Show on website”."
      />
      <TestForm action={createCatalogAction} kind="package" tests={tests} showMargin={has(user, "revenue.view")} />
    </>
  );
}
