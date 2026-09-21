/**
 * The MySQL schema, as CREATE TABLE IF NOT EXISTS statements.
 *
 * Plain data with no imports, so both src/lib/db.js (which applies it lazily on
 * the first query of a server process) and scripts/db-init.mjs (which applies
 * it by hand: `npm run db:init`) can read the same list.
 *
 * Money is DECIMAL rupees, never float. Quantities are tiny on purpose — see
 * MAX_QTY in src/lib/labCart.js.
 *
 *   carts        one anonymous browser cart; its id lives in localStorage
 *   cart_items   the cart's CURRENT contents (qty 0 = was in it, removed)
 *   cart_events  every tap: add / increment / decrement / remove / clear / checkout
 *   leads        every enquiry or booking form, cart or not
 *   orders       every checkout, online or pay-at-collection
 *   order_items  the priced lines of an order, as the SERVER priced them
 *
 *   test_categories      the filter chips above the test grid
 *   lab_tests            the test / package cards
 *   lab_test_categories  which chips each card appears under
 *
 * The last three are a copy of src/data/lab/defaults.js, written by
 * `npm run db:seed` — re-run it after changing a test or a price there.
 */
export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS test_categories (
    \`key\`      VARCHAR(40)       NOT NULL PRIMARY KEY,
    label       VARCHAR(80)       NOT NULL,
    heading     VARCHAR(200)      NOT NULL,
    sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  // price NULL = "Call for price" (not bookable online). params is set only
  // on checkup packages. `active` = still in the site's list at the last seed.
  `CREATE TABLE IF NOT EXISTS lab_tests (
    id            VARCHAR(80)       NOT NULL PRIMARY KEY,
    name          VARCHAR(200)      NOT NULL,
    includes      VARCHAR(300)      NOT NULL DEFAULT '',
    is_package    TINYINT(1)        NOT NULL DEFAULT 0,
    params        SMALLINT UNSIGNED NULL,
    price         DECIMAL(10,2)     NULL,
    mrp           DECIMAL(10,2)     NULL,
    discount_pct  TINYINT UNSIGNED  NULL,
    fasting       TINYINT(1)        NOT NULL DEFAULT 0,
    icon          VARCHAR(40)       NULL,
    tint          VARCHAR(40)       NULL,
    sort_order    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    active        TINYINT(1)        NOT NULL DEFAULT 1,
    created_at    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS lab_test_categories (
    test_id       VARCHAR(80) NOT NULL,
    category_key  VARCHAR(40) NOT NULL,
    PRIMARY KEY (test_id, category_key),
    CONSTRAINT fk_ltc_test FOREIGN KEY (test_id) REFERENCES lab_tests (id) ON DELETE CASCADE,
    CONSTRAINT fk_ltc_category FOREIGN KEY (category_key) REFERENCES test_categories (\`key\`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS carts (
    id          CHAR(36)     NOT NULL PRIMARY KEY,
    city        VARCHAR(80)  NULL,
    page_path   VARCHAR(255) NULL,
    status      ENUM('active','checked_out','cleared') NOT NULL DEFAULT 'active',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_carts_status (status, updated_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  // `seq` is the browser's own ordering of taps. Requests can arrive out of
  // order on a phone network; a row only moves forward to a later seq, so a
  // late "3" can never overwrite the "0" that followed it.
  `CREATE TABLE IF NOT EXISTS cart_items (
    cart_id     CHAR(36)          NOT NULL,
    test_id     VARCHAR(80)       NOT NULL,
    test_name   VARCHAR(200)      NOT NULL,
    unit_price  DECIMAL(10,2)     NULL,
    qty         TINYINT UNSIGNED  NOT NULL DEFAULT 0,
    seq         BIGINT UNSIGNED   NOT NULL DEFAULT 0,
    created_at  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (cart_id, test_id),
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS cart_events (
    id          BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cart_id     CHAR(36)          NOT NULL,
    test_id     VARCHAR(80)       NULL,
    action      ENUM('add','increment','decrement','remove','clear','checkout') NOT NULL,
    qty_before  TINYINT UNSIGNED  NULL,
    qty_after   TINYINT UNSIGNED  NULL,
    page_path   VARCHAR(255)      NULL,
    created_at  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_cart_events_cart (cart_id),
    KEY idx_cart_events_created (created_at),
    CONSTRAINT fk_cart_events_cart FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS leads (
    id          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cart_id     CHAR(36)         NULL,
    source      ENUM('form','cart_cod','cart_online') NOT NULL DEFAULT 'form',
    name        VARCHAR(80)      NOT NULL,
    phone       CHAR(10)         NOT NULL,
    city        VARCHAR(80)      NOT NULL,
    address     VARCHAR(400)     NOT NULL DEFAULT '',
    test        VARCHAR(400)     NOT NULL DEFAULT '',
    status      VARCHAR(20)      NOT NULL DEFAULT 'new',
    created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_leads_phone (phone),
    KEY idx_leads_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS orders (
    id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cart_id              CHAR(36)        NULL,
    lead_id              BIGINT UNSIGNED NULL,
    payment_method       ENUM('online','cod') NOT NULL,
    status               ENUM('created','paid','pending_collection','failed','cancelled') NOT NULL,
    customer_name        VARCHAR(80)     NOT NULL,
    customer_phone       CHAR(10)        NOT NULL,
    customer_city        VARCHAR(80)     NOT NULL,
    customer_address     VARCHAR(400)    NOT NULL DEFAULT '',
    price_list_city      VARCHAR(80)     NULL,
    amount               DECIMAL(10,2)   NOT NULL,
    mrp_total            DECIMAL(10,2)   NOT NULL,
    currency             CHAR(3)         NOT NULL DEFAULT 'INR',
    razorpay_order_id    VARCHAR(40)     NULL,
    razorpay_payment_id  VARCHAR(40)     NULL,
    paid_at              DATETIME        NULL,
    created_at           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_orders_rzp_order (razorpay_order_id),
    KEY idx_orders_status (status, created_at),
    KEY idx_orders_phone (customer_phone),
    CONSTRAINT fk_orders_lead FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS order_items (
    id          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT UNSIGNED  NOT NULL,
    test_id     VARCHAR(80)      NOT NULL,
    test_name   VARCHAR(200)     NOT NULL,
    qty         TINYINT UNSIGNED NOT NULL,
    unit_price  DECIMAL(10,2)    NOT NULL,
    unit_mrp    DECIMAL(10,2)    NOT NULL,
    line_total  DECIMAL(10,2)    NOT NULL,
    KEY idx_order_items_order (order_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];
