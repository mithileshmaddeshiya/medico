"use client";

/**
 * The fields of the "Request refund" dialog. The booking code is looked up
 * on the server (a read-only server action) to show what was paid and what
 * is still refundable; the amount defaults to that and is capped by it. The
 * server re-checks everything on submit — this is guidance, not the guard.
 */
import { useState, useTransition } from "react";
import { Loader2, Search } from "lucide-react";

import { lookupRefundBooking } from "@/app/crm/refunds/actions";
import { PAYMENT_MODES, PAYMENT_MODE } from "@/lib/crm/constants";
import { rupees } from "@/lib/crm/format";

import { Field, Input, Select, Textarea, btn } from "../ui";

export default function RefundRequestFields({ initialCode = "" }) {
  const [code, setCode] = useState(initialCode);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const look = () => {
    const value = code.trim();
    if (!value) return;
    start(async () => {
      const res = await lookupRefundBooking(value);
      setBooking(res.ok ? res.booking : null);
      setError(res.ok ? "" : res.error);
    });
  };

  const defaultMode = booking?.payments?.at(-1)?.mode ?? "upi";

  return (
    <>
      <Field label="Booking ID" required htmlFor="rf-booking" hint="MB followed by the number, e.g. MB10245.">
        <div className="flex gap-2">
          <Input
            id="rf-booking"
            name="booking"
            required
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setBooking(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                look();
              }
            }}
            onBlur={() => !booking && look()}
            placeholder="MB10245"
            autoComplete="off"
          />
          <button type="button" onClick={look} className={btn("secondary", "md", "shrink-0")} disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Search className="h-4 w-4" aria-hidden />}
            Find
          </button>
        </div>
      </Field>

      {error && <p className="text-[13px] font-medium text-rose-700">{error}</p>}

      {booking && (
        <div className="rounded-xl bg-slate-50 px-3.5 py-3 text-[13px] ring-1 ring-inset ring-slate-200">
          <p className="font-semibold text-slate-900">
            {booking.code} · {booking.name}
          </p>
          <dl className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
            <dt>Bill</dt>
            <dd className="text-right tabular-nums">{rupees(booking.finalAmount)}</dd>
            <dt>Paid</dt>
            <dd className="text-right tabular-nums">{rupees(booking.paid)}</dd>
            <dt>Already refunded</dt>
            <dd className="text-right tabular-nums">{rupees(booking.processed)}</dd>
            {booking.open > 0 && (
              <>
                <dt>Refund requests open</dt>
                <dd className="text-right tabular-nums">{rupees(booking.open)}</dd>
              </>
            )}
            <dt className="font-semibold text-slate-900">Can refund up to</dt>
            <dd className="text-right font-semibold text-slate-900 tabular-nums">{rupees(booking.available)}</dd>
          </dl>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Amount" required htmlFor="rf-amount">
          <Input
            key={`amt-${booking?.id ?? "none"}`}
            id="rf-amount"
            name="amount"
            inputMode="decimal"
            required
            defaultValue={booking?.available > 0 ? booking.available : ""}
          />
        </Field>
        <Field label="Refund via" required htmlFor="rf-mode">
          <Select key={`mode-${booking?.id ?? "none"}`} id="rf-mode" name="mode" defaultValue={defaultMode}>
            {PAYMENT_MODES.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {booking?.payments?.length > 1 && (
        <Field label="Against payment (optional)" htmlFor="rf-payment">
          <Select id="rf-payment" name="paymentId" defaultValue="">
            <option value="">Not specific</option>
            {booking.payments.map((p) => (
              <option key={p.id} value={p.id}>
                PAY{p.id} · {rupees(p.amount)} · {PAYMENT_MODE[p.mode]?.label ?? p.mode}
                {p.online ? " (gateway)" : ""}
              </option>
            ))}
          </Select>
        </Field>
      )}
      {booking?.payments?.length === 1 && <input type="hidden" name="paymentId" value={booking.payments[0].id} />}

      <Field label="Reason" required htmlFor="rf-reason">
        <Textarea id="rf-reason" name="reason" required maxLength={500} placeholder="Test cancelled, sample not collected, duplicate payment…" />
      </Field>
    </>
  );
}
