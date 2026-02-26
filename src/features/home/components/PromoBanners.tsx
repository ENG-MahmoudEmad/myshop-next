import Image from "next/image";
import Link from "next/link";

export default function PromoBanners() {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {/* Banner 1 */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="absolute inset-0">
          <Image
            src="/banners/banner-1.png"
            alt="Promo banner 1"
            fill
            className="object-cover"
          />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-700)]/35 via-[var(--brand-600)]/40 to-transparent" />
        </div>

        <div className="relative z-10 p-8 sm:p-10">
          <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            Limited Offer
          </p>

          <h3 className="mt-4 text-3xl font-extrabold text-white">
            Up to{" "}

            <span className="relative inline-block font-extrabold text-[var(--brand-100)] ">
            <span className="absolute bottom-1 left-0 h-3 w-full bg-[var(--brand-600)]/40 -z-10 "></span>
            50% OFF
        </span>{" "}
            on Fresh Picks
          </h3>

          <p className="mt-3 max-w-md text-sm text-white/90">
            Stock up on your favorites with warm deals today.
          </p>

          <Link
            href="/search"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--brand-600)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-md"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Banner 2 */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="absolute inset-0">
          <Image
            src="/banners/banner-2.png"
            alt="Promo banner 2"
            fill
            className="object-cover"
          />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-700)]/35 via-[var(--brand-600)]/40 to-transparent" />
        </div>

        <div className="relative z-10 p-8 sm:p-10">
          <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            Today’s Special
          </p>

          <h3 className="mt-4 text-3xl font-extrabold text-white">
            Premium Quality{" "}
        <span className="relative inline-block font-extrabold text-[var(--brand-600)] ">
            <span className="absolute bottom-1 left-0 h-3 w-full bg-[var(--brand-50)]/40 -z-10 "></span>
            Deals
        </span>
          </h3>

          <p className="mt-3 max-w-md text-sm text-white/90">
            Discover hand-picked items with exclusive discounts.
          </p>

          <Link
            href="/brands"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-700)] transition-all duration-300 hover:shadow-md"
          >
            View Brands
          </Link>
        </div>
      </div>
    </section>
  );
}