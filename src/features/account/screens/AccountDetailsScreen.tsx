"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faBagShopping,
  faHeart,
  faStar,
  faLocationDot,
  faCreditCard,
  faUserPen,
  faRightFromBracket,
  faCloudArrowUp,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md",
        "shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300",
        active
          ? "bg-[var(--brand-50)] text-[var(--brand-700)] shadow-sm"
          : "text-zinc-700 hover:bg-white/70 hover:text-[var(--brand-700)]",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-9 w-9 place-items-center rounded-xl border transition",
          active
            ? "border-[var(--brand-200)] bg-white text-[var(--brand-700)]"
            : "border-white/60 bg-white/60 text-zinc-600",
        ].join(" ")}
      >
        <FontAwesomeIcon icon={icon} />
      </span>
      {label}
    </Link>
  );
}

export default function AccountDetailsScreen() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-zinc-500">
        <Link href="/" className="hover:text-[var(--brand-700)]">
          Home
        </Link>{" "}
        <span className="mx-2">/</span>
        <Link href="/account" className="hover:text-[var(--brand-700)]">
          My Account
        </Link>{" "}
        <span className="mx-2">/</span>
        <span className="text-zinc-700">Account Details</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-3">
        {/* Sidebar */}
        <GlassCard className="h-fit p-5">
          {/* User block */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/50 bg-white/60 p-4">
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)] font-extrabold">
              JD
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-zinc-900">
                John Doe
              </div>
              <div className="line-clamp-1 text-xs text-zinc-600">
                john.doe@example.com
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <SidebarLink href="/account" icon={faGaugeHigh} label="Dashboard" />
            <SidebarLink href="/orders" icon={faBagShopping} label="Orders" />
            <SidebarLink href="/wishlist" icon={faHeart} label="Wishlist" />
            <SidebarLink href="/favorites" icon={faStar} label="Favorites" />
            <SidebarLink
              href="/account/addresses"
              icon={faLocationDot}
              label="Addresses"
            />
            <SidebarLink
              href="/account/payment"
              icon={faCreditCard}
              label="Payment Methods"
            />
            <SidebarLink
              href="/account/details"
              icon={faUserPen}
              label="Account Details"
            />

            <div className="my-3 h-px bg-white/60" />

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-red-50 hover:text-red-600">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/60 bg-white/60">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </span>
              Logout
            </button>
          </div>
        </GlassCard>

        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <GlassCard className="p-6">
            <h1 className="text-2xl font-extrabold text-zinc-900">
              Account Details
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Manage your profile information and password.
            </p>
          </GlassCard>

          {/* Profile picture */}
          <GlassCard className="p-6">
            <h2 className="text-sm font-extrabold text-zinc-900">
              Profile Picture
            </h2>

            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/60 bg-white">
                <Image
                  src="/avatars/user.png"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-1 right-1 grid h-7 w-7 place-items-center rounded-full bg-[var(--brand-600)] text-white shadow-md">
                  <FontAwesomeIcon icon={faUserPen} className="text-xs" />
                </div>
              </div>

              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-900">
                  Upload a new profile picture
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  JPG, PNG. Max size 2MB
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-md active:scale-[0.98]">
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                    Upload New
                  </button>

                  <button className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]">
                    <FontAwesomeIcon icon={faTrash} className="text-zinc-600" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Personal Information */}
          <GlassCard className="p-6">
            <h2 className="text-sm font-extrabold text-zinc-900">
              Personal Information
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  First Name
                </span>
                <input
                  defaultValue="John"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  Last Name
                </span>
                <input
                  defaultValue="Doe"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-zinc-700">
                  Email Address
                </span>
                <input
                  defaultValue="john.doe@example.com"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  Phone Number
                </span>
                <input
                  defaultValue="+1 (555) 123-4567"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  Date of Birth
                </span>
                <input
                  defaultValue="05/15/1990"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center justify-center rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]">
                Save Changes
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]">
                Cancel
              </button>
            </div>
          </GlassCard>

          {/* Change Password */}
          <GlassCard className="p-6">
            <h2 className="text-sm font-extrabold text-zinc-900">
              Change Password
            </h2>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  Current Password
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  New Password
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>
            </div>

            <div className="mt-6">
              <button className="inline-flex items-center justify-center rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]">
                Update Password
              </button>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}