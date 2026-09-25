/**
 * GET ?phone=9876543210 → the existing customer on that number, for the
 * booking form to fill itself in ("returning customer · 3 bookings").
 */
import { query } from "@/lib/db";
import { apiUser } from "@/lib/crm/guard";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const user = await apiUser(["bookings.manage", "customers.view", "leads.manage"]);
  if (user instanceof Response) return user;

  const phone = String(request.nextUrl.searchParams.get("phone") ?? "").replace(/\D/g, "").slice(-10);
  if (phone.length !== 10) return Response.json({ ok: true, customer: null });

  try {
    const [[c]] = await query(
      `SELECT c.id, c.name, c.phone, c.alt_phone, c.email, c.age, c.gender, c.address, c.city_id, c.city, c.area, c.landmark,
              (SELECT COUNT(*) FROM bookings b WHERE b.customer_id = c.id AND b.deleted_at IS NULL) AS bookings,
              (SELECT MAX(created_at) FROM bookings b WHERE b.customer_id = c.id) AS last_booking
       FROM customers c WHERE c.phone = ? AND c.status = 'active'`,
      [phone]
    );
    return Response.json({ ok: true, customer: c ?? null }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[crm/lookup/customer]", err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
