"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Banknote,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { postLead, validateLead } from "@/components/lab/leadForm";
import { iconFor, tint } from "@/components/lab/testIcons";
import { LAB_PHONE } from "@/data/lab/defaults";
import { MAX_QTY, priceCart, summariseLines } from "@/lib/labCart";
import { cart } from "./cartStore";

const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const CHECKOUT_JS = "https://checkout.razorpay.com/v1/checkout.js";

/** Load Razorpay's widget once, on the first "Pay" tap — not on page load. */
let checkoutScript;
function loadCheckout() {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve(true);
  checkoutScript ??= new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = CHECKOUT_JS;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => {
      checkoutScript = undefined; // let the next tap retry
      resolve(false);
    };
    document.body.appendChild(s);
  });
  return checkoutScript;
}

const inputBase =
  "w-full border bg-white px-3.5 py-2 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:ring-2";
const inputOk = `${inputBase} border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/15`;
const inputBad = `${inputBase} border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-500/15`;
const labelClass = "mb-1 block text-[12px] font-semibold text-slate-700";

const STEPS = ["Cart", "Details", "Confirmed"];

/**
 * The cart as a side panel (tablet/desktop) or bottom sheet (phone), with the
 * checkout inside it: cart → patient details and payment → confirmation.
 *
 * Two ways to pay, because both are real: online through Razorpay, or cash/UPI
 * to the phlebotomist at collection — the way the service has always worked.
 * Online payments are created and verified on the server (/api/checkout/*);
 * pay-at-collection goes through the same lead pipe as every other booking
 * form on the site (leadForm.js).
 */
