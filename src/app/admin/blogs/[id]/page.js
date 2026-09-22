import { notFound } from "next/navigation";

import PostEditor from "@/components/admin/PostEditor";
import { ButtonLink, Note, PageHeader, StatusPill, when } from "@/components/admin/ui";
import { editableBody, getPost, listPosts } from "@/lib/admin/blogStore";
import { requireRole } from "@/lib/admin/guard";
import { getMedia } from "@/lib/admin/media";

import { changeRouteAction, deletePostAction, savePostAction, setPostStatusAction } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  return { title: post ? post.title : "Article" };
}

export default async function EditPostPage({ params, searchParams }) {
  await requireRole("editor", "/admin/blogs");

  const { id } = await params;
  const { created } = await searchParams;

  const post = await getPost(id);
  if (!post) notFound();

  /*
   * The body the editor opens with.
   *
   * An imported post has structured `sections` and no `body_html`, so those
   * sections are flattened to HTML here — on OPEN, not on save. That matters:
   * a post nobody edits is never rewritten, and the conversion is done by
   * whatever sectionsToHtml does today rather than by whatever the importer
   * did months ago. See src/lib/admin/blogStore.js.
   */
  const bodyHtml = editableBody(post);
  const wasImported = !post.body_html && post.sections?.length > 0;

  const [hero, siblings] = await Promise.all([
    post.hero_media_id ? getMedia(post.hero_media_id) : null,
    listPosts({ status: "published", limit: 200 }),
  ]);

  // Sensible redirect destinations if this post is removed: the city's other
  // guides first, then its lab page. Offered rather than guessed.
  const relatedRoutes = [
    ...siblings.filter((item) => item.city === post.city && item.id !== post.id).map((item) => item.href),
    `/lab-test/${post.city}`,
    "/blogs",
  ];

  return (
    <>
      <PageHeader
        title={post.title || "Untitled"}
        subtitle={
          <>
            <StatusPill status={post.status} />{" "}
            <span className="ml-1 font-mono text-[12px]">{post.href}</span>
            <span className="ml-2 text-slate-400">· last saved {when(post.updated_at, { time: true })}</span>
          </>
        }
      >
        <ButtonLink href="/admin/blogs">All articles</ButtonLink>
      </PageHeader>

      {created && (
        <Note title="Draft created">
          It is saved but not live. Nothing at <code>{post.href}</code> exists on the site until you
          press Publish.
        </Note>
      )}

      {wasImported && (
        <Note tone="warn" title="This article came from a file">
          It was imported from <code>content/blogs/{post.city}/{post.category}.json</code> and has
          been rendering from its structured sections — tables, lists and callouts as typed data.
          What you see below is that content converted to editable HTML.
          <br />
          <br />
          <strong>Saving replaces the structured version with this HTML.</strong> It will look the
          same on the page; it is simply no longer typed data. The original file is left untouched
          on disk, so nothing is lost either way. If you only came to read it, leave without saving.
        </Note>
      )}

      <PostEditor
        post={{ ...post, bodyHtml, hero }}
        action={savePostAction}
        statusAction={setPostStatusAction}
        deleteAction={deletePostAction}
        routeAction={changeRouteAction}
        relatedRoutes={relatedRoutes}
      />
    </>
  );
}
