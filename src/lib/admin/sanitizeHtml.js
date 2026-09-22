/**
 * The allowlist every piece of editor HTML passes through before it is stored.
 *
 * ── WHY SANITISE OUR OWN EDITOR'S OUTPUT ─────────────────────────────────
 * Because what arrives at the server is not the editor's output. It is a POST
 * body, and a POST body is whatever the sender chose to put in it — the TipTap
 * instance in the browser is a convenience for the person typing, not a
 * control. An admin account that is phished, or an editor who pastes a block
 * of copied HTML from a site that had a script in it, both end with markup on
 * a public page that nobody reviewed.
 *
 * The blog body is rendered with dangerouslySetInnerHTML (that is what storing
 * HTML means), so anything that survives this function runs on the site. It is
 * sanitised on the way IN, so what is in the database is already safe and a
 * render path that forgets to sanitise cannot be the hole.
 *
 * ── WHY IT IS WRITTEN HERE RATHER THAN INSTALLED ─────────────────────────
 * The usual answer is `sanitize-html` or DOMPurify + jsdom. Both pull a large
 * dependency tree into a Node runtime for one function, and DOMPurify needs a
 * DOM that does not exist on the server. The rule this file enforces is an
 * allowlist — an element not on the list is dropped, an attribute not on the
 * list is dropped, and a URL that is not http/https/mailto/tel or a site-
 * relative path is dropped. An allowlist is short enough to read in one sitting
 * and to be sure of, which a blocklist never is.
 *
 * ⚠ If you add a tag to ALLOWED, think about what its attributes can do. The
 * two that have bitten every project that wrote one of these are `href`
 * (javascript: URLs) and anything beginning `on` (inline handlers). Both are
 * handled below and both should stay handled.
 */

/** Tags that may appear, and the attributes each may carry. */
const ALLOWED = {
  p: [],
  br: [],
  strong: [],
  em: [],
  u: [],
  s: [],
  code: [],
  pre: [],
  blockquote: [],
  h2: ["id"],
  h3: ["id"],
  h4: ["id"],
  ul: [],
  ol: ["start"],
  li: [],
  hr: [],
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "width", "height", "loading", "decoding"],
  figure: [],
  figcaption: [],
  table: [],
  thead: [],
  tbody: [],
  tr: [],
  th: ["colspan", "rowspan", "scope"],
  td: ["colspan", "rowspan"],
  div: ["class"], // callouts only — see ALLOWED_CLASSES
  span: ["class"],
};

/*
 * h1 is deliberately NOT on that list.
 *
 * The page template already renders the article's title as the one <h1>. A
 * second one typed into the body gives the page two competing top-level
 * headings, which is both an accessibility problem and the most common
 * self-inflicted on-page SEO fault there is. The editor offers H2 and H3 and
 * the scorer checks the outline; there is no way to produce an H1 from here.
 */

/** The only class names body markup may carry — the callout styles. */
const ALLOWED_CLASSES = new Set([
  "note",
  "note-info",
  "note-warn",
  "lead",
  "small",
]);

/** Elements with no closing tag. */
const VOID = new Set(["br", "hr", "img"]);

const escapeText = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Is this URL safe to put in an href or src?
 *
 * Site-relative paths, http(s), mailto and tel. Everything else — javascript:,
 * data:, vbscript:, a protocol-relative //evil.example — is refused.
 *
 * `data:` is refused for href AND for src. A data: image in the body would be
 * a picture that bypasses the media library entirely: not converted to WebP,
 * not sized, not cached, and weighing down the HTML of the page itself.
 * Images belong in the library and come back as /media/… URLs.
 */
