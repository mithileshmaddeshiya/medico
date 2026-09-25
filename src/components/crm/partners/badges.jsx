/** Badges for a partner record's own status and its agreement. Server-safe. */
import { Badge } from "@/components/crm/ui";
import { AGREEMENT, PARTNER_RECORD_STATUS } from "@/lib/crm/stores/partners";

export function PartnerRecordBadge({ status }) {
  const s = PARTNER_RECORD_STATUS[status];
  return <Badge tone={s?.tone ?? "slate"}>{s?.label ?? status}</Badge>;
}

export function AgreementBadge({ status }) {
  const a = AGREEMENT[status] ?? AGREEMENT.none;
  return (
    <Badge tone={a.tone} dot={false}>
      {a.label}
    </Badge>
  );
}
