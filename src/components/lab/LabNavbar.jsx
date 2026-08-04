'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ChevronDown, FlaskConical, Menu, Phone, X } from "lucide-react"

import { LAB_PHONE } from "@/data/lab/defaults"

/**
 * The site's one header.
 *
 * It used to be the lab section's header only — the rest of the site ran a
 * separate `common/Navbar` built around medicine delivery, so a visitor
 * crossing from the home page into a lab page watched the whole chrome change.
 * That second navbar is gone; this is now mounted by every layout.
 *
 * ── WHY IT CARRIES THE FULL CITY LIST ────────────────────────────────────
 * A header is on every page of the site, so whatever it links to gets linked
 * from everywhere. The old lab header linked to nothing at all: it was a logo
 * and a phone number, which meant the only route between two lab cities was
 * the footer. Listing every live city here gives each city page a link from
 * every other page on the domain, and a new city is linked sitewide the day it
 * ships — without anyone editing this file.
 *
 * The menus are rendered as real markup that is merely hidden, not mounted on
 * hover: a crawler reads all of these links on every page, which is the whole
 * point. `group-focus-within` opens them from the keyboard too.
 *
 * `labCities` and `guides` come from the layout (a server component) — this
 * file is "use client" and cannot read the data layer itself.
 */
export default function LabNavbar({ labCities = [], guides = [] }) {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()

    // Add depth to the navbar once the page is scrolled.
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Stop the page behind the sheet from scrolling while it is open.
    useEffect(() => {
        if (!menuOpen) return
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = prev }
    }, [menuOpen])

    /**
     * Closes the sheet after a navigation.
     *
     * Bound to the sheet's link container rather than to a `useEffect` on
     * `pathname`: closing on a route change means setting state inside an
     * effect, which schedules a second render pass for something the click
     * already knew — and the lint rule that flags it is right. Handling it on
     * the click closes the sheet in the same render as the navigation.
     *
     * On the container, not on each of the ~12 links, because a stray tap on
     * the sheet's padding closing it is the behaviour a user expects from an
     * overlay anyway.
     */
    const closeOnNavigate = (e) => {
        if (e.target.closest("a")) setMenuOpen(false)
    }

    const tel = `tel:${LAB_PHONE.replace(/\s/g, "")}`
    // The flagship city — the parent "Lab Tests" item's own href, so it still
    // works as a plain link when the menu is not open.
    const labHref = labCities[0] ? `/lab-test/${labCities[0].slug}` : "/"
    const isActive = (href) => pathname === href
    const inSection = (prefix) => pathname.startsWith(prefix)

    const linkClass = (active) =>
        `text-[13.5px] font-semibold transition-colors ${
            active ? "text-emerald-700" : "text-slate-600 hover:text-emerald-700"
        }`

    return (
        <header className="fixed top-0 left-0 w-full z-50">
            <nav
                aria-label="Main"
                className={`w-full border-b transition-all duration-300 ${
                    scrolled
                        ? "bg-white/90 backdrop-blur-xl border-emerald-100 shadow-[0_6px_24px_rgba(6,78,59,0.10)]"
                        : "bg-white/80 backdrop-blur-xl border-emerald-50 shadow-[0_2px_12px_rgba(6,78,59,0.05)]"
                }`}
            >
                <div className="max-w-6xl mx-auto pl-3 pr-2 sm:px-5 md:px-8 flex items-center justify-between gap-2 sm:gap-3 h-16 sm:h-20">

                    {/* LOGO */}
                    <Link href="/" className="flex items-center shrink-0" aria-label="MedicoBharat — Home">
                        <Image
                            src="/navbar/lablogo.png"
                            alt="MedicoBharat — lab test at home"
                            width={260}
                            height={76}
                            className="h-14 sm:h-12 md:h-14 w-auto object-contain scale-110 origin-left"
                            priority
                        />
                    </Link>

                    {/* ── DESKTOP NAV ─────────────────────────────────────────
                        lg and up. Below that the same links live in the sheet,
                        so nothing is reachable on one breakpoint only. */}
                    <div className="hidden lg:flex items-center gap-6">
                        <Link href="/" className={linkClass(isActive("/"))}>
                            Home
                        </Link>

                        {/* LAB TESTS — every live city. The list is the reason
                            this header exists; see the note at the top. */}
                        <div className="relative group">
                            <Link
                                href={labHref}
                                className={`inline-flex items-center gap-1 ${linkClass(inSection("/lab-test"))}`}
                            >
                                Lab Tests
                                <ChevronDown
                                    aria-hidden
                                    className="h-3.5 w-3.5 opacity-60 transition-transform duration-150 group-hover:rotate-180"
                                    strokeWidth={2.5}
                                />
                            </Link>

                            <ul className="invisible absolute left-0 top-full z-50 min-w-60 -translate-y-1 rounded-2xl border border-emerald-100 bg-white p-1.5 opacity-0 shadow-[0_16px_40px_-16px_rgba(6,78,59,0.35)] transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                                {labCities.map((c) => (
                                    <li key={c.slug}>
                                        <Link
                                            href={`/lab-test/${c.slug}`}
                                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
                                        >
                                            <FlaskConical
                                                aria-hidden
                                                className="h-3.5 w-3.5 shrink-0 text-emerald-500"
                                                strokeWidth={2.2}
                                            />
                                            Lab Test in {c.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* HEALTH GUIDES — the articles. There is no /blogs hub
                            page, so the parent is not a link: it opens the list
                            and the articles themselves are the destinations.
                            Rendered only when a guide exists, so this can never
                            become an empty dropdown. */}
                        {guides.length > 0 && (
                            <div className="relative group">
                                <button
                                    type="button"
                                    className={`inline-flex cursor-pointer items-center gap-1 ${linkClass(inSection("/blogs"))}`}
                                >
                                    Health Guides
                                    <ChevronDown
                                        aria-hidden
                                        className="h-3.5 w-3.5 opacity-60 transition-transform duration-150 group-hover:rotate-180"
                                        strokeWidth={2.5}
                                    />
                                </button>

                                <ul className="invisible absolute left-0 top-full z-50 w-80 -translate-y-1 rounded-2xl border border-emerald-100 bg-white p-1.5 opacity-0 shadow-[0_16px_40px_-16px_rgba(6,78,59,0.35)] transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                                    {guides.map((post) => (
                                        <li key={post.href}>
                                            <Link
                                                href={post.href}
                                                className="block rounded-xl px-3 py-2 transition-colors hover:bg-emerald-50"
                                            >
                                                <span className="block text-[13px] font-semibold leading-snug text-slate-700">
                                                    {post.title}
                                                </span>
                                                <span className="mt-0.5 block text-[11.5px] text-slate-400">
                                                    {post.cityName} · {post.readingMinutes} min read
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <Link href="/about" className={linkClass(isActive("/about"))}>
                            About
                        </Link>

                        <Link href="/contact" className={linkClass(isActive("/contact"))}>
                            Contact
                        </Link>
                    </div>

                    {/* RIGHT: call block (primary action — phone first) + the
                        sheet trigger below lg. */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <a
                            href={tel}
                            aria-label={`Call us at ${LAB_PHONE}`}
                            className="group flex items-center gap-1.5 sm:gap-2.5 rounded-full p-1 pr-3 sm:pr-5 ring-1 ring-emerald-200/70 hover:ring-emerald-300 shadow-sm hover:shadow-md active:scale-[0.98] bg-linear-to-r from-emerald-50 to-teal-50 transition-all duration-200"
                        >
                            {/* Icon badge with live pulse */}
                            <span className="relative inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.35)] group-hover:scale-105 transition-transform duration-200">
                                <Phone className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.2} />
                                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                                </span>
                            </span>

                            {/* Label + number */}
                            <span className="flex flex-col justify-center">
                                <span className="text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600 leading-none mb-1">
                                    Call to Book
                                </span>
                                <span className="text-[12px] sm:text-[15px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors tabular-nums leading-none whitespace-nowrap">
                                    {LAB_PHONE}
                                </span>
                            </span>
                        </a>

                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                            aria-expanded={menuOpen}
                            className="lg:hidden flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-700 ring-1 ring-emerald-200/70 transition-colors hover:bg-emerald-50 active:scale-95"
                        >
                            <Menu className="h-5 w-5" strokeWidth={2.2} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── MOBILE SHEET ────────────────────────────────────────────────
                Phones are most of this audience, and before this the only
                thing a phone visitor could do from the header was call. The
                sheet carries the same links as the desktop bar — cities and
                guides included, since those are the pages worth reaching.

                Mounted only while open: hiding it with CSS instead would put a
                second copy of every link into the HTML of every page, which is
                the duplicate-link pattern a crawler discounts. */}
            {menuOpen && (
                <div className="lg:hidden fixed inset-0 z-60">
                    <div
                        onClick={() => setMenuOpen(false)}
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
                    />

                    <div className="lab-slide-in absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-emerald-100 px-4 py-3">
                            <span className="text-[13px] font-bold uppercase tracking-wide text-emerald-800">
                                Menu
                            </span>
                            <button
                                type="button"
                                onClick={() => setMenuOpen(false)}
                                aria-label="Close menu"
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                            >
                                <X className="h-5 w-5" strokeWidth={2.2} />
                            </button>
                        </div>

                        <div onClick={closeOnNavigate} className="flex-1 overflow-y-auto px-4 py-4">
                            <Link
                                href="/"
                                className="block rounded-xl px-3 py-2.5 text-[14.5px] font-bold text-slate-800 transition-colors hover:bg-emerald-50"
                            >
                                Home
                            </Link>

                            <p className="mt-4 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                                Lab Test — Sheher
                            </p>
                            <ul className="mt-1.5 space-y-0.5">
                                {labCities.map((c) => (
                                    <li key={c.slug}>
                                        <Link
                                            href={`/lab-test/${c.slug}`}
                                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
                                        >
                                            <FlaskConical
                                                aria-hidden
                                                className="h-4 w-4 shrink-0 text-emerald-500"
                                                strokeWidth={2.2}
                                            />
                                            Lab Test in {c.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {guides.length > 0 && (
                                <>
                                    <p className="mt-5 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                                        Health Guides
                                    </p>
                                    <ul className="mt-1.5 space-y-0.5">
                                        {guides.map((post) => (
                                            <li key={post.href}>
                                                <Link
                                                    href={post.href}
                                                    className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-emerald-50"
                                                >
                                                    <span className="block text-[13.5px] font-semibold leading-snug text-slate-700">
                                                        {post.title}
                                                    </span>
                                                    <span className="mt-0.5 block text-[11.5px] text-slate-400">
                                                        {post.cityName} · {post.readingMinutes} min read
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            <p className="mt-5 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                                MedicoBharat
                            </p>
                            <ul className="mt-1.5 space-y-0.5">
                                {[
                                    { href: "/about", label: "About Us" },
                                    { href: "/contact", label: "Contact Us" },
                                    { href: "/privacy", label: "Privacy Policy" },
                                    { href: "/terms", label: "Terms & Conditions" },
                                ].map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="block rounded-xl px-3 py-2.5 text-[14px] font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* The sheet ends in the action it exists to make easy */}
                        <div className="border-t border-emerald-100 p-4">
                            <a
                                href={tel}
                                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-[14px] font-bold text-white shadow-[0_10px_22px_-10px_rgba(5,150,105,0.95)] active:scale-[0.98] transition-transform"
                            >
                                <Phone className="h-4 w-4" strokeWidth={2.4} />
                                Call to Book — {LAB_PHONE}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
