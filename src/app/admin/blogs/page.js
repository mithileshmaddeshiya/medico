import Link from "next/link";
import { ExternalLink } from "lucide-react";

import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import {
  ButtonLink,
  Empty,
  Input,
  Note,
  PageHeader,
  Pill,
  Row,
  Select,
  StatusPill,
  Table,
  Tabs,
  Td,
  when,
} from "@/components/admin/ui";
import { listPosts, postCities, postCounts } from "@/lib/admin/blogStore";
import { requireUser } from "@/lib/admin/guard";
import { scoreBand } from "@/lib/admin/seoScore";
import { getBlogs } from "@/lib/blogs";

import { restoreRecord } from "../actions";

export const metadata = { title: "Articles" };
export const dynamic = "force-dynamic";

/**
 * The article list.
 *
 * ── IT SHOWS THE FILE-BACKED POSTS TOO ───────────────────────────────────
 * The fifty-odd guides in content/blogs/ are still served from disk and are
 * not in the database, so they cannot be edited here yet. Hiding them would
 * make this screen a lie — it would say "you have 3 articles" on a site that
 * publishes fifty. They are listed at the bottom, greyed, with the one thing
 * that can be done about them: run the importer.
 *
 * ── THE SEO SCORE IS THE STORED ONE ──────────────────────────────────────
 * Computed on save by the same module the editor runs in the browser, so this
 * column cannot drift from what the editor showed when the post was written.
 */
export default async function BlogsPage({ searchParams }) {
  await requireUser("/admin/blogs");

  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : null;
  const search = typeof params.q === "string" ? params.q : "";
  const city = typeof params.city === "string" ? params.city : null;

  const [posts, counts, cities, everything] = await Promise.all([
    listPosts({ status, search, city, includeDeleted: status === "deleted" }),
    postCounts(),
    postCities(),
    getBlogs(),
  ]);

  // Routes the database owns, so the file-only list below can exclude them.
  const inDb = new Set(posts.map((post) => post.href));
  const [dbAll] = [await listPosts({ limit: 500, includeDeleted: true })];
  for (const post of dbAll) inDb.add(post.href);

  const fileOnly = everything.filter((post) => post.source !== "db" && !inDb.has(post.href));

  return (
    <>
      <PageHeader
        title="Articles"
        subtitle="Guides at /blogs/<category>/<city>. The folder is the city and the filename is the category — together they are the URL."
      >
        <ButtonLink href="/admin/blogs/new" variant="primary">
          Write an article
        </ButtonLink>
      </PageHeader>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          basePath="/admin/blogs"
          active={status}
          counts={counts}
          tabs={[
            { key: null, label: "All" },
            { key: "draft", label: "Drafts" },
            { key: "published", label: "Published" },
            { key: "archived", label: "Archived" },
            { key: "deleted", label: "Bin" },
          ]}
        />

        <form className="flex items-center gap-2" action="/admin/blogs">
          {status && <input type="hidden" name="status" value={status} />}
          <Input name="q" defaultValue={search} placeholder="Title or keyword" className="w-44" aria-label="Search" />
          <Select name="city" defaultValue={city ?? ""} className="w-36" aria-label="City">
            <option value="">Every city</option>
            {cities.map((item) => (
              <option key={item.city} value={item.city}>
                {item.city_name || item.city} ({item.n})
              </option>
            ))}
          </Select>
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-3 py-2 text-[13px] font-semibold text-white hover:bg-slate-800"
          >
            Filter
          </button>
        </form>
      </div>

      {status === "deleted" && (
        <Note title="Nothing here was actually deleted">
          These rows are still in the database with everything they held — body, metadata, history
          and their URL. Restoring one brings it back as a draft so it gets a read-through before it
          goes live again. If a post’s URL was redirected when it was removed, remember to remove
          that redirect before republishing, or the live page will bounce to somewhere else.
        </Note>
      )}

      {posts.length ? (
        <Table head={["Title", "URL", "SEO", "Status", "Published", "Updated", ""]}>
          {posts.map((post) => (
            <Row key={post.id} muted={post.status === "deleted"}>
              <Td className="max-w-[22rem]">
                <Link
                  href={`/admin/blogs/${post.id}`}
                  className="block truncate font-semibold text-slate-900 hover:text-emerald-700"
                >
                  {post.title}
                </Link>
                {post.focus_keyword && (
                  <span className="mt-0.5 block truncate text-[11.5px] text-slate-500">
                    focus: {post.focus_keyword}
                  </span>
                )}
              </Td>

              <Td>
                <span className="font-mono text-[11.5px] text-slate-500">{post.href}</span>
                {post.status === "published" && (
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-1.5 inline-flex align-middle text-slate-400 hover:text-emerald-700"
                    aria-label="Open the live page"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </Td>

              <Td>
                <Pill
                  tone={
                    { good: "emerald", ok: "amber", poor: "rose" }[scoreBand(post.seo_score)]
                  }
                >
                  {post.seo_score}
                </Pill>
                {Boolean(post.noindex) && (
                  <span className="ml-1.5 text-[11px] font-semibold text-amber-700">noindex</span>
                )}
              </Td>

              <Td>
                <StatusPill status={post.status} />
              </Td>

              <Td className="whitespace-nowrap text-slate-500">{post.publishedAt ?? "—"}</Td>
              <Td className="whitespace-nowrap text-slate-500">{when(post.updated_at)}</Td>

              <Td>
                {post.status === "deleted" ? (
                  <ActionForm action={restoreRecord} successToast>
                    <input type="hidden" name="entity" value="blog_posts" />
                    <input type="hidden" name="id" value={post.id} />
                    <SubmitButton variant="secondary" pendingLabel="Restoring…">
                      Restore
                    </SubmitButton>
                  </ActionForm>
                ) : (
                  <ButtonLink href={`/admin/blogs/${post.id}`} className="px-2 py-1 text-[12px]">
                    Edit
                  </ButtonLink>
                )}
              </Td>
            </Row>
          ))}
        </Table>
      ) : (
        <Empty
          title={status || search || city ? "Nothing matches" : "No articles in the database yet"}
          hint={
            status || search || city
              ? "Try a different filter."
              : "Write one here, or import the guides that are currently served from content/blogs with `npm run blogs:import`."
          }
          action={<ButtonLink href="/admin/blogs/new" variant="primary">Write an article</ButtonLink>}
        />
      )}

      {fileOnly.length > 0 && !status && (
        <section className="space-y-3">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">
              Published from files ({fileOnly.length})
            </h2>
            <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-slate-600">
              These are live on the site, read straight from{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-[11.5px]">content/blogs/</code>.
              They are not in the database, so they cannot be edited here. Run{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-[11.5px]">npm run blogs:import</code>{" "}
              to copy them in — the files are left untouched, and each post keeps rendering exactly
              as it does now until somebody opens it in the editor.
            </p>
          </div>

          <Table head={["Title", "URL", "Published", ""]}>
            {fileOnly.map((post) => (
              <Row key={post.href} muted>
                <Td className="max-w-[26rem] truncate font-medium text-slate-700">{post.title}</Td>
                <Td className="font-mono text-[11.5px] text-slate-500">{post.href}</Td>
                <Td className="whitespace-nowrap text-slate-500">{post.publishedAt ?? "—"}</Td>
                <Td>
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[12px] font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    View
                  </a>
                </Td>
              </Row>
            ))}
          </Table>
        </section>
      )}
    </>
  );
}
