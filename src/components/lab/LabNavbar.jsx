'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Phone } from "lucide-react"

import { LAB_PHONE } from "@/data/lab/defaults"

/**
 * The site's one header.
 *
 * It used to be the lab section's header only — the rest of the site ran a
 * separate `common/Navbar` built around medicine delivery, so a visitor
 * crossing from the home page into a lab page watched the whole chrome change.
 * That second navbar is gone; this is now mounted by every layout.
 *
 * ── THE HEADER CARRIES NO LINKS ──────────────────────────────────────────
 * The bar used to carry a desktop row of links — Home, a Lab Tests menu with
 * every live city, a Health Guides menu, About, Contact. That row was replaced
 * by the ECG tagline, and the hamburger button that held the same links in a
 * slide-in sheet has since been removed too. What is left is a logo, a running
 * heartbeat and the phone number, at every width.
 *
 * So the only navigation out of any page is now in the body and in the footer.
 * LabFooter's "Cities We Serve" column is what links every city from every
 * page — if that ever goes, the city pages lose their sitewide link entirely.
 */
export default function LabNavbar() {
    const [scrolled, setScrolled] = useState(false)

    // Add depth to the navbar once the page is scrolled.
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const tel = `tel:${LAB_PHONE.replace(/\s/g, "")}`

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

                    {/* ── CENTRE: ECG TAGLINE ─────────────────────────────────
                        What the desktop link row used to occupy. It is
                        decoration, not navigation — `aria-hidden` on the line
                        itself, and the words beside it are a plain statement of
                        the two things this service actually promises.

                        `md` and up only: below that the logo and the call block
                        already fill the bar, and squeezing this in between them
                        would shrink the phone number, which is the one thing on
                        a phone header worth tapping. */}
                    <p className="hidden md:flex min-w-0 items-center gap-2.5 text-[12.5px] font-semibold text-slate-600">
                        <svg
                            viewBox="0 0 120 24"
                            className="h-5 w-21 shrink-0 overflow-visible"
                            fill="none"
                            aria-hidden
                        >
                            {/* `.ecg-line` draws the stroke on a 2.4s loop — see
                                the keyframes in src/app/globals.css. */}
                            <path
                                className="ecg-line"
                                d="M0 12 H26 l4 -9 6 18 5 -14 4 10 H72 l4 -6 4 6 H120"
                                stroke="url(#navEcg)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <defs>
                                <linearGradient
                                    id="navEcg"
                                    x1="0"
                                    y1="0"
                                    x2="120"
                                    y2="0"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#0d9488" />
                                    <stop offset="1" stopColor="#059669" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="truncate">
                            Home sample collection — reports in 24 hours
                        </span>
                    </p>

                    {/* RIGHT: the call block — the header's only action. */}
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
                    </div>
                </div>
            </nav>
        </header>
    )
}
