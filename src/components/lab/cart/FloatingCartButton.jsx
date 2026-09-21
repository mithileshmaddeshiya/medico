"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, ShoppingBasket } from "lucide-react";
import { cart, OPEN_CART_HASH, useCartItems } from "./cartStore";

/**
 * The phone's floating cart pill — a centred basket button, in the style of
 * the quick-commerce apps' bottom "Cart" pill.
 *
 * WHY IT EXISTS: NavCartButton — the header's cart icon — is `hidden
 * sm:inline-flex`, because the phone header is already carrying the logo and
 * the call block and has no room for a third control. Without this pill a
 * phone has NO way to the cart — adding a test only shows a toast — so a
 * patient could fill a cart and never find it again.
 *
 * This is the phone half of that pair, so the two are exact complements:
 * `sm:hidden` here, `hidden sm:inline-flex` there. Never both, never neither.
 *
 * It appears ONLY with something in the cart. A floating pill is a permanent
 * imposition on the page under it, and an empty cart has earned nothing.
 *
 * ── CENTRED, ON THE SAME BOTTOM ROW AS THE CALL BUTTON ───────────────────
 * FloatingCallButton owns the bottom-right corner on the home and city pages.
 * On a phone it is a 48px round icon button (the "Book Now" text only appears
 * from sm up), which leaves room for this pill in the centre of the same row
 * even on a 360px screen. Widen either of them and check that they still clear
 * each other.
 *
 * The positioning lives on an outer full-width flex row rather than
 * `left-1/2 -translate-x-1/2` on the button: `lab-pop-in` animates
 * `transform`, and would wipe out the translate for the length of the
 * animation, sliding the pill in from the right.
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

  // Distinct tests, not total quantity: the same test booked 3 times is still
  // one item in the basket, so the badge shows 1.
  const count = Object.values(items).filter((q) => Math.floor(Number(q) || 0) > 0).length;

  // 0 on the server and on the first paint, then filled in from storage — the
  // same snapshot rule as the rest of the cart, so no hydration mismatch.
  if (count === 0) return null;

  const tests = `${count} ${count === 1 ? "test" : "tests"}`;
  const label = `Cart — ${tests}`;

  const onClick = () => {
    if (cart.open()) return;
    router.push(`${cart.homePage()}${OPEN_CART_HASH}`);
  };

  return (
    // Full-width row that ignores taps, so only the pill itself is clickable
    // and the page on either side of it stays usable.
    // `env(safe-area-inset-bottom)` keeps it clear of the iOS home indicator.
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex justify-center sm:hidden print:hidden">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="lab-pop-in group pointer-events-auto relative flex h-12 cursor-pointer items-center gap-2.5 overflow-hidden rounded-full bg-linear-to-b from-emerald-500 via-emerald-600 to-teal-700 py-1.5 pl-1.5 pr-4 text-white ring-1 ring-emerald-900/20 shadow-[0_14px_28px_-10px_rgba(4,120,87,0.75),0_4px_10px_-4px_rgba(15,23,42,0.35),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(6,78,59,0.35)] transition-transform duration-200 active:scale-[0.97]"
      >
        {/* Glossy top highlight — the soft light band that makes the pill read
            as a physical, slightly domed button rather than a flat sticker. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/30 to-transparent"
        />

        {/* The basket, on a white disc, with the count badge on its shoulder.
            The same amber badge as the header's cart icon. `key={count}`
            replays the pop on every change, so adding a test from halfway down
            a long page is visibly acknowledged down here. */}
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[inset_0_-2px_4px_rgba(4,120,87,0.15),0_2px_6px_-2px_rgba(6,78,59,0.5)]">
          <ShoppingBasket className="h-4.5 w-4.5 text-emerald-600" strokeWidth={2.3} />
          <span
            key={count}
            aria-hidden
            className="lab-pop-in absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-extrabold leading-none tabular-nums text-slate-900 ring-2 ring-emerald-600"
          >
            {count}
          </span>
        </span>

        <span className="relative flex flex-col items-start leading-none">
          <span className="text-[15px] font-extrabold tracking-tight">Cart</span>
          <span className="mt-0.5 text-[11px] font-semibold text-emerald-50/90">
            {tests}
          </span>
        </span>

        <ChevronRight
          aria-hidden
          className="relative -mr-1 ml-1 h-4.5 w-4.5 shrink-0 text-white/90 transition-transform duration-200 group-active:translate-x-0.5"
          strokeWidth={2.6}
        />
      </button>
    </div>
  );
}
