"use client";

import { useMemo, useState } from "react";
import CategoryCard from "@/features/categories/components/CategoryCard";
import SortDropdown from "@/features/categories/components/SortDropdown";
import PopularSubcategoriesSection from "@/features/categories/components/PopularSubcategoriesSection";
import FeaturedCategorySection from "@/features/categories/components/FeaturedCategorySection";
import SeasonalCategoriesSection from "@/features/categories/components/SeasonalCategoriesSection";
import NewsletterSection from "@/features/categories/components/NewsletterSection";
import { useCategories } from "@/features/categories/hooks/useCategories";

type SortValue = "featured" | "az" | "za";

function getCategoryTags(name: string) {
  const n = name.toLowerCase();

  if (
    n.includes("men") ||
    n.includes("women") ||
    n.includes("fashion") ||
    n.includes("clothes")
  ) {
    return ["Style", "Trending", "New"];
  }

  if (
    n.includes("elect") ||
    n.includes("mobile") ||
    n.includes("laptop") ||
    n.includes("tech")
  ) {
    return ["Tech", "Smart", "Popular"];
  }

  if (n.includes("beauty")) {
    return ["Glow", "Care", "Fresh"];
  }

  if (n.includes("home")) {
    return ["Modern", "Essentials", "Top Picks"];
  }

  return ["Featured", "Popular", "Shop"];
}

export default function CategoriesScreen() {
  const [sort, setSort] = useState<SortValue>("featured");

  const categoriesQ = useCategories({
    limit: 50,
  });

  const allCategories = categoriesQ.data?.data ?? [];

  const categories = useMemo(() => {
    const list = [...allCategories];

    switch (sort) {
      case "az":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "featured":
      default:
        break;
    }

    return list;
  }, [allCategories, sort]);

  return (
    <div className="py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
            Shop by Categories
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Browse our collection by category and discover products faster.
          </p>
        </div>

        <SortDropdown
          options={[
            { label: "Featured", value: "featured" },
            { label: "A → Z", value: "az" },
            { label: "Z → A", value: "za" },
          ]}
          value={sort}
          onChange={(v) => setSort(v as SortValue)}
        />
      </div>

      {categoriesQ.isError ? (
        <div className="mt-6 rounded-3xl border border-red-100 bg-red-50/80 p-6 text-sm text-red-700">
          Failed to load categories. Please try again.
        </div>
      ) : categoriesQ.isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[255px] animate-pulse rounded-3xl border border-white/20 bg-white/65"
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, index) => (
            <CategoryCard
              key={c._id}
              title={c.name}
              itemsCount={index + 1}
              imageUrl={c.image || "/banners/banner-1.jpeg"}
              tags={getCategoryTags(c.name)}
              href={`/categories/${c._id}`}
            />
          ))}
        </div>
      )}

      <div className="mt-16">
        <PopularSubcategoriesSection />
      </div>

      <FeaturedCategorySection />

      <SeasonalCategoriesSection />

      <NewsletterSection />
    </div>
  );
}