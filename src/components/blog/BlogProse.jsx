// SSR component — semantic markup and next/image, nothing to hydrate.
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Info } from "lucide-react";

import { partsOf } from "@/data/blogs";

/**
 * The body of an article.
 *
 * ── WHY THE WHOLE ARTICLE IS IN THE HTML ─────────────────────────────────
 * No accordion, no "read more", no tabs. The lab pages clip their guide behind
 * a button and keep the full text in the DOM for exactly this reason — a
 * crawler reads what is in the HTML, and text that only appears after a click
 * is text that ranks weakly, if at all. Here there was no reason to clip at
 * all: someone who opened a guide came to read it.
 *
 * ── HEADINGS ─────────────────────────────────────────────────────────────
 * h1 is the article title, rendered by the page. Every section here is an h2,
 * in document order, each with a stable `id` from the registry so it can be
 * linked and listed in the contents. No skipped levels — a flat, predictable
 * outline is what produces the "jump to section" links Google sometimes shows
 * under a result.
 *
 * ── TABLES ───────────────────────────────────────────────────────────────
 * Real <table> with <th scope>, not a grid of divs. A screen reader announces
 * the column when it reads a cell, and Google reads the header row as the
 * table's meaning — which is what lets a lookup table ("shikayat → test") be
 * lifted into a featured snippet. A div grid gives up both.
 *
 * Each table scrolls inside its own wrapper. Three columns of Hinglish do not
 * fit a 360px phone, and the alternative to a scrolling table is a page that
 * itself scrolls sideways.
 */

/** Inline parts: strings, or `{ text, href }` which becomes a real link. */
function Parts({ value }) {
  return partsOf(value).map((part, i) => {
    if (typeof part === "string") return <Fragment key={i}>{part}</Fragment>;

    if (part?.href) {
      return (
        <Link
          key={i}
          href={part.href}
          className="font-semibold text-emerald-700 underline underline-offset-2 decoration-emerald-300 transition-colors hover:text-emerald-800 hover:decoration-emerald-600"
        >
          {part.text}
        </Link>
      );
    }

    return <Fragment key={i}>{part?.text ?? ""}</Fragment>;
  });
}

function Block({ block }) {
  if (block.kind === "p") {
    return (
      <p className="mt-4 text-[14.5px] sm:text-[15.5px] leading-[1.8] text-slate-700">
        <Parts value={block.parts} />
      </p>
    );
  }

  if (block.kind === "list") {
    return (
      <ul className="mt-4 space-y-2.5">
        {block.items.map((item, i) => (
          <li
            key={i}
            className="relative pl-5 text-[14.5px] sm:text-[15.5px] leading-[1.8] text-slate-700"
          >
            <span
              aria-hidden
              className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-emerald-500"
            />
            <Parts value={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (block.kind === "table") {
    return (
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        {/* Horizontal scroll lives here, on the table's own wrapper — never on
            the page. tabIndex makes it reachable by keyboard, which a scrolling
            region needs to be. */}
        <div className="overflow-x-auto" tabIndex={0}>
          <table className="w-full border-collapse text-left">
            {block.caption && (
              <caption className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-[12px] font-semibold text-slate-600">
                {block.caption}
              </caption>
            )}

            {block.head.length > 0 && (
              <thead>
                <tr className="bg-emerald-50/70">
                  {block.head.map((cell, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="whitespace-nowrap px-4 py-3 text-[12.5px] font-bold text-emerald-900"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-t border-slate-200 align-top">
                  {row.map((cell, c) => (
                    // First cell of each row is the row header — that is what
                    // makes a screen reader say "Dengue NS1: kab karayein …"
                    // instead of reading a bare date.
                    <Cell key={c} isHeader={c === 0 && block.head.length > 1}>
                      <Parts value={cell} />
                    </Cell>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (block.kind === "note") {
    const warn = block.tone === "warn";
    const Icon = warn ? AlertTriangle : Info;

    return (
      <aside
        className={`mt-5 rounded-xl border p-4 sm:p-5 ${
          warn
            ? "border-amber-200 bg-amber-50/70"
            : "border-emerald-200 bg-emerald-50/60"
        }`}
      >
        <div className="flex gap-3">
          <Icon
            aria-hidden
            className={`mt-0.5 h-4 w-4 shrink-0 ${
              warn ? "text-amber-600" : "text-emerald-600"
            }`}
            strokeWidth={2.4}
          />

          <div className="min-w-0">
            {block.title && (
              <p
                className={`text-[13.5px] font-bold ${
                  warn ? "text-amber-900" : "text-emerald-900"
                }`}
              >
                {block.title}
              </p>
            )}

            <p className="mt-1 text-[13.5px] leading-[1.75] text-slate-700">
              {block.text}
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return null;
}

/** A table cell — `th` for the row header, `td` otherwise. */
function Cell({ isHeader, children }) {
  const className =
    "px-4 py-3 text-[13px] leading-[1.65] text-slate-700 min-w-[9rem]";

  return isHeader ? (
    <th scope="row" className={`${className} font-semibold text-slate-900`}>
      {children}
    </th>
  ) : (
    <td className={className}>{children}</td>
  );
}

export default function BlogProse({ sections = [] }) {
  if (!sections.length) return null;

  return (
    <div>
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          // scroll-mt clears the fixed navbar, so an anchor lands on the
          // heading instead of hiding it behind the header.
          className={`scroll-mt-28 ${
            index > 0 ? "mt-10 border-t border-slate-200/80 pt-9 sm:mt-12 sm:pt-11" : "mt-10"
          }`}
        >
          <h2 className="text-[19px] sm:text-[23px] font-extrabold leading-snug tracking-tight text-balance text-slate-900">
            {section.heading}
          </h2>

          {section.lead && (
            <p className="mt-2 text-[13.5px] italic leading-relaxed text-slate-500">
              {section.lead}
            </p>
          )}

          {section.image && (
            <figure className="mt-5">
              <div className="relative w-full aspect-2/1 overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={section.image.src}
                  alt={section.image.alt ?? ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover object-center"
                />
              </div>

              {section.image.caption && (
                <figcaption className="mt-2 text-[12px] leading-relaxed text-slate-500">
                  {section.image.caption}
                </figcaption>
              )}
            </figure>
          )}

          {section.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </section>
      ))}
    </div>
  );
}
