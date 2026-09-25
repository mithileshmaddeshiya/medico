import { query } from "@/lib/db";
import { Card, Facts, Field, Input, PageHeader } from "@/components/crm/ui";
import { ActionForm, SubmitButton } from "@/components/crm/forms";
import { requirePerm } from "@/lib/crm/guard";
import { dateTime } from "@/lib/crm/format";
import { ROLE_LABEL } from "@/lib/crm/permissions";

import { changePassword, updateProfile } from "../actions";

export const metadata = { title: "Your profile" };
export const dynamic = "force-dynamic";

export default async function Profile() {
  const user = await requirePerm(null, "/crm/profile");
  const [[me], [partnerRows]] = await Promise.all([
    query("SELECT name, email, phone, role, last_login_at, created_at FROM admin_users WHERE id = ?", [user.id]).then(([r]) => r),
    user.isPartner ? query("SELECT name, city, phone FROM partners WHERE id = ?", [user.partnerId]) : Promise.resolve([[]]),
  ]);
  const partner = partnerRows[0];

  return (
    <>
      <PageHeader title="Your profile" description="Your name, contact number and password." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Account">
          <Facts
            items={[
              { label: "Email (sign-in)", value: me.email },
              { label: "Role", value: ROLE_LABEL[me.role] ?? me.role },
              ...(partner ? [{ label: "Lab", value: `${partner.name}${partner.city ? `, ${partner.city}` : ""}` }] : []),
              { label: "Last sign-in", value: dateTime(me.last_login_at) },
            ]}
          />
          <ActionForm action={updateProfile} className="mt-5 space-y-4 border-t border-slate-100 pt-5">
            <Field label="Name" required htmlFor="name">
              <Input id="name" name="name" defaultValue={me.name} required maxLength={80} />
            </Field>
            <Field label="Mobile" hint="Shown to colleagues so they can call you about a booking." htmlFor="phone">
              <Input id="phone" name="phone" defaultValue={me.phone} inputMode="numeric" maxLength={10} />
            </Field>
            <SubmitButton>Save</SubmitButton>
          </ActionForm>
        </Card>

        <Card title="Change password" description="At least 10 characters. Changing it signs you out on every device.">
          <ActionForm action={changePassword} className="space-y-4">
            <Field label="Current password" htmlFor="current" required>
              <Input id="current" name="current" type="password" autoComplete="current-password" required />
            </Field>
            <Field label="New password" htmlFor="next" required>
              <Input id="next" name="next" type="password" autoComplete="new-password" minLength={10} required />
            </Field>
            <Field label="Repeat new password" htmlFor="confirm" required>
              <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={10} required />
            </Field>
            <SubmitButton variant="secondary">Change password</SubmitButton>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
