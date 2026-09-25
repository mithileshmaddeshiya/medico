/**
 * The operational catalogue: tests, packages, service cities and areas.
 * Server only.
 *
 * ── ONE TABLE, TWO READERS ───────────────────────────────────────────────
 * lab_tests is the same table the public site reads (src/lib/testCatalog.js,
 * `WHERE active = 1`) and checkout prices from, uncached. So the CRM follows
 * the website admin's rules exactly instead of writing its own:
 *
 *   · price / MRP / parameters are validated by validateTest() from
 *     src/lib/admin/catalogStore.js — ₹0 is refused, NULL is "call for price",
 *     MRP below price is refused, the discount is computed, never typed;
 *   · `active` and `status` move together the way setTestActive() and
 *     softDelete() move them: on the site ⇔ active = 1 AND status 'active';
 *     'hidden' = off the site but bookable by staff; 'archived' = inactive
 *     (neither); 'deleted' = the bin (active 0, deleted_at stamped);
 *   · the id is a slug and never changes once the row exists — carts and
 *     order_items refer to it.
 *
 * What the CRM adds is operational: code, sample type, TAT, category, the
 * partner's cost, and which tests a package bundles.
 *
 * A test created here starts OFF the website (active 0, 'hidden'). Putting a
 * price in front of customers is a separate, deliberate tick.
 *
 * The public site memoises the catalogue for 30 s per server instance and its
 * pages revalidate on a 60 s window; the actions that call this module also
 * revalidate the public pages (see src/app/crm/tests/actions.js).
 */
import { query } from "@/lib/db";
import { parseMoney, slugifyId, validateTest } from "@/lib/admin/catalogStore";
import { logActivity } from "@/lib/crm/activity";
import { SAMPLE_TYPES, TEST_CATEGORY } from "@/lib/crm/constants";
import { range } from "@/lib/crm/dates";
import { UserError } from "@/lib/crm/guard";

const clampLimit = (n, max = 100) => Math.min(max, Math.max(1, Number(n) || 25));
const clampOffset = (n) => Math.max(0, Number(n) || 0);
const likeOf = (s) => `%${String(s).replace(/[%_\\]/g, "\\$&")}%`;
const money = (v) => (v === null || v === undefined ? null : Number(v));

export const TEST_STATUS = {
  active: { label: "On website", tone: "emerald" },
  hidden: { label: "Active · not on site", tone: "blue" },
  archived: { label: "Inactive", tone: "slate" },
  deleted: { label: "Deleted", tone: "rose" },
};

function parseJsonList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  try {
    const list = JSON.parse(value);
    return Array.isArray(list) ? list.map(String) : [];
  } catch {
    return [];
  }
}

function shapeTest(row) {
  const price = money(row.price);
  const partnerPrice = money(row.partner_price);
  return {
    ...row,
    price,
    mrp: money(row.mrp),
    partner_price: partnerPrice,
    margin: price !== null && partnerPrice !== null ? Math.round((price - partnerPrice) * 100) / 100 : null,
    is_package: Boolean(row.is_package),
    fasting: Boolean(row.fasting),
    on_site: Number(row.active) === 1,
    package_tests: parseJsonList(row.package_tests_json),
  };
}

/* ── Tests and packages: reading ─────────────────────────────────────── */

/**
 * Filters (from catalogFiltersFrom): isPackage, search, category, sampleType,
 * onSite ("yes"|"no"), status (one of TEST_STATUS keys; default hides deleted).
 */
