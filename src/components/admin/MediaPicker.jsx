"use client";

/**
 * The image library, as a dialog: pick an existing one or upload a new one.
 *
 * Every path through this component ends with a WebP file that has a width, a
 * height and alt text, because the server converts on the way in
 * (src/lib/admin/media.js) and this form will not upload without alt text
 * unless the person says the image is decorative. That is the whole reason
 * images are not just typed in as URLs anywhere in the panel.
 *
 * ── ABOUT THE ALT TEXT REQUIREMENT ───────────────────────────────────────
 * It is asked for at upload, once, while the person is looking at the picture
 * and knows what it shows. Alt text added "later" is alt text that is never
 * added, and an image with none is invisible to a screen reader and worth
 * nothing in image search. The escape hatch is a checkbox that says the image
 * is decorative, which writes an empty alt deliberately — that is the correct
 * markup for a decorative image and it is a different thing from a missing one.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Search, Upload, X } from "lucide-react";

import { Button, Checkbox, Input } from "./ui";

const kb = (bytes) => `${Math.round(Number(bytes) / 1024)} KB`;

export default function MediaPicker({ onPick, onClose, folder = "general" }) {
  const [items, setItems] = useState(null); // null = still loading
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [alt, setAlt] = useState("");
  const [decorative, setDecorative] = useState(false);
  const fileInput = useRef(null);
  const dialog = useRef(null);

  /**
   * Fetch the library.
   *
   * Written as a promise chain rather than `await` in the effect body because
   * the state update has to happen in a CALLBACK — an effect that calls
   * setState synchronously triggers a cascading render, which is what the
   * react-hooks/set-state-in-effect rule is about. Here the effect starts a
   * request and the external system calls back when it answers, which is the
   * pattern effects are actually for.
   */
  const load = useCallback((term = "", signal) => {
    fetch(`/api/admin/media?search=${encodeURIComponent(term)}`, {
      cache: "no-store",
      signal,
    })
      .then((response) => response.json())
      .then((data) => {
        setItems(data.ok ? data.media : []);
        if (!data.ok) toast.error(data.error ?? "The library could not be loaded.");
      })
      .catch((err) => {
        // An abort is this dialog closing or the search term changing, not a
        // failure — answering it with a toast would fire one on every keystroke.
        if (err?.name === "AbortError") return;
        setItems([]);
        toast.error("The library could not be loaded.");
      });
  }, []);

  /*
   * Load once, when the dialog opens.
   *
   * The request is aborted on unmount so a slow response cannot resolve into a
   * component that is gone — which would put an error toast over whatever
   * screen the person moved on to.
   */
  useEffect(() => {
    const controller = new AbortController();
    load("", controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => {
    dialog.current?.focus();
    const onKey = (event) => event.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function upload(file) {
    if (!file) return;

    if (!alt.trim() && !decorative) {
      toast.error("Describe the image first, or tick “decorative”.");
      return;
    }

    setBusy(true);
    const body = new FormData();
    body.append("file", file);
    body.append("alt", decorative ? "" : alt.trim());
    body.append("title", file.name);
    body.append("folder", folder);

    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await response.json();

      if (!data.ok) {
        toast.error(data.error ?? "That upload failed.");
        return;
      }

      // The saving is worth showing: it is the reason the conversion exists,
      // and on a phone-heavy audience it is the difference in page speed.
      const saved = Math.round((1 - data.media.bytes / data.media.originalBytes) * 100);
      toast.success(
        `Converted to WebP${saved > 0 ? ` — ${saved}% smaller than the ${data.media.from}` : ""}.`
      );

      setAlt("");
      setDecorative(false);
      onPick?.(data.media);
    } catch {
      toast.error("That upload failed.");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={(event) => event.target === event.currentTarget && onClose?.()}
    >
      <div
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Choose an image"
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl outline-none"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <h2 className="text-[15px] font-bold text-slate-900">Choose an image</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Upload */}
        <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="block">
              <span className="text-[12.5px] font-semibold text-slate-700">
                Describe the new image
              </span>
              <span className="mt-0.5 block text-[12px] leading-relaxed text-slate-500">
                What someone who cannot see it needs to know — “phlebotomist collecting a blood
                sample at a patient’s home in Deoria”, not “image1”.
              </span>
              <Input
                value={alt}
                onChange={(event) => setAlt(event.target.value)}
                disabled={decorative}
                placeholder="Describe what the picture shows"
                className="mt-1.5"
              />
            </label>

            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => fileInput.current?.click()}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {busy ? "Converting…" : "Upload"}
            </Button>
          </div>

          <div className="mt-2.5">
            <Checkbox
              checked={decorative}
              onChange={(event) => {
                setDecorative(event.target.checked);
                if (event.target.checked) setAlt("");
              }}
              label="This image is decorative"
              hint="It adds nothing a reader needs, so it gets an empty alt and screen readers skip it. Not the same as leaving alt text out."
            />
          </div>

          <p className="mt-2.5 text-[12px] text-slate-500">
            JPEG, PNG, AVIF, GIF or TIFF, up to 12 MB. Everything is converted to WebP, resized to
            fit 1920px and stripped of EXIF — including the GPS coordinates a phone photo carries.
          </p>

          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => upload(event.target.files?.[0])}
          />
        </div>

        {/* Library */}
        <div className="border-b border-slate-200 px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                load(event.target.value);
              }}
              placeholder="Search by name or description"
              className="pl-9"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {items === null ? (
            <p className="py-8 text-center text-[13px] text-slate-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-slate-500">
              {search ? "Nothing matches that." : "The library is empty — upload the first image above."}
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onPick?.(item)}
                    className="group w-full overflow-hidden rounded-xl border border-slate-200 text-left transition hover:border-emerald-400 hover:shadow-md"
                  >
                    {/* A plain <img>, not next/image: these are already WebP at
                        a capped size, and routing them through the optimiser
                        would re-encode an optimised file for nothing. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.alt || ""}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      className="aspect-[4/3] w-full bg-slate-100 object-cover"
                    />
                    <span className="block px-2.5 py-2">
                      <span className="block truncate text-[12px] font-semibold text-slate-700">
                        {item.title || item.slug}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">
                        {item.width}×{item.height} · {kb(item.bytes)}
                      </span>
                      {!item.alt && (
                        <span className="mt-1 block text-[11px] font-semibold text-amber-700">
                          no alt text
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
