/**
 * The CRM's navigation, per user. Plain data (icon NAMES — see ICONS in
 * src/components/crm/Shell.jsx), built on the server from permissions.
 *
 * Showing a link is presentation only: every page re-checks with requirePerm.
 */
import { userCan } from "./permissions";

const STAFF_NAV = [
  {
    title: null,
    items: [
      { href: "/crm", label: "Dashboard", icon: "Gauge", perm: "dashboard.view" },
      { href: "/crm/executive", label: "Owner overview", icon: "Building2", perm: "executive.view" },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/crm/bookings", label: "Bookings", icon: "ClipboardList", perm: "bookings.view" },
      { href: "/crm/collections", label: "Collections", icon: "Truck", perm: "collections.view" },
      { href: "/crm/samples", label: "Samples", icon: "TestTube2", perm: "bookings.view" },
      { href: "/crm/reports", label: "Reports", icon: "FileCheck2", perm: "reports.view" },
    ],
  },
  {
    title: "CRM",
    items: [
      { href: "/crm/customers", label: "Customers", icon: "Users", perm: "customers.view" },
      { href: "/crm/leads", label: "Leads", icon: "UserPlus", perm: "leads.view" },
      { href: "/crm/calls", label: "Calls", icon: "PhoneCall", perm: "leads.view" },
      { href: "/crm/follow-ups", label: "Follow-ups", icon: "CalendarClock", perm: "leads.view" },
    ],
  },
  {
    title: "Partners",
    items: [
      { href: "/crm/partners", label: "Lab partners", icon: "FlaskConical", perm: "partners.view" },
      { href: "/crm/partner-orders", label: "Partner orders", icon: "Stethoscope", perm: "partners.view" },
      { href: "/crm/settlements", label: "Settlements", icon: "HandCoins", perm: "settlements.view" },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/crm/payments", label: "Payments", icon: "Wallet", perm: "payments.view" },
      { href: "/crm/revenue", label: "Revenue", icon: "BadgeIndianRupee", perm: "revenue.view" },
      { href: "/crm/expenses", label: "Expenses", icon: "Receipt", perm: "expenses.view" },
      { href: "/crm/refunds", label: "Refunds", icon: "Undo2", perm: ["refunds.manage", "payments.view"] },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/crm/tests", label: "Tests", icon: "TestTube2", perm: "catalog.view" },
      { href: "/crm/packages", label: "Packages", icon: "Package", perm: "catalog.view" },
      { href: "/crm/cities", label: "Cities", icon: "Map", perm: "catalog.view" },
      { href: "/crm/areas", label: "Service areas", icon: "MapPin", perm: "catalog.view" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { href: "/crm/analytics", label: "Business", icon: "BarChart3", perm: "analytics.view" },
      { href: "/crm/analytics/partners", label: "Partner analytics", icon: "BarChart3", perm: "analytics.view" },
      { href: "/crm/analytics/finance", label: "Financial", icon: "BarChart3", perm: ["analytics.view", "revenue.view"] },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/crm/users", label: "Users", icon: "UserCircle2", perm: "users.manage" },
      { href: "/crm/roles", label: "Roles & permissions", icon: "ShieldCheck", perm: "roles.manage" },
      { href: "/crm/notifications", label: "Notifications", icon: "Bell", perm: null },
      { href: "/crm/activity", label: "Activity log", icon: "Activity", perm: null },
      { href: "/crm/settings", label: "Settings", icon: "Settings", perm: "settings.manage" },
    ],
  },
];

const PARTNER_NAV = [
  {
    title: null,
    items: [
      { href: "/crm", label: "Dashboard", icon: "Gauge" },
      { href: "/crm/bookings", label: "Orders", icon: "ClipboardList" },
      { href: "/crm/reports", label: "Reports", icon: "FileCheck2" },
      { href: "/crm/settlements", label: "Payments", icon: "Wallet" },
      { href: "/crm/notifications", label: "Notifications", icon: "Bell" },
      { href: "/crm/activity", label: "Activity", icon: "Activity" },
      { href: "/crm/profile", label: "Profile", icon: "UserCircle2" },
    ],
  },
];

const allowed = (user, perm) => !perm || [].concat(perm).some((p) => userCan(user, p));

export function navFor(user) {
  if (user.isPartner) return PARTNER_NAV;
  return STAFF_NAV.map((s) => ({ ...s, items: s.items.filter((i) => allowed(user, i.perm)) })).filter((s) => s.items.length);
}

/** Up to four bottom-bar links (the fifth slot is "More"). */
export function bottomNavFor(user) {
  if (user.isPartner) {
    return [
      { href: "/crm", label: "Home", icon: "Gauge" },
      { href: "/crm/bookings", label: "Orders", icon: "ClipboardList" },
      { href: "/crm/reports", label: "Reports", icon: "FileCheck2" },
      { href: "/crm/settlements", label: "Payments", icon: "Wallet" },
    ];
  }
  const wanted = [
    { href: "/crm", label: "Home", icon: "Gauge", perm: "dashboard.view" },
    { href: "/crm/collections", label: "Collections", icon: "Truck", perm: "collections.view", only: "collector" },
    { href: "/crm/bookings", label: "Bookings", icon: "ClipboardList", perm: "bookings.view" },
    { href: "/crm/leads", label: "Leads", icon: "UserPlus", perm: "leads.view" },
    { href: "/crm/payments", label: "Payments", icon: "Wallet", perm: "payments.view" },
    { href: "/crm/collections", label: "Collections", icon: "Truck", perm: "collections.view" },
    { href: "/crm/notifications", label: "Alerts", icon: "Bell", perm: null },
  ];
  const out = [];
  for (const item of wanted) {
    if (item.only && item.only !== user.role) continue;
    if (!allowed(user, item.perm)) continue;
    if (out.some((o) => o.href === item.href)) continue;
    out.push(item);
    if (out.length === 4) break;
  }
  return out;
}

export function quickActionsFor(user) {
  if (user.isPartner) return [];
  return [
    { href: "/crm/bookings/new", label: "New booking", icon: "ClipboardList", perm: "bookings.manage" },
    { href: "/crm/customers/new", label: "New customer", icon: "Users", perm: "customers.manage" },
    { href: "/crm/leads/new", label: "Add lead", icon: "UserPlus", perm: "leads.manage" },
    { href: "/crm/payments/new", label: "Record payment", icon: "Wallet", perm: "payments.manage" },
    { href: "/crm/partners/new", label: "Add partner", icon: "FlaskConical", perm: "partners.manage" },
    { href: "/crm/tests/new", label: "Add test", icon: "TestTube2", perm: "catalog.manage" },
  ].filter((a) => allowed(user, a.perm));
}
