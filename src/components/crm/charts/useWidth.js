"use client";

/**
 * The rendered width of a chart's box, so the SVG draws at 1:1 pixels —
 * a fixed viewBox scaled down to a phone would shrink the axis text to 6px.
 * Starts at a desktop guess for the server render, then follows the box.
 */
import { useEffect, useRef, useState } from "react";

export function useWidth(initial = 640) {
  const ref = useRef(null);
  const [width, setWidth] = useState(initial);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width];
}
