import { ImageResponse } from "next/og";

/**
 * The site-wide share card, generated at build time.
 *
 * This replaces the `/images/og-image.jpg` the metadata used to point at — a
 * file that never existed, so every WhatsApp and Facebook share of the site
 * showed a blank grey box.
 *
 * Generating it rather than shipping a JPG means it can never fall out of sync
 * with the brand, and any route that wants its own card just drops its own
 * opengraph-image.js beside its page.
 */
export const alt =
  "MedicoBharat — Lab Tests & Full Body Checkups at Home";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      // No external fonts or images: the CSP-free, dependency-free version
      // renders identically on every build machine and never 404s.
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "linear-gradient(135deg, #047857 0%, #0d9488 55%, #0f766e 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#a7f3d0",
          }}
        >
          MedicoBharat
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 74,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: -2,
          }}
        >
          Lab Tests & Health Checkups, at Home
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 32,
            color: "#d1fae5",
          }}
        >
          Free home sample collection · Reports in 24 hours · Open all 7 days
        </div>

        {/* A single rule under the copy — enough structure to look designed,
            with nothing that can fail to load. */}
        <div
          style={{
            display: "flex",
            marginTop: 44,
            width: 190,
            height: 9,
            borderRadius: 9,
            background: "#a7f3d0",
          }}
        />
      </div>
    ),
    size
  );
}
