# MedicoBharat — SEO Fix Checklist

Audited **30 July 2026** against the `new` branch. Next.js 16.2.4, App Router,
15 indexable routes.

This is the working checklist. The narrative history of earlier audits lives in
[SEO-AUDIT.md](SEO-AUDIT.md) — read that for *why* the July 23/24 items were
raised. This file is what to actually do next.

## How these findings were produced

Not by reading the source and guessing. Every number below was extracted from
the **prerendered HTML** in `.next/server/app/**` after a production build —
i.e. the exact bytes Googlebot receives. Titles, descriptions, canonicals,
heading outlines, image alts, word counts and the internal link graph were
parsed out of those files and cross-checked against the components that emit
them.

Where a finding says "10 of 15 pages", that is a count, not an impression.

Re-run any check with a production build plus the snippets in
[Verification](#verification) at the bottom.

---

## Scoreboard

| Severity | Count | Theme |
|---|---|---|
| 🔴 Critical | 3 | Every SERP snippet is truncated or self-cannibalising; the money keywords sit at the wrong heading level |
| 🟠 High | 6 | Share cards, crawl signals, missing H1, sitemap trust |
| 🟡 Medium | 8 | Config hardening, error routes, dead weight |

**Confirmed fixed and not to be re-broken:** internal linking (every route now
has 14–15 inbound internal links, was 0 for the lab section), canonical domain
unification, OG image generation, per-city lab content, NABL claim removal, and
the entity/schema graph shipped 30 July 2026.

---

## 🔴 CRITICAL

### C1 — "MedicoBharat" appears **twice** in 10 of 15 page titles

**Evidence** — actual `<title>` from the built HTML:

```
About MedicoBharat | Trusted Online Medicine Delivery Platform | MedicoBharat   (77 ch)
Online Medicine Delivery in Deoria | MedicoBharat | MedicoBharat                (64 ch)
Terms & Conditions - MedicoBharat | Healthcare & Medicine Support | MedicoBharat (88 ch)
Medicine Delivery in Deoria | 30-Minute Medicine Delivery | MedicoBharat | MedicoBharat (87 ch)
```

Affected: `/about`, `/contact`, `/privacy`, `/terms`, all **five**
`/medicine-delivery/*` pages, and `/blogs/buy-medicines-online/deoria`.

**Cause.** `src/app/layout.js` sets `title.template: "%s | MedicoBharat"`, which
appends the brand to every page title. That is correct and should stay. The bug
is that the page-level titles *also* end in `| MedicoBharat`, so the brand is
concatenated twice.

**Why it costs traffic.** Google shows roughly 60 characters. At 64–88 the tail
is cut — so the second brand mention is often the only thing a user sees getting
truncated, and the words that would have earned the click are gone. A repeated
brand string also reads as keyword stuffing, and on a site whose whole problem
is that Google spell-corrects its brand name, publishing the name twice in a
truncated title is the opposite of helpful.

The five `/medicine-delivery/*` pages are the site's money pages. Every one of
them is affected.

- [ ] `src/data/medicine/cityData.js` — strip `| MedicoBharat` from each city's `title`
- [ ] `src/data/blogData.js` — same for every article `title`
- [ ] `src/app/(main)/about/page.js`, `contact/page.js`, `privacy/page.js`, `terms/page.js` — remove the brand from `metadata.title`
- [ ] Target **≤ 45 characters** for the page title, since the template adds 15
- [ ] Where a page genuinely needs the template bypassed, use `title: { absolute: "…" }` rather than hand-writing the brand
- [ ] Re-run the title check and confirm zero titles over 60 and zero with the brand twice

> `/lab-test/deoria` is the model here: 39 characters, renders at 54 with the
> suffix. See the comment in `src/data/lab/cities.js` explaining that budget.

---

### C2 — Meta descriptions overflow on 11 of 15 pages

**Evidence** — rendered description length:

| Route | Chars | Over by |
|---|---|---|
| `/medicine-delivery/barhaj` | 296 | +136 |
| `/medicine-delivery/lar` | 287 | +127 |
| `/medicine-delivery/bhatni` | 260 | +100 |
| `/medicine-delivery/deoria` | 255 | +95 |
| `/medicine-delivery/salempur` | 226 | +66 |
| `/lab-test/varanasi` | 216 | +56 |
| `/` and `/about` | 200 / 199 | +40 |
| `/blogs/buy-medicines-online/deoria` | 194 | +34 |
| `/contact`, `/blogs/medicine-home-delivery/deoria` | 162 | +2 |

Google truncates around 155–160 characters on desktop and shorter on mobile. A
296-character description loses its final 46% — and the tail is where these
descriptions put the call to action.

**Why it matters more than it looks.** The description is not a ranking factor,
but it is the ad copy for the click. Half of a sentence ending in "…" reads as
sloppy on a **health** page, where the reader is already deciding whether to
trust you.

- [ ] Rewrite every description above to **140–155 characters**
- [ ] Front-load the differentiator in the first 90 characters — it is the part that always survives
- [ ] Files: `src/data/medicine/cityData.js`, `src/data/blogData.js`, `src/data/lab/cities.js` (varanasi), `src/app/layout.js` (root default), `src/app/(main)/about/page.js`
- [ ] `/lab-test/deoria` at 152 chars is the reference to copy

---

### C3 — The lab pages' keyword headings all render as `<h3>`

**Evidence** — heading outline of `/lab-test/deoria` (5,337 words, the site's
longest and most valuable page):

```
H1  Lab Test in Deoria — Blood Test & Pathology Lab…
H2  Trusted Lab Tests & Health Packages in Deoria
H2  Frequently Asked Questions
H2  Deoria Me Lab Test — Ghar Baithe Blood Test Booking…   ← lead section only
H3    Deoria Me Pathology Lab Ya Diagnostic Centre Dhoondh Rahe Hain?
H3    Deoria Me Lab Test Price Aur Rate List — Kaunsa Test Kitne Ka
H3    Deoria Me Full Body Checkup Package — 45, 72 Aur 88 Parameter
H3    Deoria Me Dengue, Typhoid Aur Malaria Test — Kaunsa Test Kis Din
H3    Deoria Me CBC Test Aur Khoon Ki Kami (Anaemia)
H3    Deoria Me Sugar Test, HbA1c Aur Thyroid Test (TSH)
      …13 in total
```

Every one of those H3s is a **separate search query with its own intent** —
"lab test price in Deoria", "full body checkup package Deoria", "dengue test in
Deoria". `src/data/lab/content/deoria.js` says so explicitly in its header
comment: *"Everything else is a SEPARATE heading, because a heading ranks and a
keyword buried in a paragraph mostly does not."*

That intent is correct. The rendering is not. `src/components/lab/LabContent.jsx:389`
emits them as `<h3>`, which places them **below** the FAQ questions and at the
same level as a `₹400 CBC Test` product-card title. The document outline says
these are sub-points of the lead paragraph rather than the page's main sections.

Both lab cities are affected (Varanasi: 42 H3s, 7 H2s).

- [ ] `src/components/lab/LabContent.jsx:389` — promote the section headings from `<h3>` to `<h2>`
- [ ] Keep the lead section's heading as the `<h2>` it already is (`LabContent.jsx:256`); the change is only for the sections rendered in the loop below it
- [ ] Verify the visual hierarchy still reads correctly — the font sizes are set independently of the tag, so this should be a tag-only change
- [ ] Re-run the heading outline check and confirm ~14 H2s on `/lab-test/deoria`

> Do **not** promote the price-card titles (`LabServices.jsx:299,463`) or the FAQ
> questions (`LabFaq.jsx:99`). Those are correctly H3 — they are items within a
> section, not sections.

---

## 🟠 HIGH

### H1 — `/about`, `/contact`, `/privacy`, `/terms` ship with no `og:image`

The shallow-merge trap that was fixed for the medicine pages in July was never
fixed for these four. Each defines its own `openGraph` block without `images`,
so Next.js replaces the root layout's `openGraph` wholesale and the share card
is lost. Same for `og:locale`, which reverts to unset.

Verified in the built HTML: `NO OG:IMAGE`, `no og:locale` on all four.

- [ ] Add `images: [{ url: `${SITE}/opengraph-image`, width: 1200, height: 630, alt: … }]` and `locale: "en_IN"` to the `openGraph` block in each of the four pages
- [ ] Add a matching `twitter` block
- [ ] The root card route already exists at `src/app/opengraph-image.js` — reuse it, do not create new files

### H2 — The homepage has no page-level metadata

`src/app/(main)/page.js` exports no `metadata`, so it inherits the root layout's
defaults. Consequences measured in the build:

- Title is 71 characters — truncated
- Its description is **byte-identical** to `/upload` and the 404 page
- No homepage-specific canonical or OG copy

The homepage is the highest-authority URL on the domain and it is the one page
with no deliberate snippet.

- [ ] Add `export const metadata` to `src/app/(main)/page.js`: title ≤ 45 chars, description 140–155, `alternates.canonical: SITE`, and its own `openGraph`

### H3 — `/terms` has no `<h1>`

Open since the 23 July audit. Confirmed still true: `h1:0 h2:10`. The page opens
at H2.

- [ ] `src/app/(main)/terms/page.js` — add `<h1>Terms & Conditions</h1>` as the first heading and demote the current opening H2 if it duplicates it

### H4 — All four sitemaps stamp `lastmod` as today, every day

`src/app/sitemap/{static,lab-test,medicine-delivery,blogs}.xml/route.js` all
compute `new Date().toISOString()` at request time, with `revalidate = 86400`.
So `/terms` — unchanged in months — reports as modified today, every day.

Google learns to distrust a `lastmod` that is always current and starts ignoring
the field site-wide. You then have no way to signal a real update.

The pattern to copy already exists: `src/data/lab/cities.js` now carries an
`updated` field per city, validated to `YYYY-MM-DD`, and the lab page's schema
uses it for `dateModified`.

- [ ] `static.xml` — hardcode a real date per route
- [ ] `lab-test.xml` — use each city's `updated` field
- [ ] `medicine-delivery.xml` — add `updated` to `src/data/medicine/cityData.js` and use it
- [ ] `blogs.xml` — use `blog.updatedAt`, which already exists in `src/data/blogData.js`

### H5 — `/lab-test/varanasi` has less than half the internal links of Deoria

Deoria: 41 internal links. Varanasi: 15. The gap is the `relatedLinks` block —
Deoria defines one in `src/data/lab/cities.js`, Varanasi does not, so
`LabRelatedLinks` renders nothing for it.

Varanasi is `order: 1`, the section's default city, and the target of the
homepage and navbar links. It is the weaker page of the two on internal links.

- [ ] Add a `relatedLinks` block to the Varanasi seed entry in `src/data/lab/cities.js`
- [ ] Link only to routes that exist — the Deoria block is the template; do not copy its Deoria-district anchors

### H6 — `lang="en"` on Hinglish content

Open since 23 July. The body copy is romanised Hindi; the document declares
plain `en`. The site's own schema is now more honest than its HTML — the JSON-LD
declares `inLanguage: ["hi-IN", "en-IN"]`.

- [ ] `src/app/layout.js` — change `<html lang="en">` to `lang="en-IN"`
- [ ] Do **not** use `hi` — the script is Latin, not Devanagari
- [ ] Note the Google-Translate crash guard in `layout.js` exists because of this mismatch; the `lang` fix reduces how often Chrome offers to translate

---

## 🟡 MEDIUM

### M1 — No root `not-found.js`, `error.js` or `loading.js`

Only `src/app/(lab)/lab-test/[city]/not-found.js` exists. Any other unmatched
URL falls through to Next's bare default: no header, no footer, **zero internal
links** (confirmed in the build). A crawler that lands on a 404 finds no route
back into the site.

- [ ] `src/app/not-found.js` — with the shared header/footer and links to the main sections
- [ ] `src/app/error.js` — so a runtime error is not an unstyled crash page
- [ ] Confirm the 404 keeps `robots: noindex` (it already does)

### M2 — No `BreadcrumbList` on medicine and blog pages

Open since 23 July. The lab pages emit it; the other 8 indexable pages do not.
Breadcrumb rich results replace the raw URL in the SERP with a readable path.

- [ ] Port `breadcrumbNode()` from `src/app/(lab)/lab-test/[city]/page.js` into the medicine and blog routes
- [ ] Reference it from the page node via `breadcrumb: { "@id": … }`, the way the lab graph does
- [ ] Render a visible breadcrumb too — Google prefers markup that matches visible UI

### M3 — `next.config.mjs` has no image, header or fingerprint config

The file contains only `allowedDevOrigins`. Missing:

- [ ] `images: { formats: ["image/avif", "image/webp"] }` — AVIF is 20–30% smaller than WebP and directly moves LCP
- [ ] `poweredByHeader: false` — removes `X-Powered-By: Next.js`
- [ ] `headers()` — `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and long-lived immutable caching for `/public` assets
- [ ] Consider `compress: true` if the host is not already gzipping

### M4 — No `font-family` is declared anywhere

`next/font` is unused and `src/app/globals.css` declares no font stack, so every
device falls back to its own default — the page renders in a different typeface
on Windows, Android and iOS, at different metrics. That is a layout-shift risk
(CLS) and a consistency problem.

Note: system fonts are **fast**, and this is not a call to add a webfont.

- [ ] Add an explicit stack to `globals.css`, e.g. `font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Devanagari", sans-serif`
- [ ] Include a Devanagari fallback — `/lab-test/deoria` renders a full Hindi section
- [ ] If a brand font is ever wanted, load it via `next/font/google` with `display: "swap"` — never a raw `<link>`

### M5 — The three blog articles are the weakest-linked pages on the site

Inbound internal links, measured: every other route has 14–15. The three
`/blogs/*` articles have **4**. There is also no `/blogs` hub page — the sitemap
route comments confirm it was removed because nothing rendered there.

- [ ] Add a `/blogs` index page listing all articles, and link it from the footer
- [ ] Cross-link the three articles to each other
- [ ] Add it to `src/app/sitemap/static.xml/route.js` once it exists

### M6 — One raw `<img>` left

`src/components/medicine/CallOrder.jsx:7`. Bypasses WebP/AVIF conversion,
responsive `srcset` and lazy loading. ESLint already flags it.

- [ ] Convert to `next/image`

### M7 — Three ESLint errors

```
src/components/medicine/HowCity.jsx:42-44   Missing "key" prop for element in array
```

Missing keys cause React reconciliation bugs that can duplicate or drop DOM
nodes — content a crawler may or may not see.

- [ ] Fix all three; `npx eslint .` must exit clean

### M8 — `/contact` is thin at 253 words

The thinnest indexable page on the site. Contact pages are legitimately short,
but this one is also a **trust page** on a YMYL site — it is where a cautious
patient checks whether you are real.

- [ ] Expand with service hours, coverage areas, expected response time, and the one primary phone number
- [ ] Add `ContactPage` schema referencing the Organization `@id` from `src/lib/schema.js`

---

## Not a code issue, but blocking

These outrank most of the list above and cannot be fixed in the repo.

- [ ] **Google Business Profile category** — currently `Pharmacy`. Add `Medical laboratory`, `Diagnostic center`, `Blood testing service` or the profile stays ineligible for every lab query
- [ ] **Clear the pending "Confirm business information" prompt** on the profile
- [ ] **Pick one primary phone number.** The site currently publishes three: `6392108234` (root schema), `9891233525` (lab + medicine pages), `7303995446` (contact page WhatsApp). Inconsistent NAP is what stops Google consolidating a brand entity — the exact problem the 30 July schema work was fixing. Once chosen, it must match the GBP exactly
- [ ] **Fill `GBP_MAP_URL`** in `src/lib/schema.js` — the plumbing is in place and both `hasMap` and the Maps `sameAs` activate the moment it is set
- [ ] **Citations** — Justdial, Sulekha, IndiaMART, Practo, Bing Places, with byte-identical name, address and phone
- [ ] **Reviews** — ask every completed collection. This is the largest single lever on local pack position and there is no technical substitute for it

---

## Suggested order

**This week** — snippets. C1 and C2 together touch three data files and rewrite
every title and description on the site. Nothing else on this list changes what
a searcher actually sees in the results.

1. C1 — duplicated brand in titles
2. C2 — description lengths
3. GBP categories + the phone-number decision (5 minutes, largest single effect)

**Next week** — structure and crawl signals.

4. C3 — promote the lab section headings to H2
5. H1 — OG images on the four static pages
6. H2 — homepage metadata
7. H3 — H1 on `/terms`
8. H4 — real `lastmod` values

**The fortnight after** — hardening.

9. H5, H6, M1, M2, M3, M4
10. M5–M8

---

## Verification

Run a production build first — every check reads the prerendered HTML, which is
what Googlebot actually receives.

```bash
npx next build
```

**Titles and descriptions**

```bash
node -e "
const fs=require('fs'),path=require('path'),F=[];
(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);
e.isDirectory()?w(p):e.name.endsWith('.html')&&F.push(p)}})('.next/server/app');
for(const f of F.sort()){const s=fs.readFileSync(f,'utf8');
const t=(/<title[^>]*>([\s\S]*?)<\/title>/.exec(s)||[])[1]||'';
const d=(/<meta name=\"description\" content=\"([^\"]*)\"/.exec(s)||[])[1]||'';
const brand=(t.match(/MedicoBharat/gi)||[]).length;
console.log(f.replace('.next/server/app','').padEnd(46),'T:'+t.length,'D:'+d.length,
 t.length>60?'TITLE>60':'', d.length>160?'DESC>160':'', brand>1?'BRAND x'+brand:'');}"
```

**Heading outline of a single page**

```bash
node -e "
const s=require('fs').readFileSync('.next/server/app/lab-test/deoria.html','utf8');
const re=/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/g;let m;
while((m=re.exec(s))){const t=m[2].replace(/<[^>]*>/g,'').trim().slice(0,70);
if(t)console.log(m[1].toUpperCase()+': '+t)}"
```

**Structured data — parses, and every `@id` reference resolves**

```bash
node -e "
const fs=require('fs'),path=require('path'),F=[];
(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);
e.isDirectory()?w(p):e.name.endsWith('.html')&&F.push(p)}})('.next/server/app');
let bad=0;
for(const f of F){const s=fs.readFileSync(f,'utf8');
const re=/<script type=\"application\/ld\+json\"[^>]*>([\s\S]*?)<\/script>/g;let m;
const def=new Set(),ref=[];
while((m=re.exec(s))){let o;try{o=JSON.parse(m[1])}catch(e){console.log('PARSE FAIL',f);bad++;continue}
const walk=v=>{if(Array.isArray(v))return v.forEach(walk);if(!v||typeof v!=='object')return;
const k=Object.keys(v);if(v['@id']&&k.length===1)ref.push(v['@id']);else if(v['@id'])def.add(v['@id']);
Object.values(v).forEach(walk)};(o['@graph']||[o]).forEach(walk)}
for(const r of ref)if(!def.has(r)){console.log('DANGLING',r,'in',f);bad++}}
console.log(bad?bad+' problem(s)':'schema OK')"
```

**Off-site, after deploy**

- Rich Results Test — `https://search.google.com/test/rich-results`
- Schema validator — `https://validator.schema.org/`
- GSC → URL Inspection → **Live Test** → "View crawled page", to confirm the
  rendered HTML matches what is built locally
- GSC → Performance → Pages → filter a route → read **Average position**. That
  is the only number that says whether any of this worked
