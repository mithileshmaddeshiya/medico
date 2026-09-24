"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { loginAction } from "./actions";

const inputClass =
  "block w-full rounded-xl border-0 bg-slate-50/70 py-3 pl-10 text-[14px] text-slate-900 ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-400 hover:ring-slate-300 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-emerald-600 focus:outline-none";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-[14px] font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:from-emerald-700 hover:to-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Checking…
        </>
      ) : (
        <>
          Sign in
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </>
      )}
    </button>
  );
}

export default function LoginForm({ next = "" }) {
  const [state, action] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="email" className="text-[13px] font-semibold text-slate-700">
          Email address
        </label>
        <div className="relative mt-1.5">
          <Mail
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            autoFocus
            placeholder="you@medicobharat.com"
            className={`${inputClass} pr-3`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="text-[13px] font-semibold text-slate-700">
          Password
        </label>
        <div className="relative mt-1.5">
          <Lock
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* The error is rendered, not toasted: a sign-in failure is the whole
          result of the page and it has to survive a screen reader's focus
          landing on the form again. role="alert" is what announces it. */}
      {state?.error && (
        <p
          role="alert"
          className="rounded-xl bg-rose-50 px-3.5 py-3 text-[13px] font-medium leading-relaxed text-rose-700 ring-1 ring-inset ring-rose-600/20"
        >
          {state.error}
        </p>
      )}

      <Submit />
    </form>
  );
}
