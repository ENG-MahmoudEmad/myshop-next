import Link from "next/link";
import Image from "next/image";

type SeasonalItem = {
  title: string;
  itemsCount: number;
  badge: string;
  href: string;
  imageUrl: string;
};

const seasonal: SeasonalItem[] = [
  {
    title: "Summer Style Picks",
    itemsCount: 28,
    badge: "Trending Now",
    href: "/search?tag=summer-style",
    imageUrl: "/banners/banner-1.jpeg",
  },
  {
    title: "Back to School Tech",
    itemsCount: 32,
    badge: "Hot Deals",
    href: "/search?tag=back-to-school-tech",
    imageUrl: "/banners/banner-11.png",
  },
  {
    title: "New Season Essentials",
    itemsCount: 24,
    badge: "Just Arrived",
    href: "/search?tag=new-season",
    imageUrl: "/banners/banner-1.jpeg",
  },
];

export default function SeasonalCategoriesSection() {
  return (
    <section className="mt-16 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">
          Seasonal Categories
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {seasonal.map((item, index) => (
          <Link
            key={item.title}
            href={item.href}
            className={`group block ${index === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}
          >
            <div
              className={[
                "relative overflow-hidden rounded-3xl",
                "border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
                "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl",
              ].join(" ")}
            >
              <div className="relative h-44 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />

                <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-600)]/20 via-[var(--brand-600)]/20 to-transparent" />

                <span className="absolute left-4 top-4 rounded-full bg-[var(--brand-600)] px-3 py-1 text-xs font-semibold text-white">
                  {item.badge}
                </span>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="inline-block rounded-2xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md">
                    <h3 className="text-lg font-extrabold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/90">
                      {item.itemsCount} items
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}