import Link from "next/link";
import { SearchX } from "lucide-react";

import { btn } from "@/components/crm/ui";

export const metadata = { title: "Not found" };

export default function CrmNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <SearchX className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="text-[18px] font-semibold text-slate-900">We could not find that</h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">
        The record may have been removed, the link may be mistyped, or it is not one your account can open.
      </p>
      <div className="mt-6 flex gap-2">
        <Link href="/crm" className={btn("primary")}>
          Dashboard
        </Link>
        <Link href="/crm/bookings" className={btn("secondary")}>
          Bookings
        </Link>
      </div>
    </div>
  );
}
