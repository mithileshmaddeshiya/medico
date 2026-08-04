# Project Structure — MedicoBharat

Ye guide poore codebase ka map hai. Kabhi confuse ho ki "ye cheez kahaan hai" ya
"X change karna ho to kaun si file", to yahi dekho.

**Stack:** Next.js 16 (App Router) · React · Tailwind CSS v4 · Firebase (Firestore)

**Import alias:** `@/` = `src/` — yaani `@/components/lab/LabHero` = `src/components/lab/LabHero.jsx`

---

## ⚠ Sabse pehle: ye site SIRF lab test ki hai

Pehle is site par do section the — medicine delivery aur lab test — aur homepage
medicine delivery ka tha. Google isi wajah se poore domain ko "online pharmacy"
maanta tha, aur lab test ke pages kabhi theek se rank nahi kar paaye.

**Medicine section poori tarah hata diya gaya hai.** Uske saare URL permanent
redirect (308) par hain, `next.config.mjs` me:

| Purana URL | Ab jaata hai |
|---|---|
| `/medicine-delivery/{deoria,salempur,barhaj,lar,bhatni}` | `/lab-test/deoria` |
| `/blogs/{online-medicine-delivery,medicine-home-delivery,buy-medicines-online}/deoria` | `/lab-test/deoria` |
| `/medicine-delivery/*` (baaki kuch bhi) | `/lab-test/varanasi` |

> **Ye redirects kabhi mat hataana.** Jab tak kahin bhi purane URL ka link
> zinda hai — aur search index me wo saalon rehta hai — redirect chahiye.
>
> Aur **medicine ka koi bhi content wapas mat jodna** — na page, na blog, na
> schema node, na footer link. Poori site ka ek hi topic hona hi wo cheez hai
> jiske liye ye rewrite hua.

---

## Do niyam jo har content file par laagu hote hain

**1. Jo daawa sach me nahi kar sakte, wo kahin mat likhna.**
NABL accreditation nahi hai. 24x7 khule nahi hain. Pathologist verification,
cold chain, barcode tracking — inme se kuch bhi confirm nahi hai. Jo confirmed
hai sirf wahi likha ja sakta hai:

- free home sample collection, koi visiting charge nahi
- trained phlebotomist jiske paas ID card hota hai
- slot subah 6 baje se, saaton din
- report 24 ghante me, WhatsApp aur email par PDF
- payment collection ke waqt — cash ya UPI

**2. Homepage aur city pages ka content alag hona chahiye.**
City pages "mere sheher me lab test" ka jawab dete hain (rate, ilaake, booking).
Homepage un sawaalon ka jawab deta hai jinme sheher hota hi nahi — kaun sa test
kab, kis umar me kya screening, process kaisa chalta hai. Dono jagah ek hi baat
likhi to Google chaar me se ek page index karta hai, baaki filter kar deta hai.

---

## `src/app/` — Routes (URL yahaan se bante hain)

App Router me **folder ka naam = URL ka hissa**. `page.js` = us URL ka page,
`layout.js` = uske around ka wrapper, `route.js` = API endpoint.

`(brackets)` waale folders **"route groups"** hain — sirf code organize karte hain,
URL me nahi dikhte.

```
src/app/
├── layout.js              → ROOT layout (<html>/<body>, site-wide metadata,
│                             Organization + WebSite schema)
├── globals.css            → global styles (Tailwind import + custom animations)
├── sitemap.xml/route.js   → sitemap INDEX (teen child sitemaps par point karta hai)
├── sitemap/*.xml/route.js → static.xml, lab-test.xml, blogs.xml
├── opengraph-image.js     → default social share card
│
├── (main)/                → home, about, contact, privacy, terms, blogs
│   ├── layout.js          → LabNavbar + LabFooter (site-wide mode)
│   ├── page.js            → /  (HOMEPAGE — lab test ka front door)
│   ├── about/page.js      → /about
│   ├── contact/page.js    → /contact
│   ├── privacy/page.js    → /privacy
│   ├── terms/page.js      → /terms
│   └── blogs/[category]/[city]/
│       ├── page.js        → /blogs/<category>/<city>  (guide article)
│       └── og/route.js    → us article ka share-card image
│                             (⚠ /blogs khud koi page NAHI hai — jaan-bujh kar.
│                              Kahin bhi "/blogs" link mat lagana, wo 404 dega.)
│
├── (lab)/                 → lab test city section
│   ├── layout.js          → LabNavbar
│   └── lab-test/[city]/
│       ├── layout.js      → LabFooter (city chahiye isliye yahaan)
│       ├── page.js        → /lab-test/<city>
│       └── not-found.js   → unknown city ka 404
│
└── api/
    └── lab-lead/route.js  → booking form yahaan POST hoti hai (Firestore me save)
```

