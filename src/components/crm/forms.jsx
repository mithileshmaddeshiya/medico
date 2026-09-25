"use client";

/**
 * Forms, dialogs and confirmations for the CRM.
 *
 * Every mutation is a real <form> posting to a Server Action, so it works
 * before hydration and can never look pressed without having been sent. The
 * action returns `{ ok, message?, error? }` (see run() in src/lib/crm/guard.js)
 * and this file turns that into a toast. Actions refresh the page themselves
 * (refresh() / revalidatePath), so nothing here re-fetches.
 */
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";

import { btn, cx } from "./ui";

export function SubmitButton({ children, pendingLabel, variant = "primary", size = "md", className = "", disabled, ...props }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending || disabled} className={btn(variant, size, className)} {...props}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {pending ? (pendingLabel ?? "Saving…") : children}
    </button>
  );
}

/**
 * A form bound to a server action, with toasts.
 *   onDone(state)  after success (close a dialog …)
 *   reset          clear the fields on success (a note box)
 */
export function ActionForm({ action, children, className = "", reset = false, onDone, successToast = true, id }) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef(null);

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
    <form id={id} ref={ref} action={formAction} className={className}>
      {children}
    </form>
  );
}

/* ── Dialogs ──────────────────────────────────────────────────────────── */

/**
 * A modal on the native <dialog> element: focus is trapped, Esc closes, the
 * page behind is inert — all by the browser. On a phone it rises from the
 * bottom as a sheet; from sm up it is centred.
 *
 * Controlled (`open`, `onClose`) or self-contained with a `trigger` render
 * prop: trigger={(open) => <button onClick={open}>…</button>}.
 */
export function Modal({ title, description, children, open: openProp, onClose, trigger, size = "md", footer }) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const ref = useRef(null);
  const titleId = useId();

  const close = () => {
    if (openProp === undefined) setOpenState(false);
    onClose?.();
  };

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const widths = { sm: "sm:max-w-sm", md: "sm:max-w-lg", lg: "sm:max-w-2xl", xl: "sm:max-w-4xl" };

  return (
    <>
      {trigger?.(() => setOpenState(true))}
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onClose={close}
        onClick={(e) => {
          if (e.target === ref.current) close(); // a click on the backdrop
        }}
        className={cx(
          "m-0 mt-auto max-h-[92dvh] w-full max-w-none rounded-t-3xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-900/40",
          "sm:m-auto sm:rounded-2xl",
          widths[size]
        )}
      >
        {open && (
          <div className="flex max-h-[92dvh] flex-col">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 pb-3.5 pt-4">
              <div className="min-w-0">
                <h2 id={titleId} className="text-[16px] font-semibold tracking-tight">
                  {title}
                </h2>
                {description && <p className="mt-0.5 text-[12.5px] text-slate-500">{description}</p>}
              </div>
              <button type="button" onClick={close} className={btn("ghost", "sm", "-mr-1.5 h-9 w-9 px-0")} aria-label="Close">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              {typeof children === "function" ? children(close) : children}
            </div>
            {footer && <div className="border-t border-slate-100 px-5 py-3">{footer}</div>}
          </div>
        )}
      </dialog>
    </>
  );
}

/**
 * A button that asks before it submits. The server action receives the
 * hidden `fields` plus, when `reason` is set, a required "reason" textarea.
 */
export function ConfirmAction({
  action,
  fields = {},
  label,
  title,
  body,
  confirmLabel = "Confirm",
  variant = "secondary",
  confirmVariant = "danger",
  size = "md",
  reason = false,
  reasonLabel = "Reason",
  className = "",
  icon,
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btn(variant, size, className)}>
        {icon}
        {label}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={title} size="sm">
        <ActionForm action={action} onDone={() => setOpen(false)} className="space-y-4">
          {Object.entries(fields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v ?? ""} />
          ))}
          {body && <div className="text-[13.5px] leading-relaxed text-slate-600">{body}</div>}
          {reason && (
            <label className="block">
              <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">{reasonLabel}</span>
              <textarea
                name="reason"
                required
                rows={3}
                className="block w-full rounded-xl border-0 px-3 py-2.5 text-[14px] ring-1 ring-inset ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </label>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setOpen(false)} className={btn("secondary", "md")}>
              Cancel
            </button>
            <SubmitButton variant={confirmVariant} pendingLabel="Working…">
              {confirmLabel}
            </SubmitButton>
          </div>
        </ActionForm>
      </Modal>
    </>
  );
}

/**
 * A one-tap action with no confirmation (mark arrived, accept order …):
 * a form with hidden fields and a single submit button.
 */
export function QuickAction({ action, fields = {}, children, variant = "secondary", size = "md", className = "", pendingLabel }) {
  return (
    <ActionForm action={action} className="contents">
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v ?? ""} />
      ))}
      <SubmitButton variant={variant} size={size} className={className} pendingLabel={pendingLabel}>
        {children}
      </SubmitButton>
    </ActionForm>
  );
}

/**
 * A modal holding a form. `children` is the fields; the submit row is added.
 * The trigger is a button with `label`.
 */
export function FormModal({
  action,
  label,
  title,
  description,
  children,
  submitLabel = "Save",
  variant = "primary",
  size = "md",
  modalSize = "md",
  className = "",
  icon,
  fields = {},
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btn(variant, size, className)}>
        {icon}
        {label}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={title} description={description} size={modalSize}>
        <ActionForm action={action} onDone={() => setOpen(false)} className="space-y-4">
          {Object.entries(fields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v ?? ""} />
          ))}
          {children}
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setOpen(false)} className={btn("secondary", "md")}>
              Cancel
            </button>
            <SubmitButton>{submitLabel}</SubmitButton>
          </div>
        </ActionForm>
      </Modal>
    </>
  );
}
