/**
 * The CRM's shared building blocks. Server-safe (no hooks, no "use client"),
 * so any page can render them; the interactive pieces live beside this file.
 *
 * ── THE VISUAL LANGUAGE ──────────────────────────────────────────────────
 * One blue accent (Tailwind blue-600) on white cards over a cool off-white
 * workspace; slate for text; status colours only where they mean a state.
 * Depth is a hairline border and one soft shadow — nothing animates a shadow
 * or blurs a backdrop, because the screens that matter most are long lists
 * scrolled all day on modest phones.
 *
 * Every export takes strings and children; nothing here knows what a booking
 * is. Status → colour lives in src/lib/crm/constants.js.
 */
import Link from "next/link";

import {
  BOOKING_STATUS,
  COLLECTION_STATUS,
  PARTNER_STATUS,
  PAYMENT_MODE,
  PAYMENT_STATUS,
  REPORT_STATUS,
  SOURCE,
  isOnlineSource,
} from "@/lib/crm/constants";
import { change } from "@/lib/crm/format";

export const SURFACE =
  "rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]";

export const cx = (...parts) => parts.filter(Boolean).join(" ");

/* ── Page furniture ───────────────────────────────────────────────────── */

/**
 * Every page opens with this: title, one-line description, the primary action
 * on the right (it wraps under the title on a phone), optional back link.
 */
export function PageHeader({ title, description, actions, back, eyebrow }) {
  return (
    <header className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link
            href={back.href}
            className="mb-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-slate-500 hover:text-blue-700"
          >
            <span aria-hidden>←</span> {back.label}
          </Link>
        )}
        {eyebrow && (
          <p className="mb-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-blue-700">{eyebrow}</p>
        )}
        <h1 className="text-[21px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[24px]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Card({ title, description, actions, children, footer, className = "", bodyClassName = "", id }) {
  return (
    <section id={id} className={cx(SURFACE, "overflow-hidden", className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            {title && <h2 className="text-[14.5px] font-semibold tracking-tight text-slate-900">{title}</h2>}
            {description && <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cx("px-4 py-4 sm:px-5", bodyClassName)}>{children}</div>
      {footer && <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">{footer}</div>}
    </section>
  );
}

/** A labelled grid of facts: [{ label, value, wide? }]. */
export function Facts({ items, cols = 2 }) {
  return (
    <dl className={cx("grid gap-x-6 gap-y-3.5", cols === 3 ? "sm:grid-cols-3" : cols === 1 ? "" : "sm:grid-cols-2")}>
      {items
        .filter((i) => i && i.value !== undefined)
        .map((item) => (
          <div key={item.label} className={item.wide ? "sm:col-span-full" : ""}>
            <dt className="text-[11.5px] font-medium text-slate-500">{item.label}</dt>
            <dd className="mt-0.5 break-words text-[13.5px] font-medium text-slate-900">
              {item.value === "" || item.value === null ? <span className="text-slate-400">—</span> : item.value}
            </dd>
          </div>
        ))}
    </dl>
  );
}

/* ── Badges ───────────────────────────────────────────────────────────── */

const TONES = {
  blue: "bg-blue-50 text-blue-700 ring-blue-600/15",
  sky: "bg-sky-50 text-sky-700 ring-sky-600/15",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-600/15",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/15",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
  orange: "bg-orange-50 text-orange-700 ring-orange-600/15",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  teal: "bg-teal-50 text-teal-700 ring-teal-600/15",
  rose: "bg-rose-50 text-rose-700 ring-rose-600/15",
  slate: "bg-slate-100 text-slate-600 ring-slate-500/15",
};
const DOTS = {
  blue: "bg-blue-500",
  sky: "bg-sky-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  orange: "bg-orange-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  rose: "bg-rose-500",
  slate: "bg-slate-400",
};

/** A status pill: always a dot + a word, so the state never rests on colour alone. */
export function Badge({ tone = "slate", children, dot = true, className = "", title }) {
  return (
    <span
      title={title}
      className={cx(
        "inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-semibold ring-1 ring-inset",
        TONES[tone] ?? TONES.slate,
        className
      )}
    >
      {dot && <span aria-hidden className={cx("h-1.5 w-1.5 shrink-0 rounded-full", DOTS[tone] ?? DOTS.slate)} />}
      <span className="truncate">{children}</span>
    </span>
  );
}

const fromMap = (map, key, fallback) => {
  const s = map[key];
  return s ? <Badge tone={s.tone}>{s.label}</Badge> : fallback ? <Badge>{fallback}</Badge> : null;
};

export const BookingStatusBadge = ({ status }) => fromMap(BOOKING_STATUS, status, status);
export const CollectionBadge = ({ status }) => fromMap(COLLECTION_STATUS, status, status);
export const PartnerStatusBadge = ({ status }) => fromMap(PARTNER_STATUS, status, status);
export const ReportStatusBadge = ({ status }) => fromMap(REPORT_STATUS, status, status);
export const PaymentStatusBadge = ({ status }) => fromMap(PAYMENT_STATUS, status, status);
export const PaymentModeBadge = ({ mode }) =>
  mode ? <Badge tone={PAYMENT_MODE[mode]?.tone ?? "slate"} dot={false}>{PAYMENT_MODE[mode]?.label ?? mode}</Badge> : null;

/** ONLINE / PHONE / WHATSAPP …, uppercase, no dot — a source is a label, not a state. */
export function SourceBadge({ source }) {
  const s = SOURCE[source] ?? SOURCE.other;
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.06em] ring-1 ring-inset",
        TONES[s.tone] ?? TONES.slate
      )}
      title={isOnlineSource(source) ? "Booked on the website" : "Booked offline"}
    >
      {s.label}
    </span>
  );
}

