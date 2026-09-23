import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireRole } from "@/lib/admin/guard";

import LabReportGenerator from "./LabReportGenerator";

/**
 * /lab-report — the staff tool that puts the MedicoBharat cover page in front
 * of a partner lab's original report.
 *
 * It lives outside /admin because it is a URL people are given and bookmark,
 * but it is every bit as closed as the panel: src/proxy.js sends a visitor
 * without a session to the sign-in page, this page checks the session against
 * the database, and the template route and the audit action each check again.
 *
 * Noindex twice over, as for the panel — here in metadata and as an
 * x-robots-tag header from the proxy.
 */
export const metadata = {
  title: "Lab report generator",
  robots: { index: false, follow: false, nocache: true },
};

export default async function LabReportPage() {
  const user = await requireRole("editor", "/lab-report");

  // YYYY-MM-DD in India, so the date field defaults to today's date there
  // rather than the server's (UTC) date for the first 5½ hours of the day.
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-[#0B2C6B]">MEDICO</span>
              <span className="text-emerald-600">BHARAT</span>
            </span>
            <span className="border-l border-slate-200 pl-3 text-sm font-semibold text-slate-500">
              Lab report generator
            </span>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <span className="hidden text-slate-500 sm:inline">{user.name || user.email}</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-emerald-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
              Admin panel
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <LabReportGenerator today={today} />
      </main>
    </div>
  );
}
