/**
 * The test catalogue, from the panel's side. Server only.
 *
 * The public reader is src/lib/testCatalog.js and it is unchanged: it selects
 * `WHERE active = 1`, memoises for 30 seconds, and falls back to
 * src/data/lab/defaults.js if the database cannot be reached. Everything here
 * writes the rows that reader reads.
 *
 * ── PRICES ARE THE MOST DANGEROUS FIELD IN THE PANEL ─────────────────────
 * Checkout prices the cart from THIS table with `fresh: true` — no memo, no
 * cache (see getTests in src/lib/labStore.js). A price typed here is charged
 * on the next checkout, seconds later, with nothing in between to catch a
 * missing zero. So:
 *
 *   · price and mrp are parsed as rupees and stored as DECIMAL, never float.
 *     Money as a float is how ₹899 becomes ₹898.9999999999999.
 *   · a price of 0 is refused. Free is not a price; "call for price" is what
 *     NULL means and it is a separate, deliberate choice in the form.
 *   · mrp below price is refused — it would render as a negative discount.
 *   · the discount percentage is COMPUTED, never typed. Two numbers that can
 *     disagree will eventually disagree, and the one on the card is the one
 *     the customer screenshots.
 *
 * ── DELETING A TEST ──────────────────────────────────────────────────────
 * Never removes the row. order_items rows reference a test by id and name, and
 * a catalogue that loses a row loses the ability to answer "what was this
 * order actually for". `archive` takes it off the site and keeps it; the
 * status column and the `active` flag move together, which is what the `also`
 * clause in softDelete.js is for.
 */
import { query } from "@/lib/db";

import { audit } from "./audit";
import { softDelete, visible } from "./softDelete";

/** "1,299" / "₹1299" / "1299.00" → 1299. Null for an empty value. */
export function parseMoney(value) {
  const raw = String(value ?? "").replace(/[₹,\s]/g, "").trim();
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return NaN;
  return Math.round(n * 100) / 100;
}

export const slugifyId = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/* ── Reading ──────────────────────────────────────────────────────────────── */

