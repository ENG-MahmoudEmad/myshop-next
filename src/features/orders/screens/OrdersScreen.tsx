"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTruck,
  faBoxOpen,
  faGaugeHigh,
  faBagShopping,
  faHeart,
  faLocationDot,
  faUserPen,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import { useOrders } from "../hooks/useOrders";
import { removeToken } from "@/features/auth/utils/auth-storage";
import {
  getLoggedInUserName,
  getUserInitials,
} from "@/features/auth/utils/auth-user";

type OrderStatus = "Delivered" | "Processing" | "Canceled";

function formatEGP(value: number) {
  return `${value.toFixed(2)} EGP`;
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function normalizeOrderStatus(order: any): OrderStatus {
  if (order?.isDelivered) return "Delivered";
  if (order?.isPaid === false && order?.isDelivered === false) return "Processing";
  return "Processing";
}

function getAddressLabel(order: any) {
  const city = order?.shippingAddress?.city;
  const details = order?.shippingAddress?.details;

  if (city && details) return `${city} • ${details}`;
  return city || details || "Saved Address";
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map = {
    Delivered: "bg-[var(--brand-100)] text-[var(--brand-700)]",
    Processing: "bg-blue-100 text-blue-700",
    Canceled: "bg-red-100 text-red-600",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${map[status]}`}>
      {status}
    </span>
  );
}

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

export default function OrdersScreen() {
  const router = useRouter();
  const { data, isLoading, isError } = useOrders();

  const [statusFilter, setStatusFilter] = useState("All Orders");
  const [search, setSearch] = useState("");

  const userName = getLoggedInUserName();
  const userInitials = getUserInitials(userName);

  const orders = useMemo(() => {
    const raw = Array.isArray(data) ? data : [];
    return raw.map((order: any) => {
      const status = normalizeOrderStatus(order);

      return {
        id: order?._id,
        date: formatDate(order?.createdAt),
        status,
        total: Number(order?.totalOrderPrice ?? 0),
        itemsCount: Array.isArray(order?.cartItems) ? order.cartItems.length : 0,
        address: getAddressLabel(order),
      };
    });
  }, [data]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        statusFilter === "All Orders" ? true : order.status === statusFilter;

      const q = search.trim().toLowerCase();
      const matchSearch = q
        ? order.id?.toLowerCase().includes(q) || order.address.toLowerCase().includes(q)
        : true;

      return matchStatus && matchSearch;
    });
  }, [orders, search, statusFilter]);

  const handleLogout = () => {
    removeToken();
    toast.success("Logged out successfully.");
    router.push("/login");
  };

  return (
    <section className="grid gap-8 lg:grid-cols-3">
      <GlassCard className="h-fit p-5">
        <div className="flex items-center gap-4 rounded-2xl border border-white/50 bg-white/60 p-4">
          <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-[var(--brand-50)] font-extrabold text-[var(--brand-700)]">
            {userInitials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-zinc-900">My Account</div>
            <div className="line-clamp-1 text-xs text-zinc-600">
              Track and manage your orders
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <SidebarLink href="/account" icon={faGaugeHigh} label="Dashboard" />
          <SidebarLink href="/orders" icon={faBagShopping} label="Orders" />
          <SidebarLink href="/wishlist" icon={faHeart} label="Wishlist" />
          <SidebarLink href="/account/addresses" icon={faLocationDot} label="Addresses" />
          <SidebarLink href="/account/details" icon={faUserPen} label="Account Details" />

          <div className="my-3 h-px bg-white/60" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/60 bg-white/60">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </span>
            Logout
          </button>
        </div>
      </GlassCard>

      <div className="space-y-5 lg:col-span-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold text-zinc-900">My Orders</h1>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm focus:border-[var(--brand-300)] focus:ring-4 focus:ring-[var(--brand-50)]"
            >
              <option>All Orders</option>
              <option>Delivered</option>
              <option>Processing</option>
              <option>Canceled</option>
            </select>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm focus:border-[var(--brand-300)] focus:ring-4 focus:ring-[var(--brand-50)]"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm">
            Loading your orders...
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-red-100 bg-red-50/70 p-6 text-sm text-red-700">
            Failed to load your orders.
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
              <FontAwesomeIcon icon={faBoxOpen} className="text-2xl" />
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-zinc-900">No orders found</h2>
            <p className="mt-2 text-sm text-zinc-600">
              You haven’t placed any orders yet, or nothing matches your filter.
            </p>
            <Link
              href="/search"
              className="mt-5 inline-flex rounded-full bg-[var(--brand-600)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-700)]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-zinc-200 bg-white px-5 py-5 shadow-sm transition-all duration-300 hover:shadow-md sm:px-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-xl font-extrabold text-zinc-900 sm:text-2xl">
                        Order #{order.id?.slice(-8).toUpperCase()}
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="mt-2 text-sm text-zinc-500">
                      Placed on {order.date}
                    </div>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 transition hover:text-[var(--brand-700)]"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    View Details
                  </Link>
                </div>

                <div className="grid gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4 sm:grid-cols-2 xl:grid-cols-[120px_170px_minmax(220px,1fr)_160px] xl:items-center">
                  <div className="min-w-0">
                    <div className="text-xs text-zinc-500">Items</div>
                    <div className="mt-1 text-base font-bold text-zinc-900">
                      {order.itemsCount} item{order.itemsCount === 1 ? "" : "s"}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs text-zinc-500">Total</div>
                    <div className="mt-1 text-base font-bold text-zinc-900">
                      {formatEGP(order.total)}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs text-zinc-500">Delivered to</div>
                    <div className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-900 sm:text-base">
                      {order.address}
                    </div>
                  </div>

                  <div className="xl:justify-self-end">
                    {order.status !== "Canceled" ? (
                      <button
                        type="button"
                        className="inline-flex w-full items-center justify-center rounded-full bg-[var(--brand-600)] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98] xl:w-auto"
                      >
                        <FontAwesomeIcon icon={faTruck} className="mr-2" />
                        Track Order
                      </button>
                    ) : (
                      <div className="w-full rounded-full border border-red-100 bg-red-50 px-4 py-2.5 text-center text-sm font-semibold text-red-600 xl:w-auto">
                        Order Canceled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}