"use server";

/**
 * Customer actions: create, edit, note. Calls and follow-ups logged from a
 * profile use the actions in ../calls and ../follow-ups, so a call is the
 * same record wherever it was typed in.
 */
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

import { query } from "@/lib/db";
import { crmAction, run } from "@/lib/crm/guard";
import { addNote } from "@/lib/crm/stores/bookings";
import { createCustomer, updateCustomer } from "@/lib/crm/stores/customers";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

function readCustomerForm(fd) {
  return {
    name: s(fd, "name"),
    phone: s(fd, "phone"),
    alt_phone: s(fd, "alt_phone"),
    email: s(fd, "email"),
    age: s(fd, "age"),
    gender: s(fd, "gender"),
    address: s(fd, "address"),
    city_id: s(fd, "city_id") || null,
    area: s(fd, "area"),
    landmark: s(fd, "landmark"),
    notes: s(fd, "notes"),
  };
}

export async function createCustomerAction(prev, fd) {
  let id;
  const result = await run("customers/create", async () => {
    const user = await crmAction("customers.manage");
    const out = await createCustomer(readCustomerForm(fd), { user });
    if (out.existingId) {
      return {
        ok: false,
        error: `${out.existingName || "A customer"} already has this mobile number.`,
        existingId: out.existingId,
        existingName: out.existingName,
      };
    }
    id = out.id;
    return { ok: true };
  });
  if (result.ok && id) redirect(`/crm/customers/${id}?created=1`);
  return result;
}

export async function updateCustomerAction(prev, fd) {
  const id = s(fd, "id");
  const result = await run("customers/update", async () => {
    const user = await crmAction("customers.manage");
    const input = readCustomerForm(fd);
    // updateCustomer stores the city name beside its id; read it from the
    // list. With no city picked, the old free-text city (a website customer)
    // comes back in a hidden field and is kept.
    input.city = s(fd, "city");
    if (input.city_id) {
      const [[c]] = await query("SELECT name FROM service_cities WHERE id = ?", [Number(input.city_id) || 0]);
      input.city = c?.name ?? input.city;
    }
    await updateCustomer(id, input, { user });
    return { ok: true };
  });
  if (result.ok) redirect(`/crm/customers/${id}?saved=1`);
  return result;
}

export async function customerNoteAction(prev, fd) {
  return run("customers/note", async () => {
    const user = await crmAction("customers.manage");
    await addNote("customer", s(fd, "id"), s(fd, "body"), { user });
    refresh();
    return { ok: true, message: "Note added." };
  });
}
