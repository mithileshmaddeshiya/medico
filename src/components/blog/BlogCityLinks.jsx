// SSR component — plain links, nothing to hydrate.
import Link from "next/link";
import { linkTitle } from "@/lib/linkTitle";
import { ArrowUpRight } from "lucide-react";

/**
 * The all-cities link grid at the foot of an article.
 *
 * ── WHY IT IS GENERATED AND NOT HAND-WRITTEN ─────────────────────────────
 * Every href here comes from the live city list (src/data/lab/cities.js) and
 * the blog registry. So a town that is added appears here on its own, and —
 * the part that matters — a town that is un-published disappears instead of
 * leaving a 404 in a link block that sits on every article. A block of links
 * is a crawl path; one dead link in it wastes crawl budget on every page that
 * carries it.
 *
 * The medicine-delivery column was removed with that section; its URLs are
 * permanently redirected in next.config.mjs.
 *
 * The counterpart to this is `relatedLinks` on the post itself, which is
 * hand-picked and carries the contextual anchors a generator cannot know — the
 * exact section of a service page an article defers to, for instance. Both are
 * rendered; they do different jobs.
 *
 * ── WHY IT SITS IN THE BODY RATHER THAN THE FOOTER ───────────────────────
 * The footer already cross-links some of this, but a footer is byte-identical
 * on every page and gets discounted as boilerplate. This block is in the
 * article, and its anchors are descriptive ("Varanasi me lab test", not
 * "Varanasi"), which is what actually carries a topical signal.
 *
 * `current` is the article's own href — it is filtered out, because a page
 * linking to itself is noise in the link graph.
 *
 * ── WHY THE GUIDE COLUMN IS THIS CITY'S, NOT EVERY CITY'S ────────────────
 * It used to list EVERY other article on the site. At fifteen posts that was a
 * long column; at two hundred it is two hundred links at the foot of two
 * hundred pages — forty thousand internal links, all of them the same set, on
 * a block that repeats verbatim. That is not navigation, it is a link dump,
 * and it is the pattern that gets a footer block discounted wholesale.
 *
 * So the column is now the reader's OWN town, capped, plus one row to /blogs
 * which carries the complete set. Same town is also the better answer: someone
 * reading about dengue testing in Deoria is far likelier to want Deoria's other
 * guides than Varanasi's, and the cross-city links they might want are one hop
 * away instead of zero.
 *
 * `city` is the article's city slug. Without it the column falls back to the
 * first few of whatever it was given, which is a reasonable default rather than
 * an empty block.
 */

/** Guides shown before the column hands off to /blogs. */
const GUIDE_LIMIT = 5;

export default function BlogCityLinks({
  labCities = [],
  posts = [],
  current = "",
  city = "",
}) {
  const others = posts.filter((post) => post.href !== current);
  const sameCity = city ? others.filter((post) => post.city === city) : others;
  // A town whose only guide is the one being read falls back to the newest few
  // from anywhere — an empty column with a heading over it is worse than a
  // slightly less relevant one.
  const shown = (sameCity.length ? sameCity : others).slice(0, GUIDE_LIMIT);

  const guideLinks = shown.map((post) => ({
    href: post.href,
    label: post.title,
  }));

  if (others.length) {
    guideLinks.push({ href: "/blogs", label: "Sabhi guides — ek jagah" });
  }

  const cityName = shown.length && sameCity.length ? shown[0].cityName : null;

  const groups = [
    {
      title: "Lab test — sheher ke hisaab se",
      note: "Har sheher ka apna page: test list, price aur free home sample collection.",
      links: labCities.map((city) => ({
        href: `/lab-test/${city.slug}`,
        label: `${city.name} me lab test`,
      })),
    },
    {
      title: cityName ? `${cityName} ke doosre guide` : "Doosre guide",
      note: cityName
        ? `${cityName} par likhe gaye baaki lekh — aur neeche sabhi sheher ke.`
        : "Isi tarah ke lekh, doosre sheher aur doosre sawaalon par.",
      links: guideLinks,
    },
    {
      // Always present, and always last: the home page carries the full price
      // list and the "which test when" copy, which is what a reader who has
      // finished an article most often wants next.
      title: "Sab kuch ek jagah",
      note: "Poori rate list, sabhi test aur booking form — ek hi page par.",
      links: [
        { href: "/", label: "Sabhi lab test aur rate list" },
        { href: "/about", label: "MedicoBharat ke baare me" },
        { href: "/contact", label: "Contact — number aur booking help" },
      ],
    },
  ].filter((group) => group.links.length);

  if (!groups.length) return null;

  return (
    <section
      aria-labelledby="blog-cities-heading"
      className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
    >
      <h2
        id="blog-cities-heading"
        className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900"
      >
        MedicoBharat — poore ilaake me
      </h2>

      <p className="mt-1.5 max-w-2xl text-[12.5px] sm:text-[13.5px] leading-relaxed text-slate-500">
        Aap jis sheher me hain, wahan ka page kholiye — page par usi sheher ke
        rate, wahi ke ilaake aur wahi ka booking form milega.
      </p>

      <div className="mt-6 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <nav
            key={group.title}
            aria-label={group.title}
            className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-5"
          >
            <h3 className="text-[13px] font-bold text-emerald-900">
              {group.title}
            </h3>

            <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">
              {group.note}
            </p>

            <ul className="mt-3 space-y-2">
              {group.links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    title={linkTitle(href)}
                    className="group flex items-start gap-1.5 text-[12.5px] sm:text-[13px] font-medium leading-snug text-slate-700 transition-colors hover:text-emerald-700"
                  >
                    <span className="min-w-0">{label}</span>
                    <ArrowUpRight
                      aria-hidden
                      className="mt-px h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-emerald-600"
                      strokeWidth={2.6}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </section>
  );
}
