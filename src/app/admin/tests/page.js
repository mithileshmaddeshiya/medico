import Link from "next/link";

import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import DeleteButton from "@/components/admin/DeleteButton";
import {
  ButtonLink,
  Card,
  Empty,
  Input,
  Note,
  PageHeader,
  Pill,
  rupees,
  Row,
  Select,
  StatusPill,
  Table,
  Td,
} from "@/components/admin/ui";
import { listCategories, listTests } from "@/lib/admin/catalogStore";
import { requireUser } from "@/lib/admin/guard";
import { getCatalog } from "@/lib/testCatalog";

import { deleteRecord, restoreRecord } from "../actions";
import { toggleStockAction, toggleTestAction } from "./actions";

export const metadata = { title: "Tests & prices" };

const STATUSES = ["active", "hidden", "archived", "deleted"];

// Only an explicit 0 is out of stock — a row read before the column existed is in stock.
const inStock = (test) => test.in_stock !== 0;
export const dynamic = "force-dynamic";

/**
 * The test cards and their prices.
 *
 * ── THE WARNING AT THE TOP IS NOT DECORATION ─────────────────────────────
 * Checkout reads this table with `fresh: true`, so a price edited here is what
 * the next customer pays — not after a deploy, not after a cache expires,
 * seconds later. That is worth saying on the screen where it happens.
 *
 * ── AND IT SAYS WHERE THE SITE IS READING FROM ───────────────────────────
 * src/lib/testCatalog.js falls back to src/data/lab/defaults.js when the
 * database cannot be reached or is empty, and it does so silently on purpose
 * so the site keeps working. The consequence is that this screen can show a
 * perfectly edited list while the live site serves the file — which looks
 * exactly like "my changes did nothing". The banner removes that ambiguity by
 * asking the catalogue itself which source it is on.
 */
