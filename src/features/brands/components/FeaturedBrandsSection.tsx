import Link from "next/link";

const featured = [
  { name: "Nature's Harvest", products: 124 },
  { name: "Pure Dairy", products: 87 },
  { name: "Hearth & Grain", products: 62 },
];

export default function FeaturedBrandsSection() {
  return (
    <section className="mt-16 space-y-8">
      <h2 className="text-2xl font-bold text-zinc-900">
        Featured Brands
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {featured.map((brand) => (
          <Link
            key={brand.name}
            href={`/brands/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="group"
          >
            <div className="relative rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
              
              <div className="flex items-center justify-center h-24 w-24 mx-auto rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)] text-2xl font-bold">
                {brand.name.charAt(0)}
              </div>

              <div className="mt-6 text-center space-y-1">
                <h3 className="text-lg font-semibold text-zinc-900">
                  {brand.name}
                </h3>

                <p className="text-xs text-zinc-500">
                  {brand.products} Products
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}