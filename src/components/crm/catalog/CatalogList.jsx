/**
 * The tests list and the packages list — one table, two filters on
 * lab_tests.is_package, so the two screens cannot drift apart. Server
 * component; the pages pass their searchParams and the signed-in user.
 */
import Link from "next/link";
import { Download, Globe, Package, Plus, TestTube2 } from "lucide-react";

import FilterBar, { ColumnToggle } from "@/components/crm/FilterBar";
import { Badge, ButtonLink, DataTable, EmptyState, Notice, PageHeader, Pagination, btn, withParams } from "@/components/crm/ui";
import { SAMPLE_TYPES, TEST_CATEGORIES, TEST_CATEGORY } from "@/lib/crm/constants";
import { pageOf } from "@/lib/crm/filters";
import { hours, rupees } from "@/lib/crm/format";
import { has } from "@/lib/crm/guard";
import { TEST_STATUS, catalogFiltersFrom, listCatalog } from "@/lib/crm/stores/catalog";

export function StatusBadge({ status }) {
  const s = TEST_STATUS[status] ?? { label: status, tone: "slate" };
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

const priceText = (t) => (t.price === null ? <span className="text-slate-500">Call for price</span> : rupees(t.price, { decimals: t.price % 1 ? 2 : 0 }));

export default async function CatalogList({ sp, user, kind }) {
  const isPackage = kind === "package";
  const base = isPackage ? "/crm/packages" : "/crm/tests";
  const filters = catalogFiltersFrom(sp);
  const { limit, offset } = pageOf(sp);
  const list = await listCatalog({ ...filters, isPackage, limit, offset });

  const canManage = has(user, "catalog.manage");
  const canExport = has(user, "export.data");
  const showMargin = has(user, "revenue.view");
  const href = (changes) => withParams(base, sp, changes);
  const filtered = Boolean(filters.search || filters.category || filters.sampleType || filters.onSite || filters.status);

  const columns = [
    { key: "name", label: isPackage ? "Package" : "Test", hideable: false },
    { key: "category", label: "Category" },
    ...(isPackage ? [{ key: "tests", label: "Tests", align: "right" }] : [{ key: "sample", label: "Sample" }]),
    { key: "fasting", label: "Fasting" },
    { key: "tat", label: "TAT", align: "right" },
    { key: "price", label: "Price", align: "right" },
    { key: "mrp", label: "MRP / off", align: "right" },
    { key: "partner", label: isPackage ? "Partner cost" : "Partner price", align: "right" },
    ...(showMargin ? [{ key: "margin", label: "Margin", align: "right" }] : []),
    { key: "site", label: "Website" },
    { key: "status", label: "Status" },
  ];
  const tableId = isPackage ? "packages-table" : "tests-table";
  const Icon = isPackage ? Package : TestTube2;

  return (
    <>
      <PageHeader
        title={isPackage ? "Packages" : "Tests"}
        description={
          isPackage
            ? "Health checkup packages: which tests they bundle, their price, partner cost and whether the website shows them."
            : "Every test you offer — price, partner price, sample, turnaround — and whether the website shows it."
        }
        actions={
          <>
            {canExport && (
              <a href={withParams("/api/crm/export/tests", sp, { format: "xls", page: null, kind: isPackage ? "packages" : null })} className={btn("secondary")}>
                <Download className="h-4 w-4" aria-hidden /> Export
              </a>
            )}
            {canManage && (
              <ButtonLink href={`${base}/new`} variant="primary">
                <Plus className="h-4 w-4" aria-hidden /> {isPackage ? "New package" : "New test"}
              </ButtonLink>
            )}
          </>
        }
      />

      <div className="mb-4">
        <Notice tone="slate" icon={<Globe className="h-4 w-4" aria-hidden />}>
          These are the same rows the website shows. “On website” items are live on medicobharat.com at the price here; the
          rest can still be booked by staff. Images, SEO text and filter chips stay in the <Link href="/admin/tests" className="font-semibold underline">website admin</Link>.
        </Notice>
      </div>

      <FilterBar
        search={{ placeholder: "Name or code" }}
        filters={[
          { name: "category", label: "Category", options: TEST_CATEGORIES.map((c) => ({ value: c.key, label: c.label })) },
          ...(isPackage ? [] : [{ name: "sample", label: "Sample", options: SAMPLE_TYPES.map((t) => ({ value: t, label: t })) }]),
          { name: "site", label: "On website", options: [{ value: "yes", label: "On website" }, { value: "no", label: "Not on website" }] },
          { name: "status", label: "Status", options: Object.entries(TEST_STATUS).map(([value, s]) => ({ value, label: s.label })) },
        ]}
      >
        <ColumnToggle tableId={tableId} columns={columns} />
      </FilterBar>

      <DataTable
        id={tableId}
        columns={columns}
        rows={list.rows}
        rowHref={(t) => `${base}/${encodeURIComponent(t.id)}`}
        cells={(t) => ({
          name: (
            <span className="block max-w-[18rem]">
              <span className="block truncate">{t.name}</span>
              <span className="block text-[11.5px] font-normal text-slate-500">{t.code || t.id}</span>
            </span>
          ),
          category: TEST_CATEGORY[t.crm_category]?.label ?? t.crm_category,
          tests: t.package_tests.length || "—",
          sample: t.sample_type,
          fasting: t.fasting ? <Badge tone="amber" dot={false}>Fasting</Badge> : <span className="text-slate-400">No</span>,
          tat: hours(t.tat_hours),
          price: <span className="font-semibold text-slate-900">{priceText(t)}</span>,
          mrp: t.mrp ? (
            <span className="whitespace-nowrap">
              {rupees(t.mrp)}
              {t.discount_pct ? <span className="block text-[11.5px] text-emerald-700">{t.discount_pct}% off</span> : null}
            </span>
          ) : (
            "—"
          ),
          partner: rupees(t.partner_price),
          margin: t.margin === null ? "—" : <span className={t.margin < 0 ? "text-rose-700" : "text-emerald-700"}>{rupees(t.margin)}</span>,
          site: t.on_site ? <Badge tone="blue">On website</Badge> : <span className="text-slate-400">No</span>,
          status: <StatusBadge status={t.status} />,
        })}
        card={(t) => (
          <Link href={`${base}/${encodeURIComponent(t.id)}`} className="block">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-slate-900">{t.name}</p>
                <p className="mt-0.5 text-[12.5px] text-slate-500">
                  {[t.code, TEST_CATEGORY[t.crm_category]?.label, isPackage ? `${t.package_tests.length} tests` : t.sample_type, hours(t.tat_hours)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <p className="shrink-0 text-right text-[15px] font-semibold tabular-nums text-slate-900">
                {priceText(t)}
                {t.mrp ? <span className="block text-[11.5px] font-normal text-slate-400 line-through">{rupees(t.mrp)}</span> : null}
              </p>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <StatusBadge status={t.status} />
              {t.fasting && <Badge tone="amber" dot={false}>Fasting</Badge>}
              {t.partner_price !== null && <Badge tone="slate" dot={false}>Partner {rupees(t.partner_price)}</Badge>}
              {showMargin && t.margin !== null && <Badge tone={t.margin < 0 ? "rose" : "emerald"} dot={false}>Margin {rupees(t.margin)}</Badge>}
            </div>
          </Link>
        )}
        empty={
          <EmptyState
            icon={<Icon className="h-5 w-5" />}
            title={filtered ? `No ${isPackage ? "packages" : "tests"} match these filters` : `No ${isPackage ? "packages" : "tests"} yet`}
            hint={filtered ? "Clear a filter or search for a shorter name." : isPackage ? "Bundle single tests into a checkup package with its own price." : "Add the tests you offer with their price and partner cost."}
            action={
              canManage && !filtered ? (
                <ButtonLink href={`${base}/new`} variant="primary">
                  <Plus className="h-4 w-4" aria-hidden /> {isPackage ? "New package" : "New test"}
                </ButtonLink>
              ) : null
            }
          />
        }
        footer={<Pagination total={list.total} limit={limit} offset={offset} hrefFor={(p) => href({ page: p > 1 ? p : null })} />}
      />
    </>
  );
}
