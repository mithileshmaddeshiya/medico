import Link from "next/link";
import { Search, Wallet } from "lucide-react";

import {
  ButtonLink,
  Card,
  EmptyState,
  Facts,
  Field,
  Input,
  PageHeader,
  PaymentStatusBadge,
  BookingStatusBadge,
  SURFACE,
  Select,
  cx,
} from "@/components/crm/ui";
import { ActionForm, SubmitButton } from "@/components/crm/forms";
import FilterBar from "@/components/crm/FilterBar";
import { requirePerm, scopeOf } from "@/lib/crm/guard";
import { PAYMENT_MODES, bookingCode } from "@/lib/crm/constants";
import { date, phone, rupees } from "@/lib/crm/format";
import { nowIstLocal, payableBooking, searchPayableBookings } from "@/lib/crm/stores/finance";

import { recordPaymentAction } from "../actions";

export const metadata = { title: "Record payment" };
export const dynamic = "force-dynamic";

/**
 * Two steps on one URL: find the booking (?q= — code, mobile or name,
 * searched on the server as you type), then record the money against it
 * (?booking=<id>). A collector only finds the bookings assigned to them.
 * Saving goes through recordPayment(), so the booking's payment status is
 * recomputed, and lands you on the booking.
 */
export default async function RecordPaymentPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("payments.manage", "/crm/payments/new");
  const scope = scopeOf(user);
  const bookingId = Number(sp.booking) || 0;

  const booking = bookingId ? await payableBooking(bookingId, scope) : null;
  const results = booking ? [] : await searchPayableBookings(String(sp.q ?? ""), scope);
  const q = String(sp.q ?? "").trim();

  return (
    <>
      <PageHeader
        title="Record payment"
        description="Find the booking, then enter what was received. The booking's payment status updates itself."
        back={{ href: booking ? `/crm/bookings/${booking.id}` : "/crm/payments", label: booking ? bookingCode(booking.id) : "Payments" }}
      />

      {booking ? (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card
              title={`${bookingCode(booking.id)} · ${booking.patient_name}`}
              description={booking.items_label || undefined}
              actions={<PaymentStatusBadge status={booking.payment_status} />}
              footer={
                <Link href="/crm/payments/new" className="text-[13px] font-semibold text-blue-700 hover:underline">
                  ← Pick a different booking
                </Link>
              }
            >
              <Facts
                items={[
                  { label: "Mobile", value: phone(booking.patient_phone) },
                  { label: "Status", value: <BookingStatusBadge status={booking.status} /> },
                  { label: "Bill", value: rupees(booking.final_amount) },
                  { label: "Paid so far", value: rupees(booking.paid_amount) },
                  ...(Number(booking.refunded_amount) > 0 ? [{ label: "Refunded", value: rupees(booking.refunded_amount) }] : []),
                  { label: "Due now", value: <span className="text-[15px] font-semibold">{rupees(booking.due)}</span> },
                ]}
              />
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card title="Payment details">
              <ActionForm action={recordPaymentAction} className="space-y-4">
                <input type="hidden" name="bookingId" value={booking.id} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Amount (₹)" required htmlFor="amount" hint={Number(booking.due) > 0 ? `${rupees(booking.due)} is due.` : "Nothing is due on this booking."}>
                    <Input id="amount" name="amount" inputMode="decimal" required autoFocus defaultValue={Number(booking.due) > 0 ? Number(booking.due) : ""} />
                  </Field>
                  <Field label="Mode" required htmlFor="mode">
                    <Select id="mode" name="mode" defaultValue="upi">
                      {PAYMENT_MODES.map((m) => (
                        <option key={m.key} value={m.key}>
                          {m.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Status" htmlFor="status" hint="Pending does not count as revenue until it is marked paid.">
                    <Select id="status" name="status" defaultValue="paid">
                      <option value="paid">Received</option>
                      <option value="pending">Pending (promised)</option>
                      <option value="failed">Failed attempt</option>
                    </Select>
                  </Field>
                  <Field label="Received at (IST)" htmlFor="receivedAt">
                    <Input id="receivedAt" name="receivedAt" type="datetime-local" defaultValue={nowIstLocal()} max={nowIstLocal()} />
                  </Field>
                </div>
                <Field label="Transaction ID / UTR" htmlFor="reference" hint="Needed for UPI, card and bank transfers — it is how a payment is traced later.">
                  <Input id="reference" name="reference" maxLength={120} autoComplete="off" />
                </Field>
                <Field label="Notes" htmlFor="notes">
                  <Input id="notes" name="notes" maxLength={500} />
                </Field>
                <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                  <ButtonLink href={`/crm/bookings/${booking.id}`} variant="secondary">
                    Cancel
                  </ButtonLink>
                  <SubmitButton pendingLabel="Recording…">
                    <Wallet className="h-4 w-4" aria-hidden /> Record payment
                  </SubmitButton>
                </div>
              </ActionForm>
            </Card>
          </div>
        </div>
      ) : (
        <>
          {bookingId > 0 && (
            <p className="mb-3 text-[13px] font-medium text-rose-700">That booking was not found, or it is not assigned to you. Search for it below.</p>
          )}
          <FilterBar search={{ placeholder: "Booking ID (MB…), mobile number or name", label: "Find booking" }} />
          <p className="mb-2 text-[12.5px] font-semibold text-slate-500">
            {q ? `Bookings matching “${q}”` : "Recent bookings with money due"}
          </p>
          {results.length ? (
            <ul className="space-y-2">
              {results.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/crm/payments/new?booking=${b.id}`}
                    className={cx(SURFACE, "flex items-center justify-between gap-3 p-3.5 transition-colors hover:border-blue-300")}
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-slate-500">
                        {bookingCode(b.id)} · {date(b.created_at)}
                      </p>
                      <p className="truncate text-[15px] font-semibold text-slate-900">{b.patient_name}</p>
                      <p className="truncate text-[12.5px] text-slate-500">
                        {phone(b.patient_phone)}
                        {b.city ? ` · ${b.city}` : ""}
                        {b.items_label ? ` · ${b.items_label}` : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={cx("text-[15px] font-semibold tabular-nums", Number(b.due) > 0 ? "text-slate-900" : "text-slate-400")}>
                        {Number(b.due) > 0 ? `${rupees(b.due)} due` : "Paid"}
                      </p>
                      <p className="mt-0.5 text-[12px] text-slate-500 tabular-nums">of {rupees(b.final_amount)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className={SURFACE}>
              <EmptyState
                icon={<Search className="h-5 w-5" />}
                title={q ? "No open booking matches" : "No booking has money due"}
                hint={q ? "Check the booking ID or mobile number. Cancelled bookings are not listed." : "Search by booking ID, mobile number or name to record a payment."}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
