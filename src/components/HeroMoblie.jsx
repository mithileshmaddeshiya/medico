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
  // ✅ HYDRATION SAFE
  const [mounted, setMounted] = useState(false);

  // ✅ CURRENT SLIDE
  const [current, setCurrent] = useState(0);

  // ✅ TOUCH REFERENCES
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* ================= MOUNT ================= */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [mounted]);

  /* ================= NEXT ================= */
  const nextSlide = () => {
    setCurrent((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  /* ================= PREV ================= */
  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  /* ================= TOUCH START ================= */
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  /* ================= TOUCH END ================= */
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;

    handleSwipe();
  };

  /* ================= SWIPE ================= */
  const handleSwipe = () => {
    const distance =
      touchStartX.current - touchEndX.current;

    // LEFT
    if (distance > 50) {
      nextSlide();
    }

    // RIGHT
    if (distance < -50) {
      prevSlide();
    }
  };

  // ✅ PREVENT HYDRATION MISMATCH
  if (!mounted) return null;

  return (
    <div className="w-full md:hidden px-4 mt-2">
      <div
        className="relative overflow-hidden rounded-[14px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* SLIDER */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {banners?.map((img, index) => (
            <div
              key={index}
              className="min-w-full flex-shrink-0"
            >
              <Image
                src={img}
                alt={`Medicine Banner ${index + 1}`}
                width={800}
                height={300}
                priority={index === 0}
                className="w-full h-[140px] object-cover rounded-[6px]"
              />
            </div>
          ))}
        </div>

        {/* DOTS */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-5 bg-white"
                  : "w-2 bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}