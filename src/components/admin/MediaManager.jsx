"use client";

/**
 * The library grid: filter, upload, describe, delete, restore.
 *
 * A client component because the upload dialog and the per-image alt-text
 * forms both need local state. The listing itself is still rendered on the
 * server and passed in — this does not fetch the library, it displays it.
 */
import { useState } from "react";
import Link from "next/link";

import ActionForm, { SubmitButton } from "./ActionForm";
import MediaPicker from "./MediaPicker";
import { Button, Input, Pill, Select } from "./ui";

const kb = (bytes) => `${Math.round(Number(bytes) / 1024)} KB`;

export default function MediaManager({
  items,
  folders,
  folder,
  search,
  showDeleted,
  updateAltAction,
  deleteAction,
  restoreAction,
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form className="flex flex-wrap items-center gap-2" action="/admin/media">
          {showDeleted && <input type="hidden" name="deleted" value="1" />}
          <Input
            name="q"
            defaultValue={search}
            placeholder="Search names and descriptions"
            className="w-56"
            aria-label="Search images"
          />
          <Select name="folder" defaultValue={folder ?? ""} className="w-40" aria-label="Folder">
            <option value="">Every folder</option>
            {folders.map((item) => (
              <option key={item.folder} value={item.folder}>
                {item.folder} ({item.n})
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

        <Button type="button" onClick={() => setUploading(true)}>
          Upload an image
        </Button>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className={`overflow-hidden rounded-2xl border bg-white ${
              item.status === "deleted" ? "border-slate-200 opacity-60" : "border-slate-200"
            }`}
          >
            {/* A plain <img>: these are already WebP at a capped size, so
                next/image would re-encode an optimised file for nothing. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.alt || ""}
              width={item.width}
              height={item.height}
              loading="lazy"
              className="aspect-[16/10] w-full bg-slate-100 object-cover"
            />

            <div className="space-y-3 px-4 py-3.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <Pill tone="emerald">webp</Pill>
                <span className="text-[11.5px] text-slate-500">
                  {item.width}×{item.height} · {kb(item.bytes)}
                </span>
                {Number(item.original_bytes) > Number(item.bytes) && (
                  <span className="text-[11.5px] text-emerald-700">
                    −{Math.round((1 - item.bytes / item.original_bytes) * 100)}% from{" "}
                    {String(item.original_type).replace("image/", "") || "original"}
                  </span>
                )}
                {item.status === "deleted" && <Pill tone="slate">in the bin</Pill>}
              </div>

              {item.status === "deleted" ? (
                <ActionForm action={restoreAction}>
                  <input type="hidden" name="entity" value="media" />
                  <input type="hidden" name="id" value={item.id} />
                  <SubmitButton variant="secondary" pendingLabel="Restoring…">
                    Restore
                  </SubmitButton>
                </ActionForm>
              ) : (
                <>
                  <ActionForm action={updateAltAction} className="space-y-2">
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="title" value={item.title ?? ""} />

                    <label className="block">
                      <span className="text-[11.5px] font-semibold text-slate-600">
                        Description (alt text)
                      </span>
                      <Input
                        name="alt"
                        defaultValue={item.alt ?? ""}
                        placeholder="What the picture shows"
                        className={!item.alt ? "ring-amber-400" : ""}
                      />
                    </label>

                    <div className="flex items-center justify-between gap-2">
                      <SubmitButton variant="secondary" pendingLabel="…">
                        Save
                      </SubmitButton>

                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[12px] font-semibold text-slate-500 hover:text-emerald-700"
                      >
                        Open
                      </Link>
                    </div>
                  </ActionForm>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <code className="truncate text-[11px] text-slate-400">{item.url}</code>

                    <ActionForm action={deleteAction}>
                      <input type="hidden" name="entity" value="media" />
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="mode" value="delete" />
                      <SubmitButton variant="quiet" pendingLabel="…">
                        Delete
                      </SubmitButton>
                    </ActionForm>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {uploading && (
        <MediaPicker
          folder={folder ?? "general"}
          onClose={() => setUploading(false)}
          onPick={() => {
            setUploading(false);
            // The grid is server-rendered, so a reload is what shows the new
            // file. Cheap, and it keeps one source of truth for the listing.
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