/* ── Numbers ──────────────────────────────────────────────────────────── */

/**
 * A KPI tile. `delta` is computed from current/previous; `upIsGood` decides
 * whether a rise is green or red (pending payments rising is bad news).
 * `spark` is an array of numbers, drawn as a tiny line in the de-emphasis hue
 * with the latest point in the accent.
 */
export function KpiCard({ label, value, sub, current, previous, upIsGood = true, compareLabel = "vs previous", href, icon, spark, tone = "blue" }) {
  const delta = current === undefined ? undefined : change(current, previous);
  const up = delta > 0;
  const good = delta === 0 || delta === null || delta === undefined ? null : up === upIsGood;

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12.5px] font-medium leading-snug text-slate-500">{label}</p>
        {icon && (
          <span className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", ICON_TONES[tone] ?? ICON_TONES.blue)}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-[24px] font-semibold leading-none tracking-tight text-slate-900 sm:text-[26px]">
        {value}
      </p>
      <div className="mt-2.5 flex items-end justify-between gap-2">
        <div className="min-w-0 text-[11.5px] leading-snug">
          {delta !== undefined && (
            <p className="flex flex-wrap items-center gap-x-1.5">
              {delta === null ? (
                <span className="font-semibold text-blue-700">New</span>
              ) : (
                <span
                  className={cx(
                    "inline-flex items-center gap-0.5 font-semibold",
                    good === null ? "text-slate-500" : good ? "text-emerald-700" : "text-rose-700"
                  )}
                >
                  <span aria-hidden>{delta > 0 ? "▲" : delta < 0 ? "▼" : "•"}</span>
                  {Math.abs(delta).toFixed(delta !== 0 && Math.abs(delta) < 10 ? 1 : 0)}%
                </span>
              )}
              <span className="text-slate-400">{compareLabel}</span>
            </p>
          )}
          {sub && <p className="mt-0.5 truncate text-slate-500">{sub}</p>}
        </div>
        {spark && spark.length > 1 && <Sparkline values={spark} />}
      </div>
    </>
  );

  const cls = cx(SURFACE, "relative block p-4");
  return href ? (
    <Link href={href} className={cx(cls, "transition-colors hover:border-blue-300 focus-visible:outline-2 focus-visible:outline-blue-600")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

const ICON_TONES = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
  rose: "bg-rose-50 text-rose-600",
  teal: "bg-teal-50 text-teal-600",
  sky: "bg-sky-50 text-sky-600",
  indigo: "bg-indigo-50 text-indigo-600",
  slate: "bg-slate-100 text-slate-600",
};

/** 64×24 trend line; the last point is the accent dot. Decorative — the tile's number carries the value. */
export function Sparkline({ values, width = 64, height = 24 }) {
  const nums = values.map((v) => Number(v) || 0);
  const max = Math.max(...nums, 1);
  const min = Math.min(...nums, 0);
  const span = max - min || 1;
  const step = width / (nums.length - 1);
  const pts = nums.map((v, i) => [i * step, height - 3 - ((v - min) / span) * (height - 6)]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`-3 0 ${width + 6} ${height}`} aria-hidden className="shrink-0 overflow-visible">
      <path d={d} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r="3" fill="#2a78d6" stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

/* ── Buttons ──────────────────────────────────────────────────────────── */

const BTN = {
  primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-blue-600",
  secondary:
    "bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-slate-400",
  ghost: "text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:outline-slate-400",
  success: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 focus-visible:outline-emerald-600",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800 focus-visible:outline-rose-600",
  soft: "bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200 focus-visible:outline-blue-600",
};
const SIZES = {
  sm: "h-8 px-2.5 text-[12.5px] gap-1.5 rounded-lg",
  md: "h-10 px-3.5 text-[13.5px] gap-2 rounded-xl",
  lg: "h-12 px-5 text-[14.5px] gap-2 rounded-xl",
};

/** Class string for anything button-shaped (a <button>, a <Link>, an <a href="tel:">). */
export const btn = (variant = "primary", size = "md", extra = "") =>
  cx(
    "inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-55",
    BTN[variant] ?? BTN.primary,
    SIZES[size] ?? SIZES.md,
    extra
  );

export const Button = ({ variant = "primary", size = "md", className = "", type = "button", ...props }) => (
  <button type={type} className={btn(variant, size, className)} {...props} />
);

export const ButtonLink = ({ variant = "secondary", size = "md", className = "", ...props }) => (
  <Link className={btn(variant, size, className)} {...props} />
);

/* ── Forms ────────────────────────────────────────────────────────────── */

export const inputCls =
  "block w-full rounded-xl border-0 bg-white px-3 py-2.5 text-[14px] text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-500";

export function Field({ label, hint, children, required = false, className = "", htmlFor }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-1 text-[12.5px] font-semibold text-slate-700">
          {label}
          {required && <span className="text-rose-600" aria-hidden>*</span>}
        </label>
      )}
      {children}
      {hint && <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">{hint}</p>}
    </div>
  );
}

export const Input = ({ className = "", ...props }) => <input className={cx(inputCls, className)} {...props} />;
export const Textarea = ({ className = "", rows = 3, ...props }) => (
  <textarea rows={rows} className={cx(inputCls, "leading-relaxed", className)} {...props} />
);
export const Select = ({ className = "", children, ...props }) => (
  <select className={cx(inputCls, "pr-8", className)} {...props}>
    {children}
  </select>
);

/* ── States ───────────────────────────────────────────────────────────── */

/** Icon + one line + why + what to do. An empty list always offers the next step. */
export function EmptyState({ icon, title, hint, action, compact = false }) {
  return (
    <div className={cx("flex flex-col items-center text-center", compact ? "px-4 py-8" : "px-6 py-14")}>
      {icon && (
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">{icon}</span>
      )}
      <p className="text-[14.5px] font-semibold text-slate-800">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-slate-500">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export const Skeleton = ({ className = "" }) => (
  <span aria-hidden className={cx("block animate-pulse rounded-lg bg-slate-200/70", className)} />
);

/** A page-shaped skeleton for loading.js files. */
export function PageSkeleton({ kpis = 0, rows = 6 }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="mb-2 h-7 w-48" />
      <Skeleton className="mb-6 h-4 w-72" />
      {kpis > 0 && (
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: kpis }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      )}
      <div className={cx(SURFACE, "space-y-3 p-4")}>
        <Skeleton className="h-9 w-full" />
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

export function Notice({ tone = "blue", title, children, icon }) {
  const tones = {
    blue: "bg-blue-50 text-blue-900 ring-blue-600/15",
    amber: "bg-amber-50 text-amber-900 ring-amber-600/20",
    rose: "bg-rose-50 text-rose-900 ring-rose-600/15",
    emerald: "bg-emerald-50 text-emerald-900 ring-emerald-600/15",
    slate: "bg-slate-50 text-slate-700 ring-slate-500/15",
  };
  return (
    <div role="status" className={cx("flex gap-2.5 rounded-xl px-3.5 py-3 text-[13px] leading-relaxed ring-1 ring-inset", tones[tone])}>
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? "mt-0.5 opacity-90" : ""}>{children}</div>}
      </div>
    </div>
  );
}

