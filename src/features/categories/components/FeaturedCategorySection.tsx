import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

type FeaturedCategory = {
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  href: string;
  imageUrl: string;
};

const featured: FeaturedCategory = {
  subtitle: "Featured Category",
  title: "Smart Devices & Everyday Tech",
  description:
    "Discover trending electronics, practical gadgets, and modern essentials curated for your daily lifestyle.",
  bullets: [
    "Top-rated smart devices",
    "Everyday tech essentials",
    "New arrivals from trusted brands",
  ],
  ctaLabel: "Explore Category",
  href: "/search?category=electronics",
  imageUrl: "/banners/banner-1.jpeg",
};

export default function FeaturedCategorySection() {
  return (
    <section className="mt-16">
      <div
        className={[
          "grid gap-8 rounded-3xl p-6 md:p-8 lg:grid-cols-2 lg:items-center",
          "bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
        ].join(" ")}
      >
        <div className="space-y-5">
          <span className="inline-flex items-center rounded-full bg-[var(--brand-50)] px-3 py-1 text-xs font-semibold text-[var(--brand-700)]">
            {featured.subtitle}
          </span>

          <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            {featured.title}
          </h3>

          <p className="text-sm leading-6 text-zinc-600">
            {featured.description}
          </p>

          <ul className="space-y-2">
            {featured.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-sm text-zinc-700"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
                  <Check size={14} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <Link
              href={featured.href}
              className={[
                "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white",
                "bg-[var(--brand-600)] transition-all duration-300 ease-out",
                "hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95",
              ].join(" ")}
            >
              {featured.ctaLabel}
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={featured.imageUrl}
              alt={featured.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-600)]/25 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
