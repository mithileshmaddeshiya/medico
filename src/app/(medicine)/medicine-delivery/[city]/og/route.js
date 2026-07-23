import { ImageResponse } from "next/og";

import { cityData } from "@/data/cityData";

/**
 * Per-city share card: GET /medicine-delivery/<city>/og
 *
 * A Route Handler rather than the `opengraph-image.js` file convention, for the
 * same reason as the blog card — the convention hashes the URL, and this one is
 * referenced by hand from the page's metadata.
 *
 * These five pages previously shipped with no og:image at all: they define
 * their own `openGraph`, and Next.js shallow-merges metadata, so the root
 * layout's image was discarded rather than inherited.
 */
export const size = { width: 1200, height: 630 };

export function generateStaticParams() {
  return Object.keys(cityData).map((city) => ({ city }));
}

export async function GET(request, { params }) {
  const { city } = await params;
  const name = cityData[city]?.city ?? "your city";

  return new ImageResponse(
    (
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
            fontSize: 28,
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
          Online Medicine Delivery in {name}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 32,
            color: "#d1fae5",
          }}
        >
          Prescription support · Genuine medicines · Doorstep delivery
        </div>

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
