"use client";

/**
 * The permission matrix. Each role is saved on its own — one form per role
 * column — so a change to Support never rewrites Accounts by accident.
 *
 * Desktop: rows are permissions (grouped), columns are roles; each column's
 * checkboxes belong to that column's form via the `form` attribute, and the
 * Save / Reset buttons sit at the foot of the column. Owner is shown locked.
 *
 * Phone: a role picker, then that role's checklist as one form.
 *
 * Checkboxes are uncontrolled; each form is keyed on the saved set, so after
 * a save refreshes the page the boxes re-mount with what is stored.
 */
import { useState } from "react";
import { Lock } from "lucide-react";

import { date } from "@/lib/crm/format";

import { ActionForm, ConfirmAction, SubmitButton } from "../forms";
import { Select, cx } from "../ui";

export default function RoleMatrix({ groups, roles, matrix, forbidden, saveAction, resetAction, lockedRole = null }) {
  const [picked, setPicked] = useState(roles[0]?.key ?? "");
  const blocked = new Set(forbidden);
  const cannot = (role, perm) => role === "partner" && blocked.has(perm);
  const versionOf = (role) => `${role}:${matrix[role].perms.join(",")}`;

  const meta = (role) =>
    matrix[role].custom
      ? `Custom${matrix[role].updatedAt ? ` · ${date(matrix[role].updatedAt)}` : ""}${matrix[role].updatedBy ? ` · ${matrix[role].updatedBy}` : ""}`
      : "Default";

  const resetButton = (role, size = "sm") => (
    <ConfirmAction
      action={resetAction}
      fields={{ role }}
      label="Reset"
      size={size}
      variant="ghost"
      title={`Reset ${roles.find((r) => r.key === role)?.label} to default?`}
      body="The role goes back to the built-in permission set. Everyone with this role gets it on their next click."
      confirmLabel="Reset to default"
      confirmVariant="primary"
    />
  );

  const current = roles.find((r) => r.key === picked);

  return (
    <>
      {/* Phone: pick a role, then its checklist. */}
      <div className="space-y-4 md:hidden">
        <label className="block">
          <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Role</span>
          <Select value={picked} onChange={(e) => setPicked(e.target.value)}>
            {roles.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </Select>
        </label>
        {current && (
          <div key={versionOf(current.key)} className="rounded-2xl border border-slate-200/80 bg-white">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-[14.5px] font-semibold text-slate-900">{current.label}</p>
              <p className="mt-0.5 text-[12.5px] text-slate-500">{current.hint}</p>
              <p className="mt-1 text-[11.5px] text-slate-400">{meta(current.key)}</p>
            </div>
            {lockedRole === current.key ? (
              <p className="px-4 py-4 text-[13px] text-slate-600">This is your own role — only the owner can change it.</p>
            ) : (
              <ActionForm action={saveAction} id={`rp-m-${current.key}`}>
                <input type="hidden" name="role" value={current.key} />
                {groups.map((g) => (
                  <fieldset key={g.group} className="border-b border-slate-100 px-4 py-3">
                    <legend className="sr-only">{g.group}</legend>
                    <p className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-slate-400">{g.group}</p>
                    {g.perms.map((p) => {
                      const no = cannot(current.key, p.key);
                      return (
                        <label key={p.key} className={cx("flex min-h-11 items-center gap-3 text-[13.5px]", no ? "cursor-not-allowed text-slate-400" : "cursor-pointer text-slate-800")}>
                          <input
                            type="checkbox"
                            name="perms"
                            value={p.key}
                            defaultChecked={matrix[current.key].perms.includes(p.key)}
                            disabled={no}
                            className="h-5 w-5 shrink-0 accent-blue-600"
                          />
                          <span className="min-w-0">
                            {p.label}
                            {no && <span className="block text-[11.5px]">Never available to lab partners</span>}
                          </span>
                        </label>
                      );
                    })}
                  </fieldset>
                ))}
                <div className="flex flex-col gap-2 px-4 py-3">
                  <SubmitButton className="w-full">Save {current.label}</SubmitButton>
                </div>
              </ActionForm>
            )}
            {lockedRole !== current.key && <div className="px-4 pb-3">{resetButton(current.key, "md")}</div>}
          </div>
        )}
      </div>

      {/* Tablet and up: the matrix. */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 z-10 min-w-[16rem] border-b border-slate-200 bg-slate-50 px-3 py-2.5 text-[11.5px] font-semibold text-slate-500">
                  Permission
                </th>
                <th scope="col" className="border-b border-slate-200 bg-slate-50 px-2 py-2.5 text-center text-[11.5px] font-semibold text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Lock className="h-3 w-3" aria-hidden /> Owner
                  </span>
                </th>
                {roles.map((r) => (
                  <th key={r.key} scope="col" title={r.hint} className="border-b border-slate-200 bg-slate-50 px-2 py-2.5 text-center text-[11.5px] font-semibold text-slate-700">
                    {r.label}
                    <span className="block text-[10.5px] font-normal text-slate-400">{matrix[r.key].custom ? "Custom" : "Default"}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <GroupRows key={g.group} group={g} roles={roles} matrix={matrix} cannot={cannot} versionOf={versionOf} lockedRole={lockedRole} />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="sticky left-0 z-10 border-t border-slate-200 bg-slate-50 px-3 py-3 text-[12px] text-slate-500">Each role saves on its own.</td>
                <td className="border-t border-slate-200 bg-slate-50 px-2 py-3 text-center text-[11.5px] text-slate-400">Always all</td>
                {roles.map((r) => (
                  <td key={r.key} className="border-t border-slate-200 bg-slate-50 px-2 py-3 text-center align-top">
                    {lockedRole === r.key ? (
                      <span className="text-[11.5px] text-slate-400">Your role</span>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <ActionForm key={versionOf(r.key)} action={saveAction} id={`rp-d-${r.key}`} className="contents">
                          <input type="hidden" name="role" value={r.key} />
                          <SubmitButton size="sm" pendingLabel="Saving…">
                            Save
                          </SubmitButton>
                        </ActionForm>
                        {resetButton(r.key)}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}

function GroupRows({ group, roles, matrix, cannot, versionOf, lockedRole }) {
  return (
    <>
      <tr>
        <th colSpan={roles.length + 2} scope="colgroup" className="sticky left-0 border-b border-slate-100 bg-white px-3 pb-1.5 pt-3.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-slate-400">
          {group.group}
        </th>
      </tr>
      {group.perms.map((p) => (
        <tr key={p.key} className="group">
          <th scope="row" className="sticky left-0 z-[1] border-b border-slate-100 bg-white px-3 py-2 text-[13px] font-normal text-slate-700 group-hover:bg-slate-50">
            {p.label}
            <span className="block text-[11px] text-slate-400">{p.key}</span>
          </th>
          <td className="border-b border-slate-100 px-2 py-2 text-center group-hover:bg-slate-50">
            <input type="checkbox" checked readOnly disabled aria-label={`Owner: ${p.label}`} className="h-4 w-4 accent-blue-600" />
          </td>
          {roles.map((r) => {
            const no = cannot(r.key, p.key);
            return (
              <td key={r.key} className={cx("border-b border-slate-100 px-2 py-2 text-center group-hover:bg-slate-50", no && "bg-slate-50")}>
                <input
                  key={versionOf(r.key)}
                  type="checkbox"
                  name="perms"
                  value={p.key}
                  form={`rp-d-${r.key}`}
                  defaultChecked={matrix[r.key].perms.includes(p.key)}
                  disabled={no || lockedRole === r.key}
                  title={no ? "Never available to lab partners" : undefined}
                  aria-label={`${r.label}: ${p.label}`}
                  className={cx("h-4 w-4 accent-blue-600", no ? "cursor-not-allowed opacity-30" : "cursor-pointer")}
                />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
