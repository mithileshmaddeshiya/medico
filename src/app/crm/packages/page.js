import CatalogList from "@/components/crm/catalog/CatalogList";
import { requirePerm } from "@/lib/crm/guard";

export const metadata = { title: "Packages" };
export const dynamic = "force-dynamic";

/** Checkup packages (lab_tests.is_package = 1). See CatalogList for the table. */
export default async function PackagesPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("catalog.view", "/crm/packages");
  return <CatalogList sp={sp} user={user} kind="package" />;
}
