import CategoryCard from "@/features/categories/components/CategoryCard";
import SortDropdown from "@/features/categories/components/SortDropdown";
import PopularSubcategoriesSection from "@/features/categories/components/PopularSubcategoriesSection";
import FeaturedCategorySection from "@/features/categories/components/FeaturedCategorySection";
import SeasonalCategoriesSection from "@/features/categories/components/SeasonalCategoriesSection";
import NewsletterSection from "@/features/categories/components/NewsletterSection";

const categories = [
  {
    id: "fruits-veg",
    title: "Fruits & Vegetables",
    itemsCount: 86,
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
    tags: ["Organic", "Fresh", "Local"],
  },
  {
    id: "dairy-eggs",
    title: "Dairy & Eggs",
    itemsCount: 63,
    imageUrl:
      "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=1400&q=80",
    tags: ["Organic", "Farm Fresh"],
  },
  {
    id: "bakery-snacks",
    title: "Bakery & Snacks",
    itemsCount: 72,
    imageUrl:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1400&q=80",
    tags: ["Artisan", "Fresh Baked"],
  },
  {
    id: "meat-seafood",
    title: "Meat & Seafood",
    itemsCount: 54,
    imageUrl:
      "https://images.unsplash.com/photo-1603048297172-c92544798d62?auto=format&fit=crop&w=1400&q=80",
    tags: ["Premium", "Wild Caught"],
  },
  {
    id: "beverages",
    title: "Beverages",
    itemsCount: 48,
    imageUrl:
      "https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&w=1400&q=80",
    tags: ["Organic", "Natural"],
  },
  {
    id: "household-cleaning",
    title: "Household & Cleaning",
    itemsCount: 39,
    imageUrl:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1400&q=80",
    tags: ["Eco-friendly", "Essentials"],
  },
];

export default function CategoriesScreen() {
  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
            Shop by Categories
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Browse our wide selection of products by category.
          </p>
        </div>

        {/* Sort Dropdown */}
        <SortDropdown
          options={[
            { label: "Featured", value: "Featured" },
            { label: "Newest", value: "Newest" },
            { label: "Most Popular", value: "Most Popular" },
          ]}
          defaultValue="Featured"
        />
      </div>

      {/* Categories Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard
            key={c.id}
            title={c.title}
            itemsCount={c.itemsCount}
            imageUrl={c.imageUrl}
            tags={c.tags}
            href={`/categories/${c.id}`}
          />
        ))}
      </div>

      {/* 🔥 Popular Subcategories Section */}
      <div className="mt-16">
        <PopularSubcategoriesSection />
      </div>

      <FeaturedCategorySection />

      <SeasonalCategoriesSection />
      
      <NewsletterSection />
    </div>
  );
}