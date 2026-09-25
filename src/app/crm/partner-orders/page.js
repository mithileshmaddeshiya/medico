import Link from "next/link";
import { AlarmClock, CheckCircle2, FlaskConical, Hourglass, RotateCcw, XCircle } from "lucide-react";

import FilterBar from "@/components/crm/FilterBar";
import { FormModal } from "@/components/crm/forms";
import {
  Badge,
  BookingStatusBadge,
  DataTable,
  EmptyState,
  Field,
  PageHeader,
  Pagination,
  PartnerStatusBadge,
  ReportStatusBadge,
  Select,
  Tabs,
  withParams,
} from "@/components/crm/ui";
import { SLA_DEFAULTS, bookingCode } from "@/lib/crm/constants";
import { pageOf } from "@/lib/crm/filters";
import { ago, dateTime, hours } from "@/lib/crm/format";
import { has, requirePerm } from "@/lib/crm/guard";
import { listBookings } from "@/lib/crm/stores/bookings";
import { listPartnerOptions } from "@/lib/crm/stores/lookups";
import { listOverdueReports, partnerAcceptSla, partnerOrderCounts } from "@/lib/crm/stores/partners";

import { assignPartnerAction } from "../bookings/actions";

export const metadata = { title: "Partner orders" };
export const dynamic = "force-dynamic";

const IN_LAB = ["booked", "confirmed", "collection_assigned", "sample_collected", "sample_received", "processing"];
const DONE = ["report_ready", "report_delivered", "completed"];

/** Hours since a UTC instant (null if none) — for the acceptance-wait column. */
const hoursSince = (at) => (at ? (Date.now() - new Date(at).getTime()) / 3600000 : null);

/** Each tab is a listBookings filter (except "overdue", which needs a due-date test). */
const TABS = [
  { key: "awaiting", label: "Awaiting acceptance", filters: { partnerStatus: "pending", open: true, sort: "oldest" } },
  { key: "rejected", label: "Rejected — reassign", filters: { partnerStatus: "rejected", open: true, sort: "oldest" } },
  { key: "inlab", label: "Accepted & in lab", filters: { partnerStatus: "accepted", status: IN_LAB, sort: "oldest" } },
  { key: "overdue", label: "Report overdue", filters: null },
  { key: "completed", label: "Completed", filters: { partnerStatus: "accepted", status: DONE, sort: "updated" } },
];

/**
 * The operations board for orders sent to labs: what each lab still has to
 * accept (and for how long, against the acceptance SLA), what a lab turned
 * down and needs another lab, what is in progress, what is late and what is
 * done. Reassigning is one dialog away for staff with bookings.assign.
 */
