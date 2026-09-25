/**
 * The CRM's tables — the operations side of MedicoBharat.
 *
 * Applied by src/lib/db.js after the public schema (src/lib/dbSchema.js) and
 * the admin panel's (src/lib/admin/schema.js), so every table these reference
 * already exists. Same rules as the admin schema:
 *
 *   - CREATE TABLE IF NOT EXISTS, so a boot against a live database is a no-op
 *   - nothing is ever DELETEd; records carry a status and a deleted_at
 *   - money is DECIMAL rupees, never a float
 *   - every write goes through admin_audit (see src/lib/crm/activity.js)
 *
 * ── ONE RECORD PER THING ─────────────────────────────────────────────────
 * A booking is the unit of work. Collection, sample, partner and report state
 * are columns ON the booking, because each booking has exactly one of each —
 * a separate table for a 1:1 fact is a join on every list for nothing. Things
 * a booking can have many of (items, payments, reports, calls) get their own.
 *
 * The public site keeps writing leads/orders exactly as before; the booking is
 * created from the order by src/lib/crm/sync.js (idempotent, keyed on
 * bookings.order_id), so a CRM failure can never lose a website order.
 *
 *   customers          one per phone number
 *   service_cities     operational cities (active, collection on/off)
 *   service_areas      localities within a city
 *   partners           lab partners
 *   partner_cities     which cities a partner serves           (join table)
 *   partner_prices     a partner's own cost for a test          (override)
 *   bookings           the unit of work — collection → lab → report
 *   booking_items      tests/packages on a booking, priced at booking time
 *   crm_files          uploaded files (reports, prescriptions, receipts)
 *   reports            report versions on a booking, with verify/send trail
 *   payments           money in, many per booking
 *   refunds            money back
 *   calls              the call log
 *   follow_ups         scheduled call-backs
 *   expenses           money out that is not a partner settlement
 *   settlements        what MedicoBharat owes a partner for a period
 *   settlement_items   which bookings a settlement covers (one each)
 *   notifications      the bell
 *   notification_reads who has read which
 *   crm_role_permissions  owner's overrides of the default role permissions
 */

