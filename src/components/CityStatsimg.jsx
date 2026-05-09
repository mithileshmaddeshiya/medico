"use client";

import { motion } from "framer-motion";
import {
    ShieldCheck,
    Truck,
    ArrowRight,
    PhoneCall,
} from "lucide-react";

export default function DeoriaHeroSection() {
    return (
        <section className="relative overflow-hidden bg-white py-4 sm:py-8 lg:py-12">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HERO CONTAINER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative overflow-hidden rounded-[20px] sm:rounded-[32px] lg:rounded-[42px] h-screen min-h-[100vh] sm:min-h-[700px] lg:h-[100vh] shadow-2xl flex items-center"
                >

                    {/* DESKTOP BG IMAGE */}
                    <img
                        src="/images/deoria-desktop.jpg"
                        alt="Medicine Delivery in Deoria"
                        className="absolute inset-0 hidden sm:block w-full h-full object-cover object-center scale-105"
                    />

                    {/* MOBILE BG IMAGE */}
                    <img
                        src="/images/deoria-mobile.jpg"
                        alt="Medicine Delivery in Deoria"
                        className="absolute inset-0 block sm:hidden w-full h-full object-cover object-center"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/50 lg:to-transparent"></div>

                    {/* GREEN GLOW */}
                    <div className="absolute -left-20 -top-20 w-[300px] h-[300px] bg-green-500/30 blur-[100px] rounded-full hidden sm:block"></div>

                    {/* CONTENT */}
                    <div className="relative z-10 w-full px-5 py-16 sm:px-10 lg:px-16">

                        <div className="max-w-full sm:max-w-2xl lg:max-w-[58%]">

                            {/* TOP BADGE */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-[11px] sm:text-sm font-medium mb-6"
                            >

                                <ShieldCheck
                                    size={14}
                                    className="text-[#6CFF8F]"
                                />

                                <span className="tracking-wide uppercase">
                                    Deoria ki Trusted Pharmacy
                                </span>

                            </motion.div>

                            {/* HEADING */}
                            <h1 className="text-[34px] sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.02] tracking-tight text-white">

                                Fast & Trusted

                                <span className="block text-[#6CFF8F] mt-1">
                                    Medicine Delivery
                                </span>

                                <span className="text-xl sm:text-3xl lg:text-5xl font-bold opacity-90">
                                    Deoria Me
                                </span>

                            </h1>

                            {/* DESCRIPTION */}
                            <p className="mt-5 text-sm sm:text-lg lg:text-xl leading-7 sm:leading-8 text-gray-200 max-w-xl">

                                Ab ghar baithe genuine medicines aur healthcare products
                                order kariye. MedicoBharat Deoria me fast aur trusted
                                medicine delivery provide karta hai.

                            </p>

                            {/* FEATURE STRIP */}
                            <div className="flex flex-wrap gap-2 sm:gap-3 mt-7">

                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3 sm:px-4 py-2.5 rounded-xl transition-colors hover:bg-white/20">

                                    <ShieldCheck
                                        className="text-[#6CFF8F]"
                                        size={18}
                                    />

                                    <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                                        Genuine Medicines
                                    </span>

                                </div>

                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3 sm:px-4 py-2.5 rounded-xl transition-colors hover:bg-white/20">

                                    <Truck
                                        className="text-[#6CFF8F]"
                                        size={18}
                                    />

                                    <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                                        Fast Delivery
                                    </span>

                                </div>

                            </div>

                            {/* CTA BUTTONS */}
                            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4 mt-8">

                                <button className="group relative overflow-hidden bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 sm:px-8 py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">

                                    Medicines Order Kare

                                    <ArrowRight
                                        size={20}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />

                                </button>

                                <a
                                    href="tel:+919311587730"
                                    className="group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-6 sm:px-8 py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 shadow-lg"
                                >

                                    <PhoneCall
                                        size={20}
                                        className="text-white group-hover:rotate-12 transition-transform duration-300"
                                    />

                                    <span>
                                        Call Now
                                    </span>

                                </a>

                            </div>

                            {/* TRUST USERS */}
                            <div className="mt-7 flex items-center gap-3 text-white/80 flex-wrap">

                                {/* USER IMAGES */}
                                <div className="flex -space-x-3">

                                    <img
                                        src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=crop"
                                        alt="Village Indian customer"
                                        className="w-9 h-9 rounded-full border-2 border-white object-cover"
                                    />

                                    <img
                                        src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=200&auto=format&fit=crop"
                                        alt="Village Indian customer"
                                        className="w-9 h-9 rounded-full border-2 border-white object-cover"
                                    />

                                    <img
                                        src="https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=200&auto=format&fit=crop"
                                        alt="Village Indian customer"
                                        className="w-9 h-9 rounded-full border-2 border-white object-cover"
                                    />

                                    <img
                                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
                                        alt="Village Indian customer"
                                        className="w-9 h-9 rounded-full border-2 border-white object-cover"
                                    />

                                </div>

                                {/* TEXT */}
                                <p className="text-xs sm:text-sm font-medium">

                                    Deoria ke{" "}

                                    <span className="text-white font-bold">
                                        2,000+
                                    </span>

                                    {" "}logo ne MedicoBharat join kiya hai

                                </p>

                            </div>

                        </div>

                    </div>

                </motion.div>

            </div>

        </section>
    );
}