import LabFooter from "@/components/lab/LabFooter";
import LabNavbar from "@/components/lab/LabNavbar";
import { getShellData } from "@/lib/shell";

// Layout for the pages that are not about one city — home, about, contact,
// privacy, terms, and the guides. The root layout owns <html>/<body>.
//
// It used to mount `common/Navbar` and `common/Footer`, a second set of chrome
// built around medicine delivery. Those are gone: the site is a lab-test site,
// and it now has ONE header and ONE footer — the same ones the city pages use.
// A visitor moving from the home page into /lab-test/varanasi no longer watches
// the whole shell change, and the site has one link graph instead of two.
//
// The city list and the guides are read here so the footer can link to them
// from every page — see src/lib/shell.js. The header carries no links.
export default async function MainLayout({ children }) {
  const { labCities, guides } = await getShellData();

  return (
    <>
      <LabNavbar />
      <main className="flex-1">{children}</main>
      <LabFooter labCities={labCities} guides={guides} />
    </>
  );
}
