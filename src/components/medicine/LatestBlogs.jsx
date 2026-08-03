// SSR component — plain links, nothing to hydrate.
import Link from "next/link";

import { getLatestBlogs } from "@/data/blogs";

/**
 * The homepage's guide rail.
 *
 * ── WHY IT READS THE REGISTRY ────────────────────────────────────────────
 * This used to be a hardcoded array of three Deoria posts. Every new article
 * had to be pasted in here as well or it never appeared on the home page — and
 * the home page is the strongest internal link a new post can get. It now takes
 * the newest posts from src/data/blogs, so publishing an article is genuinely a
 * one-file job.
 *
 * ── WHY IT IS NO LONGER `hidden md:block` ────────────────────────────────
 * The section was hidden on phones. Most of this audience is on a phone, so the
 * links existed for almost nobody — and a link a crawler sees but a majority of
 * readers cannot is a wasted link. The grid stacks to one column instead.
 */
export default function LatestBlogs() {
  const posts = getLatestBlogs(3);
  if (!posts.length) return null;

  return (
    <section
      aria-labelledby="latest-blogs-heading"
      className="max-w-6xl mx-auto px-4 py-10"
    >
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
          Latest Health Guides
        </span>

        <h2
          id="latest-blogs-heading"
          className="text-3xl md:text-4xl font-bold mt-4 text-gray-900"
        >
          Lab Test Aur Medicine Delivery Ke Guide
        </h2>

        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Kaun sa test kab karayein, report me kya dekhein, aur dawa ghar tak
          kaise mangwayein — sheher ke hisaab se.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.href}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wide text-green-700">
              {post.cityName}
            </span>

            <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-3">
              {post.title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
              {post.description}
            </p>

            <Link
              href={post.href}
              className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700"
            >
              Read Guide →
            </Link>
          </article>
        ))}
      </div>

    </section>
  );
}
