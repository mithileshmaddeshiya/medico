// Kisi 'use client' ki zaroorat nahi hai, ise ab SSR banayein
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// `labCities` comes from the (main) layout, straight out of Firestore — so a
// new lab city starts being linked from every page on the site the moment it is
// added, with no code change.
export default function Footer({ data, labCities = [] }) {
  const city = data?.city || "Deoria";

  return (
    // ID top yahan add kiya hai taaki logo par click karne se page upar chala jaye bina JS ke
    <footer id="footer-section" className="bg-gray-50 border-t border-gray-200 mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* BRAND */}
        <div className="flex flex-col items-start">
          {/* Logo par click karne par smooth top behavior css se set ho jayega */}
          <Link href="#">
            <Image
              src="/navbar/navbg.webp"
              alt="MedicoBharat Logo"
              width={140}
              height={40}
              className="object-contain cursor-pointer mb-4"
            />
          </Link>
          <p className="text-[13px] text-gray-600 leading-7">
            MedicoBharat provides trusted online medicine delivery in {city} <br />
            with fast doorstep delivery, genuine medicines, and easy online
            ordering support.
          </p>
        </div>

        {/* SEO LINKS - Yeh ab Googlebot ko clear HTML mein dikhenge */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Nearby Cities
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/medicine-delivery/deoria" className="hover:text-green-600 transition">
                Medicine Delivery Deoria
              </Link>
            </li>
            <li>
              <Link href="/medicine-delivery/salempur" className="hover:text-green-600 transition">
                Medicine Delivery Salempur
              </Link>
            </li>
            <li>
              <Link href="/medicine-delivery/bhatni" className="hover:text-green-600 transition">
                Medicine Delivery Bhatni
              </Link>
            </li>
            <li>
              <Link href="/medicine-delivery/barhaj" className="hover:text-green-600 transition">
                Medicine Delivery Barhaj
              </Link>
            </li>
            <li>
              <Link href="/medicine-delivery/lar" className="hover:text-green-600 transition">
                Medicine Delivery Lar
              </Link>
            </li>
          </ul>
        </div>

        {/* LAB TESTS — the only inbound links the /lab-test section has. Every
            live city gets its own keyword-bearing link, sitewide. */}
        {labCities.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Lab Tests at Home
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {labCities.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/lab-test/${c.slug}`}
                    className="hover:text-green-600 transition"
                  >
                    Lab Test in {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* QUICK LINKS - Anchor Tags ko Next.js Link standard se replace kiya */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-green-600 transition">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-green-600 transition">About Us</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-green-600 transition">Contact</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-green-600 transition">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-green-600 transition">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Contact
          </h4>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-600 shrink-0" />
              <span>+91 989-123-3525</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-600 shrink-0" />
              <span className="break-all">medicobharat@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600 shrink-0" />
              <span>{city}, Uttar Pradesh</span>
            </div>
          </div>
        </div>

      </div>

      {/* LOCAL SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-5 text-center text-[12px] text-gray-500 leading-6">
        MedicoBharat offers fast online medicine delivery in {city},
        medicine home delivery services, healthcare products,
        prescription medicines, and trusted pharmacy support across
        Civil Lines, Station Road, Saket Nagar, Rudrapur Road,
        and nearby areas.
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500 px-4">
        © {new Date().getFullYear()} Medicobharat | Orders are fulfilled by licensed pharmacy partners | All rights reserved.
      </div>
    </footer>
  );
}