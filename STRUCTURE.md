# Project Structure — MedicoBharat

Ye guide poore codebase ka map hai. Kabhi confuse ho ki "ye cheez kahaan hai" ya
"X change karna ho to kaun si file", to yahi dekho.

**Stack:** Next.js 16 (App Router) · React · Tailwind CSS v4 · Firebase (Firestore)

**Import alias:** `@/` = `src/` — yaani `@/components/lab/LabHero` = `src/components/lab/LabHero.jsx`

---

## Top-level map

```
medicobharat/
├── public/            → static assets (images, robots.txt, og images)
├── src/
│   ├── app/           → ROUTES (har folder = ek URL). Next.js isi se pages banata hai.
│   ├── components/    → UI ke reusable tukde (buttons, hero, footer, cards…)
│   ├── data/          → static content + seed data (JS objects)
│   └── lib/           → server-side logic, Firebase, helpers
├── next.config.mjs    → Next.js config
├── SEO-AUDIT.md       → SEO findings + checklist
└── STRUCTURE.md       → ye file
```

---

## `src/app/` — Routes (URL yahaan se bante hain)

App Router me **folder ka naam = URL ka hissa**. `page.js` = us URL ka page,
`layout.js` = uske around ka wrapper, `route.js` = API endpoint.

`(brackets)` waale folders **"route groups"** hain — sirf code organize karte hain,
URL me nahi dikhte. Inse har section ka apna layout (header/footer) milta hai.

```
src/app/
├── layout.js              → ROOT layout (poore site ka <html>/<body>, base metadata)
├── globals.css            → global styles (Tailwind import + custom CSS)
├── sitemap.js             → /sitemap.xml (auto-generated, har ghante refresh)
├── opengraph-image.js     → default social share card
│
├── (main)/                → main site (home, about, blogs…) — Navbar + Footer wala group
│   ├── layout.js          → main Navbar + Footer
│   ├── page.js            → /  (HOMEPAGE)
│   ├── about/page.js      → /about
│   ├── contact/page.js    → /contact
│   ├── privacy/page.js    → /privacy
│   ├── terms/page.js      → /terms
│   └── blogs/[category]/[city]/
│       ├── page.js        → /blogs/<category>/<city>  (blog article)
│       └── og/route.js    → us article ka share-card image
│                             (⚠ /blogs khud koi page NAHI hai — jaan-bujh kar.
│                              Kahin bhi "/blogs" link mat lagana, wo 404 dega.)
│
├── (medicine)/            → medicine delivery section
│   ├── layout.js
│   └── medicine-delivery/[city]/
│       ├── page.js        → /medicine-delivery/<city>
│       └── og/route.js    → us city ka share-card image
│
├── (lab)/                 → lab test section
│   ├── layout.js          → LabNavbar
│   └── lab-test/[city]/
│       ├── layout.js      → LabFooter (city chahiye isliye yahaan)
│       ├── page.js        → /lab-test/<city>           (lab city page)
│       └── not-found.js   → unknown city ka 404
│
├── upload/                → internal data-upload screen (robots.txt me blocked)
│
└── api/                   → backend endpoints
    ├── lab-lead/route.js       → booking form yahaan POST hoti hai (Firestore me save)
    └── revalidate-lab/route.js → Firestore change hone par page refresh trigger
```

> **Yaad rakho:** naya URL banana ho to `src/app/` me folder banao — kahin aur nahi.
> Ye folders route se bandhe hain, inhe reorganize nahi kar sakte.

---

## `src/components/` — UI tukde

Feature ke hisaab se baante hue. `[city]` page ke bade sections yahaan se aate hain.

```
src/components/
│
├── common/                → HAR page par shared
│   ├── Navbar.jsx
│   └── Footer.jsx
│
├── blog/                  → sirf /blogs pages ke liye
│   ├── BlogProse.jsx        article ka body (h2 + paragraph + inline links + images)
│   ├── BlogShare.jsx        social share buttons + follow links (sab plain <a>)
│   └── BlogCityLinks.jsx    saare sheher ka link grid (live city list se banta hai)
│
├── lab/                   → sirf LAB pages ke liye (self-contained, saaf)
│   ├── LabNavbar.jsx        header
│   ├── LabHero.jsx          upar ka hero + booking form area
│   ├── LabLeadCard.jsx      booking/enquiry form (Name, Mobile, City, Address)
│   ├── LabBookingModal.jsx  test card tap karne par khulne wala popup
│   ├── LabServices.jsx      tests + packages ka grid/slider + search
│   ├── LabTrustStrip.jsx    "free collection / 6 AM slot" promises
│   ├── LabContent.jsx       lamba SEO content + "On this page" rail
│   ├── LabFaq.jsx           FAQ accordion (+ FAQ schema)
│   ├── LabCta.jsx           call-to-action band
│   ├── LabCallBanner.jsx    footer se pehle wala call strip
│   └── LabFooter.jsx        footer (links, areas, contact)
│
└── medicine/              → MEDICINE delivery + HOMEPAGE (dono kaafi cheezein share karte)
    ├── HomeDataProvider.jsx  homepage ka poora content yahin se aata hai
    ├── Hero.jsx              hero (HeroMobile isi ke andar use hota hai)
    ├── HeroMobile.jsx        phone ke liye hero slider
    ├── CitySlider.jsx        city cards / interlinking slider
    ├── ContentPage.jsx       lamba SEO content block
    ├── Cta.jsx               call-to-action
    ├── Faq.jsx               FAQ section
    ├── HowCity.jsx           "how it works" steps
    ├── HowWork.jsx           trust/how-we-work section
    ├── MetakeyDeoria.jsx     keyword-rich SEO section
    ├── BannerImage.jsx       promo banner
    ├── CallOrder.jsx         phone-order CTA
    ├── LabTestPromo.jsx      homepage se lab section ka promo
    ├── LatestBlogs.jsx       homepage par latest blog cards
    └── SlideCat.jsx          category slider
```

