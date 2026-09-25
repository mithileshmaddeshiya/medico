/**
 * Helpers for the activity log: the before → after diff of one row, a
 * one-line summary of a user agent, and where a row links to. Server-safe
 * (no hooks); the expand/collapse is a native <details>.
 */
import { activityLink } from "@/lib/crm/activity";

const parse = (v) => {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "object") return v;
  try {
    const out = JSON.parse(v);
    return out && typeof out === "object" ? out : null;
  } catch {
    return null;
  }
};

const show = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "(none)";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "object") return JSON.stringify(v);
  const s = String(v);
  return s.length > 160 ? `${s.slice(0, 160)}…` : s;
};

// Row-level housekeeping that says nothing to a reader.
const NOISE = new Set(["updated_at", "created_at", "seq"]);

/** [{ field, before, after }] — changed fields only when both sides exist. */
export function diffOf(row) {
  const before = parse(row.before_json);
  const after = parse(row.after_json);
  if (!before && !after) return [];
  const keys = [...new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])].filter((k) => !NOISE.has(k));
  const out = [];
  for (const k of keys) {
    const b = before?.[k];
    const a = after?.[k];
    if (before && after && JSON.stringify(b) === JSON.stringify(a)) continue;
    out.push({ field: k.replace(/_/g, " "), before: before ? show(b) : null, after: after ? show(a) : null });
  }
  return out.slice(0, 40);
}

export function ChangesTable({ changes }) {
  const hasBefore = changes.some((c) => c.before !== null);
  const hasAfter = changes.some((c) => c.after !== null);
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-inset ring-slate-200">
      <table className="w-full text-left text-[12.5px]">
        <thead className="bg-slate-50 text-[11.5px] text-slate-500">
          <tr>
            <th scope="col" className="px-3 py-2 font-semibold">Field</th>
            {hasBefore && <th scope="col" className="px-3 py-2 font-semibold">Before</th>}
            {hasAfter && <th scope="col" className="px-3 py-2 font-semibold">After</th>}
          </tr>
        </thead>
        <tbody>
          {changes.map((c) => (
            <tr key={c.field} className="border-t border-slate-100 align-top">
              <td className="whitespace-nowrap px-3 py-1.5 font-medium capitalize text-slate-600">{c.field}</td>
              {hasBefore && <td className="break-words px-3 py-1.5 text-rose-700">{c.before ?? "—"}</td>}
              {hasAfter && <td className="break-words px-3 py-1.5 text-emerald-800">{c.after ?? "—"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** "Chrome on Android", "Safari on iPhone" … from a user-agent string. */
export function deviceOf(ua) {
  if (!ua) return null;
  const s = String(ua);
  const browser = /Edg\//.test(s)
    ? "Edge"
    : /OPR\/|Opera/.test(s)
      ? "Opera"
      : /SamsungBrowser/.test(s)
        ? "Samsung Internet"
        : /Firefox\//.test(s)
          ? "Firefox"
          : /Chrome\//.test(s)
            ? "Chrome"
            : /Safari\//.test(s)
              ? "Safari"
              : /curl|node|axios|python/i.test(s)
                ? "Script"
                : "Browser";
  const os = /iPhone/.test(s)
    ? "iPhone"
    : /iPad/.test(s)
      ? "iPad"
      : /Android/.test(s)
        ? "Android"
        : /Windows/.test(s)
          ? "Windows"
          : /Mac OS X|Macintosh/.test(s)
            ? "Mac"
            : /Linux/.test(s)
              ? "Linux"
              : null;
  return os ? `${browser} on ${os}` : browser;
}

/** activityLink() plus the records this module owns. */
export function linkOf(row) {
  const shared = activityLink(row);
  if (shared) return shared;
  const id = row.entity_id;
  if (!id) return row.entity === "roles" ? "/crm/roles" : row.entity === "settings" ? "/crm/settings" : null;
  switch (row.entity) {
    case "lab_tests":
      return `/crm/tests/${encodeURIComponent(id)}`; // a package redirects to /crm/packages
    case "service_cities":
      return `/crm/cities/${id}`;
    case "service_areas":
      return "/crm/areas";
    case "roles":
      return "/crm/roles";
    case "settings":
      return "/crm/settings";
    default:
      return null;
  }
}
