"use client";

export default function StatBanner() {
    return (
        <section className="w-full px-4 md:px-6">
            <div className="max-w-6xl mx-auto">

                {/* Image Container */}
                <div className="relative h-[250px] w-full rounded-2xl overflow-hidden shadow-md">

                    {/* Background Image */}
                    <img
                        src="/citybn/medicoimg.png" // 👈 apni image path yaha daalo
                        alt="Medicine delivery stats in Deoria"
                        className="w-full h-full object-cover"
                    />


                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent rounded-xl"></div>

                    {/* Text Content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 text-white">

                        <h2 className="text-xl md:text-3xl font-bold drop-shadow-lg">
                            Deoria mein 500+ <br />logon ka trusted choice
                        </h2>

                        <p className="text-sm md:text-base mt-2 text-green-200 font-medium drop-shadow-md">
                            Fast Delivery • Genuine Medicines • Reliable Service
                        </p>

                        {/* CTA Button */}
                        <div className="mt-4">
                            <button className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base font-semibold px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition duration-300">
                                Order Medicine Now
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}