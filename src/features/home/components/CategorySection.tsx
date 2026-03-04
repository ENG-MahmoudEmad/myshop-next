import Link from "next/link";
import {
  Shirt,
  Watch,
  Laptop,
  Smartphone,
  Headphones,
  ShoppingBag,
} from "lucide-react";

const categories = [
  { name: "Apparel", slug: "apparel", icon: Shirt },
  { name: "Accessories", slug: "accessories", icon: Watch },
  { name: "Laptops", slug: "laptops", icon: Laptop },
  { name: "Smartphones", slug: "smartphones", icon: Smartphone },
  { name: "Audio", slug: "audio", icon: Headphones },
  { name: "Bags", slug: "bags", icon: ShoppingBag },
];

export default function CategorySection() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Shop by Category</h2>

        <Link
          href="/categories"
          className="text-sm font-semibold text-[var(--brand-600)] transition hover:text-[var(--brand-700)] cursor-pointer"
        >
          View All →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => {
          const Icon = cat.icon;

          return (
            <Link
              key={cat.slug}
              href={`/search?category=${encodeURIComponent(cat.slug)}`}
              className="group flex cursor-pointer flex-col items-center gap-4 rounded-2xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              title={`Browse ${cat.name}`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] transition-all duration-300 group-hover:bg-[var(--brand-600)] group-hover:text-white">
                <Icon size={26} />
              </div>

              <span className="text-sm font-medium text-zinc-800">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}