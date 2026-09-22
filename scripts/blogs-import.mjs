/**
 * Copy the articles in content/blogs/ into MySQL so the panel can edit them.
 *
 *   npm run blogs:import            add anything not already in the table
 *   npm run blogs:import -- --force overwrite rows that are already there
 *
 * ── THE FILES ARE NOT TOUCHED ────────────────────────────────────────────
 * Nothing is moved, rewritten or deleted. content/blogs/ stays exactly as it
 * is, and it stays the fallback the site serves when the database cannot be
 * reached (see src/lib/blogs/index.js). Import is additive and reversible: set
 * a row back to draft and the file takes over again on the next read.
 *
 * ── THE STRUCTURED SECTIONS ARE KEPT AS THEY ARE ─────────────────────────
 * A post is imported with its `sections` intact, NOT converted to HTML. So an
 * imported article renders through BlogProse exactly as it does today — same
 * tables, same callouts, same anchors. The conversion to editable HTML happens
 * the first time somebody opens it in the editor, and only then. A migration
 * that silently rewrote fifty articles' markup would be very hard to check and
 * impossible to undo.
 *
 * ── IMPORTED POSTS ARRIVE PUBLISHED ──────────────────────────────────────
 * Because they already are. These URLs are live and indexed right now;
 * importing them as drafts would take fifty pages off the site the moment the
 * database became the source. A post whose file says `noindex` keeps that.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

import { ADMIN_SCHEMA, MIGRATIONS } from "../src/lib/admin/schema.js";
import { runMigrations } from "../src/lib/admin/migrate.js";
import { SCHEMA } from "../src/lib/dbSchema.js";

const force = process.argv.includes("--force");
const CONTENT = path.join(process.cwd(), "content", "blogs");

const slugify = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const titleCase = (slug) =>
  String(slug ?? "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/** Plain text of a paragraph's parts, for the word count. */
const textOf = (para) =>
  (Array.isArray(para) ? para : [para])
    .map((part) => (typeof part === "string" ? part : (part?.text ?? "")))
    .join("");

/** The same ~200 wpm estimate src/lib/blogs/normalise.js uses. */
function readingMinutes(sections) {
  const words = (sections ?? [])
    .flatMap((section) => {
      const blocks = section.blocks ?? section.paras ?? (section.content ? [section.content] : []);
      return blocks.map((block) => {
        if (typeof block === "string" || Array.isArray(block)) return textOf(block);
        if (block?.list) return block.list.map(textOf).join(" ");
        if (block?.table) return (block.table.rows ?? []).flat().map(textOf).join(" ");
        if (block?.note) return block.note.text ?? "";
        return "";
      });
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 200));
}

/**
 * A file's sections, normalised into the shape blog_sections/BlogProse expect.
 *
 * This mirrors normaliseSection() in src/lib/blogs/normalise.js. It is
 * duplicated rather than imported because that module imports from "@/lib/…"
 * aliases that only exist inside the Next build, and a migration script should
 * not need a bundler to run.
 */
function normaliseSections(raw, id) {
  return (raw.sections ?? []).map((section, index) => {
    const heading = String(section?.heading ?? "").trim();
    if (!heading) throw new Error(`${id}: section ${index} has no heading`);

    const source = Array.isArray(section.blocks)
      ? section.blocks
      : Array.isArray(section.paras)
        ? section.paras
        : section.content
          ? [section.content]
          : [];

    const blocks = source
      .map((block) => {
        if (typeof block === "string" || Array.isArray(block)) {
          return { kind: "p", parts: Array.isArray(block) ? block : [block] };
        }
        if (block?.list) {
          const items = block.list.filter(Boolean);
          return items.length ? { kind: "list", items } : null;
        }
        if (block?.table) {
          const { head = [], rows = [], caption = null } = block.table;
          return rows.length ? { kind: "table", head, rows, caption } : null;
        }
        if (block?.note) {
          const { title = "", text = "", tone = "info" } = block.note;
          return text ? { kind: "note", title, text, tone: tone === "warn" ? "warn" : "info" } : null;
        }
        return null;
      })
      .filter(Boolean);

    return {
      id: slugify(section.id) || slugify(heading) || `section-${index + 1}`,
      heading,
      lead: section.lead ?? null,
      blocks,
      image: section.image?.src ? section.image : null,
    };
  });
}

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

