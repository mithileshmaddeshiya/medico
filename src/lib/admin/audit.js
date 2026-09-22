/**
 * The write log. Server only, append-only.
 *
 * Every change the panel makes lands here with who made it, what it looked
 * like before and what it looks like now. Two reasons, and the second is the
 * one that earns the table:
 *
 * 1. "Who dropped the price of the full body checkup to ₹99 on Tuesday" is a
 *    question that gets asked, and without this there is no answer.
 *
 * 2. It is the backstop behind the soft-delete rule. A status can be changed
 *    twice — deleted, then edited by someone who did not realise — and at that
 *    point the row alone no longer says what it used to be. `before_json` does.
 *
 * Logging must never break the thing it is logging: a failure here is reported
 * to the server console and swallowed. An audit row that is missing is a gap
 * in a record; a save that fails because the audit write failed is lost work.
 */
import { headers } from "next/headers";

import { query } from "@/lib/db";

/** Fields that must never be copied into the log, whatever table they came from. */
const SECRET = new Set(["password_hash", "data", "token_hash"]);

/**
 * JSON for a snapshot: secrets stripped, bigints and dates made serialisable,
 * and the whole thing capped so one enormous article body cannot bloat the
 * table. 60 KB is far more than any row here needs and far less than a
 * runaway.
 */
function serialise(value) {
  if (value === null || value === undefined) return null;

  const safe = {};
  for (const [key, entry] of Object.entries(value)) {
    if (SECRET.has(key)) {
      safe[key] = "[redacted]";
    } else if (Buffer.isBuffer(entry)) {
      safe[key] = `[${entry.length} bytes]`;
    } else if (entry instanceof Date) {
      safe[key] = entry.toISOString();
    } else if (typeof entry === "bigint") {
      safe[key] = String(entry);
    } else {
      safe[key] = entry;
    }
  }

  const json = JSON.stringify(safe);
  return json.length > 60_000 ? JSON.stringify({ truncated: true, bytes: json.length }) : json;
}

/**
 * Record one change.
 *
 * `action` is a short verb the UI filters on: create, update, delete, archive,
 * restore, login, logout, upload, publish, unpublish, reorder, seed.
 */
export async function audit({
  user,
  action,
  entity,
  entityId = "",
  summary = "",
  before = null,
  after = null,
}) {
  try {
    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    await query(
      `INSERT INTO admin_audit
         (user_id, user_email, action, entity, entity_id, summary, before_json, after_json, ip)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user?.id ?? null,
        (user?.email ?? "").slice(0, 160),
        String(action).slice(0, 40),
        String(entity).slice(0, 40),
        String(entityId ?? "").slice(0, 120),
        String(summary ?? "").slice(0, 255),
        serialise(before),
        serialise(after),
        ip?.slice(0, 45) ?? null,
      ]
    );
  } catch (err) {
    console.error("[admin] the audit log write failed — the change itself was saved", err);
  }
}

/** The most recent entries, newest first, optionally narrowed to one record. */
export async function recentAudit({ entity = null, entityId = null, limit = 50 } = {}) {
  const where = [];
  const params = [];

  if (entity) {
    where.push("entity = ?");
    params.push(entity);
  }
  if (entityId !== null && entityId !== undefined && entityId !== "") {
    where.push("entity_id = ?");
    params.push(String(entityId));
  }

  const [rows] = await query(
    `SELECT id, user_email, action, entity, entity_id, summary, created_at
     FROM admin_audit
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY id DESC
     LIMIT ${Math.min(200, Math.max(1, Number(limit) || 50))}`,
    params
  );

  return rows;
}

/**
 * One entry in full, including the before/after snapshots.
 *
 * This is the recovery path: if a row was soft-deleted and then edited, the
 * `before_json` here is the last complete record of what it held.
 */
export async function auditEntry(id) {
  const [rows] = await query(
    `SELECT * FROM admin_audit WHERE id = ? LIMIT 1`,
    [Number(id) || 0]
  );
  return rows[0] ?? null;
}
