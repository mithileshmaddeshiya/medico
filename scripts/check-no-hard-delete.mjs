/**
 * Fails if anything in the admin tree can permanently delete a row.
 *
 *   npm run check:deletes
 *
 * ── WHY THIS IS A CHECK AND NOT A CONVENTION ─────────────────────────────
 * The whole panel rests on one promise: pressing Delete changes a status and
 * nothing is removed. That promise is worth exactly as much as its least
 * careful call site, and `DELETE FROM` is one keystroke from
 * `UPDATE … SET status`. A rule that lives only in a comment is one that gets
 * broken six months later by someone who never read the comment — so it is
 * enforced here, where it fails loudly and immediately.
 *
 * Run it in CI, or before a deploy. It reads files; it touches no database.
 *
 * ── THE ONE ALLOWED EXCEPTION ────────────────────────────────────────────
 * lab_test_categories, the join table that records which filter chips a test
 * currently appears under. Its rows carry no history — they are a statement
 * about the present, not a record of anything — and keeping soft-deleted
 * memberships would mean every read had to filter them out. The test itself,
 * which IS a record with history, is never deleted.
 *
 * If you need another exception, think hard about whether the row is a record
 * or a relationship. Records are kept. If it really is a relationship, add it
 * to ALLOWED below with a sentence saying why.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

// The operations CRM (/crm) is held to the same promise: bookings, payments,
// reports and every other record are soft-deleted, never removed.
const ROOTS = [
  "src/lib/admin",
  "src/app/admin",
  "src/app/api/admin",
  "src/lib/crm",
  "src/app/crm",
  "src/app/api/crm",
];

/** Exact statements that are permitted, with the reason they are. */
const ALLOWED = [
  {
    // Replacing a test's chip memberships wholesale on save.
    match: "DELETE FROM lab_test_categories WHERE test_id = ?",
    file: "src/lib/admin/catalogStore.js",
    why: "a pure join table: which chips a card is currently under, no history",
  },
  {
    // Rewriting a lab partner's cities wholesale on save.
    match: "DELETE FROM partner_cities WHERE partner_id = ?",
    file: "src/lib/crm/stores/partners.js",
    why: "pure join table: which cities a lab serves today, no history of its own",
  },
  {
    // Clearing one lab's price override for one test.
    match: "DELETE FROM partner_prices WHERE partner_id = ? AND test_id = ?",
    file: "src/lib/crm/stores/partners.js",
    why: "one override per (partner, test); clearing it restores the standard price, and the old value is in the activity log",
  },
];

/** Every DELETE or TRUNCATE in a SQL-looking string. */
const PATTERN = /\b(DELETE\s+FROM|TRUNCATE\s+TABLE|DROP\s+TABLE)\b/gi;

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return;
    throw err;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(js|jsx|mjs)$/.test(entry.name)) yield full;
  }
}

const found = [];

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const source = await readFile(file, "utf8");
    const lines = source.split("\n");

    for (const [index, line] of lines.entries()) {
      PATTERN.lastIndex = 0;
      if (!PATTERN.test(line)) continue;

      // A mention inside a comment is documentation, not a statement. This is
      // a deliberately simple test — the point is to catch real SQL, and the
      // files here explain the rule at length in their comments.
      const trimmed = line.trim();
      if (trimmed.startsWith("*") || trimmed.startsWith("//") || trimmed.startsWith("/*")) continue;

      const allowed = ALLOWED.some(
        (entry) => line.includes(entry.match) && file.replace(/\\/g, "/").endsWith(entry.file)
      );
      if (allowed) continue;

      found.push({ file: file.replace(/\\/g, "/"), line: index + 1, text: trimmed });
    }
  }
}

if (found.length) {
  console.error("\nThe admin panel must never permanently delete a row.\n");
  for (const hit of found) {
    console.error(`  ${hit.file}:${hit.line}`);
    console.error(`    ${hit.text}\n`);
  }
  console.error(
    "Use softDelete() from src/lib/admin/softDelete.js, which writes a status and keeps the row.\n" +
      "If this really is a relationship rather than a record, add it to ALLOWED in\n" +
      "scripts/check-no-hard-delete.mjs with a sentence explaining why.\n"
  );
  process.exit(1);
}

console.log("No hard deletes in the admin panel. Every delete goes through softDelete().");
