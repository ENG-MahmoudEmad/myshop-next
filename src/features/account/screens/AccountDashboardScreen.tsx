"use client";

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
  faArrowRight,
  faReceipt,
  faTruckFast,
  faCalendarDays,
  faCircleCheck,
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

function StatCard({
  title,
  value,
  icon,
  hint,
}: {
  title: string;
  value: string;
  icon: any;
  hint: string;
}) {
  return (
    <GlassCard className="p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)]">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-zinc-600">{title}</div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900">
            {value}
          </div>
          <div className="mt-1 text-xs text-zinc-500">{hint}</div>
        </div>
      </div>
    </GlassCard>
  );
}

const recentOrders = [
  {
    id: "ODR-1041",
    date: "Feb 26, 2026",
    total: 84.25,
    items: 4,
    status: "Delivered",
    statusIcon: faCircleCheck,
    statusClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    id: "ODR-1034",
    date: "Feb 21, 2026",
    total: 42.0,
    items: 2,
    status: "Out for delivery",
    statusIcon: faTruckFast,
    statusClass: "bg-[var(--brand-50)] text-[var(--brand-700)] border-[var(--brand-100)]",
  },
  {
    id: "ODR-1027",
    date: "Feb 15, 2026",
    total: 129.99,
    items: 6,
    status: "Processing",
    statusIcon: faReceipt,
    statusClass: "bg-zinc-50 text-zinc-700 border-zinc-200",
  },
];

export default function AccountDashboardScreen() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-zinc-500">
        <Link href="/" className="hover:text-[var(--brand-700)]">
          Home
        </Link>{" "}
        <span className="mx-2">/</span>
        <span className="text-zinc-700">My Account</span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--brand-700)]/30 to-[var(--brand-200)]/45" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--brand-600)]/33 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-[var(--brand-600)]/3 blur-3xl" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/20 px-3 py-1 text-xs font-semibold text-[var(--brand-700)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-600)]" />
                Account Center
              </div>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900">
                Welcome back, John 👋
              </h1>
              <p className="mt-2 max-w-xl text-sm text-zinc-600">
                Track your orders, manage your wishlist, and update your profile
                — all in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]"
              >
                View Orders
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>

              <Link
                href="/account/details"
                className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-5 py-2.5 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]"
              >
                Edit Profile
                <FontAwesomeIcon icon={faUserPen} className="text-zinc-700" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-3">
        {/* Sidebar */}
        <GlassCard className="h-fit p-5">
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
          {/* Stats */}
          <div className="grid gap-5 sm:grid-cols-2">
            <StatCard
              title="Total Orders"
              value="18"
              icon={faBagShopping}
              hint="2 orders in the last 30 days"
            />
            <StatCard
              title="Wishlist Items"
              value="12"
              icon={faHeart}
              hint="Saved for later checkout"
            />
            <StatCard
              title="Total Spent"
              value="$1,248.50"
              icon={faReceipt}
              hint="Lifetime purchases"
            />
            <StatCard
              title="Member Since"
              value="2025"
              icon={faCalendarDays}
              hint="Premium customer benefits"
            />
          </div>

          {/* Recent Orders */}
          <GlassCard className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/40 px-6 py-5">
              <div>
                <h2 className="text-sm font-extrabold text-zinc-900">
                  Recent Orders
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Quick preview of your latest activity.
                </p>
              </div>

              <Link
                href="/orders"
                className="text-sm font-semibold text-[var(--brand-700)] hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="divide-y divide-white/50">
              {recentOrders.map((o) => (
                <div
                  key={o.id}
                  className="group px-6 py-5 transition hover:bg-white/60"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href="/orders"
                          className="text-sm font-extrabold text-zinc-900 group-hover:text-[var(--brand-700)]"
                        >
                          {o.id}
                        </Link>

                        <span
                          className={[
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                            o.statusClass,
                          ].join(" ")}
                        >
                          <FontAwesomeIcon icon={o.statusIcon} />
                          {o.status}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-zinc-500">
                        {o.items} items • {o.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-lg font-extrabold text-zinc-900">
                        ${o.total.toFixed(2)}
                      </div>

                      <Link
                        href="/orders"
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]"
                      >
                        Details
                        <FontAwesomeIcon icon={faArrowRight} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <div className="grid gap-5 sm:grid-cols-2">
            <GlassCard className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
              <div className="text-sm font-extrabold text-zinc-900">
                Quick Actions
              </div>
              <p className="mt-2 text-sm text-zinc-600">
                Jump to common tasks in one click.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/account/details"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-md active:scale-[0.98]"
                >
                  Edit Profile <FontAwesomeIcon icon={faUserPen} />
                </Link>

                <Link
                  href="/wishlist"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-5 py-2 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]"
                >
                  Wishlist <FontAwesomeIcon icon={faHeart} className="text-[var(--brand-700)]" />
                </Link>
              </div>
            </GlassCard>

            <GlassCard className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
              <div className="text-sm font-extrabold text-zinc-900">
                Tips & Benefits
              </div>
              <p className="mt-2 text-sm text-zinc-600">
                Keep your profile updated to get faster checkout and order
                tracking.
              </p>

              <div className="mt-5 rounded-2xl border border-white/50 bg-white/60 p-4 text-sm text-zinc-700">
                <span className="font-semibold text-[var(--brand-700)]">
                  Pro tip:
                </span>{" "}
                Add a delivery address and phone number so our couriers can reach
                you quickly.
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
}