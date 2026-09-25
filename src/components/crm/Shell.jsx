"use client";

/**
 * The CRM frame: sidebar (desktop), top bar, bottom navigation and the
 * floating + (phone), the "More" sheet, and the slots for search and the
 * notification bell.
 *
 * The navigation itself is decided on the server (src/app/crm/layout.js) from
 * the user's permissions and handed in as plain data — icon NAMES, not icon
 * components, because a component cannot cross the server→client boundary as
 * a prop. Hiding a link is presentation only; every page checks again.
 */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BadgeIndianRupee,
  BarChart3,
  Bell,
  Building2,
  CalendarClock,
  ClipboardList,
  Command,
  FileCheck2,
  FlaskConical,
  Gauge,
  HandCoins,
  Home,
  LayoutGrid,
  LogOut,
  Map,
  MapPin,
  Package,
  PhoneCall,
  Plus,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Stethoscope,
  TestTube2,
  Truck,
  Undo2,
  UserCircle2,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";

import CommandPalette from "./CommandPalette";
import NotificationBell from "./NotificationBell";
import Pulse from "./Pulse";
import { cx } from "./ui";

export const ICONS = {
  Activity,
  BadgeIndianRupee,
  BarChart3,
  Bell,
  Building2,
  CalendarClock,
  ClipboardList,
  FileCheck2,
  FlaskConical,
  Gauge,
  HandCoins,
  Home,
  LayoutGrid,
  Map,
  MapPin,
  Package,
  PhoneCall,
  Plus,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Stethoscope,
  TestTube2,
  Truck,
  Undo2,
  UserCircle2,
  UserPlus,
  Users,
  Wallet,
};

const Icon = ({ name, className }) => {
  const C = ICONS[name] ?? LayoutGrid;
  return <C className={className} aria-hidden strokeWidth={2} />;
};

