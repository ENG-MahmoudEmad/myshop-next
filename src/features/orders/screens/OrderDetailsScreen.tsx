"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBox,
  faCheck,
  faCircleCheck,
  faDownload,
  faLocationDot,
  faMoneyBill,
  faReceipt,
  faRotate,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";

type Props = { id: string };

type Status = "Delivered" | "Processing" | "Canceled";

const mock = {
  id: "FC9584",
  status: "Delivered" as Status,
  date: "June 15, 2023",
  address: {
    name: "John Doe",
    line1: "12 Street Name",
    city: "Cairo",
    zip: "12345",
    phone: "+20 100 000 0000",
  },
  payment: {
    method: "Online Payment",
    paid: true,
  },
  items: [
    { id: "202", name: "Organic Fresh Apples", price: 3.99, qty: 2, image: "/products/p3.png" },
    { id: "301", name: "Organic Whole Milk", price: 4.29, qty: 1, image: "/products/p1.png" },
    { id: "302", name: "Artisan Sourdough Bread", price: 3.99, qty: 1, image: "/products/p2.png" },
  ],
  discount: 3.25,
  shipping: 0,
  tax: 1.04,
};

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
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

function Tracking() {
  const steps = [
    { label: "Order Placed", icon: faReceipt },
    { label: "Packed", icon: faBox },
    { label: "Out for delivery", icon: faTruckFast },
    { label: "Delivered", icon: faCircleCheck },
  ];

  // مثال: الطلب وصل Delivered
  const currentStepIndex = 3; 
  // 0 = Order Placed
  // 1 = Packed
  // 2 = Out for delivery
  // 3 = Delivered

  return (
    <div className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6">
      <div className="text-sm font-extrabold text-zinc-900">
        Order Tracking
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.label} className="flex flex-col items-center text-center">
              
              {/* Icon Box */}
              <div
                className={[
                  "grid h-14 w-14 place-items-center rounded-2xl border transition-all duration-300",
                  isCompleted
                    ? "border-[var(--brand-300)] bg-[var(--brand-100)] text-[var(--brand-700)]"
                    : isCurrent
                    ? "border-[var(--brand-600)] bg-[var(--brand-600)] text-white shadow-[0_8px_24px_rgba(216,67,21,0.25)]"
                    : "border-zinc-200 bg-white text-zinc-400",
                ].join(" ")}
              >
                <FontAwesomeIcon icon={step.icon} />
              </div>

              {/* Label */}
              <div className="mt-3 text-sm font-semibold text-zinc-900">
                {step.label}
              </div>

              <div className="text-xs text-zinc-500 mt-1">
                {isCompleted
                  ? "Completed"
                  : isCurrent
                  ? "In progress"
                  : "Pending"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderDetailsScreen({ id }: Props) {
  const order = { ...mock, id: id || mock.id };

  const subtotal = order.items.reduce((s, it) => s + it.price * it.qty, 0);
  const total = subtotal - order.discount + order.tax + order.shipping;

  return (
    <div className="space-y-8">
      {/* Breadcrumb + back */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-zinc-500">
          <Link className="hover:text-[var(--brand-700)]" href="/">Home</Link>
          <span className="mx-2">/</span>
          <Link className="hover:text-[var(--brand-700)]" href="/orders">Orders</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-700">Order #{order.id}</span>
        </div>

        <Link
          href="/orders"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 backdrop-blur px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:shadow-md active:scale-[0.98]"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Orders
        </Link>
      </div>

      {/* Header */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-zinc-900">Order #{order.id}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-2 text-sm text-zinc-600">Placed on {order.date}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-4 py-2 text-sm font-semibold text-[var(--brand-700)] transition hover:bg-[var(--brand-100)]">
              <FontAwesomeIcon icon={faRotate} />
              Reorder
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:shadow-md">
              <FontAwesomeIcon icon={faDownload} />
              Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Tracking */}
      <Tracking />

      {/* Main grid */}
      <section className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-zinc-200 px-6 py-5">
              <div className="text-sm font-extrabold text-zinc-900">Items</div>
              <div className="mt-1 text-xs text-zinc-500">{order.items.length} products</div>
            </div>

            <div className="divide-y divide-zinc-200">
              {order.items.map((it) => (
                <div key={it.id} className="px-6 py-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Link href={`/product/${it.id}`} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-zinc-50">
                        <Image src={it.image} alt={it.name} fill className="object-cover" />
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-zinc-900 hover:text-[var(--brand-700)]">
                          {it.name}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">Qty: {it.qty}</div>
                      </div>
                    </Link>

                    <div className="sm:ml-auto text-right">
                      <div className="text-sm font-bold text-zinc-900">
                        ${(it.price * it.qty).toFixed(2)}
                      </div>
                      <div className="text-xs text-zinc-500">
                        ${it.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="rounded-3xl border border-[var(--brand-100)] bg-[var(--brand-50)]/60 p-5 text-sm text-zinc-700">
            <div className="flex items-center gap-2 font-semibold text-[var(--brand-700)]">
              <FontAwesomeIcon icon={faCheck} />
              Tip
            </div>
            <div className="mt-2 text-sm text-zinc-700">
              Need help? Contact support and include your order number.
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 space-y-5">
          <div>
            <div className="text-lg font-extrabold text-zinc-900">Summary</div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-zinc-700">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-700">
                <span>Discount</span>
                <span className="font-semibold text-[var(--brand-700)]">
                  - ${order.discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-700">
                <span>Shipping</span>
                <span className="font-semibold">
                  {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-zinc-700">
                <span>Tax</span>
                <span className="font-semibold">${order.tax.toFixed(2)}</span>
              </div>

              <div className="my-2 h-px bg-white/50" />

              <div className="flex justify-between text-zinc-900">
                <span className="font-bold">Total</span>
                <span className="font-extrabold text-[var(--brand-700)]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
              <FontAwesomeIcon icon={faLocationDot} className="text-[var(--brand-700)]" />
              Shipping Address
            </div>
            <div className="mt-2 text-xs text-zinc-600 leading-5">
              <div className="font-semibold text-zinc-800">{order.address.name}</div>
              <div>{order.address.line1}</div>
              <div>
                {order.address.city} • {order.address.zip}
              </div>
              <div>{order.address.phone}</div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
              <FontAwesomeIcon icon={faMoneyBill} className="text-[var(--brand-700)]" />
              Payment
            </div>
            <div className="mt-2 text-xs text-zinc-600">
              <div className="font-semibold text-zinc-800">{order.payment.method}</div>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-3 py-1 font-semibold text-[var(--brand-700)]">
                <FontAwesomeIcon icon={faCircleCheck} />
                {order.payment.paid ? "Paid" : "Unpaid"}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}