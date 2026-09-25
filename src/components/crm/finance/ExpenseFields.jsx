/**
 * Fields of the add / edit expense dialog. Server-safe (plain inputs with
 * defaults), rendered inside a FormModal. `e` is the expense being edited,
 * or null for a new one. Receipt upload is a labelled future integration.
 */
import { Upload } from "lucide-react";

import { EXPENSE_CATEGORIES, PAYMENT_MODES } from "@/lib/crm/constants";

import { Field, Input, Select, Textarea, btn } from "../ui";

export default function ExpenseFields({ e = null, cities = [], today }) {
  const p = e ? `ex-${e.id}` : "ex-new";
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category" required htmlFor={`${p}-cat`}>
          <Select id={`${p}-cat`} name="category" required defaultValue={e?.category ?? ""}>
            <option value="" disabled>
              Pick one
            </option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Amount (₹)" required htmlFor={`${p}-amt`}>
          <Input id={`${p}-amt`} name="amount" inputMode="decimal" required defaultValue={e ? Number(e.amount) : ""} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date" required htmlFor={`${p}-date`}>
          <Input id={`${p}-date`} name="spentOn" type="date" required max={today} defaultValue={e?.spent_day ?? today} />
        </Field>
        <Field label="Paid by" required htmlFor={`${p}-mode`}>
          <Select id={`${p}-mode`} name="mode" defaultValue={e?.mode ?? "cash"}>
            {PAYMENT_MODES.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Paid to" htmlFor={`${p}-to`}>
          <Input id={`${p}-to`} name="paidTo" maxLength={120} defaultValue={e?.paid_to ?? ""} placeholder="Vendor or person" />
        </Field>
        <Field label="City" htmlFor={`${p}-city`}>
          <Select id={`${p}-city`} name="cityId" defaultValue={e?.city_id ? String(e.city_id) : ""}>
            <option value="">All / head office</option>
            {cities.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Reference / bill no." htmlFor={`${p}-ref`}>
        <Input id={`${p}-ref`} name="reference" maxLength={120} defaultValue={e?.reference ?? ""} />
      </Field>
      <Field label="Notes" htmlFor={`${p}-notes`}>
        <Textarea id={`${p}-notes`} name="notes" rows={2} maxLength={500} defaultValue={e?.notes ?? ""} />
      </Field>
      <div>
        <button type="button" disabled className={btn("secondary", "sm")} title="Receipt upload is not connected yet">
          <Upload className="h-3.5 w-3.5" aria-hidden /> Receipt upload — coming soon
        </button>
      </div>
    </>
  );
}
