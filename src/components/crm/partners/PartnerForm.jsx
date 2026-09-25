/**
 * The lab partner form, for both "Add partner" and "Edit". Server-rendered;
 * the only client piece is ActionForm (toasts + pending state).
 *
 * The bank account number is never echoed back in full: on edit the field is
 * blank with the masked number as its hint, and leaving it blank keeps the
 * stored one (keepBankAccount).
 */
import { ActionForm, SubmitButton } from "@/components/crm/forms";
import { ButtonLink, Card, Field, Input, Select, Textarea } from "@/components/crm/ui";
import { AGREEMENT_STATUSES, PARTNER_RECORD_STATUSES, maskAccount } from "@/lib/crm/stores/partners";

const ymd = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d ? String(d).slice(0, 10) : "");

export default function PartnerForm({ action, partner = null, cities, cancelHref }) {
  const p = partner ?? {};
  const served = new Set((p.cities ?? []).map((c) => Number(c.id)));
  const editing = Boolean(partner);

  return (
    <ActionForm action={action} className="space-y-5">
      {editing && <input type="hidden" name="id" value={p.id} />}
      {editing && <input type="hidden" name="keepBankAccount" value="1" />}

      <Card title="Lab" description="How the lab appears on orders, statements and in the partner list.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Lab name" required htmlFor="name" className="sm:col-span-2">
            <Input id="name" name="name" required maxLength={160} defaultValue={p.name ?? ""} />
          </Field>
          <Field label="Owner / contact person" htmlFor="contactPerson">
            <Input id="contactPerson" name="contactPerson" maxLength={80} defaultValue={p.contact_person ?? ""} />
          </Field>
          <Field label="Mobile" htmlFor="phone" hint="10 digits, used for Call and WhatsApp.">
            <Input id="phone" name="phone" inputMode="numeric" maxLength={14} defaultValue={p.phone ?? ""} />
          </Field>
          <Field label="Alternate number" htmlFor="altPhone">
            <Input id="altPhone" name="altPhone" inputMode="tel" maxLength={15} defaultValue={p.alt_phone ?? ""} />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" maxLength={160} defaultValue={p.email ?? ""} />
          </Field>
          <Field label="Address" htmlFor="address" className="sm:col-span-2">
            <Textarea id="address" name="address" rows={2} maxLength={400} defaultValue={p.address ?? ""} />
          </Field>
          <Field label="City" htmlFor="cityId">
            <Select id="cityId" name="cityId" defaultValue={p.city_id ? String(p.city_id) : ""}>
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                  {c.status !== "active" ? " (inactive)" : ""}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Joined on" htmlFor="joinedOn">
            <Input id="joinedOn" name="joinedOn" type="date" defaultValue={ymd(p.joined_on)} />
          </Field>
        </div>
      </Card>

      <Card title="Cities served" description="Orders from these cities show this lab first when assigning.">
        {cities.length ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <label key={c.id} className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50">
                <input
                  type="checkbox"
                  name="cityIds"
                  value={String(c.id)}
                  defaultChecked={served.has(Number(c.id))}
                  className="h-4 w-4 accent-blue-600"
                />
                {c.name}
              </label>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-slate-500">No service cities yet. Add them under Catalog → Cities.</p>
        )}
      </Card>

      <Card title="Business & bank" description="Used on settlement statements. Bank details are shown masked to staff who do not pay settlements.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="GSTIN" htmlFor="gstin" hint="15 letters and digits, if registered.">
            <Input id="gstin" name="gstin" maxLength={15} autoCapitalize="characters" defaultValue={p.gstin ?? ""} />
          </Field>
          <Field label="UPI ID" htmlFor="upiId">
            <Input id="upiId" name="upiId" maxLength={80} defaultValue={p.upi_id ?? ""} />
          </Field>
          <Field label="Bank name" htmlFor="bankName">
            <Input id="bankName" name="bankName" maxLength={120} defaultValue={p.bank_name ?? ""} />
          </Field>
          <Field
            label="Account number"
            htmlFor="bankAccount"
            hint={editing && p.bank_account ? `On file: ${maskAccount(p.bank_account)}. Leave blank to keep it.` : null}
          >
            <Input id="bankAccount" name="bankAccount" inputMode="numeric" maxLength={40} autoComplete="off" />
          </Field>
          <Field label="IFSC" htmlFor="bankIfsc" hint="e.g. SBIN0001234">
            <Input id="bankIfsc" name="bankIfsc" maxLength={11} autoCapitalize="characters" defaultValue={p.bank_ifsc ?? ""} />
          </Field>
          <Field label="Default share %" htmlFor="defaultSharePct" hint="Optional — the lab's usual share of the customer price.">
            <Input id="defaultSharePct" name="defaultSharePct" inputMode="decimal" maxLength={6} defaultValue={p.default_share_pct ?? ""} />
          </Field>
        </div>
      </Card>

      <Card title="Services & terms">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Services / tests offered" htmlFor="services" className="sm:col-span-2">
            <Textarea id="services" name="services" rows={3} maxLength={1000} defaultValue={p.services ?? ""} />
          </Field>
          <Field label="Pricing note" htmlFor="pricingNote" className="sm:col-span-2" hint="How this lab prices — per-test prices go in the Pricing tab.">
            <Textarea id="pricingNote" name="pricingNote" rows={2} maxLength={1000} defaultValue={p.pricing_note ?? ""} />
          </Field>
          <Field label="Agreement" htmlFor="agreementStatus">
            <Select id="agreementStatus" name="agreementStatus" defaultValue={p.agreement_status ?? "none"}>
              {AGREEMENT_STATUSES.map((a) => (
                <option key={a.key} value={a.key}>
                  {a.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status" htmlFor="status" hint="Only active labs can be sent orders.">
            <Select id="status" name="status" defaultValue={p.status ?? "active"}>
              {PARTNER_RECORD_STATUSES.map((a) => (
                <option key={a.key} value={a.key}>
                  {a.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Internal notes" htmlFor="notes" className="sm:col-span-2" hint="Never shown to the lab.">
            <Textarea id="notes" name="notes" rows={3} maxLength={2000} defaultValue={p.notes ?? ""} />
          </Field>
        </div>
      </Card>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <ButtonLink href={cancelHref} variant="secondary">
          Cancel
        </ButtonLink>
        <SubmitButton size="lg" className="sm:h-10 sm:px-4">{editing ? "Save changes" : "Add partner"}</SubmitButton>
      </div>
    </ActionForm>
  );
}
