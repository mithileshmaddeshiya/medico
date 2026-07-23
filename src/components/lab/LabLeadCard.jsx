"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";

const WHATSAPP = "919891233525";

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
  const [sent, setSent] = useState(false);

  // Hero card and the booking modal can both be mounted — keep field ids unique.
  const uid = useId();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!city) return setError("Please select your city.");
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Please enter a valid 10-digit mobile number.");
    if (address.trim().length < 10) return setError("Please enter your full address.");

    setError("");

    // No backend yet — the request goes to WhatsApp with the details pre-filled.
    const text = encodeURIComponent(
      [
        test ? `Lab test booking request` : `Sample collection booking request`,
        test ? `Test: ${test}` : null,
        `Name: ${name}`,
        `Mobile: ${phone}`,
        `City: ${city}`,
        `Address: ${address}`,
      ]
        .filter(Boolean)
        .join("\n")
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank", "noopener,noreferrer");

    setSent(true);
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
          <div className="text-center py-6">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <Check className="h-5 w-5" strokeWidth={3} />
            </span>
            <h3 className="mt-3 text-sm font-bold text-slate-900">Request received</h3>
            <p className="mt-1 text-[12px] text-slate-600">
              We will call you on <span className="font-semibold">{phone}</span> shortly.
            </p>
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

            <button
              type="submit"
              className="cursor-pointer relative w-full rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 pr-10 text-[13px] font-bold text-white hover:from-emerald-700 hover:to-teal-700"
            >
              {test ? "Book Now" : "Book Your Sample Collection"}
              <span className=" absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-md bg-emerald-800/90">
                <ArrowRight className="h-4 w-4" />
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
