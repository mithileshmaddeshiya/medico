/**
 * Apply the admin panel's per-route SEO overrides to a page's metadata.
 * Server only.
 *
 *   const baseMetadata = { title: "About", description: "…", … };
 *   export const generateMetadata = () => withRouteSeo("/about", baseMetadata);
 *
 * The page's own metadata stays the default and stays in the page file, with
 * the comments that explain it. An override replaces only the fields the panel
 * actually set; an empty field in the panel means "leave the page alone".
 *
 * A title or description override is copied into openGraph and twitter as
 * well. Otherwise the search result would say one thing while the WhatsApp
 * preview said the old thing — two descriptions of one page.
 *
 * routeOverrides() never throws, so a database outage gives the page exactly
 * the metadata it had before the panel existed.
 */
import { routeOverrides } from "@/lib/admin/seoStore";
import { url } from "@/lib/site";

export async function withRouteSeo(route, base) {
  const override = (await routeOverrides()).get(route);
  if (!override) return base;

  const meta = { ...base };

  if (override.title) {
    meta.title = override.title;
    if (meta.openGraph) meta.openGraph = { ...meta.openGraph, title: override.title };
    if (meta.twitter) meta.twitter = { ...meta.twitter, title: override.title };
  }

  if (override.description) {
    meta.description = override.description;
    if (meta.openGraph) meta.openGraph = { ...meta.openGraph, description: override.description };
    if (meta.twitter) meta.twitter = { ...meta.twitter, description: override.description };
  }

  if (override.keywords?.length) meta.keywords = override.keywords;

  if (override.canonical) {
    const canonical = override.canonical.startsWith("http")
      ? override.canonical
      : url(override.canonical);
    meta.alternates = { ...meta.alternates, canonical };
  }

  if (override.noindex || override.nofollow) {
    meta.robots = { index: !override.noindex, follow: !override.nofollow };
  }

  return meta;
}
