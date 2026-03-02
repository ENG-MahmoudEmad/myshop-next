import Link from "next/link";
import {
  Apple,
  Milk,
  Croissant,
  Fish,
  Coffee,
  SprayCan,
} from "lucide-react";

const subcategories = [
  { name: "Fresh Fruits", itemsCount: 42, icon: Apple, href: "/products?subcategory=fresh-fruits" },
  { name: "Fresh Vegetables", itemsCount: 38, icon: Apple, href: "/products?subcategory=fresh-vegetables" },
  { name: "Cheese", itemsCount: 24, icon: Milk, href: "/products?subcategory=cheese" },
  { name: "Bread", itemsCount: 28, icon: Croissant, href: "/products?subcategory=bread" },
  { name: "Seafood", itemsCount: 19, icon: Fish, href: "/products?subcategory=seafood" },
  { name: "Juices", itemsCount: 22, icon: Coffee, href: "/products?subcategory=juices" },
];

export default function PopularSubcategoriesSection() {
  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">
          Popular Subcategories
        </h2>

      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {subcategories.map((sub, i) => {
          const Icon = sub.icon;

          return (
            <Link
              key={i}
              href={sub.href}
              className="group block"
            >
              <div
                className={[
                  "flex flex-col items-center gap-2 rounded-2xl p-6 text-center",
                  // ✅ MyShop Glass System
                  "bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
                  // ✅ Hover lift (cheatsheet)
                  "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex h-16 w-16 items-center justify-center rounded-full",
                    "bg-[var(--brand-50)] text-[var(--brand-700)]",
                    "transition-all duration-300 ease-out",
                    "group-hover:bg-[var(--brand-600)] group-hover:text-white",
                  ].join(" ")}
                >
                  <Icon size={26} />
                </div>

                <span className="text-sm font-semibold text-zinc-800">
                  {sub.name}
                </span>

                <span className="text-xs text-zinc-500">
                  {sub.itemsCount} items
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}