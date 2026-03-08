"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faLock,
  faMoneyBill1Wave,
  faCreditCard,
  faArrowRight,
  faArrowLeft,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import RecentlyViewedStrip from "@/features/search/components/RecentlyViewedStrip";
import { useCart, CART_QUERY_KEY } from "@/features/cart/hooks/useCart";
import { useCreateCashOrder } from "../hooks/useCreateCashOrder";
import { useCreateCheckoutSession } from "../hooks/useCreateCheckoutSession";
import { useAddresses } from "@/features/account/hooks/useAddresses";
import { getDefaultAddressId } from "@/features/account/utils/default-address";
import { useQueryClient } from "@tanstack/react-query";

type Method = "cod" | "online";

function Stepper() {
  const steps = [
    { label: "Cart", state: "done" as const },
    { label: "Review", state: "done" as const },
    { label: "Payment", state: "active" as const },
    { label: "Complete", state: "todo" as const },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {steps.map((s, idx) => {
        const isLast = idx === steps.length - 1;
        const cls =
          s.state === "active"
            ? "bg-[var(--brand-600)] text-white shadow-[0_8px_24px_rgba(216,67,21,0.25)]"
            : s.state === "done"
              ? "bg-[var(--brand-100)] text-[var(--brand-700)]"
              : "bg-zinc-200 text-zinc-600";

        return (
          <div key={s.label} className="flex items-center gap-2">
            <div className={`flex h-8 items-center gap-2 rounded-full px-3 font-semibold ${cls}`}>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-xs">
                {s.state === "done" ? <FontAwesomeIcon icon={faCheck} /> : idx + 1}
              </span>
              <span>{s.label}</span>
            </div>
            {!isLast ? <span className="text-zinc-300">›</span> : null}
          </div>
        );
      })}
    </div>
  );
}

function formatEGP(value: number) {
  return `${value.toFixed(2)} EGP`;
}

function getFirstThreeWords(text?: string) {
  if (!text) return "Product";
  return text.trim().split(/\s+/).slice(0, 3).join(" ");
}

function parseAddressName(rawName?: string) {
  const value = String(rawName || "").trim();

  if (!value) {
    return {
      fullName: "Address",
      displayLabel: "Other",
    };
  }

  if (value.endsWith(" - Home")) {
    return {
      fullName: value.replace(/ - Home$/, ""),
      displayLabel: "Home",
    };
  }

  if (value.endsWith(" - Work")) {
    return {
      fullName: value.replace(/ - Work$/, ""),
      displayLabel: "Work",
    };
  }

  const otherMatch = value.match(/ - Other(?::\s*(.*))?$/);
  if (otherMatch) {
    return {
      fullName: value.replace(/ - Other(?::\s*.*)?$/, ""),
      displayLabel: (otherMatch[1] || "").trim() || "Other",
    };
  }

  return {
    fullName: value,
    displayLabel: "Other",
  };
}

