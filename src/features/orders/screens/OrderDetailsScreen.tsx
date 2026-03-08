"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
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

import { useOrders } from "../hooks/useOrders";

type Props = { id: string };
type Status = "Delivered" | "Processing" | "Canceled";

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

function normalizeOrderStatus(order: any): Status {
  if (order?.isDelivered) return "Delivered";
  if (order?.isPaid === false && order?.isDelivered === false) return "Processing";
  return "Processing";
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    Delivered: "bg-[var(--brand-100)] text-[var(--brand-700)]",
    Processing: "bg-blue-100 text-blue-700",
    Canceled: "bg-red-100 text-red-600",
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${map[status]}`}>{status}</span>;
}

function Tracking({ status }: { status: Status }) {
  const steps = [
    { label: "Order Placed", icon: faReceipt },
    { label: "Packed", icon: faBox },
    { label: "Out for delivery", icon: faTruckFast },
    { label: "Delivered", icon: faCircleCheck },
  ];

  const currentStepIndex =
    status === "Delivered" ? 3 : status === "Canceled" ? 0 : 1;

  return (
    <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md">
      <div className="text-sm font-extrabold text-zinc-900">Order Tracking</div>

      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.label} className="flex flex-col items-center text-center">
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

              <div className="mt-3 text-sm font-semibold text-zinc-900">{step.label}</div>

              <div className="mt-1 text-xs text-zinc-500">
                {isCompleted ? "Completed" : isCurrent ? "In progress" : "Pending"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderDetailsScreen({ id }: Props) {
  const { data, isLoading, isError } = useOrders();

  const order = useMemo(() => {
  const raw =
    (Array.isArray(data) && data) ||
    (Array.isArray((data as any)?.data) && (data as any).data) ||
    (Array.isArray((data as any)?.orders) && (data as any).orders) ||
    [];

  return (
    raw.find((item: any) => String(item?._id ?? item?.id) === String(id)) ?? null
  );
}, [data, id]);

  const normalized = useMemo(() => {
    if (!order) return null;

    const status = normalizeOrderStatus(order);

    return {
      id: order?._id,
      status,
      date: formatDate(order?.createdAt),
      address: {
        name: order?.user?.name || "Customer",
        line1: order?.shippingAddress?.details || "—",
        city: order?.shippingAddress?.city || "—",
        zip: "—",
        phone: order?.shippingAddress?.phone || "—",
      },
      payment: {
        method: order?.paymentMethodType === "cash" ? "Cash on Delivery" : "Online Payment",
        paid: Boolean(order?.isPaid),
      },
      items: (order?.cartItems ?? []).map((item: any) => ({
        id: item?.product?._id,
        name: item?.product?.title || "Product",
        price: Number(item?.price ?? item?.product?.price ?? 0),
        qty: Number(item?.count ?? 1),
        image:
          item?.product?.imageCover ||
          item?.product?.images?.[0] ||
          "/placeholder-product.png",
      })),
      discount: 0,
      shipping: 0,
      tax: 0,
      total: Number(order?.totalOrderPrice ?? 0),
    };
  }, [order]);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm">
        Loading order details...
      </div>
    );
  }

  if (isError || !normalized) {
    return (
      <div className="space-y-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Orders
        </Link>

        <div className="rounded-3xl border border-red-100 bg-red-50/70 p-6 text-sm text-red-700">
          Order not found.
        </div>
      </div>
    );
  }

  const subtotal = normalized.items.reduce(
  (s: number, it: { price: number; qty: number }) => s + it.price * it.qty,
  0
);
  const total = normalized.total || subtotal - normalized.discount + normalized.tax + normalized.shipping;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-zinc-500">
          <Link className="hover:text-[var(--brand-700)]" href="/">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link className="hover:text-[var(--brand-700)]" href="/orders">
            Orders
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-700">Order #{normalized.id?.slice(-8).toUpperCase()}</span>
        </div>

        <Link
          href="/orders"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Orders
        </Link>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-zinc-900">
                Order #{normalized.id?.slice(-8).toUpperCase()}
              </h1>
              <StatusBadge status={normalized.status} />
            </div>
            <p className="mt-2 text-sm text-zinc-600">Placed on {normalized.date}</p>
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

      <Tracking status={normalized.status} />

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-6 py-5">
              <div className="text-sm font-extrabold text-zinc-900">Items</div>
              <div className="mt-1 text-xs text-zinc-500">{normalized.items.length} products</div>
            </div>

            <div className="divide-y divide-zinc-200">
              {normalized.items.map((it: { id: string; name: string; price: number; qty: number; image: string }) => (
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

                    <div className="text-right sm:ml-auto">
                      <div className="text-sm font-bold text-zinc-900">
                        {formatEGP(it.price * it.qty)}
                      </div>
                      <div className="text-xs text-zinc-500">{formatEGP(it.price)} each</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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

        <aside className="h-fit space-y-5 rounded-3xl border border-white/40 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md">
          <div>
            <div className="text-lg font-extrabold text-zinc-900">Summary</div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-zinc-700">
                <span>Subtotal</span>
                <span className="font-semibold">{formatEGP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-700">
                <span>Discount</span>
                <span className="font-semibold text-[var(--brand-700)]">
                  {normalized.discount > 0 ? `- ${formatEGP(normalized.discount)}` : "—"}
                </span>
              </div>
              <div className="flex justify-between text-zinc-700">
                <span>Shipping</span>
                <span className="font-semibold">
                  {normalized.shipping === 0 ? "Free" : formatEGP(normalized.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-700">
                <span>Tax</span>
                <span className="font-semibold">
                  {normalized.tax > 0 ? formatEGP(normalized.tax) : "—"}
                </span>
              </div>

              <div className="my-2 h-px bg-white/50" />

              <div className="flex justify-between text-zinc-900">
                <span className="font-bold">Total</span>
                <span className="font-extrabold text-[var(--brand-700)]">
                  {formatEGP(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
              <FontAwesomeIcon icon={faLocationDot} className="text-[var(--brand-700)]" />
              Shipping Address
            </div>
            <div className="mt-2 text-xs leading-5 text-zinc-600">
              <div className="font-semibold text-zinc-800">{normalized.address.name}</div>
              <div>{normalized.address.line1}</div>
              <div>
                {normalized.address.city} • {normalized.address.zip}
              </div>
              <div>{normalized.address.phone}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
              <FontAwesomeIcon icon={faMoneyBill} className="text-[var(--brand-700)]" />
              Payment
            </div>
            <div className="mt-2 text-xs text-zinc-600">
              <div className="font-semibold text-zinc-800">{normalized.payment.method}</div>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-3 py-1 font-semibold text-[var(--brand-700)]">
                <FontAwesomeIcon icon={faCircleCheck} />
                {normalized.payment.paid ? "Paid" : "Unpaid"}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}