/**
 * The data the site's header and footer need, in one place.
 *
 * The footer links to every live city and it is mounted by more than one
 * layout. Without this, each layout grew its own copy of "fetch the cities,
 * pass them down" — and the day one of them drifted, one section of the site
 * would quietly stop linking to a new city while the rest carried on.
 *
 * SERVER ONLY. The header is a client component and cannot read the data layer
 * itself; the layouts call this and hand the result down as props.
 */
import { getLabCities } from "./labCities";

/**
 * This also used to return the latest guides, for a footer column that listed
 * them site-wide. That column is gone — the guide titles are full sentences and
 * they wrapped to two lines each in a narrow footer column — so the data is not
 * fetched any more either. The guides are linked in-body instead: from every
 * city page's `relatedLinks` (src/data/lab/cities.js) and from the home page's
 * homeRelatedLinks(), both with anchors that describe the article. If a
 * site-wide guide list is ever needed again, getLatestBlogs() in
 * src/data/blogs is what fed it.
 */
export async function getShellData() {
  const labCities = await getLabCities();

  return {
    // Only what the header and footer actually render. Passing the full city
    // objects would ship every FAQ, every test and the whole SEO copy of every
    // city into the client bundle of every page on the site.
    labCities: labCities.map(({ slug, name }) => ({ slug, name })),
  };
}
