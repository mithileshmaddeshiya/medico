import { notFound } from "next/navigation";

import TestForm from "@/components/admin/TestForm";
import { ButtonLink, Card, PageHeader, when } from "@/components/admin/ui";
import { recentAudit } from "@/lib/admin/audit";
import { listCategories, getTest } from "@/lib/admin/catalogStore";
import { requireRole } from "@/lib/admin/guard";

import { saveTestAction } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const test = await getTest(decodeURIComponent(id));
  return { title: test ? test.name : "Test" };
}

/**
 * One test card.
 *
 * The history panel is not an afterthought here: a price is the one field in
 * this panel that changes what money is taken, and "who moved it, when, from
 * what" is a question that gets asked after the fact rather than before.
 */
export default async function EditTestPage({ params }) {
  await requireRole("editor", "/admin/tests");

  const { id } = await params;
  const testId = decodeURIComponent(id);

  const [test, categories] = await Promise.all([getTest(testId), listCategories()]);
  if (!test) notFound();

  const history = await recentAudit({ entity: "lab_tests", entityId: testId, limit: 25 });

  return (
    <>
      <PageHeader title={test.name} subtitle={`Test id ${test.id}`}>
        <ButtonLink href="/admin/tests">All tests</ButtonLink>
      </PageHeader>

      <TestForm test={test} categories={categories} action={saveTestAction} />

      <Card title="History" subtitle="Every change to this card, including every price move.">
        {history.length ? (
          <ul className="space-y-2.5">
            {history.map((entry) => (
              <li key={entry.id} className="flex items-baseline justify-between gap-4 text-[12.5px]">
                <span className="text-slate-700">{entry.summary}</span>
                <span className="shrink-0 text-slate-400">
                  {entry.user_email || "system"} · {when(entry.created_at, { time: true })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12.5px] text-slate-500">
            Nothing has changed since this card was created.
          </p>
        )}
      </Card>
    </>
  );
}