export default async function TestsPage({ searchParams }) {
  await requireUser("/admin/tests");

  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" && params.category ? params.category : null;
  const stock = params.stock === "in" || params.stock === "out" ? params.stock : null;
  const status = STATUSES.includes(params.status) ? params.status : null;
  const showDeleted = params.deleted === "1";
  const filtering = Boolean(search || category || stock || status);

  const [tests, categories, catalog] = await Promise.all([
    listTests({ search, category, stock, status, includeDeleted: showDeleted }),
    listCategories(),
    getCatalog({ fresh: true }),
  ]);

  // A status picked in the filter is shown as asked, even "deleted".
  const visible =
    showDeleted || status ? tests : tests.filter((test) => test.status !== "deleted");

  return (
    <>
      <PageHeader
        title="Tests & prices"
        subtitle="The cards on every city page, and what each one costs."
      >
        <ButtonLink href="/admin/tests/categories">Filter chips</ButtonLink>
        <ButtonLink href="/admin/tests/new" variant="primary">
          Add a test
        </ButtonLink>
      </PageHeader>

      {!catalog.fromDb && (
        <Note tone="warn" title="The site is not reading this table">
          The live pages are currently serving the built-in list from{" "}
          <code>src/data/lab/defaults.js</code>, which is what happens when the database cannot be
          reached or has never been seeded. Anything you change here will not appear on the site
          until that is fixed. Run <code>npm run db:seed</code> to populate the table, and check the
          database credentials if it keeps falling back.
        </Note>
      )}

      <Note title="A price saved here is charged immediately">
        Checkout reads this table fresh on every order — there is no cache in front of it and no
        deploy in between. Double-check the figure before saving, and remember that the MRP is only
        for showing a struck-through price: the discount percentage on the card is calculated from
        the two, never typed.
      </Note>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <form className="flex flex-wrap items-center gap-2" action="/admin/tests">
          {/* Each control sits in a fixed-width box: inputClass carries w-full,
              which beat a width class on the control itself and stacked every
              filter full-width. */}
          <div className="w-48">
            <Input name="q" defaultValue={search} placeholder="Name or id" aria-label="Search tests" />
          </div>
          <div className="w-44">
          <Select name="category" defaultValue={category ?? ""} aria-label="Chip">
            <option value="">Every chip</option>
            {categories.map((chip) => (
              <option key={chip.key} value={chip.key}>
                {chip.label} ({chip.tests})
              </option>
            ))}
          </Select>
          </div>
          <div className="w-36">
          <Select name="stock" defaultValue={stock ?? ""} aria-label="Stock">
            <option value="">Any stock</option>
            <option value="in">In stock</option>
            <option value="out">Out of stock</option>
          </Select>
          </div>
          <div className="w-36">
          <Select name="status" defaultValue={status ?? ""} aria-label="Status">
            <option value="">Any status</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {value[0].toUpperCase() + value.slice(1)}
              </option>
            ))}
          </Select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-3 py-2 text-[13px] font-semibold text-white hover:bg-slate-800"
          >
            Filter
          </button>
          {filtering && (
            <Link href="/admin/tests" className="px-1 text-[12.5px] font-semibold text-slate-500 hover:text-slate-800">
              Clear
            </Link>
          )}
        </form>

        <ButtonLink href={showDeleted ? "/admin/tests" : "/admin/tests?deleted=1"}>
          {showDeleted ? "Hide deleted" : "Show deleted"}
        </ButtonLink>
      </div>

      {visible.length ? (
        <Table head={["Test", "Chips", "Price", "MRP", "Off", "Stock", "Ordered", "Status", ""]}>
          {visible.map((test) => (
            <Row key={test.id} muted={test.status === "deleted" || test.status === "archived"}>
              <Td className="max-w-[20rem]">
                <Link
                  href={`/admin/tests/${encodeURIComponent(test.id)}`}
                  className="block truncate font-semibold text-slate-900 hover:text-emerald-700"
                >
                  {test.name}
                </Link>
                <span className="mt-0.5 block truncate font-mono text-[11px] text-slate-400">
                  {test.id}
                  {Boolean(test.fasting) && <span className="ml-2 text-amber-700">fasting</span>}
                  {Boolean(test.is_package) && <span className="ml-2 text-indigo-600">package</span>}
                </span>
              </Td>

              <Td>
                <span className="flex flex-wrap gap-1">
                  {test.tags.length ? (
                    test.tags.map((tag) => (
                      <Pill key={tag} tone="slate">
                        {tag}
                      </Pill>
                    ))
                  ) : (
                    <span className="text-[12px] text-amber-700">only in “All”</span>
                  )}
                </span>
              </Td>

              <Td className="font-bold text-slate-900">
                {test.price === null ? (
                  <span className="text-[12px] font-semibold text-slate-500">call for price</span>
                ) : (
                  rupees(test.price)
                )}
              </Td>

              <Td className="text-slate-400">{test.mrp === null ? "—" : rupees(test.mrp)}</Td>

              <Td>
                {test.discount_pct ? <Pill tone="emerald">{test.discount_pct}%</Pill> : "—"}
              </Td>

              <Td>
                {/* One click flips it; the pill says what it is now. */}
                <ActionForm action={toggleStockAction}>
                  <input type="hidden" name="id" value={test.id} />
                  <input type="hidden" name="inStock" value={inStock(test) ? "0" : "1"} />
                  <button
                    type="submit"
                    title={inStock(test) ? "Click to mark out of stock" : "Click to mark in stock"}
                    className={`cursor-pointer whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-semibold ring-1 transition ${
                      inStock(test)
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100"
                        : "bg-rose-50 text-rose-700 ring-rose-200 hover:bg-rose-100"
                    }`}
                  >
                    {inStock(test) ? "In stock" : "Out of stock"}
                  </button>
                </ActionForm>
              </Td>

              <Td className="text-slate-500">{Number(test.ordered) || 0}</Td>

              <Td>
                <StatusPill status={test.status ?? (test.active ? "active" : "hidden")} />
              </Td>

              <Td>
                <div className="flex items-center justify-end gap-1">
                  {test.status === "deleted" || test.status === "archived" ? (
                    <ActionForm action={restoreRecord}>
                      <input type="hidden" name="entity" value="lab_tests" />
                      <input type="hidden" name="id" value={test.id} />
                      <SubmitButton variant="secondary" pendingLabel="…">
                        Restore
                      </SubmitButton>
                    </ActionForm>
                  ) : (
                    <>
                      <ButtonLink
                        href={`/admin/tests/${encodeURIComponent(test.id)}`}
                        className="px-2 py-1 text-[12px]"
                      >
                        Edit
                      </ButtonLink>

                      <ActionForm action={toggleTestAction}>
                        <input type="hidden" name="id" value={test.id} />
                        <input type="hidden" name="active" value={test.active ? "0" : "1"} />
                        <SubmitButton variant="quiet" pendingLabel="…">
                          {test.active ? "Hide" : "Show"}
                        </SubmitButton>
                      </ActionForm>

                      <DeleteButton
                        action={deleteRecord}
                        entity="lab_tests"
                        id={test.id}
                        label="test"
                        mode="archive"
                        size="small"
                      />
                    </>
                  )}
                </div>
              </Td>
            </Row>
          ))}
        </Table>
      ) : (
        <Empty
          title={filtering ? "Nothing matches" : "The catalogue is empty"}
          hint={
            filtering
              ? "Try a different filter or clear them."
              : "Run `npm run db:seed` to copy the built-in list in, or add a test by hand."
          }
          action={<ButtonLink href="/admin/tests/new" variant="primary">Add a test</ButtonLink>}
        />
      )}

      <Card title="Why a test is archived rather than deleted">
        <p className="text-[12.5px] leading-relaxed text-slate-600">
          Every past order records the test it was for by id and by name. A catalogue row that
          disappeared would take with it the ability to answer “what was this order actually for” —
          which is the question a refund conversation starts with. Archiving takes the card off the
          site and leaves the record intact, and the id is fixed for the same reason: it is written
          into every cart in every visitor’s browser and into every{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-[11.5px]">order_items</code> row
          ever created.
        </p>
      </Card>
    </>
  );
}
