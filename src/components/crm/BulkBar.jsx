"use client";

/**
 * Bulk actions for a DataTable. The table's row checkboxes carry
 * form="<formId>", so they submit with THIS form even though they live in
 * the table — no client state has to mirror the selection. This component
 * only counts them (to show "3 selected") and offers the action.
 */
import { useEffect, useState } from "react";

import { ActionForm, SubmitButton } from "./forms";
import { cx, inputCls } from "./ui";

export default function BulkBar({ action, formId, partners, collectors, statuses }) {
  const [count, setCount] = useState(0);
  const [op, setOp] = useState("");

  useEffect(() => {
    const boxes = () => [...document.querySelectorAll(`input[type=checkbox][form="${formId}"]`)];
    const update = () => setCount(boxes().filter((b) => b.checked).length);
    document.addEventListener("change", update);
    update();
    return () => document.removeEventListener("change", update);
  }, [formId]);

  const selectAll = (on) => {
    for (const b of document.querySelectorAll(`input[type=checkbox][form="${formId}"]`)) b.checked = on;
    setCount(on ? document.querySelectorAll(`input[type=checkbox][form="${formId}"]`).length : 0);
  };

  const ops = [
    statuses && { value: "status", label: "Change status" },
    partners && { value: "partner", label: "Assign lab" },
    collectors && { value: "collector", label: "Assign collector" },
  ].filter(Boolean);

  return (
    <ActionForm
      id={formId}
      action={action}
      onDone={() => {
        selectAll(false);
        setOp("");
      }}
      className={cx(
        "mb-3 hidden flex-wrap items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50/60 px-3 py-2.5 md:flex",
        count === 0 && "md:hidden"
      )}
    >
      <p className="text-[13px] font-semibold text-blue-900 tabular-nums">{count} selected</p>
      <button type="button" onClick={() => selectAll(false)} className="text-[12.5px] font-semibold text-blue-700 hover:underline">
        Clear
      </button>
      <span className="mx-1 h-5 w-px bg-blue-200" aria-hidden />
      <select name="op" value={op} onChange={(e) => setOp(e.target.value)} className={cx(inputCls, "h-9 w-auto py-0")} aria-label="Bulk action">
        <option value="">Choose action…</option>
        {ops.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {op === "status" && (
        <>
          <select name="status" required className={cx(inputCls, "h-9 w-auto py-0")} aria-label="New status">
            {statuses.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input name="reason" placeholder="Reason (needed to cancel)" className={cx(inputCls, "h-9 w-56 py-0")} />
        </>
      )}
      {op === "partner" && (
        <select name="partnerId" required className={cx(inputCls, "h-9 w-auto py-0")} aria-label="Lab">
          {partners.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
      {op === "collector" && (
        <select name="collectorId" required className={cx(inputCls, "h-9 w-auto py-0")} aria-label="Collector">
          {collectors.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
      {op && (
        <SubmitButton size="sm" pendingLabel="Applying…">
          Apply to {count}
        </SubmitButton>
      )}
    </ActionForm>
  );
}
