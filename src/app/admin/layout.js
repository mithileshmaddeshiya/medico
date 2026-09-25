import Link from "next/link";
import { Toaster } from "react-hot-toast";
import {
  BarChart3,
  ExternalLink,
  FileHeart,
  FileText,
  Flag,
  History,
  ImageIcon,
  LayoutDashboard,
  Link2,
  LogOut,
  MapPin,
  Receipt,
  Search,
  Settings,
  ShoppingCart,
  TestTube2,
  Users,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";

import { signOutAction } from "./actions";
import { can } from "@/lib/admin/auth";
import { getUser } from "@/lib/admin/guard";

/**
 * The panel's shell.
 *
 * ── IT IS NOINDEX, BELT AND BRACES ───────────────────────────────────────
 * Declared here in `metadata` AND as an `x-robots-tag` header in src/proxy.js.
 * Two mechanisms because they fail differently: the meta tag is lost if a
 * screen ever renders outside this layout, and the header is lost if the
 * proxy's matcher is edited. An admin URL in Google's index is an invitation,
 * and on a site holding patients' names, phone numbers and home addresses it
 * is considerably worse than that.
 *
 * ── THE LAYOUT DOES NOT AUTHENTICATE ANYTHING ────────────────────────────
 * It reads the user to draw the sidebar and hides links a role cannot use.
 * That is presentation, not security: hiding a link does not close a route,
 * and a layout's check does not run for a Server Action at all. Every page
 * calls requireUser() and every action calls actionUser(). If you add a screen
 * here, it does its own check — there is no inherited protection to rely on.
 *
 * The login page lives at /admin/login and renders its own chrome, because it
 * is the one route under /admin with no user to draw a sidebar for.
 */
export const metadata = {
  title: { default: "Admin", template: "%s · MedicoBharat admin" },
  robots: { index: false, follow: false, nocache: true },
};

const SECTIONS = [
  {
    title: "Work",
    items: [
      { href: "/admin", label: "Dashboard", Icon: BarChart3, exact: true },
      // The operations CRM — bookings, collections, lab partners, payments.
      { href: "/crm", label: "Operations CRM", Icon: LayoutDashboard },
      { href: "/admin/leads", label: "Leads", Icon: Flag },
      { href: "/admin/orders", label: "Orders", Icon: Receipt },
      { href: "/admin/carts", label: "Carts", Icon: ShoppingCart },
      { href: "/lab-report", label: "Lab report", Icon: FileHeart, role: "editor" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/blogs", label: "Articles", Icon: FileText },
      { href: "/admin/tests", label: "Tests & prices", Icon: TestTube2 },
      { href: "/admin/cities", label: "City pages", Icon: MapPin },
      { href: "/admin/media", label: "Images", Icon: ImageIcon },
    ],
  },
  {
    title: "Search",
    items: [
      { href: "/admin/seo", label: "SEO", Icon: Search },
      { href: "/admin/seo/redirects", label: "Redirects", Icon: Link2 },
    ],
  },
  {
    title: "Admin",
    items: [
      { href: "/admin/users", label: "People", Icon: Users, role: "owner" },
      { href: "/admin/audit", label: "History", Icon: History },
      { href: "/admin/settings", label: "Settings", Icon: Settings, role: "owner" },
    ],
  },
];

export default async function AdminLayout({ children }) {
  const user = await getUser();

  // The sign-in page renders inside this layout too, and it has no user. It
  // draws its own full-screen chrome, so the shell simply gets out of the way.
  if (!user) return <>{children}</>;

  // The sidebar's contents, rendered here on the server (role-filtered links,
  // the signed-in user, the sign-out Server Action). AdminShell owns only
  // whether it is open — see src/components/admin/AdminShell.jsx.
  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();

  // The sidebar's contents, rendered here on the server (role-filtered links,
  // the signed-in user, the sign-out Server Action). AdminShell owns only
  // whether it is expanded — see src/components/admin/AdminShell.jsx. The
  // sb-* classes are what the collapsed icon rail hides or re-centres; the
  // rules are in the "Admin sidebar" block of src/app/globals.css.
  const sidebar = (
    <>
      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        {SECTIONS.map((section) => {
          const items = section.items.filter((item) => !item.role || can(user, item.role));
          if (!items.length) return null;

          return (
            <div key={section.title} className="sb-section mb-5">
              <p className="sb-label sb-heading px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em]">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {items.map(({ href, label, Icon, exact }) => (
                  <li key={href}>
                    {/* Colour, hover and the current-page accent all live in the
                        "Admin sidebar" block of globals.css — these links are
                        server-rendered, so the rail restyles them by selector. */}
                    <Link
                      href={href}
                      title={label}
                      data-exact={exact ? "" : undefined}
                      className="sb-link flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors"
                    >
                      <Icon className="sb-icon h-4 w-4 shrink-0 transition-colors" strokeWidth={2.2} />
                      <span className="sb-label truncate">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="sb-footer border-t px-3 py-3">
        <div className="sb-user flex items-center gap-2.5 px-1" title={`${user.name || user.email} · ${user.role}`}>
          <span className="sb-avatar flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold">
            {initial}
          </span>
          <span className="sb-label min-w-0">
            <span className="sb-name block truncate text-[12.5px] font-semibold">
              {user.name || user.email}
            </span>
            <span className="sb-role block text-[11.5px] capitalize">{user.role}</span>
          </span>
        </div>

        <div className="sb-actions mt-2.5 flex items-center gap-1">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            title="View site"
            className="sb-link sb-site flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-semibold transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" strokeWidth={2.4} />
            <span className="sb-label">View site</span>
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              title="Sign out"
              className="sb-link flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-semibold transition-colors"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" strokeWidth={2.4} />
              <span className="sb-label">Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* One sidebar for every screen size: on a desktop it collapses to an
          icon rail and expands again; on a phone it is a slide-in drawer. */}
      <AdminShell sidebar={sidebar}>
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>
      </AdminShell>

      {/* The panel's own toast host. The public site mounts one in the root
          layout, but /admin renders inside that layout too — so this would be
          a second one. It is scoped bottom-right instead of top-centre so the
          two can never overlap if both ever mount. */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#0f172a",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "12px",
            padding: "10px 14px",
            maxWidth: "24rem",
            boxShadow:
              "0 0 0 1px rgba(15,23,42,0.08), 0 12px 30px -12px rgba(15,23,42,0.28)",
          },
          success: { iconTheme: { primary: "#059669", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </div>
  );
}
