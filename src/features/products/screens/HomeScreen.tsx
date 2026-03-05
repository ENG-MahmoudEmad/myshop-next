"use client";

import { useEffect, useState } from "react";

import HeroSection from "@/features/home/components/HeroSection";
import FeaturesBar from "@/features/home/components/FeaturesBar";
import CategorySection from "@/features/home/components/CategorySection";
import DealsSection from "@/features/home/components/DealsSection";
import PromoBanners from "@/features/home/components/PromoBanners";
import PopularProducts from "@/features/home/components/PopularProducts";
import NewsletterSection from "@/features/home/components/NewsletterSection";

export default function HomeScreen() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ يمنع Hydration mismatch بسبب localStorage persisted cache
  if (!mounted) {
    return (
      <div className="space-y-20">
        <HeroSection />
        <FeaturesBar />
        <CategorySection />

        {/* placeholders بسيطة بدل الأقسام اللي بتستخدم React Query */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
          Loading products...
        </div>

        <PromoBanners />

        <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
          Loading products...
        </div>

        <NewsletterSection />
      </div>
    );
  }

  return (
    <div className="space-y-20">
      <HeroSection />
      <FeaturesBar />
      <CategorySection />
      <DealsSection />
      <PromoBanners />
      <PopularProducts />
      <NewsletterSection />
    </div>
  );
}