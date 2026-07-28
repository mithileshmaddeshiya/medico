import Image from "next/image";
import LabLeadCard from "./LabLeadCard";

// `hero` and `cityOptions` come from the Firestore-backed page — see
// defaultHero in src/data/lab/defaults.js for the shape and its defaults.
export default function LabHero({ hero, cityOptions }) {
  return (
    <section className="bg-linear-to-b from-emerald-50/70 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-19 sm:pt-24 pb-2 sm:pb-3">

        {/* The page's only h1 — every other lab section starts at h2. Kept out of
            the visual design (the hero is image + form), but present for search
            engines and screen readers. */}
        <h1 className="sr-only">{hero?.h1}</h1>

        <div className="grid items-center gap-5 lg:gap-8 lg:grid-cols-12">

          {/* LEFT: image — 1672x941 (16:9); on phones it is slightly cropped to save height */}
          <div className="lg:col-span-8">
            <div className="relative w-full aspect-2/1 sm:aspect-video rounded-md lg:rounded-tr-none overflow-hidden">
              <Image
                src={hero?.image}
                alt={hero?.imageAlt ?? ""}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* RIGHT: call back form — `#book` is the target every CTA scrolls to;
              scroll-mt clears the fixed navbar so the form heading is not hidden. */}
          <div id="book" className="lg:col-span-4 scroll-mt-20 sm:scroll-mt-24">
            <LabLeadCard
              title={hero?.formTitle}
              cityOptions={cityOptions}
              className="max-w-85 mx-auto lg:mr-0"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
