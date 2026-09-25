import { ShieldCheck } from "lucide-react";

import RoleMatrix from "@/components/crm/system/RoleMatrix";
import { Notice, PageHeader } from "@/components/crm/ui";
import { requirePerm } from "@/lib/crm/guard";
import { PARTNER_FORBIDDEN, PERMISSIONS } from "@/lib/crm/permissions";
import { EDITABLE_ROLES, getRoleMatrix } from "@/lib/crm/stores/system";

import { resetRoleAction, saveRoleAction } from "./actions";

export const metadata = { title: "Roles & permissions" };
export const dynamic = "force-dynamic";

/**
 * Who may do what, per role. The owner is always everything. A lab partner's
 * data is filtered to their own lab whatever is ticked here; greyed boxes are
 * permissions a partner can never hold.
 */
export default async function RolesPage() {
  const user = await requirePerm("roles.manage", "/crm/roles");
  const matrix = await getRoleMatrix();

  const groups = [];
  for (const p of PERMISSIONS) {
    let g = groups.find((x) => x.group === p.group);
    if (!g) groups.push((g = { group: p.group, perms: [] }));
    g.perms.push({ key: p.key, label: p.label });
  }
  const plain = Object.fromEntries(
    Object.entries(matrix).map(([role, m]) => [role, { ...m, updatedAt: m.updatedAt ? new Date(m.updatedAt).toISOString() : null }])
  );

  return (
    <>
      <PageHeader
        title="Roles & permissions"
        description="Tick what each role may see and do, then save that role. Changes apply to everyone with the role on their next click."
      />
      <div className="mb-4">
        <Notice tone="slate" icon={<ShieldCheck className="h-4 w-4" aria-hidden />}>
          Hiding a menu is not the protection — every page and action checks these permissions on the server. Lab partners
          only ever see their own lab&apos;s records, whatever is ticked here.
        </Notice>
      </div>
      <RoleMatrix
        groups={groups}
        roles={EDITABLE_ROLES.map((r) => ({ key: r.key, label: r.label, hint: r.hint }))}
        matrix={plain}
        forbidden={[...PARTNER_FORBIDDEN]}
        saveAction={saveRoleAction}
        resetAction={resetRoleAction}
        lockedRole={user.role === "owner" ? null : user.role}
      />
    </>
  );
}
