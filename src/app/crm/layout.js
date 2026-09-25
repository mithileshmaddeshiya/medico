import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import Shell from "@/components/crm/Shell";
import { getCrmUser } from "@/lib/crm/guard";
import { initials } from "@/lib/crm/format";
import { bottomNavFor, navFor, quickActionsFor } from "@/lib/crm/nav";
import { ROLE_LABEL } from "@/lib/crm/permissions";

import { crmSignOut } from "./actions";

/**
 * The MedicoBharat operations CRM.
 *
 * A separate, protected application beside the public site and the website
 * admin (/admin, which keeps content and SEO). Same accounts and session as
 * /admin; its own sign-in page at /crm/login for staff and lab partners.
 *
 * ── THE LAYOUT DOES NOT AUTHENTICATE ─────────────────────────────────────
 * It reads the user to draw the navigation. Every page calls requirePerm()
 * and every action crmAction() — a layout's check does not run for a Server
 * Action, so there is nothing to inherit. With no user (the sign-in page) it
 * renders the page bare.
 *
 * Noindex twice, like /admin: here and as an x-robots-tag in src/proxy.js.
 */
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-crm" });

export const metadata = {
  title: { default: "MedicoBharat CRM", template: "%s · MedicoBharat CRM" },
  robots: { index: false, follow: false, nocache: true },
  // Installable on a phone as its own app — see ./manifest.webmanifest/route.js.
  manifest: "/crm/manifest.webmanifest",
  appleWebApp: { capable: true, title: "MB CRM", statusBarStyle: "default" },
  icons: { apple: { url: "/brand/icon-192.png", sizes: "192x192" } },
};

export const viewport = { themeColor: "#ffffff" };

export default async function CrmLayout({ children }) {
  const user = await getCrmUser();

  const body = !user ? (
    children
  ) : (
    <Shell
      user={{
        name: user.name || user.email,
        initials: initials(user.name || user.email),
        roleLabel: ROLE_LABEL[user.role] ?? user.role,
        isPartner: user.isPartner,
      }}
      nav={navFor(user)}
      bottomNav={bottomNavFor(user)}
      quickActions={quickActionsFor(user)}
      signOut={crmSignOut}
    >
      {children}
    </Shell>
  );

  return (
    <div className={`${inter.className} ${inter.variable} [font-feature-settings:'cv11','ss01']`}>
      {body}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0f172a",
            color: "#fff",
            fontSize: "13.5px",
            fontWeight: 500,
            borderRadius: "12px",
            padding: "10px 14px",
            maxWidth: "26rem",
          },
          success: { iconTheme: { primary: "#34d399", secondary: "#0f172a" } },
          error: { iconTheme: { primary: "#fb7185", secondary: "#0f172a" } },
        }}
      />
    </div>
  );
}
