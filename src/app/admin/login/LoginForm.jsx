"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button, Field, Input } from "@/components/admin/ui";

import { loginAction } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Checking…" : "Sign in"}
    </Button>
  );
}

export default function LoginForm({ next = "" }) {
  const [state, action] = useActionState(loginAction, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <Field label="Email" required>
        <Input
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          placeholder="you@medicobharat.com"
        />
      </Field>

      <Field label="Password" required>
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••••"
        />
      </Field>

      {/* The error is rendered, not toasted: a sign-in failure is the whole
          result of the page and it has to survive a screen reader's focus
          landing on the form again. role="alert" is what announces it. */}
      {state?.error && (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 px-3 py-2.5 text-[12.5px] font-medium leading-relaxed text-rose-700 ring-1 ring-inset ring-rose-600/20"
        >
          {state.error}
        </p>
      )}

      <Submit />
    </form>
  );
}
