import LabFooter from "@/components/lab/LabFooter";
import { getDefaultLabCity, getLabCities, getLabCity } from "@/lib/labCities";

// The footer needs the city, and only this segment knows it — so the footer is
// rendered here rather than in the (lab) group layout, which has no params.
//
// This layout also wraps the 404, which is why an unknown slug still has to
// resolve to *some* city: the page below has already called notFound(), and a
// footer that throws would replace that 404 with a 500.
export default async function LabCityLayout({ children, params }) {
  const { city } = await params;

  const cities = await getLabCities();
  const cityData = (await getLabCity(city)) ?? (await getDefaultLabCity());

  // Cross-links to the other live cities — computed here because the footer is
  // a shared component that must not reach into the data layer itself.
  const otherCities = cities.filter((c) => c.slug !== cityData.slug);

  return (
    <>
      {children}
      <LabFooter city={cityData} otherCities={otherCities} />
    </>
  );
}
