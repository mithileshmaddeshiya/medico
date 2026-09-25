"use client";

/**
 * Any page in the CRM that throws lands here instead of a raw stack trace.
 * The real error is in the server log (with the digest shown below, so a
 * report from staff can be matched to it); the person gets a way forward.
 */
import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, WifiOff } from "lucide-react";

import { btn } from "@/components/crm/ui";

export default function CrmError({ error, unstable_retry, reset }) {
  const retry = unstable_retry ?? reset;
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;

  useEffect(() => {
    console.error("[crm] page error", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        {offline ? <WifiOff className="h-6 w-6" aria-hidden /> : <RefreshCw className="h-6 w-6" aria-hidden />}
      </span>
      <h1 className="text-[18px] font-semibold text-slate-900">
        {offline ? "You are offline" : "This page could not load"}
      </h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">
        {offline
          ? "Check the phone's internet connection, then try again. Nothing you saved has been lost."
          : "Something went wrong while fetching the latest data. Trying again usually fixes it."}
      </p>
      {error?.digest && <p className="mt-2 text-[11.5px] text-slate-400">Reference: {error.digest}</p>}
      <div className="mt-6 flex gap-2">
        <button type="button" onClick={() => retry?.()} className={btn("primary")}>
          Try again
        </button>
        <Link href="/crm" className={btn("secondary")}>
          Dashboard
        </Link>
      </div>
    </div>
  );
}
