/** @type {import('next').NextConfig} */

/* ── The medicine-delivery section, retired ───────────────────────────────
   MedicoBharat is a lab-test service now. The /medicine-delivery/* pages and
   the three Deoria medicine guides have been removed from the codebase, so
   every URL they used to serve is redirected here instead of 404-ing.

   WHY A REDIRECT AND NOT A DELETE. Those URLs were in the sitemap, were linked
   from the footer of every page, and some of them are indexed. Dropping them
   cold would hand Google a wall of 404s at the exact moment we want it to
   re-read the site as a lab-test site — and the crawl equity they hold would
   simply be lost. A permanent redirect passes that equity to the lab page for
   the same town and tells the crawler, in the clearest signal there is, what
   this site is now about.

   `permanent: true` is a 308, not a 301. Same meaning to a search engine
   (permanent, cache it, pass the signal); it just preserves the request method
   as well. See node_modules/next/dist/docs/01-app/03-api-reference/05-config/
   01-next-config-js/redirects.md.

   Each town points at the lab page that actually covers it. Salempur, Barhaj,
   Lar and Bhatni are all localities on the Deoria lab page (see `areas` in
   src/data/lab/cities.js), so Deoria is the honest destination — NOT the home
   page. A redirect to the home page is what Google calls a soft 404 and gets
   treated as one; a redirect to the page that genuinely serves that town is
   the one that keeps the ranking.

   DO NOT REMOVE THESE once the pages "look gone". A permanent redirect has to
   stay live for as long as anything still links to the old URL — which for a
   search index means years, not weeks. */
const MEDICINE_TOWN_REDIRECTS = ["deoria", "salempur", "barhaj", "lar", "bhatni"].map(
  (town) => ({
    source: `/medicine-delivery/${town}`,
    destination: "/lab-test/deoria",
    permanent: true,
  })
);

/* The three Deoria medicine guides. Each one's call to action pointed at the
   Deoria medicine page, so that town's lab page is the closest thing the site
   still has to what the reader was looking for. */
const MEDICINE_BLOG_REDIRECTS = [
  "online-medicine-delivery",
  "medicine-home-delivery",
  "buy-medicines-online",
].map((category) => ({
  source: `/blogs/${category}/deoria`,
  destination: "/lab-test/deoria",
  permanent: true,
}));

const nextConfig = {
  /**
   * Pin the workspace root.
   *
   * A stray package-lock.json in the user's home directory made Turbopack infer
   * `C:\Users\Administration` as the root instead of this project, and say so on
   * every build. That is not cosmetic: the inferred root decides how files
   * outside the app are resolved and traced, so it can produce a build that
   * works locally and ships with assets missing on the host.
   *
   * `import.meta.dirname` is this file's own directory, which is the project
   * root by definition — so this cannot drift if the repo is cloned elsewhere.
   */
  turbopack: {
    root: import.meta.dirname,
  },

  images: {
    /**
     * The widths next/image is allowed to generate for a `sizes`-driven srcset.
     *
     * The default list ends 2048, 3840. Every source image on this site is at
     * most 1700px wide, so those two entries could only ever produce an upscale
     * — a bigger file that carries no more detail, generated and cached per
     * variant. Capping at 1920 removes them.
     *
     * The small end is kept dense: this audience is on phones, and 640/750/828
     * are the widths that actually get served.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

    /**
     * A year. These are content images with immutable paths — the hero, the
     * logo, the share card — so a long cache is safe and it is what keeps a
     * repeat visit from re-fetching the LCP image. Changing an image means
     * changing its filename, which the WebP conversion already did.
     */
    minimumCacheTTL: 31536000,
  },

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

  async redirects() {
    return [
      ...MEDICINE_TOWN_REDIRECTS,
      ...MEDICINE_BLOG_REDIRECTS,

      /* Anything else under the retired section — an old campaign URL, a
         mistyped town, a link somebody shared. It lands on the flagship lab
         city rather than a 404. Kept LAST so the specific town rules above
         win; the first matching rule is the one that runs.

         `:slug*` matches zero or more segments, so a bare /medicine-delivery
         is covered by the same rule. */
      {
        source: "/medicine-delivery/:slug*",
        destination: "/lab-test/varanasi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
