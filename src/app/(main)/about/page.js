
export const metadata = {
        title:
            "About MedicoBharat | Trusted Online Medicine Delivery Platform",

        description:
            "Learn about MedicoBharat, a trusted online medicine delivery and healthcare support platform focused on providing genuine medicines, healthcare products, and convenient customer support across India.",

        keywords: [
            "MedicoBharat",
            "online medicine delivery",
            "medicine delivery platform",
            "healthcare support",
            "online pharmacy India",
            "genuine medicines",
            "medicine ordering platform",
        ],

        alternates: {
            canonical: "https://medicobharat.com/about",
        },

        authors: [{ name: "MedicoBharat" }],

        publisher: "MedicoBharat",

        robots: {
            index: true,
            follow: true,
        },

        openGraph: {
            title:
                "About MedicoBharat | Trusted Online Medicine Delivery Platform",

            description:
                "MedicoBharat is a trusted healthcare and online medicine delivery platform focused on convenient and reliable medicine support.",

            url: "https://medicobharat.com/about",

            siteName: "MedicoBharat",

            type: "website",
        },
    };

export default function AboutMedicoBharat() {


    return (
        <section className="w-full bg-white py-10 md:py-22 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">

                {/* HERO */}
                <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">

                    <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-1 text-xs md:text-sm font-semibold text-green-700 mb-4">
                        Trusted Healthcare Platform
                    </span>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                        About <span className="text-green-600">MedicoBharat</span>
                    </h1>

                    <p className="mt-4 text-sm sm:text-base md:text-lg leading-7 text-gray-600">
                        MedicoBharat is a trusted online medicine delivery and healthcare
                        support platform focused on making medicines and healthcare
                        essentials accessible, reliable, and convenient across India.
                    </p>
                </div>

                {/* INTRO */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center mb-10 md:mb-14">

                    {/* LEFT */}
                    <div className="space-y-4">

                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                            Simplifying Healthcare Access
                        </h2>

                        <p className="text-gray-600 leading-7 text-sm md:text-base">
                            At MedicoBharat, we understand the importance of timely access to
                            medicines and healthcare support. Our mission is to make medicine
                            ordering simpler, faster, and more convenient for customers.
                        </p>

                        <p className="text-gray-600 leading-7 text-sm md:text-base">
                            We are committed to helping people access genuine medicines,
                            wellness products, and healthcare assistance with a smooth and
                            customer-friendly experience.
                        </p>

                    </div>

                    {/* RIGHT */}
                    <div className="rounded-3xl bg-gradient-to-br from-green-50 to-green-100 p-5 md:p-7 shadow-sm">

                        <div className="grid grid-cols-2 gap-4">

                            {[
                                {
                                    title: "24/7",
                                    subtitle: "Customer Support",
                                },
                                {
                                    title: "Fast",
                                    subtitle: "Medicine Assistance",
                                },
                                {
                                    title: "Genuine",
                                    subtitle: "Healthcare Products",
                                },
                                {
                                    title: "Easy",
                                    subtitle: "Ordering Process",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl bg-white p-4 md:p-5 text-center shadow-sm"
                                >
                                    <h3 className="text-2xl md:text-3xl font-black text-green-600">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-xs md:text-sm text-gray-600 leading-5">
                                        {item.subtitle}
                                    </p>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>

                {/* SERVICES */}
                <div className="mb-10 md:mb-14">

                    <div className="text-center mb-8">

                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Our Services
                        </h2>

                        <p className="mt-3 text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-7">
                            MedicoBharat provides convenient healthcare and medicine support
                            services designed for a seamless customer experience.
                        </p>

                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">

                        {[
                            "Online Medicine Ordering",
                            "Prescription Medicine Support",
                            "Healthcare & Wellness Products",
                            "Easy Prescription Upload",
                            "Customer Assistance",
                            "Fast Delivery Support",
                        ].map((service, index) => (
                            <div
                                key={index}
                                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                            >

                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                                    <span className="text-lg font-bold text-green-600">✓</span>
                                </div>

                                <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-6">
                                    {service}
                                </h3>

                            </div>
                        ))}

                    </div>
                </div>

                {/* VISION & MISSION */}
                <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-10 md:mb-14">

                    <div className="rounded-3xl bg-gray-50 p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                            Our Vision
                        </h2>

                        <p className="text-sm md:text-base leading-7 text-gray-600">
                            Our vision is to become one of India’s most trusted digital
                            healthcare and medicine support platforms by improving healthcare
                            accessibility and customer experience.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-green-50 p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                            Our Mission
                        </h2>

                        <ul className="space-y-3 text-sm md:text-base text-gray-700 leading-7">
                            <li>• Simplify access to medicines and healthcare support</li>
                            <li>• Deliver a seamless online healthcare experience</li>
                            <li>• Build trust through reliable customer service</li>
                            <li>• Improve healthcare accessibility across India</li>
                        </ul>
                    </div>

                </div>

                {/* CTA */}
                <div className="rounded-3xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-8 md:px-10 md:py-10 text-center text-white">

                    <h2 className="text-2xl md:text-4xl font-black leading-tight mb-4">
                        Trusted Healthcare Support For Every Family
                    </h2>

                    <p className="max-w-3xl mx-auto text-sm md:text-lg leading-7 text-green-50">
                        MedicoBharat is committed to delivering a reliable, convenient,
                        and customer-focused healthcare experience with genuine medicines
                        and responsive support.
                    </p>

                </div>

            </div>
        </section>
    );
}