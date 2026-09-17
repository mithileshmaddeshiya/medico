"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { MAX_QTY } from "@/lib/labCart";
import { cart, OPEN_CART_HASH, useCartItems } from "./cartStore";

/**
 * The header's cart icon, on every route.
 *
 * The badge counts from the stored cart alone — ids and quantities — because
 * the header has no price list. Prices, names and the bill live in the drawer,
 * which belongs to the test section (LabServices), so a tap:
 *
 *   - on a page WITH a test section (home, /lab-test/<city>) opens that drawer;
 *   - on any other page (a guide, /about) goes back to the page the cart was
 *     filled on, and the drawer opens there as it loads (#cart).
 *
 * The badge is 0 on the server and on the first paint, then fills in from
 * storage — the same snapshot rule as the rest of the cart, so no hydration
 * mismatch.
 */
export default function NavCartButton() {
  const router = useRouter();
  const items = useCartItems();

  const count = Object.values(items).reduce(
    (sum, q) => sum + Math.min(MAX_QTY, Math.max(0, Math.floor(Number(q) || 0))),
    0
  );

  const onClick = () => {
    if (cart.open()) return;
    router.push(`${cart.homePage()}${OPEN_CART_HASH}`);
  };

  const label =
    count === 0 ? "Cart — empty" : `Cart — ${count} ${count === 1 ? "test" : "tests"}`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="relative hidden sm:inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-emerald-700 ring-1 ring-emerald-200/70 shadow-sm transition-all duration-200 hover:ring-emerald-300 hover:shadow-md hover:text-emerald-800 active:scale-[0.96]"
    >
      <ShoppingCart className="h-5 w-5" strokeWidth={2.2} />
      {count > 0 && (
        <span
          key={count}
          className="lab-pop-in absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-extrabold leading-none text-slate-900 ring-2 ring-white tabular-nums"
        >
          {count}
        </span>
      )}
    </button>
  );
}
