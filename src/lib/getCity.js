import { cityData } from "@/data/medicine/cityData";

export async function getCity(slug) {
  return cityData[slug] || null;
}

/**
 * Every medicine-delivery city as { slug, name }.
 *
 * Exists so the lab section can link into the medicine section without reaching
 * into the data layer itself. Before this, /lab-test/* carried zero links to
 * /medicine-delivery/* — the lab pages were a silo, even though both sections
 * serve the same district (medicine covers Deoria, Salempur, Barhaj, Bhatni and
 * Lar; two of those are localities on the Deoria lab page).
 */
export async function getMedicineCities() {
  return Object.values(cityData)
    .filter((c) => c?.slug && c?.city)
    .map((c) => ({ slug: c.slug, name: c.city }));
}
