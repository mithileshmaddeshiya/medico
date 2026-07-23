"use client";

import { useEffect } from "react";
import LabLeadCard from "./LabLeadCard";

/**
 * Overlay around LabLeadCard. Opened from a service card's "Book Now" button,
 * with that card's test name pre-selected inside the form.
 */
export default function LabBookingModal({ test, cityOptions, onClose }) {
  // Close on Escape and stop the page behind the overlay from scrolling.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Book ${test}`}
      onClick={onClose}
      className="cursor-pointer lab-fade-in fixed inset-0 z-60 flex items-start sm:items-center justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-sm px-4 py-8"
    >
      <div onClick={(e) => e.stopPropagation()} className="lab-pop-in w-full max-w-sm my-auto">
        <LabLeadCard
          title="Book Your Test"
          test={test}
          cityOptions={cityOptions}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
