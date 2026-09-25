"use client";

/**
 * Global search — Ctrl/⌘ K on a desktop, the search button in the top bar
 * everywhere. Searches bookings, customers, leads, partners, tests and
 * payments on the server (/api/crm/search, already scoped to what this user
 * may see), plus the CRM's own pages by name.
 *
 * Debounced 200 ms; an in-flight request is aborted when the query changes,
 * so a slow answer to "98" can never overwrite the answer to "9876".
 * ↑ ↓ to move, Enter to open, Esc to close.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Loader2, Search } from "lucide-react";

import { cx } from "./ui";

const GROUP_LABEL = {
  pages: "Go to",
  bookings: "Bookings",
  customers: "Customers",
  leads: "Leads",
  partners: "Lab partners",
  tests: "Tests & packages",
  payments: "Payments",
};

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(0);
  const input = useRef(null);
  const ctrl = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setResults({});
    setCursor(0);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("crm:search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("crm:search", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 10);
  }, [open]);

  // Pages from the navigation the server rendered for this user.
  const pages = useMemo(() => {
    if (!open) return [];
    try {
      const raw = document.getElementById("crm-nav-links")?.dataset.links ?? "[]";
      return JSON.parse(raw).map(([label, href]) => ({ id: href, title: label, href, sub: href }));
    } catch {
      return [];
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    ctrl.current?.abort();
    if (term.length < 2) return;
    const controller = new AbortController();
    ctrl.current = controller;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/crm/search?q=${encodeURIComponent(term)}`, { signal: controller.signal, cache: "no-store" });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setResults(data.results ?? {});
        setCursor(0);
      } catch (err) {
        if (err?.name !== "AbortError") setResults({ error: true });
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [q, open]);

  const term = q.trim().toLowerCase();
  const pageHits = (term ? pages.filter((p) => p.title.toLowerCase().includes(term)) : pages).slice(0, term ? 5 : 8);
  const shown = term.length >= 2 ? results : {};
  const groups = [
    ...(pageHits.length ? [["pages", pageHits]] : []),
    ...Object.entries(shown).filter(([k, v]) => Array.isArray(v) && v.length && GROUP_LABEL[k]),
  ];
  const flat = groups.flatMap(([, list]) => list);

  const go = (item) => {
    if (!item) return;
    close();
    router.push(item.href);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(flat.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(flat[cursor]);
    }
  };

  if (!open) return null;
  let index = -1;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search">
      <button type="button" aria-label="Close search" className="absolute inset-0 bg-slate-900/40" onClick={close} />
      <div className="absolute inset-x-0 top-0 mx-auto flex max-h-[100dvh] w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl sm:top-[10vh] sm:max-h-[70vh] sm:rounded-2xl">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-4">
          <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Booking ID, name, mobile, lab, test…"
            className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="crm-search-results"
          />
          {loading && term.length >= 2 && <Loader2 className="h-4 w-4 animate-spin text-slate-400" aria-hidden />}
          <button type="button" onClick={close} className="rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-slate-400 ring-1 ring-slate-200">
            Esc
          </button>
        </div>
        <div id="crm-search-results" role="listbox" className="min-h-0 flex-1 overflow-y-auto p-2">
          {shown.error && <p className="px-3 py-6 text-center text-[13px] text-slate-500">Search is unavailable right now. Try again in a moment.</p>}
          {!shown.error && term.length >= 2 && !loading && groups.length === 0 && (
            <p className="px-3 py-8 text-center text-[13px] text-slate-500">
              Nothing matches “{q.trim()}”. Try a booking ID like MB10245 or a 10-digit mobile number.
            </p>
          )}
          {groups.map(([key, list]) => (
            <div key={key} className="mb-1.5">
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">{GROUP_LABEL[key]}</p>
              <ul>
                {list.map((item) => {
                  index += 1;
                  const i = index;
                  return (
                    <li key={`${key}-${item.id}`} role="option" aria-selected={i === cursor}>
                      <button
                        type="button"
                        onMouseMove={() => setCursor(i)}
                        onClick={() => go(item)}
                        className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left", i === cursor ? "bg-blue-50" : "hover:bg-slate-50")}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-medium text-slate-900">{item.title}</span>
                          {item.sub && <span className="block truncate text-[12px] text-slate-500">{item.sub}</span>}
                        </span>
                        {item.badge && <span className="shrink-0 text-[11.5px] font-medium text-slate-500">{item.badge}</span>}
                        {i === cursor && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-blue-600" aria-hidden />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
