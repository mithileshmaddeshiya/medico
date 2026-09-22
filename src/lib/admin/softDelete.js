/**
 * Delete and restore, for the whole panel. Server only.
 *
 * ── THE RULE ─────────────────────────────────────────────────────────────
 * The admin panel never removes a row. "Delete" here means: write a status,
 * stamp `deleted_at`, and record what the row looked like first. Everything
 * stays queryable, everything stays restorable, and every foreign key that
 * pointed at it still resolves.
 *
 * That is not caution for its own sake. On this site the rows in question are
 * an order somebody paid for, a lead that is a person expecting a phone call,
 * and a blog post that has a URL Google has indexed. A hard delete of any of
 * those destroys evidence, a commitment, or a ranking — and it does it
 * instantly, from a button, usually by accident.
 *
 * ── WHY IT IS CENTRALISED ────────────────────────────────────────────────
 * Because the rule is only as good as its least careful call site. Writing
 * `DELETE FROM` is one keystroke away from writing `UPDATE … SET status`, and
 * a codebase where both appear is one where the wrong one eventually ships.
 * Every module goes through softDelete()/restore() instead, and the list of
 * tables below is the whole set of things the panel may touch — a table that
 * is not in it cannot be deleted by the panel at all.
 *
 * scripts/check-no-hard-delete.mjs greps the admin tree for DELETE statements
 * and fails if it finds one, so the rule is enforced rather than remembered.
 */
import { query } from "@/lib/db";

import { audit } from "./audit";

/**
 * What "deleted" means for each table, and what a restore puts back.
 *
 *   key        the table's primary key column
 *   deleted    the status value written on delete
 *   restored   the status a restore returns the row to
 *   label      how the row is named in the audit log and the undo toast
 *   archived   the intermediate "off the site but not deleted" state, where
 *              the table has one — the panel offers it as the softer action
 */
export const SOFT_DELETABLE = {
  media: { table: "media", key: "id", deleted: "deleted", restored: "active", label: "image" },
  blog_posts: {
    table: "blog_posts",
    key: "id",
    deleted: "deleted",
    restored: "draft",
    archived: "archived",
    label: "article",
  },
  lab_tests: {
    table: "lab_tests",
    key: "id",
    deleted: "deleted",
    restored: "active",
    archived: "archived",
    label: "test",
    // The public catalogue reads `active`, not `status` (see testCatalog.js),
    // so both have to move together or a "deleted" test keeps rendering.
    also: { onDelete: "active = 0", onRestore: "active = 1" },
  },
  test_categories: {
    table: "test_categories",
    key: "`key`",
    deleted: "deleted",
    restored: "active",
    label: "category",
  },
  city_overrides: {
    table: "city_overrides",
    key: "slug",
    deleted: "deleted",
    restored: "published",
    archived: "hidden",
    label: "city page",
  },
  seo_routes: { table: "seo_routes", key: "route", deleted: "deleted", restored: "active", label: "route" },
  seo_redirects: {
    table: "seo_redirects",
    key: "id",
    deleted: "deleted",
    restored: "active",
    archived: "disabled",
    label: "redirect",
  },
  admin_users: {
    table: "admin_users",
    key: "id",
    deleted: "deleted",
    restored: "active",
    archived: "disabled",
    label: "user",
  },
  admin_notes: { table: "admin_notes", key: "id", deleted: "deleted", restored: "active", label: "note" },
  leads: {
    table: "leads",
    key: "id",
    // leads.status is a free VARCHAR carrying the pipeline stage, so a deleted
    // lead would lose the stage it was at. 'archived' is the delete here and
    // restoring returns it to 'new' — the honest answer to "where was it?" is
    // "back in the queue", not a stage it may have moved past.
    deleted: "archived",
    restored: "new",
    label: "lead",
  },
  orders: {
    table: "orders",
    key: "id",
    deleted: "archived",
    // An order's status is its payment state. Restoring cannot invent one, so
    // this table opts out of a blanket restore value and the caller passes the
    // state it should return to — see restore()'s `to` argument.
    restored: null,
    label: "order",
  },
};

