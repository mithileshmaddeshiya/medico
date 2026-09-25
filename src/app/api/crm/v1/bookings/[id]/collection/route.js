/**
 * POST /api/crm/v1/bookings/:id/collection — the collector's buttons.
 * Body: { status: confirmed|on_the_way|arrived|collected|failed, note? }
 * (a note is required for failed). Collectors are scoped to their own.
 */
import { endpoint } from "@/lib/crm/api";
import { getBooking, updateCollection } from "@/lib/crm/stores/bookings";

export const dynamic = "force-dynamic";

export const POST = endpoint("collections.manage", async ({ user, scope, params, body }) => {
  await updateCollection(params.id, body.status, { user, scope, note: body.note ?? "" });
  const b = await getBooking(params.id, scope);
  return { id: b?.id, status: b?.status, collection_status: b?.collection_status };
});
