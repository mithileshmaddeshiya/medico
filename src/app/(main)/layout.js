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
// The city list is read here so the footer can link to every city from every
// page — see src/lib/shell.js. The header carries no links. The guide list used
// to be read here too, for a footer column that is gone: the guides are linked
// in-body now, from the home page's related-links block and from every city
// page's, with anchors that describe the article.
export default async function MainLayout({ children }) {
  const { labCities } = await getShellData();

  return (
    <>
      <LabNavbar />
      <main className="flex-1">{children}</main>
      <LabFooter labCities={labCities} />
    </>
  );
}
