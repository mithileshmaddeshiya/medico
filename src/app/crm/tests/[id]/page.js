import CatalogDetail from "@/components/crm/catalog/CatalogDetail";
import { requirePerm } from "@/lib/crm/guard";
import { getCatalogItem } from "@/lib/crm/stores/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await getCatalogItem(id).catch(() => null);
  return { title: item?.name ?? "Test" };
}

export default async function TestDetailPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await requirePerm("catalog.view", `/crm/tests/${id}`);
  return <CatalogDetail id={id} sp={sp} user={user} kind="test" />;
}
