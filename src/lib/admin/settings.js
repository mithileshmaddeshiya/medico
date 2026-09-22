/**
 * Small site settings, as key/value rows. Server only.
 *
 * ── WHAT BELONGS HERE ────────────────────────────────────────────────────
 * Things that change occasionally, are a single value, and are safe to get
 * wrong for an hour: whether each popup is switched on.
 *
 * ── WHAT DOES NOT ────────────────────────────────────────────────────────
 * The phone number, above all. It is written once in src/lib/site.js and every
 * other representation is DERIVED from it — the footer, the schema, the
 * tel: links, the WhatsApp handoff. That file explains why at length: local
 * ranking is built on the same name, address and phone appearing identically
 * across the site, its structured data and its Business Profile, and the site
 * has already been through the failure where two different numbers were
 * published on one domain. A settings row that could disagree with the
 * constant would put that back, one text box at a time.
 *
 * So the phone is shown here read-only, with a pointer to the one file that
 * owns it. The same goes for the brand name and the site URL.
 */
import { dbConfigured, query } from "@/lib/db";

import { audit } from "./audit";

/**
 * Everything the panel may set, with its default and an explanation.
 *
 * Only switches the site actually reads belong here. Three were drafted and
 * deliberately left out, because a setting that saves and does nothing is
 * worse than no setting:
 *   · footer hours — they feed the local-business markup, which is a public
 *     claim and is kept in code with the rest of the NAP data;
 *   · a note on the WhatsApp alert — the alert is a Meta-approved template
 *     with fixed fields, and free text appended to it breaks delivery;
 *   · switching the cart off — that is a dozen client components, not a flag.
 */
export const SETTINGS = [
  {
    key: "welcome_popup_enabled",
    label: "Welcome popup",
    type: "boolean",
    fallback: "1",
    hint: "The booking form that opens shortly after a visitor arrives, on the home page and every city page.",
  },
  {
    key: "offer_popup_enabled",
    label: "Offer popup",
    type: "boolean",
    fallback: "1",
    hint: "The offer artwork that opens once a reader has scrolled past the FAQ, on the home page and every city page.",
  },
];

const memo = { at: 0, values: null };

/** Every setting, defaults filled in. Memoised for a minute. */
export async function getSettings() {
  const defaults = Object.fromEntries(SETTINGS.map((item) => [item.key, item.fallback]));
  if (!dbConfigured()) return defaults;

  if (memo.values && Date.now() - memo.at < 60_000) return memo.values;

  try {
    const [rows] = await query("SELECT `key`, value FROM settings");
    const values = { ...defaults };
    for (const row of rows) {
      if (Object.hasOwn(values, row.key)) values[row.key] = row.value;
    }
    memo.at = Date.now();
    memo.values = values;
    return values;
  } catch (err) {
    console.error("[settings] could not be read; using defaults", err);
    return defaults;
  }
}

/** One setting as a boolean. */
export const settingOn = async (key) => {
  const values = await getSettings();
  return values[key] === "1" || values[key] === "true";
};

export async function saveSettings(input, { user } = {}) {
  const before = await getSettings();

  for (const item of SETTINGS) {
    const raw = input[item.key];
    const value = item.type === "boolean" ? (raw ? "1" : "0") : String(raw ?? "").slice(0, 2000);

    await query(
      "INSERT INTO settings (`key`, value, updated_by) VALUES (?, ?, ?) " +
        "ON DUPLICATE KEY UPDATE value = VALUES(value), updated_by = VALUES(updated_by)",
      [item.key, value, user?.id ?? null]
    );
  }

  memo.values = null; // the next read must see the new values

  await audit({
    user,
    action: "update",
    entity: "settings",
    summary: "site settings changed",
    before,
    after: input,
  });

  return { ok: true };
}

/** The two popup switches, for the pages that mount the popups. Never throws. */
export async function popupSettings() {
  const values = await getSettings();
  return {
    welcome: values.welcome_popup_enabled !== "0",
    offer: values.offer_popup_enabled !== "0",
  };
}
