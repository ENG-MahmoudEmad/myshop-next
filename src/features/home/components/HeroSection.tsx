import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/30 bg-white shadow-sm">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/hero.png"
          alt="Shop hero"
          fill
          priority
          className="object-cover"
        />
        {/* Orange overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-700)]/70 via-[var(--brand-600)]/35 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 py-14 sm:px-12 sm:py-20">
        <div className="max-w-xl text-white">
          <p className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            New season • Up to 30% off
          </p>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Fresh picks delivered <br className="hidden sm:block" />
            to your door
          </h1>

          <p className="mt-4 text-base text-white/90 sm:text-lg">
            Discover top categories, daily deals, and popular products — fast,
            clean, and beautiful.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-700)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            >
              Shop Now
            </Link>

            <Link
              href="/brands"
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all duration-300 ease-out hover:bg-white/20"
            >
              View Brands
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}