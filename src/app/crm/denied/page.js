import Link from "next/link";
import { Lock } from "lucide-react";

import { btn } from "@/components/crm/ui";
import { getCrmUser } from "@/lib/crm/guard";
import { ROLE_LABEL } from "@/lib/crm/permissions";

export const metadata = { title: "No access" };

/** Where requirePerm() sends someone whose role does not cover a page. */
export default async function Denied() {
  const user = await getCrmUser();
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <Lock className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="text-[18px] font-semibold text-slate-900">Your role cannot open that page</h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">
        You are signed in as <strong className="font-semibold text-slate-700">{ROLE_LABEL[user?.role] ?? user?.role ?? "a guest"}</strong>. If you need
        this section, ask the owner to change your role in Roles &amp; permissions.
      </p>
      <Link href="/crm" className={`${btn("primary")} mt-6`}>
        Back to dashboard
      </Link>
    </div>
  );
}
