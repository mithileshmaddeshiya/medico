"use client";

/**
 * Role picker plus the lab-partner picker, which appears (and is required)
 * only when the role is "Lab partner". The server enforces the same rule;
 * this just keeps the form honest about what it needs.
 */
import { useState } from "react";

import { Field, Select } from "../ui";

export default function RolePartnerFields({ roles, partners, role: initialRole = "", partnerId = "", idPrefix = "u", roleLocked = false, lockHint }) {
  const [role, setRole] = useState(initialRole);
  return (
    <>
      <Field label="Role" required htmlFor={`${idPrefix}-role`} hint={roleLocked ? lockHint : roles.find((r) => r.key === role)?.hint}>
        {roleLocked && <input type="hidden" name="role" value={role} />}
        <Select id={`${idPrefix}-role`} name={roleLocked ? undefined : "role"} value={role} onChange={(e) => setRole(e.target.value)} required disabled={roleLocked}>
          <option value="" disabled>
            Pick a role
          </option>
          {roles.map((r) => (
            <option key={r.key} value={r.key}>
              {r.label}
            </option>
          ))}
        </Select>
      </Field>
      {role === "partner" && (
        <Field label="Lab partner" required htmlFor={`${idPrefix}-partner`} hint="This account sees only this lab's orders, reports and settlements.">
          <Select id={`${idPrefix}-partner`} name="partnerId" defaultValue={partnerId ? String(partnerId) : ""} required>
            <option value="" disabled>
              Pick the lab
            </option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.city ? ` · ${p.city}` : ""}
              </option>
            ))}
          </Select>
        </Field>
      )}
    </>
  );
}