export async function listTests({ search = "", category = null, includeDeleted = false, status = null } = {}) {
  const where = [status ? "t.status = ?" : visible("t", includeDeleted)];
  const params = [];
  if (status) params.push(status);

  if (search) {
    where.push("(t.name LIKE ? OR t.id LIKE ? OR t.includes LIKE ?)");
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  if (category) {
    where.push("EXISTS (SELECT 1 FROM lab_test_categories c WHERE c.test_id = t.id AND c.category_key = ?)");
    params.push(category);
  }

  const [rows] = await query(
    `SELECT t.*,
            (SELECT GROUP_CONCAT(c.category_key ORDER BY c.category_key)
               FROM lab_test_categories c WHERE c.test_id = t.id) AS tags,
            (SELECT COALESCE(SUM(i.qty), 0) FROM order_items i WHERE i.test_id = t.id) AS ordered
     FROM lab_tests t
     WHERE ${where.join(" AND ")}
     ORDER BY t.sort_order, t.name`,
    params
  );

  return rows.map((row) => ({
    ...row,
    price: row.price === null ? null : Number(row.price),
    mrp: row.mrp === null ? null : Number(row.mrp),
    tags: row.tags ? row.tags.split(",") : [],
  }));
}

export async function getTest(id) {
  const [rows] = await query("SELECT * FROM lab_tests WHERE id = ? LIMIT 1", [String(id)]);
  const test = rows[0];
  if (!test) return null;

  const [tags] = await query(
    "SELECT category_key FROM lab_test_categories WHERE test_id = ?",
    [String(id)]
  );

  return {
    ...test,
    price: test.price === null ? null : Number(test.price),
    mrp: test.mrp === null ? null : Number(test.mrp),
    tags: tags.map((t) => t.category_key),
  };
}

export async function listCategories({ includeDeleted = false } = {}) {
  const [rows] = await query(
    `SELECT c.*, (SELECT COUNT(*) FROM lab_test_categories l WHERE l.category_key = c.\`key\`) AS tests
     FROM test_categories c
     WHERE ${visible("c", includeDeleted)}
     ORDER BY c.sort_order, c.label`
  );
  return rows;
}

/* ── Writing ──────────────────────────────────────────────────────────────── */

/**
 * Validate a test form. Returns `{ error }` or `{ value }` — never a partly
 * validated object, so a caller cannot write half of a bad form.
 */
export function validateTest(input) {
  const id = slugifyId(input.id || input.name);
  if (!id) return { error: "The test needs a name." };

  const name = String(input.name ?? "").trim().slice(0, 200);
  if (name.length < 2) return { error: "The test needs a name." };

  // "Call for price" is the explicit choice; it is what a NULL price means in
  // the public schema and it makes the card non-bookable rather than free.
  const callForPrice = Boolean(input.callForPrice);
  const price = callForPrice ? null : parseMoney(input.price);
  const mrp = callForPrice ? null : parseMoney(input.mrp);

  if (!callForPrice) {
    if (price === null) return { error: "Enter a price, or tick “Call for price”." };
    if (Number.isNaN(price)) return { error: "That price is not a number." };
    if (price === 0) return { error: "A price of ₹0 makes the test bookable for nothing. Use “Call for price” instead." };
    if (mrp !== null && Number.isNaN(mrp)) return { error: "That MRP is not a number." };
    if (mrp !== null && mrp < price) return { error: "The MRP is below the price — that would show as a negative discount." };
  }

  // Computed, never typed. See the header.
  const discount = mrp && price && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : null;

  const params = input.params === "" || input.params === null || input.params === undefined
    ? null
    : Number(input.params);
  if (params !== null && (!Number.isInteger(params) || params < 1 || params > 5000)) {
    return { error: "The parameter count does not look right." };
  }

  return {
    value: {
      id,
      name,
      includes: String(input.includes ?? "").trim().slice(0, 300),
      isPackage: input.isPackage ? 1 : 0,
      params,
      price,
      mrp,
      discount,
      fasting: input.fasting ? 1 : 0,
      icon: String(input.icon ?? "").trim().slice(0, 40) || null,
      tint: String(input.tint ?? "").trim().slice(0, 40) || null,
      sortOrder: Number(input.sortOrder ?? 0) || 0,
      description: String(input.description ?? "") || null,
      metaTitle: String(input.metaTitle ?? "").slice(0, 255) || null,
      metaDescription: String(input.metaDescription ?? "").slice(0, 500) || null,
      imageMediaId: input.imageMediaId ? Number(input.imageMediaId) : null,
      tags: (Array.isArray(input.tags) ? input.tags : []).map(String).slice(0, 12),
    },
  };
}

export async function saveTest(input, { user } = {}) {
  const { error, value } = validateTest(input);
  if (error) return { ok: false, error };

  const existing = await getTest(input.originalId || value.id);

  // The id is in every cart in every visitor's localStorage and in every
  // order_items row ever written. Renaming it would orphan all of them, so it
  // is fixed once the row exists — the visible NAME is what people change.
  if (existing && existing.id !== value.id) {
    return {
      ok: false,
      error: "A test's id cannot change once it exists — carts and past orders refer to it. Change the name instead.",
    };
  }

  if (existing) {
    await query(
      `UPDATE lab_tests SET
         name = ?, includes = ?, is_package = ?, params = ?, price = ?, mrp = ?,
         discount_pct = ?, fasting = ?, icon = ?, tint = ?, sort_order = ?,
         description = ?, meta_title = ?, meta_description = ?, image_media_id = ?
       WHERE id = ?`,
      [
        value.name, value.includes, value.isPackage, value.params, value.price, value.mrp,
        value.discount, value.fasting, value.icon, value.tint, value.sortOrder,
        value.description, value.metaTitle, value.metaDescription, value.imageMediaId, value.id,
      ]
    );

    const priceMoved = Number(existing.price) !== Number(value.price);
    await audit({
      user,
      action: "update",
      entity: "lab_tests",
      entityId: value.id,
      // The price change is called out in the summary because it is the one
      // edit in this panel that takes money differently on the next checkout.
      summary: priceMoved
        ? `${value.name}: price ₹${existing.price ?? "—"} → ₹${value.price ?? "—"}`
        : `${value.name} updated`,
      before: existing,
      after: value,
    });
  } else {
    await query(
      `INSERT INTO lab_tests
         (id, name, includes, is_package, params, price, mrp, discount_pct, fasting,
          icon, tint, sort_order, active, status, description, meta_title,
          meta_description, image_media_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'active', ?, ?, ?, ?)`,
      [
        value.id, value.name, value.includes, value.isPackage, value.params, value.price,
        value.mrp, value.discount, value.fasting, value.icon, value.tint, value.sortOrder,
        value.description, value.metaTitle, value.metaDescription, value.imageMediaId,
      ]
    );

    await audit({
      user,
      action: "create",
      entity: "lab_tests",
      entityId: value.id,
      summary: `added ${value.name} at ₹${value.price ?? "call for price"}`,
      after: value,
    });
  }

  // Chip membership is replaced wholesale rather than diffed: the form always
  // posts the complete set, and a diff would silently keep a chip the person
  // just unticked if the post arrived without it.
  await query("DELETE FROM lab_test_categories WHERE test_id = ?", [value.id]);
  for (const tag of value.tags) {
    await query(
      "INSERT IGNORE INTO lab_test_categories (test_id, category_key) VALUES (?, ?)",
      [value.id, tag]
    );
  }

  return { ok: true, id: value.id };
}

/*
 * ⚠ The DELETE above is the ONE in this codebase's admin tree, and it is
 * deliberate: lab_test_categories is a pure join table. Its rows carry no
 * history — they say "this card currently appears under this chip" and nothing
 * else. Keeping a soft-deleted membership would mean every read had to filter
 * it, and a chip nobody can see is not a record worth preserving. The TEST
 * itself, which is the thing with history, is never deleted.
 *
 * scripts/check-no-hard-delete.mjs knows about this line by name; if you add
 * another DELETE, that check will fail and it should.
 */

/** Show or hide a test on the site without archiving it. */
export async function setTestActive(id, active, { user } = {}) {
  await query("UPDATE lab_tests SET active = ?, status = ? WHERE id = ?", [
    active ? 1 : 0,
    active ? "active" : "hidden",
    String(id),
  ]);
  await audit({
    user,
    action: active ? "publish" : "unpublish",
    entity: "lab_tests",
    entityId: id,
    summary: active ? "shown on the site" : "hidden from the site",
  });
  return { ok: true };
}

export const removeTest = (id, { user, mode = "archive" } = {}) =>
  softDelete("lab_tests", String(id), { user, mode });

/** Drag-to-reorder writes the whole visible order in one go. */
export async function reorderTests(ids, { user } = {}) {
  for (const [index, id] of ids.entries()) {
    await query("UPDATE lab_tests SET sort_order = ? WHERE id = ?", [index, String(id)]);
  }
  await audit({ user, action: "reorder", entity: "lab_tests", summary: `${ids.length} cards reordered` });
  return { ok: true };
}

/* ── Categories ───────────────────────────────────────────────────────────── */

export async function saveCategory(input, { user } = {}) {
  const key = slugifyId(input.key || input.label).slice(0, 40);
  const label = String(input.label ?? "").trim().slice(0, 80);
  const heading = String(input.heading ?? "").trim().slice(0, 200);

  if (!key || !label) return { ok: false, error: "A chip needs a key and a label." };
  if (!heading) {
    return {
      ok: false,
      // The heading is the <h2> above the grid when the chip is selected, so
      // an empty one leaves a section of the page with no heading at all.
      error: "A chip needs a heading — it becomes the section title above the test grid.",
    };
  }

  const [existing] = await query("SELECT * FROM test_categories WHERE `key` = ?", [key]);

  await query(
    `INSERT INTO test_categories (\`key\`, label, heading, sort_order)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE label = VALUES(label), heading = VALUES(heading),
                             sort_order = VALUES(sort_order)`,
    [key, label, heading, Number(input.sortOrder ?? 0) || 0]
  );

  await audit({
    user,
    action: existing[0] ? "update" : "create",
    entity: "test_categories",
    entityId: key,
    summary: `chip “${label}”`,
    before: existing[0] ?? null,
    after: { key, label, heading },
  });

  return { ok: true, key };
}

/**
 * Archive a chip.
 *
 * Refused while tests still sit under it: removing the chip would leave those
 * cards reachable only from "All", which looks like they vanished. The panel
 * says which tests, so the fix is obvious.
 */
export async function removeCategory(key, { user } = {}) {
  const [[{ n }]] = await query(
    "SELECT COUNT(*) AS n FROM lab_test_categories WHERE category_key = ?",
    [String(key)]
  );

  if (Number(n) > 0) {
    return {
      ok: false,
      error: `${n} test${n === 1 ? " is" : "s are"} still filed under this chip. Move them first.`,
    };
  }

  return softDelete("test_categories", String(key), { user });
}