> **Yaad rakho:** naya URL banana ho to `src/app/` me folder banao — kahin aur nahi.

---

## `src/components/` — UI tukde

```
src/components/
│
├── lab/                   → lab pages KE SAATH-SAATH poori site ka chrome
│   ├── LabNavbar.jsx        ⭐ SITE KA EKMATRA HEADER — har layout isi ko mount
│   │                          karta hai. City dropdown + guides menu + mobile
│   │                          sheet. `labCities` aur `guides` props se aate hain.
│   ├── LabFooter.jsx        ⭐ SITE KA EKMATRA FOOTER — do mode me chalta hai:
│   │                          `city` ke saath = city footer (us sheher ke ilaake,
│   │                          contact block); `city` ke bina = site-wide footer.
│   ├── LabHero.jsx          city page ka hero + booking form
│   ├── LabLeadCard.jsx      booking form (Name, Mobile, City, Address)
│   ├── LabBookingModal.jsx  test card tap karne par khulne wala popup
│   ├── LabServices.jsx      tests + packages ka grid/slider + search
│   │                          (`city` optional — homepage bina city ke use karta hai)
│   ├── LabTrustStrip.jsx    "free collection / 6 AM slot" promises
│   ├── LabContent.jsx       lamba SEO content + "On this page" rail
│   ├── LabFaq.jsx           FAQ accordion (+ FAQPage schema)
│   ├── LabCta.jsx           call-to-action band
│   ├── LabCallBanner.jsx    footer se pehle wala call strip
│   ├── LabRelatedLinks.jsx  in-body internal link block
│   └── BookFormLink.jsx     "#book" tak scroll, URL me hash chhode bina
│
├── home/                  → sirf HOMEPAGE ke liye (jo city pages par nahi hai)
│   ├── HomeHero.jsx         visible h1 + promises + booking form
│   ├── HomeCities.jsx       ⭐ city cards — site ka sabse zaroori internal link
│   ├── HomeSteps.jsx        "booking se report tak" 4 steps
│   ├── HomeWhy.jsx          trust cards (aakhri card: "jo daawa nahi karte")
│   └── HomeGuides.jsx       latest blog cards
│
└── blog/                  → sirf /blogs pages ke liye
    ├── BlogProse.jsx        article ka body
    ├── BlogShare.jsx        social share buttons
    └── BlogCityLinks.jsx    saare sheher + guides ka link grid
```

> **Homepage baaki sab lab components reuse karta hai** — LabTrustStrip,
> LabServices, LabFaq, LabCta, LabCallBanner, LabContent, LabRelatedLinks.
> Ye jaan-bujh kar hai: price grid do jagah likha hota to ek jagah ka rate
> purana pad jaata, aur homepage ka price city page se alag dikhna sabse bura
> hai.

---

## `src/data/` — Static content

Yahaan **sirf data hota hai (JS objects), koi logic nahi.**

```
src/data/
├── home.js               → ⭐ HOMEPAGE ka SAARA content — metadata, hero,
│                             steps, trust cards, FAQs, lambi SEO copy,
│                             related links. Homepage ka koi bhi shabd
│                             badalna ho to yahin.
│
├── lab/
│   ├── defaults.js       → ⭐ lab page ka SAARA default content (hero, tests,
│   │                         prices, FAQs, footer). Homepage bhi yahin se
│   │                         tests, filters, trust strip aur footer leta hai.
│   ├── cities.js         → lab cities ki list + har city ke override
│   └── content/          → lambi SEO copy, ek file per city
│                            (varanasi.js, deoria.js, gorakhpur.js)
│
└── blogs/                → guide articles — ek FOLDER per city
    ├── index.js            registry: blogs[], getBlog(), getRelatedBlogs(),
    │                       getLatestBlogs()
    ├── shared.js           author / publisher / robots / canonical
    └── varanasi/
        ├── index.js        is sheher ke articles ki list
        ├── lab-test-in-varanasi.js
        └── full-body-checkup-in-varanasi.js
```

