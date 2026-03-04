"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  src: string;
  badge: string;
  title: React.ReactNode;
  desc: string;
};

type HoverSide = "left" | "right" | null;

export default function HeroSection() {
  const slides: Slide[] = useMemo(
    () => [
      {
        src: "/hero.jpeg",
        badge: "New arrivals • Up to 30% off",
        title: (
          <>
            Style & Tech picks <br className="hidden sm:block" />
            made for you
          </>
        ),
        desc: "Shop trending apparel, electronics, and accessories — fast, clean, and beautiful.",
      },
      {
        src: "/hero2.jpeg",
        badge: "Limited drop • Fresh deals",
        title: (
          <>
            Upgrade your look <br className="hidden sm:block" />
            and your gear
          </>
        ),
        desc: "Discover best sellers, new releases, and curated picks from top brands.",
      },
    ],
    [],
  );

  const AUTO_MS = 4500;

  const [index, setIndex] = useState(0);
  const [hoverSide, setHoverSide] = useState<HoverSide>(null);

  const timerRef = useRef<number | null>(null);

  const goTo = (i: number) => setIndex((i + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  // ✅ Always autoplay (never pause)
  const start = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_MS);
  };

  useEffect(() => {
    start();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (x < 0.22) setHoverSide("left");
    else if (x > 0.78) setHoverSide("right");
    else setHoverSide(null);
  };

  // Mobile swipe
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = startX.current;
    if (s == null) return;
    const end = e.changedTouches[0]?.clientX ?? s;
    const dx = end - s;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    startX.current = null;
  };

  const current = slides[index];

  return (
    <section
      className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white shadow-sm"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setHoverSide(null)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Hero slider"
    >
      {/* ✅ Fixed height across breakpoints */}
      <div className="relative w-full h-[360px] sm:h-[430px] lg:h-[480px]">
        {/* Slides */}
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={[
              "absolute inset-0 transition-opacity duration-700 ease-out",
              i === index ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            <Image
              src={s.src}
              alt="Shop hero"
              fill
              priority={i === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-700)]/70 via-[var(--brand-600)]/35 to-transparent" />
          </div>
        ))}

        {/* Left arrow */}
        <button
          type="button"
          onClick={() => {
            prev();
            start(); // reset timer so it keeps flowing
          }}
          className={[
            "hidden sm:grid",
            "absolute left-5 top-1/2 -translate-y-1/2 z-30 h-12 w-12 place-items-center rounded-full",
            "border border-white/35 bg-white/15 text-white backdrop-blur-md",
            "shadow-[0_12px_35px_rgba(0,0,0,0.22)]",
            "transition-all duration-200",
            hoverSide === "left"
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 -translate-x-2 pointer-events-none",
            "hover:bg-white/25 active:scale-95 cursor-pointer",
          ].join(" ")}
          aria-label="Previous slide"
          title="Previous"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => {
            next();
            start();
          }}
          className={[
            "hidden sm:grid",
            "absolute right-5 top-1/2 -translate-y-1/2 z-30 h-12 w-12 place-items-center rounded-full",
            "border border-white/35 bg-white/15 text-white backdrop-blur-md",
            "shadow-[0_12px_35px_rgba(0,0,0,0.22)]",
            "transition-all duration-200",
            hoverSide === "right"
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 translate-x-2 pointer-events-none",
            "hover:bg-white/25 active:scale-95 cursor-pointer",
          ].join(" ")}
          aria-label="Next slide"
          title="Next"
        >
          <ChevronRight size={22} />
        </button>

        {/* Content */}
        <div className="relative z-10 h-full px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
          {/* ✅ lock content block height so buttons don't jump between slides */}
          <div className="max-w-xl text-white">
            <p className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] sm:text-xs font-semibold backdrop-blur">
              {current.badge}
            </p>

            {/* ✅ responsive title + min height */}
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight min-h-[88px] sm:min-h-[120px]">
              {current.title}
            </h1>

            {/* ✅ clamp + min height so paragraph doesn't change layout */}
            <p className="mt-4 text-sm sm:text-lg text-white/90 line-clamp-2 min-h-[44px] sm:min-h-[56px]">
              {current.desc}
            </p>

            {/* ✅ button row fixed spacing */}
            <div className="mt-6 sm:mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/search"
                className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-700)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                Shop Now
              </Link>

              <Link
                href="/brands"
                className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all duration-300 ease-out hover:bg-white/20"
              >
                View Brands
              </Link>
            </div>

            {/* Dots */}
            <div className="mt-7 sm:mt-8 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    goTo(i);
                    start();
                  }}
                  className={[
                    "h-2.5 w-2.5 rounded-full transition-all duration-300 cursor-pointer",
                    i === index
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/80",
                  ].join(" ")}
                  aria-label={`Go to slide ${i + 1}`}
                  title={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* progress bar (3s) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-white/15">
          <div
            key={index}
            className="h-full bg-white/60 animate-[heroProgress_4.5s_linear_forwards]"
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes heroProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}