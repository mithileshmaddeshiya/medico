import Link from "next/link";
import { Toaster } from "react-hot-toast";
import {
  BarChart3,
  FileText,
  Flag,
  History,
  ImageIcon,
  Link2,
  MapPin,
  Receipt,
  Search,
  Settings,
  ShoppingCart,
  TestTube2,
  Users,
} from "lucide-react";

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
      { href: "/admin/leads", label: "Leads", Icon: Flag },
      { href: "/admin/orders", label: "Orders", Icon: Receipt },
      { href: "/admin/carts", label: "Carts", Icon: ShoppingCart },
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
          <div className="border-b border-slate-100 px-5 py-4">
            <Link href="/admin" className="block">
              <span className="text-[15px] font-extrabold tracking-tight text-slate-900">
                Medico<span className="text-emerald-600">Bharat</span>
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Admin
              </span>
            </Link>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
            {SECTIONS.map((section) => {
              const items = section.items.filter((item) => !item.role || can(user, item.role));
              if (!items.length) return null;

              return (
                <div key={section.title} className="mb-5">
                  <p className="px-2 pb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                    {section.title}
                  </p>
                  <ul className="space-y-0.5">
                    {items.map(({ href, label, Icon }) => (
                      <li key={href}>
                        <Link
                          href={href}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2.2} />
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>

          <div className="border-t border-slate-100 px-4 py-3">
            <p className="truncate text-[12.5px] font-semibold text-slate-800">
              {user.name || user.email}
            </p>
            <p className="text-[11.5px] capitalize text-slate-500">{user.role}</p>

            <div className="mt-2.5 flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="text-[12px] font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View site
              </Link>
              <span className="text-slate-300" aria-hidden>
                ·
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="text-[12px] font-semibold text-slate-500 hover:text-slate-800"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* The same navigation on a phone. A back office that only works on a
            desktop is one that does not get used when a lead comes in at 9pm,
            which is when most of them do. */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center gap-3 overflow-x-auto border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden">
            {SECTIONS.flatMap((section) =>
              section.items.filter((item) => !item.role || can(user, item.role))
            ).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold text-slate-600 hover:bg-slate-100"
              >
                {label}
              </Link>
            ))}
            <form action={signOutAction} className="ml-auto">
              <button type="submit" className="whitespace-nowrap px-2 text-[12.5px] font-semibold text-slate-500">
                Sign out
              </button>
            </form>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-6xl space-y-6">{children}</div>
          </main>
        </div>
      </div>

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
