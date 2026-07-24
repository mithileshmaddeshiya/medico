'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const PHONE = "+91 989-123-3525"

export default function LabNavbar() {
    const [scrolled, setScrolled] = useState(false)

    // Add depth to the navbar once the page is scrolled.
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <header className="fixed top-0 left-0 w-full z-50">
            <nav
                className={`w-full border-b transition-all duration-300 ${
                    scrolled
                        ? "bg-white/90 backdrop-blur-xl border-emerald-100 shadow-[0_6px_24px_rgba(6,78,59,0.10)]"
                        : "bg-white/80 backdrop-blur-xl border-emerald-50 shadow-[0_2px_12px_rgba(6,78,59,0.05)]"
                }`}
            >
                <div className="max-w-6xl mx-auto pl-3 pr-2 sm:px-5 md:px-8 flex items-center justify-between gap-2 sm:gap-3 h-16 sm:h-20">

                    {/* LOGO */}
                    <Link href="/" className="flex items-center shrink-0">
                        <Image
                            src="/navbar/lablogo.png"
                            alt="Medicobharat Logo"
                            width={260}
                            height={76}
                            className="h-14 sm:h-12 md:h-14 w-auto object-contain scale-110 origin-left"
                            priority
                        />
                    </Link>

                    {/* CENTER: animated ECG heartbeat + tagline (desktop) */}
                    <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 ring-1 ring-emerald-100/80">
                        <svg viewBox="0 0 120 24" className="h-6 w-[90px] overflow-visible" fill="none">
                            <path
                                className="ecg-line"
                                d="M0 12 H26 l4 -9 6 18 5 -14 4 10 H72 l4 -6 4 6 H120"
                                stroke="url(#ecgGrad)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <defs>
                                <linearGradient id="ecgGrad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#0d9488" />
                                    <stop offset="1" stopColor="#059669" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="text-[14px] font-semibold text-slate-800">
                            Accurate Lab Tests &amp; Health Checkups at Home
                        </span>
                    </div>

                    {/* RIGHT: Call block (primary action — phone first) */}
                    <a
                        href={`tel:${PHONE.replace(/\s/g, "")}`}
                        aria-label={`Call us at ${PHONE}`}
                        className="group flex items-center gap-1.5 sm:gap-2.5 rounded-full p-1 pr-3 sm:pr-5 ring-1 ring-emerald-200/70 hover:ring-emerald-300 shadow-sm hover:shadow-md active:scale-[0.98] bg-gradient-to-r from-emerald-50 to-teal-50 transition-all duration-200 shrink-0"
                    >
                        {/* Icon badge with live pulse */}
                        <span className="relative inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.35)] group-hover:scale-105 transition-transform duration-200">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 sm:h-5 sm:w-5">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
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
                                {PHONE}
                            </span>
                        </span>
                    </a>
                </div>
            </nav>
        </header>
    )
}
