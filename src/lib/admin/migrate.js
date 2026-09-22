/**
 * Applies the ALTERs in MIGRATIONS (src/lib/admin/schema.js) to a database
 * whose tables already exist.
 *
 * CREATE TABLE IF NOT EXISTS is a no-op on a table that is already there, so a
 * column added after the first deploy would never appear. This runs once per
 * server process, right after the schema, and every statement is guarded by a
 * question to information_schema first — so it is safe on every boot and it
 * never swallows a real error to get there.
 *
 * Two guard shapes:
 *   { table, column, sql }                 run unless the column exists
 *   { table, column, typeContains, sql }   run unless the column's type
 *                                          already contains that string —
 *                                          for widening an ENUM in place
 *
 * Either may carry `then`: a statement run once, straight after the ALTER, on
 * the run that actually applied it.
 */

const columnInfo = async (conn, table, column) => {
  const [rows] = await conn.query(
    `SELECT COLUMN_TYPE AS type FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows[0] ?? null;
};

const tableExists = async (conn, table) => {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [table]
  );
  return rows.length > 0;
};

/**
 * Runs every pending migration. `conn` is anything with mysql2's `.query`.
 * Returns the list of statements that actually ran, so a boot log can say what
 * changed rather than "migrations complete" on a run that did nothing.
 */
export async function runMigrations(conn, migrations) {
  const applied = [];

  for (const step of migrations) {
    // A migration for a table that does not exist yet is not an error: the
    // CREATE statements run first, but a table the site has not created (an
    // install with no orders yet, say) simply has nothing to alter.
    if (!(await tableExists(conn, step.table))) continue;

    const existing = await columnInfo(conn, step.table, step.column);

    if (step.typeContains) {
      // Widening an existing column. Skip only when the new value is already
      // part of its type — comparing case-insensitively, because MySQL echoes
      // ENUM members back in whatever case they were declared.
      if (existing && existing.type.toLowerCase().includes(step.typeContains.toLowerCase())) {
        continue;
      }
      if (!existing) continue; // nothing to widen
    } else if (existing) {
      continue; // the column is already there
    }

    await conn.query(step.sql);
    // Optional follow-up that only makes sense on the run that added the
    // column — backfilling it from an older field, say. It never runs again.
    if (step.then) await conn.query(step.then);
    applied.push(`${step.table}.${step.column}`);
  }

  return applied;
}
