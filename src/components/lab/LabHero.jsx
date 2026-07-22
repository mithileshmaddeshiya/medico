import Image from "next/image";
import LabLeadCard from "./LabLeadCard";

export default function LabHero() {
  return (
    <section className="bg-gradient-to-b from-emerald-50/70 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-19 sm:pt-24 pb-2 sm:pb-3">
        <div className="grid items-center gap-5 lg:gap-8 lg:grid-cols-12">

          {/* LEFT: image — 1672x941 (16:9); on phones it is slightly cropped to save height */}
          <div className="lg:col-span-8">
            <div className="relative w-full aspect-2/1 sm:aspect-video rounded-md lg:rounded-tr-none overflow-hidden">
              <Image
                src="/navheroimage/navheroo.webp"
                alt="Lab test at home"
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
            <LabLeadCard className="max-w-85 mx-auto lg:mr-0" />
          </div>

        </div>
      </div>
    </section>
  );
}
