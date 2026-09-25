/**
 * Exports for the CRM module: customers, leads and the call log. Each reads
 * the same URL filters as its on-screen list (the parsers live in the
 * stores), so "Export" downloads exactly what is being looked at.
 */
import { CALL_OUTCOME, SOURCE, customerCode, leadCode, leadStatus } from "../constants";
import { drain, registerExport } from "../exports";
import { customerFiltersFrom, listCustomers } from "../stores/customers";
import { callFiltersFrom, leadFiltersFrom, listCalls, listLeads } from "../stores/leads";

// Exports are read in IST, like every screen.
const IST = 330 * 60000;
const ist = (v) => (v ? new Date(new Date(v).getTime() + IST).toISOString().replace("T", " ").slice(0, 16) : "");
const ymd = (v) => (v ? new Date(v).toISOString().slice(0, 10) : "");

registerExport("customers", {
  perm: "customers.view",
  title: "Customers",
  columns: [
    ["Customer ID", (c) => customerCode(c.id)],
    ["Name", (c) => c.name],
    ["Mobile", (c) => c.phone],
    ["Alternate mobile", (c) => c.alt_phone],
    ["Email", (c) => c.email],
    ["Age", (c) => c.age ?? ""],
    ["Gender", (c) => c.gender],
    ["City", (c) => c.city_name || c.city],
    ["Area", (c) => c.area],
    ["Address", (c) => c.address],
    ["Landmark", (c) => c.landmark],
    ["Source", (c) => c.source],
    ["Bookings", (c) => Number(c.bookings_count ?? 0)],
    ["Open bookings", (c) => Number(c.pending_bookings ?? 0)],
    ["Total spent", (c) => Number(c.total_spent ?? 0)],
    ["Last booking", (c) => ist(c.last_booking)],
    ["Added", (c) => ist(c.created_at)],
  ],
  fetch: (sp) => drain((page) => listCustomers({ ...customerFiltersFrom(sp), ...page })),
});

registerExport("leads", {
  perm: "leads.view",
  title: "Leads",
  columns: [
    ["Lead ID", (l) => leadCode(l.id)],
    ["Created", (l) => ist(l.created_at)],
    ["Name", (l) => l.name],
    ["Mobile", (l) => l.phone],
    ["Channel", (l) => SOURCE[l.channel]?.label ?? l.channel],
    ["Website form", (l) => l.source],
    ["Interested in", (l) => l.test],
    ["Package", (l) => l.interested_package],
    ["City", (l) => l.city],
    ["Area", (l) => l.area],
    ["Status", (l) => leadStatus(l.status).label],
    ["Assigned to", (l) => l.assigned_name || l.assigned_to || ""],
    ["Next follow-up", (l) => (l.next_follow_up ? ist(l.next_follow_up) : ymd(l.follow_up_on))],
    ["Calls", (l) => Number(l.calls_count ?? 0)],
    ["Booking", (l) => (l.booking_id ? `MB${l.booking_id}` : "")],
    ["Notes", (l) => l.notes],
  ],
  fetch: (sp, { user }) => drain((page) => listLeads({ ...leadFiltersFrom(sp, { user }), ...page })),
});

registerExport("calls", {
  perm: "leads.view",
  title: "Calls",
  columns: [
    ["Call time", (c) => ist(c.called_at)],
    ["Direction", (c) => c.direction],
    ["Outcome", (c) => CALL_OUTCOME[c.outcome]?.label ?? c.outcome],
    ["Mobile", (c) => c.phone],
    ["Name", (c) => c.name || c.lead_name || c.customer_name || ""],
    ["Duration (sec)", (c) => Number(c.duration_sec ?? 0)],
    ["Lead", (c) => (c.lead_id ? leadCode(c.lead_id) : "")],
    ["Customer", (c) => (c.customer_id ? customerCode(c.customer_id) : "")],
    ["Staff", (c) => c.user_name ?? ""],
    ["Notes", (c) => c.notes],
  ],
  fetch: (sp, { user }) => drain((page) => listCalls({ ...callFiltersFrom(sp, { user }), ...page })),
});
