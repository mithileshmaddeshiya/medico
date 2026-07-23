/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Origins allowed to request dev-only assets (/_next/*) in `next dev`.
   *
   * Next.js blocks cross-origin requests to the dev server by default. When you
   * open the site on your phone at http://192.168.1.9:3000, that IP is a
   * different origin from `localhost` — so the HTML renders but every JavaScript
   * bundle is refused, nothing hydrates, and no button works.
   *
   * The list used to name one IP (192.168.1.6). The router hands out a new DHCP
   * lease and the whole site goes dead on the phone again, with no obvious
   * error. The wildcards below cover the three private ranges a home or office
   * router can assign, so this keeps working whatever address you get.
   *
   * Development only — it has no effect on `next build` / `next start`.
   */
  allowedDevOrigins: [
    "localhost:3000",
    "192.168.*.*",
    "10.*.*.*",
    "172.16.*.*",
  ],
};

export default nextConfig;
