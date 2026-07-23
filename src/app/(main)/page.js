import HomeDataProvider from "@/components/medicine/HomeDataProvider";
import { getDefaultLabCity } from "@/lib/labCities";

// Server component: it reads the flagship lab city from Firestore and hands it
// down, so the homepage can link into /lab-test without HomeDataProvider (which
// is "use client") needing to fetch anything itself.
export default async function Page() {
  const labCity = await getDefaultLabCity();

  return (
    <div>
      <HomeDataProvider labCity={{ slug: labCity.slug, name: labCity.name }} />
    </div>
  );
}
