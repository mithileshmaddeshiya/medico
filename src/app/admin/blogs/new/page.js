import PostEditor from "@/components/admin/PostEditor";
import { ButtonLink, Note, PageHeader } from "@/components/admin/ui";
import { requireRole } from "@/lib/admin/guard";

import { changeRouteAction, deletePostAction, savePostAction, setPostStatusAction } from "../actions";

export const metadata = { title: "New article" };
export const dynamic = "force-dynamic";

/**
 * A new article starts as a draft and cannot start any other way.
 *
 * The save button creates the row, then redirects to /admin/blogs/<id>, so a
 * second save updates rather than creating a duplicate at the same URL. There
 * is no "create and publish" in one step on purpose: publishing writes a live
 * URL into the sitemap, and a post that has never been read back once is not
 * ready for that.
 */
export default async function NewPostPage() {
  await requireRole("editor", "/admin/blogs/new");

  return (
    <>
      <PageHeader
        title="New article"
        subtitle="It saves as a draft first. Publish is a separate, deliberate step once you have read it back."
      >
        <ButtonLink href="/admin/blogs">Cancel</ButtonLink>
      </PageHeader>

      <Note title="What to write, and what never to">
        These guides are read by people trying to understand a blood test, often before they decide
        whether to book one. Answer the question plainly and stop — do not pad an article to reach a
        word count, and do not let the SEO score on the right talk you into it.
        <br />
        <br />
        Nothing here may claim an accreditation, a certification, a partner lab’s name, a rating or
        a test count we cannot stand behind. A guide is this business speaking, and on a medical
        site an unverifiable claim in public text is exactly what a manual action is written for.
      </Note>

      <PostEditor
        post={null}
        action={savePostAction}
        statusAction={setPostStatusAction}
        deleteAction={deletePostAction}
        routeAction={changeRouteAction}
      />
    </>
  );
}
