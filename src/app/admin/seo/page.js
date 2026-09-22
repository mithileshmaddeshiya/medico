import Link from "next/link";

import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import {
  ButtonLink,
  Card,
  Checkbox,
  Field,
  Input,
  Note,
  PageHeader,
  Pill,
  Row,
  Select,
  Stat,
  Table,
  Td,
  Textarea,
} from "@/components/admin/ui";
import { requireRole } from "@/lib/admin/guard";
import { listRoutes, seoHealth } from "@/lib/admin/seoStore";
import { scoreBand } from "@/lib/admin/seoScore";

import { markReviewedAction, saveRouteAction } from "./actions";

export const metadata = { title: "SEO" };
export const dynamic = "force-dynamic";

/**
 * Per-route metadata for the fixed pages, plus the site's search health.
 *
 * ── WHAT IS DELIBERATELY NOT HERE ────────────────────────────────────────
 * The structured data. The Organization and WebSite nodes in
 * src/lib/schema.js carry stable @ids that every other node on the site
 * references, and that file explains at length what happened when the brand
 * was described inconsistently: Google held no entity for "MedicoBharat" at
 * all and spell-corrected it to "medical bharat". Putting those fields behind
 * a text input is how that comes back. Schema changes go through a deploy,
 * with the comments that explain them.
 *
 * Also not here: robots.txt as free text. A stray `Disallow: /` typed into a
 * box is a site that deindexes itself overnight, and there is no undo fast
 * enough. Indexing is controlled per route, by a checkbox, where the effect is
 * visible.
 *
 * ── THE REVIEWED DATE IS A SEPARATE BUTTON ───────────────────────────────
 * sitemap/static.xml insists its `lastmod` is a real date a human typed,
 * because a lastmod that is always "today" is one Google learns to ignore.
 * Saving a page's metadata does NOT move it. "Mark reviewed" does, and that is
 * the only thing that does.
 */
export default async function SeoPage() {
  await requireRole("owner", "/admin/seo");

  const [routes, health] = await Promise.all([listRoutes(), seoHealth()]);

  return (
    <>
      <PageHeader
        title="SEO"
        subtitle="Titles, descriptions and indexing for the pages that are not generated from a list."
      >
        <ButtonLink href="/admin/seo/redirects">Redirects</ButtonLink>
        <ButtonLink href="/sitemap.xml" target="_blank">
          View sitemap
        </ButtonLink>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat
          label="Average article score"
          value={Number(health.posts.average) || 0}
          tone={scoreBand(Number(health.posts.average) || 0) === "good" ? "emerald" : "slate"}
          sub={`${Number(health.posts.total) || 0} published`}
          href="/admin/blogs?status=published"
        />
        <Stat label="Weak articles" value={Number(health.posts.weak) || 0} sub="Scoring under 60" href="/admin/blogs" />
        <Stat
          label="No meta description"
          value={health.postsWithoutDescription}
          sub="Google writes its own, usually worse"
          href="/admin/blogs"
        />
        <Stat
          label="Images without alt"
          value={health.imagesWithoutAlt}
          sub="Worth nothing in image search"
          href="/admin/media"
        />
      </div>

      <Card
        title="Fixed pages"
        subtitle="The hubs and one-offs. City pages and articles carry their own metadata and are edited where they live."
      >
        <Table head={["Page", "Title", "Indexed", "In sitemap", "Priority", "Reviewed", ""]}>
          {routes.map((route) => (
            <Row key={route.route}>
              <Td>
                <span className="font-semibold text-slate-900">{route.label}</span>
                <span className="ml-2 font-mono text-[11.5px] text-slate-400">{route.route}</span>
              </Td>

              <Td className="max-w-[22rem] truncate text-slate-600">
                {route.title || <span className="text-slate-400">built in</span>}
              </Td>

              <Td>
                {route.noindex ? <Pill tone="amber">noindex</Pill> : <Pill tone="emerald">yes</Pill>}
              </Td>

              <Td>{route.in_sitemap === 0 ? "no" : "yes"}</Td>
              <Td>{route.priority}</Td>

              <Td className="whitespace-nowrap">
                {route.reviewedOn ?? <span className="text-slate-400">—</span>}
              </Td>

              <Td>
                <div className="flex justify-end gap-1">
                  <ActionForm action={markReviewedAction}>
                    <input type="hidden" name="route" value={route.route} />
                    <SubmitButton variant="quiet" pendingLabel="…">
                      Mark reviewed
                    </SubmitButton>
                  </ActionForm>
                  <ButtonLink
                    href={`/admin/seo/route?route=${encodeURIComponent(route.route)}`}
                    className="px-2 py-1 text-[12px]"
                  >
                    Edit
                  </ButtonLink>
                </div>
              </Td>
            </Row>
          ))}
        </Table>

        <div className="mt-4">
          <Note tone="warn" title="“Mark reviewed” stamps today onto the sitemap">
            It sets this page’s <code>lastmod</code>. Press it when you have actually read the page
            and it is still accurate — not because a deploy happened, and not to make the sitemap
            look fresh. A lastmod that moves every day is one Google stops believing, and once it
            stops believing yours it stops using it to decide what to recrawl.
          </Note>
        </div>
      </Card>

      <Card
        title="What this panel will not let you change"
        subtitle="Two things, on purpose."
      >
        <ul className="space-y-3 text-[12.5px] leading-relaxed text-slate-600">
          <li>
            <strong className="font-semibold text-slate-800">The structured data.</strong> The
            Organization and WebSite nodes are declared once in code with stable identifiers that
            every other node on the site points at. That is what makes Google treat this as one
            business rather than a dozen similarly-named ones — a brand search for “medicobharat”
            used to be spell-corrected to “medical bharat” precisely because no such entity was
            declared. Editing it from a form is how that comes back, so it goes through a deploy.
          </li>
          <li>
            <strong className="font-semibold text-slate-800">robots.txt as free text.</strong> One
            stray <code>Disallow: /</code> deindexes the entire site, and nothing here would undo it
            fast enough. Indexing is set per page above, where you can see what it applies to.
          </li>
        </ul>
      </Card>

      <Card title="Health notes">
        <ul className="space-y-2 text-[12.5px] leading-relaxed text-slate-600">
          <li>
            <strong>{health.redirects}</strong> redirect rule{health.redirects === 1 ? "" : "s"} are
            live from the panel, on top of the permanent ones compiled into{" "}
            <code>next.config.mjs</code> for the retired medicine section.{" "}
            <Link href="/admin/seo/redirects" className="font-semibold text-emerald-700">
              Manage them
            </Link>
            .
          </li>
          <li>
            <strong>{health.noindexed}</strong> published article
            {health.noindexed === 1 ? " is" : "s are"} set to noindex. Deliberate is fine;
            accidental is a page that can never rank and is silently dropped from the sitemap.
          </li>
        </ul>
      </Card>
    </>
  );
}