export async function listCatalog({ isPackage = false, search = "", category = null, sampleType = null, onSite = null, status = null, limit = 25, offset = 0 } = {}) {
  const where = ["t.is_package = ?"];
  const params = [isPackage ? 1 : 0];

  if (status && TEST_STATUS[status]) {
    where.push("t.status = ?");
    params.push(status);
  } else {
    where.push("t.status <> 'deleted'");
  }
  if (search) {
    where.push("(t.name LIKE ? OR t.code LIKE ? OR t.id LIKE ?)");
    const like = likeOf(search);
    params.push(like, like, like);
  }
  if (category && TEST_CATEGORY[category]) {
    where.push("t.crm_category = ?");
    params.push(category);
  }
  if (sampleType && SAMPLE_TYPES.includes(sampleType)) {
    where.push("t.sample_type = ?");
    params.push(sampleType);
  }
  if (onSite === "yes") where.push("t.active = 1");
  if (onSite === "no") where.push("t.active = 0");

  const clause = where.join(" AND ");
  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT t.id, t.name, t.code, t.includes, t.is_package, t.params, t.price, t.mrp, t.discount_pct,
              t.partner_price, t.fasting, t.sample_type, t.tat_hours, t.crm_category, t.active, t.status,
              t.package_tests_json, t.sort_order, t.updated_at
       FROM lab_tests t WHERE ${clause}
       ORDER BY t.status = 'active' DESC, t.sort_order, t.name
       LIMIT ${clampLimit(limit)} OFFSET ${clampOffset(offset)}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM lab_tests t WHERE ${clause}`, params),
  ]);
  return { rows: rows.map(shapeTest), total: Number(count.n) };
}

export async function getCatalogItem(id) {
  const [[row]] = await query("SELECT * FROM lab_tests WHERE id = ? LIMIT 1", [String(id)]);
  return row ? shapeTest(row) : null;
}

/** Bookings that included this test/package: ever, and in the last 30 days. */
export async function testUsage(id) {
  const r = range("30d");
  const [[row]] = await query(
    `SELECT COUNT(DISTINCT bi.booking_id) AS total,
            COUNT(DISTINCT CASE WHEN b.created_at >= ? THEN bi.booking_id END) AS last30
     FROM booking_items bi JOIN bookings b ON b.id = bi.booking_id
     WHERE bi.test_id = ? AND bi.status = 'active' AND b.deleted_at IS NULL`,
    [r.from, String(id)]
  );
  return { total: Number(row?.total ?? 0), last30: Number(row?.last30 ?? 0) };
}

/** Single tests a package can include (not packages, not deleted). */
export async function listPackableTests() {
  const [rows] = await query(
    `SELECT id, name, code, price, mrp, status FROM lab_tests
     WHERE is_package = 0 AND status <> 'deleted' ORDER BY name`
  );
  return rows.map((r) => ({ id: r.id, name: r.name, code: r.code, price: money(r.price), mrp: money(r.mrp), status: r.status }));
}

/** The packages that bundle a given test (for the test's detail page). */
export async function packagesContaining(testId) {
  const [rows] = await query(
    `SELECT id, name, status FROM lab_tests
     WHERE is_package = 1 AND status <> 'deleted' AND JSON_CONTAINS(COALESCE(package_tests_json, JSON_ARRAY()), JSON_QUOTE(?))
     ORDER BY name`,
    [String(testId)]
  );
  return rows;
}

/* ── Tests and packages: writing ─────────────────────────────────────── */

/**
 * The form → a validated value, or a UserError. Price rules are the website
 * admin's (validateTest); the operational fields are checked here.
 */
async function validateCatalogInput(input, { isPackage }) {
  const base = validateTest({
    name: input.name,
    id: input.name, // only used to check a slug can be made; the real id is fixed below
    callForPrice: input.callForPrice,
    price: input.price,
    mrp: input.mrp,
    params: input.params,
    includes: input.includes,
    isPackage,
    fasting: input.fasting,
  });
  if (base.error) throw new UserError(base.error);

  const partnerPrice = parseMoney(input.partnerPrice);
  if (Number.isNaN(partnerPrice)) throw new UserError("The partner price is not a number.");

  const tat = Number(input.tatHours);
  if (!Number.isInteger(tat) || tat < 1 || tat > 720) throw new UserError("Turnaround must be between 1 and 720 hours.");

  const sampleType = SAMPLE_TYPES.includes(input.sampleType) ? input.sampleType : null;
  if (!sampleType) throw new UserError("Pick a sample type.");
  const category = TEST_CATEGORY[input.category] ? input.category : null;
  if (!category) throw new UserError("Pick a category.");

  const code = String(input.code ?? "").trim().toUpperCase().slice(0, 40);

  let packageTests = null;
  let includes = base.value.includes;
  if (isPackage) {
    const wanted = [...new Set((input.packageTests ?? []).map(String).filter(Boolean))].slice(0, 200);
    if (!wanted.length) throw new UserError("Pick the tests this package includes.");
    const [found] = await query(
      `SELECT id, name FROM lab_tests WHERE is_package = 0 AND status <> 'deleted' AND id IN (${wanted.map(() => "?").join(",")})`,
      wanted
    );
    const names = new Map(found.map((r) => [r.id, r.name]));
    packageTests = wanted.filter((id) => names.has(id));
    if (!packageTests.length) throw new UserError("None of the selected tests exist any more.");
    // The card's subtitle: typed text wins; otherwise the included tests by name.
    if (!includes) includes = packageTests.map((id) => names.get(id)).join(", ").slice(0, 300);
  }

  return {
    name: base.value.name,
    code,
    includes,
    params: base.value.params,
    price: base.value.price,
    mrp: base.value.mrp,
    discount_pct: base.value.discount,
    partner_price: partnerPrice,
    fasting: base.value.fasting,
    sample_type: sampleType,
    tat_hours: tat,
    crm_category: category,
    description: String(input.description ?? "").trim().slice(0, 20000) || null,
    package_tests_json: packageTests ? JSON.stringify(packageTests) : null,
  };
}

/** A slug id no row has yet: "cbc", "cbc-2", "cbc-3" … */
async function uniqueTestId(name) {
  const base = slugifyId(name).slice(0, 72) || "test";
  const [rows] = await query("SELECT id FROM lab_tests WHERE id = ? OR id LIKE ?", [base, `${base}-%`]);
  const taken = new Set(rows.map((r) => r.id));
  if (!taken.has(base)) return base;
  for (let i = 2; i < 1000; i += 1) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
  throw new UserError("Could not make an id for that name. Try a more specific name.");
}

const FIELDS = [
  "name", "code", "includes", "params", "price", "mrp", "discount_pct", "partner_price", "fasting",
  "sample_type", "tat_hours", "crm_category", "description", "package_tests_json",
];

const comparable = (key, v) => {
  if (v === null || v === undefined) return null;
  if (["price", "mrp", "partner_price"].includes(key)) return Number(v);
  if (["params", "tat_hours", "discount_pct"].includes(key)) return Number(v);
  if (key === "fasting") return Number(v) ? 1 : 0;
  if (key === "package_tests_json") return JSON.stringify(parseJsonList(v));
  return String(v);
};

export async function createCatalogItem(input, { user, isPackage = false }) {
  const value = await validateCatalogInput(input, { isPackage });
  const id = await uniqueTestId(value.name);
  const onSite = Boolean(input.showOnSite);

  // New cards go to the end of the site's order, not the top.
  const [[{ next }]] = await query("SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM lab_tests");

  await query(
    `INSERT INTO lab_tests
       (id, name, code, includes, is_package, params, price, mrp, discount_pct, partner_price, fasting,
        sample_type, tat_hours, crm_category, description, package_tests_json, sort_order, active, status, in_stock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [
      id, value.name, value.code, value.includes, isPackage ? 1 : 0, value.params, value.price, value.mrp,
      value.discount_pct, value.partner_price, value.fasting, value.sample_type, value.tat_hours,
      value.crm_category, value.description, value.package_tests_json, Math.min(65535, Number(next) || 0),
      onSite ? 1 : 0, onSite ? "active" : "hidden",
    ]
  );

  const noun = isPackage ? "package" : "test";
  await logActivity({
    user,
    action: "create",
    entity: "lab_tests",
    entityId: id,
    summary: `Added ${noun} ${value.name} at ${value.price === null ? "call for price" : `₹${value.price}`}${onSite ? " (on website)" : " (not on website)"}`,
    after: { ...value, active: onSite ? 1 : 0, status: onSite ? "active" : "hidden" },
  });
  return { id, onSite };
}

