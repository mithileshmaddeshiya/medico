"use client";

import { usePathname } from "next/navigation";

/**
 * Echoes the address the reader actually typed back to them on the 404.
 *
 * app/not-found.js receives no params or URL, so the path can only be read on
 * the client. Seeing their own URL is what lets a reader spot the typo
 * ("/lab-tset/varanasi") instead of assuming the whole site is broken.
 */
export default function NotFoundPath() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  return (
    <p className="mx-auto mt-5 flex max-w-full items-center justify-center gap-2 text-[12.5px] text-slate-500">
      <span className="shrink-0">Aapne khola:</span>
      <code className="truncate rounded-md bg-slate-900/[0.04] px-2 py-1 font-mono text-[12px] text-slate-700 ring-1 ring-slate-200">
        {pathname}
      </code>
    </p>
  );
}
