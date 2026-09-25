"use server";

/**
 * Lab partner actions: the record, its price list and its sign-in accounts.
 * Every one needs partners.manage and goes through the store in
 * src/lib/crm/stores/partners.js, which validates and writes the activity row.
 * redirect() is called outside run() so Next's control-flow throw is not
 * swallowed as an error.
 */
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

import { crmAction, run, UserError } from "@/lib/crm/guard";
import {
  archivePartner,
  createPartnerLogin,
  savePartner,
  setPartnerLoginStatus,
  setPartnerPrice,
} from "@/lib/crm/stores/partners";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

function readPartnerForm(fd) {
  return {
    name: s(fd, "name"),
    contactPerson: s(fd, "contactPerson"),
    phone: s(fd, "phone"),
    altPhone: s(fd, "altPhone"),
    email: s(fd, "email"),
    address: s(fd, "address"),
    cityId: s(fd, "cityId") || null,
    gstin: s(fd, "gstin"),
    bankName: s(fd, "bankName"),
    bankAccount: s(fd, "bankAccount"),
    bankIfsc: s(fd, "bankIfsc"),
    upiId: s(fd, "upiId"),
    services: s(fd, "services"),
    pricingNote: s(fd, "pricingNote"),
    defaultSharePct: s(fd, "defaultSharePct"),
    agreementStatus: s(fd, "agreementStatus"),
    status: s(fd, "status"),
    joinedOn: s(fd, "joinedOn"),
    notes: s(fd, "notes"),
    cityIds: fd.getAll("cityIds").map(String),
  };
}

export async function savePartnerAction(prev, fd) {
  const existing = s(fd, "id");
  let id;
  const result = await run("partners/save", async () => {
    const user = await crmAction("partners.manage");
    const input = readPartnerForm(fd);
    // The bank account field is left blank on edit to keep the stored one —
    // the form never echoes the full number back into the page.
    if (existing && !input.bankAccount && s(fd, "keepBankAccount") === "1") delete input.bankAccount;
    id = await savePartner(existing || null, input, { user });
    return { ok: true };
  });
  if (result.ok && id) redirect(`/crm/partners/${id}?${existing ? "saved" : "created"}=1`);
  return result;
}

export async function archivePartnerAction(prev, fd) {
  const result = await run("partners/archive", async () => {
    const user = await crmAction("partners.manage");
    await archivePartner(s(fd, "id"), { user });
    return { ok: true };
  });
  if (result.ok) redirect("/crm/partners?removed=1");
  return result;
}

export async function partnerPriceAction(prev, fd) {
  return run("partners/price", async () => {
    const user = await crmAction("partners.manage");
    const raw = s(fd, "price");
    if (raw !== "" && !/^\d+(\.\d{1,2})?$/.test(raw)) throw new UserError("Enter the price in rupees, e.g. 250 or 249.50.");
    const res = await setPartnerPrice(s(fd, "partnerId"), s(fd, "testId"), raw === "" ? null : Number(raw), { user });
    refresh();
    return { ok: true, message: res.unchanged ? "No change." : raw === "" ? "Own price removed — standard price applies." : "Price saved." };
  });
}

export async function createPartnerLoginAction(prev, fd) {
  return run("partners/login", async () => {
    const user = await crmAction("partners.manage");
    await createPartnerLogin(s(fd, "partnerId"), { name: s(fd, "name"), email: s(fd, "email"), password: String(fd.get("password") ?? "") }, { user });
    refresh();
    return { ok: true, message: "Login created. Share the temporary password in person or by phone, not by email." };
  });
}

export async function partnerLoginStatusAction(prev, fd) {
  return run("partners/login-status", async () => {
    const user = await crmAction("partners.manage");
    const status = s(fd, "status");
    await setPartnerLoginStatus(s(fd, "partnerId"), s(fd, "userId"), status, { user });
    refresh();
    return { ok: true, message: status === "active" ? "Login enabled." : "Login disabled and signed out everywhere." };
  });
}
