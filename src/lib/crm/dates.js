/**
 * Date ranges for filters and dashboards, in IST, returned as the UTC
 * "YYYY-MM-DD HH:MM:SS" strings MySQL compares DATETIME columns against.
 *
 * The database runs in UTC (pool timezone "Z") and the business runs in IST.
 * "Today" in SQL (CURDATE()) is the UTC day, which starts at 05:30 IST — so a
 * booking made at 02:00 IST would count as yesterday's. Every range here is
 * computed from IST midnights instead.
 */

const IST_OFFSET_MIN = 330;

/** YYYY-MM-DD of an instant, in IST. */
export const istDay = (instant = new Date()) =>
  new Date(instant).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

/** IST midnight of a YYYY-MM-DD, as a UTC Date. */
function istMidnight(ymd) {
  const [y, m, d] = String(ymd).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) - IST_OFFSET_MIN * 60000);
}

const sql = (date) => date.toISOString().slice(0, 19).replace("T", " ");

const addDays = (ymd, n) => {
  const [y, m, d] = String(ymd).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};

const valid = (ymd) => /^\d{4}-\d{2}-\d{2}$/.test(String(ymd ?? ""));

/**
 * A named range → { from, to, fromDay, toDay, label }.
 *   from/to      UTC datetime strings, `to` exclusive — use `col >= ? AND col < ?`
 *   fromDay/toDay the IST calendar days, inclusive (for DATE columns / display)
 *
 * Names: today, yesterday, week (this week, Mon–today), month (this month),
 * 7d, 30d, 90d, 6m, 1y, custom (needs fromDay/toDay), all.
 */
export function range(name, { from: customFrom, to: customTo } = {}) {
  const today = istDay();
  let fromDay;
  let toDay = today;
  let label;

  switch (name) {
    case "today":
      fromDay = today;
      label = "Today";
      break;
    case "yesterday":
      fromDay = toDay = addDays(today, -1);
      label = "Yesterday";
      break;
    case "week": {
      const dow = (new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7; // Mon = 0
      fromDay = addDays(today, -dow);
      label = "This week";
      break;
    }
    case "month":
      fromDay = `${today.slice(0, 7)}-01`;
      label = "This month";
      break;
    case "7d":
      fromDay = addDays(today, -6);
      label = "Last 7 days";
      break;
    case "30d":
      fromDay = addDays(today, -29);
      label = "Last 30 days";
      break;
    case "90d":
      fromDay = addDays(today, -89);
      label = "Last 90 days";
      break;
    case "6m":
      fromDay = addDays(today, -182);
      label = "Last 6 months";
      break;
    case "1y":
      fromDay = addDays(today, -364);
      label = "Last 12 months";
      break;
    case "custom":
      if (valid(customFrom) && valid(customTo)) {
        fromDay = customFrom <= customTo ? customFrom : customTo;
        toDay = customFrom <= customTo ? customTo : customFrom;
        label = `${fromDay} → ${toDay}`;
        break;
      }
      return null;
    default:
      return null; // "all" / unknown: no date filter
  }

  return {
    fromDay,
    toDay,
    from: sql(istMidnight(fromDay)),
    to: sql(istMidnight(addDays(toDay, 1))),
    label,
    days: Math.round((istMidnight(addDays(toDay, 1)) - istMidnight(fromDay)) / 86400000),
  };
}

/** The range of equal length immediately before `r` — for "vs previous period". */
export function previous(r) {
  if (!r) return null;
  const fromDay = addDays(r.fromDay, -r.days);
  const toDay = addDays(r.fromDay, -1);
  return range("custom", { from: fromDay, to: toDay });
}

/** Every IST day in a range, for zero-filling a chart's x axis. */
export function daysIn(r) {
  const out = [];
  for (let d = r.fromDay; d <= r.toDay; d = addDays(d, 1)) out.push(d);
  return out;
}

/** SQL expression: a UTC DATETIME column → its IST calendar day. */
export const istDaySql = (col) => `DATE(DATE_ADD(${col}, INTERVAL ${IST_OFFSET_MIN} MINUTE))`;

export { addDays };

/**
 * An IST calendar day (YYYY-MM-DD) → its UTC bounds for a DATETIME column:
 * { start, end } with `end` exclusive. null for anything that is not a day.
 */
export function istDayBounds(ymd) {
  if (!valid(ymd)) return null;
  return { start: sql(istMidnight(ymd)), end: sql(istMidnight(addDays(ymd, 1))) };
}
