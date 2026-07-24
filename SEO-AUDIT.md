# MedicoBharat — Technical & On-Page SEO Audit

Audited 23 July 2026 against the `new` branch. Next.js 16.2.4, App Router.

Findings are ordered by how much traffic they are costing you, not by how hard
they are to fix. Every item names the file and the exact change.

> **Status: all four 🔴 Critical items are fixed** (23 July 2026), plus a
> duplicate-footer bug found while fixing C1. The 🟠 High and 🟡 Medium sections
> below are still open. See "What was fixed" at the bottom for exactly what
> changed and how it was verified.
>
> **Re-audit 24 July 2026:** a fresh deep-dive found **two new issues the first
> pass missed** — one of them now the single most important item on the page —
> and re-confirmed every open High/Medium is still open. See
> [**"Re-audit — 24 July 2026"**](#re-audit--24-july-2026) near the bottom.

---

## Scoreboard

| Severity | Count | Theme |
|---|---|---|
| 🔴 Critical | 4 | Pages Google cannot find, share cards that are blank, split canonicals |
| 🟠 High | 6 | Crawl signals, Core Web Vitals, missing H1 |
| 🟡 Medium | 6 | Schema gaps, error routes, dead code |

---

## 🔴 CRITICAL

### C1 — The entire lab-test section is orphaned

**Files:** `src/components/common/Navbar.jsx`, `src/components/common/Footer.jsx`

Nothing on the main site links to `/lab-test/*`. Not the navbar, not the footer,
not the homepage. The only reference anywhere in the codebase is
`src/app/sitemap.js:31`.

A sitemap tells Google a URL *exists*. Internal links tell Google it *matters* —
they are how PageRank flows and how a crawler decides how often to come back. A
page with zero internal links is treated as an isolated leaf: crawled rarely,
ranked poorly, and often not indexed at all even when it is in the sitemap.

This alone is enough to explain near-zero lab traffic.

**Fix:**
- [ ] Add "Lab Tests" to the main navbar (`Navbar.jsx`), pointing at `/lab-test/varanasi`
- [ ] Add a "Lab Tests" column or link group to the main footer (`Footer.jsx`), one link per live city
- [ ] Add a lab-test card/section to the homepage — it is your highest-authority page
- [ ] Cross-link from each medicine city page to the matching lab city page where one exists

---

### C2 — Every Open Graph image is a 404

**Files:** `src/app/layout.js:100`, `src/data/blogData.js` (`image:` on every entry)

| Referenced | Exists? |
|---|---|
| `https://www.medicobharat.com/images/og-image.jpg` | ❌ `public/images/` does not exist |
| `https://www.medicobharat.com/blogs/*.webp` (×3) | ❌ `public/blogs/` does not exist |

Consequences:
- Every WhatsApp / Facebook / LinkedIn share of your site shows a blank grey box.
  WhatsApp matters enormously for your audience — this is directly suppressing
  the sharing loop.
- The blog pages' `BlogPosting` schema (`page.js:73`) declares `image: [blog.image]`.
  A schema pointing at a 404 is **invalid**, and Google drops the rich result
  entirely rather than showing it without the picture.

**Fix:**
- [ ] Create `public/images/og-image.jpg` — 1200×630, under 300 KB, with the brand mark and a readable one-line value prop
- [ ] Create `public/blogs/` and add the three referenced `.webp` files, or repoint `blogData.js` at images that exist
- [ ] Validate with the Facebook Sharing Debugger and Google's Rich Results Test

---

### C3 — Canonical URLs are split across two domains

**Files:** `about/page.js:20`, `contact/page.js:28`, `privacy/page.js:17`, `terms/page.js:17`

These four pages declare canonicals on the **non-www** domain:

```
https://medicobharat.com/about
```

Everything else — root layout, medicine cities, lab cities, sitemap, robots.txt —
uses **www**:

```
https://www.medicobharat.com/...
```

`medicobharat.com` and `www.medicobharat.com` are different sites to Google. A
canonical pointing at a URL that 301-redirects is a contradictory signal: the
page says "index me here", the server says "no, over there". Google resolves it
eventually, but you lose crawl budget and the pages sit in "Alternate page with
proper canonical tag" limbo in Search Console.

**Fix:**
- [ ] Change all four to `https://www.medicobharat.com/...`
- [ ] Better: define `const SITE = "https://www.medicobharat.com"` once in `src/lib/site.js` and import it everywhere. Hardcoded domain strings appear in **11 places** across the app — that is how the split happened and how it will happen again.
- [ ] Confirm the host 301s non-www → www (or the reverse), and that only one is served

---

### C4 — Medicine city pages have no `og:image`

**File:** `src/app/(medicine)/medicine-delivery/[city]/page.js:49-54`

Next.js **shallow-merges** metadata. When a page defines `openGraph`, it replaces
the parent's `openGraph` object wholesale — it does not inherit missing keys. The
medicine pages define `openGraph` without `images`, so the root layout's image is
discarded and these pages ship with no OG image at all.

These are your five money pages.

**Fix:**
- [ ] Add `images: [{ url: ..., width: 1200, height: 630, alt: title }]` to the medicine `openGraph`
- [ ] Same audit for any future page that defines `openGraph`

> The lab pages already handle this correctly — see the comment at
> `src/app/(lab)/lab-test/[city]/page.js:76`.

---

## 🟠 HIGH

### H1 — Sitemap claims every page changed today, every day

**File:** `src/app/sitemap.js`

Every entry uses `lastModified: new Date()`. Each time the sitemap is fetched,
all ~15 URLs report "modified just now" — including static pages like `/terms`
that have not changed in months.

Google learns to distrust `lastmod` values that are always current and starts
ignoring the field for your whole site. You then lose the ability to signal a
real update when one happens.

**Fix:**
- [ ] Static routes: hardcode a real date, bumped by hand when the page changes
- [ ] Blog pages: use `blog.updatedAt` — it already exists in `blogData.js`
- [ ] Lab pages: add an `updatedAt` field to the Firestore documents and use it
- [ ] Medicine pages: add `updatedAt` to `cityData.js`

---

### H2 — No font optimisation

**Files:** `src/app/layout.js`, `src/app/globals.css`

`next/font` is not used anywhere, and `globals.css` imports no webfont. The site
is rendering in system fonts by default — which is actually fast — but if any
font is being pulled in via CSS or a `<link>` added later, it will block render
and cause layout shift.

**Fix:**
- [ ] If system fonts are intentional, add an explicit `font-family` stack to `globals.css` so rendering is consistent across devices
- [ ] If a brand font is wanted, load it via `next/font/google` with `display: "swap"` — never a raw `<link>` to Google Fonts

---

### H3 — Raw `<img>` tags bypass image optimisation

**Files:** `src/components/medicine/Review.jsx:58`, `src/components/medicine/CallOrder.jsx:7`, `src/components/medicine/CityStatsimg.jsx` (×6)

Eight raw `<img>` tags. These skip Next.js's automatic WebP/AVIF conversion,
responsive `srcset`, and lazy loading. ESLint is already flagging every one.

Largest Contentful Paint is a ranking factor, and an unoptimised hero image is
usually the single biggest LCP cost on a page.

**Fix:**
- [ ] Convert `Review.jsx` and `CallOrder.jsx` to `next/image`
- [ ] `CityStatsimg.jsx` is dead code — see M5

---

### H4 — `/terms` has no H1

**File:** `src/app/(main)/terms/page.js`

The page starts at `<h2>` (line 57). Every other page has an H1.

An H1 is the strongest on-page signal of what a page is about. Its absence also
breaks the heading hierarchy for screen readers.

**Fix:**
- [ ] Add `<h1>Terms & Conditions</h1>` as the page's first heading

---

### H5 — The homepage is a fully client-rendered tree

**Files:** `src/app/(main)/page.js` → `src/components/medicine/HomeDataProvider.jsx`

`HomeDataProvider` is marked `"use client"`, which makes every component below it
a client component — Hero, FAQ, city interlinking, SEO content, the lot. 28 files
in the project carry `"use client"`.

The HTML is still server-rendered, so the content **is** crawlable. But the
hydration bundle for the entire homepage ships to every visitor, which hurts
Interaction to Next Paint and Total Blocking Time — both Core Web Vitals.

**Fix:**
- [ ] Move `"use client"` down to the components that actually need interactivity (FAQ accordion, sliders, forms)
- [ ] Keep `Hero`, `ContentPage`, `MetakeyDeoria` and other static-copy components as server components
- [ ] `homeData` is a static import — it does not need a client component to read it

---

### H6 — The homepage has no page-level metadata

**File:** `src/app/(main)/page.js`

It inherits the root layout's title and description. That works, but it means the
homepage cannot be tuned independently of the site-wide defaults, and the current
default title is 71 characters — right at the truncation edge in SERPs.

**Fix:**
- [ ] Add an `export const metadata` block to `page.js` with a homepage-specific title (under 60 chars), description (under 155), canonical, and OG image

---

## 🟡 MEDIUM

### M1 — No `loading.js`, `error.js`, or root `not-found.js`

**Directory:** `src/app/`

Only `src/app/(lab)/lab-test/[city]/not-found.js` exists. A request to any
unmatched URL falls through to Next's bare default 404 — no navigation, no
internal links, no way back into the site.

**Fix:**
- [ ] Add `src/app/not-found.js` with the site header/footer and links to the main sections
- [ ] Add `src/app/error.js` so a runtime error does not show an unstyled crash page
- [ ] Add `loading.js` to the dynamic routes for a better perceived load

---

### M2 — No `BreadcrumbList` schema outside the lab section

**Files:** `medicine-delivery/[city]/page.js`, `blogs/[category]/[city]/page.js`

The lab pages emit `BreadcrumbList`; the medicine and blog pages do not.
Breadcrumb rich results replace the raw URL in the SERP with a readable path,
which measurably improves click-through.

**Fix:**
- [ ] Copy the `breadcrumbSchema` helper from `src/app/(lab)/lab-test/[city]/page.js:146` into both routes
- [ ] Also render a visible breadcrumb — Google prefers the markup to match visible UI

---

### M3 — `lang="en"` on Hinglish content

**File:** `src/app/layout.js:149`

Most of your body copy is romanised Hindi ("Ghar baithe medicines order karein").
The document declares `lang="en"`.

This is a genuine edge case with no perfect answer — `hi-Latn` is the technically
correct BCP-47 tag but has thin search-engine support. The mismatch can affect
language-targeted results and text-to-speech.

**Fix:**
- [ ] Consider `lang="en-IN"` as a pragmatic middle ground — it signals Indian English, which is closer to the truth than plain `en`
- [ ] Do not use `hi` — the script is Latin, not Devanagari

---

### M4 — No `og:locale` or `twitter:site` on several routes

Root layout sets `locale: "en_IN"`; the medicine and blog routes define their own
`openGraph` and therefore lose it (same shallow-merge trap as C4).

**Fix:**
- [ ] Add `siteName` and `locale` to the medicine and blog `openGraph` blocks

---

### M5 — Dead components still in the tree

**Files:** `src/components/medicine/CityStatsimg.jsx`, `src/components/medicine/SalempurData.jsx`

Neither is imported anywhere. Both contain an `<h1>` and, in the case of
`CityStatsimg`, six unoptimised `<img>` tags plus ESLint errors.

No direct SEO cost while they are unrendered — but they are a live risk: the
moment someone imports one, the page gets a second H1.

**Fix:**
- [ ] Delete both, or move them to a clearly-marked `_unused/` directory

---

### M6 — Pre-existing ESLint errors

```
components/medicine/HowCity.jsx:42-44   Missing "key" prop for element in array
components/medicine/Review.jsx:82       Unescaped entities
```

React key warnings cause reconciliation bugs that can produce duplicated or
missing DOM nodes — content a crawler may or may not see.

**Fix:**
- [ ] Run `npx eslint src/ --fix` and resolve the remainder by hand

---

## What is already correct

Worth stating so it is not accidentally "fixed":

- `metadataBase` is set in the root layout — relative image paths resolve properly
- Google Search Console verification tag is in place
- `robots.txt` allows crawling, disallows `/upload`, and declares the sitemap
- Every route except the homepage and `/upload` exports proper metadata
- Lab pages carry `DiagnosticLab` + `BreadcrumbList` + `FAQPage` + per-test `Offer` schema
- Medicine pages carry `MedicalBusiness` + `FAQPage` schema
- Blog pages carry `BlogPosting` + `FAQPage` schema
- Unknown lab cities return a real 404, not a redirect
- Every `next/image` above the fold uses `priority`
- Canonicals exist on every indexable route (the domain split in C3 is the only defect)
- Lab pages are ISR-backed and pick up new cities without a redeploy

---

## Suggested order of work

**This week — the traffic blockers**
1. C1 — link the lab section from the navbar, footer and homepage
2. C2 — create the missing OG images
3. C3 — unify the canonical domain, centralise `SITE` into one constant

**Next week — crawl and vitals**
4. C4 + M4 — fix the shallow-merge OG gaps
5. H1 — real `lastmod` values
6. H4 — H1 on `/terms`
7. H3 — convert the raw `<img>` tags

**The month after — structure**
8. H5 — push `"use client"` down the tree
9. M1 — error and not-found routes
10. M2 — breadcrumbs everywhere
11. M5 + M6 — delete dead code, clear lint

---

## What was fixed — 23 July 2026

All four Critical items, plus one bug found on the way.

### C1 — Lab section is now linked sitewide ✅

- `src/app/(main)/layout.js` and `src/app/(medicine)/layout.js` are now `async`
  and fetch `getLabCities()`, passing the list to the header and footer
- `src/components/common/Navbar.jsx` — "Lab Tests" link, plus a separate pill
  visible below `md` (the desktop nav is `hidden md:flex`, so phones — most of
  the traffic — previously had no route in at all)
- `src/components/common/Footer.jsx` — a "Lab Tests at Home" column with one
  keyword-bearing link per live city; the grid went from 4 to 5 columns

Because the list comes from Firestore, **a new lab city starts being linked from
every page on the site the moment it is added** — no code change.

Verified: every page now carries 3 inbound `/lab-test/` links (was 0).

### C2 — OG images now exist and resolve ✅

Rather than adding static JPGs that can drift from the brand, the cards are
generated with `next/og`:

- `src/app/opengraph-image.js` — the sitewide card
- `src/app/(main)/blogs/[category]/[city]/og/route.js` — per-article card
- `src/app/(medicine)/medicine-delivery/[city]/og/route.js` — per-city card

**Why route handlers and not `opengraph-image.js` for the dynamic routes:** the
file convention appends a content hash to the URL
(`…/opengraph-image-sbz2ut`) which moves whenever the file changes. The
BlogPosting schema has to name an image URL by hand, and a URL that moves
between builds is a URL that 404s in Google's cache. The `og/route.js` path is
stable, so og:image, twitter:image and the schema all use the same string.

Verified: all four image routes return `200 image/png`, 69–86 KB.

### C3 — One canonical domain, one constant ✅

- New `src/lib/site.js` exports `SITE` and a `url()` helper
- `about`, `contact`, `privacy` and `terms` moved from non-www to www
- `/privacy` also had an `og:url` pointing at `/privacy-policy` — a route that
  does not exist. Fixed.
- The domain is now written down **once**. It previously appeared in 11 files,
  which is how the split happened in the first place.

Verified: all 8 indexable routes report a `www` canonical matching their path.

### C4 — Medicine pages have share images ✅

`openGraph` on the medicine city pages now carries `images`, `siteName` and
`locale`; `twitter` was added alongside. The shallow-merge trap is documented in
a comment above the block so it is not reintroduced.

### Bonus — duplicate footer on the homepage ✅

Found while wiring C1: `src/app/(main)/layout.js` rendered `<Footer />` **and**
`HomeDataProvider.jsx` rendered a second one, so the homepage shipped two full
footers and two copies of every footer link. Removed the one in
`HomeDataProvider`.

Verified: the homepage now contains exactly one `<footer id="footer-section">`.

---

## Re-audit — 24 July 2026

A second deep-dive after the Critical fixes shipped. The first audit was strong
on *infrastructure* (links, canonicals, OG, schema) but did not look closely at
the **actual words on the lab pages** or at **trust/accuracy**. That is where the
two new findings are — and one of them outranks everything still open.

### 🔴 NEW-1 — Every lab city page serves Varanasi's content (duplicate + false locality)

**File:** `src/data/labDefaults.js` → `defaultContent()` (and the "areas" text in `defaultFaqs()`)

`defaultContent()` is a Varanasi article with `${city}` interpolated in. Two problems compound:

1. **The section IDs are hardcoded to Varanasi** — `id: "lab-test-in-varanasi"`,
   `"home-sample-collection-varanasi"`, `"popular-blood-tests-varanasi"`, … 9 of them.
2. **The prose states Varanasi-only facts** — "poore Purvanchal ka healthcare
   centre", "Chandauli, Jaunpur, Ghazipur, Mirzapur…", and real Varanasi mohallas
   (Lanka, Sunderpur, Assi Ghat, Sarnath, Bhelupur, Cantt).

On any city that is **not** Varanasi (Deoria, Gorakhpur, …) this content is both
**near-duplicate** and **factually wrong** — it tells a Deoria reader their
samples go to labs in Lanka and Sarnath.

**Why it's now the #1 item:** Google's guidance on *doorway pages* and
*scaled content abuse* targets exactly this — many URLs that differ only by a
place-name in otherwise identical copy. The whole `/lab-test/*` cluster is at
risk of being demoted or de-indexed together, which caps the very traffic C1 was
meant to unlock. C1 gave these pages internal links; NEW-1 is what stops them
ranking once crawled.

**Fix:**
- [ ] Rename the section IDs to be generic (`lab-test-intro`, `home-collection`,
      `popular-tests`, …). No place-name in an ID that every city reuses.
- [ ] Strip Varanasi-specific facts out of `defaultContent()` so the fallback is
      genuinely city-agnostic (no "Purvanchal", no named districts, no mohallas).
- [ ] Put the real local detail (neighbouring areas, actual localities, local
      price notes) in each **Firestore city document**, which already overrides
      the defaults via `mergeLabCityContent()`.
- [ ] Until a city has unique, true local copy, **don't publish it** — or
      `noindex` it. Five distinct pages beat fifty templated ones.

**Verify:** in Search Console → URL Inspection → "View crawled page" on a
non-Varanasi city, confirm the rendered text names *that* city's localities, not
Varanasi's. Watch "Duplicate without user-selected canonical" in the Pages report.

### 🔴 NEW-2 — "NABL" accreditation claims are back in the content

**File:** `src/data/labDefaults.js` — 6 occurrences of "NABL"

The long-form copy again references NABL-accredited labs and "NABL-signed"
reports. Per the project's own record (and the removal on 23 July 2026), the
partner labs are **not** NABL-accredited. This regressed when the Varanasi
article was pasted in.

**Why it matters:** health content is **YMYL** — Google applies its strictest
E-E-A-T standard. An unverifiable accreditation claim is both a quality-score
liability and a real-world trust/compliance problem. It also contradicts the
site's own earlier decision.

**Fix:**
- [ ] Remove or rewrite every NABL reference so the page never claims — or lets a
      reader infer — accreditation the operation does not hold.
- [ ] "How to choose a trustworthy lab" phrasing is fine *as education*, but must
      not read as a claim about MedicoBharat's own service.

### Two smaller additions the first pass didn't list

- **JSON-LD on the medicine page loads via `next/script`** (`medicine-delivery/[city]/page.js`, `<Script id="faq-schema">`, default `afterInteractive`). The lab and blog pages inline it as a server `<script type="application/ld+json">`, which is the reliable pattern. Move the medicine JSON-LD to a plain server `<script>` too.
- **No sitewide `Organization` + `WebSite` schema.** The root layout has `Pharmacy` only. Add an `Organization` (logo, `sameAs`, contactPoint) and a `WebSite` node with `SearchAction` — the first feeds the brand Knowledge Panel, the second can enable a sitelinks search box.
- **`next.config.mjs` has no `images` / `headers()` config.** Add `images.formats: ['image/avif','image/webp']` (+ `remotePatterns` if any remote image stays), `poweredByHeader: false`, and security/cache headers (HSTS, `X-Content-Type-Options`, immutable caching for `/public`).

### Status of the previously-open items (re-verified 24 July 2026)

| Item | Status |
|---|---|
| H1 — sitemap `lastModified` always "now" | 🔴 still open (`sitemap.js` still `new Date()`) |
| H3 — 8 raw `<img>` tags | 🔴 still open (CityStatsimg ×6, CallOrder ×1, Review ×1) |
| H4 — `/terms` has no H1 | 🔴 still open |
| H5 — homepage fully client-rendered | 🔴 still open (`HomeDataProvider` still `"use client"`) |
| H6 — homepage no page-level metadata | 🔴 still open |
| M1 — no root `not-found.js` / `error.js` / `loading.js` | 🔴 still open |
| M2 — breadcrumbs only on lab pages | 🔴 still open |
| M3 — `lang="en"` on Hinglish content | 🔴 still open (also the root cause of the Google-Translate `removeChild` crash — a client-side guard was added to `layout.js`, but the correct `lang` is still the real fix) |
| M5 — dead components (`CityStatsimg`, `SalempurData`) | 🔴 still open |
| M6 — ESLint errors | 🔴 still open |

### Revised order of work

1. **NEW-1** — de-duplicate the lab content (biggest traffic lever now that the links exist).
2. **NEW-2** — pull the NABL claims (trust + compliance; quick).
3. Then the previously-planned H1 → H3 → H4, and the structure items (H5, M1, M2).

---

## The one thing to understand

Your technical SEO foundation is genuinely good — schema coverage, canonicals,
sitemap, ISR, metadata are all better than most sites this size.

The problem is not that Google cannot understand your pages. It is that **Google
has no reason to visit half of them.** The lab section has zero inbound internal
links, and the pages that *are* linked share their authority with nothing else.

Fix C1 first. Everything else is a multiplier on traffic you are not yet getting.
