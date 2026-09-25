import { CalendarRange, Download, Layers, Pencil, Plus, Receipt, Trash2 } from "lucide-react";

import {
  Badge,
  Card,
  DataTable,
  EmptyState,
  KpiCard,
  PageHeader,
  Pagination,
  PaymentModeBadge,
  btn,
  withParams,
} from "@/components/crm/ui";
import { ConfirmAction, FormModal } from "@/components/crm/forms";
import FilterBar, { ColumnToggle } from "@/components/crm/FilterBar";
import ExpenseFields from "@/components/crm/finance/ExpenseFields";
import ShareBar from "@/components/crm/finance/ShareBar";
import { CATEGORY_COLOR } from "@/components/crm/finance/palette";
import { has, requirePerm } from "@/lib/crm/guard";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY, PAYMENT_MODES } from "@/lib/crm/constants";
import { istDay } from "@/lib/crm/dates";
import { pageOf } from "@/lib/crm/filters";
import { day, rupees, rupeesShort } from "@/lib/crm/format";
import { expenseFiltersFrom, expenseKpis, expensesByCategory, listExpenses } from "@/lib/crm/stores/finance";
import { listCities } from "@/lib/crm/stores/lookups";

import { deleteExpenseAction, saveExpenseAction } from "./actions";

export const metadata = { title: "Expenses" };
export const dynamic = "force-dynamic";

/**
 * Money out that is not a partner settlement: fuel, salaries, rent,
 * marketing, supplies. These feed the "Expenses" line of the P&L on
 * /crm/revenue. Deleting marks the row deleted (it stays in the log and in
 * the table) and drops it from every total.
 */