export async function updateCatalogItem(id, input, { user }) {
  const existing = await getCatalogItem(id);
  if (!existing) throw new UserError("That test no longer exists.");
  if (existing.status === "deleted") throw new UserError("Restore it before editing.");

  const value = await validateCatalogInput(input, { isPackage: existing.is_package });
  const before = {};
  const after = {};
  for (const key of FIELDS) {
    const old = key === "package_tests_json" ? existing.package_tests_json : existing[key];
    if (comparable(key, old) !== comparable(key, value[key])) {
      before[key] = key === "package_tests_json" ? parseJsonList(old) : old;
      after[key] = key === "package_tests_json" ? parseJsonList(value[key]) : value[key];
    }
  }

  // Website visibility travels with the form only while the row is live.
  let visibility = null;
  if (["active", "hidden"].includes(existing.status) && input.showOnSite !== undefined) {
    const want = Boolean(input.showOnSite);
    if (want !== existing.on_site) {
      visibility = want;
      before.on_website = existing.on_site;
      after.on_website = want;
    }
  }

  if (!Object.keys(after).length) return { changed: false, siteTouched: false };

  await query(
    `UPDATE lab_tests SET name = ?, code = ?, includes = ?, params = ?, price = ?, mrp = ?, discount_pct = ?,
            partner_price = ?, fasting = ?, sample_type = ?, tat_hours = ?, crm_category = ?, description = ?,
            package_tests_json = ?${visibility === null ? "" : ", active = ?, status = ?"}
     WHERE id = ?`,
    [
      value.name, value.code, value.includes, value.params, value.price, value.mrp, value.discount_pct,
      value.partner_price, value.fasting, value.sample_type, value.tat_hours, value.crm_category,
      value.description, value.package_tests_json,
      ...(visibility === null ? [] : [visibility ? 1 : 0, visibility ? "active" : "hidden"]),
      existing.id,
    ]
  );

  const labels = { price: "price", mrp: "MRP", partner_price: "partner price", on_website: "website" };
  const priceMoved = "price" in after;
  const summary = priceMoved
    ? `${value.name}: price ${existing.price === null ? "call for price" : `₹${existing.price}`} → ${value.price === null ? "call for price" : `₹${value.price}`}`
    : `${value.name}: updated ${Object.keys(after).map((k) => labels[k] ?? k.replace(/_/g, " ")).slice(0, 5).join(", ")}`;

  await logActivity({ user, action: "update", entity: "lab_tests", entityId: existing.id, summary, before, after });

  // Anything the public card shows (or whether it shows) needs the site refreshed.
  const siteFields = ["name", "includes", "params", "price", "mrp", "discount_pct", "fasting", "on_website"];
  return { changed: true, siteTouched: existing.on_site || visibility !== null ? siteFields.some((k) => k in after) : false };
}

