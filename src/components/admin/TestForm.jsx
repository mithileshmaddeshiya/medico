"use client";

/**
 * Add or edit one test card.
 *
 * The discount is shown live as you type, computed from price and MRP the same
 * way the server computes it on save — because a percentage that is typed can
 * disagree with the two numbers beside it, and the one on the card is the one
 * a customer screenshots and arrives with.
 */
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

import { Button, Card, Checkbox, Field, Input, Note, Select, Textarea } from "./ui";

function Save({ children }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : children}
    </Button>
  );
}

const money = (value) => {
  const n = Number(String(value ?? "").replace(/[₹,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export default function TestForm({ test, categories, action }) {
  const [state, formAction] = useActionState(action, null);

  const [price, setPrice] = useState(test?.price ?? "");
  const [mrp, setMrp] = useState(test?.mrp ?? "");
  const [callForPrice, setCallForPrice] = useState(test ? test.price === null : false);

  useEffect(() => {
    if (!state) return;
    if (state.ok === false && state.error) toast.error(state.error);
    else if (state.ok && state.message) toast.success(state.message);
  }, [state]);

  const p = money(price);
  const m = money(mrp);
  const discount = p && m && m > p ? Math.round(((m - p) / m) * 100) : null;
  const mrpBelowPrice = p && m && m < p;

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
      {test && <input type="hidden" name="originalId" value={test.id} />}

      <div className="space-y-6">
        <Card title="The card">
          <div className="space-y-4">
            <Field label="Name" required hint="Exactly as it should read on the card.">
              <Input name="name" required defaultValue={test?.name ?? ""} placeholder="Thyroid Profile (T3, T4, TSH)" />
            </Field>

            <Field
              label="Id"
              required
              hint={
                test
                  ? "Fixed. Every cart in every visitor’s browser and every past order line refers to this string — renaming it would orphan all of them."
                  : "Lower case, hyphenated. Chosen once and never changed."
              }
            >
              <Input
                name="id"
                required
                readOnly={Boolean(test)}
                defaultValue={test?.id ?? ""}
                placeholder="thyroid-profile"
                className={test ? "bg-slate-50 text-slate-500" : ""}
              />
            </Field>

            <Field label="What it includes" hint="The grey line under the name. Keep it to one line.">
              <Input name="includes" defaultValue={test?.includes ?? ""} placeholder="T3, T4, TSH" />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Checkbox
                name="isPackage"
                defaultChecked={Boolean(test?.is_package)}
                label="This is a checkup package"
                hint="Packages show a parameter count."
              />
              <Checkbox
                name="fasting"
                defaultChecked={Boolean(test?.fasting)}
                label="Needs fasting"
                hint="Shown on the card and in the booking confirmation."
              />
            </div>

            <Field label="Parameters" hint="Packages only. Leave empty for a single test.">
              <Input name="params" type="number" min="1" defaultValue={test?.params ?? ""} placeholder="72" />
            </Field>
          </div>
        </Card>

        <Card
          title="Description"
          subtitle="Optional. Shown on the test’s own page — plain text, no claims about accreditation or partner labs."
        >
          <Textarea name="description" rows={4} defaultValue={test?.description ?? ""} />
        </Card>

        <Card title="Search" subtitle="Used if this test gets a page of its own. Leave empty to derive them from the name.">
          <div className="space-y-4">
            <Field label="Meta title">
              <Input name="metaTitle" defaultValue={test?.meta_title ?? ""} placeholder="(automatic)" />
            </Field>
            <Field label="Meta description">
              <Textarea name="metaDescription" rows={2} defaultValue={test?.meta_description ?? ""} placeholder="(automatic)" />
            </Field>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Price">
          <div className="space-y-4">
            <Checkbox
              checked={callForPrice}
              onChange={(event) => setCallForPrice(event.target.checked)}
              name="callForPrice"
              label="Call for price"
              hint="The card shows “call for price” and cannot be added to the cart. Use this instead of entering ₹0 — a zero price makes the test bookable for nothing."
            />

            {!callForPrice && (
              <>
                <Field label="Price" required hint="What the customer pays, in rupees.">
                  <Input
                    name="price"
                    required
                    inputMode="decimal"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="499"
                  />
                </Field>

                <Field label="MRP" hint="Optional. Only for showing a struck-through price — must be above the price.">
                  <Input
                    name="mrp"
                    inputMode="decimal"
                    value={mrp}
                    onChange={(event) => setMrp(event.target.value)}
                    placeholder="899"
                  />
                </Field>

                {mrpBelowPrice ? (
                  <p role="alert" className="text-[12.5px] font-semibold text-rose-600">
                    The MRP is below the price. That would render as a negative discount — the save
                    will be refused.
                  </p>
                ) : discount ? (
                  <p className="rounded-lg bg-emerald-50 px-3 py-2 text-[12.5px] font-semibold text-emerald-800">
                    The card will show {discount}% off. Calculated, not typed.
                  </p>
                ) : null}
              </>
            )}
          </div>
        </Card>

        <Card title="Where it appears">
          <fieldset>
            <legend className="text-[12.5px] font-semibold text-slate-700">Filter chips</legend>
            <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500">
              A test with no chip is only reachable from “All”, which usually reads to a visitor as
              missing.
            </p>

            <div className="mt-2.5 space-y-2">
              {categories.map((chip) => (
                <Checkbox
                  key={chip.key}
                  name="tags"
                  value={chip.key}
                  defaultChecked={test?.tags?.includes(chip.key)}
                  label={chip.label}
                />
              ))}
            </div>
          </fieldset>

          <div className="mt-4">
            <Field label="Sort order" hint="Lower sorts first in the grid.">
              <Input name="sortOrder" type="number" defaultValue={test?.sort_order ?? 0} />
            </Field>
          </div>
        </Card>

        <Card title="Appearance">
          <div className="space-y-4">
            <Field label="Icon" hint="A lucide icon name. An unknown name falls back to a neutral icon rather than breaking the card.">
              <Input name="icon" defaultValue={test?.icon ?? ""} placeholder="droplet" />
            </Field>
            <Field label="Tint">
              <Select name="tint" defaultValue={test?.tint ?? ""}>
                <option value="">Default</option>
                {["emerald", "sky", "amber", "rose", "violet", "indigo", "teal"].map((tint) => (
                  <option key={tint} value={tint}>
                    {tint}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </Card>

        <Card title="">
          <Save>{test ? "Save changes" : "Add the test"}</Save>
          <Note tone="warn" title="This is live immediately">
            Checkout prices every order from this table with no cache in front of it. There is no
            preview step and no deploy in between.
          </Note>
        </Card>
      </div>
    </form>
  );
}
