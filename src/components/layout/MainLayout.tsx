"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faBars,
  faXmark,
  faUser,
  faRightFromBracket,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import ContextMenu from "@/components/ui/ContextMenu";

import { useAuthToken } from "@/features/auth/hooks/useAuthToken";
import { removeToken } from "@/features/auth/utils/auth-storage";
import { toastError, toastSuccess } from "@/lib/toast";

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
  className = "",
}: {
  href: string;
  label: string;
  children?: React.ReactNode;
  className?: string;
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
        className,
      ].join(" ")}
    >
      {label}
      {children}
    </Link>
  );
}

export default function MainLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const { token, ready } = useAuthToken();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pages that should NOT be wrapped in the 80% container
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/verify-reset-code" ||
    pathname === "/reset-password";

    // 1️⃣ احسب private routes أولًا
    // ✅ global private routes
    const isPrivateRoute = useMemo(() => {
      if (!pathname) return false;
      return (
        pathname.startsWith("/account") ||
        pathname.startsWith("/orders") ||
        pathname === "/wishlist" ||
        pathname === "/checkout"
      );
    }, [pathname]);
    // 2️⃣ بعده احسب shouldBlockPrivate
    const shouldBlockPrivate =
  !isAuthPage && isPrivateRoute && (!ready || !token);


  // ✅ guard (wait for mounted + ready)
  useEffect(() => {
    if (!mounted) return;
    if (!ready) return;
    if (isAuthPage) return;

    if (isPrivateRoute && !token) {
      toastError("Please login first", { autoClose: 3000 });
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [mounted, ready, isPrivateRoute, token, router, isAuthPage]);

  // close profile dropdown on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const el = profileRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // close menus on route change
  useEffect(() => {
    setProfileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    toastSuccess("Logged out successfully", { autoClose: 2000 });
    router.replace("/login");
  };

  // ✅ active styling for account menu items
  const isActive = (href: string) => pathname === href;

  const itemClass = (href: string) =>
    [
      "block px-4 py-3 text-sm transition-all duration-300 ease-out",
      isActive(href)
        ? "bg-[var(--brand-50)] text-[var(--brand-700)] font-semibold"
        : "text-zinc-800 hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)]",
    ].join(" ");

  const mobileItemClass = (href: string) =>
    [
      "block w-full rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300 ease-out",
      isActive(href)
        ? "bg-[var(--brand-50)] text-[var(--brand-700)]"
        : "text-zinc-800 hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)]",
    ].join(" ");

  // ✅ button style matches navbar links
  const accountBtnClass =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-out " +
    "text-zinc-700 hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)] bg-transparent";

  // ✅ dropdown style (white/glassy)
  const dropdownClass = [
    "absolute right-0 mt-4 w-56 overflow-hidden rounded-2xl",
    "bg-white/98 backdrop-blur-md border border-white/60",
    "shadow-[0_18px_60px_rgba(0,0,0,0.12)]",
    "transition-all duration-200",
    profileOpen
      ? "opacity-100 translate-y-0"
      : "pointer-events-none opacity-0 -translate-y-1",
  ].join(" ");

  return (
    <ContextMenu
      items={[
        { type: "item", label: "Back", onClick: () => history.back() },
        { type: "item", label: "Forward", onClick: () => history.forward() },
        { type: "item", label: "Reload", onClick: () => location.reload() },
        { type: "sep" },
        {
          type: "item",
          label: "Print / Save as PDF",
          onClick: () => window.print(),
        },
        {
          type: "item",
          label: "Download Page (HTML)",
          onClick: () => {
            const html = document.documentElement.outerHTML;
            const blob = new Blob([html], { type: "text/html;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${(document.title || "myshop").replaceAll(
              " ",
              "-"
            )}.html`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          },
        },
        { type: "sep" },
        {
          type: "item",
          label: "Copy Page Link",
          onClick: () => navigator.clipboard.writeText(location.href),
        },
        {
          type: "item",
          label: "Copy Page Title",
          onClick: () => navigator.clipboard.writeText(document.title),
        },
        { type: "sep" },
        {
          type: "item",
          label: "View Page Source",
          onClick: () =>
            window.open(
              `view-source:${location.href}`,
              "_blank",
              "noopener,noreferrer"
            ),
        },
        {
          type: "item",
          label: "Developer Tools",
          onClick: () =>
            window.open("/devtools", "_blank", "noopener,noreferrer"),
        },
      ]}
    >
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        {/* Navbar */}
        <header className="sticky top-0 relative z-[9999] backdrop-blur-md bg-white/65 border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
          <div className="mx-auto flex h-16 w-[80%] items-center gap-3">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg font-extrabold tracking-tight text-[var(--brand-700)]"
            >
              MyShop
            </Link>

            {/* Links (desktop) */}
            <nav className="hidden items-center gap-1 lg:flex">
              {nav.map((i) => (
                <NavLink key={i.href} href={i.href} label={i.label} />
              ))}
            </nav>

            {/* Search (desktop) */}
            <div className="hidden flex-1 lg:block">
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
              className="ml-auto lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-zinc-800 backdrop-blur transition-all duration-300 hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)] active:scale-95"
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
            </button>

            {/* Actions (desktop) */}
            <div className="ml-auto hidden items-center gap-2 lg:flex">
              <NavLink href="/wishlist" label="Wishlist" />

              <NavLink href="/cart" label="Cart">
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--brand-600)] px-1 text-xs font-bold text-white">
                  0
                </span>
              </NavLink>

              {/* ✅ Auth switch (hydration-safe) */}
              {!mounted ? (
                <div className="h-10 w-[120px] rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]" />
              ) : !token ? (
                <Link
                  href="/login"
                  className="rounded-full bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95"
                >
                  Login
                </Link>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((v) => !v)}
                    className={accountBtnClass}
                    aria-label="Open profile menu"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>Account</span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="text-xs opacity-70"
                    />
                  </button>

                  <div className={dropdownClass}>
                    <Link href="/account" className={itemClass("/account")}>
                      Account Dashboard
                    </Link>
                    <Link
                      href="/account/details"
                      className={itemClass("/account/details")}
                    >
                      Account Details
                    </Link>
                    <Link
                      href="/account/addresses"
                      className={itemClass("/account/addresses")}
                    >
                      Addresses
                    </Link>

                    <div className="h-px bg-zinc-200/70" />

                    <Link href="/orders" className={itemClass("/orders")}>
                      Orders
                    </Link>
                    <Link href="/wishlist" className={itemClass("/wishlist")}>
                      Wishlist
                    </Link>

                    <div className="h-px bg-zinc-200/70" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50/60 transition-all duration-300"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Panel */}
          <div
            className={[
              "lg:hidden absolute left-0 right-0 top-full z-50",
              "transition-all duration-300 ease-out",
              menuOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none",
            ].join(" ")}
          >
            <div className="relative mx-auto w-[80%] pb-4">
              <div className="mt-3 rounded-2xl border border-white/40 bg-white shadow-lg overflow-hidden">
                {/* ✅ scroll container */}
                <div className="relative max-h-[calc(100vh-96px)] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
                  <div className="grid gap-3 text-base">
                    {/* المحتوى زي ما هو */}
                  {nav.map((i) => (
                    <div key={i.href} onClick={() => setMenuOpen(false)}>
                      <NavLink
                        href={i.href}
                        label={i.label}
                        className="w-full block text-left"
                      />
                    </div>
                  ))}

                  <div className="my-2 h-px bg-zinc-200" />

                  <div onClick={() => setMenuOpen(false)}>
                    <NavLink
                      href="/wishlist"
                      label="Wishlist"
                      className="w-full block text-left"
                    />
                  </div>

                  <div onClick={() => setMenuOpen(false)}>
                    <NavLink
                      href="/cart"
                      label="Cart"
                      className="w-full block text-left"
                    >
                      <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--brand-600)] px-1 text-xs font-bold text-white">
                        0
                      </span>
                    </NavLink>
                  </div>

                  <div className="my-2 h-px bg-zinc-200" />

                  {/* ✅ Mobile Auth switch (hydration-safe) */}
                  {!mounted ? (
                    <div className="h-10 w-full rounded-full bg-white/65 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]" />
                  ) : !token ? (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="mt-1 inline-flex items-center justify-center rounded-full bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] active:scale-95"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMenuOpen(false)}
                        className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-700)] border border-zinc-200 transition-all duration-300 hover:bg-[var(--brand-50)] active:scale-95"
                      >
                        Create account
                      </Link>
                    </>
                  ) : (
                    <div className="grid gap-2">
                      <Link
                        href="/account"
                        onClick={() => setMenuOpen(false)}
                        className={mobileItemClass("/account")}
                      >
                        Account Dashboard
                      </Link>
                      <Link
                        href="/account/details"
                        onClick={() => setMenuOpen(false)}
                        className={mobileItemClass("/account/details")}
                      >
                        Account Details
                      </Link>
                      <Link
                        href="/account/addresses"
                        onClick={() => setMenuOpen(false)}
                        className={mobileItemClass("/account/addresses")}
                      >
                        Addresses
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setMenuOpen(false)}
                        className={mobileItemClass("/orders")}
                      >
                        Orders
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogout();
                        }}
                        className="mt-1 inline-flex items-center justify-center rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all duration-300 hover:bg-red-100 active:scale-95"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        </header>

        {/* Content */}
        {isAuthPage ? (
  <main className="py-0">{children}</main>
) : (
  <main className="mx-auto w-[80%] py-8">
    {shouldBlockPrivate ? (
      <div className="py-10">
        <div className="mx-auto w-full max-w-md rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 text-center">
          <p className="text-sm font-semibold text-zinc-900">Checking session…</p>
          <p className="mt-2 text-sm text-zinc-600">
            You’ll be redirected to login.
          </p>
        </div>
      </div>
    ) : (
      children
    )}
  </main>
)}

        {/* Footer */}
        <footer
          className={[
            "relative border-t border-white/40 bg-[var(--brand-50)]/40 backdrop-blur-md",
            isAuthPage ? "mt-0" : "mt-20",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/40 to-transparent" />

          <div className="relative mx-auto max-w-[85%] px-4 py-10">
            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <h3 className="text-lg font-extrabold text-[var(--brand-700)]">
                  MyStore
                </h3>

                <p className="mt-3 text-[13px] leading-relaxed text-zinc-600">
                  Discover premium quality products with fast delivery and secure
                  checkout.
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

              <div>
                <h4 className="text-sm font-semibold text-zinc-800">Categories</h4>

                <ul className="mt-3 space-y-2 text-[13px] text-zinc-600">
                  <li className="hover:text-[var(--brand-600)] transition">
                    Fruits
                  </li>
                  <li className="hover:text-[var(--brand-600)] transition">
                    Dairy
                  </li>
                  <li className="hover:text-[var(--brand-600)] transition">
                    Bakery
                  </li>
                  <li className="hover:text-[var(--brand-600)] transition">
                    Beverages
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-zinc-800">Contact</h4>

                <ul className="mt-3 space-y-2 text-[13px] text-zinc-600">
                  <li>Email: support@mystore.com</li>
                  <li>Phone: +123 456 789</li>
                  <li>Location: Your City</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t-5 border-white/40 py-5 text-center text-[12px] text-zinc-500">
            © {new Date().getFullYear()} MyStore. All rights reserved.
          </div>
        </footer>
      </div>
    </ContextMenu>
  );
}