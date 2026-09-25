/**
 * One test or package: usage, website status, the edit form and its history.
 * Shared by /crm/tests/[id] and /crm/packages/[id]; a row opened under the
 * wrong one is redirected to the right one.
 */
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Archive, ArchiveRestore, Eye, EyeOff, Trash2 } from "lucide-react";

import { moveCatalogAction, updateCatalogAction } from "@/app/crm/tests/actions";
import { ConfirmAction, QuickAction } from "@/components/crm/forms";
import { Badge, Card, Facts, KpiCard, Notice, PageHeader, Timeline } from "@/components/crm/ui";
import { recordHistory } from "@/lib/crm/activity";
import { TEST_CATEGORY } from "@/lib/crm/constants";
import { ago, hours, rupees } from "@/lib/crm/format";
import { has } from "@/lib/crm/guard";
import { getCatalogItem, listPackableTests, packagesContaining, testUsage } from "@/lib/crm/stores/catalog";

import { StatusBadge } from "./CatalogList";
import TestForm from "./TestForm";

export default async function CatalogDetail({ id, sp, user, kind }) {
  const isPackage = kind === "package";
  const item = await getCatalogItem(id);
  if (!item) notFound();
  if (item.is_package !== isPackage) redirect(`/crm/${item.is_package ? "packages" : "tests"}/${encodeURIComponent(item.id)}`);

  const canManage = has(user, "catalog.manage");
  const showMargin = has(user, "revenue.view");
  const base = isPackage ? "/crm/packages" : "/crm/tests";

  const [usage, history, tests, inPackages] = await Promise.all([
    testUsage(item.id),
    recordHistory(user, "lab_tests", item.id, { limit: 30 }),
    isPackage ? listPackableTests() : [],
    isPackage ? [] : packagesContaining(item.id),
  ]);

  const byId = new Map(tests.map((t) => [t.id, t]));
  const included = item.package_tests.map((tid) => byId.get(tid)).filter(Boolean);
  const separately = included.reduce((a, t) => a + (t.price ?? 0), 0);
  const autoIncludes = included.map((t) => t.name).join(", ").slice(0, 300);
  const live = ["active", "hidden"].includes(item.status);
  const noun = isPackage ? "package" : "test";

  const move = (m, label, icon, variant = "secondary") => (
    <QuickAction action={moveCatalogAction} fields={{ id: item.id, move: m }} variant={variant}>
      {icon}
      {label}
    </QuickAction>
  );

  return (
    <>
      <PageHeader
        back={{ href: base, label: isPackage ? "Packages" : "Tests" }}
        title={item.name}
        description={[item.code || item.id, TEST_CATEGORY[item.crm_category]?.label, isPackage ? `${item.package_tests.length} tests` : item.sample_type, `TAT ${hours(item.tat_hours)}`]
          .filter(Boolean)
          .join(" · ")}
        actions={
          canManage && (
            <>
              {item.status === "hidden" && move("site", "Show on website", <Eye className="h-4 w-4" aria-hidden />, "primary")}
              {item.status === "active" && (
                <ConfirmAction
                  action={moveCatalogAction}
                  fields={{ id: item.id, move: "hide" }}
                  label="Hide from website"
                  icon={<EyeOff className="h-4 w-4" aria-hidden />}
                  title={`Take this ${noun} off the website?`}
                  body="Customers will no longer see or book it online. Staff can still book it."
                  confirmLabel="Hide it"
                />
              )}
              {live && (
                <ConfirmAction
                  action={moveCatalogAction}
                  fields={{ id: item.id, move: "deactivate" }}
                  label="Deactivate"
                  icon={<Archive className="h-4 w-4" aria-hidden />}
                  title={`Deactivate this ${noun}?`}
                  body="It comes off the website and cannot be added to new bookings. Past bookings are untouched. You can activate it again."
                  confirmLabel="Deactivate"
                />
              )}
              {item.status === "archived" && move("activate", "Activate", <ArchiveRestore className="h-4 w-4" aria-hidden />)}
              {item.status === "deleted" && move("restore", "Restore", <ArchiveRestore className="h-4 w-4" aria-hidden />)}
              {item.status !== "deleted" && (
                <ConfirmAction
                  action={moveCatalogAction}
                  fields={{ id: item.id, move: "delete" }}
                  label="Delete"
                  variant="ghost"
                  icon={<Trash2 className="h-4 w-4" aria-hidden />}
                  title={`Delete ${item.name}?`}
                  body="It is removed from the website and from booking. The row and its history are kept, and it can be restored."
                  confirmLabel="Delete"
                />
              )}
            </>
          )
        }
      />

      {sp.created && (
        <div className="mb-4">
          <Notice tone="emerald" title={`${isPackage ? "Package" : "Test"} created`}>
            {item.on_site ? "It is live on the website now." : "It is bookable by staff. Tick “Show on website” when it should go live."}
          </Notice>
        </div>
      )}
      {item.status === "deleted" && (
        <div className="mb-4">
          <Notice tone="rose" title="Deleted">Restore it to edit or book it again.</Notice>
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Used in bookings" value={usage.total.toLocaleString("en-IN")} sub="All time" />
        <KpiCard label="Bookings, last 30 days" value={usage.last30.toLocaleString("en-IN")} />
        <KpiCard label="Customer price" value={item.price === null ? "Call" : rupees(item.price)} sub={item.discount_pct ? `${item.discount_pct}% off MRP ${rupees(item.mrp)}` : undefined} />
        {showMargin ? (
          <KpiCard label="Margin" value={item.margin === null ? "—" : rupees(item.margin)} sub={item.partner_price === null ? "No partner price set" : `Partner ${rupees(item.partner_price)}`} />
        ) : (
          <KpiCard label="Website" value={item.on_site ? "Live" : "Off"} sub={<StatusBadge status={item.status} />} />
        )}
      </div>

      {isPackage && included.length > 0 && (
        <div className="mb-5">
          <Notice tone={item.price !== null && separately > item.price ? "emerald" : "amber"}>
            {included.length} tests bought separately cost {rupees(separately)}.{" "}
            {item.price !== null && separately > item.price
              ? `The customer saves ${rupees(separately - item.price)} with this package.`
              : "The package price is not below that — check it."}
          </Notice>
        </div>
      )}

      <div className="space-y-5">
        {canManage && item.status !== "deleted" ? (
          <TestForm
            action={updateCatalogAction}
            kind={kind}
            initial={{ ...item, includes_auto: isPackage && item.includes === autoIncludes }}
            tests={tests}
            showMargin={showMargin}
            canSetSite={live}
          />
        ) : (
          <Card title="Details">
            <Facts
              items={[
                { label: "Status", value: <StatusBadge status={item.status} /> },
                { label: "On website", value: item.on_site ? "Yes" : "No" },
                { label: "Fasting", value: item.fasting ? "Required" : "No" },
                { label: "Parameters", value: item.params ?? "" },
                { label: "Partner price", value: rupees(item.partner_price) },
                { label: "Includes", value: item.includes, wide: true },
                { label: "Description", value: item.description ?? "", wide: true },
              ]}
            />
            {isPackage && included.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {included.map((t) => (
                  <li key={t.id}>
                    <Link href={`/crm/tests/${encodeURIComponent(t.id)}`}>
                      <Badge tone="blue" dot={false}>{t.name}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {!isPackage && inPackages.length > 0 && (
          <Card title="Included in packages">
            <ul className="flex flex-wrap gap-1.5">
              {inPackages.map((p) => (
                <li key={p.id}>
                  <Link href={`/crm/packages/${encodeURIComponent(p.id)}`}>
                    <Badge tone="blue" dot={false}>{p.name}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card title="History" description="Changes from the CRM and the website admin.">
          <Timeline
            items={history.map((h) => ({
              id: h.id,
              title: h.summary || `${h.action} ${noun}`,
              meta: `${h.user_name || h.user_email || "System"} · ${ago(h.created_at)}`,
              tone: h.action === "delete" ? "rose" : h.action === "create" ? "emerald" : "blue",
            }))}
            empty={<p className="text-[13px] text-slate-500">No changes recorded yet.</p>}
          />
        </Card>
      </div>
    </>
  );
}
