import TestForm from "@/components/admin/TestForm";
import { ButtonLink, PageHeader } from "@/components/admin/ui";
import { listCategories } from "@/lib/admin/catalogStore";
import { requireRole } from "@/lib/admin/guard";

import { saveTestAction } from "../actions";

export const metadata = { title: "Add a test" };
export const dynamic = "force-dynamic";

export default async function NewTestPage() {
  await requireRole("editor", "/admin/tests/new");
  const categories = await listCategories();

  return (
    <>
      <PageHeader
        title="Add a test"
        subtitle="It goes on the site as soon as it is saved — there is no draft state for a price."
      >
        <ButtonLink href="/admin/tests">Cancel</ButtonLink>
      </PageHeader>

      <TestForm test={null} categories={categories} action={saveTestAction} />
    </>
  );
}
