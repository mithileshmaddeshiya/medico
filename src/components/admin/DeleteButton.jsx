"use client";

/**
 * The delete control, and the sentence that goes with it.
 *
 * ── WHY IT DOES NOT SAY "THIS CANNOT BE UNDONE" ──────────────────────────
 * Because it can, and saying otherwise would be a lie that makes the panel
 * harder to use. Nothing here removes a row: the record moves to a status and
 * keeps its data, its history and its id (see src/lib/admin/softDelete.js).
 * The confirmation says what will actually happen — where the record goes and
 * how to get it back — which is both true and more useful than a scare.
 *
 * ── THE ONE CASE THAT REALLY IS COSTLY ───────────────────────────────────
 * Deleting a published article does not destroy the article, but it does take
 * a live URL off the site, and a URL Google has indexed does not forgive a
 * 404. So for that case the dialog asks where the URL should point instead and
 * writes the redirect with the delete. That is the difference between losing a
 * page and moving one, and it is the only thing on this screen that is genuinely
 * hard to undo after the fact.
 */
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button, Input } from "./ui";

function Confirm({ pendingLabel, children }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="danger" disabled={pending}>
      {pending ? pendingLabel : children}
    </Button>
  );
}

export default function DeleteButton({
  action,
  entity,
  id,
  /** What the record is called in the sentence — "article", "test", "lead". */
  label = "record",
  /** Offer "archive" instead of "delete" where the table has that state. */
  mode = "delete",
  /** Show the redirect field. Pass the live URL that is about to disappear. */
  liveUrl = null,
  /** Suggested destinations for that redirect. */
  redirectOptions = [],
  size = "normal",
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);

  // Escape closes, and focus goes to the dialog when it opens — the two things
  // a hand-built overlay always forgets and that make it unusable by keyboard.
  useEffect(() => {
    if (!open) return;
    dialog.current?.focus();
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const verb = mode === "archive" ? "Archive" : "Delete";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`rounded-lg font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 ${
          size === "small" ? "px-2 py-1 text-[12px]" : "px-3 py-2 text-[13px]"
        }`}
      >
        {verb}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={(event) => event.target === event.currentTarget && setOpen(false)}
        >
          <div
            ref={dialog}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl outline-none"
          >
            <h2 id="delete-title" className="text-[15px] font-bold text-slate-900">
              {verb} this {label}?
            </h2>

            {/* One form around everything, so the redirect field below is
                actually submitted with the delete. A field rendered outside
                the form element is not sent — which would silently drop the
                301 that is the whole point of asking for it. */}
            <form action={action}>
              <input type="hidden" name="entity" value={entity} />
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="mode" value={mode} />

              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                {mode === "archive" ? (
                  <>
                    It comes off the site and stays in the panel under{" "}
                    <strong className="font-semibold text-slate-800">Archived</strong>. Nothing is
                    removed from the database, and you can put it back at any time.
                  </>
                ) : (
                  <>
                    It moves to the bin. The record, its history and its id all stay in the database —
                    this only changes its status, so{" "}
                    <strong className="font-semibold text-slate-800">you can restore it</strong> from
                    the bin later.
                  </>
                )}
              </p>

              {liveUrl && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                  <p className="text-[12.5px] font-bold text-amber-900">
                    This URL is live: {liveUrl}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-slate-700">
                    Removing it leaves a 404 where an indexed page used to be, and the rankings it
                    earned do not come back on their own. Send it somewhere instead — a 308 is written
                    with the delete.
                  </p>

                  <label className="mt-3 block">
                    <span className="text-[12px] font-semibold text-slate-700">Redirect to</span>
                    <Input
                      name="redirectTo"
                      list="redirect-options"
                      placeholder="/blogs/lab-test/deoria"
                      className="mt-1"
                    />
                  </label>

                  <datalist id="redirect-options">
                    {redirectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </datalist>
                </div>
              )}

                <div className="mt-5 flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                    Keep it
                  </Button>
                  <Confirm pendingLabel={`${verb.slice(0, -1)}ing…`}>Yes, {verb.toLowerCase()}</Confirm>
                </div>
              </form>

          </div>
        </div>
      )}
    </>
  );
}
