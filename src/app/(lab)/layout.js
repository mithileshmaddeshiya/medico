import LabNavbar from "@/components/lab/LabNavbar";
import { getShellData } from "@/lib/shell";

// Lab Test section layout — wraps /lab-test/[city].
//
// Header only. The footer is rendered one level deeper, in [city]/layout.js,
// because it needs the city from the route params to print that town's
// localities and contact block.
export default async function LabLayout({ children }) {
  const { labCities, guides } = await getShellData();

  return (
    <>
      <LabNavbar labCities={labCities} guides={guides} />
      <main className="flex-1">{children}</main>
    </>
  );
}
