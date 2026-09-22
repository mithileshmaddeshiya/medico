import ActionForm, { SubmitButton } from "@/components/admin/ActionForm";
import {
  ButtonLink,
  Card,
  Empty,
  Field,
  Input,
  Note,
  PageHeader,
  Pill,
  Row,
  Select,
  StatusPill,
  Table,
  Td,
  when,
} from "@/components/admin/ui";
import { requireRole } from "@/lib/admin/guard";
import { listRedirects } from "@/lib/admin/seoStore";

import { restoreRecord } from "../../actions";
import { removeRedirectAction, saveRedirectAction } from "../actions";

export const metadata = { title: "Redirects" };
export const dynamic = "force-dynamic";

/**
 * Runtime redirect rules, served by src/proxy.js.
 *
 * ── THESE ARE NOT THE ONES IN next.config.mjs ────────────────────────────
 * That file carries the permanent rules for the retired medicine section, and
 * its comment is explicit that they must stay live for years because indexed
 * URLs and old backlinks still point at them. They are not editable here on
 * purpose — a rule that protects years of accumulated crawl equity should not
 * be one click from being deleted by someone tidying up.
 *
 * This table is for what comes up afterwards: a post that moved, a campaign
 * URL, a typo somebody printed on a card.
 *
 * ── WHY 308 IS THE DEFAULT ───────────────────────────────────────────────
 * Same meaning to a search engine as a 301 — permanent, cache it, pass the
 * signal — and it also preserves the request method. It is what the redirects
 * already compiled into next.config.mjs use, and matching them means the site
 * does not answer two kinds of permanent redirect for no reason.
 */
export default async function RedirectsPage({ searchParams }) {
  await requireRole("owner", "/admin/seo/redirects");

  const params = await searchParams;
  const showDeleted = params.deleted === "1";
  const rules = await listRedirects({ includeDeleted: showDeleted });

  return (
    <>
      <PageHeader
        title="Redirects"
        subtitle="Rules served before a page renders, added without a deploy."
      >
        <ButtonLink href={showDeleted ? "/admin/seo/redirects" : "/admin/seo/redirects?deleted=1"}>
          {showDeleted ? "Hide deleted" : "Show deleted"}
        </ButtonLink>
        <ButtonLink href="/admin/seo">Back to SEO</ButtonLink>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="space-y-4">
          {rules.length ? (
            <Table head={["From", "To", "Code", "Hits", "Status", "Added", ""]}>
              {rules.map((rule) => (
                <Row key={rule.id} muted={rule.status !== "active"}>
                  <Td className="max-w-[16rem] truncate font-mono text-[12px] text-slate-700">
                    {rule.source}
                  </Td>
                  <Td className="max-w-[16rem] truncate font-mono text-[12px] text-emerald-700">
                    {rule.destination}
                  </Td>
                  <Td>
                    <Pill tone={rule.code === 302 || rule.code === 307 ? "amber" : "emerald"}>
                      {rule.code}
                    </Pill>
                  </Td>
                  <Td className="text-slate-500">{rule.hits}</Td>
                  <Td>
                    <StatusPill status={rule.status} />
                  </Td>
                  <Td className="whitespace-nowrap text-slate-500">{when(rule.created_at)}</Td>
                  <Td>
                    {rule.status === "active" ? (
                      <ActionForm action={removeRedirectAction}>
                        <input type="hidden" name="id" value={rule.id} />
                        <input type="hidden" name="mode" value="archive" />
                        <SubmitButton variant="quiet" pendingLabel="…">
                          Switch off
                        </SubmitButton>
                      </ActionForm>
                    ) : (
                      <ActionForm action={restoreRecord}>
                        <input type="hidden" name="entity" value="seo_redirects" />
                        <input type="hidden" name="id" value={rule.id} />
                        <SubmitButton variant="secondary" pendingLabel="…">
                          Switch on
                        </SubmitButton>
                      </ActionForm>
                    )}
                  </Td>
                </Row>
              ))}
            </Table>
          ) : (
            <Empty
              title="No rules yet"
              hint="One is written automatically whenever an article is moved or deleted with a destination — most of this list fills itself."
            />
          )}

          <Note title="Chains are refused, not warned about">
            If a destination is itself the source of another rule, the save is rejected. A crawler
            follows only a few hops before giving up, and each one dilutes what the redirect was
            supposed to preserve — so a new rule always points at the final URL rather than at
            another redirect.
          </Note>

          <Note tone="warn" title="The medicine-section rules are not in this list">
            Five permanent redirects are compiled into <code>next.config.mjs</code> for URLs the
            site served when it was a pharmacy. They still carry real traffic and real link equity,
            and they are deliberately not editable from here. Changing them is a code change, with
            the comment that explains why.
          </Note>
        </div>

        <Card title="Add a rule">
          <ActionForm action={saveRedirectAction} reset className="space-y-4">
            <Field label="From" required hint="A path on this site. The trailing slash and any query string are handled for you.">
              <Input name="source" required placeholder="/blogs/old-guide/deoria" />
            </Field>

            <Field label="To" required hint="A path here, or a full https:// URL elsewhere.">
              <Input name="destination" required placeholder="/blogs/lab-test/deoria" />
            </Field>

            <Field label="Type">
              <Select name="code" defaultValue="308">
                <option value="308">308 — permanent (recommended)</option>
                <option value="301">301 — permanent, legacy</option>
                <option value="307">307 — temporary</option>
                <option value="302">302 — temporary, legacy</option>
              </Select>
            </Field>

            <Field label="Why" hint="For whoever reads this list in a year.">
              <Input name="note" placeholder="Merged into the main Deoria guide" />
            </Field>

            <SubmitButton className="w-full">Add redirect</SubmitButton>
          </ActionForm>

          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            Use a temporary code only when the move really is temporary. A 302 tells search engines
            to keep the old URL indexed, so using one for a permanent move means the new page never
            inherits anything.
          </p>
        </Card>
      </div>
    </>
  );
}
