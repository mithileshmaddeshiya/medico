import { notFound } from "next/navigation";

import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import {
  ButtonLink,
  Card,
  Checkbox,
  Field,
  Input,
  Note,
  PageHeader,
  Select,
  Textarea,
} from "@/components/admin/ui";
import { requireRole } from "@/lib/admin/guard";
import { getRoute } from "@/lib/admin/seoStore";

import { saveRouteAction } from "../actions";

export const metadata = { title: "Page SEO" };
export const dynamic = "force-dynamic";

/**
 * One fixed page's metadata.
 *
 * A field left empty means "use what the code publishes". That is deliberate:
 * most of these pages already have carefully written metadata in their own
 * files, and an override that starts as a copy of it would rot the moment the
 * file changed. An empty box is a promise not to interfere.
 *
 * The route is taken from the query string rather than being a path segment,
 * because a route contains slashes and encoding "/" into a dynamic segment is
 * a fight with the router for no gain.
 */
export default async function RouteSeoPage({ searchParams }) {
  await requireRole("owner", "/admin/seo");

  const { route: requested } = await searchParams;
  const route = typeof requested === "string" ? requested : "";
  if (!route.startsWith("/")) notFound();

  const current = await getRoute(route);
  if (!current) notFound();

  return (
    <>
      <PageHeader title={current.label || route} subtitle={<code className="text-[12.5px]">{route}</code>}>
        <ButtonLink href={route} target="_blank">
          View page
        </ButtonLink>
        <ButtonLink href="/admin/seo">Back</ButtonLink>
      </PageHeader>

      <Note title="Empty means “leave it alone”">
        Every field here overrides what the page’s own code publishes. Leave one blank and the
        built-in value is used, which for most of these pages is metadata that was written
        carefully and commented in the file. Only fill in what you actually want to change.
      </Note>

      <ActionForm action={saveRouteAction} className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <input type="hidden" name="route" value={route} />

        <div className="space-y-6">
          <Card title="What search engines read">
            <div className="space-y-4">
              <Field label="Name in this panel">
                <Input name="label" defaultValue={current.label ?? ""} placeholder="Home" />
              </Field>

              <Field
                label="Title"
                hint="30–60 characters. The site appends “ | MedicoBharat” automatically, so leave room for it."
              >
                <Input name="title" defaultValue={current.title ?? ""} placeholder="(built in)" />
              </Field>

              <Field label="Meta description" hint="70–160 characters.">
                <Textarea name="description" rows={3} defaultValue={current.description ?? ""} placeholder="(built in)" />
              </Field>

              <Field label="Keywords" hint="Comma separated. Google has ignored these for years — kept only for consistency with the rest of the site.">
                <Input name="keywords" defaultValue={(current.keywords ?? []).join(", ")} />
              </Field>

              <Field
                label="Canonical"
                hint="Leave empty. Only set this if the page deliberately declares another URL as the original — a wrong canonical removes the page from search entirely."
              >
                <Input name="canonical" defaultValue={current.canonical ?? ""} placeholder="(automatic)" />
              </Field>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Indexing">
            <div className="space-y-3.5">
              <Checkbox
                name="inSitemap"
                defaultChecked={current.in_sitemap !== 0}
                label="Include in the sitemap"
              />
              <Checkbox
                name="noindex"
                defaultChecked={Boolean(current.noindex)}
                label="noindex"
                hint="Removes the page from search. On /, /lab-test or /blogs this is close to switching the site off — it is here because a staging page sometimes needs it, not because it is routine."
              />
              <Checkbox
                name="nofollow"
                defaultChecked={Boolean(current.nofollow)}
                label="nofollow"
                hint="Tells crawlers not to follow any link on the page, including links back into the site."
              />

              <div className="grid grid-cols-2 gap-3">
                <Field label="Priority">
                  <Select name="priority" defaultValue={String(current.priority ?? 0.7)}>
                    {["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.3"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Changes">
                  <Select name="changefreq" defaultValue={current.changefreq ?? "monthly"}>
                    {["daily", "weekly", "monthly", "yearly"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </div>
          </Card>

          <Card title="">
            <SubmitButton className="w-full">Save</SubmitButton>
            <p className="mt-2.5 text-[12px] leading-relaxed text-slate-500">
              Saving does not touch this page’s <strong>reviewed</strong> date. That is a separate
              button on the SEO list, and it is the only thing that moves the sitemap’s lastmod.
            </p>
          </Card>
        </div>
      </ActionForm>
    </>
  );
}
