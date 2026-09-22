/**
 * City guide paragraphs ⇄ editable text. Pure and client-safe.
 *
 * A paragraph in a city guide (src/data/lab/content/*.js, rendered by
 * src/components/lab/LabContent.jsx) is either a plain string or an array of
 * parts — strings and `{ text, href }` internal links. In the admin editor it
 * is one piece of text, with each link written markdown-style:
 *
 *   "Poora list [yahan dekhiye](/blogs/lab-test/varanasi) — ghar se."
 *
 * toText() and fromText() are exact inverses for every paragraph in the repo,
 * so opening a guide and saving it unchanged stores the same structure. Only
 * internal links (starting with "/") are recognised; anything else stays text.
 */

const LINK = /\[([^\]\n]+)\]\((\/[^)\s]*)\)/g;

/** A stored paragraph → the text shown in the editor. */
export function toText(para) {
  if (typeof para === "string") return para;
  if (!Array.isArray(para)) return "";
  return para
    .map((part) =>
      typeof part === "string" ? part : part?.href ? `[${part.text ?? ""}](${part.href})` : (part?.text ?? "")
    )
    .join("");
}

/** Editor text → a stored paragraph: a plain string, or parts when it has links. */
export function fromText(text) {
  const value = String(text ?? "");
  const parts = [];
  let last = 0;

  for (const match of value.matchAll(LINK)) {
    if (match.index > last) parts.push(value.slice(last, match.index));
    parts.push({ text: match[1], href: match[2] });
    last = match.index + match[0].length;
  }

  if (!parts.length) return value;
  if (last < value.length) parts.push(value.slice(last));
  return parts;
}

/** Paragraphs are separated by a blank line in the editor. */
export const splitParagraphs = (text) =>
  String(text ?? "")
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((para) => para.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

export const joinParagraphs = (paras = []) => paras.map(toText).join("\n\n");
