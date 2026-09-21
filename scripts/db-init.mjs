/**
 * Create the MySQL tables now, instead of waiting for the first request.
 *
 *   npm run db:init
 *
 * Reads DB_* from .env.local. Safe to re-run: every statement is
 * CREATE TABLE IF NOT EXISTS.
 */
import mysql from "mysql2/promise";

import { SCHEMA } from "../src/lib/dbSchema.js";

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

for (const sql of SCHEMA) {
  await conn.query(sql);
  console.log("ok ", sql.match(/EXISTS (\w+)/)[1]);
}

const [tables] = await conn.query("SHOW TABLES");
console.log("\ntables:", tables.map((t) => Object.values(t)[0]).join(", "));
await conn.end();
