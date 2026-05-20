"use client";

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

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [current]);

  // Next Slide
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  // Prev Slide
  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  // Swipe Start
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  // Swipe End
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  // Swipe Logic
  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current;

    // Left Swipe
    if (distance > 50) {
      nextSlide();
    }

    // Right Swipe
    if (distance < -50) {
      prevSlide();
    }
  };

  return (
    <div className="w-full md:hidden px-2 mt-2">
      <div
        className="relative overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {banners.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`banner-${index}`}
              className="w-full h-[140px] object-cover flex-shrink-0 rounded-[6px]"
            />
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-5 bg-white"
                  : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}