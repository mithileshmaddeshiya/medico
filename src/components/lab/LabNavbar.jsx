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
 * ── THE HEADER CARRIES NO LINKS, AND THAT COSTS SOMETHING ────────────────
 * It used to. Four flat hrefs — /lab-test, /blogs, /about, /contact — sat in
 * the centre of the bar, and they were put there on purpose: Google discounts
 * sitewide footer links relative to header and in-content ones, so with the
 * centre given over to decoration the site's most commercially valuable hub
 * pages are reachable only by the weakest form of internal linking available.
 *
 * They have been replaced by the ECG line below, which is decoration. Nothing
 * factual is lost — the promise it used to carry a tagline for is stated by
 * the trust strip on every page and by the footer — but the link graph is
 * genuinely weaker than it was, and that is the trade this header makes.
 *
 * Every one of those four destinations is still linked from the footer on
 * every route, so nothing is orphaned. If header links are ever wanted back,
 * they went exactly where the ECG sits now.
 *
 * ── WHY THE CENTRE IS DESKTOP-ONLY EITHER WAY ────────────────────────────
 * `hidden md:flex`. Below `md` the logo and the call block already fill the
 * bar, and anything in the middle would shrink the phone number — the one
 * thing on a phone header actually worth tapping.
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
                    <Link href="/" className="flex items-center shrink-0" aria-label="MedicoBharat — Home" title="MedicoBharat — lab test at home with free sample collection">
                        {/* 320×90 is the artwork's real 3.56:1 ratio, and the file
                            is the trimmed WebP rather than the original PNG.

                            The source was an 826 KB PNG, 1774×887, of which only
                            1646×463 was actually logo — the rest was blank
                            padding. It was declared here at 260×76 (3.42:1), a
                            ratio that matched neither the file nor the artwork,
                            so `object-contain` letterboxed it inside a box wider
                            than it needed and the reserved layout space did not
                            match the painted pixels.

                            Trimmed and re-encoded it is 14 KB — a 98% cut on an
                            image that is `priority`-preloaded on every route of
                            the site. With the ratio now honest, `object-contain`
                            is no longer doing any work, but it is kept as a cheap
                            guard against a future re-export at a different crop.

                            ── WHY IT IS THIS SMALL ─────────────────────────
                            It used to be `h-14 sm:h-12 md:h-14 scale-110`, and
                            the phone value being the LARGEST of the three was
                            not a style choice — it overflowed the bar. At 3.56:1
                            a 56px-tall logo is 199px wide; with the call block
                            next to it that is ~367px of content inside a 320px
                            screen, so the header scrolled sideways on a small
                            phone. The heights below step UP with the viewport,
                            which is the direction they should always have gone,
                            and `scale-110` is gone with them — it drew 10%
                            wider than the space the layout had reserved. */}
                        <Image
                            src="/navbar/lablogo.webp"
                            alt="MedicoBharat — lab test at home"
                            width={320}
                            height={90}
                            className="h-9 sm:h-10 md:h-11 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* ── CENTRE: THE ECG LINE ────────────────────────────
                        Purely decorative, so `aria-hidden` — it carries no
                        information, and a screen reader announcing a squiggle
                        between the logo and the phone number is noise.

                        Deliberately light: no pill, no ring, no tagline beside
                        it. The earlier version sat in a bordered emerald
                        capsule with a line of copy, which read as a badge
                        making a claim; this reads as what it is, a heartbeat
                        ticking along behind the bar. Low opacity keeps it from
                        competing with the call button, which is the only thing
                        in this header anyone is meant to press.

                        The trace itself is animated in CSS — `.ecg-line` in
                        globals.css draws the stroke on a 2.4s loop, so the peak
                        sweeps up and down the way a monitor does. It stops
                        entirely under `prefers-reduced-motion`. */}
                    <div
                        aria-hidden
                        className="hidden md:flex min-w-0 flex-1 items-center justify-center opacity-70"
                    >
                        <svg
                            viewBox="0 0 240 24"
                            className="h-6 w-37.5 lg:w-55 overflow-visible"
                            fill="none"
                        >
                            <path
                                className="ecg-line"
                                d="M0 12 H52 l4 -9 6 18 5 -14 4 10 H144 l4 -6 4 6 H240"
                                stroke="url(#ecgGrad)"
                                strokeWidth="1.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <defs>
                                <linearGradient
                                    id="ecgGrad"
                                    x1="0"
                                    y1="0"
                                    x2="240"
                                    y2="0"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    {/* Fades in and out at the ends so the line
                                        does not stop dead against the logo or
                                        the call button. */}
                                    <stop stopColor="#0d9488" stopOpacity="0" />
                                    <stop offset="0.18" stopColor="#0d9488" />
                                    <stop offset="0.82" stopColor="#059669" />
                                    <stop offset="1" stopColor="#059669" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* RIGHT: the call block — the header's only action. */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <a
                            href={tel}
                            aria-label={`Call us at ${LAB_PHONE}`}
                            title={`Call ${LAB_PHONE} to book a lab test`}
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
