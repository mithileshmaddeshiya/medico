/**
 * Exports. Server only.
 *
 * /api/crm/export/<entity>?format=csv|xls&<the list's own filters>
 *
 * Each entity registers here: the permission it needs, a title, its columns
 * (header + a function of the row) and a fetch that reads the SAME filters
 * the on-screen list reads — so an export is exactly what was on screen,
 * every page of it (up to MAX_ROWS).
 *
 * Formats
 *   csv  UTF-8 with a BOM, so Excel opens ₹ and Hindi names correctly
 *   xls  SpreadsheetML 2003 — a plain XML file Excel, LibreOffice and Google
 *        Sheets open as a real spreadsheet (typed number cells, bold header),
 *        with no library to install
 *   PDF is offered where a document makes sense (a settlement statement —
 *   see /api/crm/settlements/[id]/pdf), not for raw lists.
 *
 * To add an entity: add an entry to EXPORTS with { perm, title, columns, fetch }.
 */
import { bookingCode } from "./constants";
import { bookingFiltersFrom } from "./filters";
import { listBookings } from "./stores/bookings";

export const MAX_ROWS = 5000;

const d = (v) => (v ? new Date(v).toISOString().replace("T", " ").slice(0, 16) : "");
const ymd = (v) => (v ? new Date(v).toISOString().slice(0, 10) : "");

/** Page through a list function (limit ≤ 100) until MAX_ROWS or the end. */
export async function drain(fn) {
  const out = [];
  for (let offset = 0; offset < MAX_ROWS; offset += 100) {
    const { rows } = await fn({ limit: 100, offset });
    out.push(...rows);
    if (rows.length < 100) break;
  }
  return out;
}

export const EXPORTS = {
  bookings: {
    perm: "bookings.view",
    title: "Bookings",
    columns: [
      ["Booking ID", (b) => bookingCode(b.id)],
      ["Booked at", (b) => d(b.created_at)],
      ["Customer", (b) => b.patient_name],
      ["Mobile", (b) => b.patient_phone],
      ["Age", (b) => b.age ?? ""],
      ["Gender", (b) => b.gender],
      ["City", (b) => b.city],
      ["Area", (b) => b.area],
      ["Address", (b) => b.address],
      ["Tests", (b) => b.items_label ?? ""],
      ["Source", (b) => b.source],
      ["Status", (b) => b.status],
      ["Collection date", (b) => ymd(b.collection_date)],
      ["Slot", (b) => b.collection_slot],
      ["Collector", (b) => b.collector_name ?? ""],
      ["Collection status", (b) => b.collection_status],
      ["Lab", (b) => b.partner_name ?? ""],
      ["Lab status", (b) => b.partner_status],
      ["Report status", (b) => b.report_status],
      ["Subtotal", (b) => Number(b.subtotal)],
      ["Discount", (b) => Number(b.discount)],
      ["Collection fee", (b) => Number(b.collection_fee)],
      ["Final amount", (b) => Number(b.final_amount)],
      ["Paid", (b) => Number(b.paid_amount)],
      ["Payment status", (b) => b.payment_status],
      ["Payment mode", (b) => b.payment_mode],
      ["Partner cost", (b) => Number(b.partner_cost)],
    ],
    fetch: (sp, { scope }) => drain((page) => listBookings({ ...bookingFiltersFrom(sp), ...page }, scope)),
  },
};

/** Register an entity from another module (keeps this file the one list). */
export function registerExport(key, def) {
  EXPORTS[key] = def;
}

/* ── Serialisers ──────────────────────────────────────────────────────── */

const csvCell = (v) => {
  const s = v === null || v === undefined ? "" : String(v);
  // A leading = + - @ would be run as a formula when the file is opened.
  const safe = /^[=+\-@]/.test(s) && Number.isNaN(Number(s)) ? `'${s}` : s;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export function toCsv(columns, rows) {
  const lines = [columns.map(([h]) => csvCell(h)).join(",")];
  for (const r of rows) lines.push(columns.map(([, f]) => csvCell(f(r))).join(","));
  return `﻿${lines.join("\r\n")}\r\n`;
}

const xml = (s) =>
  String(s ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function toXls(title, columns, rows) {
  const cell = (v) =>
    typeof v === "number" && Number.isFinite(v)
      ? `<Cell><Data ss:Type="Number">${v}</Data></Cell>`
      : `<Cell><Data ss:Type="String">${xml(v)}</Data></Cell>`;
  const head = `<Row ss:StyleID="h">${columns.map(([h]) => cell(h)).join("")}</Row>`;
  const body = rows.map((r) => `<Row>${columns.map(([, f]) => cell(f(r))).join("")}</Row>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles><Style ss:ID="h"><Font ss:Bold="1"/><Interior ss:Color="#EEF2FF" ss:Pattern="Solid"/></Style></Styles>
<Worksheet ss:Name="${xml(title).slice(0, 31)}"><Table>
${head}
${body}
</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><FreezePanes/><FrozenNoSplit/><SplitHorizontal>1</SplitHorizontal><TopRowBottomPane>1</TopRowBottomPane></WorksheetOptions></Worksheet>
</Workbook>`;
}