### Naya blog kaise add karein

1. `src/data/blogs/<city>/` me nayi file banao (purani ko copy kar lo).
2. `category` badlo (yahi URL banta hai: `/blogs/<category>/<city>`), phir title,
   description, keywords, sections aur faqs.
3. Usi folder ke `index.js` me import karke array me daal do.

Bas. Route, sitemap, share-card image, BlogPosting + FAQ + Breadcrumb schema,
homepage ke cards, navbar aur footer ke guide links, aur baaki articles ke "Aage
padhiye" links — sab apne aap pick kar lete hain. **Naya sheher** ho to folder
banao aur use `src/data/blogs/index.js` ke `CITY_BLOGS` me add kar do.

> ⚠ Image ka `src` hamesha aisi file ho jo `/public` me sach me ho.

---

## `src/lib/` — Server logic + Firebase

Zyadatar SERVER-only (client components me import mat karo).

```
src/lib/
├── site.js           → SITE URL (https://www.medicobharat.com) + url() helper.
│                        Domain ek hi jagah likha hai — kabhi hardcode mat karna.
├── schema.js         → brand entity: Organization + WebSite node, stable @id,
│                        BRAND_PROFILES, GBP_MAP_URL, graph() aur ldJson()
├── shell.js          → ⭐ header/footer ko chahiye data (cities + guides) ek
│                        jagah. Teenon layout yahi call karte hain.
├── labCities.js      → LAB_CITIES par thin reader (getLabCities, getLabCity…)
├── firebaseConfig.js → Firebase project config
├── firebase.js       → Firebase app init
└── notifyWhatsapp.js → booking aane par owner ko WhatsApp notify karta hai
```

---

## "X change karna ho to kahaan jaun?" — quick table

| Kya badalna hai | Kahaan jaao |
|---|---|
| **Homepage ka koi bhi shabd** | `src/data/home.js` |
| Homepage ka layout / section order | `src/app/(main)/page.js` |
| Lab test ka price / naya test | `src/data/lab/defaults.js` → `defaultTests()` |
| City page ke FAQ | `src/data/lab/defaults.js` → `defaultFaqs()`, ya us city ke `content/<city>.js` |
| City page ka SEO content | `src/data/lab/content/<city>.js` |
| City page ke in-body internal links | `src/data/lab/cities.js` → us city ka `relatedLinks` |
| **Naya sheher jodna** | `src/data/lab/cities.js` → `LAB_CITY_SEED` + `content/<city>.js` |
| **Naya blog likhna** | `src/data/blogs/<city>/` me nayi file + usi folder ke `index.js` me add |
| Blog ka author / publisher / robots | `src/data/blogs/shared.js` |
| Blog page ka layout / schema | `src/app/(main)/blogs/[category]/[city]/page.js` |
| Site ka domain | `src/lib/site.js` |
| Phone / email / social / hours | `src/data/lab/defaults.js` → `LAB_PHONE`, `defaultFooter()` |
| Brand ke social profile (schema) | `src/lib/schema.js` → `BRAND_PROFILES` |
| Google Business Profile ka Maps link | `src/lib/schema.js` → `GBP_MAP_URL` |
| Navbar ke links / mobile menu | `src/components/lab/LabNavbar.jsx` |
| Footer ke columns | `src/components/lab/LabFooter.jsx` |
| Booking form ke fields | `src/components/lab/LabLeadCard.jsx` |
| Booking kahaan save hoti hai | `src/app/api/lab-lead/route.js` |
| Redirects | `next.config.mjs` |
| Sitemap me kya aata hai | `src/app/sitemap.xml/route.js` + `src/app/sitemap/*.xml/route.js` |

---

## Naming convention

- **Components** — `PascalCase.jsx` (e.g. `LabHero.jsx`, `HomeCities.jsx`)
- **Data / logic** — `camelCase.js` (e.g. `defaults.js`, `labCities.js`)
- **Routes** — Next.js ke fixed naam: `page.js`, `layout.js`, `route.js`, `not-found.js`
