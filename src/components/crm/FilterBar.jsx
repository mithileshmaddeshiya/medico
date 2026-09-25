"use client";

/**
 * The filter row above every list. All state lives in the URL — the page
 * reads searchParams and filters in SQL — so a filtered view can be
 * bookmarked, shared and survives a refresh, and nothing is ever filtered in
 * the browser over a partial page of rows.
 *
 *   <FilterBar
 *     search={{ placeholder: "Booking ID, name or mobile" }}
 *     filters={[
 *       { name: "status", label: "Status", options: [{ value, label }] },
 *       { name: "range", label: "Date", type: "range" },   // today…custom
 *     ]}
 *   />
 *
 * Search is debounced (350 ms) and replaces history rather than pushing it,
 * so Back leaves the list instead of undoing keystrokes. Any change resets
 * the page to 1.
 */
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";

import { cx, inputCls } from "./ui";

export const RANGE_OPTIONS = [
  { value: "", label: "Any date" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "custom", label: "Custom…" },
];

export default function FilterBar({ search, filters = [], children }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  const apply = (changes, { replace = false } = {}) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v === "" || v === null || v === undefined) next.delete(k);
      else next.set(k, v);
    }
    next.delete("page");
    const url = next.toString() ? `${pathname}?${next}` : pathname;
    startTransition(() => (replace ? router.replace(url, { scroll: false }) : router.push(url, { scroll: false })));
  };

  // Keep the box in step with Back/Forward: when the URL's q changes from
  // outside (not from typing here), adopt it — the render-time pattern React
  // recommends over an effect.
  const urlQ = params.get("q") ?? "";
  const [seenQ, setSeenQ] = useState(urlQ);
  if (urlQ !== seenQ) {
    setSeenQ(urlQ);
    if (urlQ !== q.trim()) setQ(urlQ);
  }

  const onSearch = (value) => {
    setQ(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => apply({ q: value.trim() }, { replace: true }), 350);
  };

  const active = filters.filter((f) => params.get(f.name)).length;
  const range = params.get("range") ?? "";

  const controls = filters.map((f) =>
    f.type === "range" ? (
      <div key={f.name} className="flex flex-wrap items-center gap-2">
        <select
          aria-label={f.label}
          value={range}
          onChange={(e) => apply({ range: e.target.value, ...(e.target.value !== "custom" ? { from: "", to: "" } : {}) })}
          className={cx(inputCls, "h-10 w-full py-0 sm:w-auto")}
        >
          {(f.options ?? RANGE_OPTIONS).map((o) => (
            <option key={o.value} value={o.value}>
              {o.value === "" ? f.label ?? o.label : o.label}
            </option>
          ))}
        </select>
        {range === "custom" && (
          <>
            <input
              type="date"
              aria-label="From"
              defaultValue={params.get("from") ?? ""}
              onChange={(e) => apply({ from: e.target.value })}
              className={cx(inputCls, "h-10 w-[calc(50%-0.25rem)] py-0 sm:w-auto")}
            />
            <input
              type="date"
              aria-label="To"
              defaultValue={params.get("to") ?? ""}
              onChange={(e) => apply({ to: e.target.value })}
              className={cx(inputCls, "h-10 w-[calc(50%-0.25rem)] py-0 sm:w-auto")}
            />
          </>
        )}
      </div>
    ) : (
      <select
        key={f.name}
        aria-label={f.label}
        value={params.get(f.name) ?? ""}
        onChange={(e) => apply({ [f.name]: e.target.value })}
        className={cx(inputCls, "h-10 w-full py-0 sm:w-auto sm:max-w-[13rem]")}
      >
        <option value="">{f.label}: all</option>
        {f.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )
  );

  return (
    <div className="mb-4 space-y-2.5">
      <div className="flex items-center gap-2">
        {search && (
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{search.label ?? "Search"}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={search.placeholder ?? "Search"}
              className={cx(inputCls, "h-10 py-0 pl-9 pr-9")}
              enterKeyHint="search"
            />
            {pending && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" aria-hidden />
            )}
          </label>
        )}
        {filters.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="relative inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-white px-3 text-[13px] font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters
            {active > 0 && (
              <span className="rounded-full bg-blue-600 px-1.5 text-[11px] font-bold text-white tabular-nums">{active}</span>
            )}
          </button>
        )}
        {children}
      </div>

      {filters.length > 0 && (
        <div className={cx("flex-wrap items-center gap-2 lg:flex", open ? "grid grid-cols-1 sm:flex" : "hidden")}>
          {controls}
          {(active > 0 || q) && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                apply(Object.fromEntries([...filters.map((f) => [f.name, ""]), ["q", ""], ["from", ""], ["to", ""]]));
              }}
              className="inline-flex h-10 items-center gap-1 rounded-xl px-2.5 text-[13px] font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-3.5 w-3.5" aria-hidden /> Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Show/hide table columns. Remembered per table in localStorage (a per-viewer
 * convenience; if storage is blocked every column simply shows).
 */
export function ColumnToggle({ tableId, columns }) {
  const key = `mb-crm-cols-${tableId}`;
  const [hidden, setHidden] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a per-viewer preference after mount
      setHidden(JSON.parse(localStorage.getItem(key) ?? "[]"));
    } catch {
      /* storage blocked — show everything */
    }
  }, [key]);

  const toggle = (col) => {
    const next = hidden.includes(col) ? hidden.filter((c) => c !== col) : [...hidden, col];
    setHidden(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const css = hidden.map((c) => `#${tableId} [data-col="${c}"]{display:none}`).join("");

  return (
    <div className="relative hidden md:block">
      {css && <style>{css}</style>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-3 text-[13px] font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
      >
        Columns
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1.5 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          {columns
            .filter((c) => c.hideable !== false)
            .map((c) => (
              <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50">
                <input type="checkbox" checked={!hidden.includes(c.key)} onChange={() => toggle(c.key)} className="h-4 w-4 accent-blue-600" />
                {c.label}
              </label>
            ))}
        </div>
      )}
    </div>
  );
}
