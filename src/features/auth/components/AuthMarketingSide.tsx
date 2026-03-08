import Image from "next/image";

export default function AuthMarketingSide() {
  return (
    <section className="rounded-3xl border border-white/20 bg-white/65 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md xl:p-8">
      <div className="group rounded-3xl border border-white/20 bg-white/65 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
        
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">

  <Image
    src="/loginauth.png"
    alt="Men fashion and electronics products"
    fill
    className="object-cover transition-transform duration-500 group-hover:scale-105 z-0"
    priority
  />

  {/* Orange overlay */}
  <div className="absolute inset-0 z-10 bg-gradient-to-br from-[var(--brand-600)]/50 via-[var(--brand-600)]/20 to-transparent" />

</div>
      </div>

      <h2 className="mt-6 text-2xl font-semibold text-zinc-900 xl:text-3xl">
        Premium brands, delivered fast
      </h2>

      <p className="mt-2 max-w-md text-sm text-zinc-600">
        Shop fashion essentials, electronics, and lifestyle picks with secure
        checkout, fast delivery, and a smooth shopping experience.
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-600">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/65 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[var(--brand-600)]" />
          Fast Delivery
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/65 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[var(--brand-600)]" />
          Secure Checkout
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/65 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[var(--brand-600)]" />
          Trusted Brands
        </div>
      </div>
    </section>
  );
}