"use client";

/**
 * The booking form — new and edit. One screen a support agent can fill in
 * during a phone call:
 *
 *   1. mobile first: a known number fills the rest in (returning customer)
 *   2. tests: type to find, tap to add; price per line is editable because a
 *      phone booking is sometimes quoted a different price (the catalogue
 *      price is the default, and the difference is visible)
 *   3. schedule, lab, collector (if the role may assign)
 *   4. money: discount, fee, anything collected right now
 *
 * The lines go to the server as JSON in one hidden field; the server
 * re-prices every catalogue line and re-computes every total (priceItems in
 * src/lib/crm/stores/bookings.js), so nothing typed here is trusted blindly.
 */
import { useMemo, useRef, useState } from "react";
import { Minus, Plus, Search, Trash2, UserCheck, X } from "lucide-react";

import { COLLECTION_SLOTS, GENDERS, PAYMENT_MODES, SOURCES } from "@/lib/crm/constants";
import { rupees } from "@/lib/crm/format";

import { ActionForm, SubmitButton } from "./forms";
import { Card, Field, Input, Select, Textarea, btn, cx, inputCls } from "./ui";

const money = (v) => Math.max(0, Math.round((Number(v) || 0) * 100) / 100);

export default function BookingForm({
  action,
  initial = {},
  tests,
  cities,
  areas,
  partners = null,
  collectors = null,
  mode = "new",
  canTakePayment = false,
}) {
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [cust, setCust] = useState({
    name: initial.name ?? "",
    altPhone: initial.altPhone ?? "",
    email: initial.email ?? "",
    age: initial.age ?? "",
    gender: initial.gender ?? "",
    address: initial.address ?? "",
    cityId: initial.cityId ? String(initial.cityId) : "",
    area: initial.area ?? "",
    landmark: initial.landmark ?? "",
  });
  const [known, setKnown] = useState(null);
  const [lines, setLines] = useState(initial.items ?? []);
  const [touched, setTouched] = useState(false);
  const [q, setQ] = useState("");
  const [discount, setDiscount] = useState(initial.discount ?? "");
  const [fee, setFee] = useState(initial.collectionFee ?? "");
  const [paidNow, setPaidNow] = useState("");
  const lookupFor = useRef("");

  const byId = useMemo(() => new Map(tests.map((t) => [t.id, t])), [tests]);
  const cityAreas = areas.filter((a) => String(a.city_id) === cust.cityId);

  const lookup = async (value) => {
    const digits = value.replace(/\D/g, "").slice(-10);
    if (digits.length !== 10 || lookupFor.current === digits || mode !== "new") return;
    lookupFor.current = digits;
    try {
      const res = await fetch(`/api/crm/lookup/customer?phone=${digits}`);
      const data = await res.json();
      const c = data.customer;
      setKnown(c);
      if (c) {
        setCust((cur) => ({
          name: cur.name || c.name || "",
          altPhone: cur.altPhone || c.alt_phone || "",
          email: cur.email || c.email || "",
          age: cur.age || (c.age ?? ""),
          gender: cur.gender || c.gender || "",
          address: cur.address || c.address || "",
          cityId: cur.cityId || (c.city_id ? String(c.city_id) : ""),
          area: cur.area || c.area || "",
          landmark: cur.landmark || c.landmark || "",
        }));
      }
    } catch {
      /* lookup is a convenience; the form works without it */
    }
  };

  const set = (k) => (e) => setCust((c) => ({ ...c, [k]: e.target.value }));

  const add = (t) => {
    setTouched(true);
    setLines((ls) =>
      ls.some((l) => l.testId === t.id)
        ? ls.map((l) => (l.testId === t.id ? { ...l, qty: Math.min(10, l.qty + 1) } : l))
        : [...ls, { testId: t.id, name: t.name, qty: 1, price: t.price ?? "", listPrice: t.price, isPackage: t.isPackage }]
    );
    setQ("");
  };
  const update = (i, patch) => {
    setTouched(true);
    setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  };
  const remove = (i) => {
    setTouched(true);
    setLines((ls) => ls.filter((_, j) => j !== i));
  };

  const term = q.trim().toLowerCase();
  const matches = term
    ? tests.filter((t) => t.name.toLowerCase().includes(term) || (t.code ?? "").toLowerCase().includes(term)).slice(0, 8)
    : [];

  const subtotal = lines.reduce((s, l) => s + money(l.price) * (Number(l.qty) || 1), 0);
  const disc = Math.min(money(discount), subtotal);
  const total = Math.max(0, subtotal - disc + money(fee));

  const payload = JSON.stringify(
    lines.map((l) =>
      l.testId ? { testId: l.testId, qty: l.qty, price: l.price === "" ? undefined : money(l.price) } : { name: l.name, qty: l.qty, price: money(l.price) }
    )
  );

  return (
    <ActionForm action={action} className="grid gap-5 pb-24 lg:grid-cols-[1fr_20rem] lg:pb-0">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      {initial.leadId && <input type="hidden" name="leadId" value={initial.leadId} />}
      <input type="hidden" name="items" value={payload} />
      <input type="hidden" name="itemsTouched" value={touched || mode === "new" ? "1" : "0"} />

      <div className="min-w-0 space-y-5">
        {/* 1 — customer */}
        <Card title="Customer" description={mode === "new" ? "Start with the mobile number — a returning customer fills in by itself." : null}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mobile" required htmlFor="phone">
              <Input
                id="phone"
                name="phone"
                inputMode="numeric"
                autoComplete="off"
                maxLength={14}
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  lookup(e.target.value);
                }}
                onBlur={(e) => lookup(e.target.value)}
                placeholder="10-digit mobile"
              />
            </Field>
            <Field label="Patient name" required htmlFor="name">
              <Input id="name" name="name" required maxLength={80} value={cust.name} onChange={set("name")} />
            </Field>
            {known && (
              <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[12.5px] text-emerald-800 ring-1 ring-inset ring-emerald-600/15 sm:col-span-2">
                <UserCheck className="h-4 w-4 shrink-0" aria-hidden />
                Returning customer · {known.name} · {known.bookings} booking{Number(known.bookings) === 1 ? "" : "s"} before
              </p>
            )}
            <Field label="Age" htmlFor="age">
              <Input id="age" name="age" inputMode="numeric" maxLength={3} value={cust.age} onChange={set("age")} />
            </Field>
            <Field label="Gender" htmlFor="gender">
              <Select id="gender" name="gender" value={cust.gender} onChange={set("gender")}>
                <option value="">—</option>
                {GENDERS.map((g) => (
                  <option key={g.key} value={g.key}>
                    {g.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Alternate mobile" htmlFor="altPhone">
              <Input id="altPhone" name="altPhone" inputMode="numeric" maxLength={14} value={cust.altPhone} onChange={set("altPhone")} />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input id="email" name="email" type="email" maxLength={160} value={cust.email} onChange={set("email")} />
            </Field>
          </div>
        </Card>

        {/* 2 — address */}
        <Card title="Collection address">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Address" className="sm:col-span-2" htmlFor="address">
              <Textarea id="address" name="address" rows={2} maxLength={400} value={cust.address} onChange={set("address")} />
            </Field>
            <Field label="City" htmlFor="cityId">
              <Select id="cityId" name="cityId" value={cust.cityId} onChange={set("cityId")}>
                <option value="">Choose city</option>
                {cities.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Area" htmlFor="area">
              <Input id="area" name="area" list="crm-areas" maxLength={120} value={cust.area} onChange={set("area")} />
              <datalist id="crm-areas">
                {cityAreas.map((a) => (
                  <option key={a.id} value={a.name} />
                ))}
              </datalist>
            </Field>
            <Field label="Landmark" className="sm:col-span-2" htmlFor="landmark">
              <Input id="landmark" name="landmark" maxLength={160} value={cust.landmark} onChange={set("landmark")} />
            </Field>
          </div>
        </Card>

        {/* 3 — tests */}
        <Card title="Tests & packages" description={lines.length ? `${lines.length} selected` : "Search and tap to add."}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (matches[0]) add(matches[0]);
                }
              }}
              placeholder="CBC, thyroid, full body…"
              className={cx(inputCls, "pl-9")}
              aria-label="Search tests"
            />
            {matches.length > 0 && (
              <ul className="absolute inset-x-0 z-20 mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                {matches.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => add(t)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-blue-50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-medium text-slate-900">{t.name}</span>
                        <span className="block text-[11.5px] text-slate-500">
                          {[t.isPackage ? `Package${t.params ? ` · ${t.params} parameters` : ""}` : "Test", t.fasting ? "Fasting" : null, !t.onSite ? "Not on website" : null]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </span>
                      <span className="shrink-0 text-[13px] font-semibold text-slate-700 tabular-nums">
                        {t.price === null ? "Set price" : rupees(t.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {lines.length > 0 ? (
            <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {lines.map((l, i) => {
                const t = l.testId ? byId.get(l.testId) : null;
                const changed = t && t.price !== null && l.price !== "" && money(l.price) !== t.price;
                return (
                  <li key={`${l.testId ?? l.name}-${i}`} className="flex flex-wrap items-center gap-2 px-3 py-2.5">
                    <div className="min-w-0 flex-1 basis-40">
                      <p className="truncate text-[13.5px] font-medium text-slate-900">{l.name}</p>
                      {changed && <p className="text-[11.5px] text-amber-700">List price {rupees(t.price)}</p>}
                    </div>
                    <div className="flex items-center rounded-lg ring-1 ring-inset ring-slate-300">
                      <button type="button" onClick={() => update(i, { qty: Math.max(1, l.qty - 1) })} className="flex h-9 w-9 items-center justify-center text-slate-500" aria-label="Fewer">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-[13px] font-semibold tabular-nums">{l.qty}</span>
                      <button type="button" onClick={() => update(i, { qty: Math.min(10, l.qty + 1) })} className="flex h-9 w-9 items-center justify-center text-slate-500" aria-label="More">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <label className="relative w-28">
                      <span className="sr-only">Price for {l.name}</span>
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">₹</span>
                      <input
                        inputMode="decimal"
                        value={l.price}
                        onChange={(e) => update(i, { price: e.target.value.replace(/[^\d.]/g, "") })}
                        className={cx(inputCls, "h-9 py-0 pl-7 text-right tabular-nums")}
                        required
                      />
                    </label>
                    <button type="button" onClick={() => remove(i)} className={btn("ghost", "sm", "h-9 w-9 px-0 text-slate-400 hover:text-rose-600")} aria-label={`Remove ${l.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-[13px] text-slate-500">
              No tests yet. Search above, or add a custom line below.
            </p>
          )}
          <CustomLine onAdd={(l) => (setTouched(true), setLines((ls) => [...ls, l]))} />
        </Card>

        {/* 4 — schedule and assignment */}
        <Card title="Schedule & assignment">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Booking source" htmlFor="source">
              <Select id="source" name="source" defaultValue={initial.source ?? "phone"}>
                {SOURCES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Collection date" htmlFor="collectionDate">
              <Input id="collectionDate" name="collectionDate" type="date" defaultValue={initial.collectionDate ?? ""} />
            </Field>
            <Field label="Time slot" htmlFor="collectionSlot">
              <Select id="collectionSlot" name="collectionSlot" defaultValue={initial.collectionSlot ?? ""}>
                <option value="">Any time</option>
                {COLLECTION_SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </Field>
            {collectors && mode === "new" && (
              <Field label="Collector" htmlFor="collectorId">
                <Select id="collectorId" name="collectorId" defaultValue="">
                  <option value="">Assign later</option>
                  {collectors.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name || c.email}
                    </option>
                  ))}
                </Select>
              </Field>
            )}
            {partners && mode === "new" && (
              <Field label="Lab partner" htmlFor="partnerId">
                <Select id="partnerId" name="partnerId" defaultValue="">
                  <option value="">Assign later</option>
                  {partners.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.name}
                      {p.city ? ` — ${p.city}` : ""}
                    </option>
                  ))}
                </Select>
              </Field>
            )}
          </div>
        </Card>

        <Card title="Notes">
          <div className="grid gap-4">
            <Field label="Internal notes" hint="Only MedicoBharat staff see these." htmlFor="notes">
              <Textarea id="notes" name="notes" rows={2} maxLength={2000} defaultValue={initial.notes ?? ""} />
            </Field>
            <Field label="Instructions for the lab" hint="Shown to the lab partner on their order." htmlFor="partnerNotes">
              <Textarea id="partnerNotes" name="partnerNotes" rows={2} maxLength={1000} defaultValue={initial.partnerNotes ?? ""} />
            </Field>
          </div>
        </Card>
      </div>

      {/* Summary: a sticky side panel on desktop, a bar pinned above the bottom nav on a phone. */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card title="Amount">
          <dl className="space-y-2.5 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-slate-500">Tests</dt>
              <dd className="font-medium tabular-nums">{rupees(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">
                <label htmlFor="discount">Discount</label>
              </dt>
              <dd className="w-28">
                <input id="discount" name="discount" inputMode="decimal" value={discount} onChange={(e) => setDiscount(e.target.value.replace(/[^\d.]/g, ""))} className={cx(inputCls, "h-9 py-0 text-right tabular-nums")} placeholder="0" />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">
                <label htmlFor="collectionFee">Collection fee</label>
              </dt>
              <dd className="w-28">
                <input id="collectionFee" name="collectionFee" inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value.replace(/[^\d.]/g, ""))} className={cx(inputCls, "h-9 py-0 text-right tabular-nums")} placeholder="0" />
              </dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2.5 text-[16px]">
              <dt className="font-semibold">Total</dt>
              <dd className="font-semibold tabular-nums">{rupees(total)}</dd>
            </div>
          </dl>

          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            <Field label="Customer will pay by" htmlFor="paymentMode">
              <Select id="paymentMode" name="paymentMode" defaultValue={initial.paymentMode ?? "cash"}>
                <option value="">Not decided</option>
                {PAYMENT_MODES.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </Field>
            {canTakePayment && mode === "new" && (
              <>
                <Field label="Collected now (optional)" htmlFor="paidNow" hint="Recorded as a payment against this booking.">
                  <Input id="paidNow" name="paidNow" inputMode="decimal" value={paidNow} onChange={(e) => setPaidNow(e.target.value.replace(/[^\d.]/g, ""))} placeholder="0" />
                </Field>
                {money(paidNow) > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    <Select name="paidMode" aria-label="Paid by" defaultValue="upi">
                      {PAYMENT_MODES.map((m) => (
                        <option key={m.key} value={m.key}>
                          {m.label}
                        </option>
                      ))}
                    </Select>
                    <Input name="paidRef" placeholder="UTR / ref" maxLength={120} />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-5 hidden lg:block">
            <SubmitButton className="w-full" size="lg" disabled={!lines.length}>
              {mode === "new" ? "Create booking" : "Save changes"}
            </SubmitButton>
          </div>
        </Card>
      </aside>

      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] text-slate-500">{lines.length} item{lines.length === 1 ? "" : "s"}</p>
          <p className="text-[17px] font-semibold tabular-nums">{rupees(total)}</p>
        </div>
        <SubmitButton size="lg" disabled={!lines.length}>
          {mode === "new" ? "Create booking" : "Save"}
        </SubmitButton>
      </div>
    </ActionForm>
  );
}

function CustomLine({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-3 text-[12.5px] font-semibold text-blue-700 hover:underline">
        + Add a test that is not in the catalogue
      </button>
    );
  }
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-2.5">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Test name" className={cx(inputCls, "h-9 min-w-40 flex-1 py-0")} aria-label="Custom test name" />
      <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ""))} placeholder="₹ price" inputMode="decimal" className={cx(inputCls, "h-9 w-28 py-0")} aria-label="Custom test price" />
      <button
        type="button"
        disabled={!name.trim() || !(Number(price) >= 0) || price === ""}
        onClick={() => {
          onAdd({ testId: null, name: name.trim(), qty: 1, price });
          setName("");
          setPrice("");
          setOpen(false);
        }}
        className={btn("soft", "sm", "h-9")}
      >
        Add
      </button>
      <button type="button" onClick={() => setOpen(false)} className={btn("ghost", "sm", "h-9 w-9 px-0")} aria-label="Cancel">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
