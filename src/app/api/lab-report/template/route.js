/**
 * The lab-report cover design, for signed-in staff only.
 *
 * The generator at /lab-report builds the PDF in the browser and needs these
 * bytes to do it. They are served from here rather than from /public so the
 * blank branded form is not a public URL anyone can download and fill in
 * themselves: a MedicoBharat cover on a report we never handled is exactly
 * the thing this tool must not make easy.
 *
 * The file is read from disk at request time, so next.config.mjs lists it in
 * outputFileTracingIncludes — without that it is left out of the deployment.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import { can } from "@/lib/admin/auth";
import { getUser } from "@/lib/admin/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEMPLATE = path.join(process.cwd(), "assets", "lab-report", "cover-template.jpg");

export async function GET() {
  const user = await getUser();
  if (!user) {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  if (!can(user, "editor")) {
    return Response.json({ ok: false, error: "Your account has read-only access." }, { status: 403 });
  }

  const bytes = await readFile(TEMPLATE);
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(bytes.byteLength),
      // Private: never stored by a CDN or a shared proxy.
      "Cache-Control": "private, max-age=3600",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
