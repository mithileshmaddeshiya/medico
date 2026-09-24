/**
 * MySQL, server side only.
 *
 * Credentials come from the environment:
 *   DB_HOST  DB_PORT  DB_USER  DB_PASS  DB_NAME
 *
 * On Hostinger the user and database names carry the account prefix
 * (u942570990_…), and remote access must be allowed for the connecting IP in
 * hPanel → Databases → Remote MySQL. A DB_PASS containing `#` must be quoted in
 * .env files, or everything after the `#` is read as a comment.
 *
 * One pool per server process, kept on globalThis so a hot reload in dev does
 * not open a fresh pool every save. The schema is applied once per process on
 * the first query (CREATE TABLE IF NOT EXISTS — a no-op once the tables exist).
 */
import mysql from "mysql2/promise";

import { ADMIN_SCHEMA, MIGRATIONS } from "./admin/schema";
import { runMigrations } from "./admin/migrate";
import { SCHEMA } from "./dbSchema";

export const dbConfigured = () =>
  Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);

function pool() {
  globalThis.__mbDbPool ??= mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5,
    connectTimeout: 10000,
    timezone: "Z",
    // A remote MySQL host drops sockets that sit idle, and the pool would hand
    // the dead one to the next query (read ECONNRESET). Keepalive holds idle
    // sockets open; idleTimeout retires them before the server does.
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    maxIdle: 2,
    idleTimeout: 30000,
  });
  return globalThis.__mbDbPool;
}

/** Socket-level failures where the connection died, not the statement. */
const DEAD_CONNECTION = new Set([
  "ECONNRESET",
  "EPIPE",
  "ETIMEDOUT",
  "PROTOCOL_CONNECTION_LOST",
]);

/**
 * Only reads are retried. A write that died mid-flight may already have been
 * applied, and running it again could insert a row twice.
 */
const isRead = (sql) => /^\s*(select|show)\b/i.test(sql);

/**
 * The public site's tables (SCHEMA) and the back office's (ADMIN_SCHEMA), then
 * the ALTERs that a database created before those columns existed still needs.
 *
 * Order matters: the CREATEs run first so a fresh database has every table
 * before runMigrations looks at one, and the migration runner skips any table
 * that is still absent rather than failing the boot.
 */
function ensureSchema() {
  globalThis.__mbDbSchema ??= (async () => {
    for (const sql of [...SCHEMA, ...ADMIN_SCHEMA]) await pool().query(sql);
    const applied = await runMigrations(pool(), MIGRATIONS);
    if (applied.length) console.info("[db] migrations applied:", applied.join(", "));
  })().catch((err) => {
    globalThis.__mbDbSchema = undefined; // retry on the next request
    throw err;
  });
  return globalThis.__mbDbSchema;
}

/** Run one parameterised statement. Returns mysql2's `[rows, fields]`. */
export async function query(sql, params = []) {
  if (!dbConfigured()) throw new Error("DB_HOST / DB_USER / DB_NAME are not set");
  await ensureSchema();
  try {
    return await pool().execute(sql, params);
  } catch (err) {
    // The pool discards the broken connection itself, so a second attempt
    // gets a fresh one.
    if (!DEAD_CONNECTION.has(err?.code) || !isRead(sql)) throw err;
    return pool().execute(sql, params);
  }
}

/** Run `fn(conn)` inside a transaction; rolls back if it throws. */
export async function transaction(fn) {
  if (!dbConfigured()) throw new Error("DB_HOST / DB_USER / DB_NAME are not set");
  await ensureSchema();
  const conn = await pool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback().catch(() => {});
    throw err;
  } finally {
    conn.release();
  }
}
