/**
 * The admin panel's own tables, as CREATE TABLE IF NOT EXISTS statements.
 *
 * Kept separate from src/lib/dbSchema.js on purpose: that file describes the
 * PUBLIC site's tables — what the cart, the booking form and checkout write.
 * This one describes what the back office owns. src/lib/db.js applies both on
 * the first query of a server process, so a fresh database gets everything.
 *
 * ── NOTHING HERE IS EVER DELETED ─────────────────────────────────────────
 * Every table the panel can "delete" from carries a `status` column and a
 * `deleted_at`. The panel's delete button writes `status = 'deleted'` and
 * stamps the time; the row, its history and anything referencing it stay.
 * There is no DELETE statement anywhere under src/lib/admin or src/app/admin,
 * and there must never be one — an order line that vanishes takes a refund
 * trail with it, and a "deleted" blog post whose row is gone cannot be given a
 * 301 to its replacement.
 *
 * Restoring is therefore always possible and is a normal, one-click action:
 * `status` goes back to what it was and `deleted_at` back to NULL.
 *
 *   admin_users        who can sign in
 *   admin_sessions     live sign-ins, revocable one by one
 *   admin_audit        every write the panel makes, with before/after
 *   media              uploaded images, stored as WebP bytes
 *   blog_posts         articles — the DB copy of content/blogs/<city>/<cat>.json
 *   city_overrides     per-city SEO/copy overrides for /lab-test/<slug>
 *   seo_routes         per-route meta overrides + sitemap control
 *   seo_redirects      301/302/308 rules the panel can add without a deploy
 *   settings           small key/value site settings (popups, hours, toggles)
 *   admin_notes        dated, attributed notes on leads and orders
 */

