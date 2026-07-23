"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Loader2,
  PhoneCall,
  X,
} from "lucide-react";

import { LAB_PHONE } from "@/data/labDefaults";

// The dropdown is filled from Firestore, which only the server can read — the
// list arrives as `cityOptions` (see getLabCityOptions in src/lib/labCities.js).
// This is the last-resort list for a render that forgot to pass it.
const FALLBACK_CITY_OPTIONS = ["Other"];

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none";

const labelClass = "block text-[12.5px] font-semibold text-slate-800 mb-1";

/**
 * The green-tab enquiry card used in two places:
 *  - LabHero  → rendered inline, no `test`, no `onClose`
 *  - LabBookingModal → rendered inside the overlay with a pre-selected `test`
 */
export default function LabLeadCard({
  title = "Book Your Sample Collection",
  test = "",
  cityOptions,
  onClose,
  className = "",
}) {
  const cities = cityOptions?.length ? cityOptions : FALLBACK_CITY_OPTIONS;

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Hero card and the booking modal can both be mounted — keep field ids unique.
  const uid = useId();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!city) return setError("Please select your city.");
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Please enter a valid 10-digit mobile number.");
    if (address.trim().length < 10) return setError("Please enter your full address.");

    setError("");
    setSending(true);

    // Posts to our own server, which saves the lead and notifies the shop.
    // It used to open wa.me in a new tab, which threw the patient out of the
    // site and lost the booking entirely if they did not press send there.
    try {
      const response = await fetch("/api/lab-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, phone, address, test }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        setError(result.error || "Something went wrong. Please call us instead.");
        return;
      }

      setSent(true);
    } catch {
      // Offline, or the request never reached us — the phone number is the
      // fallback that always works.
      setError("Could not reach the server. Please check your internet or call us.");
    } finally {
      setSending(false);
    }
  };

  // "Book another test" — back to an empty form, keeping the card in place.
  const reset = () => {
    setSent(false);
    setError("");
    setName("");
    setCity("");
    setPhone("");
    setAddress("");
  };

  return (
    <div
      className={`relative w-full rounded-xl bg-white ring-1 ring-emerald-100 shadow-lg overflow-hidden ${className}`}
    >
      <div className="flex items-start justify-between">
        <h2 className="inline-block rounded-br-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-[13px] font-bold text-white">
          {title}
        </h2>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="m-2 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="px-4 sm:px-5 pt-2.5 pb-4">
        {sent ? (
          // The moment a patient is most likely to worry that nothing happened.
          // So: confirm it landed, say exactly what comes next and when, and
          // give them something to do — go back, or call.
          <div className="py-3">
            <div className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-4 ring-emerald-100/70">
                <Check className="h-6 w-6" strokeWidth={3} />
              </span>

              <h3 className="mt-3 text-[15px] font-extrabold tracking-tight text-slate-900">
                Booking confirmed
              </h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">
                Thank you{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}. Your
                request has reached us — you do not need to do anything else.
              </p>
            </div>

            {/* What happens next, with the times we actually promise. Removes
                the "should I call them?" doubt that follows a silent form. */}
            <ol className="mt-4 space-y-2.5">
              {[
                {
                  icon: PhoneCall,
                  h: `We call you on ${phone}`,
                  s: "Within 30 minutes, to confirm the slot and address",
                },
                {
                  icon: Clock,
                  h: "Phlebotomist reaches your door",
                  s: "Usually within 60 minutes of the slot being confirmed",
                },
                {
                  icon: Check,
                  h: "Report on WhatsApp & email",
                  s: "Most reports in 24 hours, as a PDF",
                },
              ].map(({ icon: Icon, h, s }, i) => (
                <li key={h} className="flex gap-2.5">
                  <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Icon className="h-3 w-3" strokeWidth={2.6} />
                    {/* Connector between the steps — stops after the last one */}
                    {i < 2 && (
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-full h-2.5 w-px -translate-x-1/2 bg-emerald-200"
                      />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-bold leading-snug text-slate-800">{h}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{s}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`tel:${LAB_PHONE.replace(/\s/g, "")}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-linear-to-r from-emerald-600 to-teal-600 text-[13px] font-bold text-white hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition-all"
              >
                <PhoneCall className="h-3.5 w-3.5" strokeWidth={2.4} />
                Call us now — {LAB_PHONE}
              </a>

              {/* The back button. In the modal, closing is the more natural
                  "back", so it says so; inline in the hero there is nothing to
                  close, and going back means a fresh form. */}
              <button
                type="button"
                onClick={onClose ?? reset}
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-white text-[12.5px] font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50/60 hover:ring-emerald-400 active:scale-[0.98] transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
                {onClose ? "Back to tests" : "Book another test"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-2">
            {/* Pre-selected test — read only, comes from the card the user clicked */}
            {test && (
              <div>
                <span className={labelClass}>Selected Test</span>
                <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 ring-1 ring-emerald-100">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={4} />
                  </span>
                  <span className="text-[13px] font-bold text-emerald-800">{test}</span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor={`${uid}-name`} className={labelClass}>
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id={`${uid}-name`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor={`${uid}-phone`} className={labelClass}>
                Mobile No. <span className="text-red-500">*</span>
              </label>
              <input
                id={`${uid}-phone`}
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter Mobile No."
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor={`${uid}-city`} className={labelClass}>
                Select City <span className="text-red-500">*</span>
              </label>
              <select
                id={`${uid}-city`}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`${inputClass} bg-white`}
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`${uid}-address`} className={labelClass}>
                Full Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id={`${uid}-address`}
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Street / Landmark, Pin Code"
                className={`${inputClass} resize-none`}
              />
            </div>

            {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}

            {/* Disabled while in flight — a double tap on a slow connection
                would otherwise create two identical leads. */}
            <button
              type="submit"
              disabled={sending}
              className="cursor-pointer relative w-full rounded-md bg-linear-to-r from-emerald-600 to-teal-600 py-2.5 pr-10 text-[13px] font-bold text-white hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sending
                ? "Sending…"
                : test
                  ? "Book Now"
                  : "Book Your Sample Collection"}
              <span className=" absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-md bg-emerald-800/90">
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </span>
            </button>

            {/* The consent notice belongs here, next to the button that sends
                the name, mobile and home address — not only in the footer. The
                DPDP Act 2023 wants the notice where the collection happens. */}
            <p className="pt-0.5 text-[10.5px] leading-snug text-slate-400">
              By booking you agree to our{" "}
              <Link href="/privacy" className="underline hover:text-emerald-700">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="underline hover:text-emerald-700">
                Terms
              </Link>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
