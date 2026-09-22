"use client";

/**
 * The bridge between a Server Action and a toast.
 *
 * Every mutating control in the panel is a real <form> posting to a Server
 * Action, not a fetch. That is not nostalgia: a form works before hydration,
 * works with JavaScript broken, and cannot get into the state where the
 * button looks pressed but nothing was sent. `useActionState` gives the
 * pending flag and the action's `{ ok, message, error }` reply back, and this
 * component turns the reply into the same toast the public site uses.
 */
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

import { Button } from "./ui";

/**
 * A submit button that knows whether its own form is in flight.
 *
 * useFormStatus reads the nearest enclosing form, which is why this has to be
 * a separate component from the one that renders the <form>: inside that
 * component the hook would be reading a form that has not been created yet.
 */
export function SubmitButton({ children, pendingLabel, variant = "primary", ...props }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} disabled={pending} {...props}>
      {pending ? (pendingLabel ?? "Saving…") : children}
    </Button>
  );
}

/**
 * A form wired to a Server Action, with toasts.
 *
 * `onDone` runs after a successful submit — used to close a dialog or clear a
 * field. `reset` empties the form on success, which is what a note box wants
 * and what an edit form definitely does not.
 */
export default function ActionForm({
  action,
  children,
  className = "",
  reset = false,
  onDone,
  successToast = true,
}) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef(null);

  // Keyed on the state object's identity rather than its contents, so
  // submitting twice with the same result still fires twice.
  useEffect(() => {
    if (!state) return;

    if (state.ok === false && state.error) toast.error(state.error);
    else if (state.ok && state.message && successToast) toast.success(state.message);

    if (state.ok) {
      if (reset) ref.current?.reset();
      onDone?.(state);
    }
  }, [state, reset, onDone, successToast]);

  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
    </form>
  );
}
