/**
 * Finance exports: payments, refunds, expenses (each exactly the on-screen
 * list, same filters) and revenue (one row per IST day of the range).
 * Registered into the shared EXPORTS table; see ../exports.js.
 */
import { EXPENSE_CATEGORY, PAYMENT_MODE, REFUND_STATUS, TXN_STATUS, bookingCode, paymentCode } from "../constants";
import { range } from "../dates";
import { drain, registerExport } from "../exports";
import { dateRangeOf } from "../filters";
import {
  expenseFiltersFrom,
  listExpenses,
  listPayments,
  listRefunds,
  paymentFiltersFrom,
  refundCode,
  refundFiltersFrom,
  revenueDaily,
} from "../stores/finance";

/** A UTC instant → "YYYY-MM-DD HH:MM" in IST, which is what the screens show. */
const ist = (v) => (v ? new Date(new Date(v).getTime() + 330 * 60000).toISOString().replace("T", " ").slice(0, 16) : "");
const mode = (m) => PAYMENT_MODE[m]?.label ?? m ?? "";

registerExport("payments", {
  perm: "payments.view",
  title: "Payments",
  columns: [
    ["Txn", (p) => paymentCode(p.id)],
    ["Received at (IST)", (p) => ist(p.received_at)],
    ["Booking", (p) => (p.booking_id ? bookingCode(p.booking_id) : "")],
    ["Customer", (p) => p.patient_name || p.customer_name || ""],
    ["Mobile", (p) => p.patient_phone || p.customer_phone || ""],
    ["Amount", (p) => Number(p.amount)],
    ["Mode", (p) => mode(p.mode)],
    ["Status", (p) => TXN_STATUS[p.status]?.label ?? p.status],
    ["Collected by", (p) => p.collected_by_name ?? ""],
    ["Reference / UTR", (p) => p.reference],
    ["Gateway payment ID", (p) => p.gateway_payment_id ?? ""],
    ["Notes", (p) => p.notes],
  ],
  fetch: (sp) => drain((page) => listPayments({ ...paymentFiltersFrom(sp), ...page })),
});

registerExport("refunds", {
  perm: "payments.view",
  title: "Refunds",
  columns: [
    ["Refund", (r) => refundCode(r.id)],
    ["Requested at (IST)", (r) => ist(r.created_at)],
    ["Booking", (r) => bookingCode(r.booking_id)],
    ["Customer", (r) => r.patient_name ?? ""],
    ["Mobile", (r) => r.patient_phone ?? ""],
    ["Amount", (r) => Number(r.amount)],
    ["Via", (r) => mode(r.mode)],
    ["Status", (r) => REFUND_STATUS[r.status]?.label ?? r.status],
    ["Reason", (r) => r.reason],
    ["Requested by", (r) => r.requested_by_name ?? ""],
    ["Processed at (IST)", (r) => ist(r.processed_at)],
    ["Processed by", (r) => r.processed_by_name ?? ""],
    ["Reference / UTR", (r) => r.reference],
  ],
  fetch: (sp) => drain((page) => listRefunds({ ...refundFiltersFrom(sp), ...page })),
});

registerExport("expenses", {
  perm: "expenses.view",
  title: "Expenses",
  columns: [
    ["Date", (e) => e.spent_day],
    ["Category", (e) => EXPENSE_CATEGORY[e.category]?.label ?? e.category],
    ["Amount", (e) => Number(e.amount)],
    ["Paid by", (e) => mode(e.mode)],
    ["Paid to", (e) => e.paid_to],
    ["City", (e) => e.city_name ?? ""],
    ["Reference", (e) => e.reference],
    ["Notes", (e) => e.notes],
    ["Added by", (e) => e.created_by_name ?? ""],
  ],
  fetch: (sp) => drain((page) => listExpenses({ ...expenseFiltersFrom(sp), ...page })),
});

registerExport("revenue", {
  perm: "revenue.view",
  title: "Revenue by day",
  columns: [
    ["Day (IST)", (d) => d.day],
    ["Collected (cash)", (d) => d.collected],
    ["Refunds processed (cash)", (d) => d.refunds],
    ["Net cash", (d) => d.net],
    ["New bookings", (d) => d.newBookings],
    ["Bookings report ready (accrual)", (d) => d.earnedBookings],
    ["Booked revenue (accrual)", (d) => d.bookedRevenue],
    ["Partner cost (accrual)", (d) => d.partnerCost],
    ["Gross margin (accrual)", (d) => d.margin],
    ["Expenses", (d) => d.expenses],
  ],
  // Same default as the page: this month when no range is given.
  fetch: (sp) => revenueDaily(dateRangeOf(sp, "month") ?? range("month")),
});
