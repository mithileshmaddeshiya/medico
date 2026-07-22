import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

// Medicine section layout — wraps /medicine-delivery/[city].
// Swap <Navbar /> for a dedicated Medicine Header here when one exists.
export default function MedicineLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
