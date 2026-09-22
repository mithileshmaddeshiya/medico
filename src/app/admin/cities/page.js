import {
  ButtonLink,
  Note,
  PageHeader,
  Pill,
  Row,
  StatusPill,
  Table,
  Td,
} from "@/components/admin/ui";
import { listCities } from "@/lib/admin/cityStore";
import { requireUser } from "@/lib/admin/guard";

export const metadata = { title: "City pages" };
export const dynamic = "force-dynamic";

/**
 * The /lab-test/<city> pages.
 *
 * Only the editorial half is editable here — see the header of
 * src/lib/admin/cityStore.js. A city's localities, its district context, its
 * coordinates and its Google Business Profile link stay in
 * src/data/lab/cities.js, because each of those is a factual claim that ends
 * up in structured data, and structured data that invents a place is worse
 * than structured data that omits one.
 */
export default async function CitiesPage() {
  await requireUser("/admin/cities");
  const cities = await listCities();

  return (
    <>
      <PageHeader
        title="City pages"
        subtitle={`${cities.length} towns. Everything on a city page is generated from one short entry plus the shared template.`}
      />

      <Note title="What you can change here, and what you cannot">
        Editable: the page title, the meta description, the H1, the hero image and its alt text, and
        whether the page is published.
        <br />
        <br />
        Not editable: the localities, the district each area is qualified by, the coordinates and
        the Google Business Profile link. Those go into the page’s local-business markup, and a
        wrong one names a place that does not exist or points the markup at somebody else’s lab.
        They live in <code>src/data/lab/cities.js</code>, where the comments explain each field.
      </Note>

      <Table head={["City", "URL", "Title in search", "Status", ""]}>
        {cities.map((city) => (
          <Row key={city.slug} muted={city.status !== "published"}>
            <Td>
              <span className="font-semibold text-slate-900">{city.name}</span>
              <span className="ml-2 text-[11.5px] text-slate-400">{city.state}</span>
              <span className="mt-0.5 block text-[11.5px] text-slate-500">
                {city.areas.length} localit{city.areas.length === 1 ? "y" : "ies"}
              </span>
            </Td>

            <Td className="font-mono text-[11.5px] text-slate-500">{city.href}</Td>

            <Td className="max-w-[22rem] truncate text-slate-600">
              {city.title || <span className="text-slate-400">generated</span>}
              {city.hasOverride && (
                <span className="ml-2">
                  <Pill tone="sky">edited</Pill>
                </span>
              )}
            </Td>

            <Td>
              <StatusPill status={city.status} />
            </Td>

            <Td>
              <div className="flex justify-end gap-1">
                <ButtonLink href={city.href} target="_blank" className="px-2 py-1 text-[12px]">
                  View
                </ButtonLink>
                <ButtonLink href={`/admin/cities/${city.slug}`} className="px-2 py-1 text-[12px]">
                  Edit
                </ButtonLink>
              </div>
            </Td>
          </Row>
        ))}
      </Table>
    </>
  );
}