export function safeUrl(value) {
  const url = String(value ?? "").trim();
  if (!url) return null;

  // Strip control characters first: "java\nscript:alert(1)" is a real bypass
  // against a naive prefix check, because browsers ignore those.
  const flat = url.replace(/[\u0000-\u001F\u007F\s]/g, "").toLowerCase();

  if (flat.startsWith("javascript:") || flat.startsWith("data:") || flat.startsWith("vbscript:")) {
    return null;
  }
  if (url.startsWith("//")) return null; // protocol-relative: whose site is that?

  if (url.startsWith("/") || url.startsWith("#")) return url; // our own
  if (/^https?:\/\//i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url)) return url;

  return null;
}

/** Attribute string for one open tag, after filtering. */
function attributesFor(tag, raw) {
  const allowed = ALLOWED[tag];
  const out = [];
  let isExternalLink = false;

  // name="value" | name='value' | name=value | name
  const pattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

  for (const match of String(raw ?? "").matchAll(pattern)) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? "";

    // Belt and braces: `on*` can never be allowed, whatever a future edit to
    // ALLOWED says. This check is first so it cannot be bypassed by adding an
    // attribute name to the list by mistake.
    if (name.startsWith("on")) continue;
    if (!allowed.includes(name)) continue;

    if (name === "href" || name === "src") {
      const url = safeUrl(value);
      if (!url) continue;
      if (/^https?:\/\//i.test(url)) isExternalLink = true;
      out.push(`${name}="${escapeAttr(url)}"`);
      continue;
    }

    if (name === "class") {
      const classes = value.split(/\s+/).filter((c) => ALLOWED_CLASSES.has(c));
      if (classes.length) out.push(`class="${escapeAttr(classes.join(" "))}"`);
      continue;
    }

    if (name === "target") {
      // Only _blank, and it always brings rel with it — see below.
      if (value === "_blank") out.push('target="_blank"');
      continue;
    }

    if (name === "rel") continue; // rebuilt below rather than trusted

    if (["width", "height", "colspan", "rowspan", "start"].includes(name)) {
      const n = parseInt(value, 10);
      if (Number.isFinite(n) && n > 0 && n < 10000) out.push(`${name}="${n}"`);
      continue;
    }

    out.push(`${name}="${escapeAttr(value)}"`);
  }

  /*
   * Outbound links get rel="nofollow noopener noreferrer" — every one of them.
   *
   * `noopener` is the security half: a target="_blank" link without it hands
   * the opened page a handle to ours via window.opener.
   *
   * `nofollow` is the SEO half, and it is a deliberate editorial default on a
   * site in this sector. A health site that passes link equity to every
   * outbound URL an editor pastes is one guest-post pitch away from being used
   * as a link farm, and Google treats a medical site's outbound link profile as
   * a quality signal. An editor who genuinely wants to endorse a source can say
   * so; nothing does it by accident.
   */
  if (tag === "a" && isExternalLink) {
    out.push('rel="nofollow noopener noreferrer"');
    if (!out.some((a) => a.startsWith("target="))) out.push('target="_blank"');
  }

  // An <img> with no dimensions causes layout shift, and an <img> that loads
  // eagerly below the fold costs LCP. Both are Core Web Vitals, both are
  // ranking inputs, and neither is something an editor should have to know.
  if (tag === "img") {
    if (!out.some((a) => a.startsWith("loading="))) out.push('loading="lazy"');
    if (!out.some((a) => a.startsWith("decoding="))) out.push('decoding="async"');
    if (!out.some((a) => a.startsWith("alt="))) out.push('alt=""');
  }

  return out.length ? ` ${out.join(" ")}` : "";
}

/**
 * Sanitise a fragment of editor HTML.
 *
 * Unknown elements are UNWRAPPED, not dropped whole: a paste that arrives
 * inside a <section> or a <font> should keep its text, and dropping the
 * element with its contents would silently eat a paragraph the editor can see
 * on screen. <script> and <style> are the exception — their contents are code,
 * not prose, and go with them.
 */
export function sanitizeHtml(input) {
  const html = String(input ?? "");
  if (!html.trim()) return "";

  let out = "";
  const open = []; // the stack, so unclosed tags are closed at the end
  let index = 0;

  // Drop comments, and script/style with everything inside them, up front.
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|form|input|button|textarea|select)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|input|button|textarea|select)\b[^>]*\/?>/gi, "");

  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;

  for (const match of cleaned.matchAll(tagPattern)) {
    out += escapeText(cleaned.slice(index, match.index));
    index = match.index + match[0].length;

    const tag = match[1].toLowerCase();
    const closing = match[0].startsWith("</");

    if (!Object.hasOwn(ALLOWED, tag)) continue; // unwrap: keep the text, lose the tag

    if (closing) {
      // Only close a tag we actually opened, or a stray </p> in a paste
      // produces markup the browser has to guess at.
      const at = open.lastIndexOf(tag);
      if (at === -1) continue;
      while (open.length > at) out += `</${open.pop()}>`;
      continue;
    }

    const attrs = attributesFor(tag, match[2]);

    if (VOID.has(tag)) {
      // An <img> with no usable src is not an image; emitting it would render
      // a broken-image icon on a live page.
      if (tag === "img" && !attrs.includes("src=")) continue;
      out += `<${tag}${attrs} />`;
      continue;
    }

    out += `<${tag}${attrs}>`;
    open.push(tag);
  }

  out += escapeText(cleaned.slice(index));
  while (open.length) out += `</${open.pop()}>`;

  return out.trim();
}

/** The readable text of an HTML fragment — for word counts and SEO checks. */
export const textOf = (html) =>
  String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

/** Every heading in a body, in order — what the outline check reads. */
export function headingsOf(html) {
  return [...String(html ?? "").matchAll(/<h([234])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: textOf(m[2]),
  }));
}

/** Every link in a body, split into internal and external. */
export function linksOf(html) {
  const links = [...String(html ?? "").matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>/gi)].map((m) => m[1]);
  return {
    internal: links.filter((href) => href.startsWith("/")),
    external: links.filter((href) => /^https?:\/\//i.test(href)),
  };
}

/** Every image in a body, with whether it has real alt text. */
export function imagesOf(html) {
  return [...String(html ?? "").matchAll(/<img\b([^>]*)>/gi)].map((m) => {
    const alt = /alt="([^"]*)"/i.exec(m[1])?.[1] ?? "";
    const src = /src="([^"]*)"/i.exec(m[1])?.[1] ?? "";
    return { src, alt, hasAlt: alt.trim().length > 0 };
  });
}
