/**
 * GET /api/crm/settlements/<id>/pdf — the settlement statement as an A4 PDF.
 *
 * Staff get the full statement (customer price, partner cost, margin per line
 * and in total). A lab partner gets its own statements only — getSettlement is
 * scoped — and the partner version, which has no customer price and no margin
 * because the store has already removed them.
 *
 * Built with pdf-lib's standard Helvetica, which only covers WinAnsi: "₹" is
 * written "Rs." and any character outside the set (a Hindi name) is replaced
 * rather than crashing the render. Rows paginate across as many pages as the
 * statement needs; the header repeats on each.
 */
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { logActivity } from "@/lib/crm/activity";
import { PAYMENT_MODE, SETTLEMENT_STATUS, bookingCode, partnerCode, settlementCode } from "@/lib/crm/constants";
import { apiUser, scopeOf } from "@/lib/crm/guard";
import { maskAccount } from "@/lib/crm/stores/partners";
import { getSettlement } from "@/lib/crm/stores/settlements";

export const dynamic = "force-dynamic";

const A4 = [595.28, 841.89];
const M = 40; // margin
const C = {
  ink: rgb(0.06, 0.09, 0.16),
  muted: rgb(0.39, 0.45, 0.55),
  line: rgb(0.89, 0.91, 0.94),
  blue: rgb(0.15, 0.39, 0.92),
  head: rgb(0.95, 0.96, 0.98),
};

