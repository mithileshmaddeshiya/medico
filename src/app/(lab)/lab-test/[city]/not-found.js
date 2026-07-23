import Link from "next/link";
import { MapPin } from "lucide-react";

import { getLabCities } from "@/lib/labCities";

/**
 * Shown when /lab-test/<slug> names a city we do not serve.
 *
 * It returns a real 404 rather than redirecting to Varanasi, and it links out
 * to every city we *do* serve — so the crawler drops the dead URL and keeps
 * the live ones, and a visitor who mistyped is one tap from the right page.
 */
export default async function LabCityNotFound() {
  const cities = await getLabCities();

  return (
    <section className="bg-gradient-to-b from-emerald-50/70 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16 text-center">

        <span className="mx-auto flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-linear-to-br from-emerald-600 to-teal-600 text-white ring-6 ring-white shadow-[0_10px_24px_-12px_rgba(5,150,105,0.9)]">
          <MapPin className="h-5.5 w-5.5 sm:h-6 sm:w-6" strokeWidth={2.2} />
        </span>

        <h1 className="mt-4 text-balance text-xl min-[400px]:text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900">
          We are not in this city yet
        </h1>
        <p className="mt-2 text-balance text-[13px] sm:text-[14.5px] leading-relaxed text-slate-500">
          Home sample collection is not live at this address. Here is where we
          do collect samples today.
        </p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {cities.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/lab-test/${city.slug}`}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 text-[13px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(5,150,105,0.9)] hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200"
              >
                Lab Test in {city.name}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[12.5px] text-slate-500">
          <Link href="/" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Back to MedicoBharat home
          </Link>
        </p>

      </div>
    </section>
  );
}
