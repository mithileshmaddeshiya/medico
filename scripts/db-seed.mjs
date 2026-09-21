/**
 * Copy the test cards and filter chips from src/data/lab/defaults.js into
 * MySQL (test_categories, lab_tests, lab_test_categories).
 *
 * MySQL is the source of truth for prices now (see src/lib/testCatalog.js),
 * so by default this only ADDS what the database is missing — it never
 * overwrites a price or name someone edited in the database:
 *
 *   npm run db:seed
 *
 * To throw the database's list away and replace it with defaults.js (every
 * price, name and chip overwritten; tests not in the file set active = 0 —
 * kept, because old orders refer to them):
 *
 *   npm run db:seed -- --reset
 */
import mysql from "mysql2/promise";

import { defaultFilters, defaultTests } from "../src/data/lab/defaults.js";
import { SCHEMA } from "../src/lib/dbSchema.js";

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

for (const sql of SCHEMA) await conn.query(sql);

const reset = process.argv.includes("--reset");
const filters = defaultFilters();
const tests = defaultTests();

let added = 0;
await conn.beginTransaction();
try {
  for (const [i, f] of filters.entries()) {
    await conn.execute(
      `INSERT INTO test_categories (\`key\`, label, heading, sort_order) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE ${reset ? "label = VALUES(label), heading = VALUES(heading), sort_order = VALUES(sort_order)" : "`key` = `key`"}`,
      [f.key, f.label, f.heading, i]
    );
  }

  if (reset) await conn.execute("UPDATE lab_tests SET active = 0");

  for (const [i, t] of tests.entries()) {
    const [existing] = await conn.execute("SELECT 1 FROM lab_tests WHERE id = ?", [t.id]);
    if (existing.length && !reset) continue;
    added += existing.length ? 0 : 1;

    const mrp = t.mrp && t.price && t.mrp > t.price ? t.mrp : null;
    const discount = mrp ? Math.round(((mrp - t.price) / mrp) * 100) : null;
    const tags = t.tags ?? [];

    await conn.execute(
      `INSERT INTO lab_tests
         (id, name, includes, is_package, params, price, mrp, discount_pct, fasting, icon, tint, sort_order, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name), includes = VALUES(includes), is_package = VALUES(is_package),
         params = VALUES(params), price = VALUES(price), mrp = VALUES(mrp),
         discount_pct = VALUES(discount_pct), fasting = VALUES(fasting), icon = VALUES(icon),
         tint = VALUES(tint), sort_order = VALUES(sort_order), active = 1`,
      [
        t.id, t.name, t.sub ?? "", tags.includes("Packages") ? 1 : 0, t.params ?? null,
        t.price ?? null, mrp, discount, t.fasting ? 1 : 0, t.icon ?? null, t.tint ?? null, i,
      ]
    );

    await conn.execute("DELETE FROM lab_test_categories WHERE test_id = ?", [t.id]);
    for (const tag of tags) {
      await conn.execute(
        "INSERT INTO lab_test_categories (test_id, category_key) VALUES (?, ?)",
        [t.id, tag]
      );
    }
  }

  await conn.commit();
} catch (err) {
  await conn.rollback();
  throw err;
} finally {
  await conn.end();
}

console.log(
  reset
    ? `reset: ${filters.length} categories and ${tests.length} tests overwritten from defaults.js`
    : `added ${added} missing test(s); existing rows left untouched`
);
