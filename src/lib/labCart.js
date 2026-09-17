/**
 * Cart arithmetic, shared by the browser and the checkout API.
 *
 * Pure and client-safe. The browser uses it to draw the bill; the server runs
 * the SAME function over its own copy of the price list to decide what to
 * charge. A cart only ever carries ids and quantities — never a price — so a
 * tampered request can change what is booked but never what it costs.
 */

/** Per test. A quantity is "how many people", and a home visit has a limit. */
export const MAX_QTY = 5;

/** Distinct tests in one booking. */
export const MAX_LINES = 20;

const clampQty = (q) => Math.min(MAX_QTY, Math.max(0, Math.floor(Number(q) || 0)));

/**
 * `items` — `{ [testId]: qty }`. `tests` — the price list.
 *
 * Tests without a price ("Call for price") cannot be bought online and are
 * dropped, as is any id the list does not know.
 */
export function priceCart(items, tests) {
  const byId = new Map((tests ?? []).map((t) => [t.id, t]));

  const lines = Object.entries(items ?? {})
    .slice(0, MAX_LINES)
    .map(([id, qty]) => {
      const test = byId.get(id);
      const q = clampQty(qty);
      if (!test || !test.price || q === 0) return null;
      const mrp = test.mrp && test.mrp > test.price ? test.mrp : test.price;
      return {
        id,
        name: test.name,
        qty: q,
        price: test.price,
        mrp,
        lineTotal: test.price * q,
        lineMrp: mrp * q,
        fasting: Boolean(test.fasting),
      };
    })
    .filter(Boolean);

  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const mrpTotal = lines.reduce((sum, l) => sum + l.lineMrp, 0);

  return {
    lines,
    count: lines.reduce((sum, l) => sum + l.qty, 0),
    total,
    mrpTotal,
    savings: mrpTotal - total,
    needsFasting: lines.some((l) => l.fasting),
  };
}

/** "CBC Test ×2, Thyroid Profile" — for the lead record and WhatsApp alert. */
export const summariseLines = (lines) =>
  lines.map((l) => (l.qty > 1 ? `${l.name} ×${l.qty}` : l.name)).join(", ");