> **Note:** homepage aur medicine page bahut se components share karte hain (Hero,
> Faq, Cta, ContentPage, CitySlider, HowCity, MetakeyDeoria). Isiliye ye ek hi
> `medicine/` folder me hain — alag karte to aadhe "shared" me chale jaate.

---

## `src/data/` — Static content + seed

Yahaan **sirf data hota hai (JS objects), koi logic nahi.**

```
src/data/
├── lab/
│   ├── defaults.js       → ⭐ lab page ka SAARA default content (hero, tests, prices,
│   │                          FAQs, SEO copy, footer). Nayi city yahin se ban jaati hai.
│   ├── cities.js         → lab cities ki list + har city ke override
│   └── content/          → lambi SEO copy, ek file per city (varanasi.js, deoria.js)
│
├── medicine/
│   ├── cityData.js       → medicine-delivery cities ka data
│   └── homeData.js       → homepage ka content
│
└── blogs/                → ⭐ blog articles — ek FOLDER per city
    ├── index.js            registry: blogs[], getBlog(), getRelatedBlogs(), getLatestBlogs()
    ├── shared.js           author / publisher / robots / canonical — ek jagah
    ├── varanasi/
    │   ├── index.js        is sheher ke articles ki list
    │   └── lab-test-in-varanasi.js
    └── deoria/
        ├── index.js
        └── …teen articles
```

### Naya blog kaise add karein

1. `src/data/blogs/<city>/` me nayi file banao (purani ko copy kar lo — sabse aasan).
2. `category` badlo (yahi URL banta hai: `/blogs/<category>/<city>`), phir title,
   description, keywords, sections aur faqs.
3. Usi folder ke `index.js` me import karke array me daal do.

Bas. Route, sitemap, share-card image, BlogPosting + FAQ + Breadcrumb schema,
homepage ke cards aur baaki articles ke "Aage padhiye" links — sab apne aap pick
kar lete hain. **Naya sheher** ho to folder banao aur use
`src/data/blogs/index.js` ke `CITY_BLOGS` me add kar do.

> ⚠ Image ka `src` hamesha aisi file ho jo `/public` me sach me ho. Purane
> `blogData.js` me aise path the jinki file kabhi add hi nahi hui — isliye blog
> page par ek bhi image nahi dikhti thi aur schema me 404 ja raha tha.

---

## `src/lib/` — Server logic + Firebase

Yahaan **logic aur data-fetching hoti hai.** Zyadatar SERVER-only (client components
me import mat karo).

```
src/lib/
├── site.js           → SITE URL (https://www.medicobharat.com) + url() helper + phone.
│                        Domain ek hi jagah likha hai — kabhi hardcode mat karna.
├── firebaseConfig.js → Firebase project config (keys)
├── firebase.js       → Firebase app init
├── labCities.js      → ⭐ Firestore se lab cities padhta hai (server-side reader).
│                        labDefaults.js ke saath merge karke poora city object deta hai.
├── getCity.js        → medicine city ka data laata hai
└── notifyWhatsapp.js → booking aane par owner ko WhatsApp notify karta hai
```

> `data/labCities.js` vs `lib/labCities.js` — **naam same, kaam alag.**
> `data/` = kachcha seed data. `lib/` = usse padhne/merge karne wali logic.

---

## "X change karna ho to kahaan jaun?" — quick table

| Kya badalna hai | Kahaan jaao |
|---|---|
| Lab test ka price / naya test | `src/data/lab/defaults.js` → `defaultTests()` |
| Lab page ke FAQ | `src/data/lab/defaults.js` → `defaultFaqs()` |
| Lab page ka SEO content | `src/data/lab/content/<city>.js` |
| Lab page ke in-body internal links | `src/data/lab/cities.js` → us city ka `relatedLinks` |
| **Naya blog likhna** | `src/data/blogs/<city>/` me nayi file + usi folder ke `index.js` me add |
| Blog ka author / publisher / robots | `src/data/blogs/shared.js` |
| Blog page ka layout / schema | `src/app/(main)/blogs/[category]/[city]/page.js` |
| Blog ke social share buttons | `src/components/blog/BlogShare.jsx` |
| Site ka domain / phone number | `src/lib/site.js` |
| Brand ke social profile (schema + share) | `src/lib/schema.js` → `BRAND_PROFILES` |
| Homepage ka content | `src/data/medicine/homeData.js` + `src/components/medicine/HomeDataProvider.jsx` |
| Medicine city ka data | `src/data/medicine/cityData.js` |
| Booking form ke fields | `src/components/lab/LabLeadCard.jsx` |
| Booking kahaan save hoti hai | `src/app/api/lab-lead/route.js` |
| Naya page/URL banana | `src/app/` me naya folder + `page.js` |
| Footer / Navbar (main site) | `src/components/common/` |
| Lab footer / navbar | `src/components/lab/LabFooter.jsx`, `LabNavbar.jsx` |
| Sitemap me kya aata hai | `src/app/sitemap.xml/route.js` + `src/app/sitemap/*.xml/route.js` |

---

## Naming convention

- **Components** — `PascalCase.jsx` (e.g. `LabHero.jsx`, `CitySlider.jsx`)
- **Data / logic** — `camelCase.js` (e.g. `labDefaults.js`, `getCity.js`)
- **Routes** — Next.js ke fixed naam: `page.js`, `layout.js`, `route.js`, `not-found.js`
