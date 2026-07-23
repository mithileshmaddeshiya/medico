import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getLabCities } from "@/lib/labCities";

// Layout for the common pages (home, about, contact, privacy, terms, blogs).
// Renders the shared Header + Footer. The root layout owns <html>/<body>.
//
// The lab cities are fetched here so the header and footer can link into the
// /lab-test section. Until this existed, nothing on the main site linked to it
// at all — the pages were reachable only through the sitemap, which is why they
// were being crawled rarely and ranking for nothing.
export default async function MainLayout({ children }) {
  const labCities = await getLabCities();

  return (
    <>
      <Navbar labCities={labCities} />
      {children}
      <Footer labCities={labCities} />
    </>
  );
}
