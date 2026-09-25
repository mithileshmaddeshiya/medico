"use client";

/**
 * New / edit customer. A plain form posting to a server action; the only
 * client state is the chosen city (to narrow the area suggestions) and the
 * "this number is already a customer" answer, which links to that profile
 * instead of creating a second one.
 */
import { startTransition, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2, UserCheck } from "lucide-react";

import { GENDERS } from "@/lib/crm/constants";

import { Card, Field, Input, Notice, Select, Textarea, btn } from "../ui";

export default function CustomerForm({ action, initial = {}, cities, areas, mode = "new" }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [cityId, setCityId] = useState(initial.city_id ? String(initial.city_id) : "");
  const cityAreas = areas.filter((a) => String(a.city_id) === cityId);

  useEffect(() => {
    if (state?.ok === false && state.error && !state.existingId) toast.error(state.error);
  }, [state]);

  return (
    // Submitted by hand rather than through <form action>: React resets an
    // action form after every submit, which would wipe what was typed when
    // the server answers "this number already exists".
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
      className="space-y-5"
    >
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      {/* A website customer's free-text city survives an edit that picks none. */}
      <input type="hidden" name="city" value={initial.city ?? ""} />

      {state?.existingId && (
        <Notice tone="amber" title="This mobile number is already a customer" icon={<UserCheck className="h-4 w-4" aria-hidden />}>
          <p>
            {state.existingName || "A customer"} is already on file with this number. One number is one profile — open it and
            edit it there.
          </p>
          <Link href={`/crm/customers/${state.existingId}`} className={btn("secondary", "sm", "mt-2")}>
            Open {state.existingName || "the profile"}
          </Link>
        </Notice>
      )}

      <Card title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required htmlFor="name">
            <Input id="name" name="name" required maxLength={80} defaultValue={initial.name ?? ""} autoComplete="off" />
          </Field>
          <Field label="Mobile" required htmlFor="phone" hint={mode === "edit" ? "Changing it moves the profile to the new number." : "10 digits. One profile per number."}>
            <Input id="phone" name="phone" required inputMode="numeric" maxLength={14} defaultValue={initial.phone ?? ""} autoComplete="off" />
          </Field>
          <Field label="Alternate mobile" htmlFor="alt_phone">
            <Input id="alt_phone" name="alt_phone" inputMode="numeric" maxLength={15} defaultValue={initial.alt_phone ?? ""} />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" maxLength={160} defaultValue={initial.email ?? ""} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Age" htmlFor="age">
              <Input id="age" name="age" inputMode="numeric" maxLength={3} defaultValue={initial.age ?? ""} />
            </Field>
            <Field label="Gender" htmlFor="gender">
              <Select id="gender" name="gender" defaultValue={initial.gender ?? ""}>
                <option value="">—</option>
                {GENDERS.map((g) => (
                  <option key={g.key} value={g.key}>
                    {g.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </div>
      </Card>

      <Card title="Address">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City" htmlFor="city_id" hint={!cityId && initial.city ? `On file as “${initial.city}”.` : null}>
            <Select id="city_id" name="city_id" value={cityId} onChange={(e) => setCityId(e.target.value)}>
              <option value="">Choose a city</option>
              {cities.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                  {c.status && c.status !== "active" ? " (inactive)" : ""}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Area / locality" htmlFor="area">
            <Input id="area" name="area" list="customer-areas" maxLength={120} defaultValue={initial.area ?? ""} autoComplete="off" />
            <datalist id="customer-areas">
              {cityAreas.map((a) => (
                <option key={a.id} value={a.name} />
              ))}
            </datalist>
          </Field>
          <Field label="Address" htmlFor="address" className="sm:col-span-2">
            <Textarea id="address" name="address" rows={2} maxLength={400} defaultValue={initial.address ?? ""} />
          </Field>
          <Field label="Landmark" htmlFor="landmark">
            <Input id="landmark" name="landmark" maxLength={160} defaultValue={initial.landmark ?? ""} />
          </Field>
        </div>
      </Card>

      <Card title="Notes" description="Internal — never shown to the customer or a lab.">
        <Textarea id="notes" name="notes" rows={3} maxLength={2000} defaultValue={initial.notes ?? ""} aria-label="Notes" placeholder="Preferred time to call, language, health context…" />
      </Card>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link href={initial.id ? `/crm/customers/${initial.id}` : "/crm/customers"} className={btn("secondary")}>
          Cancel
        </Link>
        <button type="submit" disabled={pending} className={btn("primary", "lg")}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {pending ? "Saving…" : mode === "edit" ? "Save changes" : "Create customer"}
        </button>
      </div>
    </form>
  );
}
