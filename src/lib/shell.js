/**
 * The data the site's header and footer need, in one place.
 *
 * Both the header and the footer link to every live city and every guide, and
 * both are mounted by three different layouts. Without this, each layout grew
 * its own copy of "fetch the cities, fetch the latest posts, pass them down" —
 * and the day one of them drifted, one section of the site would quietly stop
 * linking to a new city while the rest carried on.
 *
 * SERVER ONLY. The header is a client component and cannot read the data layer
 * itself; the layouts call this and hand the result down as props.
 */
import { getLatestBlogs } from "@/data/blogs";
import { getLabCities } from "./labCities";

/**
 * How many guides the header menu and the footer column list.
 *
 * Every article, while there are few of them — a guide that is not linked from
 * the chrome is reachable only from the other articles and the sitemap, and
 * /blogs has no hub page to fall back on. Raise the cap the day the list gets
 * long enough that a footer column starts to look like a sitemap; until then a
 * complete list is the point.
 */
const SHELL_GUIDES = 6;

export async function getShellData() {
  const [labCities, guides] = await Promise.all([
    getLabCities(),
    // Not async, but wrapped so this stays one await when it becomes so.
    Promise.resolve(getLatestBlogs(SHELL_GUIDES)),
  ]);

  return {
    // Only what the header and footer actually render. Passing the full city
    // objects would ship every FAQ, every test and the whole SEO copy of every
    // city into the client bundle of every page on the site.
    labCities: labCities.map(({ slug, name }) => ({ slug, name })),
    guides: guides.map(({ href, title, cityName, readingMinutes }) => ({
      href,
      title,
      cityName,
      readingMinutes,
    })),
  };
}
