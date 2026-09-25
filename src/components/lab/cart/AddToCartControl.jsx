"use client";

import { useState } from "react";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { MAX_QTY } from "@/lib/labCart";
import { cart } from "./cartStore";

/**
 * "Add" until the test is in the cart, then a − qty + stepper in the same box,
 * so the card never changes height and the thumb is already on the control.
 *
 * `block` stretches it to the card's width (desktop cards); without it, it is a
 * compact pill for the phone rows. `size="lg"` is the taller, squarer
 * button the test cards use (h-11, rounded-lg).
 */

/* How long "Add to cart" shows its spinner before the stepper takes over. */
const ADD_DELAY_MS = 450;

export default function AddToCartControl({ test, qty = 0, block = false, size = "md" }) {
  const width = block ? "w-full" : "min-w-[104px]";
  const box = size === "lg" ? "h-11 rounded-lg text-[14px]" : "h-9 rounded-full text-[12.5px]";
  const [adding, setAdding] = useState(false);

  if (qty === 0) {
    return (
      <button
        type="button"
        disabled={adding}
        aria-busy={adding}
        onClick={async () => {
          setAdding(true);
          await new Promise((r) => setTimeout(r, ADD_DELAY_MS));
          cart.add(test.id);
          setAdding(false);
          // A small toast, not a sheet — the "Added to cart" bottom sheet was
          // removed because it covered the page after every add. The floating
          // cart pill (FloatingCartButton) is the way to the cart on a phone.
          toast.success(`${test.name} added to cart`, { id: "lab-cart" });
        }}
        aria-label={`Add ${test.name} to cart`}
        className={`${width} cursor-pointer inline-flex ${box} items-center justify-center gap-1.5 bg-linear-to-r from-emerald-600 to-teal-600 px-4 font-bold text-white shadow-[0_6px_14px_-8px_rgba(5,150,105,0.9)] transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-[0_10px_20px_-10px_rgba(5,150,105,0.95)] active:scale-[0.97] disabled:cursor-wait disabled:opacity-90`}
      >
        {adding ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.6} />
            Adding…
          </>
        ) : (
          <>
            <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2.4} />
            Add to cart
          </>
        )}
      </button>
    );
  }

  const step =
    "flex h-full w-9 cursor-pointer items-center justify-center text-emerald-700 transition-colors hover:bg-emerald-100 active:bg-emerald-200 disabled:cursor-not-allowed disabled:text-emerald-300 disabled:hover:bg-transparent";

  return (
    <div
      role="group"
      aria-label={`${test.name} quantity`}
      className={`${width} inline-flex ${box} items-center justify-between overflow-hidden bg-emerald-50 ring-1 ring-emerald-300`}
    >
      <button
        type="button"
        onClick={() => cart.setQty(test.id, qty - 1)}
        aria-label={qty === 1 ? `Remove ${test.name}` : `One less ${test.name}`}
        className={step}
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2.6} />
      </button>
      <span aria-live="polite" className="min-w-6 text-center text-[13px] font-extrabold tabular-nums text-emerald-800">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => cart.setQty(test.id, qty + 1)}
        disabled={qty >= MAX_QTY}
        aria-label={`One more ${test.name}`}
        className={step}
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
      </button>
    </div>
  );
}
