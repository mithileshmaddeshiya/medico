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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="text-lg font-extrabold tracking-tight text-slate-900">
            Medico<span className="text-emerald-600">Bharat</span>
          </p>
          <p className="mt-1 text-[12.5px] font-semibold uppercase tracking-wide text-slate-400">
            Admin
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
