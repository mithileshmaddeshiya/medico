import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import {
  ButtonLink,
  Card,
  Field,
  Input,
  Note,
  PageHeader,
  Row,
  StatusPill,
  Table,
  Td,
} from "@/components/admin/ui";
import { listCategories } from "@/lib/admin/catalogStore";
import { requireRole } from "@/lib/admin/guard";

import { removeCategoryAction, saveCategoryAction } from "../actions";

export const metadata = { title: "Filter chips" };
export const dynamic = "force-dynamic";

/**
 * The filter chips above the test grid.
 *
 * Each chip carries a HEADING as well as a label, and the heading is not
 * optional: it becomes the <h2> above the grid when that chip is selected. A
 * chip with an empty heading leaves a section of a public page with no heading
 * at all, which is both an outline problem for a crawler and a blank space for
 * a reader — so the form refuses it rather than defaulting to the label.
 */
export default async function CategoriesPage() {
  await requireRole("editor", "/admin/tests/categories");
  const categories = await listCategories();

  return (
    <>
      <PageHeader
        title="Filter chips"
        subtitle="The row of filters above the test grid on every city page."
      >
        <ButtonLink href="/admin/tests">Back to tests</ButtonLink>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="space-y-4">
          {categories.length ? (
            <Table head={["Chip", "Heading shown above the grid", "Tests", "Status", ""]}>
              {categories.map((chip) => (
                <Row key={chip.key} muted={chip.status === "deleted"}>
                  <Td>
                    <span className="font-semibold text-slate-900">{chip.label}</span>
                    <span className="ml-2 font-mono text-[11px] text-slate-400">{chip.key}</span>
                  </Td>
                  <Td className="max-w-[24rem] truncate text-slate-600">{chip.heading}</Td>
                  <Td>{chip.tests}</Td>
                  <Td>
                    <StatusPill status={chip.status ?? "active"} />
                  </Td>
                  <Td>
                    <ActionForm action={removeCategoryAction}>
                      <input type="hidden" name="key" value={chip.key} />
                      <SubmitButton variant="quiet" pendingLabel="…">
                        Remove
                      </SubmitButton>
                    </ActionForm>
                  </Td>
                </Row>
              ))}
            </Table>
          ) : (
            <Note tone="warn" title="There are no chips">
              The grid renders every test under “All” with no filters and no section heading. Run{" "}
              <code>npm run db:seed</code> to copy the built-in set in, or add one on the right.
            </Note>
          )}

          <Note title="A chip cannot be removed while tests sit under it">
            Those cards would still exist but would only be reachable from “All”, which to a
            visitor looks exactly like they disappeared. Move them to another chip first — the panel
            says how many are in the way.
          </Note>
        </div>

        <Card title="Add or edit a chip" subtitle="Saving over an existing key updates it.">
          <ActionForm action={saveCategoryAction} reset className="space-y-4">
            <Field label="Key" required hint="Lower case, hyphenated. Fixed once tests refer to it.">
              <Input name="key" required placeholder="diabetes" />
            </Field>

            <Field label="Label" required hint="What the chip itself says.">
              <Input name="label" required placeholder="Diabetes" />
            </Field>

            <Field
              label="Heading"
              required
              hint="The <h2> above the grid when this chip is picked. It is a real heading on a public page, so write it as one."
            >
              <Input name="heading" required placeholder="Diabetes aur sugar ke test" />
            </Field>

            <Field label="Sort order">
              <Input name="sortOrder" type="number" defaultValue={0} />
            </Field>

            <SubmitButton className="w-full">Save chip</SubmitButton>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
