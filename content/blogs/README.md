# Blogs — naya post kaise daalein

Ek blog = ek JSON file. Bas.

```
content/blogs/<sheher>/<category>.json   →   /blogs/<category>/<sheher>
```

Misaal ke liye `content/blogs/varanasi/lab-test.json` ka URL hai
`https://www.medicobharat.com/blogs/lab-test/varanasi`.

**Folder ka naam = sheher. File ka naam = category. Dono milkar URL banate hain.**
Isliye file ka naam soch samajh kar rakhiye — wahi Google me dikhega, aur ek
baar live ho jaane ke baad usse badalna matlab purana URL 404 ho jaana.

## Naya post

```bash
npm run blog:new lab-test gorakhpur
```

Yeh `content/blogs/gorakhpur/lab-test.json` bana dega — sahi shape ke saath,
example fields bhare hue. Ab bas usme apna content likhiye.

Chahein to file khud haath se bhi bana sakte hain; script sirf typing bachati
hai.

Post likhne ke baad:

```bash
npm run dev     # dekhne ke liye — file save karte hi refresh par dikh jayega
npm run build   # deploy se pehle; yahin par galti pakdi jayegi
```

**Kahin koi list update nahi karni.** Route, `/blogs` listing, sitemap, OG share
card, schema, home page ka rail, related-articles — sab apne aap utha lete hain.

## Ek post me kya-kya likh sakte hain

Sirf `title` aur `description` zaroori hain. Baaki sab optional.

| Field | Kya hai |
|---|---|
| `title` | h1 aur browser tab ka title. ~45-55 character rakhein — site apne aap `\| MedicoBharat` jodti hai |
| `description` | Google ke result me dikhne wali line. 150-160 character |
| `keywords` | String ka array. 10-15 se zyada ka fayda nahi |
| `publishedAt` | `"2026-09-07"` — yahi format, warna date nahi padhi jayegi |
| `updatedAt` | Post revise karein to badlein. Na dein to `publishedAt` maan liya jata hai |
| `order` | Us sheher ki list me kaunse number par. Chhota number pehle. 10, 20, 30… rakhein taaki beech me daalne ki jagah bache |
| `cityName` | Sirf tab jab folder ka naam se theek naam na bane — "bhatpar-rani" → "Bhatpar Rani" apne aap ban jata hai |
| `readingMinutes` | Na dein to shabdon se apne aap nikal aata hai. Yahi behtar hai |
| `hero` | `{ "src": "/…", "alt": "…" }`. ⚠ `src` /public me sach me maujood honi chahiye |
| `noindex` | `true` karne par post live to rahega par sitemap se hat jayega aur Google use index nahi karega |
| `takeaways` | 3-4 line ka box, intro ke neeche. Jo sirf skim karta hai wo yahi padhta hai |
| `sections` | Article ka body — neeche dekhiye |
| `faqs` | `[{ "q": "…", "a": "…" }]`. FAQ rich result inhi se banta hai |
| `relatedLinks` | Haath se chune hue link ka block |

`canonical`, `robots`, `author`, `publisher` **likhne ki zaroorat nahi** — wo har
post par ek jaise hote hain, isliye code khud jod deta hai
(`src/lib/blogs/normalise.js`).

## Section ka dhaancha

```json
{
  "sections": [
    {
      "id": "fasting-aur-taiyari",
      "heading": "Fasting aur taiyari",
      "lead": "Ek line ka summary, heading ke neeche.",
      "blocks": [
        "Ek saada paragraph.",

        ["Beech me link: ", { "text": "rate list", "href": "/lab-test/varanasi#lab-test-price-varanasi" }, " dekh lijiye."],

        { "list": ["Pehli baat", "Doosri baat"] },

        { "table": {
            "head": ["Test", "Fasting"],
            "rows": [["Sugar (FBS)", "8-10 ghante"], ["CBC", "Zaroori nahi"]]
        }},

        { "note": { "title": "Dhyaan dein", "text": "Paani peete rahiye.", "tone": "warn" } }
      ]
    }
  ]
}
```

`tone` sirf `"info"` (default) ya `"warn"` ho sakta hai.

⚠ **`id` kabhi mat badaliye** jab post live ho chuka ho. Wo heading ka anchor
hai — `/blogs/lab-test/varanasi#fasting-aur-taiyari` — aur badalne par har wo
link toot jayega jo kisi ne share kiya ho. `id` na dein to heading se apne aap
ban jata hai, par likh dena behtar hai kyunki tab heading badalne se anchor
nahi toot-ta.

## Content ke niyam — inhe todiye mat

Yeh niyam is business ke hain, code ke nahi. Code inhe nahi rok sakta.

- **Koi price nahi.** Rate sirf `src/data/lab/content/<sheher>.js` me rehte
  hain. Post me jahan number likhna ho, wahan `#lab-test-price-<sheher>` ka
  link dijiye. Isse rate ek jagah rehta hai aur paanch page par alag-alag
  nahi ho jata.
- **Sirf paanch daawe** jo business sach me karta hai: free home collection,
  ID card wala trained phlebotomist, subah 6 baje se slot, 24 ghante me report,
  collection par cash/UPI.
- **NABL nahi, "certified" nahi, "sabse sasta" nahi**, Deoria me walk-in counter
  nahi, aur X-ray / ultrasound / ECG nahi — yeh hamari service nahi hai, aur
  jahan padhne wala aisa maan sakta hai wahan saaf mana kiya jata hai.

## Ek naye sheher ka pehla post

Bas folder bana dijiye — `content/blogs/<sheher>/` — aur usme file daal dijiye.
Aur kuch nahi karna.

Agar us sheher ka lab page bhi hai (`src/data/lab/cities.js` me), to breadcrumb
aur CTA apne aap us page se jud jayenge. Nahi hai to bhi post theek chalega,
bas wo link nahi dikhega — kyunki jo link resolve na ho, wo link nahi hota.

## Ek naya article kis sawaal ka jawab de?

Naya post tabhi banaiye jab wo aisa sawaal uthata ho jo baaki nahi uthate.
Abhi ke lanes:

```
/lab-test/<sheher>                       → "book kahan se" — form, rate, menu
/blogs/lab-test/<sheher>                 → "kaun sa test kab" (clinical)
/blogs/pathology-lab/<sheher>            → "sample dene kahan" (geography, bharosa)
/blogs/home-sample-collection/<sheher>   → "ghar par kaise hota hai" (process)
/blogs/full-body-checkup/<sheher>        → "kaun sa package, kitne ka"
/blogs/diabetes-thyroid-test/<sheher>    → sugar, thyroid, lipid
/blogs/dengue-typhoid-test/<sheher>      → bukhar — kis din kaun sa test
/blogs/liver-kidney-test/<sheher>        → LFT aur KFT
/blogs/vitamin-b12-d-test/<sheher>       → thakan, khoon ki kami, vitamin
```

Do post jo ek hi sawaal ka jawab dete hain, wo ek doosre ko kha jate hain.

## Code kahan hai

- `src/lib/blogs/index.js` — file padhne aur list banane wala code
- `src/lib/blogs/normalise.js` — post ka shape aur default fields
- `src/app/(main)/blogs/[category]/[city]/page.js` — article ka page
- `src/app/(main)/blogs/page.js` — `/blogs` listing

Yeh folder **bundle me nahi jata**. Chahe 15 post ho ya 15,000, browser sirf
utna hi JavaScript download karta hai — kyunki article ka text code nahi, data
hai, aur listing pages sirf title aur description padhte hain, poora body nahi.
