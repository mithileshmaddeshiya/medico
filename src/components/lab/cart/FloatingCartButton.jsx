"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { MAX_QTY } from "@/lib/labCart";
import { cart, OPEN_CART_HASH, useCartItems } from "./cartStore";

/**
 * The phone's floating cart pill.
 *
 * WHY IT EXISTS: NavCartButton — the header's cart icon — is `hidden
 * sm:inline-flex`, because the phone header is already carrying the logo and
 * the call block and has no room for a third control. That left a hole: on a
 * phone, once the "Added to cart" sheet was dismissed, there was NO way back
 * to the cart. A patient could fill a cart and never find it again.
 *
 * This is the phone half of that pair, so the two are exact complements:
 * `sm:hidden` here, `hidden sm:inline-flex` there. Never both, never neither.
 *
 * It appears ONLY with something in the cart. A floating pill is a permanent
 * imposition on the page under it, and an empty cart has earned nothing.
 *
 * BOTTOM-LEFT, not bottom-right. FloatingCallButton already owns bottom-right
 * on the home and city pages, and that is the right call — a phone number is
 * this business's primary conversion. Stacking above it was the alternative
 * and it is worse: that pill is dismissible, so the cart would jump down the
 * screen the moment someone closed it.
 *
 * The tap does what the header icon does, for the same reason — the drawer
 * belongs to the test section, which owns the price list:
 *
 *   - on a page WITH a test section, open that drawer;
 *   - anywhere else, go back to the page the cart was filled on and let it
 *     open there (#cart).
 */
export default function FloatingCartButton() {
  const router = useRouter();
  const items = useCartItems();

  const count = Object.values(items).reduce(
    (sum, q) => sum + Math.min(MAX_QTY, Math.max(0, Math.floor(Number(q) || 0))),
    0
  );

  // 0 on the server and on the first paint, then filled in from storage — the
  // same snapshot rule as the rest of the cart, so no hydration mismatch.
  if (count === 0) return null;

  const label = `Cart — ${count} ${count === 1 ? "test" : "tests"}`;

  const onClick = () => {
    if (cart.open()) return;
    router.push(`${cart.homePage()}${OPEN_CART_HASH}`);
  };

  return (
    // `pb-[env(safe-area-inset-bottom)]` keeps the pill clear of the iOS home
    // indicator, the same guard FloatingCallButton needs on the other side.
    <div className="fixed bottom-4 left-4 z-50 pb-[env(safe-area-inset-bottom)] sm:hidden print:hidden">
      <div className="relative">
        {/* The site's emerald→teal gradient, at FloatingCallButton's height and
            weight. Deliberately NOT a colour of its own: two floating pills on
            one screen in two different colours read as two widgets bolted on,
            rather than one site. */}
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          title={label}
          className="lab-pop-in flex h-11 cursor-pointer items-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-5 text-[14px] font-bold text-white shadow-[0_10px_22px_-10px_rgba(5,150,105,0.95)] transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98]"
        >
          <ShoppingCart className="h-4 w-4 shrink-0" strokeWidth={2.4} />
          Cart
        </button>

        {/* Same amber count as the header's cart badge. `key={count}` replays
            the pop on every change, so adding a test from halfway down a long
            page is visibly acknowledged down here. */}
        <span
          key={count}
          aria-hidden
          className="lab-pop-in absolute -right-1 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10.5px] font-extrabold leading-none tabular-nums text-slate-900 ring-2 ring-white"
        >
          {count}
        </span>
      </div>
    </div>
  );
}
