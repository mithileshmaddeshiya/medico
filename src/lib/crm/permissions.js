/**
 * Who may do what in the CRM. Plain data, no imports — safe to read from a
 * client component (to hide a button) and from the server (to refuse the
 * action). Hiding is presentation; refusing is security. Every server action
 * and route handler checks with requirePerm/crmAction in ./guard.js.
 *
 * ── PERMISSIONS ARE PER MODULE, SPLIT VIEW / MANAGE ──────────────────────
 * `<module>.view` reads, `<module>.manage` writes. A few actions that are
 * worth separating from ordinary editing get their own key (verifying a
 * report, exporting data, changing permissions).
 *
 * ── ROLES ────────────────────────────────────────────────────────────────
 * The admin panel's three roles still exist and still work here:
 *   owner   everything, always — an owner cannot be locked out by an edit
 *   editor  treated as a manager
 *   viewer  read-only across operations
 * and the CRM adds the five it needs. The owner can change any role's set from
 * /crm/roles (stored in crm_role_permissions); these are the defaults and the
 * fallback when no override exists.
 *
 * `partner` is special: whatever its permission set says, every query it makes
 * is filtered to its own partner_id on the server. Its set only decides which
 * of its OWN screens it gets.
 */

export const PERMISSIONS = [
  { key: "dashboard.view", group: "Overview", label: "Operations dashboard" },
  { key: "executive.view", group: "Overview", label: "Owner executive view (revenue, margin)" },

  { key: "bookings.view", group: "Operations", label: "See bookings" },
  { key: "bookings.manage", group: "Operations", label: "Create and update bookings" },
  { key: "bookings.assign", group: "Operations", label: "Assign collector and lab partner" },
  { key: "collections.view", group: "Operations", label: "See collections" },
  { key: "collections.manage", group: "Operations", label: "Update collection status" },
  { key: "reports.view", group: "Operations", label: "See and download reports" },
  { key: "reports.manage", group: "Operations", label: "Upload / replace reports" },
  { key: "reports.verify", group: "Operations", label: "Verify and send reports" },

  { key: "customers.view", group: "CRM", label: "See customers" },
  { key: "customers.manage", group: "CRM", label: "Create and edit customers" },
  { key: "leads.view", group: "CRM", label: "See leads, calls and follow-ups" },
  { key: "leads.manage", group: "CRM", label: "Work leads, log calls, schedule follow-ups" },

  { key: "partners.view", group: "Partners", label: "See lab partners" },
  { key: "partners.manage", group: "Partners", label: "Add and edit lab partners" },
  { key: "settlements.view", group: "Partners", label: "See partner settlements" },
  { key: "settlements.manage", group: "Partners", label: "Create and pay settlements" },

  { key: "payments.view", group: "Finance", label: "See payments" },
  { key: "payments.manage", group: "Finance", label: "Record payments" },
  { key: "refunds.manage", group: "Finance", label: "Request and process refunds" },
  { key: "expenses.view", group: "Finance", label: "See expenses" },
  { key: "expenses.manage", group: "Finance", label: "Record expenses" },
  { key: "revenue.view", group: "Finance", label: "Revenue, margin and profit figures" },

  { key: "catalog.view", group: "Catalog", label: "See tests, packages, cities" },
  { key: "catalog.manage", group: "Catalog", label: "Edit tests, packages, cities, areas" },

  { key: "analytics.view", group: "Analytics", label: "Analytics" },
  { key: "export.data", group: "Analytics", label: "Export CSV / Excel / PDF" },

  { key: "users.manage", group: "System", label: "Manage users" },
  { key: "roles.manage", group: "System", label: "Edit role permissions" },
  { key: "activity.view", group: "System", label: "Full activity log" },
  { key: "settings.manage", group: "System", label: "CRM settings (SLA timings)" },
];

export const ALL_PERMS = PERMISSIONS.map((p) => p.key);

export const ROLES = [
  { key: "owner", label: "Owner", hint: "Everything, always." },
  { key: "manager", label: "Manager", hint: "Runs operations: bookings, partners, customers, reports, analytics." },
  { key: "support", label: "Customer support", hint: "Leads, calls, bookings and customers." },
  { key: "collector", label: "Collection staff", hint: "Their assigned home collections." },
  { key: "accounts", label: "Accounts", hint: "Payments, expenses, refunds, partner settlements." },
  { key: "partner", label: "Lab partner", hint: "Only their own orders, reports and settlements." },
  { key: "editor", label: "Editor (website admin)", hint: "Website admin editor; a manager in the CRM." },
  { key: "viewer", label: "Viewer (website admin)", hint: "Read-only." },
];

export const ROLE_LABEL = Object.fromEntries(ROLES.map((r) => [r.key, r.label]));

/** Roles whose accounts are internal staff (everyone but partners). */
export const isStaffRole = (role) => role !== "partner";

const MANAGER = ALL_PERMS.filter(
  (p) => !["users.manage", "roles.manage", "settings.manage"].includes(p)
);

export const DEFAULT_ROLE_PERMS = {
  owner: ALL_PERMS,
  manager: MANAGER,
  editor: MANAGER,
  viewer: ALL_PERMS.filter((p) => p.endsWith(".view") && p !== "executive.view"),
  support: [
    "dashboard.view",
    "bookings.view",
    "bookings.manage",
    "collections.view",
    "reports.view",
    "customers.view",
    "customers.manage",
    "leads.view",
    "leads.manage",
    "payments.view",
    "catalog.view",
  ],
  collector: ["collections.view", "collections.manage", "payments.manage"],
  accounts: [
    "dashboard.view",
    "bookings.view",
    "payments.view",
    "payments.manage",
    "refunds.manage",
    "expenses.view",
    "expenses.manage",
    "revenue.view",
    "settlements.view",
    "settlements.manage",
    "partners.view",
    "customers.view",
    "analytics.view",
    "export.data",
  ],
  // What a partner's own portal shows. Scoping to their partner_id is enforced
  // separately and cannot be switched off from here.
  partner: ["bookings.view", "reports.view", "reports.manage", "settlements.view"],
};

/** Permissions a partner may never hold, whatever an override says. */
export const PARTNER_FORBIDDEN = new Set([
  "executive.view",
  "revenue.view",
  "analytics.view",
  "customers.view",
  "customers.manage",
  "leads.view",
  "leads.manage",
  "partners.view",
  "partners.manage",
  "settlements.manage",
  "payments.manage",
  "refunds.manage",
  "expenses.view",
  "expenses.manage",
  "bookings.manage",
  "bookings.assign",
  "reports.verify",
  "users.manage",
  "roles.manage",
  "activity.view",
  "settings.manage",
  "export.data",
  "catalog.manage",
]);

/**
 * The effective permission set for a role, given the owner's overrides
 * (a { role: [perm] } map, possibly empty).
 */
export function permsFor(role, overrides = {}) {
  if (role === "owner") return new Set(ALL_PERMS);
  const list = overrides[role] ?? DEFAULT_ROLE_PERMS[role] ?? [];
  const set = new Set(list.filter((p) => ALL_PERMS.includes(p)));
  if (role === "partner") for (const p of PARTNER_FORBIDDEN) set.delete(p);
  return set;
}

/** Client-safe check against a user object carrying `perms` (an array). */
export const userCan = (user, perm) =>
  Boolean(user) && (user.role === "owner" || (user.perms ?? []).includes(perm));