const entry = (name) => {
  const config = SOFT_DELETABLE[name];
  if (!config) throw new Error(`[admin] ${name} is not a soft-deletable table`);
  return config;
};

/** The row as it is now, for the audit log's `before`. */
async function snapshot(config, id) {
  // `data` is excluded for media: the audit log should record that an image was
  // deleted, not carry a second copy of every image ever deleted.
  // `deleted_at` must be in this list: softDelete() and restore() decide
  // whether to stamp or clear it by checking the snapshot for the column, so
  // leaving it out silently skipped the timestamp for every deleted image.
  const columns =
    config.table === "media" ? "id, slug, alt, status, folder, bytes, deleted_at" : "*";
  const [rows] = await query(
    `SELECT ${columns} FROM ${config.table} WHERE ${config.key} = ? LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
}

/**
 * Soft-delete one row.
 *
 * `mode` is "delete" (the recycle bin) or "archive" (off the site, still in
 * the normal lists under a filter) for the tables that distinguish them.
 * Returns the label, so a caller can say "article moved to the bin" without
 * knowing which table it asked about.
 */
export async function softDelete(name, id, { user, mode = "delete", reason = "" } = {}) {
  const config = entry(name);
  const status = mode === "archive" && config.archived ? config.archived : config.deleted;

  const before = await snapshot(config, id);
  if (!before) return { ok: false, error: `That ${config.label} no longer exists.` };

  const extra = config.also?.onDelete ? `, ${config.also.onDelete}` : "";
  const hasDeletedAt = "deleted_at" in before;

  await query(
    `UPDATE ${config.table}
        SET status = ?${hasDeletedAt ? ", deleted_at = UTC_TIMESTAMP()" : ""}${extra}
      WHERE ${config.key} = ?`,
    [status, id]
  );

  await audit({
    user,
    action: mode === "archive" ? "archive" : "delete",
    entity: name,
    entityId: id,
    summary: reason || `${config.label} ${mode === "archive" ? "archived" : "moved to the bin"}`,
    before,
    after: { ...before, status },
  });

  return { ok: true, label: config.label, previousStatus: before.status };
}

/**
 * Put a soft-deleted row back.
 *
 * `to` overrides the table's default restored status — required for orders,
 * whose status means something specific that this function must not guess.
 */
export async function restore(name, id, { user, to = null } = {}) {
  const config = entry(name);
  const status = to ?? config.restored;

  if (!status) {
    throw new Error(`[admin] restoring a ${config.label} needs an explicit status`);
  }

  const before = await snapshot(config, id);
  if (!before) return { ok: false, error: `That ${config.label} no longer exists.` };

  const extra = config.also?.onRestore ? `, ${config.also.onRestore}` : "";
  const hasDeletedAt = "deleted_at" in before;

  await query(
    `UPDATE ${config.table}
        SET status = ?${hasDeletedAt ? ", deleted_at = NULL" : ""}${extra}
      WHERE ${config.key} = ?`,
    [status, id]
  );

  await audit({
    user,
    action: "restore",
    entity: name,
    entityId: id,
    summary: `${config.label} restored as ${status}`,
    before,
    after: { ...before, status },
  });

  return { ok: true, label: config.label, status };
}

/**
 * The SQL fragment that hides deleted rows from a normal listing.
 *
 * Used rather than repeated so that "what the panel shows by default" is one
 * decision in one place. Pass `includeDeleted` to drop it — that is what the
 * "Show deleted" toggle on every list does, and it is how the bin is browsed.
 */
export const visible = (alias = "", includeDeleted = false) => {
  const prefix = alias ? `${alias}.` : "";
  return includeDeleted ? "1 = 1" : `${prefix}status <> 'deleted'`;
};
