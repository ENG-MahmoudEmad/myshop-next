"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type Props = { children: ReactNode };

const nav = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/search", label: "Search" },
];

function NavLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  

  return (
    <Link
      href={href}
      className={[
        "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-out",
        active
          ? "bg-[var(--brand-50)] text-[var(--brand-700)]"
          : "text-zinc-700 hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)]",
      ].join(" ")}
    >
      {label}
      {children}
    </Link>
  );
}

export default function MainLayout({ children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 relative backdrop-blur-md bg-white/65 border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">        <div className="mx-auto flex h-16 w-[80%] items-center gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight text-[var(--brand-700)]"
          >
            MyShop
          </Link>

          {/* Links (desktop) */}
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((i) => (
              <NavLink key={i.href} href={i.href} label={i.label} />
            ))}
          </nav>

          {/* Search (desktop) */}
          <div className="hidden flex-1 md:block">
            <div className="relative mx-auto max-w-md">
              <input
                placeholder="Search products..."
                className="w-full rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-auto md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-zinc-800 backdrop-blur transition-all duration-300 hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)] active:scale-95"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
          </button>

          {/* Actions */}
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <NavLink href="/wishlist" label="Wishlist" />

            <NavLink href="/cart" label="Cart">
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--brand-600)] px-1 text-xs font-bold text-white">
                0
              </span>
            </NavLink>

            <Link
              href="/login"
                className="rounded-full bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95"            >
              Login
            </Link>
          </div>
        </div>
        {/* Mobile Menu Panel */}
        <div
  className={[
    "md:hidden absolute left-0 right-0 top-full z-50",
    "transition-all duration-300 ease-out",
    menuOpen
      ? "opacity-100 translate-y-0 pointer-events-auto"
      : "opacity-0 -translate-y-2 pointer-events-none",
  ].join(" ")}
>
  {/* Glass Full Width Layer */}
<div className="absolute inset-0 bg-white/65 border-b border-white/20  backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)]" />  {/* Content Wrapper */}
  <div className="relative mx-auto w-[80%] pb-4">
    <div className="mt-3 rounded-2xl border border-white/40 bg-white p-4 shadow-lg">
      <div className="grid gap-4 text-base">
        {nav.map((i) => (
          <div key={i.href} onClick={() => setMenuOpen(false)}>
            <NavLink href={i.href} label={i.label} />
          </div>
        ))}

        <div className="my-2 h-px bg-zinc-200" />

        <div onClick={() => setMenuOpen(false)}>
          <NavLink href="/wishlist" label="Wishlist" />
        </div>

        <div onClick={() => setMenuOpen(false)}>
          <NavLink href="/cart" label="Cart">
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--brand-600)] px-1 text-xs font-bold text-white">
              0
            </span>
          </NavLink>
        </div>

        <Link
          href="/login"
          onClick={() => setMenuOpen(false)}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] active:scale-95"
        >
          Login
        </Link>
      </div>
    </div>
  </div>
</div>
      </header>

      {/* Content */}
      <main className="mx-auto w-[80%] py-8">{children}</main>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-white/40 bg-[var(--brand-50)]/40 backdrop-blur-md">

  {/* Subtle Top Fade */}
  <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/40 to-transparent" />

  <div className="relative mx-auto max-w-[85%] px-4 py-10">

    {/* Top Grid */}
    <div className="grid gap-6 md:grid-cols-4">

      {/* Brand */}
      <div>
        <h3 className="text-lg font-extrabold text-[var(--brand-700)]">
          MyStore
        </h3>

        <p className="mt-3 text-[13px] leading-relaxed text-zinc-600">
          Discover premium quality products with fast delivery and secure checkout.
        </p>

        <div className="mt-5 flex gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm transition hover:bg-[var(--brand-600)] hover:text-white">
            <FontAwesomeIcon icon={faFacebookF} className="text-xs" />
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm transition hover:bg-[var(--brand-600)] hover:text-white">
            <FontAwesomeIcon icon={faInstagram} className="text-xs" />
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm transition hover:bg-[var(--brand-600)] hover:text-white">
            <FontAwesomeIcon icon={faTwitter} className="text-xs" />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-sm font-semibold text-zinc-800">
          Quick Links
        </h4>

        <ul className="mt-3 space-y-2 text-[13px] text-zinc-600">
          <li className="hover:text-[var(--brand-600)] transition">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-[var(--brand-600)] transition">
            <Link href="/categories">Categories</Link>
          </li>
          <li className="hover:text-[var(--brand-600)] transition">
            <Link href="/brands">Brands</Link>
          </li>
          <li className="hover:text-[var(--brand-600)] transition">
            <Link href="/cart">Cart</Link>
          </li>
        </ul>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-semibold text-zinc-800">
          Categories
        </h4>

        <ul className="mt-3 space-y-2 text-[13px] text-zinc-600">
          <li className="hover:text-[var(--brand-600)] transition">Fruits</li>
          <li className="hover:text-[var(--brand-600)] transition">Dairy</li>
          <li className="hover:text-[var(--brand-600)] transition">Bakery</li>
          <li className="hover:text-[var(--brand-600)] transition">Beverages</li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 className="text-sm font-semibold text-zinc-800">
          Contact
        </h4>

        <ul className="mt-3 space-y-2 text-[13px] text-zinc-600">
          <li>Email: support@mystore.com</li>
          <li>Phone: +123 456 789</li>
          <li>Location: Your City</li>
        </ul>
      </div>

    </div>


  </div>
    {/* Bottom */}
    <div className="border-t-5  border-white/40 py-5 text-center text-[12px] text-zinc-500">
      © {new Date().getFullYear()} MyStore. All rights reserved.
    </div>
</footer>
    </div>
  );
}