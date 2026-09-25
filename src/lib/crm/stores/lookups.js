/**
 * The small lists every form needs: cities, areas, collectors, partners,
 * tests. Server only. Each is one cheap query; pages call only what they use.
 */
import { query } from "@/lib/db";

export async function listCities({ includeInactive = false } = {}) {
  await ensureCitiesSeeded();
  const [rows] = await query(
    `SELECT id, slug, name, state, status, collection_available FROM service_cities
     WHERE status ${includeInactive ? "<> 'deleted'" : "= 'active'"} ORDER BY sort_order, name`
  );
  return rows;
}

export async function listAreas(cityId = null) {
  const [rows] = await query(
    `SELECT a.id, a.city_id, a.name, a.pincode, a.collection_available, c.name AS city_name
     FROM service_areas a JOIN service_cities c ON c.id = a.city_id
     WHERE a.status = 'active' ${cityId ? "AND a.city_id = ?" : ""} ORDER BY c.name, a.name`,
    cityId ? [Number(cityId)] : []
  );
  return rows;
}

/**
 * People who can be sent to collect a sample: every active staff account with
 * the collector role, plus managers/owners/support (small teams double up).
 */
export async function listCollectors() {
  const [rows] = await query(
    `SELECT id, name, email, phone, role FROM admin_users
     WHERE status = 'active' AND role IN ('collector','manager','owner','editor','support')
     ORDER BY role = 'collector' DESC, name`
  );
  return rows;
}

export async function listStaff() {
  const [rows] = await query(
    `SELECT id, name, email, role FROM admin_users
     WHERE status = 'active' AND role <> 'partner' ORDER BY name`
  );
  return rows;
}

export async function listPartnerOptions({ cityId = null } = {}) {
  const [rows] = await query(
    `SELECT p.id, p.name, p.city,
            ${cityId ? "EXISTS (SELECT 1 FROM partner_cities pc WHERE pc.partner_id = p.id AND pc.city_id = ?)" : "0"} AS serves_city
     FROM partners p WHERE p.status = 'active' ORDER BY serves_city DESC, p.name`,
    cityId ? [Number(cityId)] : []
  );
  return rows;
}

/** Bookable tests and packages for the booking form's picker. */
export async function listBookableTests() {
  const [rows] = await query(
    `SELECT id, name, code, is_package, price, mrp, partner_price, params, fasting, tat_hours, crm_category, active
     FROM lab_tests WHERE status IN ('active','hidden') ORDER BY is_package DESC, sort_order, name`
  );
  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    code: t.code,
    isPackage: Boolean(t.is_package),
    price: t.price === null ? null : Number(t.price),
    mrp: t.mrp === null ? null : Number(t.mrp),
    params: t.params,
    fasting: Boolean(t.fasting),
    tat: t.tat_hours,
    category: t.crm_category,
    onSite: Boolean(t.active),
  }));
}

/**
 * First run: fill service_cities / service_areas from the cities the website
 * already serves (src/data/lab/cities.js), so the CRM starts with the real
 * list instead of an empty one. Runs only while service_cities is empty —
 * after that, cities are managed from /crm/cities and this never writes
 * again. INSERT IGNORE on the unique keys makes a race harmless.
 */
export async function ensureCitiesSeeded() {
  if (globalThis.__mbCrmCitiesSeeded) return;
  const [[row]] = await query("SELECT COUNT(*) AS n FROM service_cities");
  if (Number(row.n) > 0) {
    globalThis.__mbCrmCitiesSeeded = true;
    return;
  }
  const { LAB_CITIES } = await import("@/data/lab/cities");
  let order = 10;
  for (const city of LAB_CITIES) {
    await query(
      "INSERT IGNORE INTO service_cities (slug, name, state, sort_order) VALUES (?, ?, ?, ?)",
      [city.slug, city.name, city.state ?? "Uttar Pradesh", order]
    );
    order += 10;
    const [[c]] = await query("SELECT id FROM service_cities WHERE slug = ?", [city.slug]);
    for (const area of city.areas ?? []) {
      const name = typeof area === "string" ? area : area?.name;
      if (name) await query("INSERT IGNORE INTO service_areas (city_id, name) VALUES (?, ?)", [c.id, String(name).slice(0, 120)]);
    }
  }
  // Link any customers/bookings already created with a free-text city.
  await query("UPDATE customers cu JOIN service_cities sc ON sc.name = cu.city SET cu.city_id = sc.id WHERE cu.city_id IS NULL");
  await query("UPDATE bookings b JOIN service_cities sc ON sc.name = b.city SET b.city_id = sc.id WHERE b.city_id IS NULL");
  globalThis.__mbCrmCitiesSeeded = true;
}
