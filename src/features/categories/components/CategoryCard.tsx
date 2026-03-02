import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  itemsCount: number;
  imageUrl: string;
  tags: string[];
  href: string;
};

export default function CategoryCard({
  title,
  itemsCount,
  imageUrl,
  tags,
  href,
}: Props) {
  return (
    <Link
      href={href}
      className={[
        "group relative overflow-hidden rounded-3xl",
        "bg-white/65 backdrop-blur-md border border-white/20",
        "shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-xl",
      ].join(" ")}
    >
      {/* Media (image + overlay scale together) */}
      <div className="relative h-40 w-full overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />

          {/* Softer Brand Overlay */}
          <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(191,54,12,0.45), rgba(216,67,21,0.12), rgba(255,171,145,0.05))",
              }}
            />
          </div>

        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-extrabold text-white drop-shadow">
            {title}
          </h3>
          <p className="mt-1 text-xs text-white/85 drop-shadow">
            {itemsCount} items
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold",
                "bg-[var(--brand-50)]/70 text-[var(--brand-700)]",
                "backdrop-blur-md border border-white/30",
              ].join(" ")}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Arrow (brand) */}
        <div
          className={[
            "grid h-9 w-9 place-items-center rounded-full",
            "bg-[var(--brand-50)]/70 backdrop-blur-md border border-white/30",
            "transition-all duration-300 ease-out",
            "group-hover:bg-[var(--brand-100)]/70",
          ].join(" ")}
        >
          <ArrowRight
            size={16}
            className="text-[var(--brand-700)] transition-transform duration-300 ease-out group-hover:translate-x-1"
          />
        </div>
      </div>

      {/* Brand glow hover */}
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-40 w-40 rounded-full bg-[var(--brand-100)]/0 blur-3xl transition-all duration-500 group-hover:bg-[var(--brand-100)]/35" />
    </Link>
  );
}