"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const banners = [
  "/heromobile/cashback.webp",
  "/heromobile/vitamins1.webp",
  "/heromobile/viks.webp",
  "/heromobile/cetaphile1.webp",
];

export default function MobileSlider() {
  const [current, setCurrent] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;

    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
  };

  return (
    <section className="w-full md:hidden px-4 mt-2">
      <div
        className="relative overflow-hidden rounded-[14px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slider Track */}
        <div
          className="flex w-full transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {banners.map((img, index) => (
            /* FIXED: Changed min-w-full to w-full & enforced block width layout */
            <div key={index} className="w-full flex-shrink-0 block relative h-[140px]">
              <Image
                src={img}
                alt={`Medicine Banner ${index + 1}`}
                fill
                priority={index === 0} // Kept: High performance LCP asset preloading
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover rounded-[14px]" // Matched parent rounding to avoid raw edge leaks
              />
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index ? "w-5 bg-white" : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}