// SSR component — one block of already-sanitised HTML, nothing to hydrate.

/**
 * The body of an article that was written in the admin panel's editor.
 *
 * ── WHY THERE ARE TWO BODY RENDERERS ─────────────────────────────────────
 * ./BlogProse.jsx renders the STRUCTURED form — a list of sections, each with
 * typed blocks (paragraph, list, table, note). That is what the fifty-odd
 * files in content/blogs/ carry, and it is a better shape: the data says what
 * each thing IS, so the table markup, the callout styling and the section
 * anchors are decided here in code rather than typed by hand into prose.
 *
 * The editor produces HTML, because that is what a rich-text editor is. So a
 * post from the panel takes this path instead. The page picks whichever the
 * post has; nothing was converted, and no existing article changed.
 *
 * ── ABOUT dangerouslySetInnerHTML ────────────────────────────────────────
 * The name is a warning and it is earned. What makes it acceptable here — and
 * ONLY here — is that the HTML was passed through the allowlist in
 * src/lib/admin/sanitizeHtml.js before it was ever stored, so the bytes in the
 * database are already safe. Sanitising on the way IN rather than on the way
 * out is deliberate: a second render path that forgets to sanitise cannot then
 * become the hole.
 *
 * ⚠ Do not render anything through this component that did not come out of
 * that sanitiser. If a new source of body HTML appears, it goes through
 * sanitizeHtml() first — there is no exception where the content is "ours".
 *
 * ── THE STYLING ──────────────────────────────────────────────────────────
 * Tailwind cannot reach inside an innerHTML blob with utility classes, so the
 * element styles are declared as descendant rules in globals.css under
 * `.blog-html`. They are written to match BlogProse exactly — the same
 * emerald links, the same scrolling table wrapper, the same callout boxes — so
 * a reader cannot tell which renderer produced the page they are on, and an
 * editor who switches a post between the two sees no visual change.
 */
export default function BlogHtml({ html }) {
  if (!html) return null;

  return (
    <div
      className="blog-html mt-10 space-y-6"
      // Safe: sanitised at write time. See the note above.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
