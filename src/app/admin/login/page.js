import Image from "next/image";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/admin/guard";

import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in", robots: { index: false, follow: false } };

/** Nothing here may be cached — it reads the session cookie. */
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;

  // Already signed in: go where they were headed rather than showing a form
  // they do not need.
  if (await getUser()) redirect(typeof next === "string" && next.startsWith("/admin") ? next : "/admin");

  return (
    /*
      The tint behind the card is a single static gradient. It is here because a
      sign-in screen is the one page in the panel with nothing else on it, and a
      flat grey rectangle reads as an unfinished page rather than a front door.
      Static on purpose — nothing here animates, loads a font or blurs anything.
    */
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_50%_-20%,rgba(16,185,129,0.10),transparent_70%)]"
      />

      <div className="relative w-full max-w-sm">
        {/* The site's own logo, at full width — it is navy and black artwork on
            white, which is exactly what this light screen is. */}
        <div className="flex justify-center">
          <Image
            src="/navbar/lablogo.webp"
            alt="MedicoBharat"
            width={208}
            height={59}
            priority
            className="h-auto w-52"
          />
        </div>

        <div className="mt-7 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_18px_40px_-24px_rgba(15,23,42,0.35)]">
          <div className="mb-5">
            <h1 className="text-[17px] font-extrabold tracking-tight text-slate-900">
              Sign in to the admin panel
            </h1>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">
              Use the account that was made for you.
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

        <p className="mt-5 text-center text-[12px] leading-relaxed text-slate-500">
          This panel holds patients’ names, phone numbers and addresses. Do not share an account —
          an owner can add one for each person, which is also what makes the history page able to
          say who changed what.
        </p>
      </div>
    </div>
  );
}
