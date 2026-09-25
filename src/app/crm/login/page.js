import Image from "next/image";
import { redirect } from "next/navigation";
import { Activity, FlaskConical, ShieldCheck, Truck } from "lucide-react";

import { getUser, safeNext } from "@/lib/admin/guard";

import CrmLoginForm from "./CrmLoginForm";

export const metadata = { title: "Sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/**
 * Sign-in for staff and lab partners. Same accounts, same rate-limited action
 * and the same session as /admin/login (src/app/admin/login/actions.js) —
 * only the destination differs.
 */
export default async function CrmLogin({ searchParams }) {
  const { next, expired, changed } = await searchParams;
  const target = safeNext(typeof next === "string" && next.startsWith("/crm") ? next : "/crm");
  if (await getUser()) redirect(target);

  return (
    <div className="flex min-h-dvh bg-white">
      <aside className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-[#0b1f44] p-12 text-white lg:flex">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative">
          <span className="inline-flex rounded-xl bg-white px-3 py-2">
            <Image src="/navbar/lablogo.webp" alt="MedicoBharat" width={640} height={180} priority className="h-8 w-auto" />
          </span>
        </div>
        <div className="relative max-w-md">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-blue-300">Operations command center</p>
          <h1 className="mt-3 text-[34px] font-semibold leading-tight tracking-tight">
            Every booking, sample, report and rupee — in one place.
          </h1>
          <ul className="mt-8 space-y-3 text-[14px] text-blue-100/90">
            {[
              [Activity, "Live workflow from booking to report delivery"],
              [Truck, "Home collections, assigned and tracked"],
              [FlaskConical, "Lab partner orders, reports and settlements"],
              [ShieldCheck, "Role-based access, every change audited"],
            ].map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[12px] text-blue-200/70">Authorised staff and lab partners only.</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Image src="/navbar/lablogo.webp" alt="MedicoBharat" width={640} height={180} priority className="h-9 w-auto" />
          </div>
          <h2 className="text-[24px] font-semibold tracking-tight text-slate-900">Sign in to the CRM</h2>
          <p className="mt-1.5 text-[14px] text-slate-500">Staff and lab partners use the account an owner created for them.</p>

          {expired && (
            <p role="status" className="mt-5 rounded-xl bg-amber-50 px-3.5 py-2.5 text-[13px] text-amber-900 ring-1 ring-inset ring-amber-600/20">
              Your session ended. Sign in again to carry on where you were.
            </p>
          )}
          {changed && (
            <p role="status" className="mt-5 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-[13px] text-emerald-900 ring-1 ring-inset ring-emerald-600/20">
              Password changed. Every device was signed out — sign in with the new one.
            </p>
          )}

          <div className="mt-7">
            <CrmLoginForm next={target} />
          </div>
        </div>
      </main>
    </div>
  );
}
