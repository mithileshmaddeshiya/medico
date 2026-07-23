import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getLabCities } from "@/lib/labCities";

// Medicine section layout — wraps /medicine-delivery/[city].
// Swap <Navbar /> for a dedicated Medicine Header here when one exists.
//
// Lab cities are fetched here for the same reason as in the (main) layout: the
// header and footer are the only places linking into /lab-test, and these five
// city pages are the site's strongest internal-link sources.
export default async function MedicineLayout({ children }) {
  const labCities = await getLabCities();

  return (
    <>
      <Navbar labCities={labCities} />
      {children}
      <Footer labCities={labCities} />
    </>
  );
}