for (const sql of [...SCHEMA, ...ADMIN_SCHEMA]) await conn.query(sql);
await runMigrations(conn, MIGRATIONS);

let added = 0;
let updated = 0;
let skipped = 0;
const problems = [];

let cityDirs;
try {
  cityDirs = await readdir(CONTENT, { withFileTypes: true });
} catch (err) {
  if (err.code === "ENOENT") {
    console.log("There is no content/blogs directory — nothing to import.");
    await conn.end();
    process.exit(0);
  }
  throw err;
}

for (const dir of cityDirs) {
  if (!dir.isDirectory()) continue;
  const city = slugify(dir.name);
  if (!city) continue;

  for (const file of await readdir(path.join(CONTENT, dir.name))) {
    // `_`-prefixed files are scratch or shared fragments, not posts — the same
    // rule listRoutes() follows in src/lib/blogs/index.js.
    if (!file.endsWith(".json") || file.startsWith("_")) continue;

    const category = slugify(file.slice(0, -".json".length));
    if (!category) continue;

    const id = `${category}/${city}`;

    let raw;
    try {
      raw = JSON.parse(await readFile(path.join(CONTENT, dir.name, file), "utf8"));
    } catch (err) {
      problems.push(`${id}: not valid JSON — ${err.message}`);
      continue;
    }

    if (!raw.title || !raw.description) {
      problems.push(`${id}: needs a title and a description`);
      continue;
    }

    const [existing] = await conn.execute(
      "SELECT id FROM blog_posts WHERE category = ? AND city = ?",
      [category, city]
    );

    if (existing[0] && !force) {
      skipped += 1;
      continue;
    }

    let sections;
    try {
      sections = normaliseSections(raw, id);
    } catch (err) {
      problems.push(err.message);
      continue;
    }

    const values = [
      category,
      city,
      raw.cityName || titleCase(city),
      String(raw.title).slice(0, 255),
      String(raw.description).slice(0, 500),
      JSON.stringify(raw.keywords ?? []),
      JSON.stringify(sections),
      JSON.stringify(raw.takeaways ?? []),
      JSON.stringify(raw.faqs ?? []),
      raw.relatedLinks ? JSON.stringify(raw.relatedLinks) : null,
      raw.hero?.src ?? null,
      raw.hero?.alt ?? "",
      raw.noindex ? 1 : 0,
      raw.noindex ? 0 : 1, // a noindex post is not submitted in the sitemap
      raw.readingMinutes ?? readingMinutes(sections),
      Number.isFinite(raw.order) ? raw.order : 1000,
      raw.publishedAt ?? null,
      raw.updatedAt || raw.publishedAt || null,
    ];

    if (existing[0]) {
      await conn.execute(
        `UPDATE blog_posts SET
           category = ?, city = ?, city_name = ?, title = ?, description = ?,
           keywords_json = ?, sections_json = ?, takeaways_json = ?, faqs_json = ?,
           related_json = ?, hero_src = ?, hero_alt = ?, noindex = ?, in_sitemap = ?,
           reading_minutes = ?, sort_order = ?, published_at = ?, updated_on = ?
         WHERE id = ?`,
        [...values, existing[0].id]
      );
      updated += 1;
    } else {
      await conn.execute(
        `INSERT INTO blog_posts
           (category, city, city_name, title, description, keywords_json, sections_json,
            takeaways_json, faqs_json, related_json, hero_src, hero_alt, noindex,
            in_sitemap, reading_minutes, sort_order, published_at, updated_on, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
        values
      );
      added += 1;
    }
  }
}

console.log(`\nImported ${added} article${added === 1 ? "" : "s"}.`);
if (updated) console.log(`Overwrote ${updated} existing row${updated === 1 ? "" : "s"} (--force).`);
if (skipped) {
  console.log(
    `Left ${skipped} alone because they are already in the database. Use --force to overwrite them.`
  );
}

if (problems.length) {
  console.log(`\n${problems.length} file${problems.length === 1 ? "" : "s"} could not be imported:`);
  for (const problem of problems) console.log(`  · ${problem}`);
}

console.log("\nThe files in content/blogs/ have not been changed. They stay as the fallback.\n");

await conn.end();
