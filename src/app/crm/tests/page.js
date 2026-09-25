import CatalogList from "@/components/crm/catalog/CatalogList";
import { requirePerm } from "@/lib/crm/guard";

export const metadata = { title: "Tests" };
export const dynamic = "force-dynamic";

/** Single tests (lab_tests.is_package = 0). See CatalogList for the table. */
export default async function TestsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("catalog.view", "/crm/tests");
  return <CatalogList sp={sp} user={user} kind="test" />;
}