export default async function ExpensesPage({ searchParams }) {
  const sp = await searchParams;
  const user = await requirePerm("expenses.view", "/crm/expenses");
  const filters = expenseFiltersFrom(sp);
  const { limit, offset } = pageOf(sp);

  const [k, list, byCategory, cities] = await Promise.all([
    expenseKpis(),
    listExpenses({ ...filters, limit, offset }),
    expensesByCategory(filters),
    listCities({ includeInactive: true }),
  ]);

  const canManage = has(user, "expenses.manage");
  const canExport = has(user, "export.data");
  const href = (changes) => withParams("/crm/expenses", sp, changes);
  const today = istDay();
  const filtered = Boolean(filters.fromDay || filters.category || filters.mode || filters.cityId || filters.search);
  const byCatTotal = byCategory.reduce((a, c) => a + c.amount, 0);

  const columns = [
    { key: "date", label: "Date", hideable: false },
    { key: "category", label: "Category" },
    { key: "amount", label: "Amount", align: "right" },
    { key: "mode", label: "Paid by" },
    { key: "to", label: "Paid to" },
    { key: "city", label: "City" },
    { key: "ref", label: "Reference" },
    { key: "notes", label: "Notes" },
    { key: "by", label: "Added by" },
    ...(canManage ? [{ key: "actions", label: "", hideable: false }] : []),
  ];

  const add = canManage ? (
    <FormModal
      action={saveExpenseAction}
      label="Add expense"
      title="Add an expense"
      description="Anything the business spent that is not a lab settlement."
      submitLabel="Add expense"
      icon={<Plus className="h-4 w-4" aria-hidden />}
    >
      <ExpenseFields cities={cities} today={today} />
    </FormModal>
  ) : null;

  const actions = (e) =>
    canManage ? (
      <div className="flex items-center justify-end gap-1.5">
        <FormModal
          action={saveExpenseAction}
          fields={{ id: e.id }}
          label="Edit"
          size="sm"
          variant="ghost"
          icon={<Pencil className="h-3.5 w-3.5" aria-hidden />}
          title="Edit expense"
          description={`#${e.id} · added by ${e.created_by_name ?? "—"}`}
          submitLabel="Save changes"
        >
          <ExpenseFields e={e} cities={cities} today={today} />
        </FormModal>
        <ConfirmAction
          action={deleteExpenseAction}
          fields={{ id: e.id }}
          label="Delete"
          size="sm"
          variant="ghost"
          icon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
          title="Delete this expense?"
          body={`${rupees(e.amount)} · ${EXPENSE_CATEGORY[e.category]?.label ?? e.category}${e.paid_to ? ` · ${e.paid_to}` : ""} on ${day(e.spent_on)}. It is removed from every total but kept on record.`}
          confirmLabel="Delete"
        />
      </div>
    ) : null;

  return (
    <>
      <PageHeader
        title="Expenses"
        description="What the business spends to run — fuel, salaries, rent, marketing, supplies."
        actions={
          <>
            {canExport && (
              <a href={withParams("/api/crm/export/expenses", sp, { format: "xls", page: null })} className={btn("secondary")}>
                <Download className="h-4 w-4" aria-hidden /> Export
              </a>
            )}
            {add}
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="This month"
          value={rupeesShort(k.month)}
          current={k.month}
          previous={k.lastMtd}
          upIsGood={false}
          compareLabel="vs same days last month"
          icon={<Receipt className="h-4 w-4" />}
          tone="rose"
        />
        <KpiCard
          label="Top category this month"
          value={k.topCategory ? rupeesShort(k.topCategory.amount) : "—"}
          sub={k.topCategory ? `${EXPENSE_CATEGORY[k.topCategory.category]?.label ?? k.topCategory.category}${k.month ? ` · ${Math.round((k.topCategory.amount / k.month) * 100)}% of spend` : ""}` : "Nothing spent yet"}
          icon={<Layers className="h-4 w-4" />}
          tone="amber"
        />
        <KpiCard label="Entries this month" value={k.monthCount.toLocaleString("en-IN")} sub={k.monthCount ? `Avg ${rupees(k.month / k.monthCount)} each` : null} icon={<CalendarRange className="h-4 w-4" />} tone="slate" />
        <KpiCard label="Last month (full)" value={rupeesShort(k.lastFull)} sub="Total of every day last month" icon={<CalendarRange className="h-4 w-4" />} tone="slate" />
      </div>

      <FilterBar
        search={{ placeholder: "Paid to, bill no. or notes" }}
        filters={[
          { name: "range", label: "Any date", type: "range" },
          { name: "category", label: "Category", options: EXPENSE_CATEGORIES.map((c) => ({ value: c.key, label: c.label })) },
          { name: "mode", label: "Paid by", options: PAYMENT_MODES.map((m) => ({ value: m.key, label: m.label })) },
          { name: "city", label: "City", options: cities.map((c) => ({ value: String(c.id), label: c.name })) },
        ]}
      >
        <ColumnToggle tableId="expenses-table" columns={columns} />
      </FilterBar>

      <div className="mb-4">
        <Card
          title="Spend by category"
          description={`${filters.rangeLabel ?? "All time"}${filters.cityId || filters.mode || filters.search ? " · filtered" : ""} · ${rupees(byCatTotal)}`}
        >
          <ShareBar
            label={`Expenses by category, ${filters.rangeLabel ?? "all time"}`}
            segments={EXPENSE_CATEGORIES.map((c) => {
              const row = byCategory.find((x) => x.category === c.key);
              return {
                key: c.key,
                label: c.label,
                value: row?.amount ?? 0,
                display: rupees(row?.amount ?? 0),
                sub: row ? `${row.count} ${row.count === 1 ? "entry" : "entries"}` : null,
                color: CATEGORY_COLOR[c.key],
              };
            })}
            empty="No expenses in this period."
          />
        </Card>
      </div>

      <DataTable
        id="expenses-table"
        columns={columns}
        rows={list.rows}
        cells={(e) => ({
          date: <span className="whitespace-nowrap font-medium text-slate-900">{day(e.spent_on)}</span>,
          category: <CategoryLabel category={e.category} />,
          amount: <span className="font-semibold text-slate-900">{rupees(e.amount, { decimals: Number(e.amount) % 1 ? 2 : 0 })}</span>,
          mode: <PaymentModeBadge mode={e.mode} />,
          to: <span className="block max-w-[12rem] truncate">{e.paid_to || "—"}</span>,
          city: e.city_name ?? <span className="text-slate-400">—</span>,
          ref: <span className="block max-w-[9rem] truncate font-mono text-[12px]">{e.reference || "—"}</span>,
          notes: <span className="line-clamp-2 max-w-[14rem] text-[12.5px] text-slate-500">{e.notes || "—"}</span>,
          by: <span className="whitespace-nowrap">{e.created_by_name ?? "—"}</span>,
          actions: actions(e),
        })}
        card={(e) => (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-500">
                  {day(e.spent_on)}
                  {e.city_name ? ` · ${e.city_name}` : ""}
                </p>
                <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">{e.paid_to || EXPENSE_CATEGORY[e.category]?.label || e.category}</p>
                {e.notes && <p className="mt-0.5 line-clamp-2 text-[13px] text-slate-600">{e.notes}</p>}
              </div>
              <p className="shrink-0 text-[15px] font-semibold text-slate-900 tabular-nums">{rupees(e.amount)}</p>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <CategoryLabel category={e.category} />
              <PaymentModeBadge mode={e.mode} />
              {e.reference && <span className="font-mono text-[11.5px] text-slate-500">{e.reference}</span>}
            </div>
            {canManage && <div className="mt-3">{actions(e)}</div>}
          </div>
        )}
        empty={
          <EmptyState
            icon={<Receipt className="h-5 w-5" />}
            title={filtered ? "No expenses match these filters" : "No expenses recorded yet"}
            hint={filtered ? "Try a wider date range or clear the filters." : "Add what the business spends so the P&L on Revenue shows a real net profit."}
            action={add}
          />
        }
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="px-1 pt-3 text-[12.5px] text-slate-600">
              In this view: <span className="font-semibold text-slate-900 tabular-nums">{rupees(list.amount)}</span>
            </p>
            <Pagination total={list.total} limit={limit} offset={offset} hrefFor={(pg) => href({ page: pg > 1 ? pg : null })} />
          </div>
        }
      />
    </>
  );
}

/** Category with its chart swatch, so the list and the breakdown bar read together. */
function CategoryLabel({ category }) {
  return (
    <Badge tone="slate" dot={false}>
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: CATEGORY_COLOR[category] ?? "#94a3b8" }} />
        {EXPENSE_CATEGORY[category]?.label ?? category}
      </span>
    </Badge>
  );
}
