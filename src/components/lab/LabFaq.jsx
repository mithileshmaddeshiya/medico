'use client'

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * LabFaq
 *
 * `faqs` come from the city document (or its generated default) — see
 * defaultFaqs in src/data/lab/defaults.js.
 *
 * Shape: [{ q, a, links?: [{ href, label }] }]
 *   q     — question text (must be unique-ish per page)
 *   a     — plain-text answer. Goes into the visible copy AND the JSON-LD,
 *           so keep it plain text: no markup, no truncation.
 *   links — optional internal links shown under the answer. Deliberately NOT
 *           part of the schema text; schema must mirror the readable answer.
 *
 * `pageUrl` is the absolute URL of the page this block sits on. It is what lets
 * the FAQ node join the page's graph (`#faqpage` → `isPartOf` → `#webpage`)
 * instead of floating as an unattached document. Optional: without it the node
 * still validates, it just carries no id and no link back to the page.
 *
 * SEO note (July 2026): FAQ rich results were fully deprecated by Google on
 * 7 May 2026 and no longer appear in Search for any site. FAQPage is still a
 * valid Schema.org type and is safe to keep — it labels the Q&A relationship
 * for crawlers and AI retrieval — but it is not a SERP feature any more. The
 * ranking value lives in the visible answers being genuinely useful and
 * genuinely different per city.
 */
export default function LabFaq({ city, faqs = [], pageUrl, heading, subheading }) {
  const [open, setOpen] = useState(0);
  const uid = useId();

  // Drop blanks and de-dupe by question, otherwise a templated city doc can
  // emit repeated Question nodes (invalid-ish schema, duplicate React keys).
  const items = [];
  const seen = new Set();
  for (const item of faqs) {
    const q = item?.q?.trim();
    const a = item?.a?.trim();
    if (!q || !a || seen.has(q)) continue;
    seen.add(q);
    items.push({ ...item, q, a });
  }

  if (!items.length) return null;

  const headingId = `${uid}-heading`;

  /* ── WHY THE HEADING IS A PROP ──────────────────────────────────────────
     It was the literal string "Frequently Asked Questions", which meant the
     only <h2> in this section was byte-identical on all six city pages while
     the eight answers underneath it were hand-written and completely different
     per city. The one line summarising the block carried no signal at all, and
     the city term it was missing was sitting one element below in a <p>.

     That is the exact trade this codebase already argues in
     src/data/lab/content/deoria.js: "a heading ranks and a keyword buried in a
     paragraph mostly does not". So the city page passes a real Hinglish
     sentence naming the town, and the generic string stays as the default for
     the home page, which serves every city and can name none of them.

     It is a heading, not a keyword slot. Do not grow it into
     "Deoria Lab Test Blood Test Pathology Lab FAQ" — that is the stuffing the
     rest of this section was written to avoid. */
  const title = heading?.trim() || "Frequently Asked Questions";
  const sub =
    subheading?.trim() ||
    `${city} me lab test, home collection aur report se jude aam sawaal`;

  // Joined to the page's graph rather than left standing on its own. The page
  // emits #webpage / #diagnosticlab / #breadcrumb (see the lab city page); this
  // adds #faqpage and points at the same #webpage, so a crawler reads all four
  // as one document about one business instead of two unrelated payloads.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(pageUrl
      ? {
          "@id": `${pageUrl}#faqpage`,
          url: pageUrl,
          isPartOf: { "@id": `${pageUrl}#webpage` },
          inLanguage: ["hi-IN", "en-IN"],
        }
      : {}),
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  // An answer containing `</script>` (or any `<`) would break out of the tag
  // below. Escaping `<` as \u003c is still valid JSON and safe inline.
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <section
      id="faq"
      aria-labelledby={headingId}
      className="bg-white border-t border-slate-100"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-12">

        <h2
          id={headingId}
          className="text-balance text-center text-xl min-[400px]:text-2xl sm:text-[28px] md:text-[32px] font-extrabold tracking-tight text-slate-900"
        >
          {title}
        </h2>
        <p className="mt-2 text-center text-[12.5px] sm:text-[13.5px] text-slate-500">
          {sub}
        </p>

        {/* Only one answer open at a time so the list never becomes a wall of
            text; grid-rows animates the height instead of snapping open.
            Answers stay in the DOM when collapsed — never conditionally
            render them, or the visible copy stops matching the JSON-LD. */}
        <ul className="mt-6 sm:mt-8 space-y-2.5">
          {items.map(({ q, a, links = [] }, i) => {
            const isOpen = open === i;
            const btnId = `${uid}-btn-${i}`;
            const panelId = `${uid}-panel-${i}`;

            return (
              <li
                key={`${i}-${q}`}
                className={`overflow-hidden rounded-xl bg-white transition-all duration-300 ${
                  isOpen
                    ? "ring-1 ring-emerald-300 shadow-[0_10px_26px_-18px_rgba(6,78,59,0.4)]"
                    : "ring-1 ring-slate-200 hover:ring-emerald-200"
                }`}
              >
                {/* h3 keeps the questions in the document outline — headings
                    do more for long-tail queries than the schema does now. */}
                <h3 className="m-0">
                  <button
                    type="button"
                    id={btnId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left sm:py-3.5 text-[13px] sm:text-[14.5px] font-semibold leading-snug transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset ${
                      isOpen ? "text-emerald-700" : "text-slate-800"
                    }`}
                  >
                    <span>{q}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                        isOpen ? "rotate-180 text-emerald-600" : "text-slate-400"
                      }`}
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4">
                      <p className="text-[12px] sm:text-[13px] leading-relaxed text-slate-500">
                        {a}
                      </p>

                      {links.length > 0 && (
                        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] sm:text-[13px]">
                          {links.map(({ href, label }) => (
                            <a
                              key={href}
                              href={href}
                              tabIndex={isOpen ? 0 : -1}
                              className="font-medium text-emerald-700 underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-600"
                            >
                              {label}
                            </a>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
      />
    </section>
  );
}