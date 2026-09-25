/**
 * "Generate settlement" — a FormModal used on the settlements page (pick the
 * lab) and on a partner's profile (lab fixed). Defaults to last month, the
 * usual cycle; the server decides which bookings go in (see
 * generateSettlement in src/lib/crm/stores/settlements.js).
 */
import { HandCoins } from "lucide-react";

import { FormModal } from "@/components/crm/forms";
import { Field, Input, Select } from "@/components/crm/ui";
import { addDays, istDay } from "@/lib/crm/dates";
import { generateSettlementAction } from "@/app/crm/settlements/actions";

export default function GenerateSettlement({ partner = null, partners = [], label = "Generate settlement", variant = "primary", size = "md" }) {
  const today = istDay();
  const lastMonthEnd = addDays(`${today.slice(0, 7)}-01`, -1);
  const lastMonthStart = `${lastMonthEnd.slice(0, 7)}-01`;

  return (
    <FormModal
      action={generateSettlementAction}
      fields={partner ? { partnerId: partner.id } : {}}
      label={label}
      variant={variant}
      size={size}
      icon={<HandCoins className="h-4 w-4" aria-hidden />}
      title={partner ? `Settlement for ${partner.name}` : "Generate settlement"}
      description="Every accepted order whose report came in during the period and is not on another settlement."
      submitLabel="Generate"
    >
      {!partner && (
        <Field label="Lab partner" required htmlFor="gs-partner">
          <Select id="gs-partner" name="partnerId" required defaultValue="">
            <option value="" disabled>
              Select lab
            </option>
            {partners.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="From" required htmlFor="gs-from">
          <Input id="gs-from" name="from" type="date" required defaultValue={lastMonthStart} max={today} />
        </Field>
        <Field label="To" required htmlFor="gs-to">
          <Input id="gs-to" name="to" type="date" required defaultValue={lastMonthEnd} max={today} />
        </Field>
      </div>
      <Field label="Note (internal)" htmlFor="gs-notes">
        <Input id="gs-notes" name="notes" maxLength={500} />
      </Field>
    </FormModal>
  );
}
