import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import DeleteButton from "@/components/admin/DeleteButton";
import MediaManager from "@/components/admin/MediaManager";
import { ButtonLink, Empty, Note, PageHeader, Stat } from "@/components/admin/ui";
import { requireUser } from "@/lib/admin/guard";
import { listMedia, mediaFolders, mediaSavings } from "@/lib/admin/media";

import { deleteRecord, restoreRecord } from "../actions";
import { updateAltAction } from "./actions";

export const metadata = { title: "Images" };
export const dynamic = "force-dynamic";

/**
 * The image library.
 *
 * ── EVERY FILE HERE IS WEBP ──────────────────────────────────────────────
 * Not as a setting, as a property of the pipeline: whatever is uploaded is
 * decoded by sharp, rotated to its EXIF orientation, stripped of metadata,
 * resized to fit 1920px and re-encoded (src/lib/admin/media.js). There is no
 * path through this screen that stores an original.
 *
 * The one exception in the whole codebase is the share card — WhatsApp and
 * several other scrapers refuse a WebP og:image and render a blank grey box,
 * which this site already learned the hard way. That is handled by `toOgCard`
 * and is not an upload, so nothing on this page can produce one by accident.
 *
 * ── ALT TEXT IS TREATED AS PART OF THE FILE ──────────────────────────────
 * It is asked for at upload and flagged here when it is missing. An image
 * without it is invisible to a screen reader and worth nothing in image
 * search, and on a site whose readers include people with poor eyesight
 * reading a lab report, the first half of that is not a technicality.
 */
export default async function MediaPage({ searchParams }) {
  await requireUser("/admin/media");

  const params = await searchParams;
  const folder = typeof params.folder === "string" ? params.folder : null;
  const search = typeof params.q === "string" ? params.q : "";
  const showDeleted = params.deleted === "1";

  const [items, folders, savings] = await Promise.all([
    listMedia({ folder, search, includeDeleted: showDeleted, limit: 200 }),
    mediaFolders(),
    mediaSavings(),
  ]);

  const missingAlt = items.filter((item) => !item.alt && item.status === "active").length;

  return (
    <>
      <PageHeader
        title="Images"
        subtitle="Everything uploaded from the panel, converted to WebP and served from /media/."
      >
        <ButtonLink href={showDeleted ? "/admin/media" : "/admin/media?deleted=1"}>
          {showDeleted ? "Hide deleted" : "Show deleted"}
        </ButtonLink>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Images" value={savings.files} sub="All converted to WebP on upload" />
        <Stat
          label="Saved by converting"
          value={`${savings.savedPct}%`}
          tone="emerald"
          sub={`${Math.round(savings.originalBytes / 1024 / 1024)} MB uploaded → ${Math.round(
            savings.webpBytes / 1024 / 1024
          )} MB stored`}
        />
        <Stat
          label="Without alt text"
          value={missingAlt}
          sub={missingAlt ? "Each one is invisible to a screen reader" : "Every image describes itself"}
        />
      </div>

      {missingAlt > 0 && (
        <Note tone="warn" title={`${missingAlt} image${missingAlt === 1 ? "" : "s"} have no description`}>
          Add one in the field under each thumbnail. Describe what the picture shows to someone who
          cannot see it — “phlebotomist collecting a blood sample at a patient’s home”, not
          “image1” and not a list of keywords. If an image genuinely adds nothing a reader needs,
          leaving it empty is the correct answer, and that is what the decorative option at upload
          time records.
        </Note>
      )}

      <MediaManager
        items={items}
        folders={folders}
        folder={folder}
        search={search}
        showDeleted={showDeleted}
        updateAltAction={updateAltAction}
        deleteAction={deleteRecord}
        restoreAction={restoreRecord}
      />

      {items.length === 0 && (
        <Empty
          title={search || folder ? "Nothing matches" : "The library is empty"}
          hint="Images are uploaded from the article editor, or from the picker on any screen that takes one."
        />
      )}

      <Note title="Why images live in the database rather than in /public">
        The site deploys to Vercel, where the filesystem is read-only at runtime. A file written
        into <code>public/</code> would appear to work in development and vanish on the next cold
        start in production — silently. Bytes in a row work in both places, and they make the
        panel’s delete rule real: a deleted image is still byte-for-byte recoverable, which an
        unlinked file is not.
      </Note>
    </>
  );
}
