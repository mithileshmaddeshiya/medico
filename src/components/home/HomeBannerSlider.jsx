"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

/**
 * The auto-playing banner strip, content from HOME_BANNERS in src/data/home.js.
 *
 * ── WHAT IT IS FOR ────────────────────────────────────────────────────────
 * One box, several pieces of artwork, rotating on their own. On the home page
 * it sits under the price cards, so the first thing a visitor meets is still
 * the hero and its booking form — a carousel near the top pushes the form down
 * and takes the LCP slot for an image nobody asked for. Being below the fold is
 * also why the slides load lazily; see the loading note further down.
 *
 * ── 16:5 AND UNTOUCHED NORMALLY; 16:6 AND STRETCHED ON A PHONE ────────────
 * The banners in /public/swipper are 16:5 (2242x701), and they have their
 * headline, their logo and their feature labels PAINTED INTO THE FILE. From
 * 640px up the box IS 16:5, so the artwork is shown exactly as drawn — same
 * call HomeHero makes.
 *
 * Below 640px the box is 16:6 and the image is `object-fill`: it is STRETCHED
 * about 20% vertically to reach the taller box. That is a deliberate choice
 * between three bad options, and the other two were built and rejected first:
 *
 *   CROP (`object-cover` in a taller box) — a 16:5 image in a 16:6 box
 *   overflows 20% in width, so it loses 10% off EACH side, and there is
 *   nothing spare there. Rendered and looked at, both slides: at 16:5.5 they
 *   survive; at 16:5.75 slider2 loses the "P" of "Precise"; at 16:6 it loses
 *   "Be" of "Better"; at 5:2 slider1's MedicoBharat logo is sliced off.
 *   `object-position` buys nothing either — the left margin is ~5% (logo,
 *   headline) and the bottom bar's third chip runs to the right edge, so
 *   whichever side is favoured, the other loses a word. Cutting the artwork
 *   is the one outcome that was explicitly ruled out.
 *
 *   LETTERBOX (`object-contain`, blurred copy of the slide behind it) — the
 *   SECTION gets taller and the banner does not. It answers a different
 *   complaint than the one that was made.
 *
 *   STRETCH (here) — nothing is cut, the width is untouched, and the strip
 *   goes from 112px to ~134px on a 390px phone. The cost is geometry: type
 *   and the logo are 20% taller than drawn. At this size it does not read as
 *   distortion, which was checked by rendering it rather than assumed.
 *
 * ⚠ 16:6 IS THE CEILING, AND IT IS A DIFFERENT CEILING FROM BEFORE. What
 * limits it now is how much distortion the wordmark can carry, not what falls
 * off the edge — so DO NOT go further on the grounds that "nothing is being
 * cut". Anything past ~20% starts to look like a squashed logo, which is
 * worse than a short banner. Real height beyond this needs a second, taller
 * cut of each banner authored for phones; see home.js.
 *
 * Change these ratios and change the note in home.js with them. They are one
 * decision written in two places.
 *
 * ── AUTOPLAY: IT IS MEANT TO NEVER STOP ───────────────────────────────────
 * The brief for this strip is that it keeps going, so both of the usual ways a
 * Swiper quietly parks itself are switched off: it does not stop on
 * interaction (`disableOnInteraction: false`) and it does not pause on hover.
 * The third way — a loop that turns itself off because the slide count is a
 * hair too low — is the one that actually bit, and there is a warning about it
 * on the `loop` prop below. If this ever appears to stop again, check that
 * first; it is not the autoplay config.
 *
 * There remains exactly ONE case where it stops, and it stays:
 * `prefers-reduced-motion`. Movement a user cannot
 * start or stop is the exact thing that setting exists to switch off, and an
 * autoplaying carousel is the textbook case. That is handled by stopping the
 * instance in an effect rather than by conditionally passing the `autoplay`
 * prop: the media query cannot be read on the server, so branching on it
 * during render would make the server and client markup disagree.
 *
 * ── ONE SLIDE IS NOT A SLIDER ─────────────────────────────────────────────
 * With a single banner it renders a plain image and no Swiper at all. Dots
 * under one slide and a timer with nowhere to go are noise, and it saves the
 * carousel's JavaScript on a page that has nothing to rotate.
 *
 * ── LOADING: EVERY SLIDE IS LAZY ──────────────────────────────────────────
 * The strip sits below the price grid, so nothing here is on screen at load
 * and nothing here should be fetched at load. The first slide was `eager` while
 * this component sat higher up the page; once it moved down, eager only meant
 * "download a banner the visitor may never scroll to", competing with the hero
 * on the one page that can least afford it.
 *
 * Definitely not `preload` either: the Next 16 docs name a carousel as the case
 * NOT to use it for — "multiple images that could be the LCP element depending
 * on the viewport". (`priority` is deprecated in Next 16 in favour of
 * `preload`; neither belongs here.)
 *
 * The known cost: a slide waiting off to the right is outside the viewport
 * horizontally, so it starts loading as it translates in, and the very first
 * rotation can flash. It happens once per visit on a file this size, which is
 * a fair trade for not touching the network until someone scrolls this far.
 */

/** Milliseconds a slide holds before the next one comes in. */
const AUTOPLAY_DELAY = 4500;

