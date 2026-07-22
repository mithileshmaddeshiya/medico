import LabContent from "@/components/lab/LabContent";
import LabCta from "@/components/lab/LabCta";
import LabFaq from "@/components/lab/LabFaq";
import LabHero from "@/components/lab/LabHero";
import LabServices from "@/components/lab/LabServices";
import LabTrustStrip from "@/components/lab/LabTrustStrip";
import { DEFAULT_CITY, LAB_CITIES, getCity } from "@/data/labCities";
import { redirect } from "next/navigation";

// One page per city in LAB_CITIES; anything else lands on the default city
// instead of rendering a place we do not serve yet.
export const generateStaticParams = () => LAB_CITIES.map(({ slug }) => ({ city: slug }));

const page = async ({ params }) => {
  const { city } = await params;

  const cityData = getCity(decodeURIComponent(city));
  if (!cityData) redirect(`/lab-test/${DEFAULT_CITY.slug}`);

  const cityName = cityData.name;

  return (
    <>
      {/* Pass an image once it is added to /public, e.g. image="/labhero/collection.webp" */}
      <LabHero />

      {/* Phone: tests first, promises after them. Desktop (lg+): promises sit
          between the hero and the tests. Flex order keeps a single instance in
          the DOM instead of duplicating the strip per breakpoint. */}
      <div className="flex flex-col">
        <div className="order-2 lg:order-1">
          <LabTrustStrip />
        </div>
        <div className="order-1 lg:order-2">
          <LabServices city={cityName} />
        </div>
      </div>

      {/* Reviews (LabReviews) belong here — between the tests and the FAQ —
          whenever the real Google reviews are ready to be pasted in. */}

      <LabFaq city={cityName} />

      <LabCta city={cityName} />

      {/* SEO copy — replace SECTIONS inside LabContent (or pass `data`) with the
          real long-form content when it is written. */}
      <LabContent city={cityName} />
    </>
  );
};

export default page;
