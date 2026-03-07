import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Shirt,
  Backpack,
} from "lucide-react";

const subcategories = [
  {
    name: "Smartphones",
    itemsCount: 42,
    icon: Smartphone,
    href: "/search?subcategory=smartphones",
  },
  {
    name: "Laptops",
    itemsCount: 28,
    icon: Laptop,
    href: "/search?subcategory=laptops",
  },
  {
    name: "Headphones",
    itemsCount: 24,
    icon: Headphones,
    href: "/search?subcategory=headphones",
  },
  {
    name: "Smart Watches",
    itemsCount: 18,
    icon: Watch,
    href: "/search?subcategory=smart-watches",
  },
  {
    name: "T-Shirts",
    itemsCount: 36,
    icon: Shirt,
    href: "/search?subcategory=t-shirts",
  },
  {
    name: "Bags & Backpacks",
    itemsCount: 20,
    icon: Backpack,
    href: "/search?subcategory=bags-backpacks",
  },
];

export default function PopularSubcategoriesSection() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">
          Popular Subcategories
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {subcategories.map((sub, i) => {
          const Icon = sub.icon;

          return (
            <Link key={i} href={sub.href} className="group block">
              <div
                className={[
                  "flex flex-col items-center gap-2 rounded-2xl p-6 text-center",
                  "bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
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