export default function HomeBannerSlider({
  banners = [],
  heading = "Offers and updates",
}) {
  const [swiper, setSwiper] = useState(null);

  /* Reduced motion is read after mount, never during render — see the note
     above. `addEventListener` on the query so a user who flips the OS setting
     while the page is open gets the change without a reload. */
  useEffect(() => {
    if (!swiper || swiper.destroyed || !swiper.autoplay) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      if (swiper.destroyed || !swiper.autoplay) return;
      if (query.matches) swiper.autoplay.stop();
      else swiper.autoplay.start();
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [swiper]);

  const slides = banners.filter((banner) => banner?.src && banner?.alt);
  if (slides.length === 0) return null;

  return (
    <section
      aria-label={heading}
      aria-roledescription={slides.length > 1 ? "carousel" : undefined}
      /* px-4 on a phone, unchanged. It ran edge-to-edge for one revision to
         squeeze ~8px more height out of the extra width, and that was the
         wrong trade: it widens the banner to buy height, and the width is
         supposed to stay where it is. Height comes from the ratio now, not
         from eating the page margin. */
      className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6"
    >
      {/* The heading is for screen readers and the document outline only. The
          artwork carries its own words, and a visible title above it would be
          a second heading saying the same thing — the same trade the hero
          makes, for the same reason (see HomeHero). */}
      <h2 className="sr-only">{heading}</h2>

      {slides.length === 1 ? (
        <BannerFrame>
          <BannerSlide banner={slides[0]} />
        </BannerFrame>
      ) : (
        <Swiper
          modules={[Autoplay, Pagination, Keyboard, A11y]}
          onSwiper={setSwiper}
          slidesPerView={1}
          loop
          /* ⚠ DO NOT ADD `loopAdditionalSlides` HERE. It was added once to
             "smooth out" the wrap at two slides and it silently killed the
             loop instead — the strip played slide 1, played slide 2 and
             stopped dead.
             Swiper disables loop when
                 slides.length < slidesPerView + loopedSlides
             (see loopFix in swiper/shared/swiper-core.mjs), and
             `loopedSlides` is slidesPerGroup PLUS loopAdditionalSlides. At two
             banners that is 2 < 1 + 2 — true, so loop turns itself off, and
             autoplay without loop simply stops on the last slide.
             With the default it is 2 < 1 + 1 — false, and the loop runs.
             The margin here is exactly one slide, so anything that raises
             `loopedSlides` or `slidesPerView` breaks it again. If a third
             banner is ever added the headroom grows and this stops being
             delicate, but until then: leave it alone. */
          speed={600}
          autoplay={{
            delay: AUTOPLAY_DELAY,
            /* Both of these exist to answer the same complaint: "it stops".
               `disableOnInteraction: false` keeps the timer alive after a
               swipe or a dot click. `pauseOnMouseEnter` is left OFF (Swiper's
               default) because on desktop a cursor that simply comes to rest
               over the banner froze it, which reads as broken rather than
               considerate — and the banner is wide enough that a pointer lands
               on it often. */
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          keyboard={{ enabled: true }}
          pagination={{ clickable: true }}
          a11y={{
            enabled: true,
            prevSlideMessage: "Previous banner",
            nextSlideMessage: "Next banner",
            paginationBulletMessage: "Go to banner {{index}}",
          }}
          /* Room under the frame for the dots, which sit outside the artwork
             rather than on top of it — a bullet over a photograph is invisible
             on whichever slide happens to be light there. */
          className="[&_.swiper-wrapper]:items-stretch [&_.swiper-pagination]:static [&_.swiper-pagination]:mt-3 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:bg-emerald-300 [&_.swiper-pagination-bullet-active]:w-5 [&_.swiper-pagination-bullet-active]:rounded-full [&_.swiper-pagination-bullet-active]:bg-emerald-600"
        >
          {slides.map((banner) => (
            <SwiperSlide key={banner.src}>
              <BannerFrame>
                <BannerSlide banner={banner} />
              </BannerFrame>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}

/** The box every slide shares — see the ratio note at the top of the file. */
function BannerFrame({ children }) {
  return (
    <div className="relative w-full aspect-16/6 sm:aspect-16/5 overflow-hidden rounded-xl sm:rounded-2xl ring-1 ring-emerald-100 shadow-[0_18px_44px_-30px_rgba(6,78,59,0.55)]">
      {children}
    </div>
  );
}

/**
 * One banner. Wrapped in a real <Link> when the data gives it an `href`, so a
 * banner that promises a booking can actually start one; plain otherwise —
 * a clickable box that goes nowhere is worse than one that never looked
 * clickable.
 */
function BannerSlide({ banner }) {
  const image = (
    <Image
      src={banner.src}
      alt={banner.alt}
      fill
      loading="lazy"
      /* Full width up to the 6xl container, then capped at its real maximum —
         1152px content box, so the browser never fetches a larger source than
         the box can show. */
      sizes="(max-width: 1200px) 100vw, 1152px"
      /* `object-fill` below 640px is the whole point of the phone treatment,
         not a slip: the box there is 16:6 and the artwork is 16:5, and filling
         it stretches the picture rather than cutting 10% off each side of it.
         The trade is written out at the top of this file — read it before
         "fixing" this to object-cover, because that reintroduces the crop
         that this was chosen over.
         From 640px up the box is the artwork's own ratio, so cover and fill
         would draw the same pixels; `sm:object-cover` is there so the day
         someone changes the desktop ratio it crops instead of distorting. */
      className="object-fill sm:object-cover sm:object-center"
    />
  );

  if (!banner.href) return image;

  return (
    <Link
      href={banner.href}
      title={banner.title ?? banner.alt}
      className="block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      {image}
    </Link>
  );
}
