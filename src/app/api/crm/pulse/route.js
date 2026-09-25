/**
 * The heartbeat the CRM polls every 20 s (src/components/crm/Pulse.jsx).
 *
 * Deliberately tiny: two indexed MAX/COUNT queries. `latest` is the newest
 * activity row this user may see — when it moves, the open page refreshes.
 * Staff pulses also run the website → CRM catch-up (throttled to once a
 * minute per server process inside syncPending), so a website order whose
 * sync hook failed still appears within about a minute.
 */
import { query } from "@/lib/db";
import { unreadCount } from "@/lib/crm/activity";
import { apiUser } from "@/lib/crm/guard";
import { syncPending } from "@/lib/crm/sync";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await apiUser();
  if (user instanceof Response) return user;

  try {
    if (!user.isPartner) await syncPending();

    const [[latestRows], unread] = await Promise.all([
      user.isPartner
        ? query("SELECT COALESCE(MAX(id), 0) AS id FROM admin_audit WHERE partner_id = ?", [user.partnerId])
        : query("SELECT COALESCE(MAX(id), 0) AS id FROM admin_audit"),
      unreadCount(user),
    ]);

    return Response.json(
      { ok: true, unread, latest: Number(latestRows[0]?.id ?? 0) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[crm/pulse]", err);
    return Response.json({ ok: false }, { status: 503 });
  }
}
