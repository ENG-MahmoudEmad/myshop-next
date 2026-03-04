import Image from "next/image";
import Link from "next/link";

function GlassButton({
  href,
  children,
  variant = "glass",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "glass" | "white";
}) {
  const base =
    "inline-flex cursor-pointer items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-[0.98]";

  const styles =
    variant === "white"
      ? "bg-white text-[var(--brand-700)] hover:shadow-md"
      : "border border-white/35 bg-white/15 text-white backdrop-blur-md hover:bg-white/20 hover:shadow-[0_12px_35px_rgba(0,0,0,0.18)]";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

export default function PromoBanners() {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {/* Banner 1 */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="absolute inset-0">
          <Image
            src="/banners/banner-1.jpeg"
            alt="Promo banner 1"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-700)]/40 via-[var(--brand-600)]/45 to-transparent" />
        </div>

        {/* ✅ Fixed height + fixed content spacing */}
        <div className="relative z-10 flex h-[320px] flex-col p-7 sm:h-[340px] sm:p-10">
          <p className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            Limited Offer
          </p>

          {/* ✅ Title gets a fixed space (no button jump) */}
          <h3 className="mt-4 text-[26px] font-extrabold leading-tight text-white sm:text-3xl min-h-[92px] sm:min-h-[104px] max-w-[520px]">
            Up to{" "}
            <span className="relative inline-block font-extrabold text-[var(--brand-100)]">
              <span className="absolute bottom-1 left-0 -z-10 h-3 w-full bg-[var(--brand-600)]/40" />
              50% OFF
            </span>{" "}
            on Style & Tech Picks
          </h3>

          {/* ✅ Description fixed space */}
          <p className="mt-3 max-w-md text-sm text-white/90 line-clamp-2 min-h-[40px]">
            Upgrade your look and gadgets with limited-time offers.
          </p>

          {/* ✅ CTA pinned to bottom (same alignment in both banners) */}
          <div className="mt-auto pt-6">
            <GlassButton href="/search" variant="glass">
              Shop Now
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Banner 2 */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="absolute inset-0">
          <Image
            src="/banners/banner-11.png"
            alt="Promo banner 2"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-700)]/40 via-[var(--brand-600)]/45 to-transparent" />
        </div>

        <div className="relative z-10 flex h-[320px] flex-col p-7 sm:h-[340px] sm:p-10">
          <p className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            Today’s Special
          </p>

          {/* ✅ Title longer, but same reserved space */}
          <h3 className="mt-4 text-[26px] font-extrabold leading-tight text-white sm:text-3xl min-h-[92px] sm:min-h-[104px] max-w-[520px]">
            Premium Quality{" "}
            <span className="relative inline-block font-extrabold text-[var(--brand-100)]">
              <span className="absolute bottom-1 left-0 -z-10 h-3 w-full bg-[var(--brand-600)]/40" />
              Deals
            </span>{" "}
            for Apparel & Electronics
          </h3>

          <p className="mt-3 max-w-md text-sm text-white/90 line-clamp-2 min-h-[40px]">
            Discover hand-picked apparel, accessories, and electronics with
            exclusive offers.
          </p>

          <div className="mt-auto pt-6">
            {/* ✅ White glassy button variant */}
            <GlassButton href="/brands" variant="white">
              View Brands
            </GlassButton>
          </div>
        </div>
      </div>
    </section>
  );
}