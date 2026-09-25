/**
 * Done / Reschedule / Cancel for one pending follow-up — the same three
 * buttons on the follow-ups board and on a lead. Server-safe; the dialogs
 * are the client FormModal/ConfirmAction. Actions come in as props so this
 * file does not reach into a route folder.
 */
import { CheckCircle2, Clock } from "lucide-react";

import { CALL_OUTCOMES } from "@/lib/crm/constants";
import { utcToIstInput } from "@/lib/crm/stores/leads";

import { ConfirmAction, FormModal } from "../forms";
import { Field, Input, Select, Textarea } from "../ui";

export default function FollowUpActions({ f, actions, size = "sm" }) {
  const p = `fu${f.id}`;
  return (
    <>
      <FormModal
        action={actions.complete}
        fields={{ id: f.id }}
        label="Done"
        size={size}
        variant="success"
        icon={<CheckCircle2 className="h-3.5 w-3.5" aria-hidden />}
        title="Follow-up done"
        description={f.note || undefined}
        submitLabel="Mark done"
      >
        <Field label="What happened (optional)" htmlFor={`${p}-note`} hint="Saved as a note on the lead or customer.">
          <Textarea id={`${p}-note`} name="note" rows={2} maxLength={1000} placeholder="e.g. Will book on Sunday, wants fasting slot" />
        </Field>
        <label className="flex items-start gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-[13px] text-slate-700 ring-1 ring-inset ring-slate-200">
          <input type="checkbox" name="logCall" value="1" defaultChecked className="mt-0.5 h-4 w-4 accent-blue-600" />
          <span className="font-semibold">Also log this as an outbound call</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Call outcome" htmlFor={`${p}-outcome`}>
            <Select id={`${p}-outcome`} name="outcome" defaultValue="answered">
              {CALL_OUTCOMES.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Duration (minutes)" htmlFor={`${p}-dur`}>
            <Input id={`${p}-dur`} name="durationMin" inputMode="decimal" />
          </Field>
        </div>
      </FormModal>
      <FormModal
        action={actions.reschedule}
        fields={{ id: f.id }}
        label="Reschedule"
        size={size}
        variant="secondary"
        icon={<Clock className="h-3.5 w-3.5" aria-hidden />}
        title="Reschedule follow-up"
        submitLabel="Reschedule"
        modalSize="sm"
      >
        <Field label="New time (IST)" required htmlFor={`${p}-due`}>
          <Input id={`${p}-due`} name="dueAt" type="datetime-local" required defaultValue={utcToIstInput(f.due_at)} />
        </Field>
      </FormModal>
      <ConfirmAction
        action={actions.cancel}
        fields={{ id: f.id }}
        label="Cancel"
        size={size}
        variant="ghost"
        title="Cancel this follow-up?"
        body="It stays on record as cancelled."
        confirmLabel="Cancel follow-up"
      />
    </>
  );
}
