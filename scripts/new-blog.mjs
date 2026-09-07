/**
 * Scaffold a blog post.
 *
 *   npm run blog:new <category> <city>
 *   npm run blog:new lab-test gorakhpur   →  content/blogs/gorakhpur/lab-test.json
 *
 * The file it writes is a complete, valid post with every field shown once, so
 * the shape never has to be remembered or copied out of an existing article.
 *
 * It exists because the two arguments here ARE the URL, and getting them wrong
 * is the one mistake that is expensive later: a live URL cannot be renamed
 * without 404-ing whatever already links to it. So the slugs are validated and
 * echoed back as the route before anything is written, and an existing file is
 * never overwritten.
 *
 * Writing the file by hand is equally fine — nothing registers a post except
 * its own presence on disk. See content/blogs/README.md.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const CONTENT_DIR = path.join(process.cwd(), "content", "blogs");

/** Same rules as slugify in src/lib/blogs/normalise.js — the URL must match. */
const slugify = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const titleCase = (slug) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const die = (message) => {
  console.error(`\n  ${message}\n`);
  process.exit(1);
};

const [rawCategory, rawCity] = process.argv.slice(2);

if (!rawCategory || !rawCity) {
  die(
    [
      "Usage:  npm run blog:new <category> <city>",
      "",
      "  npm run blog:new lab-test gorakhpur",
      "      → content/blogs/gorakhpur/lab-test.json",
      "      → /blogs/lab-test/gorakhpur",
      "",
      "Category aur city hi URL banate hain, isliye dono soch kar dijiye.",
    ].join("\n")
  );
}

const category = slugify(rawCategory);
const city = slugify(rawCity);

if (!category || !city) {
  die(`"${rawCategory}" / "${rawCity}" se koi URL nahi banta — a-z, 0-9 aur "-" hi chalte hain.`);
}

if (category !== rawCategory || city !== rawCity) {
  console.log(`  Slug banaya gaya: ${rawCategory}/${rawCity} → ${category}/${city}`);
}

const dir = path.join(CONTENT_DIR, city);
const file = path.join(dir, `${category}.json`);

// Never clobber an article. Overwriting a live post with a template is the one
// unrecoverable thing this script could do.
try {
  const existing = await readdir(dir);
  if (existing.includes(`${category}.json`)) {
    die(
      `content/blogs/${city}/${category}.json pehle se hai — /blogs/${category}/${city} live hai.\n` +
        "  Usi file ko edit kijiye, ya doosra category naam chuniye."
    );
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  // No folder for this city yet — that is fine, it is created below.
}

const cityName = titleCase(city);
const categoryName = titleCase(category);
const today = new Date().toISOString().slice(0, 10);

/* Every field the loader understands, each one filled in with something that
   renders — so the first `npm run dev` shows a real page rather than a blank
   one, and the placeholder text is obvious enough to be impossible to ship by
   accident. `order` is 100 so a new post lands after the curated ones without
   disturbing them; drop it to 10/20/30 to place it deliberately. */
const template = {
  title: `${cityName} Me ${categoryName} — TITLE YAHAN LIKHIYE`,
  description: `TODO: 150-160 character ka description — Google ke result me yahi line dikhegi. ${cityName} ka naam isme hona chahiye.`,
  keywords: [
    `${categoryName} in ${cityName}`,
    `${cityName} me ${category.replace(/-/g, " ")}`,
  ],
  publishedAt: today,
  updatedAt: today,
  order: 100,
  takeaways: [
    "TODO: pehli baat jo padhne wale ko milni chahiye.",
    "TODO: doosri.",
    "TODO: teesri.",
  ],
  sections: [
    {
      id: "shuruaat",
      heading: "TODO: pehli heading",
      lead: "TODO: ek line ka summary, heading ke neeche (chahein to hata dijiye).",
      blocks: [
        "TODO: pehla paragraph.",
        [
          "Beech me link aise deta hai: ",
          { text: `${cityName} ka lab page`, href: `/lab-test/${city}` },
          ".",
        ],
        { list: ["TODO: point ek", "TODO: point do"] },
        {
          note: {
            title: "Dhyaan dein",
            text: "TODO: callout. tone \"info\" ya \"warn\".",
            tone: "info",
          },
        },
      ],
    },
  ],
  faqs: [
    {
      q: `TODO: ${cityName} ke baare me ek asli sawaal?`,
      a: "TODO: seedha jawaab, do-teen line me.",
    },
  ],
};

await mkdir(dir, { recursive: true });
await writeFile(file, `${JSON.stringify(template, null, 2)}\n`, "utf8");

console.log(
  [
    "",
    `  Ban gaya:  content/blogs/${city}/${category}.json`,
    `  URL:       /blogs/${category}/${city}`,
    "",
    "  Ab us file me apna content likhiye, phir:",
    "",
    "    npm run dev     # dekhne ke liye",
    "",
    "  Kahin koi list update nahi karni — file hi post hai.",
    "  Fields ki poori list: content/blogs/README.md",
    "",
  ].join("\n")
);
