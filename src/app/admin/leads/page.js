import Link from "next/link";

import {
  ButtonLink,
  Empty,
  Input,
  PageHeader,
  Pill,
  rupees,
  Row,
  Select,
  StatusPill,
  Table,
  Tabs,
  Td,
  when,
} from "@/components/admin/ui";
import { requireUser } from "@/lib/admin/guard";
import { leadCounts, LEAD_STAGES, listLeads } from "@/lib/admin/opsStore";
import { LAB_CITIES } from "@/data/lab/cities";

export const metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

/**
 * Every enquiry the site has taken, from the hero card, the booking modal, the
 * popup and a cart checkout alike.
 *
 * ── THE PHONE NUMBER IS A `tel:` LINK ────────────────────────────────────
 * Small thing, biggest effect on this screen. The panel is used on a phone as
 * often as a desktop, and the whole job of this list is "ring these people".
 * A number you have to memorise and retype is a number that gets typed wrong.
 *
 * ── "ARCHIVED" IS NOT A STAGE ────────────────────────────────────────────
 * It is what the delete button writes, and the tabs do not offer it as a step
 * forward. A lead is archived when it should not have been created — a test
 * submission, a duplicate — never because it went cold. Cold has a stage of
 * its own, "lost", and the difference matters when somebody asks how many
 * enquiries actually converted.
 */
export default async function LeadsPage({ searchParams }) {
  await requireUser("/admin/leads");

  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : null;
  const search = typeof params.q === "string" ? params.q : "";
  const city = typeof params.city === "string" ? params.city : null;
  const page = Math.max(1, Number(params.page) || 1);

  const [{ rows, total }, counts] = await Promise.all([
    listLeads({
      status,
      city,
      search,
      includeArchived: status === "archived",
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    leadCounts(),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle={`${total.toLocaleString("en-IN")} enquir${total === 1 ? "y" : "ies"}. Every one is a person who asked to be called back.`}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          basePath="/admin/leads"
          active={status}
          counts={counts}
          tabs={[
            { key: null, label: "All" },
            ...LEAD_STAGES.map((stage) => ({ key: stage.key, label: stage.label })),
            { key: "archived", label: "Archived" },
          ]}
        />

        {/* A plain GET form: the filters live in the URL, so a filtered list
            can be bookmarked, shared in a message and reloaded without
            re-picking anything. */}
        <form className="flex flex-wrap items-center gap-2" action="/admin/leads">
          {status && <input type="hidden" name="status" value={status} />}
          <Input
            name="q"
            defaultValue={search}
            placeholder="Name, phone or test"
            className="w-48"
            aria-label="Search leads"
          />
          <Select name="city" defaultValue={city ?? ""} className="w-40" aria-label="City">
            <option value="">Every city</option>
            {LAB_CITIES.map((item) => (
              <option key={item.slug} value={item.name}>
                {item.name}
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
      </div>

      {rows.length ? (
        <Table head={["Name", "Phone", "City", "Asked for", "Order", "Stage", "When", ""]}>
          {rows.map((lead) => (
            <Row key={lead.id} muted={lead.status === "archived"}>
              <Td className="font-semibold text-slate-900">
                <Link href={`/admin/leads/${lead.id}`} className="hover:text-emerald-700">
                  {lead.name}
                </Link>
                {Number(lead.notes) > 0 && (
                  <span className="ml-1.5 text-[11px] text-slate-400">{lead.notes} note{Number(lead.notes) === 1 ? "" : "s"}</span>
                )}
              </Td>

              <Td>
                <a
                  href={`tel:+91${lead.phone}`}
                  className="font-medium text-emerald-700 hover:text-emerald-800"
                >
                  {lead.phone}
                </a>
              </Td>

              <Td>{lead.city}</Td>

              <Td className="max-w-[16rem] truncate" >{lead.test || "—"}</Td>

              <Td>
                {lead.order_id ? (
                  <Link href={`/admin/orders/${lead.order_id}`} className="hover:text-emerald-700">
                    {rupees(lead.amount)}{" "}
                    <Pill tone={lead.order_status === "paid" ? "emerald" : "sky"}>
                      {lead.payment_method === "cod" ? "at door" : "online"}
                    </Pill>
                  </Link>
                ) : (
                  <span className="text-slate-400">form only</span>
                )}
              </Td>

              <Td>
                <StatusPill status={lead.status} />
              </Td>

              <Td className="whitespace-nowrap text-slate-500">
                {when(lead.created_at, { time: true })}
              </Td>

              <Td>
                <ButtonLink href={`/admin/leads/${lead.id}`} className="px-2 py-1 text-[12px]">
                  Open
                </ButtonLink>
              </Td>
            </Row>
          ))}
        </Table>
      ) : (
        <Empty
          title={search || city || status ? "Nothing matches those filters" : "No leads yet"}
          hint={
            search || city || status
              ? "Try clearing the search or picking a different stage."
              : "Enquiries from the booking form, the popup and cart checkouts all land here."
          }
          action={
            (search || city || status) && <ButtonLink href="/admin/leads">Clear filters</ButtonLink>
          }
        />
      )}

      {pages > 1 && (
        <nav className="flex items-center justify-center gap-2" aria-label="Pages">
          {page > 1 && (
            <ButtonLink href={pageHref({ ...params, page: page - 1 })}>Previous</ButtonLink>
          )}
          <span className="text-[12.5px] text-slate-500">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <ButtonLink href={pageHref({ ...params, page: page + 1 })}>Next</ButtonLink>
          )}
        </nav>
      )}
    </>
  );
}

/** Keeps every existing filter when paging — losing them is the usual bug here. */
function pageHref(params) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  }
  return `/admin/leads?${query}`;
}
