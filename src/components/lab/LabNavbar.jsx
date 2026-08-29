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
 * ── THE HEADER CARRIES LINKS AGAIN ───────────────────────────────────────
 * It had none. A logo, a decorative ECG line and a phone number, at every
 * width — so every internal link on the site lived in the footer or in body
 * copy. Google discounts sitewide footer links relative to header and
 * in-content ones, which meant the section's most commercially valuable pages
 * were reachable only by the weakest form of internal linking available.
 *
 * The four links below are the site's real top level. They are flat hrefs, not
 * dropdown menus: the menus this header used to carry needed JavaScript to
 * open, and a link inside a closed menu is a link a crawler has to work for.
 * Two of them point at hub pages that did not exist until this pass —
 * /lab-test and /blogs — which is the other half of the same fix.
 *
 * ── WHY THE ECG LINE HAD TO GO ───────────────────────────────────────────
 * It sat in exactly the space the links need, and it was decoration that said
 * so in its own comment. The promise it carried ("home sample collection —
 * reports in 24 hours") is stated by the trust strip on every page, the hero
 * sub-line and the footer, so nothing factual is lost.
 *
 * ── THE MOBILE CAVEAT, STATED PLAINLY ────────────────────────────────────
 * The row is `hidden md:flex`. Below `md` the logo and the call block already
 * fill the bar, and squeezing links in would shrink the phone number — the one
 * thing on a phone header actually worth tapping. The links are still in the
 * HTML at every width, so the link graph is unaffected; what a phone reader
 * gets instead is the footer, which carries the same destinations plus every
 * city. If this header ever grows a second row, that is the place to solve it
 * properly — but not at the cost of the call button.
 */
/**
 * The header's four destinations, in the order they matter commercially.
 *
 * "Lab Tests" is first and points at the city hub rather than at any one city:
 * a header link is on every page including the six city pages, and pointing it
 * at Varanasi from Ballia's page would be a sitewide vote for the wrong town.
 *
 * Keep this list to four. A fifth item wraps the bar at `md`, and the footer is
 * where the exhaustive list belongs.
 */
const NAV_LINKS = [
    { href: "/lab-test", label: "Lab Tests" },
    { href: "/blogs", label: "Guides" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
]

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
                            guard against a future re-export at a different crop. */}
                        <Image
                            src="/navbar/lablogo.webp"
                            alt="MedicoBharat — lab test at home"
                            width={320}
                            height={90}
                            className="h-14 sm:h-12 md:h-14 w-auto object-contain scale-110 origin-left"
                            priority
                        />
                    </Link>

                    {/* ── CENTRE: PRIMARY NAVIGATION ──────────────────────
                        The site's four top-level destinations. Flat links, no
                        dropdowns — see the note at the top of this file for why
                        the menus that used to live here are not coming back.

                        `aria-label` on the <nav> is "Main" already, so these
                        need no further labelling. Anchors carry descriptive text
                        rather than "Tests" / "Guides" alone: the anchor text is
                        the strongest on-page signal about what the target page
                        is, and this row is on every route of the site. */}
                    <ul className="hidden md:flex min-w-0 items-center gap-1 lg:gap-2">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="block rounded-lg px-2.5 lg:px-3 py-2 text-[13px] font-semibold text-slate-600 whitespace-nowrap transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

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
