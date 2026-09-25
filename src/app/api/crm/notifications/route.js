/**
 * GET   the latest notifications for the bell (?limit, ?before for paging)
 * POST  { id } marks one read, { all: true } marks everything read
 *
 * Both are scoped to what this user may see — see notificationScope() in
 * src/lib/crm/activity.js.
 */
import { listNotifications, markAllRead, markRead, unreadCount } from "@/lib/crm/activity";
import { apiUser } from "@/lib/crm/guard";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const user = await apiUser();
  if (user instanceof Response) return user;

  const params = request.nextUrl.searchParams;
  try {
    const [items, unread] = await Promise.all([
      listNotifications(user, {
        limit: Math.min(50, Number(params.get("limit")) || 15),
        before: params.get("before") || null,
      }),
      unreadCount(user),
    ]);
    return Response.json({ ok: true, items, unread }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[crm/notifications]", err);
    return Response.json({ ok: false, error: "Could not load notifications." }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await apiUser();
  if (user instanceof Response) return user;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  try {
    if (body?.all) await markAllRead(user);
    else if (body?.id) await markRead(user, body.id);
    return Response.json({ ok: true, unread: await unreadCount(user) });
  } catch (err) {
    console.error("[crm/notifications] mark read", err);
    return Response.json({ ok: false, error: "Could not update." }, { status: 500 });
  }
}
