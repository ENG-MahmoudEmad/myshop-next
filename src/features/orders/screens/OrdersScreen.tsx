"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faRotate,
  faTruck,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

type Order = {
  id: string;
  date: string;
  status: "Delivered" | "Processing" | "Canceled";
  total: number;
  items: number;
  address: string;
  images: string[];
};

const orders: Order[] = [
  {
    id: "FC9584",
    date: "June 15, 2023",
    status: "Delivered",
    total: 32.97,
    items: 4,
    address: "Home Address",
    images: ["/products/p3.png", "/products/p1.png", "/products/p2.png"],
  },
  {
    id: "FC9473",
    date: "June 10, 2023",
    status: "Processing",
    total: 18.96,
    items: 2,
    address: "Office Address",
    images: ["/products/p4.png", "/products/p2.png"],
  },
  {
    id: "FC9241",
    date: "May 15, 2023",
    status: "Canceled",
    total: 7.57,
    items: 3,
    address: "Home Address",
    images: ["/products/p3.png", "/products/p4.png"],
  },
];

function StatusBadge({ status }: { status: Order["status"] }) {
  const map = {
    Delivered: "bg-[var(--brand-100)] text-[var(--brand-700)]",
    Processing: "bg-blue-100 text-blue-700",
    Canceled: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${map[status]}`}
    >
      {status}
    </span>
  );
}

export default function OrdersScreen() {
  return (
    <div className="grid gap-8 lg:grid-cols-4">
      {/* Sidebar */}
      <aside className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 h-fit">
        <div className="mb-6">
          <div className="text-lg font-extrabold text-zinc-900">John Doe</div>
          <div className="text-sm text-zinc-500">john.doe@example.com</div>
        </div>

        <nav className="space-y-2 text-sm">
          {["Dashboard", "Orders", "Wishlist", "Addresses", "Account Details"].map(
            (item) => (
              <div
                key={item}
                className={`rounded-2xl px-4 py-3 cursor-pointer transition ${
                  item === "Orders"
                    ? "bg-[var(--brand-50)] text-[var(--brand-700)] font-semibold"
                    : "hover:bg-zinc-100 text-zinc-700"
                }`}
              >
                {item}
              </div>
            )
          )}
        </nav>
      </aside>

      {/* Orders Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold text-zinc-900">My Orders</h1>

          <div className="flex gap-3">
            <select className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm focus:ring-4 focus:ring-[var(--brand-50)] focus:border-[var(--brand-300)]">
              <option>All Orders</option>
              <option>Delivered</option>
              <option>Processing</option>
              <option>Canceled</option>
            </select>

            <input
              placeholder="Search orders..."
              className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm focus:ring-4 focus:ring-[var(--brand-50)] focus:border-[var(--brand-300)]"
            />
          </div>
        </div>

        {/* Orders List */}
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-zinc-900">
                    Order #{order.id}
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="text-sm text-zinc-500 mt-1">
                  Placed on {order.date}
                </div>
              </div>

              <div className="flex gap-3 text-sm">
                <button className="flex items-center gap-2 text-[var(--brand-700)] hover:underline">
                  <FontAwesomeIcon icon={faRotate} />
                  Reorder
                </button>

                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center gap-2 text-zinc-700 hover:underline"
                >
                  <FontAwesomeIcon icon={faEye} />
                  View Details
                </Link>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* Images */}
              <div className="flex items-center gap-3">
                {order.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative h-14 w-14 rounded-xl overflow-hidden bg-zinc-100"
                  >
                    <Image
                      src={img}
                      alt="product"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-6 text-sm text-zinc-700">
                <div>
                  <div className="text-xs text-zinc-500">Items</div>
                  <div className="font-semibold">{order.items} items</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Total</div>
                  <div className="font-semibold">
                    ${order.total.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Delivered to</div>
                  <div className="font-semibold">{order.address}</div>
                </div>
              </div>

              {/* Track Button */}
              {order.status !== "Canceled" && (
                <button className="rounded-full bg-[var(--brand-600)] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]">
                  <FontAwesomeIcon icon={faTruck} className="mr-2" />
                  Track Order
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-end gap-2">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`h-10 w-10 rounded-xl border ${
                page === 1
                  ? "bg-[var(--brand-600)] text-white border-[var(--brand-600)]"
                  : "bg-white border-zinc-200 hover:bg-[var(--brand-50)]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}