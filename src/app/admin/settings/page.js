import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import { Card, Checkbox, Field, Input, PageHeader } from "@/components/admin/ui";
import { requireRole } from "@/lib/admin/guard";
import { getSettings, SETTINGS } from "@/lib/admin/settings";
import { SITE, SITE_PHONE, SITE_PHONE_E164 } from "@/lib/site";

import { saveSettingsAction } from "./actions";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireRole("owner", "/admin/settings");
  const values = await getSettings();

  return (
    <>
      <PageHeader title="Settings" subtitle="Switches that change what visitors see, without a deploy." />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <Card title="Site">
          <ActionForm action={saveSettingsAction} className="space-y-5">
            {SETTINGS.map((item) =>
              item.type === "boolean" ? (
                <Checkbox
                  key={item.key}
                  name={item.key}
                  defaultChecked={values[item.key] === "1"}
                  label={item.label}
                  hint={item.hint}
                />
              ) : (
                <Field key={item.key} label={item.label} hint={item.hint}>
                  <Input name={item.key} defaultValue={values[item.key] ?? ""} />
                </Field>
              )
            )}

            <SubmitButton>Save settings</SubmitButton>
          </ActionForm>
        </Card>

        <div className="space-y-6">
          {/*
            Read-only, and the explanation matters more than the values.

            The phone number exists once, in src/lib/site.js, and everything
            else — the footer, the tel: links, the WhatsApp handoff, the
            structured data — is derived from it. That file documents the
            failure this prevents: two different numbers were once published on
            the same domain, one in the visible site and one in the schema, and
            that is precisely the signal that stops a business being matched to
            a single entity in local search. A settings row that could drift
            from the constant would reintroduce it.
          */}
          <Card title="Fixed in code, on purpose">
            <dl className="space-y-4">
              <div>
                <dt className="text-[11.5px] font-bold uppercase tracking-wide text-slate-500">
                  Phone
                </dt>
                <dd className="mt-1 text-[13.5px] font-semibold text-slate-800">{SITE_PHONE}</dd>
                <dd className="text-[12px] text-slate-500">{SITE_PHONE_E164}</dd>
              </div>

              <div>
                <dt className="text-[11.5px] font-bold uppercase tracking-wide text-slate-500">
                  Site URL
                </dt>
                <dd className="mt-1 text-[13.5px] font-semibold text-slate-800">{SITE}</dd>
              </div>
            </dl>

            <p className="mt-4 border-t border-slate-100 pt-3 text-[12px] leading-relaxed text-slate-500">
              These are written once in <code>src/lib/site.js</code> and every other place they
              appear is derived from them — the footer, every <code>tel:</code> link, the WhatsApp
              handoff and the structured data on every page.
              <br />
              <br />
              They are not editable here because local search ranking depends on the name, address
              and phone number matching everywhere, and this site has already been through the
              version of this that goes wrong: a second phone number was hardcoded in the schema
              while the visible site showed another. Changing the number is a one-line code change,
              and then it is right in all of those places at once.
            </p>
          </Card>

        </div>
      </div>
    </>
  );
}
