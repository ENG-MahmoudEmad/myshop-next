const brands = [
  "Ocean Fresh",
  "Green Earth",
  "Sweet Valley",
  "Nutri Life",
  "Fresh Farms",
  "Wholesome Kitchen",
  "Brew Perfect",
  "Grain & Seed",
  "Eco Clean",
];

export default function BrandsGridSection() {
  return (
    <section className="mt-16 space-y-8">
      {/* ✅ keeps pagination position stable by reserving space */}
      <div className="min-h-[520px]">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand) => (
            <div
              key={brand}
              className="group rounded-2xl bg-white/65 backdrop-blur-md border border-white/20 p-6 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--brand-200)] hover:shadow-xl"
            >
              <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-xl bg-[var(--brand-50)] text-[var(--brand-700)] text-xl font-bold">
                {brand.charAt(0)}
              </div>

              <h4 className="mt-4 text-sm font-semibold text-zinc-900">
                {brand}
              </h4>

              <p className="mt-1 text-xs text-zinc-500">48 Products</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}