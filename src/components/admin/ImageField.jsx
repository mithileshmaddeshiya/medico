"use client";

/**
 * A form field that holds one image from the library, by id.
 *
 * Renders a hidden input named `name` carrying the media id, so it drops into
 * any Server Action form. Picking goes through MediaPicker, which means the
 * image has already been converted to WebP and given alt text — there is no
 * way to type a URL in here, on purpose.
 */
import { useState } from "react";

import MediaPicker from "./MediaPicker";
import { Button } from "./ui";

export default function ImageField({ name, initial = null, folder = "general", onAlt }) {
  const [image, setImage] = useState(initial);
  const [picking, setPicking] = useState(false);

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={image?.id ?? ""} />

      {image ? (
        <>
          {/* Already WebP at a capped size — the optimiser would re-encode it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.alt || ""}
            width={image.width}
            height={image.height}
            className="w-full rounded-xl border border-slate-200"
          />
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setPicking(true)}>
              Replace
            </Button>
            <Button type="button" variant="quiet" onClick={() => setImage(null)}>
              Use the built-in image
            </Button>
          </div>
        </>
      ) : (
        <Button type="button" variant="secondary" onClick={() => setPicking(true)}>
          Choose an image
        </Button>
      )}

      {picking && (
        <MediaPicker
          folder={folder}
          onClose={() => setPicking(false)}
          onPick={(media) => {
            setImage(media);
            onAlt?.(media.alt || "");
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}
