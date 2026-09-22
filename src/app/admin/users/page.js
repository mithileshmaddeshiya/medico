import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import DeleteButton from "@/components/admin/DeleteButton";
import {
  Card,
  Field,
  Input,
  Note,
  PageHeader,
  Row,
  Select,
  StatusPill,
  Table,
  Td,
  when,
} from "@/components/admin/ui";
import { requireRole } from "@/lib/admin/guard";
import { query } from "@/lib/db";

import { deleteRecord, restoreRecord } from "../actions";
import {
  createUserAction,
  revokeSessionsAction,
  setPasswordAction,
  setRoleAction,
  setUserStatusAction,
} from "./actions";

export const metadata = { title: "People" };
export const dynamic = "force-dynamic";

/**
 * Who can sign in.
 *
 * ── THREE ROLES, ABOUT BLAST RADIUS RATHER THAN SENIORITY ────────────────
 *   owner   everything, including accounts and the site-wide SEO settings
 *   editor  content and day-to-day work — leads, orders, articles, tests,
 *           images. Cannot add an admin and cannot rewrite the site's
 *           indexing rules, which are the two mistakes that are slow to
 *           notice and expensive to undo.
 *   viewer  read only.
 *
 * ── ONE ACCOUNT PER PERSON ───────────────────────────────────────────────
 * A shared login makes the history page useless: "who dropped that price"
 * gets the answer "admin@", which is not an answer. It also means removing one
 * person's access requires changing everyone's password.
 */
export default async function UsersPage() {
  const me = await requireRole("owner", "/admin/users");

  const [users] = await query(
    `SELECT u.id, u.email, u.name, u.role, u.status, u.last_login_at, u.created_at,
            (SELECT COUNT(*) FROM admin_sessions s
              WHERE s.user_id = u.id AND s.status = 'active' AND s.expires_at > UTC_TIMESTAMP()) AS sessions
     FROM admin_users u
     ORDER BY FIELD(u.status, 'active', 'disabled', 'deleted'), u.email`
  );

  return (
    <>
      <PageHeader title="People" subtitle="Who can sign in to this panel, and what they can do." />

      <Note title="Give every person their own account">
        The history page records who made each change, and a shared login makes that record
        worthless — “who dropped that price to ₹99” answered with a generic address is not an
        answer. It also means that removing one person’s access would mean changing everybody’s
        password.
        <br />
        <br />
        This panel shows patients’ names, phone numbers and home addresses. Give people the
        smallest role that lets them do their job, and disable an account the day somebody leaves.
      </Note>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="space-y-4">
          <Table head={["Person", "Role", "Status", "Devices", "Last signed in", ""]}>
            {users.map((user) => (
              <Row key={user.id} muted={user.status !== "active"}>
                <Td>
                  <span className="font-semibold text-slate-900">{user.name || user.email}</span>
                  {user.name && (
                    <span className="mt-0.5 block text-[11.5px] text-slate-500">{user.email}</span>
                  )}
                  {Number(user.id) === Number(me.id) && (
                    <span className="mt-0.5 block text-[11px] font-semibold text-emerald-700">
                      this is you
                    </span>
                  )}
                </Td>

                <Td>
                  <ActionForm action={setRoleAction}>
                    <input type="hidden" name="id" value={user.id} />
                    <div className="flex items-center gap-1.5">
                      <Select
                        name="role"
                        defaultValue={user.role}
                        className="w-28 py-1 text-[12px]"
                        aria-label={`Role for ${user.email}`}
                      >
                        <option value="owner">owner</option>
                        <option value="editor">editor</option>
                        <option value="viewer">viewer</option>
                      </Select>
                      <SubmitButton variant="quiet" pendingLabel="…">
                        Set
                      </SubmitButton>
                    </div>
                  </ActionForm>
                </Td>

                <Td>
                  <StatusPill status={user.status} />
                </Td>

                <Td>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600">{Number(user.sessions) || 0}</span>
                    {Number(user.sessions) > 0 && (
                      <ActionForm action={revokeSessionsAction}>
                        <input type="hidden" name="id" value={user.id} />
                        <SubmitButton variant="quiet" pendingLabel="…">
                          Sign out
                        </SubmitButton>
                      </ActionForm>
                    )}
                  </div>
                </Td>

                <Td className="whitespace-nowrap text-slate-500">
                  {user.last_login_at ? when(user.last_login_at, { time: true }) : "never"}
                </Td>

                <Td>
                  <div className="flex items-center justify-end gap-1">
                    {user.status === "active" ? (
                      <ActionForm action={setUserStatusAction}>
                        <input type="hidden" name="id" value={user.id} />
                        <input type="hidden" name="status" value="disabled" />
                        <SubmitButton variant="quiet" pendingLabel="…">
                          Disable
                        </SubmitButton>
                      </ActionForm>
                    ) : user.status === "disabled" ? (
                      <ActionForm action={setUserStatusAction}>
                        <input type="hidden" name="id" value={user.id} />
                        <input type="hidden" name="status" value="active" />
                        <SubmitButton variant="secondary" pendingLabel="…">
                          Re-enable
                        </SubmitButton>
                      </ActionForm>
                    ) : (
                      <ActionForm action={restoreRecord}>
                        <input type="hidden" name="entity" value="admin_users" />
                        <input type="hidden" name="id" value={user.id} />
                        <SubmitButton variant="secondary" pendingLabel="…">
                          Restore
                        </SubmitButton>
                      </ActionForm>
                    )}

                    {Number(user.id) !== Number(me.id) && user.status !== "deleted" && (
                      <DeleteButton
                        action={deleteRecord}
                        entity="admin_users"
                        id={user.id}
                        label="account"
                        size="small"
                      />
                    )}
                  </div>
                </Td>
              </Row>
            ))}
          </Table>

          <Card title="Reset someone's password">
            <ActionForm action={setPasswordAction} reset className="space-y-3">
              <Field label="Account">
                <Select name="id" required>
                  {users
                    .filter((user) => user.status !== "deleted")
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.email}
                      </option>
                    ))}
                </Select>
              </Field>

              <Field
                label="New password"
                hint="At least 10 characters. A short phrase beats a short password with a symbol in it."
                required
              >
                <Input name="password" type="password" required autoComplete="new-password" />
              </Field>

              <SubmitButton>Change password</SubmitButton>
            </ActionForm>

            <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
              Changing a password signs that person out on every device, immediately. That is
              deliberate — if the reason is a lost laptop, a new password that left the old session
              alive would have achieved nothing. Hand the new password over in person or by phone,
              never in an email.
            </p>
          </Card>
        </div>

        <Card title="Add someone">
          <ActionForm action={createUserAction} reset className="space-y-4">
            <Field label="Email" required>
              <Input name="email" type="email" required placeholder="name@medicobharat.com" />
            </Field>

            <Field label="Name">
              <Input name="name" placeholder="Their name, for the history page" />
            </Field>

            <Field label="Role" required>
              <Select name="role" defaultValue="editor">
                <option value="viewer">viewer — read only</option>
                <option value="editor">editor — content and day-to-day work</option>
                <option value="owner">owner — everything, including accounts</option>
              </Select>
            </Field>

            <Field label="Password" required hint="At least 10 characters.">
              <Input name="password" type="password" required autoComplete="new-password" />
            </Field>

            <SubmitButton className="w-full">Create account</SubmitButton>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
