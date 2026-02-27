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
  faPen,
  faTrash,
  faCheck,
  faPlus,
  faHouse,
  faBuilding,
  faMapLocationDot,
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

type Address = {
  id: string;
  label: "Home" | "Work" | "Other";
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
};

const addresses: Address[] = [
  {
    id: "a1",
    label: "Home",
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    line1: "221B Baker Street, Apt 12",
    city: "London",
    state: "LDN",
    zip: "NW1",
    country: "United Kingdom",
    isDefault: true,
  },
  {
    id: "a2",
    label: "Work",
    name: "John Doe",
    phone: "+1 (555) 222-9011",
    line1: "12 Office Park, Building B",
    city: "Manchester",
    state: "MAN",
    zip: "M1",
    country: "United Kingdom",
  },
  {
    id: "a3",
    label: "Other",
    name: "John Doe",
    phone: "+1 (555) 777-7788",
    line1: "5 Palm Street",
    city: "Liverpool",
    state: "LIV",
    zip: "L1",
    country: "United Kingdom",
  },
];

function LabelIcon({ label }: { label: Address["label"] }) {
  const icon =
    label === "Home" ? faHouse : label === "Work" ? faBuilding : faMapLocationDot;

  return (
    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)]">
      <FontAwesomeIcon icon={icon} />
    </span>
  );
}

export default function AddressesScreen() {
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
        <span className="text-zinc-700">Addresses</span>
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
          {/* Header */}
          <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--brand-700)]/30 to-[var(--brand-200)]/45" />
            <div className="relative p-6 sm:p-8">
              <h1 className="text-2xl font-extrabold text-zinc-900">
                Addresses
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Manage your delivery addresses for faster checkout.
              </p>
            </div>
          </div>

          {/* Address list */}
          <div className="grid gap-5">
            {addresses.map((a) => (
              <GlassCard
                key={a.id}
                className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <LabelIcon label={a.label} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-extrabold text-zinc-900">
                          {a.label} Address
                        </div>

                        {a.isDefault ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <FontAwesomeIcon icon={faCheck} />
                            Default
                          </span>
                        ) : (
                          <button className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-100)] bg-[var(--brand-50)] px-3 py-1 text-xs font-semibold text-[var(--brand-700)] transition hover:bg-[var(--brand-100)]">
                            <FontAwesomeIcon icon={faPlus} />
                            Set Default
                          </button>
                        )}
                      </div>

                      <div className="mt-2 text-sm font-semibold text-zinc-900">
                        {a.name}{" "}
                        <span className="font-normal text-zinc-500">
                          • {a.phone}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-zinc-600">
                        {a.line1}
                      </div>
                      <div className="mt-1 text-sm text-zinc-600">
                        {a.city}, {a.state} {a.zip} • {a.country}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:pt-1">
                    <button className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]">
                      <FontAwesomeIcon icon={faPen} className="text-zinc-600" />
                      Edit
                    </button>

                    <button
                      className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white/80 text-zinc-700 backdrop-blur transition hover:border-transparent hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
                      aria-label="Delete"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Add New Address Form */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-extrabold text-zinc-900">
                  Add New Address
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Fill the form below to add a new delivery address.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 rounded-full border border-[var(--brand-100)] bg-[var(--brand-50)] px-4 py-2 text-xs font-semibold text-[var(--brand-700)]">
                <FontAwesomeIcon icon={faLocationDot} />
                Shipping ready
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  Full Name
                </span>
                <input
                  placeholder="e.g., John Doe"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  Phone Number
                </span>
                <input
                  placeholder="e.g., +1 (555) 123-4567"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-zinc-700">
                  Address Line
                </span>
                <input
                  placeholder="Street, building, apartment..."
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">City</span>
                <input
                  placeholder="City"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  State / Region
                </span>
                <input
                  placeholder="State / Region"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  ZIP / Postal Code
                </span>
                <input
                  placeholder="ZIP"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  Country
                </span>
                <input
                  placeholder="Country"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-zinc-700">
                  Address Label
                </span>
                <select className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]">
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="flex items-center gap-3 sm:col-span-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--brand-600)]"
                />
                <span className="text-sm text-zinc-700">
                  Set as default delivery address
                </span>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]">
                <FontAwesomeIcon icon={faPlus} />
                Save Address
              </button>

              <button className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]">
                Reset
              </button>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}