const TZ = "Asia/Kolkata";
const dayText = (v) =>
  v ? new Date(v).toLocaleDateString("en-IN", { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" }) : "-";
const istText = (v) =>
  new Date(v).toLocaleString("en-IN", { timeZone: TZ, day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const money = (n) =>
  `Rs. ${Number(n ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const signed = (n) => `${Number(n) < 0 ? "- " : "+ "}${money(Math.abs(Number(n)))}`;

export async function GET(request, { params }) {
  const { id } = await params;
  const user = await apiUser("settlements.view");
  if (user instanceof Response) return user;

  const s = await getSettlement(id, scopeOf(user));
  if (!s) return Response.json({ ok: false, error: "Not found." }, { status: 404 });
  const partnerView = Boolean(user.isPartner);

  try {
    const bytes = await render(s, { partnerView });
    await logActivity({
      user,
      action: "export",
      entity: "settlements",
      entityId: s.id,
      partnerId: s.partner_id,
      summary: `Downloaded ${settlementCode(s.id)} as PDF`,
    });
    return new Response(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="medicobharat-${settlementCode(s.id)}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[crm/settlements/pdf]", err);
    return Response.json({ ok: false, error: "The PDF could not be made. Try again." }, { status: 500 });
  }
}

async function render(s, { partnerView }) {
  const doc = await PDFDocument.create();
  const [bold, regular] = await Promise.all([doc.embedFont(StandardFonts.HelveticaBold), doc.embedFont(StandardFonts.Helvetica)]);
  doc.setTitle(`Settlement ${settlementCode(s.id)} - ${clean(s.partner_name, regular)}`);
  doc.setAuthor("MedicoBharat");
  doc.setCreator("MedicoBharat CRM");
  doc.setProducer("MedicoBharat");

  const generated = istText(Date.now());
  const W = A4[0] - M * 2;

  // Columns: [header, width, align, value(item)]
  const cols = partnerView
    ? [
        ["Order", 70, "left", (i) => bookingCode(i.booking_id)],
        ["Date", 72, "left", (i) => dayTextIst(i.report_ready_at ?? i.booked_at)],
        ["Patient", 80, "left", (i) => i.patient_first ?? ""],
        ["Tests", W - 70 - 72 - 80 - 90, "left", (i) => i.items_label ?? ""],
        ["Your amount", 90, "right", (i) => money(i.partner_amount)],
      ]
    : [
        ["Booking", 58, "left", (i) => bookingCode(i.booking_id)],
        ["Date", 62, "left", (i) => dayTextIst(i.report_ready_at ?? i.booked_at)],
        ["Patient", 62, "left", (i) => i.patient_first ?? ""],
        ["Tests", W - 58 - 62 - 62 - 75 * 3, "left", (i) => i.items_label ?? ""],
        ["Customer", 75, "right", (i) => money(i.customer_amount)],
        ["Partner", 75, "right", (i) => money(i.partner_amount)],
        ["Margin", 75, "right", (i) => money(i.margin)],
      ];

  let page;
  let y;

  const text = (str, x, yy, { font = regular, size = 9, color = C.ink, maxW = null, align = "left" } = {}) => {
    let t = clean(str, font);
    if (maxW) t = fit(t, font, size, maxW);
    const w = font.widthOfTextAtSize(t, size);
    page.drawText(t, { x: align === "right" ? x - w : x, y: yy, size, font, color });
  };

  const newPage = () => {
    page = doc.addPage(A4);
    y = A4[1] - M;
    // Brand header, on every page.
    text("MedicoBharat", M, y - 14, { font: bold, size: 18, color: C.blue });
    text(partnerView ? "Payment statement" : "Partner settlement statement", A4[0] - M, y - 8, { font: bold, size: 11, align: "right" });
    text(settlementCode(s.id), A4[0] - M, y - 22, { size: 9, color: C.muted, align: "right" });
    y -= 34;
    page.drawLine({ start: { x: M, y }, end: { x: A4[0] - M, y }, thickness: 1, color: C.line });
    y -= 16;
  };

  const tableHeader = () => {
    page.drawRectangle({ x: M, y: y - 5, width: W, height: 18, color: C.head });
    let x = M;
    for (const [h, w, align] of cols) {
      text(h, align === "right" ? x + w - 4 : x + 4, y, { font: bold, size: 8.5, color: C.muted, align });
      x += w;
    }
    y -= 20;
  };

  const ensure = (needed, withHeader = false) => {
    if (y - needed < M + 20) {
      newPage();
      if (withHeader) tableHeader();
    }
  };

  /* ── First page: who, what period, status ── */
  newPage();
  const left = [
    ["Statement no.", settlementCode(s.id)],
    ["Lab partner", `${s.partner_name} (${partnerCode(s.partner_id)})`],
    ["GSTIN", s.partner_gstin || "-"],
    ["Bank", [s.bank_name, s.bank_ifsc].filter(Boolean).join(" / ") || "-"],
    ["Account", s.bank_account ? maskAccount(s.bank_account).replace(/•/g, "X") : "-"],
    ["UPI", s.upi_id || "-"],
  ];
  const right = [
    ["Period", `${dayText(s.period_from)} to ${dayText(s.period_to)}`],
    ["Orders", String(s.bookings_count)],
    ["Status", SETTLEMENT_STATUS[s.status]?.label ?? s.status],
    ...(s.status === "paid"
      ? [
          ["Paid on", dayText(s.paid_on)],
          ["Paid", `${money(s.paid_amount)} by ${PAYMENT_MODE[s.mode]?.label ?? s.mode}`],
          ["Reference / UTR", s.reference || "-"],
        ]
      : []),
  ];
  const startY = y;
  for (const [k, v] of left) {
    text(k, M, y, { size: 8.5, color: C.muted });
    text(v, M + 78, y, { font: bold, size: 9, maxW: W / 2 - 86 });
    y -= 14;
  }
  const leftEnd = y;
  y = startY;
  for (const [k, v] of right) {
    text(k, M + W / 2 + 8, y, { size: 8.5, color: C.muted });
    text(v, M + W / 2 + 90, y, { font: bold, size: 9, maxW: W / 2 - 92 });
    y -= 14;
  }
  y = Math.min(y, leftEnd) - 12;

  /* ── Lines ── */
  tableHeader();
  if (!s.items.length) {
    text("No orders on this statement.", M + 4, y, { color: C.muted });
    y -= 16;
  }
  for (const item of s.items) {
    ensure(16, true);
    let x = M;
    for (const [, w, align, get] of cols) {
      text(get(item), align === "right" ? x + w - 4 : x + 4, y, { size: 8.5, maxW: w - 8, align });
      x += w;
    }
    y -= 6;
    page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 0.5, color: C.line });
    y -= 10;
  }

  /* ── Totals ── */
  const totals = [
    ...(partnerView ? [] : [["Customer price", money(s.gross_amount)]]),
    [partnerView ? "Your amount" : "Partner payable", money(s.partner_payable)],
    ...(partnerView ? [] : [["MedicoBharat margin (customer - partner)", money(s.margin)]]),
    ...(s.adjustments ? [["Adjustments", signed(s.adjustments)]] : []),
    ["Net payable", money(s.net_payable)],
    ...(s.status === "paid" ? [["Paid", money(s.paid_amount)]] : []),
  ];
  ensure(totals.length * 15 + 30);
  y -= 6;
  for (const [k, v] of totals) {
    const strong = k === "Net payable";
    text(k, A4[0] - M - 130, y, { font: strong ? bold : regular, size: strong ? 10.5 : 9, color: strong ? C.ink : C.muted, align: "right" });
    text(v, A4[0] - M, y, { font: strong ? bold : regular, size: strong ? 10.5 : 9, align: "right" });
    y -= 15;
  }

  /* ── Footer on every page ── */
  const pages = doc.getPages();
  pages.forEach((pg, i) => {
    page = pg;
    text(`Generated ${generated} IST  -  MedicoBharat  -  Page ${i + 1} of ${pages.length}`, M, M - 16, { size: 7.5, color: C.muted });
  });

  return doc.save();
}

/** A UTC DATETIME → its IST calendar day. */
function dayTextIst(v) {
  return v ? new Date(v).toLocaleDateString("en-IN", { timeZone: TZ, day: "2-digit", month: "short", year: "numeric" }) : "-";
}

/** Only characters the standard font can draw; "₹" as "Rs.". */
function clean(value, font) {
  const set = charsets.get(font) ?? new Set(font.getCharacterSet());
  charsets.set(font, set);
  let out = "";
  for (const ch of String(value ?? "").replace(/₹/g, "Rs.").replace(/\s+/g, " ")) {
    if (set.has(ch.codePointAt(0))) out += ch;
    else {
      const base = ch.normalize("NFKD").replace(/[̀-ͯ]/g, "");
      out += base && [...base].every((c) => set.has(c.codePointAt(0))) ? base : "?";
    }
  }
  return out;
}
const charsets = new Map();

/** Truncate with "..." to fit a width. */
function fit(t, font, size, maxW) {
  if (font.widthOfTextAtSize(t, size) <= maxW) return t;
  let s = t;
  while (s.length > 1 && font.widthOfTextAtSize(`${s}...`, size) > maxW) s = s.slice(0, -1);
  return `${s}...`;
}
