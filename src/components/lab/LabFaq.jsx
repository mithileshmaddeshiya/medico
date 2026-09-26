'use client'

import { useId, useState } from "react";
import { linkTitle } from "@/lib/linkTitle";
import {
  Baby,
  ChevronDown,
  CircleHelp,
  Clock,
  FileText,
  FlaskConical,
  HeartPulse,
  House,
  IndianRupee,
  MapPin,
  Plane,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Users,
  UtensilsCrossed,
} from "lucide-react";

/* Questions are free text — per city, and editable in /admin — so the icon is
   picked from the words in the question rather than stored with it. First
   match wins, so the narrow topics sit above the broad ones: "how much does
   home collection cost" is a price question, not a home-visit one. */
const ICON_RULES = [
  [/gamca|wafid|gulf|pre-departure/i, Plane],
  [/army|recruit/i, ShieldCheck],
  [/rt-pcr|pre-operative|dengue|typhoid|arsenic/i, FlaskConical],
  [/pregnan/i, Baby],
  [/\bfast|empty stomach/i, UtensilsCrossed],
  [/cost|price|afford|overcharg|pay|₹/i, IndianRupee],
  [/report|result/i, FileText],
  [/fever|cough|seizure|diabetes|thyroid|symptom|pain|swollen/i, HeartPulse],
  [/elderly|bedridden|family|parents|child/i, Users],
  [/doctor|prescription|opd|specialist|hospital|treatment/i, Stethoscope],
  [/home|house|doorstep|phlebotomist|village|flood/i, House],
  [/book|online|whatsapp/i, Smartphone],
  [/evening|morning|shift|quick|soon|slot|time/i, Clock],
  [/travel|centre|center|walk in|locality|district|carry out|cover|this page|\bgo to|done in/i, MapPin],
  [/safe|hygien|accura|quality|choos|package/i, ShieldCheck],
];

function iconFor(q) {
  for (const [re, Icon] of ICON_RULES) if (re.test(q)) return Icon;
  return CircleHelp;
}

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
     paragraph mostly does not". So the city page passes a real sentence naming
     the town, and the generic string stays as the default for the home page,
     which serves every city and can name none of them.

     Both are English, and so is the fallback sub-line below. Every question and
     answer this section renders is English now; a Hinglish frame around English
     content reads as a section somebody stopped translating halfway.

     It is a heading, not a keyword slot. Do not grow it into
     "Deoria Lab Test Blood Test Pathology Lab FAQ" — that is the stuffing the
     rest of this section was written to avoid. */
  const title = heading?.trim() || "Frequently Asked Questions";
  const sub =
    subheading?.trim() ||
    `Common questions about lab tests, home collection and reports in ${city}`;

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-6 sm:pb-12">

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
        <ul className="mt-5 sm:mt-8 divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
          {items.map(({ q, a, links = [] }, i) => {
            const isOpen = open === i;
            const btnId = `${uid}-btn-${i}`;
            const panelId = `${uid}-panel-${i}`;
            const Icon = iconFor(q);

            return (
              <li
                key={`${i}-${q}`}
                className={`relative transition-colors duration-300 ${
                  isOpen ? "bg-emerald-50/40" : "bg-white hover:bg-slate-50/70"
                }`}
              >
                {/* Accent bar marks the open row without shifting its content. */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-1 bg-emerald-500 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* h3 keeps the questions in the document outline — headings
                    do more for long-tail queries than the schema does now. */}
                <h3 className="m-0">
                  <button
                    type="button"
                    id={btnId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group flex w-full cursor-pointer items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                        isOpen
                          ? "bg-emerald-600 text-white shadow-[0_8px_18px_-8px_rgba(5,150,105,0.7)]"
                          : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 group-hover:bg-emerald-100"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={1.9} />
                    </span>

                    <span
                      className={`flex-1 text-[14px] sm:text-[16px] font-semibold leading-snug transition-colors duration-200 ${
                        isOpen ? "text-emerald-800" : "text-slate-800"
                      }`}
                    >
                      {q}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 motion-reduce:transition-none ${
                        isOpen
                          ? "rotate-180 bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
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
                    {/* Indented to the question text, past the icon tile. */}
                    <div className="pb-5 pl-[64px] pr-5 sm:pl-[84px] sm:pr-16">
                      <p className="text-[13px] sm:text-[14px] leading-relaxed text-slate-600">
                        {a}
                      </p>

                      {links.length > 0 && (
                        <p className="mt-3 flex flex-wrap gap-2 text-[12px] sm:text-[13px]">
                          {links.map(({ href, label }) => (
                            <a
                              key={href}
                              href={href}
                              title={linkTitle(href)}
                              tabIndex={isOpen ? 0 : -1}
                              className="inline-flex items-center rounded-full bg-white px-3 py-1 font-medium text-emerald-700 ring-1 ring-emerald-200 transition-colors hover:bg-emerald-600 hover:text-white hover:ring-emerald-600"
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