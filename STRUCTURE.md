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
│       ├── page.js        → /blogs/<category>/<city>   (blog article)
│       └── og/route.js    → us article ka share-card image
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
├── labDefaults.js   → ⭐ lab page ka SAARA default content (hero, tests, prices, FAQs,
│                        SEO copy, footer). Ek nayi city ka page yahin se ban jaata hai.
├── labCities.js     → lab cities ka SEED/fallback data (jab Firestore na mile)
├── cityData.js      → medicine-delivery cities ka data
├── homeData.js      → homepage ka content
└── blogData.js      → blog articles ka content
```

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
| Lab test ka price / naya test | `src/data/labDefaults.js` → `defaultTests()` (ya Firestore me us city ka doc) |
| Lab page ke FAQ | `src/data/labDefaults.js` → `defaultFaqs()` |
| Lab page ka SEO content | `src/data/labDefaults.js` → `defaultContent()` |
| Site ka domain / phone number | `src/lib/site.js` |
| Homepage ka content | `src/data/homeData.js` + `src/components/medicine/HomeDataProvider.jsx` |
| Medicine city ka data | `src/data/cityData.js` |
| Booking form ke fields | `src/components/lab/LabLeadCard.jsx` |
| Booking kahaan save hoti hai | `src/app/api/lab-lead/route.js` |
| Naya page/URL banana | `src/app/` me naya folder + `page.js` |
| Footer / Navbar (main site) | `src/components/common/` |
| Lab footer / navbar | `src/components/lab/LabFooter.jsx`, `LabNavbar.jsx` |
| Sitemap me kya aata hai | `src/app/sitemap.js` |

---

## Naming convention

- **Components** — `PascalCase.jsx` (e.g. `LabHero.jsx`, `CitySlider.jsx`)
- **Data / logic** — `camelCase.js` (e.g. `labDefaults.js`, `getCity.js`)
- **Routes** — Next.js ke fixed naam: `page.js`, `layout.js`, `route.js`, `not-found.js`
