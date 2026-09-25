/**
 * Form fields shared by the call-centre screens: logging a call and
 * scheduling a follow-up. Server-safe (no hooks) so a page can drop them
 * inside a FormModal or an ActionForm; `p` prefixes every id so several
 * copies on one page (a card per follow-up) never share a label target.
 */
import { CALL_OUTCOMES } from "@/lib/crm/constants";
import { defaultFollowUpInput } from "@/lib/crm/stores/leads";

import { Field, Input, Select, Textarea } from "../ui";

export function CallFields({ p = "call", phone = true, name = true, time = true, createLead = false, defaultDirection = "outbound" }) {
  return (
    <>
      {(phone || name) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {phone && (
            <Field label="Mobile" required htmlFor={`${p}-phone`}>
              <Input id={`${p}-phone`} name="phone" inputMode="numeric" autoComplete="off" maxLength={14} required placeholder="98765 43210" />
            </Field>
          )}
          {name && (
            <Field label="Name" htmlFor={`${p}-name`} hint="Filled from the lead or customer when the number is known.">
              <Input id={`${p}-name`} name="name" maxLength={80} />
            </Field>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Direction" htmlFor={`${p}-direction`}>
          <Select id={`${p}-direction`} name="direction" defaultValue={defaultDirection}>
            <option value="outbound">Outbound (we called)</option>
            <option value="inbound">Inbound (they called)</option>
          </Select>
        </Field>
        <Field label="Outcome" htmlFor={`${p}-outcome`}>
          <Select id={`${p}-outcome`} name="outcome" defaultValue="answered">
            {CALL_OUTCOMES.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Duration (minutes)" htmlFor={`${p}-duration`}>
          <Input id={`${p}-duration`} name="durationMin" inputMode="decimal" placeholder="e.g. 2.5" />
        </Field>
        {time && (
          <Field label="When (IST)" htmlFor={`${p}-at`} hint="Leave empty for now.">
            <Input id={`${p}-at`} name="calledAt" type="datetime-local" />
          </Field>
        )}
      </div>
      <Field label="Notes" htmlFor={`${p}-notes`}>
        <Textarea id={`${p}-notes`} name="notes" rows={2} maxLength={1000} placeholder="What was discussed, what they want…" />
      </Field>
      {createLead && (
        <>
          <label className="flex items-start gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-[13px] text-slate-700 ring-1 ring-inset ring-slate-200">
            <input type="checkbox" name="createLead" value="1" className="mt-0.5 h-4 w-4 accent-blue-600" />
            <span>
              <span className="font-semibold">Create a lead if this number has none</span>
              <span className="block text-[12px] text-slate-500">Only for answered calls. An existing open lead on the number is used instead.</span>
            </span>
          </label>
          <Field label="Interested in (for a new lead)" htmlFor={`${p}-test`}>
            <Input id={`${p}-test`} name="test" maxLength={400} placeholder="Test or package asked about" />
          </Field>
        </>
      )}
    </>
  );
}

export function FollowUpFields({ p = "fu", staff = [], assignee = "", note = true }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Call back at (IST)" required htmlFor={`${p}-due`}>
          <Input id={`${p}-due`} name="dueAt" type="datetime-local" required defaultValue={defaultFollowUpInput()} />
        </Field>
        <Field label="Who calls" htmlFor={`${p}-assignee`}>
          <Select id={`${p}-assignee`} name="assignedUserId" defaultValue={assignee ? String(assignee) : ""}>
            <option value="">Lead owner / me</option>
            {staff.map((u) => (
              <option key={u.id} value={String(u.id)}>
                {u.name || u.email}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {note && (
        <Field label="Why" htmlFor={`${p}-note`}>
          <Input id={`${p}-note`} name="note" maxLength={500} placeholder="e.g. Confirm fasting slot, share package price" />
        </Field>
      )}
    </>
  );
}
