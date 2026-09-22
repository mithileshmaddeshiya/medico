"use client";

/**
 * The article editor: body on the left, SEO on the right, everything live.
 *
 * ── ONE FORM, POSTED TO A SERVER ACTION ──────────────────────────────────
 * The TipTap body and the repeatable lists (keywords, takeaways, FAQs) are
 * held in React state and written into hidden inputs, because a FormData
 * field is a string and those are not. Everything else is an ordinary input
 * with a `name`, which is why the form still works while React is loading and
 * why the browser's own validation applies.
 *
 * ── WHY THE URL LOCKS AFTER PUBLISHING ───────────────────────────────────
 * (category, city) IS the URL: content/blogs/<city>/<category>.json becomes
 * /blogs/<category>/<city>. Once that URL is live it is linked from other
 * posts and sitting in Google's index, so changing it silently would break
 * both. The fields go read-only and a separate "Change URL" action writes the
 * 308 in the same transaction as the move. Before publishing they are free to
 * edit, because there is nothing to break yet.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { ExternalLink, Plus, X } from "lucide-react";

import Editor from "./Editor";
import MediaPicker from "./MediaPicker";
import SeoPanel from "./SeoPanel";
import { Button, Card, Checkbox, Field, Input, Note, Select, Textarea } from "./ui";

const slugify = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function SaveButton({ children = "Save" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : children}
    </Button>
  );
}

/** A list of short strings — keywords, takeaways. */
function StringList({ label, hint, items, onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            // Enter adds the item; it must not submit the form, which is what
            // it does by default in a single-input row.
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="secondary" onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {items.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-2.5 pr-1 text-[12px] font-medium text-slate-700"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}

/** The FAQ block, which becomes FAQPage structured data on the live page. */
function Faqs({ items, onChange }) {
  return (
    <div className="space-y-3">
      {items.map((faq, index) => (
        <div key={index} className="rounded-xl border border-slate-200 p-3.5">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <Input
                value={faq.q}
                onChange={(event) => {
                  const next = [...items];
                  next[index] = { ...faq, q: event.target.value };
                  onChange(next);
                }}
                placeholder="Thyroid test ke liye fasting zaroori hai?"
              />
              <Textarea
                rows={2}
                value={faq.a}
                onChange={(event) => {
                  const next = [...items];
                  next[index] = { ...faq, a: event.target.value };
                  onChange(next);
                }}
                placeholder="Nahi. TSH, T3 aur T4 ke liye khaali pet hona zaroori nahi hai…"
              />
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-700"
              aria-label="Remove this question"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={() => onChange([...items, { q: "", a: "" }])}>
        <Plus className="h-4 w-4" /> Add a question
      </Button>

      <Note title="These become FAQ structured data">
        Each question is published as machine-readable markup, so it can appear directly in a search
        result. That also means it is a public statement by this business: answer only what is
        genuinely true of the service, and never claim an accreditation, a rating or a partner lab.
        Structured data that overstates is precisely what a manual action is written for.
      </Note>
    </div>
  );
}

export default function PostEditor({ post, action, statusAction, deleteAction, routeAction, relatedRoutes = [] }) {
  const isNew = !post?.id;
  const published = post?.status === "published";

  const [state, formAction] = useActionState(action, null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [city, setCity] = useState(post?.city ?? "");
  const [focusKeyword, setFocusKeyword] = useState(post?.focus_keyword ?? "");
  const [bodyHtml, setBodyHtml] = useState(post?.bodyHtml ?? "");
  const [keywords, setKeywords] = useState(post?.keywords ?? []);
  const [takeaways, setTakeaways] = useState(post?.takeaways ?? []);
  const [faqs, setFaqs] = useState(post?.faqs ?? []);
  const [hero, setHero] = useState(post?.hero ?? null);
  const [heroAlt, setHeroAlt] = useState(post?.hero_alt ?? "");
  const [noindex, setNoindex] = useState(Boolean(post?.noindex));
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    if (!state) return;
    if (state.ok === false && state.error) toast.error(state.error);
    else if (state.ok && state.message) toast.success(state.message);
  }, [state]);

  /*
   * Warn before leaving with unsaved changes.
   *
   * An article is twenty minutes of work and the editor lives one stray
   * Cmd-W from oblivion. The browser's own dialog is the only one that can
   * actually stop a navigation, so that is what is used.
   */
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const path = useMemo(
    () => (category && city ? `/blogs/${category}/${city}` : ""),
    [category, city]
  );

  const touch = (setter) => (value) => {
    setDirty(true);
    setter(value);
  };

  return (
    <div className="space-y-6">
      <form action={formAction} onSubmit={() => setDirty(false)} className="space-y-6">
        {post?.id && <input type="hidden" name="id" value={post.id} />}

        {/* State that is not a plain input, carried across as JSON. */}
        <input type="hidden" name="bodyHtml" value={bodyHtml} />
        <input type="hidden" name="keywords" value={JSON.stringify(keywords)} />
        <input type="hidden" name="takeaways" value={JSON.stringify(takeaways)} />
        <input type="hidden" name="faqs" value={JSON.stringify(faqs)} />
        <input type="hidden" name="heroMediaId" value={hero?.id ?? ""} />

        <div className="grid gap-6 lg:grid-cols-[1fr_21rem] lg:items-start">
          <div className="space-y-6">
            <Card title="The article">
              <div className="space-y-4">
                <Field
                  label="Title"
                  required
                  hint="This is the <h1> and the search result headline. The site appends “ | MedicoBharat” to it automatically."
                >
                  <Input
                    name="title"
                    required
                    value={title}
                    onChange={(event) => {
                      touch(setTitle)(event.target.value);
                      // Only auto-fill the slug for a post that has never had
                      // a URL. Touching it later would move a live page.
                      if (isNew && !category) setCategory(slugify(event.target.value).slice(0, 60));
                    }}
                    placeholder="Deoria me thyroid test kaise karayein — ghar se sample collection"
                  />
                </Field>

                <Field
                  label="Meta description"
                  hint="70–160 characters. Not a ranking factor on its own, but it is the sentence that decides whether anyone clicks."
                >
                  <Textarea
                    name="description"
                    rows={2}
                    value={description}
                    onChange={(event) => touch(setDescription)(event.target.value)}
                    placeholder="Thyroid profile ghar baithe — free home collection, 24 ghante me report…"
                  />
                </Field>

                <Field
                  label="Focus keyword"
                  hint="The one phrase this article should answer. Used only to run the placement checks on the right — it is not published anywhere."
                >
                  <Input
                    name="focusKeyword"
                    value={focusKeyword}
                    onChange={(event) => touch(setFocusKeyword)(event.target.value)}
                    placeholder="thyroid test in deoria"
                  />
                </Field>
              </div>
            </Card>

            <Card
              title="Body"
              subtitle="Headings start at H2 — the page already renders the title as its only H1."
            >
              <Editor value={bodyHtml} onChange={touch(setBodyHtml)} />
            </Card>

            <Card
              title="Key takeaways"
              subtitle="The three or four things a reader gets even if they read nothing else. Rendered in a box under the intro — the part a skimmer reads and a search snippet most often lifts."
            >
              <StringList
                label="Points"
                items={takeaways}
                onChange={touch(setTakeaways)}
                placeholder="Fasting zaroori nahi — kisi bhi waqt sample de sakte hain"
              />
            </Card>

            <Card title="Questions people ask">
              <Faqs items={faqs} onChange={touch(setFaqs)} />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <Card title="Publishing">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] font-semibold text-slate-700">Status</span>
                  <span className="text-[12.5px] capitalize text-slate-600">
                    {post?.status ?? "new"}
                  </span>
                </div>

                <SaveButton>{isNew ? "Create draft" : "Save changes"}</SaveButton>

                {path && published && (
                  <a
                    href={path}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    View the live page <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </Card>

            <Card title="URL">
              {published ? (
                <>
                  <p className="font-mono text-[12.5px] text-slate-700">{path}</p>
                  <Note tone="warn" title="Locked, because it is live">
                    This URL is linked from other guides and is in Google’s index. Changing it here
                    would break both silently. Use <strong>Change URL</strong> below — it moves the
                    post and writes the 308 from the old address in the same step.
                  </Note>
                </>
              ) : (
                <div className="space-y-3">
                  <Field label="Category" hint="The first URL segment.">
                    <Input
                      name="category"
                      required
                      value={category}
                      onChange={(event) => touch(setCategory)(slugify(event.target.value))}
                      placeholder="thyroid-test"
                    />
                  </Field>
                  <Field label="City" hint="The second segment. Lower case, hyphenated.">
                    <Input
                      name="city"
                      required
                      value={city}
                      onChange={(event) => touch(setCity)(slugify(event.target.value))}
                      placeholder="deoria"
                    />
                  </Field>
                  <Field label="City name in prose" hint="“Bhatpar Rani”, not “bhatpar-rani”.">
                    <Input name="cityName" defaultValue={post?.city_name ?? ""} placeholder="Deoria" />
                  </Field>
                  <p className="font-mono text-[12px] text-slate-500">{path || "/blogs/…/…"}</p>
                </div>
              )}

              {published && (
                <>
                  <input type="hidden" name="category" value={category} />
                  <input type="hidden" name="city" value={city} />
                  <input type="hidden" name="cityName" value={post?.city_name ?? ""} />
                </>
              )}
            </Card>

            <Card title="Hero image">
              {hero ? (
                <div className="space-y-3">
                  {/* Already WebP at a capped size — routing it through the
                      optimiser would re-encode an optimised file. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.url}
                    alt={hero.alt || ""}
                    width={hero.width}
                    height={hero.height}
                    className="w-full rounded-xl border border-slate-200"
                  />
                  <Field label="Alt text" hint="What the picture shows, for a reader who cannot see it.">
                    <Input
                      name="heroAlt"
                      value={heroAlt}
                      onChange={(event) => touch(setHeroAlt)(event.target.value)}
                    />
                  </Field>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" onClick={() => setPicking(true)}>
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="quiet"
                      onClick={() => {
                        setDirty(true);
                        setHero(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Button type="button" variant="secondary" onClick={() => setPicking(true)}>
                    Choose an image
                  </Button>
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
                    Converted to WebP on upload and served with its real dimensions, so it does not
                    shift the layout as it loads.
                  </p>
                </>
              )}
            </Card>

            <Card title="Search settings">
              <div className="space-y-3.5">
                <Checkbox
                  name="inSitemap"
                  defaultChecked={post?.in_sitemap !== 0}
                  label="Include in the sitemap"
                  hint="Off for a page that exists but should not be submitted."
                />
                <Checkbox
                  name="noindex"
                  checked={noindex}
                  onChange={(event) => touch(setNoindex)(event.target.checked)}
                  label="noindex"
                  hint="Keeps it out of search entirely. It is dropped from the sitemap automatically — submitting a noindex URL is what Search Console flags."
                />
                <Checkbox
                  name="nofollow"
                  defaultChecked={Boolean(post?.nofollow)}
                  label="nofollow"
                  hint="Rarely what you want. It tells crawlers not to follow any link on the page, including the ones back into the site."
                />

                <Field label="Canonical" hint="Leave empty unless this page deliberately points at another as the original.">
                  <Input name="canonical" defaultValue={post?.canonical ?? ""} placeholder="(automatic)" />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Priority">
                    <Select name="priority" defaultValue={String(post?.priority ?? 0.9)}>
                      {["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.3"].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Changes">
                    <Select name="changefreq" defaultValue={post?.changefreq ?? "weekly"}>
                      {["daily", "weekly", "monthly", "yearly"].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Published" hint="Set once.">
                    <Input type="date" name="publishedAt" defaultValue={post?.publishedAt ?? ""} />
                  </Field>
                  <Field label="Last revised" hint="Feeds lastmod.">
                    <Input type="date" name="updatedOn" defaultValue={post?.updatedOn ?? ""} />
                  </Field>
                </div>

                <Note tone="warn" title="Do not bump “last revised” on a deploy">
                  It feeds <code>dateModified</code> and the sitemap’s <code>lastmod</code>. A date
                  that moves every day is one Google learns to ignore entirely — move it when you
                  genuinely rewrite the article, and not otherwise.
                </Note>

                <Field label="Order within its city" hint="Lower sorts first in the city’s listing.">
                  <Input type="number" name="sortOrder" defaultValue={post?.sort_order ?? 1000} />
                </Field>
              </div>
            </Card>

            <Card title="Keywords">
              <StringList
                label="Meta keywords"
                hint="Google has ignored these for years; they are kept because the rest of the site declares them and consistency costs nothing. Do not spend time here."
                items={keywords}
                onChange={touch(setKeywords)}
                placeholder="thyroid test deoria"
              />
            </Card>
          </div>
        </div>
      </form>

      {/* Outside the main form: a nested <form> is invalid HTML and the inner
          one is silently dropped, so these each stand alone. */}
      {!isNew && (
        <div className="grid gap-6 lg:grid-cols-[1fr_21rem] lg:items-start">
          <div className="space-y-6">
            <Card title="Live SEO check" subtitle="Runs as you type, above.">
              <p className="text-[12.5px] leading-relaxed text-slate-600">
                The panel on the right of the editor shows every check and the score that is stored
                with the post. The same module runs on the server when you save, so the number in
                the list is always the number you saw here.
              </p>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title={published ? "Unpublish or archive" : "Publish"}>
              <div className="flex flex-wrap gap-2">
                {!published ? (
                  <form action={statusAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="status" value="published" />
                    <SaveButton>Publish</SaveButton>
                  </form>
                ) : (
                  <>
                    <form action={statusAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <input type="hidden" name="status" value="draft" />
                      <Button type="submit" variant="secondary">
                        Back to draft
                      </Button>
                    </form>
                    <form action={statusAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <input type="hidden" name="status" value="archived" />
                      <Button type="submit" variant="quiet">
                        Archive
                      </Button>
                    </form>
                  </>
                )}
              </div>

              {published && (
                <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
                  Both take the page off the site, so the URL starts returning a 404. If anything
                  links to it — and other guides do — add a redirect under{" "}
                  <Link href="/admin/seo/redirects" className="font-semibold text-emerald-700">
                    Redirects
                  </Link>
                  .
                </p>
              )}
            </Card>

            {published && (
              <Card title="Change URL">
                <form action={routeAction} className="space-y-3">
                  <input type="hidden" name="id" value={post.id} />
                  <Field label="Category">
                    <Input name="category" defaultValue={post.category} />
                  </Field>
                  <Field label="City">
                    <Input name="city" defaultValue={post.city} />
                  </Field>
                  <Button type="submit" variant="secondary" className="w-full">
                    Move, and redirect the old URL
                  </Button>
                </form>
                <p className="mt-2.5 text-[12px] leading-relaxed text-slate-500">
                  A 308 from the old address is written at the same time. That is the difference
                  between moving a page and losing one.
                </p>
              </Card>
            )}

            <Card title="Delete">
              <form action={deleteAction} className="space-y-3">
                <input type="hidden" name="id" value={post.id} />
                <input type="hidden" name="mode" value="delete" />

                {published && (
                  <Field
                    label="Redirect the URL to"
                    hint="Strongly recommended. This URL is indexed and linked; a 404 here throws away everything it earned."
                  >
                    <Input name="redirectTo" list="related-routes" placeholder="/blogs/lab-test/deoria" />
                    <datalist id="related-routes">
                      {relatedRoutes.map((route) => (
                        <option key={route} value={route} />
                      ))}
                    </datalist>
                  </Field>
                )}

                <Button type="submit" variant="danger" className="w-full">
                  Move to the bin
                </Button>
              </form>

              <p className="mt-2.5 text-[12px] leading-relaxed text-slate-500">
                Nothing is removed from the database. The row keeps its body, its metadata and its
                history, and it can be restored from the Bin tab as a draft.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* The live SEO panel.
          Rendered once, outside the form, for two reasons: it re-renders on
          every keystroke and would otherwise drag the editor's uncontrolled
          inputs with it, and parsing the body twice per keystroke for a second
          copy of the same panel is pure waste. It sticks to the viewport on a
          wide screen so the checks stay in view while you write, and falls
          into the normal flow below the editor on a narrow one. */}
      <div className="xl:sticky xl:bottom-6">
        <SeoPanel
          title={title}
          description={description}
          slug={category}
          path={path}
          focusKeyword={focusKeyword}
          bodyHtml={bodyHtml}
          heroAlt={heroAlt}
          noindex={noindex}
        />
      </div>

      {picking && (
        <MediaPicker
          folder="blog"
          onClose={() => setPicking(false)}
          onPick={(media) => {
            setDirty(true);
            setHero(media);
            setHeroAlt(media.alt || "");
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}
