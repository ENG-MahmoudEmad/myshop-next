import Link from "next/link";
import { Apple, Milk, Croissant, Fish, Coffee, SprayCan } from "lucide-react";

const categories = [
  { name: "Fruits", icon: Apple },
  { name: "Dairy", icon: Milk },
  { name: "Bakery", icon: Croissant },
  { name: "Seafood", icon: Fish },
  { name: "Beverages", icon: Coffee },
  { name: "Household", icon: SprayCan },
];

export default function CategorySection() {
  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">
          Shop by Category
        </h2>

        <Link
          href="/categories"
          className="text-sm font-semibold text-[var(--brand-600)] transition hover:text-[var(--brand-700)]"
        >
          View All →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat, i) => {
          const Icon = cat.icon;

          return (
            <div
              key={i}
              className="group flex cursor-pointer flex-col items-center gap-4 rounded-2xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] transition-all duration-300 group-hover:bg-[var(--brand-600)] group-hover:text-white">
                <Icon size={26} />
              </div>

              <span className="text-sm font-medium text-zinc-800">
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}