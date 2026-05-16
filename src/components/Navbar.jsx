'use client'

import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">

            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* LOGO */}
                <Link
                    href="/"
                    className="flex items-center gap-2">
                    <Image
                        src="/navbar/navbg.webp"
                        alt="Medicobharat Logo"
                        width={180}
                        height={80}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* NAV LINKS */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">

                    <Link href="/" className="hover:text-green-600 transition">
                        Home
                    </Link>

                    <Link href="#how" className="hover:text-green-600 transition">
                        About us
                    </Link>

                    <Link href="#contact" className="hover:text-green-600 transition">
                        Contact
                    </Link>

                </div>

                {/* Right */}

                <a
                    href={`https://wa.me/917303995446?text=${encodeURIComponent(
                        `Hi MedicoBharat 👋

Please share your details

Full Name:
Mobile Number:
Delivery Address:
Medicine Name:
Prescription (if available):

Our team will assist you in few minutes.`
                    )}`}
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
        </nav>
    )
}
