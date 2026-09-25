import { KeyRound, Pencil, UserPlus, Users } from "lucide-react";

import FilterBar from "@/components/crm/FilterBar";
import { ConfirmAction, FormModal, QuickAction } from "@/components/crm/forms";
import RolePartnerFields from "@/components/crm/system/RolePartnerFields";
import { Avatar, Badge, DataTable, EmptyState, Field, Input, PageHeader, Pagination, Select, withParams } from "@/components/crm/ui";
import { pageOf } from "@/lib/crm/filters";
import { ago, dateTime, phone } from "@/lib/crm/format";
import { requirePerm } from "@/lib/crm/guard";
import { ROLE_LABEL, ROLES } from "@/lib/crm/permissions";
import { listPartnerOptions } from "@/lib/crm/stores/lookups";
import { USER_STATUS, listUsers } from "@/lib/crm/stores/system";

import { createUserAction, resetPasswordAction, updateUserAction, userStatusAction } from "./actions";

export const metadata = { title: "Users" };
export const dynamic = "force-dynamic";

/**
 * Who can sign in to the CRM (and the website admin — same accounts). Staff
 * roles and lab-partner logins; a partner login is tied to one lab.
 */
export default async function UsersPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("users.manage", "/crm/users");
  const { limit, offset } = pageOf(sp);
  const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
  const filters = { role: one(sp.role) || null, status: one(sp.status) || null, search: one(sp.q).slice(0, 80) };
  const [list, partners] = await Promise.all([listUsers({ ...filters, limit, offset }), listPartnerOptions()]);

  const isOwner = user.role === "owner";
  // Only an owner may hand out the owner role.
  const assignable = ROLES.filter((r) => isOwner || r.key !== "owner").map((r) => ({ key: r.key, label: r.label, hint: r.hint }));
  const partnerOpts = partners.map((p) => ({ id: p.id, name: p.name, city: p.city }));
  const href = (changes) => withParams("/crm/users", sp, changes);
  const filtered = Boolean(filters.role || filters.status || filters.search);

  const columns = [
    { key: "name", label: "Name", hideable: false },
    { key: "role", label: "Role" },
    { key: "partner", label: "Lab" },
    { key: "phone", label: "Mobile" },
    { key: "status", label: "Status" },
    { key: "login", label: "Last sign-in" },
    { key: "actions", label: "" },
  ];

  const controls = (u) => {
    const self = Number(u.id) === Number(user.id);
    if (u.role === "owner" && !isOwner) return <span className="text-[12px] text-slate-400">Owner — only an owner can edit</span>;
    return (
      <span className="flex flex-wrap gap-1.5">
        <FormModal
          action={updateUserAction}
          fields={{ id: u.id }}
          label="Edit"
          size="sm"
          variant="secondary"
          icon={<Pencil className="h-3.5 w-3.5" aria-hidden />}
          title={`Edit ${u.name || u.email}`}
          description={u.email}
        >
          <Field label="Name" required htmlFor={`un-${u.id}`}>
            <Input id={`un-${u.id}`} name="name" defaultValue={u.name} required maxLength={80} />
          </Field>
          <Field label="Mobile" htmlFor={`up-${u.id}`}>
            <Input id={`up-${u.id}`} name="phone" defaultValue={u.phone} inputMode="numeric" maxLength={10} />
          </Field>
          <RolePartnerFields
            roles={assignable}
            partners={partnerOpts}
            role={u.role}
            partnerId={u.partner_id ?? ""}
            idPrefix={`ur-${u.id}`}
            roleLocked={self}
            lockHint="You cannot change your own role."
          />
          {!self && (
            <Field label="Status" htmlFor={`us-${u.id}`} hint="Disabling signs them out on every device at once.">
              <Select id={`us-${u.id}`} name="status" defaultValue={u.status}>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </Select>
            </Field>
          )}
          <p className="text-[12px] text-slate-500">Changing the role or lab also signs them out, so the new access applies at once.</p>
        </FormModal>
        {!self && (
          <FormModal
            action={resetPasswordAction}
            fields={{ id: u.id }}
            label="Reset password"
            size="sm"
            variant="ghost"
            icon={<KeyRound className="h-3.5 w-3.5" aria-hidden />}
            title="Set a temporary password"
            description={`${u.email} will be signed out everywhere and must use this password next. Ask them to change it from their profile.`}
            submitLabel="Set password"
            modalSize="sm"
          >
            <Field label="Temporary password" required htmlFor={`pw-${u.id}`} hint="At least 10 characters.">
              <Input id={`pw-${u.id}`} name="password" type="password" autoComplete="new-password" minLength={10} required />
            </Field>
            <Field label="Repeat it" required htmlFor={`pc-${u.id}`}>
              <Input id={`pc-${u.id}`} name="confirm" type="password" autoComplete="new-password" minLength={10} required />
            </Field>
          </FormModal>
        )}
        {!self &&
          (u.status === "active" ? (
            <ConfirmAction
              action={userStatusAction}
              fields={{ id: u.id, status: "disabled" }}
              label="Disable"
              size="sm"
              variant="ghost"
              title={`Disable ${u.name || u.email}?`}
              body="They are signed out on every device immediately and cannot sign in until re-enabled. Nothing they did is removed."
              confirmLabel="Disable"
            />
          ) : (
            <QuickAction action={userStatusAction} fields={{ id: u.id, status: "active" }} size="sm" variant="soft">
              Enable
            </QuickAction>
          ))}
      </span>
    );
  };

  return (
    <>
      <PageHeader
        title="Users"
        description="Staff and lab-partner accounts. The same sign-in works for the website admin where the role allows it."
        actions={
          <FormModal
            action={createUserAction}
            label="Add user"
            icon={<UserPlus className="h-4 w-4" aria-hidden />}
            title="Add a user"
            description="They sign in at /crm/login with this email and password."
            submitLabel="Create account"
          >
            <Field label="Name" required htmlFor="new-name">
              <Input id="new-name" name="name" required maxLength={80} />
            </Field>
            <Field label="Email (sign-in)" required htmlFor="new-email">
              <Input id="new-email" name="email" type="email" required maxLength={160} autoComplete="off" />
            </Field>
            <Field label="Mobile" htmlFor="new-phone">
              <Input id="new-phone" name="phone" inputMode="numeric" maxLength={10} />
            </Field>
            <RolePartnerFields roles={assignable} partners={partnerOpts} idPrefix="new" />
            <Field label="Password" required htmlFor="new-password" hint="At least 10 characters. Tell them in person or by phone.">
              <Input id="new-password" name="password" type="password" minLength={10} required autoComplete="new-password" />
            </Field>
          </FormModal>
        }
      />

      <FilterBar
        search={{ placeholder: "Name, email or mobile" }}
        filters={[
          { name: "role", label: "Role", options: ROLES.map((r) => ({ value: r.key, label: r.label })) },
          { name: "status", label: "Status", options: Object.entries(USER_STATUS).map(([value, s]) => ({ value, label: s.label })) },
        ]}
      />

      <DataTable
        id="users-table"
        columns={columns}
        rows={list.rows}
        cells={(u) => ({
          name: (
            <span className="flex items-center gap-2.5">
              <Avatar name={u.name || u.email} size="sm" />
              <span className="min-w-0">
                <span className="block font-medium text-slate-900">
                  {u.name || "—"} {Number(u.id) === Number(user.id) && <span className="text-[11.5px] font-normal text-blue-700">(you)</span>}
                </span>
                <span className="block text-[11.5px] text-slate-500">{u.email}</span>
              </span>
            </span>
          ),
          role: <Badge tone={u.role === "owner" ? "violet" : u.role === "partner" ? "indigo" : "blue"} dot={false}>{ROLE_LABEL[u.role] ?? u.role}</Badge>,
          partner: u.partner_name ?? <span className="text-slate-400">—</span>,
          phone: u.phone ? phone(u.phone) : <span className="text-slate-400">—</span>,
          status: <Badge tone={USER_STATUS[u.status]?.tone}>{USER_STATUS[u.status]?.label ?? u.status}</Badge>,
          login: u.last_login_at ? <span title={dateTime(u.last_login_at)}>{ago(u.last_login_at)}</span> : <span className="text-slate-400">Never</span>,
          actions: controls(u),
        })}
        card={(u) => (
          <div>
            <div className="flex items-start gap-3">
              <Avatar name={u.name || u.email} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-slate-900">
                  {u.name || u.email} {Number(u.id) === Number(user.id) && <span className="text-[12px] font-normal text-blue-700">(you)</span>}
                </p>
                <p className="truncate text-[12.5px] text-slate-500">{u.email}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Badge tone={u.role === "owner" ? "violet" : u.role === "partner" ? "indigo" : "blue"} dot={false}>{ROLE_LABEL[u.role] ?? u.role}</Badge>
                  <Badge tone={USER_STATUS[u.status]?.tone}>{USER_STATUS[u.status]?.label ?? u.status}</Badge>
                  {u.partner_name && <Badge dot={false}>{u.partner_name}</Badge>}
                </div>
                <p className="mt-1.5 text-[12px] text-slate-500">Last sign-in: {u.last_login_at ? ago(u.last_login_at) : "never"}</p>
              </div>
            </div>
            <div className="mt-3 border-t border-slate-100 pt-3">{controls(u)}</div>
          </div>
        )}
        empty={
          <EmptyState
            icon={<Users className="h-5 w-5" />}
            title={filtered ? "No users match" : "No users yet"}
            hint={filtered ? "Clear the filters to see everyone." : "Add your team with Add user."}
          />
        }
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(p) => href({ page: p > 1 ? p : null })} />}
      />
    </>
  );
}
