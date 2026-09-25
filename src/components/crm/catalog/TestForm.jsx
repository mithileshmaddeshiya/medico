"use client";

/**
 * The test / package form — new and edit.
 *
 * The discount is shown live but never posted: the server computes it from
 * MRP and price (validateTest in src/lib/admin/catalogStore.js), the same as
 * the website admin, so the two numbers can never disagree on the card.
 *
 * For a package, the included tests are picked from the single-test list and
 * posted as repeated `packageTests` fields; the sum of their prices is shown
 * against the package price so the saving is visible while pricing it.
 */
import { useMemo, useState } from "react";
import { Globe, Search, X } from "lucide-react";

import { SAMPLE_TYPES, TEST_CATEGORIES } from "@/lib/crm/constants";
import { rupees } from "@/lib/crm/format";

import { ActionForm, SubmitButton } from "../forms";
import { Card, Field, Input, Select, Textarea, cx, inputCls } from "../ui";

const num = (v) => {
  const n = Number(String(v ?? "").replace(/[₹,\s]/g, ""));
  return String(v ?? "").trim() === "" || !Number.isFinite(n) ? null : n;
};

export default function TestForm({ action, kind = "test", initial = {}, tests = [], showMargin = false, canSetSite = true, submitLabel }) {
  const isPackage = kind === "package";
  const [callForPrice, setCallForPrice] = useState(initial.id ? initial.price === null : false);
  const [price, setPrice] = useState(initial.price ?? "");
  const [mrp, setMrp] = useState(initial.mrp ?? "");
  const [partnerPrice, setPartnerPrice] = useState(initial.partner_price ?? "");
  const [picked, setPicked] = useState(initial.package_tests ?? []);
  const [q, setQ] = useState("");

  const byId = useMemo(() => new Map(tests.map((t) => [t.id, t])), [tests]);
  const p = callForPrice ? null : num(price);
  const m = callForPrice ? null : num(mrp);
  const pp = num(partnerPrice);
  const discount = p && m && m > p ? Math.round(((m - p) / m) * 100) : null;
  const margin = p !== null && pp !== null ? p - pp : null;

  const pickedTests = picked.map((id) => byId.get(id)).filter(Boolean);
  const sum = pickedTests.reduce((a, t) => a + (t.price ?? 0), 0);
  const unpriced = pickedTests.filter((t) => t.price === null).length;
  const matches = q.trim()
    ? tests
        .filter((t) => !picked.includes(t.id))
        .filter((t) => `${t.name} ${t.code ?? ""}`.toLowerCase().includes(q.trim().toLowerCase()))
        .slice(0, 12)
    : [];

  return (
    <ActionForm action={action} className="space-y-5">
      <input type="hidden" name="kind" value={kind} />
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      {picked.map((id) => (
        <input key={id} type="hidden" name="packageTests" value={id} />
      ))}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title={isPackage ? "Package" : "Test"}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" required htmlFor="name" className="sm:col-span-2" hint={initial.id ? `Id: ${initial.id} (fixed — carts and past orders refer to it)` : "The id is made from the name and never changes."}>
                <Input id="name" name="name" defaultValue={initial.name ?? ""} required maxLength={200} />
              </Field>
              <Field label="Code" htmlFor="code" hint="Your internal / lab code, e.g. CBC01.">
                <Input id="code" name="code" defaultValue={initial.code ?? ""} maxLength={40} className="uppercase" />
              </Field>
              <Field label="Category" required htmlFor="category">
                <Select id="category" name="category" defaultValue={initial.crm_category ?? (isPackage ? "full_body" : "blood")} required>
                  {TEST_CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Sample type" required htmlFor="sampleType">
                <Select id="sampleType" name="sampleType" defaultValue={initial.sample_type ?? "Blood"} required>
                  {SAMPLE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Report turnaround (hours)" required htmlFor="tatHours" hint="1–720. Used to flag late reports.">
                <Input id="tatHours" name="tatHours" type="number" min={1} max={720} step={1} defaultValue={initial.tat_hours ?? 24} required inputMode="numeric" />
              </Field>
              <Field label="Parameters" htmlFor="params" hint={isPackage ? "How many parameters the package reports." : "Optional."}>
                <Input id="params" name="params" type="number" min={1} max={5000} step={1} defaultValue={initial.params ?? ""} inputMode="numeric" />
              </Field>
              <label className="flex min-h-10 cursor-pointer items-center gap-2.5 self-end rounded-xl px-1 text-[13.5px] font-medium text-slate-700">
                <input type="checkbox" name="fasting" defaultChecked={Boolean(initial.fasting)} className="h-4.5 w-4.5 accent-blue-600" />
                Fasting required
              </label>
            </div>
          </Card>

          {isPackage && (
            <Card title="Tests included" description="Pick the single tests this package bundles.">
              <label className="relative block">
                <span className="sr-only">Find a test</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Type to find a test by name or code"
                  className={cx(inputCls, "h-10 py-0 pl-9")}
                />
              </label>
              {matches.length > 0 && (
                <ul className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200">
                  {matches.map((t) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setPicked((cur) => [...cur, t.id]);
                          setQ("");
                        }}
                        className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-slate-100 px-3 py-2 text-left text-[13.5px] last:border-0 hover:bg-blue-50"
                      >
                        <span className="min-w-0">
                          <span className="font-medium text-slate-900">{t.name}</span>
                          {t.code && <span className="ml-1.5 text-[12px] text-slate-500">{t.code}</span>}
                          {t.status === "archived" && <span className="ml-1.5 text-[12px] text-amber-700">inactive</span>}
                        </span>
                        <span className="shrink-0 tabular-nums text-slate-600">{t.price === null ? "Call" : rupees(t.price)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {q.trim() && !matches.length && <p className="mt-2 text-[12.5px] text-slate-500">No other test matches “{q.trim()}”.</p>}

              {pickedTests.length ? (
                <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
                  {pickedTests.map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-3 px-3 py-2 text-[13.5px]">
                      <span className="min-w-0 truncate text-slate-800">{t.name}</span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="tabular-nums text-slate-600">{t.price === null ? "Call" : rupees(t.price)}</span>
                        <button
                          type="button"
                          onClick={() => setPicked((cur) => cur.filter((x) => x !== t.id))}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                          aria-label={`Remove ${t.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-xl bg-slate-50 px-3 py-3 text-[13px] text-slate-500">No tests picked yet.</p>
              )}

              {pickedTests.length > 0 && (
                <div className="mt-3 rounded-xl bg-slate-50 px-3.5 py-3 text-[13px] text-slate-700">
                  <p className="flex justify-between gap-3">
                    <span>{pickedTests.length} tests bought separately</span>
                    <span className="font-semibold tabular-nums">{rupees(sum)}</span>
                  </p>
                  {unpriced > 0 && <p className="mt-0.5 text-[12px] text-slate-500">{unpriced} of them are “call for price” and not counted.</p>}
                  {p !== null && (
                    <p className={cx("mt-1 font-semibold", sum > p ? "text-emerald-700" : "text-amber-700")}>
                      {sum > p ? `Customer saves ${rupees(sum - p)} with the package` : "The package costs no less than its tests bought separately."}
                    </p>
                  )}
                </div>
              )}
            </Card>
          )}

          <Card title="Description">
            <div className="space-y-4">
              <Field
                label={isPackage ? "Card subtitle (what it includes)" : "Card subtitle"}
                htmlFor="includes"
                hint={isPackage ? "Shown under the name on the website. Leave blank to list the included tests." : "Shown under the name on the website, e.g. “Hb, RBC, WBC, platelets”."}
              >
                <Input id="includes" name="includes" defaultValue={isPackage && initial.includes_auto ? "" : initial.includes ?? ""} maxLength={300} />
              </Field>
              <Field label="Description" htmlFor="description" hint="Preparation, what it checks, who it is for.">
                <Textarea id="description" name="description" rows={5} defaultValue={initial.description ?? ""} />
              </Field>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Price">
            <div className="space-y-4">
              <label className="flex min-h-10 cursor-pointer items-center gap-2.5 text-[13.5px] font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="callForPrice"
                  checked={callForPrice}
                  onChange={(e) => setCallForPrice(e.target.checked)}
                  className="h-4.5 w-4.5 accent-blue-600"
                />
                Call for price (not bookable online)
              </label>
              {!callForPrice && (
                <>
                  <Field label={isPackage ? "Selling price (₹)" : "Customer price (₹)"} required htmlFor="price">
                    <Input id="price" name="price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="e.g. 499" />
                  </Field>
                  <Field label="MRP (₹)" htmlFor="mrp" hint="Optional. Must not be below the price.">
                    <Input id="mrp" name="mrp" inputMode="decimal" value={mrp} onChange={(e) => setMrp(e.target.value)} placeholder="e.g. 799" />
                  </Field>
                  <p className="rounded-xl bg-slate-50 px-3 py-2.5 text-[13px] text-slate-600">
                    Discount shown: <span className="font-semibold text-slate-900">{discount ? `${discount}% off` : "none"}</span>
                    {m !== null && p !== null && m < p && <span className="mt-1 block font-semibold text-rose-700">MRP is below the price — this will be refused.</span>}
                  </p>
                </>
              )}
              <Field label={isPackage ? "Partner cost (₹)" : "Partner price (₹)"} htmlFor="partnerPrice" hint="What a lab partner is paid for it by default. Never shown to customers.">
                <Input id="partnerPrice" name="partnerPrice" inputMode="decimal" value={partnerPrice} onChange={(e) => setPartnerPrice(e.target.value)} placeholder="e.g. 250" />
              </Field>
              {showMargin && margin !== null && (
                <p className={cx("text-[13px] font-semibold", margin >= 0 ? "text-emerald-700" : "text-rose-700")}>
                  Margin {rupees(margin)} per {isPackage ? "package" : "test"}
                </p>
              )}
            </div>
          </Card>

          <Card title="Website">
            <label className={cx("flex cursor-pointer items-start gap-2.5 text-[13.5px] text-slate-700", !canSetSite && "cursor-not-allowed opacity-60")}>
              <input type="checkbox" name="showOnSite" defaultChecked={Boolean(initial.on_site)} disabled={!canSetSite} className="mt-0.5 h-4.5 w-4.5 accent-blue-600" />
              <span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Globe className="h-4 w-4 text-blue-600" aria-hidden /> Show on website
                </span>
                <span className="mt-0.5 block text-[12.5px] text-slate-500">
                  {canSetSite
                    ? "Customers see it on medicobharat.com and can book it at this price. Leave off to keep it for staff bookings only."
                    : "Activate it first — an inactive item cannot be on the website."}
                </span>
              </span>
            </label>
          </Card>

          <SubmitButton className="w-full">{submitLabel ?? (initial.id ? "Save changes" : isPackage ? "Create package" : "Create test")}</SubmitButton>
        </div>
      </div>
    </ActionForm>
  );
}
