/**
 * Global search (Ctrl K). GET ?q=
 *
 * Each group is searched only if the user may see it, and bookings are
 * filtered by the user's scope — a lab partner searching a phone number gets
 * nothing, because a partner never sees phone numbers; searching a booking ID
 * finds only their own orders.
 *
 * Every query is indexed or a LIKE on a short column, LIMIT 5, run in
 * parallel: fast enough to answer while someone is still typing.
 */
import { query } from "@/lib/db";
import { bookingCode, customerCode, leadCode, parseBookingCode, partnerCode, paymentCode } from "@/lib/crm/constants";
import { apiUser, has, scopeOf } from "@/lib/crm/guard";
import { rupees } from "@/lib/crm/format";
import { scopeWhere } from "@/lib/crm/stores/bookings";

export const dynamic = "force-dynamic";

const like = (v) => `%${String(v).replace(/[%_]/g, "\\$&")}%`;

export async function GET(request) {
  const user = await apiUser();
  if (user instanceof Response) return user;

  const q = String(request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2) return Response.json({ ok: true, results: {} });

  const digits = q.replace(/\D/g, "");
  const code = parseBookingCode(q);
  const scope = scopeOf(user);
  const jobs = {};

  try {
    if (has(user, "bookings.view") || has(user, "collections.view")) {
      const s = scopeWhere(scope);
      const ors = ["b.patient_name LIKE ?"];
      const params = [like(q)];
      if (code) {
        ors.push("b.id = ?");
        params.push(code);
      }
      if (digits.length >= 4 && !user.isPartner) {
        ors.push("b.patient_phone LIKE ?");
        params.push(like(digits));
      }
      jobs.bookings = query(
        `SELECT b.id, b.patient_name, b.patient_phone, b.status, b.city, b.final_amount FROM bookings b
         WHERE b.deleted_at IS NULL AND (${ors.join(" OR ")}) ${s.sql.length ? `AND ${s.sql.join(" AND ")}` : ""}
         ORDER BY b.id DESC LIMIT 6`,
        [...params, ...s.params]
      ).then(([rows]) =>
        rows.map((b) => ({
          id: b.id,
          title: `${bookingCode(b.id)} · ${b.patient_name}`,
          sub: [user.isPartner ? null : b.patient_phone, b.city, String(b.status).replace(/_/g, " ")].filter(Boolean).join(" · "),
          badge: user.isPartner ? null : rupees(b.final_amount),
          href: `/crm/bookings/${b.id}`,
        }))
      );
    }

    if (has(user, "customers.view")) {
      jobs.customers = query(
        `SELECT id, name, phone, city FROM customers
         WHERE status = 'active' AND (name LIKE ? ${digits.length >= 4 ? "OR phone LIKE ? OR alt_phone LIKE ?" : ""})
         ORDER BY updated_at DESC LIMIT 5`,
        digits.length >= 4 ? [like(q), like(digits), like(digits)] : [like(q)]
      ).then(([rows]) =>
        rows.map((c) => ({ id: c.id, title: c.name, sub: [customerCode(c.id), c.phone, c.city].filter(Boolean).join(" · "), href: `/crm/customers/${c.id}` }))
      );
    }

    if (has(user, "leads.view")) {
      const leadId = /^ld\s*(\d+)$/i.exec(q)?.[1];
      jobs.leads = query(
        `SELECT id, name, phone, city, status FROM leads
         WHERE (name LIKE ? ${digits.length >= 4 ? "OR phone LIKE ?" : ""} ${leadId ? "OR id = ?" : ""})
         ORDER BY id DESC LIMIT 5`,
        [like(q), ...(digits.length >= 4 ? [like(digits)] : []), ...(leadId ? [Number(leadId)] : [])]
      ).then(([rows]) =>
        rows.map((l) => ({ id: l.id, title: `${l.name}`, sub: [leadCode(l.id), l.phone, l.city, l.status].filter(Boolean).join(" · "), href: `/crm/leads/${l.id}` }))
      );
    }

    if (has(user, "partners.view")) {
      jobs.partners = query(
        `SELECT id, name, contact_person, city FROM partners
         WHERE status <> 'deleted' AND (name LIKE ? OR contact_person LIKE ? ${digits.length >= 4 ? "OR phone LIKE ?" : ""})
         ORDER BY name LIMIT 5`,
        [like(q), like(q), ...(digits.length >= 4 ? [like(digits)] : [])]
      ).then(([rows]) =>
        rows.map((p) => ({ id: p.id, title: p.name, sub: [partnerCode(p.id), p.contact_person, p.city].filter(Boolean).join(" · "), href: `/crm/partners/${p.id}` }))
      );
    }

    if (has(user, "catalog.view") || has(user, "bookings.manage")) {
      jobs.tests = query(
        `SELECT id, name, is_package, price, code FROM lab_tests
         WHERE status <> 'deleted' AND (name LIKE ? OR code LIKE ? OR id LIKE ?)
         ORDER BY is_package DESC, name LIMIT 5`,
        [like(q), like(q), like(q)]
      ).then(([rows]) =>
        rows.map((t) => ({
          id: t.id,
          title: t.name,
          sub: [t.is_package ? "Package" : "Test", t.code].filter(Boolean).join(" · "),
          badge: t.price !== null ? rupees(t.price) : "Call for price",
          href: t.is_package ? `/crm/packages/${encodeURIComponent(t.id)}` : `/crm/tests/${encodeURIComponent(t.id)}`,
        }))
      );
    }

    if (has(user, "payments.view")) {
      const payId = /^pay\s*(\d+)$/i.exec(q)?.[1];
      jobs.payments = query(
        `SELECT pm.id, pm.amount, pm.mode, pm.status, pm.reference, pm.booking_id, b.patient_name
         FROM payments pm LEFT JOIN bookings b ON b.id = pm.booking_id
         WHERE pm.reference LIKE ? OR pm.gateway_payment_id LIKE ? ${payId ? "OR pm.id = ?" : ""} ${code ? "OR pm.booking_id = ?" : ""}
         ORDER BY pm.id DESC LIMIT 5`,
        [like(q), like(q), ...(payId ? [Number(payId)] : []), ...(code ? [code] : [])]
      ).then(([rows]) =>
        rows.map((p) => ({
          id: p.id,
          title: `${paymentCode(p.id)} · ${rupees(p.amount)} ${String(p.mode).toUpperCase()}`,
          sub: [p.booking_id ? bookingCode(p.booking_id) : null, p.patient_name, p.status, p.reference].filter(Boolean).join(" · "),
          href: p.booking_id ? `/crm/bookings/${p.booking_id}` : `/crm/payments?q=PAY${p.id}`,
        }))
      );
    }

    const keys = Object.keys(jobs);
    const settled = await Promise.allSettled(Object.values(jobs));
    const results = {};
    settled.forEach((r, i) => {
      if (r.status === "fulfilled") results[keys[i]] = r.value;
      else console.error(`[crm/search] ${keys[i]}`, r.reason);
    });
    return Response.json({ ok: true, results }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[crm/search]", err);
    return Response.json({ ok: false, error: "Search failed." }, { status: 500 });
  }
}