export const CRM_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS customers (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    phone        CHAR(10)        NOT NULL,
    alt_phone    VARCHAR(15)     NOT NULL DEFAULT '',
    name         VARCHAR(80)     NOT NULL,
    email        VARCHAR(160)    NOT NULL DEFAULT '',
    age          TINYINT UNSIGNED NULL,
    gender       ENUM('male','female','other','') NOT NULL DEFAULT '',
    address      VARCHAR(400)    NOT NULL DEFAULT '',
    city_id      BIGINT UNSIGNED NULL,
    city         VARCHAR(80)     NOT NULL DEFAULT '',
    area         VARCHAR(120)    NOT NULL DEFAULT '',
    landmark     VARCHAR(160)    NOT NULL DEFAULT '',
    source       VARCHAR(20)     NOT NULL DEFAULT 'website',
    notes        VARCHAR(2000)   NOT NULL DEFAULT '',
    status       ENUM('active','deleted') NOT NULL DEFAULT 'active',
    deleted_at   DATETIME        NULL,
    created_by   BIGINT UNSIGNED NULL,
    created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_customers_phone (phone),
    KEY idx_customers_name (name),
    KEY idx_customers_city (city_id),
    KEY idx_customers_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS service_cities (
    id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug                  VARCHAR(120)    NOT NULL,
    name                  VARCHAR(80)     NOT NULL,
    state                 VARCHAR(80)     NOT NULL DEFAULT 'Uttar Pradesh',
    collection_available  TINYINT(1)      NOT NULL DEFAULT 1,
    sort_order            INT             NOT NULL DEFAULT 1000,
    status                ENUM('active','inactive','deleted') NOT NULL DEFAULT 'active',
    deleted_at            DATETIME        NULL,
    created_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_service_cities_slug (slug)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS service_areas (
    id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    city_id               BIGINT UNSIGNED NOT NULL,
    name                  VARCHAR(120)    NOT NULL,
    pincode               VARCHAR(10)     NOT NULL DEFAULT '',
    collection_available  TINYINT(1)      NOT NULL DEFAULT 1,
    status                ENUM('active','inactive','deleted') NOT NULL DEFAULT 'active',
    deleted_at            DATETIME        NULL,
    created_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_service_areas (city_id, name),
    KEY idx_service_areas_city (city_id, status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS partners (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(160)    NOT NULL,
    contact_person    VARCHAR(80)     NOT NULL DEFAULT '',
    phone             VARCHAR(15)     NOT NULL DEFAULT '',
    alt_phone         VARCHAR(15)     NOT NULL DEFAULT '',
    email             VARCHAR(160)    NOT NULL DEFAULT '',
    address           VARCHAR(400)    NOT NULL DEFAULT '',
    city_id           BIGINT UNSIGNED NULL,
    city              VARCHAR(80)     NOT NULL DEFAULT '',
    gstin             VARCHAR(20)     NOT NULL DEFAULT '',
    bank_name         VARCHAR(120)    NOT NULL DEFAULT '',
    bank_account      VARCHAR(40)     NOT NULL DEFAULT '',
    bank_ifsc         VARCHAR(15)     NOT NULL DEFAULT '',
    upi_id            VARCHAR(80)     NOT NULL DEFAULT '',
    services          VARCHAR(1000)   NOT NULL DEFAULT '',
    pricing_note      VARCHAR(1000)   NOT NULL DEFAULT '',
    default_share_pct DECIMAL(5,2)    NULL,
    agreement_status  ENUM('none','draft','sent','signed','expired') NOT NULL DEFAULT 'none',
    status            ENUM('active','inactive','suspended','deleted') NOT NULL DEFAULT 'active',
    joined_on         DATE            NULL,
    notes             VARCHAR(2000)   NOT NULL DEFAULT '',
    deleted_at        DATETIME        NULL,
    created_by        BIGINT UNSIGNED NULL,
    created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_partners_status (status),
    KEY idx_partners_city (city_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS partner_cities (
    partner_id  BIGINT UNSIGNED NOT NULL,
    city_id     BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (partner_id, city_id),
    KEY idx_partner_cities_city (city_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS partner_prices (
    partner_id  BIGINT UNSIGNED NOT NULL,
    test_id     VARCHAR(80)     NOT NULL,
    price       DECIMAL(10,2)   NOT NULL,
    updated_by  BIGINT UNSIGNED NULL,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (partner_id, test_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  /* The code shown everywhere is MB<id>; starting the counter at 10001 keeps
     every code five digits for the first ninety thousand bookings. */
  `CREATE TABLE IF NOT EXISTS bookings (
    id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_id           BIGINT UNSIGNED NOT NULL,
    lead_id               BIGINT UNSIGNED NULL,
    order_id              BIGINT UNSIGNED NULL,
    patient_name          VARCHAR(80)     NOT NULL,
    patient_phone         CHAR(10)        NOT NULL,
    alt_phone             VARCHAR(15)     NOT NULL DEFAULT '',
    age                   TINYINT UNSIGNED NULL,
    gender                ENUM('male','female','other','') NOT NULL DEFAULT '',
    address               VARCHAR(400)    NOT NULL DEFAULT '',
    city_id               BIGINT UNSIGNED NULL,
    city                  VARCHAR(80)     NOT NULL DEFAULT '',
    area                  VARCHAR(120)    NOT NULL DEFAULT '',
    landmark              VARCHAR(160)    NOT NULL DEFAULT '',
    prescription_file_id  BIGINT UNSIGNED NULL,
    source                ENUM('website','phone','whatsapp','walk_in','referral','partner','offline','other') NOT NULL DEFAULT 'website',
    status                ENUM('booked','confirmed','collection_assigned','sample_collected','sample_received','processing','report_ready','report_delivered','completed','cancelled') NOT NULL DEFAULT 'booked',
    collection_date       DATE            NULL,
    collection_slot       VARCHAR(40)     NOT NULL DEFAULT '',
    collector_id          BIGINT UNSIGNED NULL,
    collection_status     ENUM('unassigned','assigned','confirmed','on_the_way','arrived','collected','failed','cancelled') NOT NULL DEFAULT 'unassigned',
    arrived_at            DATETIME        NULL,
    collected_at          DATETIME        NULL,
    collection_note       VARCHAR(500)    NOT NULL DEFAULT '',
    partner_id            BIGINT UNSIGNED NULL,
    partner_status        ENUM('unassigned','pending','accepted','rejected') NOT NULL DEFAULT 'unassigned',
    partner_assigned_at   DATETIME        NULL,
    partner_responded_at  DATETIME        NULL,
    partner_reject_reason VARCHAR(300)    NOT NULL DEFAULT '',
    partner_notes         VARCHAR(1000)   NOT NULL DEFAULT '',
    sample_received_at    DATETIME        NULL,
    processing_at         DATETIME        NULL,
    report_status         ENUM('waiting','sample_received','processing','report_pending','report_ready','verified','sent','completed') NOT NULL DEFAULT 'waiting',
    report_due_at         DATETIME        NULL,
    report_ready_at       DATETIME        NULL,
    delivered_at          DATETIME        NULL,
    completed_at          DATETIME        NULL,
    cancelled_at          DATETIME        NULL,
    cancel_reason         VARCHAR(300)    NOT NULL DEFAULT '',
    subtotal              DECIMAL(10,2)   NOT NULL DEFAULT 0,
    discount              DECIMAL(10,2)   NOT NULL DEFAULT 0,
    collection_fee        DECIMAL(10,2)   NOT NULL DEFAULT 0,
    final_amount          DECIMAL(10,2)   NOT NULL DEFAULT 0,
    partner_cost          DECIMAL(10,2)   NOT NULL DEFAULT 0,
    paid_amount           DECIMAL(10,2)   NOT NULL DEFAULT 0,
    refunded_amount       DECIMAL(10,2)   NOT NULL DEFAULT 0,
    payment_mode          ENUM('','cash','upi','online','card','bank_transfer','other') NOT NULL DEFAULT '',
    payment_status        ENUM('pending','partial','paid','failed','refunded') NOT NULL DEFAULT 'pending',
    notes                 VARCHAR(2000)   NOT NULL DEFAULT '',
    created_by            BIGINT UNSIGNED NULL,
    updated_by            BIGINT UNSIGNED NULL,
    deleted_at            DATETIME        NULL,
    created_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_bookings_order (order_id),
    KEY idx_bookings_status (status, created_at),
    KEY idx_bookings_created (created_at),
    KEY idx_bookings_customer (customer_id),
    KEY idx_bookings_phone (patient_phone),
    KEY idx_bookings_partner (partner_id, status),
    KEY idx_bookings_collector (collector_id, collection_date),
    KEY idx_bookings_collection (collection_date, collection_status),
    KEY idx_bookings_city (city_id),
    KEY idx_bookings_payment (payment_status),
    KEY idx_bookings_lead (lead_id)
  ) ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS booking_items (
    id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    booking_id    BIGINT UNSIGNED  NOT NULL,
    test_id       VARCHAR(80)      NULL,
    name          VARCHAR(200)     NOT NULL,
    is_package    TINYINT(1)       NOT NULL DEFAULT 0,
    qty           TINYINT UNSIGNED NOT NULL DEFAULT 1,
    unit_price    DECIMAL(10,2)    NOT NULL DEFAULT 0,
    unit_mrp      DECIMAL(10,2)    NOT NULL DEFAULT 0,
    partner_cost  DECIMAL(10,2)    NOT NULL DEFAULT 0,
    line_total    DECIMAL(10,2)    NOT NULL DEFAULT 0,
    status        ENUM('active','removed') NOT NULL DEFAULT 'active',
    KEY idx_booking_items_booking (booking_id, status),
    KEY idx_booking_items_test (test_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  /* Bytes in the row for the same reason media does it: the site deploys to
     Vercel, whose filesystem is read-only at runtime. `partner_id` is set on
     anything a partner uploaded or may see, and is what the download route
     checks a partner's session against. */
  `CREATE TABLE IF NOT EXISTS crm_files (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    kind         ENUM('report','prescription','receipt','agreement','other') NOT NULL DEFAULT 'other',
    entity       VARCHAR(40)     NOT NULL DEFAULT '',
    entity_id    VARCHAR(120)    NOT NULL DEFAULT '',
    partner_id   BIGINT UNSIGNED NULL,
    filename     VARCHAR(255)    NOT NULL,
    mime         VARCHAR(80)     NOT NULL,
    bytes        INT UNSIGNED    NOT NULL,
    sha256       CHAR(64)        NOT NULL,
    data         LONGBLOB        NOT NULL,
    uploaded_by  BIGINT UNSIGNED NULL,
    status       ENUM('active','deleted') NOT NULL DEFAULT 'active',
    deleted_at   DATETIME        NULL,
    created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_crm_files_entity (entity, entity_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS reports (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    booking_id   BIGINT UNSIGNED NOT NULL,
    partner_id   BIGINT UNSIGNED NULL,
    file_id      BIGINT UNSIGNED NOT NULL,
    version      SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    status       ENUM('uploaded','verified','rejected','sent','replaced') NOT NULL DEFAULT 'uploaded',
    remarks      VARCHAR(1000)   NOT NULL DEFAULT '',
    uploaded_by  BIGINT UNSIGNED NULL,
    uploaded_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_by  BIGINT UNSIGNED NULL,
    verified_at  DATETIME        NULL,
    sent_by      BIGINT UNSIGNED NULL,
    sent_at      DATETIME        NULL,
    sent_via     VARCHAR(40)     NOT NULL DEFAULT '',
    KEY idx_reports_booking (booking_id, status),
    KEY idx_reports_partner (partner_id, status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  /* One row per money movement. The booking's paid_amount/payment_status are
     a cache of these rows, recomputed by recomputeBookingPayment() whenever one
     changes — never typed by hand. A gateway payment carries its gateway id,
     unique, so a retried webhook/verify cannot book it twice. */
  `CREATE TABLE IF NOT EXISTS payments (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    booking_id          BIGINT UNSIGNED NULL,
    customer_id         BIGINT UNSIGNED NULL,
    amount              DECIMAL(10,2)   NOT NULL,
    mode                ENUM('cash','upi','online','card','bank_transfer','other') NOT NULL,
    status              ENUM('paid','pending','failed','void') NOT NULL DEFAULT 'paid',
    reference           VARCHAR(120)    NOT NULL DEFAULT '',
    gateway_payment_id  VARCHAR(60)     NULL,
    collected_by        BIGINT UNSIGNED NULL,
    received_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes               VARCHAR(500)    NOT NULL DEFAULT '',
    created_by          BIGINT UNSIGNED NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_payments_gateway (gateway_payment_id),
    KEY idx_payments_booking (booking_id),
    KEY idx_payments_received (received_at, status),
    KEY idx_payments_mode (mode, status)
  ) ENGINE=InnoDB AUTO_INCREMENT=5001 DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS refunds (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    booking_id    BIGINT UNSIGNED NOT NULL,
    payment_id    BIGINT UNSIGNED NULL,
    amount        DECIMAL(10,2)   NOT NULL,
    reason        VARCHAR(500)    NOT NULL DEFAULT '',
    mode          ENUM('cash','upi','online','card','bank_transfer','other') NOT NULL DEFAULT 'upi',
    reference     VARCHAR(120)    NOT NULL DEFAULT '',
    status        ENUM('requested','approved','processed','rejected') NOT NULL DEFAULT 'requested',
    requested_by  BIGINT UNSIGNED NULL,
    processed_by  BIGINT UNSIGNED NULL,
    processed_at  DATETIME        NULL,
    created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_refunds_booking (booking_id),
    KEY idx_refunds_status (status, created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS calls (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    lead_id       BIGINT UNSIGNED NULL,
    customer_id   BIGINT UNSIGNED NULL,
    booking_id    BIGINT UNSIGNED NULL,
    phone         VARCHAR(15)     NOT NULL,
    name          VARCHAR(80)     NOT NULL DEFAULT '',
    direction     ENUM('inbound','outbound') NOT NULL DEFAULT 'inbound',
    outcome       ENUM('answered','missed','no_answer','busy','switched_off','callback') NOT NULL DEFAULT 'answered',
    duration_sec  INT UNSIGNED    NOT NULL DEFAULT 0,
    notes         VARCHAR(1000)   NOT NULL DEFAULT '',
    user_id       BIGINT UNSIGNED NULL,
    called_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_calls_called (called_at),
    KEY idx_calls_lead (lead_id),
    KEY idx_calls_customer (customer_id),
    KEY idx_calls_phone (phone)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS follow_ups (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    lead_id           BIGINT UNSIGNED NULL,
    customer_id       BIGINT UNSIGNED NULL,
    booking_id        BIGINT UNSIGNED NULL,
    due_at            DATETIME        NOT NULL,
    assigned_user_id  BIGINT UNSIGNED NULL,
    note              VARCHAR(500)    NOT NULL DEFAULT '',
    status            ENUM('pending','done','cancelled') NOT NULL DEFAULT 'pending',
    done_at           DATETIME        NULL,
    done_by           BIGINT UNSIGNED NULL,
    created_by        BIGINT UNSIGNED NULL,
    created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_follow_ups_due (status, due_at),
    KEY idx_follow_ups_lead (lead_id),
    KEY idx_follow_ups_user (assigned_user_id, status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS expenses (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category         VARCHAR(40)     NOT NULL DEFAULT 'other',
    amount           DECIMAL(10,2)   NOT NULL,
    spent_on         DATE            NOT NULL,
    mode             ENUM('cash','upi','online','card','bank_transfer','other') NOT NULL DEFAULT 'cash',
    paid_to          VARCHAR(120)    NOT NULL DEFAULT '',
    city_id          BIGINT UNSIGNED NULL,
    reference        VARCHAR(120)    NOT NULL DEFAULT '',
    notes            VARCHAR(500)    NOT NULL DEFAULT '',
    receipt_file_id  BIGINT UNSIGNED NULL,
    status           ENUM('active','deleted') NOT NULL DEFAULT 'active',
    deleted_at       DATETIME        NULL,
    created_by       BIGINT UNSIGNED NULL,
    created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_expenses_spent (status, spent_on),
    KEY idx_expenses_category (category)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS settlements (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    partner_id      BIGINT UNSIGNED NOT NULL,
    period_from     DATE            NOT NULL,
    period_to       DATE            NOT NULL,
    bookings_count  INT UNSIGNED    NOT NULL DEFAULT 0,
    gross_amount    DECIMAL(12,2)   NOT NULL DEFAULT 0,
    partner_payable DECIMAL(12,2)   NOT NULL DEFAULT 0,
    margin          DECIMAL(12,2)   NOT NULL DEFAULT 0,
    adjustments     DECIMAL(12,2)   NOT NULL DEFAULT 0,
    paid_amount     DECIMAL(12,2)   NOT NULL DEFAULT 0,
    status          ENUM('pending','processing','paid','on_hold','void') NOT NULL DEFAULT 'pending',
    paid_on         DATE            NULL,
    mode            ENUM('','cash','upi','online','card','bank_transfer','other') NOT NULL DEFAULT '',
    reference       VARCHAR(120)    NOT NULL DEFAULT '',
    notes           VARCHAR(1000)   NOT NULL DEFAULT '',
    created_by      BIGINT UNSIGNED NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_settlements_partner (partner_id, status),
    KEY idx_settlements_status (status, created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  /* booking_id is UNIQUE: a booking is settled at most once. Voiding a
     settlement marks its items 'void', which frees the booking for the next. */
  `CREATE TABLE IF NOT EXISTS settlement_items (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    settlement_id   BIGINT UNSIGNED NOT NULL,
    booking_id      BIGINT UNSIGNED NOT NULL,
    customer_amount DECIMAL(10,2)   NOT NULL,
    partner_amount  DECIMAL(10,2)   NOT NULL,
    margin          DECIMAL(10,2)   NOT NULL,
    status          ENUM('active','void') NOT NULL DEFAULT 'active',
    active_booking  BIGINT UNSIGNED AS (IF(status = 'active', booking_id, NULL)) STORED,
    UNIQUE KEY uq_settlement_items_active (active_booking),
    KEY idx_settlement_items_settlement (settlement_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  /* Who sees a notification:
       audience 'staff'   every internal user who holds `perm` (or all, if '')
       audience 'partner' users of partner_id
       audience 'user'    exactly user_id
     Read state is per user in notification_reads, plus admin_users.notif_seen_id
     for "mark all read", so marking all is one UPDATE and not a row per item. */
  `CREATE TABLE IF NOT EXISTS notifications (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type        VARCHAR(40)     NOT NULL,
    title       VARCHAR(160)    NOT NULL,
    body        VARCHAR(500)    NOT NULL DEFAULT '',
    link        VARCHAR(255)    NOT NULL DEFAULT '',
    audience    ENUM('staff','partner','user') NOT NULL DEFAULT 'staff',
    perm        VARCHAR(40)     NOT NULL DEFAULT '',
    partner_id  BIGINT UNSIGNED NULL,
    user_id     BIGINT UNSIGNED NULL,
    severity    ENUM('info','success','warning','danger') NOT NULL DEFAULT 'info',
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_notifications_audience (audience, id),
    KEY idx_notifications_partner (partner_id, id),
    KEY idx_notifications_user (user_id, id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS notification_reads (
    notification_id  BIGINT UNSIGNED NOT NULL,
    user_id          BIGINT UNSIGNED NOT NULL,
    read_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (notification_id, user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS crm_role_permissions (
    role        VARCHAR(20)     NOT NULL PRIMARY KEY,
    perms_json  JSON            NOT NULL,
    updated_by  BIGINT UNSIGNED NULL,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

/**
 * Columns the CRM adds to tables that already exist. Same runner and the same
 * guards as src/lib/admin/schema.js MIGRATIONS — see src/lib/admin/migrate.js.
 */
export const CRM_MIGRATIONS = [
  /* Accounts. The three existing roles stay exactly as they were (the admin
     panel's `can()` ranks only those), and the CRM roles are added beside
     them. A CRM-only role has no rank in the admin panel, so it is refused
     there — see requireUser in src/lib/admin/guard.js. */
  {
    table: "admin_users",
    column: "role",
    typeContains: "partner",
    sql: `ALTER TABLE admin_users MODIFY COLUMN role
            ENUM('owner','editor','viewer','manager','support','collector','accounts','partner')
            NOT NULL DEFAULT 'editor'`,
  },
  { table: "admin_users", column: "partner_id", sql: "ALTER TABLE admin_users ADD COLUMN partner_id BIGINT UNSIGNED NULL" },
  { table: "admin_users", column: "phone", sql: "ALTER TABLE admin_users ADD COLUMN phone VARCHAR(15) NOT NULL DEFAULT ''" },
  { table: "admin_users", column: "notif_seen_id", sql: "ALTER TABLE admin_users ADD COLUMN notif_seen_id BIGINT UNSIGNED NOT NULL DEFAULT 0" },

  /* The activity log is admin_audit, extended — one log for the whole system,
     not a second one that disagrees with the first. */
  { table: "admin_audit", column: "user_role", sql: "ALTER TABLE admin_audit ADD COLUMN user_role VARCHAR(20) NOT NULL DEFAULT ''" },
  { table: "admin_audit", column: "user_name", sql: "ALTER TABLE admin_audit ADD COLUMN user_name VARCHAR(80) NOT NULL DEFAULT ''" },
  { table: "admin_audit", column: "user_agent", sql: "ALTER TABLE admin_audit ADD COLUMN user_agent VARCHAR(255) NULL" },
  {
    table: "admin_audit",
    column: "partner_id",
    sql: "ALTER TABLE admin_audit ADD COLUMN partner_id BIGINT UNSIGNED NULL",
    then: "ALTER TABLE admin_audit ADD KEY idx_admin_audit_partner (partner_id, id)",
  },

  /* Leads become the call CRM's leads. The public site keeps writing `source`
     (form / cart_cod / cart_online) exactly as before; `channel` is where the
     lead came from in business terms, and staff-entered leads set it. */
  { table: "leads", column: "channel", sql: "ALTER TABLE leads ADD COLUMN channel VARCHAR(20) NOT NULL DEFAULT 'website'" },
  { table: "leads", column: "area", sql: "ALTER TABLE leads ADD COLUMN area VARCHAR(120) NOT NULL DEFAULT ''" },
  { table: "leads", column: "interested_package", sql: "ALTER TABLE leads ADD COLUMN interested_package VARCHAR(200) NOT NULL DEFAULT ''" },
  { table: "leads", column: "customer_id", sql: "ALTER TABLE leads ADD COLUMN customer_id BIGINT UNSIGNED NULL" },
  { table: "leads", column: "booking_id", sql: "ALTER TABLE leads ADD COLUMN booking_id BIGINT UNSIGNED NULL" },
  { table: "leads", column: "assigned_user_id", sql: "ALTER TABLE leads ADD COLUMN assigned_user_id BIGINT UNSIGNED NULL" },
  { table: "leads", column: "created_by", sql: "ALTER TABLE leads ADD COLUMN created_by BIGINT UNSIGNED NULL" },
  { table: "leads", column: "notes", sql: "ALTER TABLE leads ADD COLUMN notes VARCHAR(1000) NOT NULL DEFAULT ''" },
  { table: "leads", column: "status_changed_at", sql: "ALTER TABLE leads ADD COLUMN status_changed_at DATETIME NULL" },

  /* Tests: the operational fields the website never needed. */
  { table: "lab_tests", column: "code", sql: "ALTER TABLE lab_tests ADD COLUMN code VARCHAR(40) NOT NULL DEFAULT ''" },
  { table: "lab_tests", column: "partner_price", sql: "ALTER TABLE lab_tests ADD COLUMN partner_price DECIMAL(10,2) NULL" },
  { table: "lab_tests", column: "sample_type", sql: "ALTER TABLE lab_tests ADD COLUMN sample_type VARCHAR(40) NOT NULL DEFAULT 'Blood'" },
  { table: "lab_tests", column: "tat_hours", sql: "ALTER TABLE lab_tests ADD COLUMN tat_hours SMALLINT UNSIGNED NOT NULL DEFAULT 24" },
  { table: "lab_tests", column: "crm_category", sql: "ALTER TABLE lab_tests ADD COLUMN crm_category VARCHAR(30) NOT NULL DEFAULT 'other'" },
  { table: "lab_tests", column: "package_tests_json", sql: "ALTER TABLE lab_tests ADD COLUMN package_tests_json JSON NULL" },
];