/* ── Navigation within a page ─────────────────────────────────────────── */

/** Link tabs: [{ key, label, href, count? }]. Scrolls sideways on a phone. */
export function Tabs({ tabs, active }) {
  return (
    <nav className="-mx-4 mb-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" aria-label="Sections">
      <ul className="flex min-w-max gap-1 border-b border-slate-200">
        {tabs.map((t) => {
          const on = t.key === active;
          return (
            <li key={t.key}>
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={cx(
                  "-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors",
                  on ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                {t.label}
                {t.count !== undefined && t.count !== null && (
                  <span
                    className={cx(
                      "rounded-full px-1.5 py-px text-[11px] tabular-nums",
                      on ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Previous / next with "Showing 26–50 of 1,204". `hrefFor(page)` builds the
 * link (so the current filters are kept).
 */
export function Pagination({ total, limit, offset, hrefFor }) {
  if (total <= limit) {
    return total ? (
      <p className="px-1 pt-3 text-[12px] text-slate-500">
        {total.toLocaleString("en-IN")} {total === 1 ? "record" : "records"}
      </p>
    ) : null;
  }
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.ceil(total / limit);
  const from = offset + 1;
  const to = Math.min(total, offset + limit);
  return (
    <nav className="flex items-center justify-between gap-3 px-1 pt-3" aria-label="Pages">
      <p className="text-[12px] text-slate-500 tabular-nums">
        {from.toLocaleString("en-IN")}–{to.toLocaleString("en-IN")} of {total.toLocaleString("en-IN")}
      </p>
      <div className="flex items-center gap-1.5">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className={btn("secondary", "sm")} rel="prev">
            ← Prev
          </Link>
        ) : (
          <span className={btn("secondary", "sm", "pointer-events-none opacity-45")}>← Prev</span>
        )}
        <span className="px-1 text-[12px] font-medium text-slate-600 tabular-nums">
          {page} / {pages}
        </span>
        {page < pages ? (
          <Link href={hrefFor(page + 1)} className={btn("secondary", "sm")} rel="next">
            Next →
          </Link>
        ) : (
          <span className={btn("secondary", "sm", "pointer-events-none opacity-45")}>Next →</span>
        )}
      </div>
    </nav>
  );
}

/**
 * Build a URL from the current search params with some replaced. `null` or ""
 * removes a key. Server-safe: pages pass their awaited searchParams in.
 */
export function withParams(path, current, changes = {}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(current ?? {})) {
    if (v === undefined || v === null || v === "") continue;
    for (const one of [].concat(v)) params.append(k, one);
  }
  for (const [k, v] of Object.entries(changes)) {
    params.delete(k);
    if (v !== undefined && v !== null && v !== "") params.set(k, v);
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

/* ── Records ──────────────────────────────────────────────────────────── */

export function Avatar({ name, size = "md", tone = "blue" }) {
  const letters =
    String(name ?? "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join("") || "?";
  const sizes = { sm: "h-7 w-7 text-[11px]", md: "h-9 w-9 text-[12.5px]", lg: "h-12 w-12 text-[15px]" };
  return (
    <span
      aria-hidden
      className={cx("flex shrink-0 items-center justify-center rounded-full font-semibold", sizes[size], ICON_TONES[tone] ?? ICON_TONES.blue)}
    >
      {letters}
    </span>
  );
}

/**
 * The booking pipeline as a stepper. `steps` = [{ key, label }], `current`
 * = the key reached. Horizontal and scrollable on a phone.
 */
export function Stepper({ steps, current, cancelled = false }) {
  const at = steps.findIndex((s) => s.key === current);
  return (
    <ol className="-mx-1 flex items-start overflow-x-auto px-1 pb-1">
      {steps.map((s, i) => {
        const done = !cancelled && i <= at;
        const now = !cancelled && i === at;
        return (
          <li key={s.key} className="flex min-w-[76px] flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span className={cx("h-0.5 flex-1", i === 0 ? "opacity-0" : done ? "bg-blue-500" : "bg-slate-200")} />
              <span
                className={cx(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ring-2 ring-white",
                  now ? "bg-blue-600 text-white" : done ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400"
                )}
              >
                {done && !now ? "✓" : i + 1}
              </span>
              <span className={cx("h-0.5 flex-1", i === steps.length - 1 ? "opacity-0" : !cancelled && i < at ? "bg-blue-500" : "bg-slate-200")} />
            </div>
            <span className={cx("mt-1.5 px-1 text-[11px] leading-tight", now ? "font-semibold text-slate-900" : "text-slate-500")}>
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** A vertical timeline: [{ id, title, meta, body?, href?, tone? }]. */
export function Timeline({ items, empty }) {
  if (!items.length) return empty ?? null;
  return (
    <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-slate-200">
      {items.map((item) => (
        <li key={item.id} className="relative pl-6">
          <span
            aria-hidden
            className={cx("absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-[3px] border-white", DOTS[item.tone] ?? DOTS.blue)}
          />
          <div className="text-[13px] leading-snug text-slate-800">
            {item.href ? (
              <Link href={item.href} className="font-medium hover:text-blue-700">
                {item.title}
              </Link>
            ) : (
              <span className="font-medium">{item.title}</span>
            )}
          </div>
          {item.body && <div className="mt-0.5 text-[12.5px] text-slate-600">{item.body}</div>}
          {item.meta && <div className="mt-0.5 text-[11.5px] text-slate-400">{item.meta}</div>}
        </li>
      ))}
    </ol>
  );
}

/* ── Tables that become cards on a phone ──────────────────────────────── */

/**
 * A server-rendered data table.
 *
 *   columns  [{ key, label, className?, sortKey?, hideable?, align? }]
 *   rows     the records
 *   cells    (row) => ({ [key]: node })          desktop cells
 *   card     (row) => node                        the phone card
 *   rowHref  (row) => string                      makes the row a link target
 *   sort     { current, hrefFor(sortKey) }        server-side sorting links
 *   select   { form: "bulk-form-id" }             adds checkboxes named "ids"
 *                                                 that submit with that form
 *   empty    node for no rows
 *
 * Desktop (md+) shows the table with a sticky header, scrolling sideways
 * inside its own box when it must; below md each row is a card. Column
 * visibility is handled by <ColumnToggle> (client) through data-col.
 */
export function DataTable({ id, columns, rows, cells, card, rowKey = (r) => r.id, sort, select, empty, rowHref, footer }) {
  if (!rows.length) return <div className={SURFACE}>{empty}</div>;

  return (
    <div id={id} data-table>
      {/* Phone: cards */}
      <ul className="space-y-2.5 md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className={cx(SURFACE, "p-3.5")}>
            {card(row)}
          </li>
        ))}
      </ul>

      {/* Tablet and up: the table */}
      <div className={cx(SURFACE, "hidden overflow-hidden md:block")}>
        <div className="max-h-[70vh] overflow-auto" tabIndex={0} role="region" aria-label="Records">
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                {select && (
                  <th scope="col" className="sticky top-0 z-10 w-10 border-b border-slate-200 bg-slate-50 px-3 py-2.5">
                    <span className="sr-only">Select</span>
                  </th>
                )}
                {columns.map((c) => {
                  const sorted = sort && c.sortKey && sort.current === c.sortKey;
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      data-col={c.key}
                      className={cx(
                        "sticky top-0 z-10 whitespace-nowrap border-b border-slate-200 bg-slate-50 px-3 py-2.5 text-[11.5px] font-semibold text-slate-500",
                        c.align === "right" && "text-right",
                        c.className
                      )}
                    >
                      {sort && c.sortKey ? (
                        <Link href={sort.hrefFor(c.sortKey)} className={cx("inline-flex items-center gap-1 hover:text-slate-900", sorted && "text-slate-900")}>
                          {c.label}
                          <span aria-hidden className={sorted ? "text-blue-600" : "text-slate-300"}>
                            ↓
                          </span>
                        </Link>
                      ) : (
                        c.label
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const c = cells(row);
                return (
                  <tr key={rowKey(row)} className="group">
                    {select && (
                      <td className="border-b border-slate-100 px-3 py-2.5 group-hover:bg-slate-50/70">
                        <input
                          type="checkbox"
                          name="ids"
                          value={rowKey(row)}
                          form={select.form}
                          aria-label="Select row"
                          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600"
                        />
                      </td>
                    )}
                    {columns.map((col, i) => (
                      <td
                        key={col.key}
                        data-col={col.key}
                        className={cx(
                          "border-b border-slate-100 px-3 py-2.5 align-middle text-[13px] text-slate-700 group-hover:bg-slate-50/70",
                          col.align === "right" && "text-right tabular-nums",
                          col.className
                        )}
                      >
                        {i === 0 && rowHref ? (
                          <Link href={rowHref(row)} className="font-semibold text-slate-900 hover:text-blue-700">
                            {c[col.key]}
                          </Link>
                        ) : (
                          c[col.key]
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {footer}
    </div>
  );
}
