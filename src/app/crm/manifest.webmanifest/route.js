/**
 * The CRM's own web app manifest, served at /crm/manifest.webmanifest.
 *
 * Staff and lab partners use the CRM all day on a phone. "Add to Home screen"
 * with this manifest installs it as its own app — "MB CRM" — separate from the
 * public site's install (src/app/manifest.js): a different `id` and `scope`,
 * so the two never replace each other, and it opens straight into /crm
 * without browser chrome.
 *
 * A route handler rather than the manifest.js convention, because Next only
 * honours that convention at the app root, and the root one belongs to the
 * public site. src/app/crm/layout.js points <link rel="manifest"> here.
 *
 * It must be public (the browser fetches it without the session cookie on some
 * platforms); src/proxy.js skips URLs with a file extension, so it is.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      id: "/crm",
      name: "MedicoBharat CRM",
      // 12 characters or fewer, or Android truncates it under the icon.
      short_name: "MB CRM",
      description: "MedicoBharat operations — bookings, collections, lab partners, reports and payments.",
      start_url: "/crm",
      // "/crm", not "/crm/": start_url must sit inside the scope, and "/crm" is
      // not inside "/crm/" — Chrome would then drop the scope entirely.
      scope: "/crm",
      display: "standalone",
      orientation: "portrait",
      // Matches viewport.themeColor in src/app/crm/layout.js (white top bar).
      theme_color: "#ffffff",
      background_color: "#f5f7fb",
      lang: "en-IN",
      categories: ["business", "medical", "productivity"],
      icons: [
        { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
      shortcuts: [
        { name: "New booking", url: "/crm/bookings/new" },
        { name: "Today's collections", url: "/crm/collections" },
        { name: "Leads", url: "/crm/leads" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "public, max-age=3600" } }
  );
}
