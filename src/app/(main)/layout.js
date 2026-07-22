import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

// Layout for the common pages (home, about, contact, privacy, terms, blogs).
// Renders the shared Header + Footer. The root layout owns <html>/<body>.
export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
