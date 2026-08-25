"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  MapPin,
  User,
  X,
} from "lucide-react";

import { postLead, validateLead } from "@/components/lab/leadForm";

/**
 * The card inside the on-load popup.
 *
 * ── WHY THIS IS NOT LabLeadCard ──────────────────────────────────────────
 * LabLeadCard is the form a visitor went looking for: they scrolled to the
 * hero or tapped "Book Now", so it can afford a labelled field per line and an
 * optional address box. This one interrupts someone who has not asked for
 * anything yet. It has about three seconds to look like a service rather than
 * an ad, and every field it adds is a reason to hit the X.
 *
 * So it is built the other way round: the artwork does the talking and the
 * card prints no heading at all, there are no visible labels (an icon and the
 * placeholder carry each field), a +91 chip means the mobile box needs no
 * explaining, and there are three fields — name, mobile, city. Address is not
 * asked at all; the callback collects it, which is what the long form's own
 * note says happens anyway.
 *
 * What it does NOT do differently is submit. The rules, the endpoint and the
 * failure copy come from leadForm.js, the same module LabLeadCard uses, so a
 * popup lead is written to Firestore and pushed to the shop's WhatsApp by
 * exactly the same path as a hero booking.
 */

const FALLBACK_CITY_OPTIONS = ["Other"];

// One field shell: 44px tall so it is a comfortable tap target, a hairline
// border rather than the hero card's heavier one, and a tinted fill that turns
// white on focus — the field being typed into is then the only white one,
// which is what carries the eye down a form with no labels on it.
const fieldBase =
  "h-11 w-full rounded-lg border bg-slate-50 text-[13.5px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:bg-white";

const fieldIdle =
  "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

const fieldBad =
  "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

const shell = (bad) => `${fieldBase} ${bad ? fieldBad : fieldIdle}`;

const iconClass =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400";

export default function PopupLeadForm({ cityOptions, image, imageAlt, onClose }) {
  const cities = cityOptions?.length ? cityOptions : FALLBACK_CITY_OPTIONS;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [invalid, setInvalid] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const uid = useId();
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const cityRef = useRef(null);

  // Same pattern as the long form: the message is a toast so the card cannot
  // change height mid-typing, and the box it refers to turns red so there is
  // no doubt which of the three it means.
  const complain = (field, ref, message) => {
    setInvalid(field);
    toast.error(message, { id: "lab-lead-popup" });
    ref.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    const problem = validateLead({ name, phone, city });
    if (problem) {
      const refs = { name: nameRef, phone: phoneRef, city: cityRef };
      return complain(problem.field, refs[problem.field], problem.message);
    }

    setInvalid("");
    setSending(true);

    // No address and no test — this form collects neither, and the API treats
    // both as optional.
    const result = await postLead({ name, phone, city, address: "", test: "" });
    setSending(false);

    if (!result.ok) {
      toast.error(result.error, { id: "lab-lead-popup" });
      return;
    }

    setSent(true);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-25px_rgba(2,44,34,0.6)] ring-1 ring-slate-900/10">
      {/* ── HEADER IMAGE ───────────────────────────────────────────────────
          formpopimg.png is drawn for this popup and nothing else: logo,
          headline, four promise icons, then a "Book Lab Test at Home" pill and
          a decorative wave along the bottom.

          At its own 3:2 it was 256px tall on a 384px card — half the popup
          before a single field. `object-top` at 15/8 takes the bottom fifth
          off, which is exactly that pill and that wave: the cut lands in the
          gap under the icon labels, so nothing is sliced in half. What is lost
          is the pill's wording, and the card does not reprint it — the
          headline and the "Home Sample Collection" icon still in frame say the
          same thing.

          Change this one ratio to trim more or less; a ratio rather than a
          fixed height so the crop lands the same on a 320px phone as on a
          desktop. */}
      <div className="relative aspect-15/8 w-full bg-slate-100">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="384px"
          className="object-cover object-top"
        />
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/85 text-slate-600 shadow-sm ring-1 ring-slate-900/10 backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-900"
        >
          <X className="h-4 w-4" strokeWidth={2.4} />
        </button>
      )}

      <div className="px-5 pb-5 pt-3.5">
        {sent ? (
          // Short on purpose. The long form's confirmation runs a three-step
          // timeline because that reader chose to be there; this one is closing
          // an interruption, so it answers only "did it go, and what now".
          <div className="py-2 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-4 ring-emerald-100/70">
              <Check className="h-6 w-6" strokeWidth={3} />
            </span>

            <h2 className="mt-3 text-[16px] font-extrabold tracking-tight text-slate-900">
              Request received
            </h2>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-600">
              We will call you on{" "}
              <span className="font-bold text-slate-900">{phone}</span> within 30
              minutes.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 h-11 w-full cursor-pointer rounded-lg bg-linear-to-r from-emerald-600 to-teal-600 text-[13px] font-bold text-white transition-all hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        ) : (
          // No heading here — the image above is the heading. See the note on
          // the header image.
          <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
            {/* No painted labels — the icon and the placeholder carry the
                field, which is what keeps the whole card inside a phone
                screen without scrolling. The labels are still in the DOM for
                a screen reader, just not drawn. */}
            <div className="relative">
              <label htmlFor={`${uid}-name`} className="sr-only">
                Your name
              </label>
              <User className={iconClass} strokeWidth={2.2} />
              <input
                ref={nameRef}
                id={`${uid}-name`}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (invalid === "name") setInvalid("");
                }}
                aria-invalid={invalid === "name" || undefined}
                placeholder="Your full name"
                className={`${shell(invalid === "name")} pl-9 pr-3`}
              />
            </div>

            {/* A +91 chip instead of a "Mobile No." label: it says what the
                box wants, and in what format, in the width of three
                characters. */}
            <div className="relative">
              <label htmlFor={`${uid}-phone`} className="sr-only">
                Mobile number
              </label>
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 flex h-11 w-12 items-center justify-center border-r border-slate-200 text-[12.5px] font-bold text-slate-500"
              >
                +91
              </span>
              <input
                ref={phoneRef}
                id={`${uid}-phone`}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  if (invalid === "phone") setInvalid("");
                }}
                aria-invalid={invalid === "phone" || undefined}
                placeholder="10 digit mobile number"
                className={`${shell(invalid === "phone")} pl-14 pr-3`}
              />
            </div>

            <div className="relative">
              <label htmlFor={`${uid}-city`} className="sr-only">
                Your city
              </label>
              <MapPin className={iconClass} strokeWidth={2.2} />
              {/* `appearance-none` plus our own chevron: the native arrow is
                  a different shape and colour in every browser, and it was
                  the one control here that did not match the rest. */}
              <select
                ref={cityRef}
                id={`${uid}-city`}
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (invalid === "city") setInvalid("");
                }}
                aria-invalid={invalid === "city" || undefined}
                className={`${shell(invalid === "city")} cursor-pointer appearance-none pl-9 pr-9 ${
                  city ? "" : "text-slate-400"
                }`}
              >
                <option value="">Select your city / area</option>
                {cities.map((option) => (
                  <option key={option} value={option} className="text-slate-900">
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={2.4}
              />
            </div>

            {/* Disabled while in flight — a double tap on a slow connection
                would otherwise create two identical leads. */}
            <button
              type="submit"
              disabled={sending}
              className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-emerald-600 to-teal-600 text-[13.5px] font-bold text-white shadow-[0_10px_22px_-12px_rgba(5,150,105,0.95)] transition-all hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Book Now
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.6}
                  />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
