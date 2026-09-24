import Image from "next/image";
import { redirect } from "next/navigation";
import { FileText, Receipt, ShieldCheck, TestTube2, Users } from "lucide-react";

import { getUser, safeNext } from "@/lib/admin/guard";

import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in", robots: { index: false, follow: false } };

/** Nothing here may be cached — it reads the session cookie. */
export const dynamic = "force-dynamic";

const FEATURES = [
  { Icon: Users, label: "Leads & patients" },
  { Icon: Receipt, label: "Orders & carts" },
  { Icon: TestTube2, label: "Tests & packages" },
  { Icon: FileText, label: "Blogs & SEO" },
];

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;

  // Already signed in: go where they were headed rather than showing a form
  // they do not need.
  if (await getUser()) redirect(safeNext(next));

  return (
    <div className="flex min-h-screen bg-white">
      {/*
        Brand panel — desktop only. On a phone the form is the whole screen;
        a decorative half-page would push it below the fold.
      */}
      <aside className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-700 to-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_30rem_at_0%_0%,rgba(255,255,255,0.14),transparent_60%),radial-gradient(30rem_24rem_at_100%_100%,rgba(16,185,129,0.35),transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:40px_40px]"
        />

        <div className="relative inline-flex w-fit rounded-2xl bg-white px-4 py-3 shadow-xl shadow-black/10">
          <Image
            src="/navbar/lablogo.webp"
            alt="MedicoBharat"
            width={168}
            height={48}
            priority
            className="h-auto w-40"
          />
        </div>

        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-emerald-50 ring-1 ring-white/20 backdrop-blur">
            <ShieldCheck className="size-3.5" aria-hidden />
            Admin panel
          </span>
          <h2 className="mt-5 text-4xl leading-tight font-extrabold tracking-tight text-white xl:text-[2.75rem]">
            Everything you run,
            <br />
            in one place.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-emerald-50/80">
            Manage bookings, tests, cities and content for MedicoBharat from a single dashboard.
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-3">
            {FEATURES.map(({ Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 rounded-xl bg-white/[0.07] px-3.5 py-3 text-[13px] font-medium text-white ring-1 ring-white/10"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="size-4" aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[12px] text-emerald-50/60">
          © {new Date().getFullYear()} MedicoBharat
        </p>
      </aside>

      {/* Form side */}
      <main className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_30rem_at_50%_-10%,rgba(16,185,129,0.10),transparent_70%)] lg:hidden"
        />

        <div className="relative w-full max-w-[400px]">
          <div className="flex justify-center lg:hidden">
            <Image
              src="/navbar/lablogo.webp"
              alt="MedicoBharat"
              width={190}
              height={54}
              priority
              className="h-auto w-44 sm:w-48"
            />
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-28px_rgba(15,23,42,0.35)] sm:p-8 lg:mt-0 lg:border-0 lg:p-0 lg:shadow-none">
            <div className="mb-7">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[26px]">
                Welcome back
              </h1>
              <p className="mt-1.5 text-[14px] leading-relaxed text-slate-500">
                Sign in with the account that was made for you.
              </p>
            </div>

            {/*
              `next` is passed through so an expired session returns the person to
              the page they were on. It is validated on the way back out (it must
              start with /admin) — an unchecked redirect target is an open
              redirect, and a login page is the single most useful place for an
              attacker to have one.
            */}
            <LoginForm next={typeof next === "string" ? next : ""} />
          </div>

          <div className="mt-6 flex gap-3 rounded-xl bg-amber-50/70 px-4 py-3 ring-1 ring-inset ring-amber-600/15">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
            <p className="text-[12px] leading-relaxed text-amber-900/80">
              This panel holds patients’ names, phone numbers and addresses. Do not share an
              account — an owner can add one for each person, so the history page can show who
              changed what.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
