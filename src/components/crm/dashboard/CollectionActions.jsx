/**
 * The collector's buttons on one collection, for /crm/collections: call,
 * map, the next collection steps, record cash/UPI, add a note — and, for
 * staff who assign, "assign collector". Server component; every button is a
 * real form posting to the booking actions in src/app/crm/bookings/actions.js,
 * which re-check permission and scope (a collector can only touch their own).
 *
 * Thumb-sized on a phone (h-10+, full-width grid); a compact row in the
 * desktop table.
 */
import { CheckCircle2, MapPin, Phone, StickyNote, UserCheck, Wallet } from "lucide-react";

import { ConfirmAction, FormModal, QuickAction } from "@/components/crm/forms";
import { Field, Input, Select, Textarea, btn, cx } from "@/components/crm/ui";
import { COLLECTION_SLOTS, bookingCode } from "@/lib/crm/constants";
import { mapHref, rupees, telHref } from "@/lib/crm/format";
import {
  assignCollectorAction,
  collectionAction,
  noteAction,
  paymentAction,
} from "@/app/crm/bookings/actions";

export const addressOf = (b) => [b.address, b.area, b.landmark && `near ${b.landmark}`, b.city].filter(Boolean).join(", ");

export default function CollectionActions({ b, can, compact = false }) {
  const size = compact ? "sm" : "md";
  const open = b.collector_id && !["collected"].includes(b.collection_status);
  const step = (status, label, variant = "secondary") => (
    <QuickAction action={collectionAction} fields={{ id: b.id, status }} variant={variant} size={size} className={compact ? "" : "w-full"}>
      {label}
    </QuickAction>
  );
  const full = compact ? "" : "w-full";
  const address = addressOf(b);

  return (
    <div className={cx(compact ? "flex flex-wrap items-center justify-end gap-1.5" : "grid grid-cols-2 gap-2")}>
      <a href={telHref(b.patient_phone)} className={btn("secondary", size, full)} aria-label={`Call ${b.patient_name}`}>
        <Phone className="h-4 w-4" aria-hidden /> {compact ? "Call" : "Call customer"}
      </a>
      {address ? (
        <a href={mapHref(address)} target="_blank" rel="noreferrer" className={btn("secondary", size, full)}>
          <MapPin className="h-4 w-4" aria-hidden /> {compact ? "Map" : "Open map"}
        </a>
      ) : (
        <span className={btn("secondary", size, cx(full, "pointer-events-none opacity-50"))}>No address</span>
      )}

      {can.collect && open && (
        <>
          {b.collection_status === "assigned" && step("confirmed", "Confirmed")}
          {["assigned", "confirmed"].includes(b.collection_status) && step("on_the_way", "On the way")}
          {["assigned", "confirmed", "on_the_way"].includes(b.collection_status) && step("arrived", "Mark arrived")}
          <QuickAction
            action={collectionAction}
            fields={{ id: b.id, status: "collected" }}
            variant="success"
            size={size}
            className={compact ? "" : "col-span-2 h-12 w-full text-[14.5px]"}
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Mark collected
          </QuickAction>
          <ConfirmAction
            action={collectionAction}
            fields={{ id: b.id, status: "failed" }}
            label="Mark failed"
            variant="ghost"
            size={size}
            className={full}
            title={`Collection failed · ${bookingCode(b.id)}`}
            body="Say what happened — customer not home, refused, wrong address…"
            reason
            reasonLabel="Why did it fail?"
            confirmLabel="Mark failed"
          />
        </>
      )}

      {can.pay && b.due > 0 && (
        <FormModal
          action={paymentAction}
          fields={{ id: b.id, status: "paid" }}
          label={compact ? "Payment" : `Record ${rupees(b.due)}`}
          variant="soft"
          size={size}
          className={full}
          icon={<Wallet className="h-4 w-4" aria-hidden />}
          title="Record cash / UPI"
          description={`${bookingCode(b.id)} · ${b.patient_name} · ${rupees(b.due)} to collect`}
          submitLabel="Record payment"
          modalSize="sm"
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount" required htmlFor={`amt-${b.id}`}>
              <Input id={`amt-${b.id}`} name="amount" inputMode="decimal" required defaultValue={b.due} />
            </Field>
            <Field label="Mode" required htmlFor={`mode-${b.id}`}>
              <Select id={`mode-${b.id}`} name="mode" defaultValue="cash">
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="other">Other</option>
              </Select>
            </Field>
          </div>
          <Field label="UPI reference / UTR" hint="Optional for cash." htmlFor={`ref-${b.id}`}>
            <Input id={`ref-${b.id}`} name="reference" maxLength={120} />
          </Field>
        </FormModal>
      )}

      {can.note && (
        <FormModal
          action={noteAction}
          fields={{ id: b.id }}
          label="Add note"
          variant="ghost"
          size={size}
          className={full}
          icon={<StickyNote className="h-4 w-4" aria-hidden />}
          title={`Note on ${bookingCode(b.id)}`}
          submitLabel="Add note"
          modalSize="sm"
        >
          <Field label="Note" htmlFor={`note-${b.id}`}>
            <Textarea id={`note-${b.id}`} name="body" rows={3} maxLength={2000} required placeholder="Gate code, customer asked to come at 8, fasting not done…" />
          </Field>
        </FormModal>
      )}
    </div>
  );
}

/** "Assign collector" for an unassigned collection (staff with bookings.assign). */
export function AssignCollector({ b, collectors, compact = false }) {
  return (
    <FormModal
      action={assignCollectorAction}
      fields={{ id: b.id }}
      label="Assign collector"
      variant="primary"
      size={compact ? "sm" : "md"}
      className={compact ? "" : "w-full"}
      icon={<UserCheck className="h-4 w-4" aria-hidden />}
      title={`Assign ${bookingCode(b.id)}`}
      description={`${b.patient_name}${b.area ? ` · ${b.area}` : ""}`}
      submitLabel="Assign"
      modalSize="sm"
    >
      <Field label="Collector" required htmlFor={`col-${b.id}`}>
        <Select id={`col-${b.id}`} name="collectorId" required defaultValue="">
          <option value="" disabled>
            Pick a person
          </option>
          {collectors.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name || c.email}
              {c.role !== "collector" ? ` (${c.role})` : ""}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Slot" htmlFor={`slot-${b.id}`}>
        <Select id={`slot-${b.id}`} name="collectionSlot" defaultValue={b.collection_slot}>
          <option value="">Any time</option>
          {COLLECTION_SLOTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>
    </FormModal>
  );
}
