import Link from "next/link";
import { ArrowRight, TestTube } from "lucide-react";

/**
 * A slim band on the homepage pointing at the lab-test section.
 *
 * The header and footer already link there, but a link inside the body of the
 * site's highest-authority page carries far more weight — both for a visitor
 * who never opens the menu and for the crawler deciding how important
 * /lab-test is.
 *
 * Deliberately one line tall: it sits between the hero and the city slider and
 * must not push either of them down the page.
 */
export default function LabTestPromo({ city }) {
  if (!city) return null;

  return (
    <section aria-label="Lab tests at home" className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-green-100 bg-green-50/60 px-4 py-3.5 text-center sm:flex-row sm:justify-between sm:gap-5 sm:text-left">

          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-green-600 ring-1 ring-green-200">
              <TestTube className="h-4.5 w-4.5" strokeWidth={2.1} />
            </span>

            <p className="text-[13.5px] sm:text-[14.5px] font-semibold leading-snug text-gray-900">
              Lab test bhi karwana hai?{" "}
              <span className="font-normal text-gray-600">
                {city.name} mein free home sample collection.
              </span>
            </p>
          </div>

          <Link
            href={`/lab-test/${city.slug}`}
            className="group inline-flex h-10 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-5 text-[13px] font-bold text-white transition hover:bg-green-700 active:scale-[0.98] sm:w-auto"
          >
            Book a Lab Test
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2.4}
            />
          </Link>

        </div>
      </div>
    </section>
  );
}