export default async function PartnerOrdersPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("partners.view", "/crm/partner-orders");
  const tab = TABS.find((t) => t.key === sp.tab) ?? TABS[0];
  const partnerId = sp.partner ? Number(sp.partner) || null : null;
  const { limit, offset } = pageOf(sp);
  const canAssign = has(user, "bookings.assign");

  const [list, counts, partners, sla] = await Promise.all([
    tab.filters
      ? listBookings({ ...tab.filters, partnerId, search: String(sp.q ?? "").slice(0, 80), limit, offset }, {})
      : listOverdueReports({ partnerId, limit, offset }),
    partnerOrderCounts(partnerId),
    listPartnerOptions(),
    partnerAcceptSla(SLA_DEFAULTS.partner_accept_hours),
  ]);

  const waitingHours = (b) => hoursSince(b.partner_assigned_at);
  const late = (b) => tab.key === "awaiting" && waitingHours(b) !== null && waitingHours(b) > sla;
  const href = (changes) => withParams("/crm/partner-orders", sp, changes);
  const partnerOptions = partners.map((p) => ({ value: String(p.id), label: p.name }));

  const reassign = (b) =>
    canAssign && b.status !== "cancelled" && !DONE.includes(b.status) ? (
      <FormModal
        action={assignPartnerAction}
        fields={{ id: b.id }}
        label={b.partner_status === "rejected" ? "Reassign" : "Change lab"}
        size="sm"
        variant={b.partner_status === "rejected" ? "primary" : "secondary"}
        icon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />}
        title={`Send ${bookingCode(b.id)} to a lab`}
        description={b.partner_reject_reason ? `${b.partner_name} rejected it: ${b.partner_reject_reason}` : `Now with ${b.partner_name ?? "no lab"}.`}
        submitLabel="Send to lab"
        modalSize="sm"
      >
        <Field label="Lab" htmlFor={`ra-${b.id}`}>
          <Select id={`ra-${b.id}`} name="partnerId" defaultValue="" required>
            <option value="" disabled>
              Select lab
            </option>
            {partners
              .filter((p) => Number(p.id) !== Number(b.partner_id))
              .map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.name}
                  {p.city ? ` — ${p.city}` : ""}
                </option>
              ))}
          </Select>
        </Field>
      </FormModal>
    ) : null;

  const waitCell = (b) => {
    if (tab.key === "awaiting") {
      return (
        <span className={late(b) ? "font-semibold text-rose-700" : ""}>
          {hours(waitingHours(b))}
          {late(b) && (
            <span className="block">
              <Badge tone="rose">Over {sla} h SLA</Badge>
            </span>
          )}
        </span>
      );
    }
    if (tab.key === "rejected") return <span className="line-clamp-2 max-w-[14rem] text-slate-600">{b.partner_reject_reason || "No reason given"}</span>;
    if (tab.key === "overdue") return <span className="font-semibold text-rose-700">Due {ago(b.report_due_at)}</span>;
    if (tab.key === "completed") return b.report_ready_at ? dateTime(b.report_ready_at) : "—";
    return b.report_due_at ? <span className="whitespace-nowrap">Due {dateTime(b.report_due_at)}</span> : <ReportStatusBadge status={b.report_status} />;
  };
  const waitLabel = { awaiting: "Waiting", rejected: "Reason", overdue: "Report", completed: "Report in", inlab: "Report" }[tab.key];

  return (
    <>
      <PageHeader
        title="Partner orders"
        description={`Orders sent to labs, by where they stand. Labs should accept within ${sla} h.`}
      />

      <Tabs
        active={tab.key}
        tabs={TABS.map((t) => ({ key: t.key, label: t.label, count: counts[t.key] ?? 0, href: href({ tab: t.key === "awaiting" ? null : t.key, page: null }) }))}
      />

      <FilterBar
        search={tab.filters ? { placeholder: "Booking ID or patient name" } : null}
        filters={[{ name: "partner", label: "Lab", options: partnerOptions }]}
      />

      <DataTable
        id="partner-orders-board"
        columns={[
          { key: "code", label: "Booking", hideable: false },
          { key: "lab", label: "Lab" },
          { key: "patient", label: "Patient" },
          { key: "tests", label: "Tests" },
          { key: "status", label: "Status" },
          { key: "wait", label: waitLabel },
          { key: "sent", label: "Sent to lab" },
          ...(canAssign ? [{ key: "act", label: "", align: "right" }] : []),
        ]}
        rows={list.rows}
        rowHref={(b) => `/crm/bookings/${b.id}`}
        cells={(b) => ({
          code: bookingCode(b.id),
          lab: b.partner_id ? (
            <Link href={`/crm/partners/${b.partner_id}`} className="whitespace-nowrap hover:text-blue-700">
              {b.partner_name}
            </Link>
          ) : (
            "—"
          ),
          patient: (
            <span className="whitespace-nowrap">
              {b.patient_name}
              {b.city ? <span className="block text-[11.5px] text-slate-500">{b.city}</span> : null}
            </span>
          ),
          tests: <span className="line-clamp-2 max-w-[14rem]">{b.items_label || "—"}</span>,
          status: (
            <span className="flex flex-col items-start gap-1">
              <BookingStatusBadge status={b.status} />
              {b.partner_status !== "accepted" && <PartnerStatusBadge status={b.partner_status} />}
            </span>
          ),
          wait: waitCell(b),
          sent: <span className="whitespace-nowrap">{b.partner_assigned_at ? dateTime(b.partner_assigned_at) : "—"}</span>,
          act: reassign(b),
        })}
        card={(b) => (
          <div className={late(b) ? "-m-3.5 rounded-2xl p-3.5 ring-2 ring-inset ring-rose-200" : ""}>
            <Link href={`/crm/bookings/${b.id}`} className="block">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-slate-500">
                    {bookingCode(b.id)} · {b.partner_name ?? "No lab"}
                  </p>
                  <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{b.patient_name}</p>
                  <p className="mt-0.5 line-clamp-1 text-[13px] text-slate-600">{b.items_label || "—"}</p>
                </div>
                <div className="shrink-0 text-right text-[12.5px]">
                  <p className="text-slate-500">{waitLabel}</p>
                  <div className="font-medium">{waitCell(b)}</div>
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <BookingStatusBadge status={b.status} />
                <PartnerStatusBadge status={b.partner_status} />
              </div>
            </Link>
            {reassign(b) && <div className="mt-3 grid border-t border-slate-100 pt-3">{reassign(b)}</div>}
          </div>
        )}
        empty={<Empty tab={tab.key} />}
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(n) => href({ page: n > 1 ? n : null })} />}
      />
    </>
  );
}

function Empty({ tab }) {
  const copy = {
    awaiting: [Hourglass, "Nothing waiting on a lab", "Every order sent to a lab has been answered."],
    rejected: [XCircle, "No rejected orders", "When a lab turns an order down it lands here to be sent elsewhere."],
    inlab: [FlaskConical, "Nothing in progress", "Accepted orders appear here until the report is in."],
    overdue: [AlarmClock, "No overdue reports", "Every report in progress is still within its turnaround time."],
    completed: [CheckCircle2, "No completed orders yet", "Orders move here once the lab's report is in."],
  }[tab];
  const [Icon, title, hint] = copy;
  return <EmptyState icon={<Icon className="h-5 w-5" />} title={title} hint={hint} />;
}
