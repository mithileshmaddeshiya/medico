// SSR component — every button is a plain <a>. No state, no client bundle, and
// it works with JavaScript switched off.
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";

import { BRAND_PROFILES } from "@/lib/schema";

/**
 * Share row for an article.
 *
 * ── WHY THESE THREE ──────────────────────────────────────────────────────
 * WhatsApp is how this audience actually forwards a link; Facebook is the only
 * other network with meaningful reach here. The row used to carry X, Telegram,
 * LinkedIn and email as well — six icons nobody in Purvanchal was going to use
 * to pass on a blood-test guide, and every extra icon makes the two that matter
 * smaller targets.
 *
 * ── INSTAGRAM IS NOT A SHARE BUTTON ──────────────────────────────────────
 * Instagram publishes no web sharing endpoint — there is no equivalent of
 * wa.me or facebook.com/sharer that takes a URL. Anything claiming to "share
 * to Instagram" from a web page either opens the app with nothing prefilled or
 * silently does nothing. So the Instagram icon here links to the profile, and
 * its label and tooltip say "follow" rather than "share". An icon that lies
 * about what it does is worse than an icon that is missing.
 *
 * That is also why the separate follow row underneath is gone: both profiles it
 * held are in this row now, and the same two links twice in one box is clutter.
 *
 * ── rel ON EACH KIND OF LINK ─────────────────────────────────────────────
 * Share endpoints carry `nofollow`: they are not editorial links, they point at
 * a URL that renders our own page back, and passing them link equity is
 * pointless. The profile link does NOT carry nofollow — it points at the same
 * profile `sameAs` declares in the organisation schema, and that agreement
 * between markup and visible links is a small part of how a brand entity gets
 * corroborated. See the note above BRAND_PROFILES in src/lib/schema.js.
 *
 * `noopener` everywhere, because every one of these opens in a new tab.
 */

/** First profile whose URL is on `host`, or null when we have none. */
const profileOn = (host) =>
  BRAND_PROFILES.find((url) => url.includes(host)) ?? null;

export default function BlogShare({ url, title }) {
  if (!url) return null;

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title ?? "");

  const instagram = profileOn("instagram.com");

  const links = [
    {
      key: "whatsapp",
      label: "WhatsApp par share karein",
      // wa.me is the documented universal link: it opens the app on a phone and
      // web.whatsapp.com on a desktop, without us sniffing the platform.
      href: `https://wa.me/?text=${t}%20${u}`,
      Icon: FaWhatsapp,
      share: true,
      className: "hover:bg-[#25D366] hover:border-[#25D366]",
    },
    {
      key: "facebook",
      label: "Facebook par share karein",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      Icon: FaFacebookF,
      share: true,
      className: "hover:bg-[#1877F2] hover:border-[#1877F2]",
    },
    // Only rendered when the profile actually exists in BRAND_PROFILES — a
    // social icon pointing nowhere is the one thing worse than no icon.
    instagram && {
      key: "instagram",
      label: "MedicoBharat ko Instagram par follow karein",
      href: instagram,
      Icon: FaInstagram,
      share: false,
      className: "hover:bg-[#E1306C] hover:border-[#E1306C]",
    },
  ].filter(Boolean);

  return (
    <section
      aria-labelledby="blog-share-heading"
      className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
    >
      <h2
        id="blog-share-heading"
        className="text-base sm:text-lg font-bold tracking-tight text-slate-900"
      >
        Ye guide kisi kaam ke aadmi tak pahunchaiye
      </h2>

      <p className="mt-1.5 text-[12.5px] sm:text-[13.5px] leading-relaxed text-slate-500">
        Ghar me kisi ka test hone wala hai, ya kisi ki report samajh nahi aa rahi —
        unhe ye link bhej dijiye.
      </p>

      <ul className="mt-4 flex flex-wrap items-center gap-3">
        {links.map(({ key, label, href, Icon, share, className }) => (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel={share ? "nofollow noopener noreferrer" : "noopener noreferrer"}
              aria-label={label}
              title={label}
              className={`flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:text-white ${className}`}
            >
              <Icon aria-hidden className="h-[18px] w-[18px]" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
