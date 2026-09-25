import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { ActionForm, SubmitButton } from "@/components/crm/forms";
import { Card, Facts, Field, Input, PageHeader } from "@/components/crm/ui";
import { SLA_DEFAULTS } from "@/lib/crm/constants";
import { has, requirePerm } from "@/lib/crm/guard";
import { ROLE_LABEL } from "@/lib/crm/permissions";
import { SLA_FIELDS, getSlaSettings } from "@/lib/crm/stores/system";

import { saveSlaAction } from "./actions";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

/**
 * CRM settings: the SLA timings the dashboard and alerts measure against.
 * Website content, SEO, city pages and popups stay in the website admin.
 */
export default async function SettingsPage() {
  const user = await requirePerm("settings.manage", "/crm/settings");
  const sla = await getSlaSettings();

  return (
    <>
      <PageHeader title="Settings" description="Service-level timings used for delay alerts, and where the rest of the system is configured." />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="SLA timings" description="When a booking counts as delayed. Alerts and the dashboard read these values.">
            <ActionForm action={saveSlaAction} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {SLA_FIELDS.map((f) => (
                  <Field key={f.key} label={`${f.label} (${f.unit})`} required htmlFor={`sla-${f.key}`} hint={`${f.hint} Default ${SLA_DEFAULTS[f.key]}.`}>
                    <Input id={`sla-${f.key}`} name={f.key} type="number" min={f.min} max={f.max} step="0.5" defaultValue={sla[f.key]} required inputMode="decimal" />
                  </Field>
                ))}
              </div>
              <SubmitButton className="w-full sm:w-auto">Save timings</SubmitButton>
            </ActionForm>
          </Card>
        </div>
        <div className="space-y-5">
          <Card title="You">
            <Facts
              cols={1}
              items={[
                { label: "Signed in as", value: user.name || user.email },
                { label: "Role", value: ROLE_LABEL[user.role] ?? user.role },
                { label: "Permissions", value: user.role === "owner" ? "Everything (owner)" : `${user.perms.length} granted` },
              ]}
            />
          </Card>
          <Card title="Elsewhere">
            <ul className="space-y-3 text-[13.5px]">
              <li>
                <a href="/admin" className="inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:underline">
                  Website admin <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
                <p className="mt-0.5 text-[12.5px] text-slate-500">Blog, city pages, SEO, redirects, images, popups and filter chips.</p>
              </li>
              {has(user, "roles.manage") && (<li>
                <Link href="/crm/roles" className="font-semibold text-blue-700 hover:underline">
                  Roles &amp; permissions
                </Link>
                <p className="mt-0.5 text-[12.5px] text-slate-500">What each role may see and do.</p>
              </li>)}
              {has(user, "users.manage") && (<li>
                <Link href="/crm/users" className="font-semibold text-blue-700 hover:underline">
                  Users
                </Link>
                <p className="mt-0.5 text-[12.5px] text-slate-500">Staff and lab-partner accounts.</p>
              </li>)}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
