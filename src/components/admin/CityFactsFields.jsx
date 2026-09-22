/**
 * The facts of a city added in the panel: the fields a src/data/lab/cities.js
 * entry carries. Shared by /admin/cities/new and a panel city's edit page.
 *
 * Validated in src/lib/admin/cityStore.js (validateCityFacts). Each of these
 * ends up in the page's local-business markup, which is why the hints are
 * specific about what NOT to put in them.
 */
import { Card, Field, Input, Select, Textarea } from "./ui";

export default function CityFactsFields({ facts = null }) {
  const isNew = !facts;

  return (
    <>
      <Card title="The town">
        <div className="space-y-4">
          <Field label="Name" required hint="How the town is written in every heading: “Lab Test in <name>”.">
            <Input name="name" required defaultValue={facts?.name ?? ""} placeholder="Bhatpar Rani" />
          </Field>

          <Field
            label="URL"
            hint={
              isNew
                ? "The part after /lab-test/. Leave empty to make it from the name. It cannot change once the page exists — it gets linked, shared and indexed."
                : "Fixed. The page is already linked and indexed at this address."
            }
          >
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[12.5px] text-slate-500">/lab-test/</span>
              <Input
                name="slug"
                readOnly={!isNew}
                defaultValue={facts?.slug ?? ""}
                placeholder="bhatpar-rani"
                className={isNew ? "font-mono" : "bg-slate-50 font-mono text-slate-500"}
              />
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="State" hint="Footer address and the schema. Defaults to Uttar Pradesh.">
              <Input name="state" defaultValue={facts?.state ?? "Uttar Pradesh"} />
            </Field>
            <Field
              label="District name for the localities"
              hint="Only if this town is not itself the district — e.g. Khalilabad uses “Sant Kabir Nagar”. Empty = the town's name."
            >
              <Input name="areaContext" defaultValue={facts?.areaContext ?? ""} placeholder="(the town's name)" />
            </Field>
          </div>

          <Field
            label="Localities"
            required
            hint="One per line (or comma separated). Only places the team actually collects from — each becomes areaServed in the page's markup and an option in the booking form."
          >
            <Textarea
              name="areas"
              rows={5}
              required
              defaultValue={(facts?.areas ?? []).join("\n")}
              placeholder={"Sadar Bazar\nRailway Colony\nCivil Lines"}
            />
          </Field>

          <Field label="Other names people search for" hint="Optional. Comma separated, e.g. “Banaras, Kashi” for Varanasi.">
            <Input name="aliases" defaultValue={(facts?.aliases ?? []).join(", ")} />
          </Field>
        </div>
      </Card>

      <Card
        title="Location"
        subtitle="All optional, for the page's local-business markup. Leave a field empty rather than guess — markup that names a wrong place is worse than markup that names none."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="PIN code">
              <Input name="postalCode" inputMode="numeric" maxLength={6} defaultValue={facts?.postalCode ?? ""} placeholder="274001" />
            </Field>
            <Field label="Latitude" hint="Town centre.">
              <Input name="lat" inputMode="decimal" defaultValue={facts?.geo?.lat ?? ""} placeholder="26.5024" />
            </Field>
            <Field label="Longitude" hint="Town centre.">
              <Input name="lng" inputMode="decimal" defaultValue={facts?.geo?.lng ?? ""} placeholder="83.7791" />
            </Field>
          </div>

          <Field
            label="Google Business Profile link"
            hint="This town's own public Maps page (google.com/maps/place/… or maps.app.goo.gl/…). Not the business.google.com dashboard link, which 404s for everyone else."
          >
            <Input name="gbp" type="url" defaultValue={facts?.gbp ?? ""} placeholder="https://maps.app.goo.gl/…" />
          </Field>
        </div>
      </Card>

      <Card title="Listing">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status" hint="Hidden = no page, not in the sitemap or any footer.">
            <Select name="status" defaultValue={facts && !facts.published ? "hidden" : "published"}>
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
            </Select>
          </Field>
          <Field label="Order" hint="Lower sorts first in footers and lists. The built-in cities use 1–15.">
            <Input name="order" type="number" defaultValue={facts?.order ?? 1000} />
          </Field>
        </div>
      </Card>
    </>
  );
}
