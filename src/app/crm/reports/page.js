import Link from "next/link";
import { Download, Eye, FileCheck2, Send, ShieldCheck, Upload } from "lucide-react";

import FilterBar from "@/components/crm/FilterBar";
import { FormModal, QuickAction } from "@/components/crm/forms";
import {
  Badge,
  DataTable,
  EmptyState,
  Field,
  PageHeader,
  Pagination,
  ReportStatusBadge,
  Select,
  Tabs,
  btn,
  withParams,
} from "@/components/crm/ui";
import { PIPELINE, bookingCode } from "@/lib/crm/constants";
import { dateTime, isPast } from "@/lib/crm/format";
import { pageOf } from "@/lib/crm/filters";
import { has, requirePerm, scopeOf } from "@/lib/crm/guard";
import { REPORT_TABS, listAwaitingReports, reportTabCounts, reportTrail } from "@/lib/crm/stores/dashboard";
import { listReportQueue } from "@/lib/crm/stores/reports";

import { sendReportAction, verifyReportAction } from "../bookings/actions";

export const metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
const WAITING = ["waiting", "sample_received", "processing", "report_pending"];

/**
 * The report queue: what the labs still owe, what is overdue, what has come
 * in and needs verifying, what is verified and still has to reach the
 * patient, and what has been sent — with who uploaded, verified and sent
 * each one.
 *
 * A lab partner sees only its own orders (scope, in SQL) and only Upload;
 * verifying and sending stay with MedicoBharat staff (reports.verify).
 */
