/**
 * Furniture the three analytics views share: the view tabs (which keep the
 * chosen range when you switch view) and the empty-period sentence.
 */
import { Tabs, withParams } from "@/components/crm/ui";
import { has } from "@/lib/crm/guard";

export const EMPTY_BOOKINGS = "No bookings in this period — try a longer range.";

export function AnalyticsTabs({ active, sp, user }) {
  const keep = { range: sp.range, from: sp.from, to: sp.to };
  const tabs = [
    { key: "business", label: "Business", href: withParams("/crm/analytics", keep) },
    { key: "partners", label: "Partners", href: withParams("/crm/analytics/partners", keep) },
    ...(has(user, "revenue.view")
      ? [{ key: "finance", label: "Financial", href: withParams("/crm/analytics/finance", keep) }]
      : []),
  ];
  return <Tabs tabs={tabs} active={active} />;
}
