"use client";

import { useId, useRef, useState } from "react";
import toast from "react-hot-toast";
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

// Swapped in for the field the toast is complaining about, so the message and
// the box it refers to are obviously the same thing.
const invalidClass =
  "w-full rounded-md border border-red-400 bg-red-50/40 px-3 py-2 text-[13px] text-slate-900 placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none";

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
  // Which required field is blank/wrong — turns that one box red. The message
  // itself is a toast, so the card's height never jumps mid-form.
  const [invalid, setInvalid] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Hero card and the booking modal can both be mounted — keep field ids unique.
  const uid = useId();

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const cityRef = useRef(null);

  /**
   * Tell the patient exactly what is missing and put them in that field.
   *
   * A toast rather than a line of red text under the button: on a phone the
   * button is often the only thing on screen, and the old inline error appeared
   * above it — off-screen, so a tap on "Book Now" looked like it did nothing.
   *
   * `id` keeps a fast double-tap from stacking three copies of the same toast.
   */
  const complain = (field, ref, message) => {
    setInvalid(field);
    toast.error(message, { id: "lab-lead-form" });
    ref.current?.focus();
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    if (name.trim().length < 2)
      return complain("name", nameRef, "Apna naam likhiye — hum isi naam se call karenge.");
    if (!/^[6-9]\d{9}$/.test(phone))
      return complain("phone", phoneRef, "10 digit ka mobile number likhiye, jaise 98912 34567.");
    if (!city)
      return complain("city", cityRef, "Apna city select kijiye taaki sahi team bheji ja sake.");
    // Address is optional — the team confirms the full address on the follow-up
    // call, so a patient can book without typing it out.

    setInvalid("");
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
        toast.error(result.error || `Booking nahi ho payi. ${LAB_PHONE} par call kar lijiye.`, {
          id: "lab-lead-form",
        });
        return;
      }

      setSent(true);
    } catch {
      // Offline, or the request never reached us — the phone number is the
      // fallback that always works.
      toast.error("Internet check kijiye, ya seedhe call kar lijiye.", { id: "lab-lead-form" });
    } finally {
      setSending(false);
    }
  };

  // "Book another test" — back to an empty form, keeping the card in place.
  const reset = () => {
    setSent(false);
    setInvalid("");
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
          //
          // Copy is plain Hinglish, the same language as the guide and FAQ on
          // these pages. It used to read "Booking confirmed / Phlebotomist
          // reaches your door" — accurate, but "phlebotomist" is a word most
          // patients here have never met, and it sat at the one moment they
          // most need to understand what happens next.
          //
          // Kept short on purpose: this replaces the form in place, so anything
          // longer than the form it replaced makes the card jump in height —
          // in the modal that means the confirmation opens already scrolled.
          <div className="py-3">
            <div className="text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-4 ring-emerald-100/70">
                <Check className="h-5 w-5" strokeWidth={3} />
              </span>

              <h3 className="mt-2.5 text-[15px] font-extrabold tracking-tight text-slate-900">
                Form submit ho gaya
              </h3>
              <p className="mt-1 text-[12.5px] leading-snug text-slate-600">
                Thank you{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}. Ab aapko
                kuch nahi karna{test ? ` — ${test} book ho gaya hai` : ""}.
              </p>
            </div>

            {/* What happens next, with the times we actually promise. Removes
                the "should I call them?" doubt that follows a silent form. */}
            <ol className="mt-3.5 space-y-2.5">
              {[
                {
                  icon: PhoneCall,
                  h: `Hum call karenge — ${phone}`,
                  s: "30 minute me, time confirm karne ke liye",
                },
                {
                  icon: Clock,
                  h: "Staff ghar aayega sample lene",
                  s: "Time confirm hone ke 60 minute me",
                },
                {
                  icon: Check,
                  h: "Report WhatsApp par",
                  s: "24 ghante me, PDF me",
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
                Abhi call karein — {LAB_PHONE}
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
                {onClose ? "Wapas tests par jayein" : "Ek aur test book karein"}
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
              {/* The red ring clears the moment they start typing — leaving it
                  on while the field is being fixed reads as "still wrong". */}
              <input
                ref={nameRef}
                id={`${uid}-name`}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (invalid === "name") setInvalid("");
                }}
                aria-invalid={invalid === "name" || undefined}
                placeholder="Enter Name"
                className={invalid === "name" ? invalidClass : inputClass}
              />
            </div>

            <div>
              <label htmlFor={`${uid}-phone`} className={labelClass}>
                Mobile No. <span className="text-red-500">*</span>
              </label>
              <input
                ref={phoneRef}
                id={`${uid}-phone`}
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  if (invalid === "phone") setInvalid("");
                }}
                aria-invalid={invalid === "phone" || undefined}
                placeholder="Enter Mobile No."
                className={invalid === "phone" ? invalidClass : inputClass}
              />
            </div>

            <div>
              <label htmlFor={`${uid}-city`} className={labelClass}>
                Select City <span className="text-red-500">*</span>
              </label>
              <select
                ref={cityRef}
                id={`${uid}-city`}
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (invalid === "city") setInvalid("");
                }}
                aria-invalid={invalid === "city" || undefined}
                className={`${invalid === "city" ? invalidClass : inputClass} bg-white`}
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`${uid}-address`} className={labelClass}>
                Full Address{" "}
                <span className="font-normal text-slate-400">(optional)</span>
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

            {/* Disabled while in flight — a double tap on a slow connection
                would otherwise create two identical leads. */}
            {/* While sending, the arrow box goes and the spinner sits next to
                the label in the middle of the button — spinning off in the
                corner it read as a stray animation rather than as "your form is
                going". `pr-10` only applies when the box is there to clear. */}
            <button
              type="submit"
              disabled={sending}
              className={`cursor-pointer relative flex w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-emerald-600 to-teal-600 py-2.5 text-[13px] font-bold text-white hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-70 ${
                sending ? "" : "pr-10"
              }`}
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  {test ? "Book Now" : "Book Your Sample Collection"}
                  <span className="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-md bg-emerald-800/90">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </>
              )}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