/** Is `href` the current page (or a parent of it)? `/crm` matches only itself. */
function isActive(pathname, href) {
  const path = href.split("?")[0];
  if (path === "/crm") return pathname === "/crm";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function Shell({ user, nav, bottomNav, quickActions, signOut, children }) {
  const pathname = usePathname();
  const [more, setMore] = useState(false);
  const [quick, setQuick] = useState(false);

  // A navigation closes whichever sheet was open.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- closing overlays on route change
    setMore(false);
    setQuick(false);
  }, [pathname]);

  const allLinks = nav.flatMap((s) => s.items);

  return (
    <div className="min-h-dvh bg-[#f5f7fb] text-slate-900">
      <Pulse />
      <CommandPalette />

      {/* ── Sidebar, lg and up ───────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/80 bg-white lg:flex">
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-slate-100 px-5">
          <Image src="/navbar/lablogo.webp" alt="MedicoBharat" width={640} height={180} priority className="h-7 w-auto" />
          <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-blue-700">
            {user.isPartner ? "Partner" : "CRM"}
          </span>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Main">
          {nav.map((section) => (
            <div key={section.title ?? "top"} className="mb-4">
              {section.title && (
                <p className="px-2.5 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">{section.title}</p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const on = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={on ? "page" : undefined}
                        className={cx(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] font-medium transition-colors",
                          on ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <Icon name={item.icon} className={cx("h-[18px] w-[18px] shrink-0", on ? "text-blue-600" : "text-slate-400")} />
                        <span className="truncate">{item.label}</span>
                        {item.badge ? (
                          <span className="ml-auto rounded-full bg-rose-50 px-1.5 text-[11px] font-semibold text-rose-700 tabular-nums">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="shrink-0 border-t border-slate-100 p-3">
          <Link href="/crm/profile" className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-50">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[12px] font-semibold text-white">
              {user.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-slate-900">{user.name}</span>
              <span className="block truncate text-[11.5px] text-slate-500">{user.roleLabel}</span>
            </span>
          </Link>
          <form action={signOut} className="mt-1">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-64">
        {/* ── Top bar ────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95">
          <div className="flex h-14 items-center gap-2 px-4 sm:h-16 sm:px-6 lg:px-8">
            <Link href="/crm" className="flex items-center gap-2 lg:hidden" aria-label="Dashboard">
              <Image src="/navbar/lablogo.webp" alt="MedicoBharat" width={640} height={180} priority className="h-6 w-auto" />
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("crm:search"))}
              className="ml-auto flex h-10 items-center gap-2 rounded-xl bg-slate-100/80 px-3 text-[13px] text-slate-500 transition-colors hover:bg-slate-100 lg:ml-0 lg:w-full lg:max-w-md"
              aria-label="Search (Ctrl K)"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <span className="hidden sm:inline">Search bookings, customers, phone…</span>
              <kbd className="ml-auto hidden items-center gap-0.5 rounded-md bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-400 ring-1 ring-slate-200 lg:inline-flex">
                <Command className="h-3 w-3" aria-hidden />K
              </kbd>
            </button>

            <div className="flex items-center gap-1.5 lg:ml-auto">
              {quickActions.length > 0 && (
                <div className="relative hidden lg:block">
                  <button
                    type="button"
                    onClick={() => setQuick((q) => !q)}
                    aria-expanded={quick}
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 text-[13.5px] font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" aria-hidden /> New
                  </button>
                  {quick && (
                    <div className="absolute right-0 z-40 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                      {quickActions.map((a) => (
                        <Link
                          key={a.href}
                          href={a.href}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Icon name={a.icon} className="h-4 w-4 text-slate-400" />
                          {a.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <NotificationBell />
              <Link
                href="/crm/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-[12px] font-semibold text-white lg:hidden"
                aria-label="Your profile"
              >
                {user.initials}
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-7">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* ── Phone: floating + ──────────────────────────────────────── */}
      {quickActions.length > 0 && (
        <button
          type="button"
          onClick={() => setQuick(true)}
          className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 active:bg-blue-700 lg:hidden"
          aria-label="Quick add"
        >
          <Plus className="h-6 w-6" aria-hidden />
        </button>
      )}

      {/* ── Phone: bottom navigation ───────────────────────────────── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Primary"
      >
        <ul className="grid" style={{ gridTemplateColumns: `repeat(${bottomNav.length + 1}, minmax(0, 1fr))` }}>
          {bottomNav.map((item) => {
            const on = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={on ? "page" : undefined}
                  className={cx(
                    "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold",
                    on ? "text-blue-700" : "text-slate-500"
                  )}
                >
                  <Icon name={item.icon} className={cx("h-[22px] w-[22px]", on ? "text-blue-600" : "text-slate-400")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMore(true)}
              className={cx(
                "flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold",
                more ? "text-blue-700" : "text-slate-500"
              )}
            >
              <LayoutGrid className="h-[22px] w-[22px] text-slate-400" aria-hidden />
              More
            </button>
          </li>
        </ul>
      </nav>

      {/* ── Phone sheets: More, Quick add ──────────────────────────── */}
      {(more || quick) && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label={more ? "All sections" : "Quick add"}>
          <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Close" onClick={() => (setMore(false), setQuick(false))} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-white pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3.5">
              <p className="text-[15px] font-semibold">{more ? "All sections" : "Quick add"}</p>
              <button
                type="button"
                onClick={() => (setMore(false), setQuick(false))}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            {quick ? (
              <div className="grid grid-cols-3 gap-2 p-4">
                {quickActions.map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 px-2 py-4 text-center text-[12px] font-semibold text-slate-700 active:bg-slate-50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon name={a.icon} className="h-5 w-5" />
                    </span>
                    {a.label}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {nav.map((section) => (
                  <div key={section.title ?? "top"}>
                    {section.title && (
                      <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">{section.title}</p>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cx(
                            "flex flex-col items-center gap-1.5 rounded-2xl px-1 py-3 text-center text-[11.5px] font-semibold",
                            isActive(pathname, item.href) ? "bg-blue-50 text-blue-700" : "text-slate-600 active:bg-slate-50"
                          )}
                        >
                          <Icon name={item.icon} className="h-5 w-5 text-slate-500" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <form action={signOut} className="border-t border-slate-100 pt-3">
                  <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13.5px] font-semibold text-slate-600 active:bg-slate-50">
                    <LogOut className="h-4 w-4" aria-hidden /> Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keeps every link reachable by keyboard shortcut search too. */}
      <span hidden data-links={JSON.stringify(allLinks.map((l) => [l.label, l.href]))} id="crm-nav-links" />
    </div>
  );
}
