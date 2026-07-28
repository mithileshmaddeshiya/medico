'use client'

import Image from "next/image"
import Link from "next/link"

// `labCities` comes from the (main) layout. The first entry is the flagship
// city — linking to it is what connects the lab section to the rest of the site.
//
// The nav used to link ONLY to that flagship, which meant every page on the site
// handed Varanasi a link and gave every other city nothing: Deoria was down to a
// single sitewide link (the footer) against Varanasi's four. The menu below lists
// every live city instead, so a new city is linked from every page the day it
// ships. The flagship stays as the parent link's own href, so the item still
// works as a plain link when the menu is not open.
export default function Navbar({ labCities = [] }) {
    const labHref = labCities[0] ? `/lab-test/${labCities[0].slug}` : null;

    return (
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">

            <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

                {/* LOGO */}
                <Link
                    href="/"
                    className="flex items-center gap-2"
                >
                    <Image
                        src="/navbar/navbg.webp"
                        alt="Medicobharat Logo"
                        width={180}
                        height={120}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* NAV LINKS */}
                <div className="hidden md:flex items-center gap-5 text-[14px] font-medium text-gray-600">

                    <Link href="/" className="hover:text-green-600 transition">
                        Home
                    </Link>

                    {/* Opens on hover AND on keyboard focus (focus-within), so
                        the city links are reachable without a mouse. They stay
                        in the markup either way — a crawler reads all of them
                        on every page, which is the whole point of the change. */}
                    {labHref && (
                        <div className="relative group">
                            <Link
                                href={labHref}
                                className="inline-flex items-center gap-1 hover:text-green-600 transition"
                            >
                                Lab Tests
                                <svg
                                    aria-hidden
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-3.5 w-3.5 opacity-60 transition-transform duration-150 group-hover:rotate-180"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>

                            <ul className="invisible absolute left-0 top-full z-50 min-w-52.5 -translate-y-1 rounded-xl border border-gray-100 bg-white py-1.5 opacity-0 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)] transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                                {labCities.map((c) => (
                                    <li key={c.slug}>
                                        <Link
                                            href={`/lab-test/${c.slug}`}
                                            className="block px-3.5 py-2 text-[13.5px] text-gray-600 transition-colors hover:bg-green-50 hover:text-green-700"
                                        >
                                            Lab Test in {c.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <Link href="/about" className="hover:text-green-600 transition">
                        About us
                    </Link>

                    <Link href="/contact" className="hover:text-green-600 transition">
                        Contact
                    </Link>

                    <Link href="/privacy" className="hover:text-green-600 transition">
                        Privacy Policy
                    </Link>

                    <Link href="/terms" className="hover:text-green-600 transition">
                        Term & Condition
                    </Link>



                </div>

                {/* Right */}

                <div className="flex items-center gap-2">

                {/* The nav links above are hidden below md, so on a phone this
                    is the only route into the lab section — and phones are most
                    of the traffic. */}
                {labHref && (
                    <Link
                        href={labHref}
                        className="md:hidden inline-flex items-center rounded-lg border border-green-600 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
                    >
                        Lab Tests
                    </Link>
                )}

                <a
                    href="https://wa.me/919891233525"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Order on WhatsApp"
                    className="
    w-auto
    inline-flex items-center justify-center gap-1.5 sm:gap-2
    bg-green-600 text-white
    px-3 py-2 sm:px-5 sm:py-2.5 md:px-6
    rounded-lg
    text-sm sm:text-sm
    font-medium
    hover:bg-green-700
    focus:outline-none focus:ring-2 focus:ring-green-400/40
    transition-all
  "
                >
                    Order on <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-[18px] sm:w-[18px] opacity-90" > <path d="M20.52 3.48A11.79 11.79 0 0 0 12.05 0C5.4 0 .05 5.35.05 12c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.62A11.9 11.9 0 0 0 12.05 24C18.7 24 24 18.65 24 12c0-3.2-1.25-6.21-3.48-8.52ZM12.05 21.8a9.8 9.8 0 0 1-5.01-1.37l-.36-.21-3.68.96.98-3.58-.24-.37A9.75 9.75 0 0 1 2.25 12c0-5.4 4.4-9.8 9.8-9.8 2.62 0 5.08 1.02 6.93 2.87A9.73 9.73 0 0 1 21.85 12c0 5.4-4.4 9.8-9.8 9.8Zm5.37-7.35c-.29-.14-1.72-.85-1.99-.95-.27-.1-.46-.14-.65.14-.19.29-.75.95-.92 1.15-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.33-1.44-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.44.12-.58.12-.12.29-.31.43-.46.14-.15.19-.27.29-.46.1-.19.05-.36-.02-.51-.07-.14-.65-1.57-.89-2.16-.23-.56-.46-.48-.65-.49h-.55c-.19 0-.51.07-.77.36-.27.29-1.01.99-1.01 2.42 0 1.43 1.03 2.81 1.17 3 .14.19 2.02 3.08 4.9 4.32.69.3 1.23.48 1.65.61.69.22 1.31.19 1.8.12.55-.08 1.72-.7 1.96-1.37.24-.68.24-1.26.17-1.37-.07-.12-.26-.19-.55-.34Z" /> </svg>
                </a>

                </div>

            </div>
        </nav>
    )
}
