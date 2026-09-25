"use client";

/**
 * Bulk actions for the leads table: assign to a member of staff, or change
 * status. Same mechanism as the bookings BulkBar (the row checkboxes carry
 * form="<formId>" and submit with this form); a separate component because
 * a lead's actions are not a booking's.
 */
import { useEffect, useState } from "react";

import { ActionForm, SubmitButton } from "../forms";
import { cx, inputCls } from "../ui";

export default function LeadBulkBar({ action, formId, staff, statuses, needsReason }) {
  const [count, setCount] = useState(0);
  const [op, setOp] = useState("");
  const [status, setStatus] = useState(statuses[0]?.value ?? "");

  useEffect(() => {
    const boxes = () => [...document.querySelectorAll(`input[type=checkbox][form="${formId}"]`)];
    const update = () => setCount(boxes().filter((b) => b.checked).length);
    document.addEventListener("change", update);
    update();
    return () => document.removeEventListener("change", update);
  }, [formId]);

  const clear = () => {
    for (const b of document.querySelectorAll(`input[type=checkbox][form="${formId}"]`)) b.checked = false;
    setCount(0);
  };

  return (
    <ActionForm
      id={formId}
      action={action}
      onDone={() => {
        clear();
        setOp("");
      }}
      className={cx(
        "mb-3 hidden flex-wrap items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50/60 px-3 py-2.5 md:flex",
        count === 0 && "md:hidden"
      )}
    >
      <p className="text-[13px] font-semibold text-blue-900 tabular-nums">{count} selected</p>
      <button type="button" onClick={clear} className="text-[12.5px] font-semibold text-blue-700 hover:underline">
        Clear
      </button>
      <span className="mx-1 h-5 w-px bg-blue-200" aria-hidden />
      <select name="op" value={op} onChange={(e) => setOp(e.target.value)} className={cx(inputCls, "h-9 w-auto py-0")} aria-label="Bulk action">
        <option value="">Choose action…</option>
        <option value="assign">Assign to staff</option>
        <option value="status">Change status</option>
      </select>
      {op === "assign" && (
        <select name="assignedUserId" className={cx(inputCls, "h-9 w-auto py-0")} aria-label="Assign to">
          <option value="">Nobody (unassign)</option>
          {staff.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      )}
      {op === "status" && (
        <>
          <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} className={cx(inputCls, "h-9 w-auto py-0")} aria-label="New status">
            {statuses.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {needsReason.includes(status) && (
            <input name="reason" required maxLength={300} placeholder="Reason (required)" className={cx(inputCls, "h-9 w-56 py-0")} />
          )}
        </>
      )}
      {op && (
        <SubmitButton size="sm" pendingLabel="Applying…">
          Apply to {count}
        </SubmitButton>
      )}
    </ActionForm>
  );
}
