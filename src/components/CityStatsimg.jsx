"use client";

export default function StatBanner() {
    return (
        <section className="w-full px-4 md:px-6">
            <div className="max-w-6xl mx-auto">

                {/* Image Container */}
                <div className="relative h-[250px] md:h-[300px] w-full rounded-2xl overflow-hidden shadow-md">

                    {/* Desktop Image */}
                    <img
                        src="/citybn/medicoimg.png"
                        alt="Medicine delivery stats in Deoria"
                        className="hidden md:block w-full h-full object-cover"
                    />

                    {/* Mobile Image */}
                    <img
                        src="/citybn/statsresponsive.png"
                        alt="Medicine delivery mobile banner"
                        className="block md:hidden w-full h-full object-cover"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent"></div>

                    {/* Desktop Text */}
                    <div className="hidden md:flex absolute inset-0 flex-col justify-center px-10 text-white">

                        <h1 className="text-3xl font-bold drop-shadow-lg">
                            Deoria mein 500+ <br /> logon ka trusted choice
                        </h1>

                        <p className="text-base mt-2 text-green-200 font-medium drop-shadow-md">
                            Fast Delivery • Genuine Medicines • Reliable Service
                        </p>

                        <div className="mt-4">
                            <a
                                href="https://wa.me/917303995446"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition duration-300"
                            >
                                Order Medicine Now
                            </a>
                        </div>

                    </div>

                    {/* Mobile Text */}
                    <div className="flex md:hidden absolute inset-0 flex-col justify-center p-5 text-white">

                        <h2 className="text-xl font-bold leading-snug drop-shadow-lg">
                            Medicine Delivery <br />
                            at Your Doorstep
                        </h2>

                        <p className="text-[12px] mt-2 text-green-100 font-medium">
                            24x7 Support • Fast Delivery
                        </p>

                        <div className="mt-3">
                            <a
                                href="https://wa.me/917303995446"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md transition duration-300"
                            >
                                Order Now
                            </a>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}