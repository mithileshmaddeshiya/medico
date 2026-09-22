/**
 * The panel's shared pieces. Server components unless a file says otherwise.
 *
 * Written once here rather than per screen so that a status pill means the
 * same thing on the leads list as it does on an order, and so a table on one
 * page cannot drift into looking like a different product from the table on
 * the next. Nothing in this file knows what a lead or a test is — it takes
 * strings and children.
 *
 * The visual language is the site's own: emerald as the single accent, slate
 * for text, white cards on a light background, generous line height. A back
 * office that looks like a different application from the site it manages is
 * one people misread.
 */
import Link from "next/link";

/* ── Page furniture ───────────────────────────────────────────────────────── */

export function PageHeader({ title, subtitle, children }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
      <div className="min-w-0">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-slate-600">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
    </header>
  );
}

export function Card({ title, subtitle, children, footer, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
    >
      {(title || subtitle) && (
        <div className="border-b border-slate-100 px-5 py-4">
          {title && <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>}
          {subtitle && <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500">{subtitle}</p>}
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
      {footer && <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3">{footer}</div>}
    </section>
  );
}

/**
 * An empty list. Always says what to do next rather than just "no results" —
 * an empty screen with no exit is where people get stuck.
 */
export function Empty({ title, hint, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-12 text-center">
      <p className="text-[15px] font-semibold text-slate-700">{title}</p>
      {hint && <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-slate-500">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ── Status ───────────────────────────────────────────────────────────────── */

const TONES = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
  rose: "bg-rose-50 text-rose-700 ring-rose-600/20",
  sky: "bg-sky-50 text-sky-700 ring-sky-600/20",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
  slate: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export function Pill({ tone = "slate", children, title }) {
  return (
    <span
      title={title}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11.5px] font-semibold ring-1 ring-inset ${
        TONES[tone] ?? TONES.slate
      }`}
    >
      {children}
    </span>
  );
}

/**
 * The tone every status in the panel is drawn with, in one map.
 *
 * `deleted` and `archived` are deliberately the quietest colour on the page.
 * They are not errors — they are the normal resting state of a record that is
 * no longer in use, and colouring them red would teach people to panic at the
 * thing the panel does most safely.
 */
export const statusTone = (status) =>
  ({
    active: "emerald",
    published: "emerald",
    paid: "emerald",
    done: "emerald",
    draft: "amber",
    new: "amber",
    created: "amber",
    hidden: "slate",
    archived: "slate",
    deleted: "slate",
    cancelled: "slate",
    lost: "slate",
    disabled: "slate",
    failed: "rose",
    contacted: "sky",
    pending_collection: "sky",
    booked: "indigo",
    collected: "violet",
    refunded: "violet",
  })[status] ?? "slate";

export const StatusPill = ({ status }) => (
  <Pill tone={statusTone(status)}>{String(status ?? "").replace(/_/g, " ")}</Pill>
);

/* ── Numbers ──────────────────────────────────────────────────────────────── */

/** ₹ in Indian digit grouping — 1,23,456, not 123,456. */
export const rupees = (value) =>
  value === null || value === undefined
    ? "—"
    : `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

/**
 * A date, fixed to en-IN so the server and the browser render the same string.
 * A locale-dependent format is a hydration mismatch waiting to happen.
 */
export function when(value, { time = false } = {}) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function Stat({ label, value, sub, tone = "slate", href }) {
  const body = (
    <>
      <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p
        className={`mt-1.5 text-2xl font-extrabold tracking-tight ${
          tone === "emerald" ? "text-emerald-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{sub}</p>}
    </>
  );

  const className =
    "block rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";

  return href ? (
    <Link href={href} className={`${className} transition hover:border-emerald-300 hover:shadow-md`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

/* ── Tables ───────────────────────────────────────────────────────────────── */

/**
 * A table that scrolls inside its own wrapper rather than making the page
 * scroll sideways — the same rule the public site's article tables follow.
 * `tabIndex` because a scrolling region has to be reachable by keyboard.
 */
export function Table({ head, children, empty }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto" tabIndex={0}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/80">
              {head.map((cell, i) => (
                <th
                  key={i}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-[11.5px] font-bold uppercase tracking-wide text-slate-500"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {empty}
    </div>
  );
}

export const Row = ({ children, muted = false }) => (
  <tr className={`border-t border-slate-100 align-middle ${muted ? "opacity-55" : ""}`}>
    {children}
  </tr>
);

export const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-[13px] text-slate-700 ${className}`}>{children}</td>
);

/* ── Buttons and links ────────────────────────────────────────────────────── */

const BUTTON = {
  primary:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600 shadow-sm",
  secondary:
    "bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-slate-400",
  // Not red. See the note on statusTone: deleting here is reversible, and a
  // destructive-red button trains people to treat it as if it were not.
  quiet: "bg-slate-100 text-slate-600 hover:bg-slate-200 focus-visible:outline-slate-400",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600",
};

export function Button({ variant = "primary", className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({ variant = "secondary", className = "", ...props }) {
  return (
    <Link
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${BUTTON[variant]} ${className}`}
      {...props}
    />
  );
}

/* ── Forms ────────────────────────────────────────────────────────────────── */

export function Field({ label, hint, error, children, required = false }) {
  return (
    <label className="block">
      <span className="flex items-baseline gap-1.5 text-[12.5px] font-semibold text-slate-700">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </span>
      {hint && <span className="mt-0.5 block text-[12px] leading-relaxed text-slate-500">{hint}</span>}
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-[12px] font-medium text-rose-600">{error}</span>}
    </label>
  );
}

export const inputClass =
  "block w-full rounded-lg border-0 bg-white px-3 py-2 text-[13.5px] text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600";

export const Input = ({ className = "", ...props }) => (
  <input className={`${inputClass} ${className}`} {...props} />
);

export const Textarea = ({ className = "", ...props }) => (
  <textarea className={`${inputClass} leading-relaxed ${className}`} {...props} />
);

export const Select = ({ className = "", ...props }) => (
  <select className={`${inputClass} ${className}`} {...props} />
);

export function Checkbox({ label, hint, ...props }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
        {...props}
      />
      <span className="min-w-0">
        <span className="block text-[13px] font-medium text-slate-800">{label}</span>
        {hint && <span className="mt-0.5 block text-[12px] leading-relaxed text-slate-500">{hint}</span>}
      </span>
    </label>
  );
}

/**
 * A short explanation set into a screen — used where the panel needs to say
 * WHY a rule exists, not just enforce it. Every one of these on a form is
 * there because the alternative was somebody learning the rule by breaking
 * something on the live site.
 */
export function Note({ tone = "info", title, children }) {
  const warn = tone === "warn";
  return (
    <aside
      className={`rounded-xl border p-3.5 ${
        warn ? "border-amber-200 bg-amber-50/70" : "border-emerald-200 bg-emerald-50/60"
      }`}
    >
      {title && (
        <p className={`text-[12.5px] font-bold ${warn ? "text-amber-900" : "text-emerald-900"}`}>
          {title}
        </p>
      )}
      <div className="mt-1 text-[12.5px] leading-relaxed text-slate-700">{children}</div>
    </aside>
  );
}

/* ── Filters ──────────────────────────────────────────────────────────────── */

/** The status tabs above a list. `counts` keys match `tabs[].key`. */
export function Tabs({ tabs, active, basePath, counts = {} }) {
  return (
    <nav className="flex flex-wrap gap-1.5" aria-label="Filter by status">
      {tabs.map((tab) => {
        const on = (active ?? "") === (tab.key ?? "");
        const href = tab.key ? `${basePath}?status=${tab.key}` : basePath;
        return (
          <Link
            key={tab.key ?? "all"}
            href={href}
            aria-current={on ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition ${
              on
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
            {counts[tab.key] !== undefined && (
              <span className={`ml-1.5 ${on ? "text-emerald-100" : "text-slate-400"}`}>
                {counts[tab.key]}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
