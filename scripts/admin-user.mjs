/**
 * Create or reset an admin account from the command line.
 *
 *   npm run admin:user -- you@medicobharat.com "Your Name" owner
 *
 * The password is asked for interactively and never appears in an argument —
 * an argument is visible in `ps`, and it lands in the shell history file,
 * which is exactly how a password ends up committed to a dotfile backup.
 *
 * ── THIS IS HOW THE FIRST ACCOUNT IS MADE ────────────────────────────────
 * There is deliberately no "first run, create an admin" screen in the panel.
 * Such a screen has to be reachable by an unauthenticated visitor, and if it
 * is ever reachable when the database is empty — a failed migration, a fresh
 * replica, a restored backup — the first stranger to find it owns the site.
 * A command that requires shell access to the server has no such window.
 *
 * Running it again for an existing email resets that account's password and
 * revokes its sessions, which is the recovery path when somebody is locked out.
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import mysql from "mysql2/promise";

import { ADMIN_SCHEMA, MIGRATIONS } from "../src/lib/admin/schema.js";
import { hashPassword, passwordProblem } from "../src/lib/admin/password.js";
import { runMigrations } from "../src/lib/admin/migrate.js";
import { SCHEMA } from "../src/lib/dbSchema.js";

const [email, name = "", role = "owner"] = process.argv.slice(2);

if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error("Usage: npm run admin:user -- <email> [name] [owner|editor|viewer]");
  process.exit(1);
}

if (!["owner", "editor", "viewer"].includes(role)) {
  console.error(`Unknown role "${role}". Use owner, editor or viewer.`);
  process.exit(1);
}

/**
 * Read the password without echoing it.
 *
 * readline's own prompt would print every character to the terminal, where it
 * stays on screen and in the scrollback of whatever is watching.
 */
async function askPassword(prompt) {
  const rl = createInterface({ input: stdin, output: stdout, terminal: true });

  const write = stdout.write.bind(stdout);
  let muted = false;
  stdout.write = (chunk, ...rest) => (muted ? true : write(chunk, ...rest));

  const answer = rl.question(prompt);
  muted = true;

  try {
    return await answer;
  } finally {
    muted = false;
    stdout.write = write;
    stdout.write("\n");
    rl.close();
  }
}

const password = await askPassword(`Password for ${email}: `);
const again = await askPassword("Again: ");

if (password !== again) {
  console.error("Those did not match.");
  process.exit(1);
}

const problem = passwordProblem(password);
if (problem) {
  console.error(problem);
  process.exit(1);
}

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// The tables may not exist yet — this is frequently the very first thing run
// against a new database.
for (const sql of [...SCHEMA, ...ADMIN_SCHEMA]) await conn.query(sql);
await runMigrations(conn, MIGRATIONS);

const hash = await hashPassword(password);

const [existing] = await conn.execute("SELECT id FROM admin_users WHERE email = ?", [
  email.toLowerCase(),
]);

if (existing[0]) {
  await conn.execute(
    "UPDATE admin_users SET password_hash = ?, role = ?, status = 'active', deleted_at = NULL WHERE id = ?",
    [hash, role, existing[0].id]
  );
  // Resetting a password has to end every session that used the old one, or
  // the reset has not actually taken anything away from anybody.
  await conn.execute(
    "UPDATE admin_sessions SET status = 'revoked' WHERE user_id = ? AND status = 'active'",
    [existing[0].id]
  );
  console.log(`\nReset the password for ${email} (${role}) and signed it out everywhere.`);
} else {
  await conn.execute(
    "INSERT INTO admin_users (email, name, password_hash, role) VALUES (?, ?, ?, ?)",
    [email.toLowerCase(), name, hash, role]
  );
  console.log(`\nCreated ${email} as ${role}.`);
}

console.log("Sign in at /admin/login\n");

await conn.end();
