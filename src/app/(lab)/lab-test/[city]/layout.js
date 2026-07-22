import LabFooter from "@/components/lab/LabFooter";
import { DEFAULT_CITY, getCity } from "@/data/labCities";

// The footer needs the city, and only this segment knows it — so the footer is
// rendered here rather than in the (lab) group layout, which has no params.
export default async function LabCityLayout({ children, params }) {
  const { city } = await params;
  const cityData = getCity(decodeURIComponent(city)) ?? DEFAULT_CITY;

  return (
    <>
      {children}
      <LabFooter city={cityData} />
    </>
  );
}
