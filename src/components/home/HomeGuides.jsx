// SSR component — plain links, nothing to hydrate.
import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock3 } from "lucide-react";

/**
 * The guide rail — the home page's link into /blogs/*.
 *
 * ── WHY IT READS THE REGISTRY ────────────────────────────────────────────
 * `posts` comes from getLatestBlogs() in src/data/blogs, never a hardcoded
 * list. The version this replaces was three Deoria articles typed into the
 * component, so publishing a new guide meant editing the home page too — and
 * the home page is the strongest internal link a new article can get, which is
 * exactly the link that kept being forgotten.
 *
 * ── AND WHY IT IS NOT HIDDEN ON PHONES ───────────────────────────────────
 * Its predecessor was `hidden md:block`. Most of this audience is on a phone,
 * so those links existed for almost nobody — and a link a crawler sees but a
 * majority of readers cannot is a link doing half its job. The grid stacks to
 * one column instead.
 *
 * There is deliberately no "sabhi guides dekhein" button: /blogs has no hub
 * page, and a button to a 404 is worse than no button.
 */
export default function HomeGuides({ data, posts = [] }) {
  if (!posts.length) return null;

  return (
    <section
      aria-labelledby="home-guides-heading"
      className="border-t border-slate-100 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[11.5px] font-bold text-emerald-700 ring-1 ring-emerald-100">
            <BookOpen className="h-3.5 w-3.5" strokeWidth={2.3} />
            Health Guides
          </p>

          <h2
            id="home-guides-heading"
            className="mt-3 text-balance text-xl min-[400px]:text-2xl sm:text-[28px] md:text-[32px] font-extrabold tracking-tight text-slate-900"
          >
            {data.heading}
          </h2>
          <p className="mt-2.5 text-[12.5px] sm:text-[14px] leading-relaxed text-slate-500">
            {data.intro}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            // <article> per card, and the h3 inside it — a card whose title is
            // a bare <p> gives the crawler no signal that these are separate
            // documents rather than one block of teaser text.
            <article key={post.href} className="h-full">
              <Link
                href={post.href}
                className="group flex h-full flex-col rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:ring-emerald-300 hover:shadow-[0_18px_40px_-24px_rgba(6,78,59,0.5)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
                    {post.cityName}
                  </span>

                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    <Clock3 className="h-3.5 w-3.5" strokeWidth={2.2} />
                    {post.readingMinutes} min
                  </span>
                </div>

                <h3 className="mt-3.5 text-[15.5px] font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-emerald-800">
                  {post.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-slate-500">
                  {post.description}
                </p>

                <span className="mt-auto flex items-center gap-1 pt-4 text-[12.5px] font-bold text-emerald-700">
                  Guide padhiye
                  <ArrowUpRight
                    aria-hidden
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2.6}
                  />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