export const ADMIN_SCHEMA = [
  /* ── Access ──────────────────────────────────────────────────────────── */

  // password_hash is scrypt: "scrypt$<N>$<r>$<p>$<salt-b64>$<key-b64>".
  // See src/lib/admin/password.js — no bcrypt dependency, no plaintext ever.
  `CREATE TABLE IF NOT EXISTS admin_users (
    id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email          VARCHAR(160)    NOT NULL,
    name           VARCHAR(80)     NOT NULL DEFAULT '',
    password_hash  VARCHAR(255)    NOT NULL,
    role           ENUM('owner','editor','viewer') NOT NULL DEFAULT 'editor',
    status         ENUM('active','disabled','deleted') NOT NULL DEFAULT 'active',
    last_login_at  DATETIME        NULL,
    deleted_at     DATETIME        NULL,
    created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_admin_users_email (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  // The cookie carries the raw token; only its SHA-256 is stored, so a dump of
  // this table cannot be replayed as a login.
  `CREATE TABLE IF NOT EXISTS admin_sessions (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    token_hash  CHAR(64)        NOT NULL,
    ip          VARCHAR(45)     NULL,
    user_agent  VARCHAR(255)    NULL,
    status      ENUM('active','revoked') NOT NULL DEFAULT 'active',
    expires_at  DATETIME        NOT NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    seen_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_admin_sessions_token (token_hash),
    KEY idx_admin_sessions_user (user_id, status),
    CONSTRAINT fk_admin_sessions_user FOREIGN KEY (user_id) REFERENCES admin_users (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  // Append-only. `before_json` / `after_json` are what makes a soft delete
  // reversible by hand even if someone edits the row again afterwards.
  `CREATE TABLE IF NOT EXISTS admin_audit (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NULL,
    user_email  VARCHAR(160)    NOT NULL DEFAULT '',
    action      VARCHAR(40)     NOT NULL,
    entity      VARCHAR(40)     NOT NULL,
    entity_id   VARCHAR(120)    NOT NULL DEFAULT '',
    summary     VARCHAR(255)    NOT NULL DEFAULT '',
    before_json JSON            NULL,
    after_json  JSON            NULL,
    ip          VARCHAR(45)     NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_admin_audit_entity (entity, entity_id),
    KEY idx_admin_audit_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  /* ── Media ───────────────────────────────────────────────────────────────
     Bytes live in the row, not on disk.

     The site deploys to Vercel (see .vercelignore), where the filesystem is
     read-only at runtime — an upload written to public/ would appear to work in
     `next dev` and silently 404 in production. Blobs in MySQL work in both, and
     they make the soft-delete rule real: a "deleted" image is still byte-for-
     byte recoverable, which a file that was unlinked is not.

     `data` is always image/webp. `original_type` records what was uploaded, so
     the panel can say "converted from JPEG" rather than pretend. width/height
     are stored because next/image needs them and because an <img> without them
     costs layout shift, which is a ranking signal. */
  `CREATE TABLE IF NOT EXISTS media (
    id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug           VARCHAR(160)    NOT NULL,
    alt            VARCHAR(255)    NOT NULL DEFAULT '',
    title          VARCHAR(160)    NOT NULL DEFAULT '',
    width          SMALLINT UNSIGNED NOT NULL,
    height         SMALLINT UNSIGNED NOT NULL,
    bytes          INT UNSIGNED    NOT NULL,
    original_name  VARCHAR(255)    NOT NULL DEFAULT '',
    original_type  VARCHAR(60)     NOT NULL DEFAULT '',
    original_bytes INT UNSIGNED    NOT NULL DEFAULT 0,
    folder         VARCHAR(60)     NOT NULL DEFAULT 'general',
    data           LONGBLOB        NOT NULL,
    status         ENUM('active','deleted') NOT NULL DEFAULT 'active',
    deleted_at     DATETIME        NULL,
    uploaded_by    BIGINT UNSIGNED NULL,
    created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_media_status (status, created_at),
    KEY idx_media_folder (folder)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  /* ── Articles ────────────────────────────────────────────────────────────
     The same route shape the JSON files use: content/blogs/<city>/<cat>.json
     is /blogs/<category>/<city>, so (category, city) is the natural key and
     the URL at once. src/lib/blogs/index.js reads this table first and falls
     back to the files — the pattern src/lib/testCatalog.js already uses for
     prices.

     `body_html` is what the TipTap editor produces, sanitised on save (see
     src/lib/admin/sanitizeHtml.js). `sections_json` holds an imported file's
     structured blocks, so the fifty-odd existing posts keep rendering exactly
     as they do today until someone opens one in the editor.

     Every SEO field a post can set has a column rather than living in a blob:
     the sitemap, the canonical and the robots tag are queried, not parsed. */
  `CREATE TABLE IF NOT EXISTS blog_posts (
    id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category       VARCHAR(120)    NOT NULL,
    city           VARCHAR(120)    NOT NULL,
    city_name      VARCHAR(120)    NOT NULL DEFAULT '',
    title          VARCHAR(255)    NOT NULL,
    description    VARCHAR(500)    NOT NULL DEFAULT '',
    focus_keyword  VARCHAR(120)    NOT NULL DEFAULT '',
    keywords_json  JSON            NULL,
    body_html      MEDIUMTEXT      NULL,
    sections_json  JSON            NULL,
    takeaways_json JSON            NULL,
    faqs_json      JSON            NULL,
    related_json   JSON            NULL,
    hero_media_id  BIGINT UNSIGNED NULL,
    hero_src       VARCHAR(255)    NULL,
    hero_alt       VARCHAR(255)    NOT NULL DEFAULT '',
    canonical      VARCHAR(255)    NULL,
    og_media_id    BIGINT UNSIGNED NULL,
    noindex        TINYINT(1)      NOT NULL DEFAULT 0,
    nofollow       TINYINT(1)      NOT NULL DEFAULT 0,
    in_sitemap     TINYINT(1)      NOT NULL DEFAULT 1,
    priority       DECIMAL(2,1)    NOT NULL DEFAULT 0.9,
    changefreq     VARCHAR(12)     NOT NULL DEFAULT 'weekly',
    seo_score      TINYINT UNSIGNED NOT NULL DEFAULT 0,
    reading_minutes SMALLINT UNSIGNED NULL,
    sort_order     SMALLINT UNSIGNED NOT NULL DEFAULT 1000,
    status         ENUM('draft','published','archived','deleted') NOT NULL DEFAULT 'draft',
    published_at   DATE            NULL,
    updated_on     DATE            NULL,
    deleted_at     DATETIME        NULL,
    author_id      BIGINT UNSIGNED NULL,
    created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_blog_route (category, city),
    KEY idx_blog_status (status, published_at),
    KEY idx_blog_city (city)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  /* ── City page overrides ─────────────────────────────────────────────────
     src/data/lab/cities.js stays the source for a city's facts (areas, geo,
     GBP link). This table holds only what the panel is allowed to change
     without a deploy: the metadata, the H1, the hero image and whether the
     page is published at all. A NULL column means "use the file's value", so
     an empty row changes nothing. */
  `CREATE TABLE IF NOT EXISTS city_overrides (
    slug           VARCHAR(120)    NOT NULL PRIMARY KEY,
    title          VARCHAR(255)    NULL,
    description    VARCHAR(500)    NULL,
    keywords_json  JSON            NULL,
    h1             VARCHAR(255)    NULL,
    hero_media_id  BIGINT UNSIGNED NULL,
    hero_alt       VARCHAR(255)    NULL,
    intro_html     MEDIUMTEXT      NULL,
    faqs_json      JSON            NULL,
    noindex        TINYINT(1)      NOT NULL DEFAULT 0,
    in_sitemap     TINYINT(1)      NOT NULL DEFAULT 1,
    priority       DECIMAL(2,1)    NOT NULL DEFAULT 0.9,
    seo_score      TINYINT UNSIGNED NOT NULL DEFAULT 0,
    status         ENUM('published','hidden','deleted') NOT NULL DEFAULT 'published',
    reviewed_on    DATE            NULL,
    deleted_at     DATETIME        NULL,
    created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  /* ── SEO ─────────────────────────────────────────────────────────────────
     One row per fixed route (/, /about, /contact …): its title, description,
     OG card, robots and its line in sitemap/static.xml — including `reviewed`,
     which that route insists a human types rather than deriving from the
     clock. The panel is that human, and it stamps the date only when the copy
     is actually marked reviewed. */
  `CREATE TABLE IF NOT EXISTS seo_routes (
    route          VARCHAR(190)    NOT NULL PRIMARY KEY,
    label          VARCHAR(120)    NOT NULL DEFAULT '',
    title          VARCHAR(255)    NULL,
    description    VARCHAR(500)    NULL,
    keywords_json  JSON            NULL,
    canonical      VARCHAR(255)    NULL,
    og_media_id    BIGINT UNSIGNED NULL,
    noindex        TINYINT(1)      NOT NULL DEFAULT 0,
    nofollow       TINYINT(1)      NOT NULL DEFAULT 0,
    in_sitemap     TINYINT(1)      NOT NULL DEFAULT 1,
    priority       DECIMAL(2,1)    NOT NULL DEFAULT 0.7,
    changefreq     VARCHAR(12)     NOT NULL DEFAULT 'monthly',
    reviewed_on    DATE            NULL,
    seo_score      TINYINT UNSIGNED NOT NULL DEFAULT 0,
    status         ENUM('active','deleted') NOT NULL DEFAULT 'active',
    deleted_at     DATETIME        NULL,
    created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  // Runtime redirects, served by middleware. The permanent rules in
  // next.config.mjs stay where they are — they are deploy-time history and the
  // comment above them says not to touch them. This table is for the ones that
  // come up later: a post that moved, a campaign URL, a typo someone printed.
  `CREATE TABLE IF NOT EXISTS seo_redirects (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    source      VARCHAR(255)    NOT NULL,
    destination VARCHAR(255)    NOT NULL,
    code        SMALLINT UNSIGNED NOT NULL DEFAULT 308,
    hits        INT UNSIGNED    NOT NULL DEFAULT 0,
    note        VARCHAR(255)    NOT NULL DEFAULT '',
    status      ENUM('active','disabled','deleted') NOT NULL DEFAULT 'active',
    deleted_at  DATETIME        NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_seo_redirects_source (source)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS settings (
    \`key\`      VARCHAR(80)  NOT NULL PRIMARY KEY,
    value       TEXT         NULL,
    updated_by  BIGINT UNSIGNED NULL,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  /* ── Notes on existing records ───────────────────────────────────────────
     A lead or an order is never edited by the panel beyond its status, so a
     follow-up call ("said to ring back Tuesday") has nowhere to live. It gets
     its own table rather than a column, because there is usually more than one
     and because a note is evidence: it is append-only and it keeps its author. */
  `CREATE TABLE IF NOT EXISTS admin_notes (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    entity      VARCHAR(40)     NOT NULL,
    entity_id   VARCHAR(120)    NOT NULL,
    body        VARCHAR(2000)   NOT NULL,
    user_id     BIGINT UNSIGNED NULL,
    user_email  VARCHAR(160)    NOT NULL DEFAULT '',
    status      ENUM('active','deleted') NOT NULL DEFAULT 'active',
    deleted_at  DATETIME        NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_admin_notes_entity (entity, entity_id, status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

/**
 * Changes to tables that already exist in a live database.
 *
 * CREATE TABLE IF NOT EXISTS does nothing to a table that is already there, so
 * a column added later needs its own statement — and it must be safe to run on
 * every boot. Each entry names the table and column it is checking for; the
 * runner in src/lib/admin/migrate.js asks information_schema first and skips
 * the ALTER when the column is already present. Idempotent, no error swallowing.
 */
export const MIGRATIONS = [
  /* Leads and orders get the same soft-delete pair as everything else.

     `leads.status` is already a free VARCHAR, so the panel's pipeline values
     (new → contacted → booked → collected → done / lost) need no change. It is
     `deleted_at` that is missing, and archiving a lead writes status 'archived'
     rather than removing the row — a lead is the record that somebody asked us
     to come to their house, and it is not ours to erase. */
  { table: "leads", column: "deleted_at", sql: "ALTER TABLE leads ADD COLUMN deleted_at DATETIME NULL" },
  { table: "leads", column: "assigned_to", sql: "ALTER TABLE leads ADD COLUMN assigned_to VARCHAR(80) NOT NULL DEFAULT ''" },
  { table: "leads", column: "follow_up_on", sql: "ALTER TABLE leads ADD COLUMN follow_up_on DATE NULL" },

  /* orders.status is an ENUM, so 'archived' has to be added to the type before
     the panel can ever write it. Existing values are listed again unchanged —
     an ENUM redefinition that omits one would blank every row holding it. */
  {
    table: "orders",
    column: "deleted_at",
    sql: "ALTER TABLE orders ADD COLUMN deleted_at DATETIME NULL",
  },
  {
    table: "orders",
    column: "status",
    // Re-run unconditionally is wrong for a column that exists; this one is
    // matched on its TYPE instead — see typeContains in migrate.js.
    typeContains: "archived",
    sql: `ALTER TABLE orders MODIFY COLUMN status
            ENUM('created','paid','pending_collection','failed','cancelled','refunded','archived')
            NOT NULL`,
  },

  // The catalogue's `active` flag is a boolean with no room for "archived",
  // which is a different thing: `active = 0` means "not on the site right now",
  // archived means "retired, keep for old orders". Adding the column lets the
  // panel say which, instead of overloading one flag with two meanings.
  {
    table: "lab_tests",
    column: "status",
    sql: `ALTER TABLE lab_tests ADD COLUMN status
            ENUM('active','hidden','archived','deleted') NOT NULL DEFAULT 'active'`,
    // The new column defaults every row to 'active', including tests the old
    // flag had already taken off the site. Bring the two into agreement once,
    // in the same step, or the panel would list hidden tests as live.
    then: "UPDATE lab_tests SET status = 'hidden' WHERE active = 0",
  },
  { table: "lab_tests", column: "deleted_at", sql: "ALTER TABLE lab_tests ADD COLUMN deleted_at DATETIME NULL" },
  { table: "lab_tests", column: "image_media_id", sql: "ALTER TABLE lab_tests ADD COLUMN image_media_id BIGINT UNSIGNED NULL" },
  { table: "lab_tests", column: "description", sql: "ALTER TABLE lab_tests ADD COLUMN description MEDIUMTEXT NULL" },
  { table: "lab_tests", column: "slug", sql: "ALTER TABLE lab_tests ADD COLUMN slug VARCHAR(120) NULL" },
  { table: "lab_tests", column: "meta_title", sql: "ALTER TABLE lab_tests ADD COLUMN meta_title VARCHAR(255) NULL" },
  { table: "lab_tests", column: "meta_description", sql: "ALTER TABLE lab_tests ADD COLUMN meta_description VARCHAR(500) NULL" },

  {
    table: "test_categories",
    column: "status",
    sql: `ALTER TABLE test_categories ADD COLUMN status
            ENUM('active','hidden','deleted') NOT NULL DEFAULT 'active'`,
  },
  { table: "test_categories", column: "deleted_at", sql: "ALTER TABLE test_categories ADD COLUMN deleted_at DATETIME NULL" },
];
