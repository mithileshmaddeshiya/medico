import {
  ButtonLink,
  Empty,
  Note,
  PageHeader,
  Row,
  Select,
  StatusPill,
  Table,
  Td,
  when,
} from "@/components/admin/ui";
import { recentAudit } from "@/lib/admin/audit";
import { requireUser } from "@/lib/admin/guard";

export const metadata = { title: "History" };
export const dynamic = "force-dynamic";

const ENTITIES = [
  ["blog_posts", "Articles"],
  ["lab_tests", "Tests"],
  ["test_categories", "Chips"],
  ["leads", "Leads"],
  ["orders", "Orders"],
  ["media", "Images"],
  ["city_overrides", "City pages"],
  ["seo_routes", "SEO"],
  ["seo_redirects", "Redirects"],
  ["admin_users", "Accounts"],
];

/**
 * Every write the panel has made.
 *
 * Append-only, and it holds the before/after snapshot of each change. That is
 * what makes the soft-delete rule hold up even in the awkward case: if a row
 * was deleted and then edited by somebody who did not realise, the row itself
 * no longer says what it used to be. This does.
 *
 * Failed sign-ins are recorded here too, which is why the sign-in rate limiter
 * can count them across instances and restarts instead of in memory.
 */
export default async function AuditPage({ searchParams }) {
  await requireUser("/admin/audit");

  const params = await searchParams;
  const entity = typeof params.entity === "string" ? params.entity : null;

  const entries = await recentAudit({ entity, limit: 200 });

  return (
    <>
      <PageHeader title="History" subtitle="Every change made through this panel, with who made it.">
        <form action="/admin/audit" className="flex items-center gap-2">
          <Select name="entity" defaultValue={entity ?? ""} className="w-44" aria-label="Filter by type">
            <option value="">Everything</option>
            {ENTITIES.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-3 py-2 text-[13px] font-semibold text-white hover:bg-slate-800"
          >
            Filter
          </button>
        </form>
      </PageHeader>

      {entries.length ? (
        <Table head={["What", "Record", "Who", "When"]}>
          {entries.map((entry) => (
            <Row key={entry.id}>
              <Td>
                <StatusPill status={entry.action} />
                <span className="ml-2 text-slate-700">{entry.summary}</span>
              </Td>
              <Td className="font-mono text-[11.5px] text-slate-500">
                {entry.entity}
                {entry.entity_id ? ` #${entry.entity_id}` : ""}
              </Td>
              <Td className="text-slate-600">{entry.user_email || "system"}</Td>
              <Td className="whitespace-nowrap text-slate-500">
                {when(entry.created_at, { time: true })}
              </Td>
            </Row>
          ))}
        </Table>
      ) : (
        <Empty title="Nothing recorded yet" hint="Changes appear here as soon as anyone makes one." />
      )}

      <Note title="This is also the recovery path">
        Each entry stores what the record looked like before and after. Deleting in this panel only
        changes a status, so a record can normally be restored from its own list — but if something
        was deleted and then edited again, this table is the last complete copy of what it held.
        Nothing here is ever removed or rewritten.
      </Note>
    </>
  );
}
