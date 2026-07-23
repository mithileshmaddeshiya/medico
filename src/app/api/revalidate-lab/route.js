import { revalidateTag } from "next/cache";

import { LAB_CITIES_TAG } from "@/lib/labCities";

/**
 * Push a Firestore change to the live site immediately.
 *
 * Without this the lab pages and the sitemap still update on their own — they
 * just take up to an hour. Hit this after adding a city in the console when
 * you want it indexed today rather than tonight:
 *
 *   https://www.medicobharat.com/api/revalidate-lab?secret=<REVALIDATE_SECRET>
 *
 * Set REVALIDATE_SECRET in the hosting environment (Vercel → Settings →
 * Environment Variables). Until it is set the route refuses every request, so
 * an unset secret can never become an open cache-buster.
 */
export async function GET(request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return Response.json(
      { revalidated: false, message: "REVALIDATE_SECRET is not configured." },
      { status: 500 }
    );
  }

  const provided = new URL(request.url).searchParams.get("secret");
  if (provided !== secret) {
    return Response.json(
      { revalidated: false, message: "Invalid secret." },
      { status: 401 }
    );
  }

  // Every lab page, the sitemap and the footer read through this one tag.
  revalidateTag(LAB_CITIES_TAG);

  return Response.json({ revalidated: true, tag: LAB_CITIES_TAG });
}
