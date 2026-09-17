"use client";

import { useEffect, useRef } from "react";
import { CircleCheck, ShoppingCart, X } from "lucide-react";

/**
 * Confirmation after "Add to cart": says what went in and offers the two next
 * steps — go to the cart, or keep browsing.
 *
 * A bottom sheet on phones, a centred dialog from `sm` up. The toast it
 * replaced was easy to miss, and a patient adding one test often did not know
 * where to go next.
 *
 * `test` is the card's own test object, or null when closed.
 */
export default function AddedToCartSheet({ test, onGoToCart, onClose }) {
  const goRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  // Escape closes, the page stops scrolling, focus lands on the main action.
  useEffect(() => {
    if (!test) return;
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    goRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [test]);

  if (!test) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="added-to-cart-title"
      className="fixed inset-0 z-80 flex items-end justify-center print:hidden sm:items-center sm:p-4"
    >
      <div onClick={onClose} className="lab-fade-in absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" />

      <div className="lab-pop-in relative w-full rounded-t-3xl bg-white px-6 pt-8 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-sm sm:rounded-3xl sm:pb-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CircleCheck className="h-10 w-10 text-emerald-600" strokeWidth={2.2} />
          </span>

          <h2 id="added-to-cart-title" className="mt-5 text-[22px] font-bold tracking-tight text-slate-900">
            Added to cart!
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
            {test.name} has been added to your cart.
          </p>
        </div>

        <button
          ref={goRef}
          type="button"
          onClick={onGoToCart}
          className="mt-6 flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-[17px] font-bold text-white shadow-[0_10px_22px_-12px_rgba(5,150,105,0.9)] transition-all hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99]"
        >
          <ShoppingCart className="h-5 w-5" strokeWidth={2.2} />
          Go to Cart
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl text-[16px] font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