export default function CartDrawer({ open, onClose, items, tests, city, phone }) {
  const [rawStep, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null); // { method, total, paymentId }

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cityName, setCityName] = useState("");
  const [method, setMethod] = useState("online");
  const [invalid, setInvalid] = useState("");

  const uid = useId();
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const cityRef = useRef(null);
  const panelRef = useRef(null);
  const billRef = useRef(null);

  const bill = useMemo(() => priceCart(items, tests), [items, tests]);
  const byId = useMemo(() => new Map(tests.map((t) => [t.id, t])), [tests]);
  const contactPhone = phone || LAB_PHONE;
  const phoneOk = /^[6-9]\d{9}$/.test(mobile);

  // Emptied while on checkout (e.g. in another tab) — nothing left to pay for.
  const step = rawStep === 1 && bill.count === 0 ? 0 : rawStep;

  // Latest values for the Escape handler, read through refs so the effect
  // below depends on `open` ALONE. It used to depend on `onClose` too — an
  // inline arrow that is new every time LabServices renders, which the
  // autoplaying slider makes happen every 2.5s. Each re-run called focus() on
  // the panel and pulled the cursor out of whatever field was being typed in.
  const closeRef = useRef(onClose);
  const busyRef = useRef(busy);
  useEffect(() => {
    closeRef.current = onClose;
    busyRef.current = busy;
  });

  // Escape closes; the page behind stops scrolling while the panel is open.
  // Focus moves to the panel once, when it opens — never again after that.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !busyRef.current && closeRef.current();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const close = () => {
    if (busy) return;
    if (step === 2) {
      setStep(0);
      setDone(null);
    }
    onClose();
  };

  const complain = (field, message) => {
    setInvalid(field);
    toast.error(message, { id: "lab-cart-form" });
    ({ name: nameRef, phone: phoneRef, city: cityRef })[field]?.current?.focus();
  };

  const finish = (result) => {
    cart.clear();
    setDone(result);
    setStep(2);
    setBusy(false);
  };

  const payAtCollection = async (customer) => {
    const result = await postLead({
      ...customer,
      test: `PAY AT COLLECTION ${inr(bill.total)} · ${summariseLines(bill.lines)}`,
    });
    if (!result.ok) {
      setBusy(false);
      toast.error(result.error, { id: "lab-cart-form" });
      return;
    }
    finish({ method: "cod", total: bill.total });
  };

  const payOnline = async (customer) => {
    const fail = (message) => {
      setBusy(false);
      toast.error(message, { id: "lab-cart-form" });
    };

    let order;
    try {
      const res = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, items, customer }),
      });
      order = await res.json().catch(() => ({}));
      if (!res.ok || !order.ok) return fail(order.error || "Could not start the payment.");
    } catch {
      return fail("Please check your internet and try again.");
    }

    if (!(await loadCheckout())) {
      return fail("Payment window could not load. Check your internet, or choose pay at home collection.");
    }

    const total = order.amount / 100;
    const rzp = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: "MedicoBharat",
      description: order.summary.slice(0, 250),
      prefill: { name: customer.name, contact: `+91${customer.phone}` },
      notes: { city: customer.city },
      theme: { color: "#059669" },
      modal: {
        confirm_close: true,
        ondismiss: () => setBusy(false),
      },
      handler: async (response) => {
        try {
          const res = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          const result = await res.json().catch(() => ({}));
          if (!res.ok || !result.ok) {
            return fail(result.error || `Payment received but not confirmed. Please call ${contactPhone}.`);
          }
          finish({ method: "online", total, paymentId: response.razorpay_payment_id });
        } catch {
          fail(`Payment done, but we could not confirm it. Please call ${contactPhone} with ID ${response.razorpay_payment_id}.`);
        }
      },
    });

    rzp.on("payment.failed", (r) => {
      toast.error(r?.error?.description || "Payment failed. You have not been charged — please try again.", {
        id: "lab-cart-form",
      });
    });

    rzp.open();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;

    // Name, mobile and the city the patient types. The address is taken on the
    // confirmation call.
    const customer = { name: name.trim(), phone: mobile, city: cityName.trim(), address: "" };
    if (!customer.city) return complain("city", "Please enter your city.");
    const problem = validateLead(customer);
    if (problem) return complain(problem.field, problem.message);

    setInvalid("");
    setBusy(true);
    if (method === "online") await payOnline(customer);
    else await payAtCollection(customer);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Your cart"
      className="fixed inset-0 z-80 print:hidden"
    >
      <div
        onClick={close}
        className="lab-fade-in absolute inset-0 bg-slate-900/55 backdrop-blur-[3px]"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="lab-pop-in absolute inset-x-0 bottom-0 flex h-[92dvh] flex-col overflow-hidden border-slate-200 bg-slate-100 shadow-2xl outline-none sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-110 sm:border-l"
      >
        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-4 pb-3 pt-2 sm:px-5 sm:pt-4">
          <div aria-hidden className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-slate-200 sm:hidden" />
          <div className="flex items-center gap-2">
            {step === 1 && (
              <button
                type="button"
                onClick={() => !busy && setStep(0)}
                aria-label="Back to cart"
                className="-ml-1 flex h-8 w-8 cursor-pointer items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              >
                <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.3} />
              </button>
            )}
            <h2 className="flex-1 text-[17px] font-bold tracking-tight text-slate-900">
              {step === 0 ? "Your Cart" : step === 1 ? "Checkout" : "Booking Confirmed"}
              {step === 0 && bill.count > 0 && (
                <span className="ml-2 align-middle text-[12px] font-semibold text-slate-400">
                  {bill.count} {bill.count === 1 ? "test" : "tests"}
                </span>
              )}
            </h2>
            <button
              type="button"
              onClick={close}
              disabled={busy}
              aria-label="Close cart"
              className="flex h-8 w-8 cursor-pointer items-center justify-center border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40"
            >
              <X className="h-4 w-4" strokeWidth={2.4} />
            </button>
          </div>

          {/* Progress */}
          <ol className="mt-3 flex items-center gap-2">
            {STEPS.map((label, i) => (
              <li key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                    i < step || step === 2
                      ? "bg-emerald-600 text-white"
                      : i === step
                        ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {i < step || step === 2 ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                <span className={`text-[11.5px] font-semibold ${i <= step ? "text-slate-800" : "text-slate-400"}`}>
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <span className={`h-px flex-1 ${i < step ? "bg-emerald-400" : "bg-slate-200"}`} />
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* ── STEP 0: CART ───────────────────────────────────────── */}
        {step === 0 && (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5">
              {bill.count === 0 ? (
                <div className="flex flex-col items-center px-4 py-12 text-center">
                  <span className="flex h-16 w-16 items-center justify-center border border-slate-200 bg-white text-slate-400">
                    <ShoppingBag className="h-7 w-7" strokeWidth={1.8} />
                  </span>
                  <p className="mt-5 text-[16px] font-bold text-slate-900">Your cart is empty</p>
                  <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-slate-500">
                    Add tests or a checkup package — the sample is collected from your home for free.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-5 cursor-pointer bg-emerald-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Browse tests
                  </button>
                </div>
              ) : (
                <>
                  {/* ITEMS — one card, rows split by dividers, like a real cart */}
                  <section className="overflow-hidden border border-slate-200 bg-white">
                    <p className="border-b border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">
                      Tests in your cart{" "}
                      <span className="text-slate-400">({bill.count})</span>
                    </p>

                    <ul className="divide-y divide-slate-200">
                      {bill.lines.map((line) => {
                        const t = byId.get(line.id);
                        const Icon = iconFor(t?.icon);
                        const off =
                          line.lineMrp > line.lineTotal
                            ? Math.round(((line.lineMrp - line.lineTotal) / line.lineMrp) * 100)
                            : 0;
                        return (
                          <li key={line.id} className="px-3.5 py-3">
                            <div className="flex gap-3">
                              <span className={`flex h-11 w-11 shrink-0 items-center justify-center ring-1 ${tint(t?.tint)}`}>
                                <Icon className="h-5.5 w-5.5" strokeWidth={1.8} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[14px] font-bold leading-snug text-slate-900">{line.name}</p>
                                {t?.sub && <p className="truncate text-[11.5px] text-slate-500">{t.sub}</p>}
                                <span
                                  className={`mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium ${
                                    line.fasting ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  <Clock className="h-2.5 w-2.5" strokeWidth={2.6} />
                                  {line.fasting ? "Fasting required" : "No fasting needed"}
                                </span>
                              </div>
                            </div>

                            <div className="mt-2.5 flex items-center justify-between gap-2 pl-15">
                              <div className="flex flex-wrap items-baseline gap-x-1.5">
                                <span className="text-[15.5px] font-bold tabular-nums text-slate-900">
                                  {inr(line.lineTotal)}
                                </span>
                                {off > 0 && (
                                  <>
                                    <span className="text-[11.5px] tabular-nums text-slate-400 line-through">
                                      {inr(line.lineMrp)}
                                    </span>
                                    <span className="text-[11.5px] font-bold text-emerald-600">{off}% off</span>
                                  </>
                                )}
                              </div>

                              <div
                                role="group"
                                aria-label={`Persons for ${line.name}`}
                                className="inline-flex h-8 shrink-0 items-center overflow-hidden border border-slate-300"
                              >
                                <button
                                  type="button"
                                  onClick={() => cart.setQty(line.id, line.qty - 1)}
                                  aria-label={`One less ${line.name}`}
                                  className="flex h-full w-8 cursor-pointer items-center justify-center text-slate-600 transition-colors hover:bg-slate-100"
                                >
                                  <Minus className="h-3.5 w-3.5" strokeWidth={2.6} />
                                </button>
                                <span className="flex h-full w-8 items-center justify-center border-x border-slate-300 text-[13px] font-semibold tabular-nums text-slate-900">
                                  {line.qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => cart.setQty(line.id, line.qty + 1)}
                                  disabled={line.qty >= MAX_QTY}
                                  aria-label={`One more ${line.name}`}
                                  className="flex h-full w-8 cursor-pointer items-center justify-center text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                                >
                                  <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
                                </button>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between pl-15">
                              <span className="text-[10.5px] text-slate-400">
                                {line.qty > 1 ? `${line.qty} persons · ${inr(line.price)} each` : "1 person"}
                              </span>
                              <button
                                type="button"
                                onClick={() => cart.remove(line.id)}
                                aria-label={`Remove ${line.name}`}
                                className="inline-flex cursor-pointer items-center gap-1 px-1.5 py-1 text-[11.5px] font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                                Remove
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <button
                      type="button"
                      onClick={close}
                      className="flex w-full cursor-pointer items-center justify-center gap-1.5 border-t border-slate-200 py-3 text-[13px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-50/60"
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.6} />
                      Add more tests
                    </button>
                  </section>

                  {/* PRICE DETAILS */}
                  <section ref={billRef} className="mt-3 scroll-mt-3 overflow-hidden border border-slate-200 bg-white">
                    <p className="border-b border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">
                      Price details
                    </p>
                    <dl className="space-y-2.5 px-3.5 py-3 text-[13.5px]">
                      <div className="flex justify-between text-slate-700">
                        <dt>
                          Price ({bill.count} {bill.count === 1 ? "test" : "tests"})
                        </dt>
                        <dd className="tabular-nums">{inr(bill.mrpTotal)}</dd>
                      </div>
                      {bill.savings > 0 && (
                        <div className="flex justify-between text-slate-700">
                          <dt>Discount</dt>
                          <dd className="font-semibold tabular-nums text-emerald-600">− {inr(bill.savings)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-700">
                        <dt>Home collection charges</dt>
                        <dd className="font-semibold text-emerald-600">FREE</dd>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-3 text-[15px] font-bold text-slate-900">
                        <dt>Total amount</dt>
                        <dd className="tabular-nums">{inr(bill.total)}</dd>
                      </div>
                    </dl>
                    {bill.savings > 0 && (
                      <p className="flex items-center gap-2 border-t border-slate-200 bg-emerald-50 px-3.5 py-2.5 text-[12.5px] font-semibold text-emerald-700">
                        <BadgePercent className="h-4 w-4 shrink-0" strokeWidth={2.3} />
                        You will save {inr(bill.savings)} on this booking
                      </p>
                    )}
                  </section>

                  {bill.needsFasting && (
                    <p className="mt-3 flex gap-2 px-1 text-[12px] leading-relaxed text-slate-500">
                      <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={2.3} />
                      Some tests in your cart need 8–10 hours of fasting. Pick an early-morning slot when we call — water is fine.
                    </p>
                  )}

                  <p className="mt-3 flex items-center justify-center gap-1.5 pb-1 text-[11px] font-medium text-slate-400">
                    <Lock className="h-3 w-3" strokeWidth={2.4} />
                    Pay online, or cash / UPI at sample collection
                  </p>
                </>
              )}
            </div>

            {bill.count > 0 && (
              <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-[19px] font-bold leading-none tabular-nums text-slate-900">{inr(bill.total)}</p>
                      {bill.savings > 0 && (
                        <p className="text-[11.5px] tabular-nums text-slate-400 line-through">{inr(bill.mrpTotal)}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => billRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                      className="mt-1 cursor-pointer text-[11.5px] font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                    >
                      View price details
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="ml-auto flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 bg-emerald-600 text-[15px] font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── STEP 1: DETAILS & PAYMENT ──────────────────────────── */}
        {step === 1 && (
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5">
              {/* CONTACT — name and mobile only. The team calls this number to
                  fix the slot and take the address, so nothing else is asked. */}
              <section className="overflow-hidden border border-slate-200 bg-white">
                <div className="flex items-center gap-2.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                  <span className="flex h-6 w-6 items-center justify-center bg-slate-900 text-[11px] font-semibold text-white">
                    1
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-bold text-slate-900">Contact details</p>
                    <p className="text-[10.5px] leading-tight text-slate-500">We will call this number to confirm your slot</p>
                  </div>
                </div>

                {/* The three fields read centred, so each input needs its left and right
                    padding to MATCH. The icon is an absolutely positioned overlay and
                    text-align centres within the CONTENT box, not the border box — pad
                    only the icon's side and the text lands visibly off to the right.

                    One-sided pl- and pr- rather than px-: Tailwind emits the one-sided
                    utilities after the axis ones, so they reliably beat the px-3.5 inside
                    inputBase. Two competing px- classes on one element is a coin toss. */}
                <div className="space-y-2.5 px-4 py-3.5">
                  <div>
                    <label htmlFor={`${uid}-name`} className={labelClass}>
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <UserRound
                        aria-hidden
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400"
                        strokeWidth={2}
                      />
                      <input
                        id={`${uid}-name`}
                        ref={nameRef}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (invalid === "name") setInvalid("");
                        }}
                        autoComplete="name"
                        autoCapitalize="words"
                        enterKeyHint="next"
                        placeholder="Patient's full name"
                        className={`${invalid === "name" ? inputBad : inputOk} h-11 pl-10 pr-10 text-center`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${uid}-phone`} className={labelClass}>
                      Mobile number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center gap-2 pl-3.5 text-[14px] font-semibold text-slate-700">
                        <Phone className="h-4 w-4 text-slate-400" strokeWidth={2.2} />
                        +91
                        <span className="h-5 w-px bg-slate-200" />
                      </span>
                      <input
                        id={`${uid}-phone`}
                        ref={phoneRef}
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                          if (invalid === "phone") setInvalid("");
                        }}
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        enterKeyHint="next"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        className={`${invalid === "phone" ? inputBad : inputOk} h-11 pl-20 pr-20 text-center tracking-wide tabular-nums`}
                      />
                      {phoneOk && (
                        <CheckCircle2
                          aria-label="Valid number"
                          className="absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-emerald-600"
                          strokeWidth={2.4}
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${uid}-city`} className={labelClass}>
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin
                        aria-hidden
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400"
                        strokeWidth={2}
                      />
                      <input
                        id={`${uid}-city`}
                        ref={cityRef}
                        value={cityName}
                        onChange={(e) => {
                          setCityName(e.target.value.slice(0, 80));
                          if (invalid === "city") setInvalid("");
                        }}
                        autoComplete="address-level2"
                        autoCapitalize="words"
                        enterKeyHint="done"
                        placeholder="Enter your city"
                        className={`${invalid === "city" ? inputBad : inputOk} h-11 pl-10 pr-10 text-center`}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* PAYMENT */}
              <fieldset className="overflow-hidden border border-slate-200 bg-white">
                <legend className="sr-only">Payment method</legend>
                <div className="flex items-center gap-2.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                  <span className="flex h-6 w-6 items-center justify-center bg-slate-900 text-[11px] font-semibold text-white">
                    2
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-bold text-slate-900">Payment method</p>
                    <p className="text-[10.5px] leading-tight text-slate-500">Choose how you would like to pay</p>
                  </div>
                </div>

                <div className="space-y-2 p-2.5">
                  {[
                    {
                      key: "online",
                      Icon: CreditCard,
                      title: "Pay online",
                      sub: "Pay now and your booking is confirmed instantly",
                      chips: ["UPI", "Cards", "Net banking", "Wallets"],
                    },
                    {
                      key: "cod",
                      Icon: Banknote,
                      title: "Pay at sample collection",
                      sub: "Pay cash or UPI to our staff when they visit",
                      chips: ["Cash", "UPI"],
                    },
                  ].map(({ key, Icon, title, sub, chips }) => {
                    const active = method === key;
                    return (
                      <label
                        key={key}
                        className={`block cursor-pointer border p-3 transition-colors ${
                          active
                            ? "border-emerald-600 bg-emerald-50/60"
                            : "border-slate-200 bg-white hover:border-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`${uid}-method`}
                          value={key}
                          checked={active}
                          onChange={() => setMethod(key)}
                          className="sr-only"
                        />
                        <span className="flex items-start gap-3">
                          <span
                            aria-hidden
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-2 transition-colors ${
                              active ? "bg-emerald-600 ring-emerald-600" : "bg-white ring-slate-300"
                            }`}
                          >
                            {active && <span className="h-2 w-2 rounded-full bg-white" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="text-[14px] font-bold text-slate-900">{title}</span>
                              <Icon
                                className={`h-5 w-5 shrink-0 ${active ? "text-emerald-600" : "text-slate-400"}`}
                                strokeWidth={2}
                              />
                            </span>
                            <span className="mt-0.5 block text-[11.5px] leading-snug text-slate-500">{sub}</span>
                            <span className="mt-1.5 flex flex-wrap gap-1.5">
                              {chips.map((c) => (
                                <span
                                  key={c}
                                  className={`border px-2 py-0.5 text-[10.5px] font-medium ${
                                    active
                                      ? "border-emerald-200 bg-white text-emerald-700"
                                      : "border-slate-200 bg-slate-50 text-slate-500"
                                  }`}
                                >
                                  {c}
                                </span>
                              ))}
                            </span>
                            {key === "online" && (
                              <span className="mt-1.5 flex items-center gap-1 text-[10.5px] font-medium text-slate-400">
                                <Lock className="h-3 w-3" strokeWidth={2.4} />
                                Secured by Razorpay
                              </span>
                            )}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <p className="flex items-center justify-center gap-1.5 pb-1 text-[11px] font-medium text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
                Your details are used only for this booking
              </p>
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <p className="text-[19px] font-bold leading-none tabular-nums text-slate-900">{inr(bill.total)}</p>
                  <p className="mt-1 text-[11.5px] font-medium text-slate-500">
                    {bill.count} {bill.count === 1 ? "test" : "tests"}
                    {bill.savings > 0 && <span className="font-semibold text-emerald-700"> · saved {inr(bill.savings)}</span>}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="ml-auto flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 bg-emerald-600 px-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" strokeWidth={2.4} />
                      {method === "online" ? "Opening payment…" : "Confirming…"}
                    </>
                  ) : method === "online" ? (
                    <>
                      <Lock className="h-4 w-4" strokeWidth={2.4} />
                      Pay {inr(bill.total)}
                    </>
                  ) : (
                    <>
                      Confirm booking
                      <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── STEP 2: CONFIRMED ──────────────────────────────────── */}
        {step === 2 && done && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-8 text-center">
              <span className="lab-pop-in mx-auto flex h-16 w-16 items-center justify-center border border-emerald-200 bg-emerald-50">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" strokeWidth={1.8} />
              </span>
              <p className="mt-5 text-[20px] font-bold tracking-tight text-slate-900">
                {done.method === "online" ? "Payment successful" : "Booking confirmed"}
              </p>
              <p className="mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-slate-500">
                {done.method === "online"
                  ? `${inr(done.total)} paid. Our team will call you shortly to fix your sample collection slot.`
                  : `Pay ${inr(done.total)} by cash or UPI at collection. Our team will call you shortly to fix the slot.`}
              </p>

              {done.paymentId && (
                <p className="mx-auto mt-4 inline-flex border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-[11.5px] text-slate-600">
                  Payment ID: {done.paymentId}
                </p>
              )}

              <ul className="mx-auto mt-6 max-w-sm space-y-2.5 text-left text-[12.5px] text-slate-600">
                {[
                  "A trained phlebotomist with an ID card visits your home — collection is free.",
                  "Slots start from 6 AM, so fasting tests can be done before breakfast.",
                  "Report arrives on WhatsApp and email within 24 hours.",
                ].map((text) => (
                  <li key={text} className="flex gap-2.5 border border-slate-200 bg-white p-3">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={3} />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
              <button
                type="button"
                onClick={close}
                className="h-12 w-full cursor-pointer bg-slate-900 text-[14.5px] font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
