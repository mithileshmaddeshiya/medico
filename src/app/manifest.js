import { coverageHi } from "@/lib/coverage";

/**
 * The web app manifest, served at /manifest.webmanifest.
 *
 * ── WHY A LAB BOOKING SITE WANTS ONE ──────────────────────────────────────
 * This is not about being a "PWA". It is about the second booking. A patient
 * who books a test once has a reason to come back — the next quarterly sugar
 * check, a family member's fever panel, a repeat thyroid profile — and the
 * cheapest way to be there when they do is an icon on their home screen.
 *
 * Without a manifest, "Add to home screen" produces an unbranded shortcut with
 * a screenshot for an icon. With one, it installs as MedicoBharat, opens
 * without browser chrome, and lands on the booking page rather than the
 * browser's last scroll position.
 *
 * ── WHY IT IS A .js AND NOT A .json ───────────────────────────────────────
 * `description` names the towns we serve, and that list is derived from
 * LAB_CITIES rather than typed — the same reason every other coverage string
 * on the site now is. A static manifest.json would be one more place to forget
 * when the seventh city ships. See src/lib/coverage.js.
 *
 * Next.js emits the <link rel="manifest"> itself for this file convention, so
 * there must be no `manifest:` key in the metadata export — see the note in
 * src/app/layout.js.
 */
export default function manifest() {
  return {
    name: "MedicoBharat — Lab Test at Home",

    // 12 characters or fewer, or Android truncates it under the icon.
    short_name: "MedicoBharat",

    description: `Lab test aur full body checkup ghar baithe book kijiye — free home sample collection ${coverageHi()} me, report 24 ghante me.`,

    // The booking page, not "/". An installed icon is tapped by someone who
    // has already decided; the home page is where the form is.
    start_url: "/",

    // Hides the URL bar. `standalone` rather than `fullscreen` on purpose — a
    // form needs the system status bar so a patient can see the time and their
    // signal while a callback is pending.
    display: "standalone",

    // Matches `viewport.themeColor` in src/app/layout.js. If one changes, change
    // both, or the browser chrome and the splash screen disagree.
    theme_color: "#059669",

    // The splash background behind the icon while the app opens. White, because
    // that is what every page's body actually is — a coloured splash that fades
    // into a white page reads as a flash.
    background_color: "#ffffff",

    lang: "hi-Latn-IN",
    dir: "ltr",
    categories: ["health", "medical", "lifestyle"],

    // The same square lockup the Organization schema uses, so the brand mark is
    // identical in search results, on the home screen and in the app switcher.
    // `maskable` lets Android crop it to the device's icon shape without
    // clipping the wordmark — the 512 is padded for exactly that.
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
