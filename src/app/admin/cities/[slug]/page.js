import { notFound } from "next/navigation";

import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import ImageField from "@/components/admin/ImageField";
import {
  ButtonLink,
  Card,
  Field,
  Input,
  Note,
  PageHeader,
  Select,
  Textarea,
} from "@/components/admin/ui";
import { getCity } from "@/lib/admin/cityStore";
import { getMedia } from "@/lib/admin/media";
import { requireRole } from "@/lib/admin/guard";

import { saveCityAction } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const city = await getCity(slug);
  return { title: city ? `${city.name} · city page` : "City page" };
}

export default async function CityPage({ params }) {
  await requireRole("editor", "/admin/cities");

  const { slug } = await params;
  const city = await getCity(slug);
  if (!city) notFound();

  const hero = city.heroMediaId ? await getMedia(city.heroMediaId) : null;

  return (
    <>
      <PageHeader title={city.name} subtitle={<code className="text-[12.5px]">{city.href}</code>}>
        <ButtonLink href={city.href} target="_blank">
          View page
        </ButtonLink>
        <ButtonLink href="/admin/cities">Back</ButtonLink>
      </PageHeader>

      <Note title="An empty field uses the generated copy">
        Every city page is built from the shared template in{" "}
        <code>src/data/lab/defaults.js</code> with this town’s name filled in — that is what makes
        adding a city cheap. Anything you type here replaces the generated value for{" "}
        {city.name} only. Clear a field and the template takes over again.
      </Note>

      <ActionForm action={saveCityAction} className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <input type="hidden" name="slug" value={city.slug} />

        <div className="space-y-6">
          <Card title="Search">
            <div className="space-y-4">
              <Field label="Title" hint="30–60 characters. “ | MedicoBharat” is appended automatically.">
                <Input name="title" defaultValue={city.edited.title} placeholder={city.title ?? ""} />
              </Field>

              <Field label="Meta description" hint="70–160 characters.">
                <Textarea
                  name="description"
                  rows={3}
                  defaultValue={city.edited.description}
                  placeholder={city.description ?? ""}
                />
              </Field>

              <Field label="Keywords" hint="Comma separated. Low value — do not spend time here.">
                <Input name="keywords" defaultValue={(city.keywords ?? []).join(", ")} />
              </Field>
            </div>
          </Card>

          <Card title="On the page">
            <div className="space-y-4">
              <Field label="H1" hint="The one big heading at the top of the page.">
                <Input name="h1" defaultValue={city.edited.h1} placeholder={city.h1 ?? ""} />
              </Field>

              <Field
                label="Hero image"
                hint="Leave it on the built-in image unless this town has its own photo. A panel image is WebP, which is right for the page — the WhatsApp share card stays the JPG, because WhatsApp will not render a WebP preview."
              >
                <ImageField name="heroMediaId" initial={hero} folder="cities" />
              </Field>

              <Field label="Hero image alt text" hint="What the picture shows, for someone who cannot see it.">
                <Input name="heroAlt" defaultValue={city.heroAlt ?? ""} />
              </Field>
            </div>
          </Card>

          <Card title="Localities" subtitle="Read-only here — these feed the page's local-business markup.">
            <p className="text-[12.5px] leading-relaxed text-slate-600">
              {city.areas.length ? city.areas.join(" · ") : "None listed."}
            </p>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
              These are published as the page’s <code>areaServed</code> and are offered in the
              booking form’s dropdown. Each is qualified by a district name that the city entry
              sets deliberately — Khalilabad’s areas are published as “…, Sant Kabir Nagar”, not
              “…, Khalilabad”, because the second names a place that does not exist. Edit them in{" "}
              <code>src/data/lab/cities.js</code>.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publishing">
            <div className="space-y-3.5">
              <Field label="Status">
                <Select name="status" defaultValue={city.status === "hidden" ? "hidden" : "published"}>
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                </Select>
              </Field>

              <Field label="Priority">
                <Select name="priority" defaultValue={String(city.priority)}>
                  {["1.0", "0.9", "0.8", "0.7", "0.6"].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </Card>

          <Card title="">
            <SubmitButton className="w-full">Save</SubmitButton>
          </Card>

          <Card title="Hiding a city page">
            <p className="text-[12.5px] leading-relaxed text-slate-600">
              Set the status to <strong>Hidden</strong>. The page stops being rendered and leaves the
              sitemap and every footer in the same moment — which is the only consistent way to take
              a city down, and why there is no separate noindex switch here. The URL starts
              returning a 404. If
              the page has been live for any length of time, add a redirect to the nearest town you
              do serve — a 404 on an indexed local page loses the local ranking that took months to
              build, and it does not come back on its own.
            </p>
          </Card>
        </div>
      </ActionForm>
    </>
  );
}
