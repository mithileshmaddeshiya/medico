import LabFooter from "@/components/lab/LabFooter";
import { getDefaultLabCity, getLabCity } from "@/lib/labCities";
import { getShellData } from "@/lib/shell";

// The footer needs the city, and only this segment knows it — so the footer is
// rendered here rather than in the (lab) group layout, which has no params.
//
// This layout also wraps the 404, which is why an unknown slug still has to
// resolve to *some* city: the page below has already called notFound(), and a
// footer that throws would replace that 404 with a 500.
export default async function LabCityLayout({ children, params }) {
  const { city } = await params;

  const [{ labCities, guides }, cityData] = await Promise.all([
    getShellData(),
    getLabCity(city).then((found) => found ?? getDefaultLabCity()),
  ]);

  return (
    <>
      {children}
      {/* The footer filters this city out of `labCities` itself — see
          LabFooter. It no longer takes a medicine-city list: that section is
          retired and its URLs are redirected in next.config.mjs. */}
      <LabFooter city={cityData} labCities={labCities} guides={guides} />
    </>
  );
}
