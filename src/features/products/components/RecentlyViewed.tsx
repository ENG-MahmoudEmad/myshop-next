import Image from "next/image";
import Link from "next/link";

const items = [
  { id: "301", name: "Organic Whole Milk", price: 4.29, image: "/products/p1.png" },
  { id: "302", name: "Artisan Sourdough Bread", price: 3.99, image: "/products/p2.png" },
  { id: "303", name: "Fresh Atlantic Salmon", price: 9.99, image: "/products/p3.png" },
  { id: "304", name: "Greek Yogurt (32oz)", price: 4.49, image: "/products/p4.png" },
  { id: "305", name: "Organic Brown Eggs", price: 3.99, image: "/products/p2.png" },
  { id: "306", name: "Organic Fresh Apples", price: 3.99, image: "/products/p3.png" },
];

export default function RecentlyViewed() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-zinc-900">Recently Viewed</h2>
        <Link
          href="/search"
          className="text-sm font-semibold text-[var(--brand-600)] transition hover:text-[var(--brand-700)]"
        >
          View All →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-zinc-50">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex-1">
              <div className="line-clamp-1 text-sm font-semibold text-zinc-900 group-hover:text-[var(--brand-700)]">
                {p.name}
              </div>
              <div className="mt-1 text-sm font-bold text-[var(--brand-700)]">
                ${p.price.toFixed(2)}
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] transition group-hover:bg-[var(--brand-600)] group-hover:text-white">
              +
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}