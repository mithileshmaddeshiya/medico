"use client";

/**
 * The panel's sidebar: expanded, collapsed to an icon rail, or (on a phone)
 * a slide-in drawer.
 *
 * The CONTENTS (links filtered by role, the user, the sign-out form) are
 * rendered on the server by src/app/admin/layout.js and passed in as
 * `sidebar` — a layout cannot hand lucide icon components or a Server Action
 * to a client component as props, but it can hand over rendered elements.
 * This file decides only how the sidebar is showing, and marks the link for
 * the current page.
 *
 *   desktop (lg+)  expanded by default. ✕ collapses it to a 4rem rail of
 *                  icons — every link still works, and hovering one shows its
 *                  name. The button at the top of the rail expands it again.
 *                  Remembered in localStorage.
 *   phone          closed by default. ☰ slides the full sidebar in over the
 *                  page; ✕, a tap on the dimmed page, Esc or a link closes it.
 *
 * The rail is drawn by the "Admin sidebar" block in src/app/globals.css,
 * keyed off `data-collapsed` on the <aside>.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, PanelLeftOpen, X } from "lucide-react";

/**
 * The site's own logo, exactly as the site uses it.
 *
 * It is navy and black artwork on a white background, so on the dark sidebar
 * it is given a white plate to sit on. It is never recoloured or cropped to
 * suit the background — a logo redrawn to fit a panel is no longer the logo.
 *
 * `priority` because it is the topmost thing on every admin screen; at 14 KB
 * the request is paid for once and blocks nothing after it. The intrinsic size
 * is passed so the box is reserved before the image arrives and the header
 * never jumps.
 */
const Logo = ({ className = "" }) => (
  <Image
    src="/navbar/lablogo.webp"
    alt="MedicoBharat"
    width={640}
    height={180}
    priority
    className={`h-auto ${className}`}
  />
);

const KEY = "mb-admin-sidebar-collapsed";

const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

/*
 * The desktop expanded/collapsed preference, as a tiny external store read
 * through useSyncExternalStore (the same pattern as the cart store). Storage
 * can throw in private mode or with site data blocked; `memory` keeps the
 * choice for the visit then. The server always renders it expanded.
 */
const listeners = new Set();
let memory = null;

const readCollapsed = () => {
  if (memory !== null) return memory;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

const writeCollapsed = (value) => {
  memory = value;
  try {
    window.localStorage.setItem(KEY, value ? "1" : "0");
  } catch {
    /* kept in memory for this visit */
  }
  listeners.forEach((fn) => fn());
};

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export default function AdminShell({ sidebar, children }) {
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false); // desktop
  const [drawer, setDrawer] = useState(false); // phone
  const pathname = usePathname();
  const asideRef = useRef(null);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  /*
   * Highlight the link for the page you are on. The links are server-rendered
   * markup, so this marks them in the DOM. The LONGEST matching href wins, so
   * /admin/seo/redirects lights up "Redirects" and not "SEO" as well.
   */
  useEffect(() => {
    const links = [...(asideRef.current?.querySelectorAll("a.sb-link[href^='/admin']") ?? [])];
    let best = null;
    for (const link of links) {
      const href = link.getAttribute("href");
      const hit = link.hasAttribute("data-exact")
        ? pathname === href
        : pathname === href || pathname.startsWith(`${href}/`);
      if (hit && (!best || href.length > best.getAttribute("href").length)) best = link;
    }
    for (const link of links) {
      if (link === best) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  }, [pathname]);

  const close = () => (isDesktop() ? writeCollapsed(true) : setDrawer(false));

  return (
    <div className="mx-auto flex max-w-[1600px]">
      {/* Phone only: dims the page behind the open drawer; a tap closes it. */}
      {drawer && (
        <div
          aria-hidden
          onClick={() => setDrawer(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        ref={asideRef}
        id="admin-sidebar"
        aria-label="Admin navigation"
        data-collapsed={collapsed ? "" : undefined}
        // Following a link on a phone should land on the page, not the menu.
        onClick={(e) => e.target.closest("a") && setDrawer(false)}
        className={`admin-sb fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r transition-[transform,width] duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 ${
          drawer ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-16" : "lg:w-60"}`}
      >
        <div
          className={`sb-brand flex h-[4.25rem] shrink-0 items-center justify-between border-b px-4 ${
            collapsed ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          {/* The logo, on its white plate. Sized so that it and the collapse
              button both fit the 15rem sidebar without either being cramped. */}
          <Link
            href="/admin"
            className={`flex min-w-0 items-center ${collapsed ? "lg:hidden" : ""}`}
          >
            <span className="sb-plate flex items-center px-2 py-1.5">
              <Logo className="w-[140px]" />
            </span>
          </Link>

          {/* ✕ — collapses to the rail on a desktop, closes the drawer on a phone. */}
          <button
            type="button"
            onClick={close}
            aria-label="Collapse menu"
            title="Collapse menu"
            aria-controls="admin-sidebar"
            className={`sb-ctl -mr-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            <X className="h-4.5 w-4.5" strokeWidth={2.2} />
          </button>

          {/* Desktop rail only: expand back to the full sidebar. No logo here —
              it is a wide wordmark and a 4rem rail would render it unreadable,
              which is worse for the brand than leaving it out until the
              sidebar is opened again. */}
          <button
            type="button"
            onClick={() => writeCollapsed(false)}
            aria-label="Expand menu"
            title="Expand menu"
            aria-controls="admin-sidebar"
            aria-expanded={!collapsed}
            className={`sb-ctl hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition ${
              collapsed ? "lg:flex" : ""
            }`}
          >
            <PanelLeftOpen className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>

        {sidebar}
      </aside>

      <div className="min-w-0 flex-1">
        {/* Phone only. On a desktop the sidebar (or its rail) is always there. */}
        {/* Solid rather than translucent-and-blurred: this bar is stuck to the
            top of a list that scrolls, and a backdrop filter is the one thing
            on this screen that makes that scroll cost frames on a cheap phone. */}
        <header className="sticky top-0 z-30 flex items-center gap-2.5 border-b border-slate-200 bg-white px-3 py-2.5 lg:hidden">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
            aria-controls="admin-sidebar"
            aria-expanded={drawer}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Menu className="h-5 w-5" strokeWidth={2.2} />
          </button>

          {/* This bar is already white, so the logo needs no plate here. */}
          <Link href="/admin" className="flex min-w-0 items-center">
            <Logo className="w-[132px]" />
          </Link>
        </header>

        {children}
      </div>
    </div>
  );
}
