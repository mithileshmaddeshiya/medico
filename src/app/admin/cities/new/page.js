import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import CityFactsFields from "@/components/admin/CityFactsFields";
import { ButtonLink, Card, Note, PageHeader } from "@/components/admin/ui";
import { requireRole } from "@/lib/admin/guard";

import { createCityAction } from "../actions";

export const metadata = { title: "Add a city" };
export const dynamic = "force-dynamic";

/**
 * A new /lab-test/<city> page.
 *
 * Only the facts are asked for. Everything a visitor reads — the hero, the
 * tests and prices, the FAQs, the how-it-works steps — is generated from the
 * shared template with this town's name and localities filled in, exactly as
 * for the cities in src/data/lab/cities.js. After saving, the city's edit
 * screen takes the optional title, description, H1 and hero image.
 */
export default async function NewCityPage() {
  await requireRole("editor", "/admin/cities/new");

  return (
    <>
      <PageHeader
        title="Add a city"
        subtitle="A new /lab-test/<city> page, built from the shared template with this town's details."
      >
        <ButtonLink href="/admin/cities">Cancel</ButtonLink>
      </PageHeader>

      <Note title="Only add a town the team really serves">
        The page tells Google and every visitor that home collection is available here, and its
        localities are published as the area served. A page for a town nobody visits is a promise
        the phone line then has to break.
      </Note>

      <ActionForm action={createCityAction} className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="min-w-0 space-y-6">
          <CityFactsFields />
        </div>

        <div className="space-y-6">
          <Card title="">
            <SubmitButton className="w-full" pendingLabel="Creating…">
              Create the city page
            </SubmitButton>
            <p className="mt-2.5 text-[12px] leading-relaxed text-slate-500">
              It goes live at once if the status is Published — set it to Hidden to prepare it
              first. Title, description, H1 and hero image can be set on the next screen.
            </p>
          </Card>
        </div>
      </ActionForm>
    </>
  );
}
