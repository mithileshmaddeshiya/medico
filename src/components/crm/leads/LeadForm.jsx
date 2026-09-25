"use client";

/**
 * New lead — typed in during a call, so the phone comes first and the rest
 * is optional. "Log this call" records the call in the same save.
 *
 * When the server finds an open lead on the same number from the last 30
 * days it does not save; the form shows that lead with a link and a
 * "Save as a new lead anyway" button, which re-submits with force=1.
 * Submitted by hand (not <form action>) so an answer like that does not
 * reset what was typed.
 */
import { startTransition, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Copy, Loader2, PhoneCall } from "lucide-react";

import { CALL_OUTCOMES } from "@/lib/crm/constants";
import { dateTime } from "@/lib/crm/format";

import { Card, Field, Input, Notice, Select, Textarea, btn, cx } from "../ui";

export default function LeadForm({ action, channels, tests, packages, cities, areas, staff, userId, defaultFollowUp }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [city, setCity] = useState("");
  const [logCall, setLogCall] = useState(true);
  const [followUp, setFollowUp] = useState(false);
  const cityId = cities.find((c) => c.name === city)?.id;
  const cityAreas = cityId ? areas.filter((a) => String(a.city_id) === String(cityId)) : [];

  useEffect(() => {
    if (state?.ok === false && state.error) toast.error(state.error);
  }, [state]);

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget, e.nativeEvent.submitter ?? undefined);
    startTransition(() => formAction(fd));
  };

  const dupe = state?.duplicate;

  return (
    <form onSubmit={submit} className="space-y-5">
      {dupe && (
        <Notice tone="amber" title={`${dupe.name} already has an open lead`} icon={<Copy className="h-4 w-4" aria-hidden />}>
          <p>
            {dupe.code} · {dupe.status} · created {dateTime(dupe.createdAt)}. Work that lead instead of starting a second one — or save
            this as a separate enquiry.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href={`/crm/leads/${dupe.id}`} className={btn("primary", "sm")}>
              Open {dupe.code}
            </Link>
            <button type="submit" name="force" value="1" disabled={pending} className={btn("secondary", "sm")}>
              Save as a new lead anyway
            </button>
          </div>
        </Notice>
      )}

      <Card title="Who">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mobile" required htmlFor="phone">
            <Input id="phone" name="phone" required inputMode="numeric" maxLength={14} autoComplete="off" autoFocus placeholder="98765 43210" />
          </Field>
          <Field label="Name" required htmlFor="name">
            <Input id="name" name="name" required maxLength={80} autoComplete="off" />
          </Field>
          <Field label="Came in by" htmlFor="channel">
            <Select id="channel" name="channel" defaultValue="phone">
              {channels.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Assign to" htmlFor="assignedUserId">
            <Select id="assignedUserId" name="assignedUserId" defaultValue={userId ? String(userId) : ""}>
              <option value="">Nobody yet</option>
              {staff.map((u) => (
                <option key={u.id} value={String(u.id)}>
                  {u.name || u.email}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      <Card title="What they want">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Interested test" htmlFor="test" hint="Pick from the list or type what they said.">
            <Input id="test" name="test" list="lead-tests" maxLength={400} autoComplete="off" />
            <datalist id="lead-tests">
              {tests.map((t) => (
                <option key={t.id} value={t.name} />
              ))}
            </datalist>
          </Field>
          <Field label="Interested package" htmlFor="interestedPackage">
            <Select id="interestedPackage" name="interestedPackage" defaultValue="">
              <option value="">None</option>
              {packages.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="City" htmlFor="city">
            <Select id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Not known</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Area" htmlFor="area">
            <Input id="area" name="area" list="lead-areas" maxLength={120} autoComplete="off" />
            <datalist id="lead-areas">
              {cityAreas.map((a) => (
                <option key={a.id} value={a.name} />
              ))}
            </datalist>
          </Field>
          <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
            <Textarea id="notes" name="notes" rows={2} maxLength={1000} placeholder="Symptoms, doctor's advice, preferred time…" />
          </Field>
        </div>
      </Card>

      <Card
        title="This call"
        description="Record the call you are on, so the lead's history starts with it."
        actions={
          <label className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700">
            <input type="checkbox" name="logCall" value="1" checked={logCall} onChange={(e) => setLogCall(e.target.checked)} className="h-4 w-4 accent-blue-600" />
            Log this call
          </label>
        }
      >
        <div className={cx("grid gap-4 sm:grid-cols-3", !logCall && "opacity-50")}>
          <Field label="Direction" htmlFor="direction">
            <Select id="direction" name="direction" defaultValue="inbound" disabled={!logCall}>
              <option value="inbound">Inbound (they called)</option>
              <option value="outbound">Outbound (we called)</option>
            </Select>
          </Field>
          <Field label="Outcome" htmlFor="outcome">
            <Select id="outcome" name="outcome" defaultValue="answered" disabled={!logCall}>
              {CALL_OUTCOMES.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Duration (minutes)" htmlFor="durationMin">
            <Input id="durationMin" name="durationMin" inputMode="decimal" disabled={!logCall} placeholder="e.g. 3" />
          </Field>
          <Field label="Call notes" htmlFor="callNotes" className="sm:col-span-3">
            <Input id="callNotes" name="callNotes" maxLength={1000} disabled={!logCall} />
          </Field>
        </div>
      </Card>

      <Card
        title="Follow-up"
        description="Schedules a call-back and puts the lead in Follow-up."
        actions={
          <label className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700">
            <input type="checkbox" checked={followUp} onChange={(e) => setFollowUp(e.target.checked)} className="h-4 w-4 accent-blue-600" />
            Schedule a call-back
          </label>
        }
      >
        {followUp ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Call back at (IST)" required htmlFor="followUpAt">
              <Input id="followUpAt" name="followUpAt" type="datetime-local" required defaultValue={defaultFollowUp} />
            </Field>
            <Field label="Why" htmlFor="followUpNote">
              <Input id="followUpNote" name="followUpNote" maxLength={500} placeholder="e.g. Share package price after 6 pm" />
            </Field>
          </div>
        ) : (
          <p className="text-[13px] text-slate-500">No call-back scheduled.</p>
        )}
      </Card>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link href="/crm/leads" className={btn("secondary")}>
          Cancel
        </Link>
        <button type="submit" disabled={pending} className={btn("primary", "lg")}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <PhoneCall className="h-4 w-4" aria-hidden />}
          {pending ? "Saving…" : "Save lead"}
        </button>
      </div>
    </form>
  );
}
