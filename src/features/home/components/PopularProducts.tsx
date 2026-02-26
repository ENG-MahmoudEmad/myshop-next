import Link from "next/link";
import ProductCard from "@/features/home/components/ProductCard";

const products = [
  {
    id: "201",
    name: "Organic Bananas (1kg)",
    price: 4.5,
    image: "/products/p1.png",
  },
  {
    id: "202",
    name: "Fresh Tomatoes",
    price: 3.2,
    image: "/products/p2.png",
  },
  {
    id: "203",
    name: "Premium Coffee Beans",
    price: 12.99,
    image: "/products/p3.png",
  },
  {
    id: "204",
    name: "Cheddar Cheese Block",
    price: 6.75,
    image: "/products/p4.png",
  },
];

export default function PopularProducts() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">
          Popular Products
        </h2>

        <Link
          href="/search"
          className="text-sm font-semibold text-[var(--brand-600)] transition hover:text-[var(--brand-700)]"
        >
          View All →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}