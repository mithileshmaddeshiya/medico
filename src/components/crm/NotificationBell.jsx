"use client";

/**
 * The bell: unread count from the pulse, a panel of the latest notifications
 * on click. Reading one marks it read and opens its record.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2 } from "lucide-react";

import { ago } from "@/lib/crm/format";

import { cx } from "./ui";

const SEVERITY_DOT = {
  info: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
};

export default function NotificationBell() {
  const router = useRouter();
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    const onPulse = (e) => setUnread(Number(e.detail?.unread ?? 0));
    window.addEventListener("crm:pulse", onPulse);
    return () => window.removeEventListener("crm:pulse", onPulse);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const load = async () => {
    setError(false);
    try {
      const res = await fetch("/api/crm/notifications?limit=15", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data.items);
      setUnread(data.unread);
    } catch {
      setError(true);
      setItems([]);
    }
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setItems(null);
      load();
    }
  };

  const markAll = async () => {
    await fetch("/api/crm/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }) });
    setUnread(0);
    setItems((list) => list?.map((n) => ({ ...n, is_read: true })) ?? list);
  };

  const openOne = async (n) => {
    setOpen(false);
    if (!n.is_read) {
      setUnread((u) => Math.max(0, u - 1));
      fetch("/api/crm/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: n.id }) });
    }
    if (n.link) router.push(n.link);
  };

  return (
    <div className="relative" ref={box}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
      >
        <Bell className="h-5 w-5" aria-hidden />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10.5px] font-bold text-white ring-2 ring-white tabular-nums">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-16 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-[14px] font-semibold">Notifications</p>
            {unread > 0 && (
              <button type="button" onClick={markAll} className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-700 hover:text-blue-800">
                <CheckCheck className="h-3.5 w-3.5" aria-hidden /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {items === null ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" aria-label="Loading" />
              </div>
            ) : error ? (
              <div className="px-4 py-8 text-center text-[13px] text-slate-500">
                Could not load notifications.{" "}
                <button type="button" onClick={load} className="font-semibold text-blue-700">
                  Retry
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-[13.5px] font-semibold text-slate-700">You are all caught up</p>
                <p className="mt-1 text-[12.5px] text-slate-500">New bookings, payments and partner updates appear here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => openOne(n)}
                      className={cx("flex w-full gap-3 px-4 py-3 text-left hover:bg-slate-50", !n.is_read && "bg-blue-50/40")}
                    >
                      <span className={cx("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.is_read ? "bg-slate-200" : SEVERITY_DOT[n.severity] ?? SEVERITY_DOT.info)} />
                      <span className="min-w-0 flex-1">
                        <span className={cx("block text-[13px] leading-snug", n.is_read ? "text-slate-600" : "font-semibold text-slate-900")}>{n.title}</span>
                        {n.body && <span className="mt-0.5 block truncate text-[12px] text-slate-500">{n.body}</span>}
                        <span className="mt-0.5 block text-[11px] text-slate-400">{ago(n.created_at)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link href="/crm/notifications" onClick={() => setOpen(false)} className="block border-t border-slate-100 py-2.5 text-center text-[12.5px] font-semibold text-blue-700 hover:bg-slate-50">
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
