/**
 * The MedicoBharat cover page for a partner lab's report.
 *
 * The page IS the design: assets/lab-report/cover-template.jpg is drawn edge
 * to edge, and the patient and lab values are written onto its blank dotted
 * lines. Nothing about the layout is recreated in code, so the printed cover
 * cannot drift from what the designer made.
 *
 * ── RUNS IN THE BROWSER ──────────────────────────────────────────────────
 * No Node imports here, on purpose. The report is assembled on the staff
 * member's own device (see src/app/lab-report/LabReportGenerator.jsx): Vercel
 * refuses request bodies over 4.5 MB, and a scanned lab report is regularly
 * bigger than that — so uploading it to be merged would fail on exactly the
 * reports that matter. Building it in the browser also means the patient's
 * report never passes through our server at all.
 *
 * ── MOVING A FIELD ───────────────────────────────────────────────────────
 * Every position below is in pixels of the original 1055 × 1491 design and is
 * scaled to A4. A higher-resolution export of the SAME design drops in without
 * touching this file; a redesign that moves the lines needs FIELDS,
 * VERIFIED_BADGE and DISCLAIMER_AREA re-measured.
 */
import { StandardFonts, rgb } from "pdf-lib";

export const DISCLAIMER =
  "Disclaimer: MedicoBharat is a digital healthcare platform. This diagnostic test was collected " +
  "by a certified phlebotomist and processed by our authorized laboratory partner. Please see the " +
  "original attached test report on the following pages.";

const DESIGN_W = 1055;
const DESIGN_H = 1491;

// A4 in PDF points (1pt = 1/72 inch). PDF measures y from the bottom.
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const SX = PAGE_W / DESIGN_W;
const SY = PAGE_H / DESIGN_H;

/** Baselines sit just above each dotted line; a value may run up to FIELD_END_X. */
const FIELDS = {
  patientName: { x: 368, baseline: 609 },
  gender: { x: 368, baseline: 657 },
  reportDate: { x: 368, baseline: 705 },
  labName: { x: 379, baseline: 879 },
};
const FIELD_END_X = 935;

/** The "VERIFIED LAB" badge — painted over in the card's own colour for a lab that is not verified. */
const VERIFIED_BADGE = { x: 804, y: 789, w: 156, h: 41 };

/** The white band between "We are committed to your healthier tomorrow." and the wave. */
const DISCLAIMER_AREA = { centerX: 527, top: 1358, maxW: 600 };

function hex(h) {
  const n = parseInt(h.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const C = {
  navy: hex("#0B2C6B"), // the design's "Patient Details" blue
  green: hex("#045C3A"), // the design's "Testing Laboratory Partner" green
  labCard: hex("#EEFCF5"),
  muted: hex("#334155"),
};

const px = (x) => x * SX;
const py = (y) => PAGE_H - y * SY;

/* ── Text ─────────────────────────────────────────────────────────────────── */

const charsetCache = new WeakMap();

/**
 * The standard PDF fonts cover Latin-1 only. Anything else — a name typed in
 * Devanagari, an emoji pasted from WhatsApp — would make pdf-lib throw, so it
 * is swapped for its unaccented form or "?" instead. Embed a Unicode font
 * (e.g. Noto Sans Devanagari via @pdf-lib/fontkit) to print Hindi names.
 */
function sanitize(text, font) {
  let supported = charsetCache.get(font);
  if (!supported) {
    supported = new Set(font.getCharacterSet());
    charsetCache.set(font, supported);
  }
  let out = "";
  for (const ch of String(text ?? "").replace(/\s+/g, " ").trim()) {
    if (supported.has(ch.codePointAt(0))) {
      out += ch;
      continue;
    }
    const base = ch.normalize("NFKD").replace(/[̀-ͯ]/g, "");
    out += base && [...base].every((c) => supported.has(c.codePointAt(0))) ? base : "?";
  }
  return out;
}

function truncate(text, font, size, maxWidth) {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && font.widthOfTextAtSize(t + "…", size) > maxWidth) t = t.slice(0, -1);
  return t.trimEnd() + "…";
}

function wrap(text, font, size, maxWidth) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = word;
  }
  if (line) lines.push(line);
  return lines;
}

/** "2026-09-23" → "23 Sept 2026". Anything unparseable is printed as given. */
export function formatReportDate(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const dateOnly = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(dateOnly ? {} : { hour: "2-digit", minute: "2-digit", hour12: true }),
  })
    .format(d)
    .replace(/\b(am|pm)\b/, (m) => m.toUpperCase());
}

function formatGender(gender, age) {
  if (age === undefined || age === null || String(age).trim() === "") return gender;
  return `${gender}  /  ${age} Yrs`;
}

/** One value on one dotted line; a long value shrinks (down to 9pt) before it is cut. */
function drawField(page, font, value, field, color) {
  const maxWidth = px(FIELD_END_X - field.x);
  const text = sanitize(value, font);
  let size = 13;
  while (size > 9 && font.widthOfTextAtSize(text, size) > maxWidth) size -= 0.5;
  page.drawText(truncate(text, font, size, maxWidth), {
    x: px(field.x),
    y: py(field.baseline),
    size,
    font,
    color,
  });
}

/* ── The page ─────────────────────────────────────────────────────────────── */

/**
 * Append the cover page to `doc`.
 *
 * @param {import("pdf-lib").PDFDocument} doc
 * @param {{ patient: { name: string, gender: string, age?: number|string, reportDate: string },
 *           lab: { name: string, verified: boolean } }} data
 * @param {Uint8Array | ArrayBuffer} templateJpg  the bytes of cover-template.jpg
 */
export async function drawCoverPage(doc, { patient, lab }, templateJpg) {
  const [template, bold, regular] = await Promise.all([
    doc.embedJpg(templateJpg),
    doc.embedFont(StandardFonts.HelveticaBold),
    doc.embedFont(StandardFonts.Helvetica),
  ]);

  const page = doc.addPage([PAGE_W, PAGE_H]);
  page.drawImage(template, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });

  drawField(page, bold, patient.name, FIELDS.patientName, C.navy);
  drawField(page, bold, formatGender(patient.gender, patient.age), FIELDS.gender, C.navy);
  drawField(page, bold, formatReportDate(patient.reportDate), FIELDS.reportDate, C.navy);
  drawField(page, bold, lab.name, FIELDS.labName, C.green);

  if (!lab.verified) {
    const b = VERIFIED_BADGE;
    page.drawRectangle({ x: px(b.x), y: py(b.y + b.h), width: px(b.w), height: b.h * SY, color: C.labCard });
  }

  // The disclaimer: small, centred, under "Thank You" and above the wave.
  const size = 7;
  const lineH = 9.2;
  const lines = wrap(sanitize(DISCLAIMER, regular), regular, size, px(DISCLAIMER_AREA.maxW));
  const centerX = px(DISCLAIMER_AREA.centerX);
  const top = py(DISCLAIMER_AREA.top);
  lines.forEach((line, i) => {
    page.drawText(line, {
      x: centerX - regular.widthOfTextAtSize(line, size) / 2,
      y: top - 7 - i * lineH,
      size,
      font: regular,
      color: C.muted,
    });
  });

  return page;
}
