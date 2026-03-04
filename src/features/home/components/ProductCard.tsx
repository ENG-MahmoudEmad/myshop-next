import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

type Props = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  tag?: string;
  image: string;
  rating?: number;
};

export default function ProductCard({
  id,
  name,
  price,
  oldPrice,
  tag,
  image,
  rating,
}: Props) {
  const discount =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  const fullStars = rating != null ? Math.floor(rating) : 0;

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        {discount ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--brand-600)] px-3 py-1 text-xs font-bold text-white shadow-sm">
            -{discount}%
          </span>
        ) : null}

        {tag ? (
          <span className="absolute left-3 top-12 z-10 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white shadow-sm">
            {tag}
          </span>
        ) : null}

        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-zinc-50 to-white">
          {/* Wishlist Button (UI only for now) */}
          <button
            type="button"
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-zinc-700 backdrop-blur transition-all duration-300 hover:bg-[var(--brand-600)] hover:text-white hover:scale-110 active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <FontAwesomeIcon icon={faHeart} style={{ width: 18, height: 18 }} />
          </button>

          <Link href={`/product/${id}`} className="block h-full w-full">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.06]"
            />

            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/30" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-[var(--brand-700)] shadow-md transition hover:scale-105 active:scale-95">
                Quick View
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className="p-5">
        <Link href={`/product/${id}`}>
          <h3 className="line-clamp-1 text-sm font-semibold text-zinc-900 transition hover:text-[var(--brand-700)]">
            {name}
          </h3>

          {rating != null ? (
            <div className="mt-2 flex items-center gap-1 text-[var(--brand-600)]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm leading-none">
                  {i < fullStars ? "★" : "☆"}
                </span>
              ))}
              <span className="ml-2 text-xs text-zinc-500">
                {rating.toFixed(1)}
              </span>
            </div>
          ) : null}
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-[var(--brand-700)]">
            ${price.toFixed(2)}
          </span>
          {oldPrice ? (
            <span className="text-sm text-zinc-500 line-through">
              ${oldPrice.toFixed(2)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-full bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-md active:scale-[0.98]"
          onClick={() => {}}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}