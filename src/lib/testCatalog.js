/**
 * The test cards and filter chips, read from MySQL. Server only.
 *
 * MySQL is the source of truth: change a price, a name or a chip in
 * lab_tests / test_categories / lab_test_categories and
 *   - checkout charges it immediately (it reads with `fresh: true`),
 *   - the pages show it within a minute (they are static with
 *     `revalidate = 60`, so they rebuild in the background).
 *
 * src/data/lab/defaults.js is now only the FALLBACK: if the database cannot
 * be reached (or has not been seeded), the site keeps working off that list
 * instead of showing an empty grid or refusing checkout. It is also what
 * `npm run db:seed` copies into an empty database.
 *
 * Rows come back in the exact shape defaultTests() / defaultFilters() have,
 * so LabServices, the cart and priceCart() do not know the difference.
 */
import { defaultFilters, defaultTests } from "@/data/lab/defaults";

import { dbConfigured, query } from "./db";

const num = (v) => (v === null || v === undefined ? null : Number(v));

async function loadFromDb() {
  const [[tests], [links], [cats]] = await Promise.all([
    query(
      `SELECT id, name, includes, params, price, mrp, fasting, icon, tint
       FROM lab_tests WHERE active = 1 ORDER BY sort_order, name`
    ),
    query(
      `SELECT l.test_id, l.category_key
       FROM lab_test_categories l JOIN test_categories c ON c.\`key\` = l.category_key
       ORDER BY c.sort_order`
    ),
    query("SELECT `key`, label, heading FROM test_categories ORDER BY sort_order"),
  ]);

  if (!tests.length || !cats.length) throw new Error("the test catalogue tables are empty — run `npm run db:seed`");

  const tagsOf = new Map();
  for (const { test_id, category_key } of links) {
    if (!tagsOf.has(test_id)) tagsOf.set(test_id, []);
    tagsOf.get(test_id).push(category_key);
  }

  return {
    tests: tests.map((t) => {
      const test = {
        id: t.id,
        icon: t.icon ?? undefined,
        tint: t.tint ?? undefined,
        name: t.name,
        sub: t.includes,
        tags: tagsOf.get(t.id) ?? [],
        fasting: Boolean(t.fasting),
        price: num(t.price),
      };
      if (t.mrp !== null) test.mrp = num(t.mrp);
      if (t.params !== null) test.params = t.params;
      return test;
    }),
    filters: cats.map((c) => ({ key: c.key, label: c.label, heading: c.heading })),
  };
}

const fallback = () => ({ tests: defaultTests(), filters: defaultFilters(), fromDb: false });

/*
 * Cart taps read the catalogue on every tap; a short in-process memo keeps
 * that to one query per 30s per server instance. Checkout skips it.
 */
const MEMO_MS = 30_000;
let memo; // { at, value }

/**
 * `{ tests, filters, fromDb }`. Never throws — a database failure is logged
 * and answered with the defaults.js list.
 */
export async function getCatalog({ fresh = false } = {}) {
  if (!dbConfigured()) return fallback();
  if (!fresh && memo && Date.now() - memo.at < MEMO_MS) return memo.value;

  try {
    const value = { ...(await loadFromDb()), fromDb: true };
    memo = { at: Date.now(), value };
    return value;
  } catch (err) {
    console.error("[catalog] could not read tests from MySQL, using defaults.js", err);
    return fallback();
  }
}