export default function CheckoutScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const cartIdFromQuery = searchParams.get("cartId") ?? "";

  const [method, setMethod] = useState<Method>("online");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [didShowEmptyCartToast, setDidShowEmptyCartToast] = useState(false);

  const { data, isLoading, isError } = useCart();
  const { data: addressesData, isLoading: isAddressesLoading } = useAddresses();

  const { mutateAsync: createCashOrder, isPending: isCreatingCash } = useCreateCashOrder();
  const { mutateAsync: createCheckoutSession, isPending: isCreatingOnline } =
    useCreateCheckoutSession();

  const cart = data?.data;
  const cartItems = cart?.products ?? [];
  const cartId = cartIdFromQuery || cart?._id || cart?.id || "";

  const rawAddresses = addressesData?.data ?? addressesData?.addresses ?? [];
  const addresses = useMemo(() => {
    return (rawAddresses as any[]).map((address) => {
      const parsed = parseAddressName(address?.name);

      return {
        id: address?._id,
        name: parsed.fullName,
        displayLabel: parsed.displayLabel,
        phone: address?.phone || "",
        details: address?.details || "",
        city: address?.city || "",
      };
    });
  }, [rawAddresses]);

  useEffect(() => {
    if (addresses.length === 0) return;

    const defaultAddressId = getDefaultAddressId();

    if (defaultAddressId && addresses.some((address) => address.id === defaultAddressId)) {
      setSelectedAddressId(defaultAddressId);
      return;
    }

    setSelectedAddressId((current) => current ?? addresses[0].id);
  }, [addresses]);

  useEffect(() => {
    if (!isLoading && cartItems.length === 0 && !didShowEmptyCartToast) {
      toast.error("There are no items in your cart");
      setDidShowEmptyCartToast(true);
    }
  }, [isLoading, cartItems.length, didShowEmptyCartToast]);

  const selectedAddress = useMemo(() => {
    return addresses.find((address) => address.id === selectedAddressId) ?? null;
  }, [addresses, selectedAddressId]);

  const subtotal = useMemo(() => Number(cart?.totalCartPrice ?? 0), [cart]);
  const discount = 0;
  const delivery = 0;
  const tax = 0;
  const total = subtotal - discount + delivery + tax;

  const isSubmitting = isCreatingCash || isCreatingOnline;

  const handleSubmit = async () => {
    if (!cartId || cartItems.length === 0) {
      toast.error("There are no items in your cart");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    const shippingAddress = {
      details: selectedAddress.details.trim(),
      phone: selectedAddress.phone.trim(),
      city: selectedAddress.city.trim(),
    };

    try {
      if (method === "cod") {
        await createCashOrder({
          cartId,
          shippingAddress,
        });

        await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });

        toast.success("Order placed successfully");
        router.push("/cart");
        return;
      }

      const returnUrl =
        typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

      const response = await createCheckoutSession({
        cartId,
        shippingAddress,
        returnUrl,
      });

      const sessionUrl =
        response?.session?.url ||
        response?.url ||
        response?.sessionUrl ||
        response?.data?.session?.url;

      if (sessionUrl && typeof window !== "undefined") {
        window.location.href = sessionUrl;
        return;
      }

      toast.error("Unable to start payment session. Please try again.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      if (String(message).toLowerCase().includes("no cart")) {
        await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        toast.error("There are no items in your cart");
        router.push("/cart");
        return;
      }

      toast.error(message);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Checkout</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Choose payment method and review your order details.
          </p>
        </div>

        <Stepper />
      </div>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-white/40 bg-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md">
            <div className="border-b border-white/40 px-6 py-5">
              <h2 className="text-sm font-extrabold text-zinc-900">Payment Method</h2>
            </div>

            <div className="space-y-4 p-6">
              <button
                type="button"
                onClick={() => setMethod("cod")}
                className={[
                  "w-full rounded-3xl border p-5 text-left transition-all duration-300",
                  method === "cod"
                    ? "border-[var(--brand-300)] bg-white shadow-[0_10px_30px_rgba(216,67,21,0.12)]"
                    : "border-zinc-200 bg-white/80 hover:shadow-md",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <span
                      className={[
                        "mt-1 grid h-5 w-5 place-items-center rounded-full border",
                        method === "cod"
                          ? "border-[var(--brand-600)] bg-[var(--brand-600)] text-white"
                          : "border-zinc-300 bg-white",
                      ].join(" ")}
                    >
                      {method === "cod" ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)]">
                          <FontAwesomeIcon icon={faMoneyBill1Wave} />
                        </span>
                        <div>
                          <div className="text-sm font-extrabold text-zinc-900">
                            Cash on Delivery
                          </div>
                          <div className="text-xs text-zinc-600">
                            Pay when your order arrives
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-zinc-500">No extra charges</span>
                </div>

                <div className="mt-4 rounded-2xl border border-[var(--brand-100)] bg-[var(--brand-50)]/60 p-4 text-xs text-zinc-700">
                  Please keep exact change ready for hassle-free delivery.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod("online")}
                className={[
                  "w-full rounded-3xl border p-5 text-left transition-all duration-300",
                  method === "online"
                    ? "border-[var(--brand-300)] bg-white shadow-[0_10px_30px_rgba(216,67,21,0.12)]"
                    : "border-zinc-200 bg-white/80 hover:shadow-md",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <span
                      className={[
                        "mt-1 grid h-5 w-5 place-items-center rounded-full border",
                        method === "online"
                          ? "border-[var(--brand-600)] bg-[var(--brand-600)] text-white"
                          : "border-zinc-300 bg-white",
                      ].join(" ")}
                    >
                      {method === "online" ? (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      ) : null}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)]">
                          <FontAwesomeIcon icon={faCreditCard} />
                        </span>
                        <div>
                          <div className="text-sm font-extrabold text-zinc-900">
                            Online Payment
                          </div>
                          <div className="text-xs text-zinc-600">
                            Pay securely with card or wallet
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-[var(--brand-100)] px-3 py-1 text-xs font-bold text-[var(--brand-700)]">
                    Recommended
                  </span>
                </div>

                <div className="mt-4 rounded-2xl border border-[var(--brand-200)] bg-white p-4 text-xs text-zinc-700">
                  You will be redirected to a secure payment gateway to complete your
                  transaction.
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-6 py-5">
              <h2 className="text-sm font-extrabold text-zinc-900">Shipping Address</h2>
            </div>

            <div className="space-y-4 p-6">
              {isAddressesLoading ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                  Loading your saved addresses...
                </div>
              ) : addresses.length === 0 ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                    You do not have any saved addresses yet.
                  </div>

                  <Link
                    href="/account/addresses"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-700)]"
                  >
                    <FontAwesomeIcon icon={faLocationDot} />
                    Add Address
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {addresses.map((address) => {
                    const active = selectedAddressId === address.id;

                    return (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => setSelectedAddressId(address.id)}
                        className={[
                          "w-full rounded-3xl border p-5 text-left transition-all duration-300",
                          active
                            ? "border-[var(--brand-300)] bg-white shadow-[0_10px_30px_rgba(216,67,21,0.12)]"
                            : "border-zinc-200 bg-white/80 hover:shadow-md",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3">
                            <span
                              className={[
                                "mt-1 grid h-5 w-5 place-items-center rounded-full border",
                                active
                                  ? "border-[var(--brand-600)] bg-[var(--brand-600)] text-white"
                                  : "border-zinc-300 bg-white",
                              ].join(" ")}
                            >
                              {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                            </span>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-[var(--brand-100)] px-3 py-1 text-xs font-bold text-[var(--brand-700)]">
                                  {address.displayLabel}
                                </span>
                              </div>

                              <div className="mt-3 text-sm font-extrabold text-zinc-900">
                                {address.name}
                              </div>

                              <div className="mt-2 text-sm text-zinc-600">
                                {address.details}
                              </div>

                              <div className="mt-1 text-sm text-zinc-500">
                                {address.city} • {address.phone}
                              </div>
                            </div>
                          </div>

                          {active ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              <FontAwesomeIcon icon={faCheck} />
                              Selected
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}

                  <div className="pt-2">
                    <Link
                      href="/account/addresses"
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:shadow-md"
                    >
                      <FontAwesomeIcon icon={faLocationDot} />
                      Manage Addresses
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-white/40 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md">
          <h2 className="text-lg font-extrabold text-zinc-900">Order Summary</h2>

          {isLoading ? (
            <div className="mt-5 rounded-2xl border border-zinc-200 bg-white/80 p-4 text-sm text-zinc-600">
              Loading your order...
            </div>
          ) : isError ? (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50/70 p-4 text-sm text-red-700">
              Failed to load cart data.
            </div>
          ) : cartItems.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-zinc-200 bg-white/80 p-4 text-sm text-zinc-600">
              Your cart is empty.
            </div>
          ) : (
            <>
              <div className="mt-5 space-y-4">
                {cartItems.map((item: any) => {
                  const product = item?.product;
                  const image =
                    product?.imageCover ||
                    product?.images?.[0] ||
                    "/placeholder-product.png";
                  const count = Number(item?.count ?? 1);
                  const unitPrice = Number(item?.price ?? product?.price ?? 0);

                  return (
                    <div key={product?._id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-zinc-50">
                        <Image
                          src={image}
                          alt={product?.title ?? "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="line-clamp-1 text-sm font-semibold text-zinc-900">
                          {getFirstThreeWords(product?.title)}
                        </div>
                        <div className="text-xs text-zinc-500">Qty: {count}</div>
                      </div>

                      <div className="text-sm font-bold text-zinc-900">
                        {formatEGP(unitPrice * count)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-zinc-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatEGP(subtotal)}</span>
                </div>

                <div className="flex justify-between text-zinc-700">
                  <span>Discount</span>
                  <span className="font-semibold text-[var(--brand-700)]">
                    {discount > 0 ? `- ${formatEGP(discount)}` : "—"}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-700">
                  <span>Delivery</span>
                  <span className="font-semibold">
                    {delivery > 0 ? formatEGP(delivery) : "Free"}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-700">
                  <span>Tax</span>
                  <span className="font-semibold">
                    {tax > 0 ? formatEGP(tax) : "—"}
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
            </>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!cartId || cartItems.length === 0 || isSubmitting || !selectedAddress}
            className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ${
              cartItems.length > 0 && !isSubmitting && selectedAddress
                ? "bg-[var(--brand-600)] hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]"
                : "cursor-not-allowed bg-zinc-300"
            }`}
          >
            {isSubmitting
              ? "Processing..."
              : method === "online"
                ? "Proceed to Payment"
                : "Place Cash Order"}
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          <Link
            href="/cart"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:shadow-md active:scale-[0.98] backdrop-blur"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Return to Cart
          </Link>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white/80 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
              <FontAwesomeIcon icon={faLock} className="text-[var(--brand-700)]" />
              Secure Checkout
            </div>
            <div className="mt-1 text-xs text-zinc-600">
              Your payment information is secure.
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700">
                VISA
              </span>
              <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700">
                MasterCard
              </span>
              <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700">
                AMEX
              </span>
              <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700">
                PayPal
              </span>
              <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700">
                Apple Pay
              </span>
            </div>
          </div>
        </aside>
      </section>

      <RecentlyViewedStrip />
    </div>
  );
}