/**
 * The status moves, each keeping `active` and `status` in step:
 *   site      on the website          active 1, 'active'
 *   hide      off the website          active 0, 'hidden'
 *   deactivate not bookable, not shown active 0, 'archived'
 *   activate   back to bookable        active 0, 'hidden'
 *   delete     the bin                 active 0, 'deleted', deleted_at
 *   restore    out of the bin          active 0, 'hidden', deleted_at NULL
 */
const MOVES = {
  site: { from: ["hidden"], active: 1, status: "active", verb: "put on the website" },
  hide: { from: ["active"], active: 0, status: "hidden", verb: "taken off the website" },
  deactivate: { from: ["active", "hidden"], active: 0, status: "archived", verb: "deactivated" },
  activate: { from: ["archived"], active: 0, status: "hidden", verb: "reactivated (not on website)" },
  delete: { from: ["active", "hidden", "archived"], active: 0, status: "deleted", verb: "deleted" },
  restore: { from: ["deleted"], active: 0, status: "hidden", verb: "restored (not on website)" },
};

export async function moveCatalogItem(id, move, { user }) {
  const m = MOVES[move];
  if (!m) throw new UserError("Unknown action.");
  const existing = await getCatalogItem(id);
  if (!existing) throw new UserError("That test no longer exists.");
  if (!m.from.includes(existing.status)) {
    throw new UserError(`It is ${TEST_STATUS[existing.status]?.label.toLowerCase() ?? existing.status} — that cannot be ${m.verb} from here.`);
  }
  const stamp = move === "delete" ? ", deleted_at = UTC_TIMESTAMP()" : move === "restore" ? ", deleted_at = NULL" : "";
  await query(`UPDATE lab_tests SET active = ?, status = ?${stamp} WHERE id = ?`, [m.active, m.status, existing.id]);

  await logActivity({
    user,
    action: move === "delete" ? "delete" : move === "restore" ? "restore" : "status",
    entity: "lab_tests",
    entityId: existing.id,
    summary: `${existing.name} ${m.verb}`,
    before: { status: existing.status, active: existing.on_site ? 1 : 0 },
    after: { status: m.status, active: m.active },
  });
  return { siteTouched: existing.on_site || m.active === 1, verb: m.verb };
}

