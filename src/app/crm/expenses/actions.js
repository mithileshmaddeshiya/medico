"use server";

/** Expense actions: add, edit, soft delete. Validation lives in stores/finance.js. */
import { refresh } from "next/cache";

import { crmAction, run } from "@/lib/crm/guard";
import { deleteExpense, saveExpense } from "@/lib/crm/stores/finance";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

export async function saveExpenseAction(prev, fd) {
  return run("finance/expense", async () => {
    const user = await crmAction("expenses.manage");
    const id = Number(s(fd, "id")) || null;
    const res = await saveExpense(
      id,
      {
        category: s(fd, "category"),
        amount: s(fd, "amount"),
        spentOn: s(fd, "spentOn"),
        mode: s(fd, "mode"),
        paidTo: s(fd, "paidTo"),
        cityId: s(fd, "cityId"),
        reference: s(fd, "reference"),
        notes: s(fd, "notes"),
      },
      { user }
    );
    refresh();
    return { ok: true, message: res.unchanged ? "Nothing changed." : id ? "Expense updated." : "Expense added." };
  });
}

export async function deleteExpenseAction(prev, fd) {
  return run("finance/expense-delete", async () => {
    const user = await crmAction("expenses.manage");
    await deleteExpense(s(fd, "id"), { user });
    refresh();
    return { ok: true, message: "Expense deleted." };
  });
}
