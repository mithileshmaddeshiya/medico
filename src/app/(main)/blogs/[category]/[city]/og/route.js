import { ImageResponse } from "next/og";

import { blogs } from "@/data/blogData";

/**
 * Per-article share card: GET /blogs/<category>/<city>/og
 *
 * A plain Route Handler rather than the `opengraph-image.js` file convention,
 * because that convention appends a content hash to the URL
 * (…/opengraph-image-sbz2ut) which changes whenever the file changes. The
 * BlogPosting schema in page.js has to name an image URL, and a URL that moves
 * between builds is a URL that 404s in Google's cache.
 *
 * This path is stable, so the same URL feeds og:image, twitter:image and the
 * schema — three places that can now never disagree.
 *
 * Replaces the old `image:` values in blogData.js, which pointed at
 * /public/blogs/*.webp — files that were never added to the repo.
 */
export const size = { width: 1200, height: 630 };

// Prerendered at build time, one per article.
export function generateStaticParams() {
  return blogs.map((blog) => ({ category: blog.category, city: blog.city }));
}

export async function GET(request, { params }) {
  const { category, city } = await params;
  const blog = blogs.find((b) => b.category === category && b.city === city);

  const title = blog?.title?.trim() || "MedicoBharat";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 90px",
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

        {/* Long headlines are common here, so the size steps down rather than
            overflowing the card. */}
        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 58 : 70,
            fontWeight: 800,
            lineHeight: 1.14,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 130,
              height: 8,
              borderRadius: 8,
              background: "#a7f3d0",
            }}
          />
          <div style={{ display: "flex", fontSize: 27, color: "#d1fae5" }}>
            medicobharat.com
          </div>
        </div>
      </div>
    ),
    size
  );
}
