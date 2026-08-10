import LabNavbar from "@/components/lab/LabNavbar";

// Lab Test section layout — wraps /lab-test/[city].
//
// Header only. The footer is rendered one level deeper, in [city]/layout.js,
// because it needs the city from the route params to print that town's
// localities and contact block.
export default function LabLayout({ children }) {
  return (
    <>
      <LabNavbar />
      <main className="flex-1">{children}</main>
    </>
  );
}
