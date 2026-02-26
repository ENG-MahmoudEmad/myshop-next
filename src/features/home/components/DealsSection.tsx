import Link from "next/link";
import ProductCard from "@/features/home/components/ProductCard";

const deals = [
  {
    id: "101",
    name: "Fresh Strawberries (1kg)",
    price: 6.5,
    oldPrice: 8.0,
    tag: "Sale",
    image: "/products/p1.png",
    rating: 4,
  },
  {
    id: "102",
    name: "Organic Avocado (3pcs)",
    price: 5.25,
    oldPrice: 6.0,
    tag: "Hot",
    image: "/products/p2.png",
    rating: 4,
  },
  {
    id: "103",
    name: "Milk 2% (1L)",
    price: 2.1,
    oldPrice: 2.8,
    tag: "Sale",
    image: "/products/p3.png",
    rating: 4,
  },
  {
    id: "104",
    name: "Croissants (6 pcs)",
    price: 3.99,
    oldPrice: 4.8,
    tag: "Deal",
    image: "/products/p4.png",
    rating: 4,
  },
];

export default function DealsSection() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Deals of the Day</h2>
        <Link
          href="/search"
          className="text-sm font-semibold text-[var(--brand-600)] transition hover:text-[var(--brand-700)]"
        >
          View All →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {deals.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}