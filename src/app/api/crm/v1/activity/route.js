/**
 * GET /api/crm/v1/activity — the activity log, newest first.
 * ?entity, entityId, actor, action, from, to (YYYY-MM-DD), q, limit (≤ 200), offset.
 * Scoped exactly like /crm/activity: partners see their own rows, staff
 * without activity.view only their own actions.
 */
import { endpoint } from "@/lib/crm/api";
import { listActivity } from "@/lib/crm/activity";

export const dynamic = "force-dynamic";

export const GET = endpoint(null, async ({ user, query }) => {
  const { rows, total } = await listActivity(user, {
    entity: query.entity || null,
    entityId: query.entityId || null,
    actorId: query.actor || null,
    action: query.action || null,
    from: query.from || null,
    to: query.to || null,
    search: query.q || "",
    limit: query.limit,
    offset: query.offset,
  });
  return { data: rows, meta: { total } };
});
