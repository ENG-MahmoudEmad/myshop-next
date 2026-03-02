export default function BrandsHeroSection() {
  return (
    <section className="relative mt-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-[var(--brand-100)]/60 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] px-8 py-16 text-center">
        
        {/* subtle glass light overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent rounded-3xl" />

        <div className="relative mx-auto max-w-2xl space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-700)]">
            Discover Trusted Brands
          </h1>

          <p className="text-sm md:text-base text-zinc-700 leading-relaxed">
            We partner with quality brands to bring you the freshest products,
            premium ingredients, and trusted household essentials.
          </p>
        </div>
      </div>
    </section>
  );
}