export default async function ReportsPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("reports.view", "/crm/reports");
  const scope = scopeOf(user);
  const partner = user.isPartner;
  const tab = REPORT_TABS.find((t) => t.key === one(sp.tab)) ?? REPORT_TABS[0];
  const { limit, offset } = pageOf(sp);
  const search = one(sp.q).slice(0, 80);

  const canVerify = has(user, "reports.verify") && !partner;
  const canUpload = has(user, "reports.manage");

  const [list, counts] = await Promise.all([
    tab.key === "awaiting"
      ? listAwaitingReports({ search, limit, offset }, scope)
      : listReportQueue({ status: tab.key === "overdue" ? "overdue" : tab.status ?? null, search, limit, offset }, scope),
    reportTabCounts(scope),
  ]);
  const trail = await reportTrail(list.rows.map((r) => r.report_id));

  const href = (changes) => withParams("/crm/reports", sp, changes);

  const due = (r) => {
    if (!r.report_due_at) return <span className="text-slate-400">Not set</span>;
    const late = WAITING.includes(r.report_status) && isPast(r.report_due_at);
    return (
      <span className="whitespace-nowrap">
        <span className={late ? "font-semibold text-rose-700" : ""}>{dateTime(r.report_due_at)}</span>
        {late && (
          <span className="block">
            <Badge tone="rose">Delayed</Badge>
          </span>
        )}
      </span>
    );
  };

  const trailLine = (r) => {
    const t = trail[r.report_id];
    if (!t) return null;
    return [
      `v${t.version} uploaded${t.uploaded_by_name ? ` by ${t.uploaded_by_name}` : ""} ${dateTime(t.uploaded_at)}`,
      t.verified_at && `verified${t.verified_by_name ? ` by ${t.verified_by_name}` : ""} ${dateTime(t.verified_at)}`,
      t.sent_at && `sent via ${t.sent_via || "—"}${t.sent_by_name ? ` by ${t.sent_by_name}` : ""} ${dateTime(t.sent_at)}`,
    ]
      .filter(Boolean)
      .join(" · ");
  };

  const actions = (r, full = false) => {
    const size = full ? "md" : "sm";
    const w = full ? "w-full" : "";
    const inLab = PIPELINE.indexOf(r.status) >= PIPELINE.indexOf("sample_collected");
    const mayUpload = canUpload && inLab && (!partner || r.partner_status === "accepted");
    return (
      <div className={full ? "grid grid-cols-2 gap-2" : "flex flex-wrap items-center justify-end gap-1.5"}>
        {r.file_id && (
          <>
            <a href={`/api/crm/files/${r.file_id}`} target="_blank" rel="noreferrer" className={btn("secondary", size, w)}>
              <Eye className="h-3.5 w-3.5" aria-hidden /> Preview
            </a>
            <a href={`/api/crm/files/${r.file_id}?download=1`} className={btn("secondary", size, w)}>
              <Download className="h-3.5 w-3.5" aria-hidden /> Download
            </a>
          </>
        )}
        {canVerify && r.report_id && r.live_report_status === "uploaded" && (
          <QuickAction action={verifyReportAction} fields={{ reportId: r.report_id }} variant="soft" size={size} className={w}>
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Verify
          </QuickAction>
        )}
        {canVerify && r.report_id && ["uploaded", "verified", "sent"].includes(r.live_report_status) && (
          <FormModal
            action={sendReportAction}
            fields={{ reportId: r.report_id }}
            label={r.live_report_status === "sent" ? "Mark re-sent" : "Mark sent"}
            variant={r.live_report_status === "verified" ? "primary" : "secondary"}
            size={size}
            className={w}
            icon={<Send className="h-3.5 w-3.5" aria-hidden />}
            title={`Report delivered · ${bookingCode(r.id)}`}
            description={r.patient_name}
            submitLabel="Mark sent"
            modalSize="sm"
          >
            <Field label="Sent by" htmlFor={`via-${r.id}`}>
              <Select id={`via-${r.id}`} name="via" defaultValue="whatsapp">
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="print">Printed copy</option>
                <option value="sms">SMS link</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <p className="text-[12.5px] text-slate-500">
              To message the patient, open the booking — its WhatsApp button has their number.
            </p>
          </FormModal>
        )}
        {mayUpload && !["verified", "sent"].includes(r.live_report_status ?? "") && (
          <Link href={`/crm/bookings/${r.id}#report`} className={btn(r.report_id ? "ghost" : "primary", size, w)}>
            <Upload className="h-3.5 w-3.5" aria-hidden /> {r.report_id ? "Replace" : "Upload"}
          </Link>
        )}
      </div>
    );
  };

  const emptyTitle = {
    awaiting: "No pending reports",
    overdue: "No overdue reports",
    verify: "Nothing waiting to be verified",
    verified: "No verified reports waiting to be sent",
    sent: "No reports sent yet",
    all: "No reports in the queue",
  }[tab.key];

  return (
    <>
      <PageHeader
        title="Reports"
        description={
          partner
            ? "Reports for your orders — upload each one as soon as it is ready."
            : "From the lab to the patient: awaiting, overdue, to verify, to send, sent."
        }
      />

      <Tabs
        active={tab.key}
        tabs={REPORT_TABS.map((t) => ({
          key: t.key,
          label: t.label,
          href: href({ tab: t.key === "awaiting" ? null : t.key, page: null }),
          count: counts[t.key],
        }))}
      />

      <FilterBar search={{ placeholder: partner ? "Order ID or patient name" : "Booking ID or patient name" }} />

      <DataTable
        id="reports-table"
        columns={[
          { key: "code", label: partner ? "Order" : "Booking" },
          { key: "patient", label: "Patient" },
          { key: "tests", label: "Tests" },
          ...(partner ? [] : [{ key: "lab", label: "Lab" }]),
          { key: "due", label: "Due" },
          { key: "status", label: "Report" },
          { key: "actions", label: "", align: "right" },
        ]}
        rows={list.rows}
        rowHref={(r) => `/crm/bookings/${r.id}`}
        cells={(r) => ({
          code: <span className="whitespace-nowrap">{bookingCode(r.id)}</span>,
          patient: (
            <span className="whitespace-nowrap">
              <span className="font-medium text-slate-900">{r.patient_name}</span>
              <span className="block text-[11.5px] text-slate-500">{[r.age ? `${r.age} y` : null, r.gender || null, r.city || null].filter(Boolean).join(" · ") || "—"}</span>
            </span>
          ),
          tests: <span className="line-clamp-2 max-w-[14rem]">{r.items_label || "—"}</span>,
          lab: r.partner_name || <Badge tone="amber">No lab</Badge>,
          due: due(r),
          status: (
            <span className="block max-w-[16rem]">
              <ReportStatusBadge status={r.report_status} />
              {trailLine(r) && <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{trailLine(r)}</span>}
            </span>
          ),
          actions: actions(r),
        })}
        card={(r) => (
          <div>
            <Link href={`/crm/bookings/${r.id}`} className="block">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-slate-500">
                    {bookingCode(r.id)}
                    {!partner && r.partner_name ? ` · ${r.partner_name}` : ""}
                  </p>
                  <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{r.patient_name}</p>
                  <p className="mt-0.5 line-clamp-1 text-[13px] text-slate-600">{r.items_label || "—"}</p>
                </div>
                <ReportStatusBadge status={r.report_status} />
              </div>
              <p className="mt-2 text-[12.5px] text-slate-600">Due: {due(r)}</p>
              {trailLine(r) && <p className="mt-1 text-[11.5px] leading-snug text-slate-500">{trailLine(r)}</p>}
            </Link>
            <div className="mt-3 border-t border-slate-100 pt-3">{actions(r, true)}</div>
          </div>
        )}
        empty={
          <EmptyState
            icon={<FileCheck2 className="h-5 w-5" />}
            title={search ? "No reports match this search" : emptyTitle}
            hint={
              tab.key === "awaiting"
                ? "Bookings appear here once the lab has the sample, until the report is uploaded."
                : tab.key === "verify"
                  ? "Uploaded reports wait here for a doctor or manager to verify them."
                  : "Try another tab."
            }
          />
        }
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(p) => href({ page: p > 1 ? p : null })} />}
      />
    </>
  );
}
