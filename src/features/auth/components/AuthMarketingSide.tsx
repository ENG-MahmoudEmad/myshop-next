export default function AuthMarketingSide() {
  return (
    <section className="rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-7 xl:p-8">
      <div className="group rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
        {/* placeholder for image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-600)]/40 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-white font-semibold [text-shadow:0_0_12px_rgba(216,67,21,0.5)]">
              myshop
            </p>
            <p className="text-white/90 text-xs">
              Fresh Groceries Delivered
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-6 text-2xl xl:text-3xl font-semibold text-zinc-900">
        Fresh groceries delivered
      </h2>
      <p className="mt-2 max-w-md text-sm text-zinc-600">
        Join thousands of happy customers who trust myshop for daily grocery
        needs.
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-600">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/65 backdrop-blur-md border border-white/20 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
          <span className="h-2 w-2 rounded-full bg-[var(--brand-600)]" />
          Free Delivery
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/65 backdrop-blur-md border border-white/20 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
          <span className="h-2 w-2 rounded-full bg-[var(--brand-600)]" />
          Secure Payment
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/65 backdrop-blur-md border border-white/20 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
          <span className="h-2 w-2 rounded-full bg-[var(--brand-600)]" />
          24/7 Support
        </div>
      </div>
    </section>
  );
}