/* ── Service cities ───────────────────────────────────────────────────── */

export const CITY_STATUS = {
  active: { label: "Active", tone: "emerald" },
  inactive: { label: "Inactive", tone: "slate" },
  deleted: { label: "Deleted", tone: "rose" },
};

/**
 * Cities with their 30-day numbers. Each figure is a correlated subquery on
 * an indexed column; the list is a few dozen rows at most.
 */
export async function listServiceCities({ search = "", status = null, limit = 50, offset = 0 } = {}) {
  const r = range("30d");
  const where = [status && CITY_STATUS[status] ? "c.status = ?" : "c.status <> 'deleted'"];
  const params = status && CITY_STATUS[status] ? [status] : [];
  if (search) {
    where.push("(c.name LIKE ? OR c.state LIKE ?)");
    params.push(likeOf(search), likeOf(search));
  }
  const clause = where.join(" AND ");
  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT c.*,
              (SELECT COUNT(*) FROM service_areas a WHERE a.city_id = c.id AND a.status <> 'deleted') AS areas,
              (SELECT COUNT(*) FROM partner_cities pc JOIN partners p ON p.id = pc.partner_id
                 WHERE pc.city_id = c.id AND p.status <> 'deleted') AS partners,
              (SELECT COUNT(*) FROM bookings b
                 WHERE b.city_id = c.id AND b.deleted_at IS NULL AND b.created_at >= ? AND b.created_at < ?) AS bookings_30d,
              (SELECT COALESCE(SUM(p.amount), 0) FROM payments p JOIN bookings b ON b.id = p.booking_id
                 WHERE b.city_id = c.id AND b.deleted_at IS NULL AND p.status = 'paid'
                   AND p.received_at >= ? AND p.received_at < ?) AS revenue_30d,
              (SELECT COUNT(*) FROM leads l WHERE l.city = c.name AND l.created_at >= ? AND l.created_at < ?) AS leads_30d
       FROM service_cities c WHERE ${clause}
       ORDER BY c.status = 'active' DESC, c.sort_order, c.name
       LIMIT ${clampLimit(limit, 200)} OFFSET ${clampOffset(offset)}`,
      [r.from, r.to, r.from, r.to, r.from, r.to, ...params]
    ),
    query(`SELECT COUNT(*) AS n FROM service_cities c WHERE ${clause}`, params),
  ]);
  return {
    rows: rows.map((c) => ({
      ...c,
      areas: Number(c.areas),
      partners: Number(c.partners),
      bookings_30d: Number(c.bookings_30d),
      revenue_30d: Number(c.revenue_30d),
      leads_30d: Number(c.leads_30d),
    })),
    total: Number(count.n),
  };
}

export async function getServiceCity(id) {
  const [[city]] = await query("SELECT * FROM service_cities WHERE id = ? LIMIT 1", [Number(id) || 0]);
  if (!city) return null;
  const [[areas], [partners], [bookings]] = await Promise.all([
    query(
      "SELECT * FROM service_areas WHERE city_id = ? AND status <> 'deleted' ORDER BY status = 'active' DESC, name",
      [city.id]
    ),
    query(
      `SELECT p.id, p.name, p.contact_person, p.status FROM partner_cities pc JOIN partners p ON p.id = pc.partner_id
       WHERE pc.city_id = ? AND p.status <> 'deleted' ORDER BY p.status = 'active' DESC, p.name`,
      [city.id]
    ),
    query(
      `SELECT id, patient_name, area, status, final_amount, created_at FROM bookings
       WHERE city_id = ? AND deleted_at IS NULL ORDER BY id DESC LIMIT 10`,
      [city.id]
    ),
  ]);
  return { city, areas, partners, bookings };
}

async function uniqueCitySlug(name, exceptId = 0) {
  const base = slugifyId(name).slice(0, 110) || "city";
  const [rows] = await query("SELECT slug FROM service_cities WHERE (slug = ? OR slug LIKE ?) AND id <> ?", [base, `${base}-%`, exceptId]);
  const taken = new Set(rows.map((r) => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; i < 1000; i += 1) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
  throw new UserError("Could not make a slug for that city name.");
}

function cityInput(input) {
  const name = String(input.name ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
  const state = String(input.state ?? "").trim().replace(/\s+/g, " ").slice(0, 80) || "Uttar Pradesh";
  if (name.length < 2) throw new UserError("Enter the city's name.");
  return { name, state };
}

export async function createCity(input, { user }) {
  const { name, state } = cityInput(input);
  const [dupe] = await query("SELECT id, status FROM service_cities WHERE name = ? LIMIT 1", [name]);
  if (dupe[0] && dupe[0].status !== "deleted") throw new UserError(`${name} is already in the list.`);
  const slug = await uniqueCitySlug(name);
  const [[{ next }]] = await query("SELECT COALESCE(MAX(sort_order), 0) + 10 AS next FROM service_cities");
  const [res] = await query(
    "INSERT INTO service_cities (slug, name, state, collection_available, sort_order, status) VALUES (?, ?, ?, ?, ?, 'active')",
    [slug, name, state, input.collection === false ? 0 : 1, Number(next) || 1000]
  );
  await logActivity({
    user,
    action: "create",
    entity: "service_cities",
    entityId: res.insertId,
    summary: `Added service city ${name}, ${state}`,
    after: { name, state, slug },
  });
  return res.insertId;
}

export async function updateCity(id, input, { user }) {
  const [[city]] = await query("SELECT * FROM service_cities WHERE id = ?", [Number(id) || 0]);
  if (!city || city.status === "deleted") throw new UserError("That city no longer exists.");
  const { name, state } = cityInput(input);
  if (name === city.name && state === city.state) return false;
  const [dupe] = await query("SELECT id FROM service_cities WHERE name = ? AND id <> ? AND status <> 'deleted' LIMIT 1", [name, city.id]);
  if (dupe[0]) throw new UserError(`${name} is already in the list.`);
  // The slug stays: other records and URLs may already carry it.
  await query("UPDATE service_cities SET name = ?, state = ? WHERE id = ?", [name, state, city.id]);
  await logActivity({
    user,
    action: "update",
    entity: "service_cities",
    entityId: city.id,
    summary: name !== city.name ? `Renamed city ${city.name} → ${name}` : `${name}: state ${city.state} → ${state}`,
    before: { name: city.name, state: city.state },
    after: { name, state },
  });
  return true;
}

/** flag: "status" (active|inactive|deleted) or "collection" (1|0). */
export async function setCityFlag(id, flag, value, { user }) {
  const [[city]] = await query("SELECT * FROM service_cities WHERE id = ?", [Number(id) || 0]);
  if (!city) throw new UserError("That city no longer exists.");
  if (flag === "status") {
    if (!CITY_STATUS[value]) throw new UserError("Unknown status.");
    if (value === city.status) return;
    const stamp = value === "deleted" ? ", deleted_at = UTC_TIMESTAMP()" : ", deleted_at = NULL";
    await query(`UPDATE service_cities SET status = ?${stamp} WHERE id = ?`, [value, city.id]);
    await logActivity({
      user,
      action: value === "deleted" ? "delete" : "status",
      entity: "service_cities",
      entityId: city.id,
      summary: `${city.name}: ${CITY_STATUS[city.status]?.label ?? city.status} → ${CITY_STATUS[value].label}`,
      before: { status: city.status },
      after: { status: value },
    });
  } else if (flag === "collection") {
    const on = value === "1" || value === 1 || value === true ? 1 : 0;
    if (on === Number(city.collection_available)) return;
    await query("UPDATE service_cities SET collection_available = ? WHERE id = ?", [on, city.id]);
    await logActivity({
      user,
      action: "update",
      entity: "service_cities",
      entityId: city.id,
      summary: `${city.name}: home collection ${on ? "available" : "paused"}`,
      before: { collection_available: Number(city.collection_available) },
      after: { collection_available: on },
    });
  } else {
    throw new UserError("Unknown setting.");
  }
}

/* ── Service areas ────────────────────────────────────────────────────── */

export async function listServiceAreas({ cityId = null, search = "", status = null, limit = 25, offset = 0 } = {}) {
  const where = [status && CITY_STATUS[status] ? "a.status = ?" : "a.status <> 'deleted'", "c.status <> 'deleted'"];
  const params = status && CITY_STATUS[status] ? [status] : [];
  if (cityId) {
    where.push("a.city_id = ?");
    params.push(Number(cityId) || 0);
  }
  if (search) {
    where.push("(a.name LIKE ? OR a.pincode LIKE ?)");
    params.push(likeOf(search), likeOf(search));
  }
  const clause = where.join(" AND ");
  const [[rows], [[count]]] = await Promise.all([
    query(
      `SELECT a.*, c.name AS city_name, c.status AS city_status
       FROM service_areas a JOIN service_cities c ON c.id = a.city_id
       WHERE ${clause} ORDER BY c.sort_order, c.name, a.name
       LIMIT ${clampLimit(limit)} OFFSET ${clampOffset(offset)}`,
      params
    ),
    query(`SELECT COUNT(*) AS n FROM service_areas a JOIN service_cities c ON c.id = a.city_id WHERE ${clause}`, params),
  ]);
  return { rows, total: Number(count.n) };
}

function areaInput(input) {
  const name = String(input.name ?? "").trim().replace(/\s+/g, " ").slice(0, 120);
  const pincode = String(input.pincode ?? "").replace(/\D/g, "").slice(0, 6);
  if (name.length < 2) throw new UserError("Enter the area's name.");
  if (pincode && pincode.length !== 6) throw new UserError("A pincode has six digits.");
  return { name, pincode };
}

export async function createArea(input, { user }) {
  const cityId = Number(input.cityId) || 0;
  const [[city]] = await query("SELECT id, name FROM service_cities WHERE id = ? AND status <> 'deleted'", [cityId]);
  if (!city) throw new UserError("Pick the city this area is in.");
  const { name, pincode } = areaInput(input);

  // (city_id, name) is unique: a deleted area of the same name comes back
  // rather than failing on the key.
  const [[existing]] = await query("SELECT * FROM service_areas WHERE city_id = ? AND name = ?", [city.id, name]);
  if (existing && existing.status !== "deleted") throw new UserError(`${name} is already an area of ${city.name}.`);

  let id;
  if (existing) {
    await query(
      "UPDATE service_areas SET status = 'active', deleted_at = NULL, pincode = ?, collection_available = 1 WHERE id = ?",
      [pincode, existing.id]
    );
    id = existing.id;
  } else {
    const [res] = await query("INSERT INTO service_areas (city_id, name, pincode) VALUES (?, ?, ?)", [city.id, name, pincode]);
    id = res.insertId;
  }
  await logActivity({
    user,
    action: existing ? "restore" : "create",
    entity: "service_areas",
    entityId: id,
    summary: `${existing ? "Restored" : "Added"} area ${name}${pincode ? ` (${pincode})` : ""} in ${city.name}`,
    after: { city_id: city.id, name, pincode },
  });
  return id;
}

export async function updateArea(id, input, { user }) {
  const [[area]] = await query("SELECT * FROM service_areas WHERE id = ?", [Number(id) || 0]);
  if (!area || area.status === "deleted") throw new UserError("That area no longer exists.");
  const { name, pincode } = areaInput(input);
  if (name === area.name && pincode === area.pincode) return false;
  const [[dupe]] = await query("SELECT id FROM service_areas WHERE city_id = ? AND name = ? AND id <> ?", [area.city_id, name, area.id]);
  if (dupe) throw new UserError(`There is already an area called ${name} in this city.`);
  await query("UPDATE service_areas SET name = ?, pincode = ? WHERE id = ?", [name, pincode, area.id]);
  await logActivity({
    user,
    action: "update",
    entity: "service_areas",
    entityId: area.id,
    summary: name !== area.name ? `Renamed area ${area.name} → ${name}` : `${name}: pincode ${area.pincode || "—"} → ${pincode || "—"}`,
    before: { name: area.name, pincode: area.pincode },
    after: { name, pincode },
  });
  return true;
}

export async function setAreaFlag(id, flag, value, { user }) {
  const [[area]] = await query("SELECT * FROM service_areas WHERE id = ?", [Number(id) || 0]);
  if (!area) throw new UserError("That area no longer exists.");
  if (flag === "status") {
    if (!CITY_STATUS[value]) throw new UserError("Unknown status.");
    if (value === area.status) return;
    const stamp = value === "deleted" ? ", deleted_at = UTC_TIMESTAMP()" : ", deleted_at = NULL";
    await query(`UPDATE service_areas SET status = ?${stamp} WHERE id = ?`, [value, area.id]);
    await logActivity({
      user,
      action: value === "deleted" ? "delete" : "status",
      entity: "service_areas",
      entityId: area.id,
      summary: `Area ${area.name}: ${CITY_STATUS[area.status]?.label ?? area.status} → ${CITY_STATUS[value].label}`,
      before: { status: area.status },
      after: { status: value },
    });
  } else if (flag === "collection") {
    const on = value === "1" || value === 1 || value === true ? 1 : 0;
    if (on === Number(area.collection_available)) return;
    await query("UPDATE service_areas SET collection_available = ? WHERE id = ?", [on, area.id]);
    await logActivity({
      user,
      action: "update",
      entity: "service_areas",
      entityId: area.id,
      summary: `Area ${area.name}: home collection ${on ? "available" : "paused"}`,
      before: { collection_available: Number(area.collection_available) },
      after: { collection_available: on },
    });
  } else {
    throw new UserError("Unknown setting.");
  }
}

/* ── URL → filters (shared by the list pages and the tests export) ────── */

const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

export function catalogFiltersFrom(sp) {
  return {
    search: one(sp.q).slice(0, 80),
    category: one(sp.category) || null,
    sampleType: one(sp.sample) || null,
    onSite: ["yes", "no"].includes(one(sp.site)) ? one(sp.site) : null,
    status: one(sp.status) || null,
  };
}
