"use client";

import { useSyncExternalStore } from "react";
import { MAX_LINES, MAX_QTY } from "@/lib/labCart";

/**
 * The lab-test cart: `{ [testId]: qty }`, nothing else.
 *
 * A module-level store read through useSyncExternalStore rather than a React
 * context, so it needs no provider in a layout — the cart lives entirely inside
 * the test section, and any number of sections on a page see the same cart.
 *
 * Prices are never stored. They are looked up from the page's own test list at
 * render time, and again by the server at checkout, so a cart saved last week
 * can never show or charge last week's price.
 *
 * Persisted to localStorage so a refresh or a trip to a guide page does not
 * empty it. Storage can be missing or throw (private mode, blocked site data);
 * the cart then simply lives for the visit.
 */

const KEY = "mb-lab-cart-v1";
const EMPTY = Object.freeze({});

let items = EMPTY;
let loaded = false;
const listeners = new Set();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
    if (parsed && typeof parsed === "object") items = parsed;
  } catch {
    items = EMPTY;
  }
}

function commit(next) {
  items = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable — the in-memory cart still works.
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  load();
  listeners.add(fn);

  // Another tab changed the cart.
  const onStorage = (e) => {
    if (e.key !== KEY) return;
    try {
      items = JSON.parse(e.newValue ?? "{}") ?? EMPTY;
    } catch {
      items = EMPTY;
    }
    fn();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  load();
  return items;
};
const getServerSnapshot = () => EMPTY;

/*
 * Where the cart was filled. The drawer needs that page's price list, which
 * only a test section has — so the header's cart icon, tapped on a page with
 * no test section (a guide, /about), sends the visitor back here instead.
 */
const PAGE_KEY = "mb-lab-cart-page";

/*
 * Test sections that can open the drawer on the current page. The header's
 * cart icon calls the most recently mounted one; with none mounted it falls
 * back to navigating to PAGE_KEY.
 */
const openers = [];

export const cart = {
  setQty(id, qty) {
    const q = Math.min(MAX_QTY, Math.max(0, Math.floor(qty)));
    const next = { ...items };
    if (q === 0) delete next[id];
    else if (next[id] || Object.keys(next).length < MAX_LINES) next[id] = q;
    if (q > 0) {
      try {
        window.localStorage.setItem(PAGE_KEY, window.location.pathname);
      } catch {
        // Storage unavailable — the header falls back to the home page.
      }
    }
    commit(next);
  },
  add(id) {
    this.setQty(id, (items[id] ?? 0) + 1);
  },
  remove(id) {
    this.setQty(id, 0);
  },
  clear() {
    commit(EMPTY);
  },

  /** A test section offers its drawer. Returns the unregister function. */
  registerOpener(fn) {
    openers.push(fn);
    return () => {
      const i = openers.lastIndexOf(fn);
      if (i !== -1) openers.splice(i, 1);
    };
  },

  /** Open the drawer on this page. False when this page has no test section. */
  open() {
    const fn = openers.at(-1);
    if (!fn) return false;
    fn();
    return true;
  },

  /** The page the cart was filled on, for pages that cannot show the drawer. */
  homePage() {
    try {
      const path = window.localStorage.getItem(PAGE_KEY);
      if (path && path.startsWith("/")) return path;
    } catch {
      // fall through
    }
    return "/";
  },
};

/** The hash a page is sent to when the drawer should open as it loads. */
export const OPEN_CART_HASH = "#cart";

/** The current cart. `{}` during server render and the first client paint. */
export const useCartItems = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
