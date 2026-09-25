/**
 * The CRM's service worker, served at /crm-sw.js and registered with scope
 * /crm by src/components/crm/InstallApp.jsx.
 *
 * It exists only so Android Chrome treats the CRM as an installable app and
 * offers the install prompt. It caches NOTHING and never answers a request
 * itself: every request goes to the network exactly as without it, so patient
 * data is never stored on the phone and the CRM can never show stale data.
 *
 * Served from the site root (not /crm/sw.js) because a worker's scope can only
 * cover its own folder and below — from /crm/ it could not control /crm
 * itself, which is the app's start URL.
 */
const SW = `
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
// Network only — deliberately no respondWith, no cache.
self.addEventListener("fetch", () => {});
`;

export const dynamic = "force-static";

export function GET() {
  return new Response(SW, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache",
      "Service-Worker-Allowed": "/crm",
    },
  });
}
