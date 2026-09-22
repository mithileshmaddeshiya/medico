"use client";

/**
 * Editors for a city page's long-form guide and its FAQs.
 *
 * Both hold the whole list in state and post it as one JSON field; the server
 * (validateCityContent / validateCityFaqs in src/lib/admin/cityStore.js) is
 * what decides what is stored. A guide paragraph is edited as plain text with
 * links written [like this](/path) — see src/lib/contentText.js, whose
 * conversion round-trips every paragraph in the repo exactly.
 *
 * Each section / question is a <details> so a 15-section guide is a list of
 * headings to scan, not a wall of textareas.
 */
import { useCallback, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import ActionForm, { SubmitButton } from "./ActionForm";
import { Field, Input, Textarea } from "./ui";
import { joinParagraphs } from "@/lib/contentText";

const iconButton =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40";

function move(list, index, by) {
  const next = [...list];
  const [item] = next.splice(index, 1);
  next.splice(index + by, 0, item);
  return next;
}

function ItemTools({ index, count, onMove, onRemove, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" className={iconButton} disabled={index === 0} onClick={() => onMove(-1)} title="Move up" aria-label={`Move ${label} up`}>
        <ArrowUp className="h-4 w-4" />
      </button>
      <button type="button" className={iconButton} disabled={index === count - 1} onClick={() => onMove(1)} title="Move down" aria-label={`Move ${label} down`}>
        <ArrowDown className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`${iconButton} hover:bg-rose-50 hover:text-rose-700`}
        onClick={onRemove}
        title="Remove"
        aria-label={`Remove ${label}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

/** "Restore the original" — its own form, since forms cannot nest. */
function ResetForm({ action, slug, what }) {
  return (
    <ActionForm action={action}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="reset" value="1" />
      <SubmitButton variant="secondary" pendingLabel="Restoring…">
        Restore the original {what}
      </SubmitButton>
    </ActionForm>
  );
}

/* ── The guide ─────────────────────────────────────────────────────────────── */

export function CityContentEditor({ slug, sections, edited, action }) {
  const [items, setItems] = useState(() =>
    sections.map((s) => ({ id: s.id ?? "", h: s.h ?? "", text: joinParagraphs(s.p ?? []) }))
  );
  const [dirty, setDirty] = useState(false);
  // Stable: ActionForm re-runs its success effect when onDone changes, and an
  // inline function would clear "Unsaved changes" on every keystroke.
  const saved = useCallback(() => setDirty(false), []);

  const update = (index, patch) => {
    setDirty(true);
    setItems((list) => list.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };
  const change = (next) => {
    setDirty(true);
    setItems(next);
  };

  return (
    <div className="space-y-3">
      <ActionForm action={action} onDone={saved} className="space-y-3">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="sections" value={JSON.stringify(items)} />

        <ol className="space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <details className="group rounded-xl border border-slate-200 bg-white open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
                  <span className="w-6 shrink-0 font-mono text-[12px] font-bold text-emerald-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-slate-800">
                    {item.h || <span className="text-slate-400">Untitled section</span>}
                  </span>
                  {index === 0 && (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                      title &amp; intro
                    </span>
                  )}
                  <span className="shrink-0 text-[11.5px] text-slate-400 group-open:hidden">Edit</span>
                </summary>

                <div className="space-y-3 border-t border-slate-100 px-4 py-4">
                  <Field label="Heading" required>
                    <Input value={item.h} onChange={(e) => update(index, { h: e.target.value })} />
                  </Field>

                  <Field
                    label="Text"
                    hint="Leave a blank line between paragraphs. A link to another page on the site is written [link text](/path), e.g. [Varanasi guide](/blogs/lab-test/varanasi)."
                  >
                    <Textarea rows={10} value={item.text} onChange={(e) => update(index, { text: e.target.value })} />
                  </Field>

                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <label className="block">
                      <span className="text-[11.5px] font-semibold text-slate-500">Anchor (#link to this section)</span>
                      <Input
                        value={item.id}
                        onChange={(e) => update(index, { id: e.target.value })}
                        placeholder="made from the heading"
                        className="mt-1 w-72 font-mono text-[12px]"
                      />
                    </label>
                    <ItemTools
                      index={index}
                      count={items.length}
                      label="section"
                      onMove={(by) => change(move(items, index, by))}
                      onRemove={() => {
                        if (window.confirm(`Remove “${item.h || "this section"}”? It is only removed when you save.`)) {
                          change(items.filter((_, i) => i !== index));
                        }
                      }}
                    />
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => change([...items, { id: "", h: "", text: "" }])}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50"
          >
            <Plus className="h-4 w-4" /> Add a section
          </button>

          <div className="flex items-center gap-3">
            {dirty && <span className="text-[12px] font-semibold text-amber-700">Unsaved changes</span>}
            <SubmitButton pendingLabel="Saving…">Save the guide</SubmitButton>
          </div>
        </div>
      </ActionForm>

      {edited && (
        <div className="flex justify-end">
          <ResetForm action={action} slug={slug} what="guide" />
        </div>
      )}
    </div>
  );
}

/* ── The FAQs ──────────────────────────────────────────────────────────────── */

export function CityFaqEditor({ slug, faqs, edited, action }) {
  const [items, setItems] = useState(() =>
    faqs.map((f) => ({
      q: f.q ?? "",
      a: f.a ?? "",
      links: (f.links ?? []).map((link) => `${link.label} | ${link.href}`).join("\n"),
    }))
  );
  const [dirty, setDirty] = useState(false);
  // Stable: ActionForm re-runs its success effect when onDone changes, and an
  // inline function would clear "Unsaved changes" on every keystroke.
  const saved = useCallback(() => setDirty(false), []);

  const update = (index, patch) => {
    setDirty(true);
    setItems((list) => list.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };
  const change = (next) => {
    setDirty(true);
    setItems(next);
  };

  return (
    <div className="space-y-3">
      <ActionForm action={action} onDone={saved} className="space-y-3">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="faqs" value={JSON.stringify(items)} />

        <ol className="space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <details className="group rounded-xl border border-slate-200 bg-white open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
                  <span className="w-6 shrink-0 font-mono text-[12px] font-bold text-emerald-700">Q{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-slate-800">
                    {item.q || <span className="text-slate-400">New question</span>}
                  </span>
                  <span className="shrink-0 text-[11.5px] text-slate-400 group-open:hidden">Edit</span>
                </summary>

                <div className="space-y-3 border-t border-slate-100 px-4 py-4">
                  <Field label="Question" required>
                    <Input value={item.q} onChange={(e) => update(index, { q: e.target.value })} />
                  </Field>
                  <Field label="Answer" required hint="Plain text. It is also published as FAQ structured data, so only state what is true of the service.">
                    <Textarea rows={5} value={item.a} onChange={(e) => update(index, { a: e.target.value })} />
                  </Field>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <label className="block min-w-0 flex-1">
                      <span className="text-[11.5px] font-semibold text-slate-500">
                        Links under the answer — optional, one per line: Label | /path
                      </span>
                      <Textarea
                        rows={2}
                        value={item.links}
                        onChange={(e) => update(index, { links: e.target.value })}
                        placeholder="Which test, and when — a guide | /blogs/lab-test/varanasi"
                        className="mt-1 font-mono text-[12px]"
                      />
                    </label>
                    <ItemTools
                      index={index}
                      count={items.length}
                      label="question"
                      onMove={(by) => change(move(items, index, by))}
                      onRemove={() => {
                        if (window.confirm("Remove this question? It is only removed when you save.")) {
                          change(items.filter((_, i) => i !== index));
                        }
                      }}
                    />
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => change([...items, { q: "", a: "", links: "" }])}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50"
          >
            <Plus className="h-4 w-4" /> Add a question
          </button>

          <div className="flex items-center gap-3">
            {dirty && <span className="text-[12px] font-semibold text-amber-700">Unsaved changes</span>}
            <SubmitButton pendingLabel="Saving…">Save the FAQs</SubmitButton>
          </div>
        </div>
      </ActionForm>

      {edited && (
        <div className="flex justify-end">
          <ResetForm action={action} slug={slug} what="FAQs" />
        </div>
      )}
    </div>
  );
}
