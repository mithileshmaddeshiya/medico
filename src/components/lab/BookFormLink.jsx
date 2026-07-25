"use client";

import { useCallback } from "react";

/**
 * A link to the hero booking form (`#book`, see LabHero) that scrolls there
 * WITHOUT leaving "#book" behind in the address bar.
 *
 * Every CTA on a city page used to be a plain `<a href="#book">`, which meant
 * the moment a visitor pressed "Book a Test" the URL turned into
 * .../lab-test/varanasi#book. Harmless for ranking — the canonical is set and
 * points at the clean slug — but it is the URL people copy and paste.
 *
 * The href stays on the element on purpose: it is what a crawler follows, what
 * a middle-click opens, and what still works if the JS never loads. The
 * default is only cancelled once the target is actually found on the page.
 *
 * Offset for the sticky header comes from `scroll-mt-*` on the target itself,
 * so smooth scrolling here lands in the same place the browser would.
 */
export default function BookFormLink({ className = "", children, ...rest }) {
  const scrollToForm = useCallback((e) => {
    // Modified clicks are the user asking for a new tab/window — leave them be.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    const form = document.getElementById("book");
    if (!form) return; // No form on this page — let the browser follow the href.

    e.preventDefault();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <a href="#book" onClick={scrollToForm} className={className} {...rest}>
      {children}
    </a>
  );
}
