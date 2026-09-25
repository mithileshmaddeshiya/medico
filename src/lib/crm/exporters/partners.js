/**
 * Exports for lab partners and their settlements. Each reads the same search
 * params its on-screen list reads (partnerFiltersFrom / settlementFiltersFrom
 * in the stores), so the file is exactly what was on screen.
 *
 * The settlements export has no customer price or margin for a caller scoped
 * to a partner: the store strips them (shapeForPartner) and the columns print
 * blank rather than a zero that looks like a real figure. The export route
 * refuses partners outright (export.data is forbidden to them) — this is the
 * second lock, not the first.
 */
import { drain, registerExport } from "../exports";
import { SETTLEMENT_STATUS, partnerCode, settlementCode } from "../constants";
import { AGREEMENT, PARTNER_RECORD_STATUS, listPartners, partnerFiltersFrom } from "../stores/partners";
import { listSettlements, settlementFiltersFrom } from "../stores/settlements";

const ymd = (v) => (v ? new Date(v).toISOString().slice(0, 10) : "");
const hrs = (h) => (h === null || h === undefined ? "" : Math.round(Number(h) * 10) / 10);
const maybe = (v) => (v === undefined || v === null || v === "" ? "" : Number(v));

registerExport("partners", {
  perm: "partners.view",
  title: "Lab partners",
  columns: [
    ["Partner ID", (p) => partnerCode(p.id)],
    ["Lab", (p) => p.name],
    ["Contact person", (p) => p.contact_person],
    ["Mobile", (p) => p.phone],
    ["Email", (p) => p.email],
    ["City", (p) => p.city],
    ["Status", (p) => PARTNER_RECORD_STATUS[p.status]?.label ?? p.status],
    ["Agreement", (p) => AGREEMENT[p.agreement_status]?.label ?? p.agreement_status],
    ["Joined", (p) => ymd(p.joined_on)],
    ["Orders assigned", (p) => p.assigned],
    ["Open orders", (p) => p.pending],
    ["Completed", (p) => p.completed],
    ["Rejected", (p) => p.rejected],
    ["Avg turnaround (h)", (p) => hrs(p.avg_tat_hours)],
    ["Revenue generated", (p) => Number(p.revenue)],
    ["Payable pending", (p) => Number(p.payable_pending)],
    ["Paid to date", (p) => Number(p.paid_total)],
  ],
  fetch: (sp) => drain((page) => listPartners({ ...partnerFiltersFrom(sp), ...page })),
});

registerExport("settlements", {
  perm: "settlements.view",
  title: "Settlements",
  columns: [
    ["Statement", (s) => settlementCode(s.id)],
    ["Lab", (s) => s.partner_name],
    ["Period from", (s) => ymd(s.period_from)],
    ["Period to", (s) => ymd(s.period_to)],
    ["Orders", (s) => s.bookings_count],
    ["Customer amount", (s) => maybe(s.gross_amount)],
    ["Partner payable", (s) => Number(s.partner_payable)],
    ["MedicoBharat margin", (s) => maybe(s.margin)],
    ["Adjustments", (s) => Number(s.adjustments)],
    ["Net payable", (s) => Number(s.net_payable)],
    ["Paid", (s) => Number(s.paid_amount)],
    ["Status", (s) => SETTLEMENT_STATUS[s.status]?.label ?? s.status],
    ["Paid on", (s) => ymd(s.paid_on)],
    ["Mode", (s) => s.mode],
    ["Reference / UTR", (s) => s.reference],
    ["Generated", (s) => ymd(s.created_at)],
  ],
  fetch: (sp, { scope }) => drain((page) => listSettlements({ ...settlementFiltersFrom(sp), ...page }, scope)),
});
