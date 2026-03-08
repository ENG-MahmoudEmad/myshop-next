"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import { useAddresses } from "../hooks/useAddresses";
import { useAddAddress } from "../hooks/useAddAddress";
import { useRemoveAddress } from "../hooks/useRemoveAddress";
import {
  clearDefaultAddressId,
  getDefaultAddressId,
  setDefaultAddressId,
} from "../utils/default-address";
import { removeToken } from "@/features/auth/utils/auth-storage";
import {
  getLoggedInUserName,
  getUserInitials,
} from "@/features/auth/utils/auth-user";

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

function LabelIcon({ label }: { label: "Home" | "Work" | "Other" }) {
  const icon =
    label === "Home" ? faHouse : label === "Work" ? faBuilding : faMapLocationDot;

  return (
    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)]">
      <FontAwesomeIcon icon={icon} />
    </span>
  );
}

function isEgyptianPhone(value: string) {
  return /^01[0125][0-9]{8}$/.test(value);
}

function parseAddressName(rawName?: string) {
  const value = String(rawName || "").trim();

  if (!value) {
    return {
      fullName: "Address",
      label: "Other" as const,
      customLabel: "",
      displayLabel: "Other",
    };
  }

  if (value.endsWith(" - Home")) {
    return {
      fullName: value.replace(/ - Home$/, ""),
      label: "Home" as const,
      customLabel: "",
      displayLabel: "Home",
    };
  }

  if (value.endsWith(" - Work")) {
    return {
      fullName: value.replace(/ - Work$/, ""),
      label: "Work" as const,
      customLabel: "",
      displayLabel: "Work",
    };
  }

  const otherMatch = value.match(/ - Other(?::\s*(.*))?$/);

  if (otherMatch) {
    const custom = (otherMatch[1] || "").trim();
    return {
      fullName: value.replace(/ - Other(?::\s*.*)?$/, ""),
      label: "Other" as const,
      customLabel: custom,
      displayLabel: custom || "Other",
    };
  }

  return {
    fullName: value,
    label: "Other" as const,
    customLabel: "",
    displayLabel: "Other",
  };
}

type FormState = {
  name: string;
  phone: string;
  details: string;
  city: string;
  label: "Home" | "Work" | "Other";
  customLabel: string;
  isDefault: boolean;
};

const INITIAL_FORM: FormState = {
  name: "",
  phone: "",
  details: "",
  city: "",
  label: "Home",
  customLabel: "",
  isDefault: false,
};

export default function AddressesScreen() {
  const router = useRouter();

  const { data, isLoading, isError } = useAddresses();
  const { mutateAsync: addAddress, isPending: isSaving } = useAddAddress();
  const { mutateAsync: removeAddress } = useRemoveAddress();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [defaultAddressId, setDefaultAddressState] = useState<string | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [labelMenuOpen, setLabelMenuOpen] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);

  const userName = getLoggedInUserName();
  const userInitials = getUserInitials(userName);

  useEffect(() => {
    setDefaultAddressState(getDefaultAddressId());

    const sync = () => {
      setDefaultAddressState(getDefaultAddressId());
    };

    window.addEventListener("default-address-changed", sync);
    return () => window.removeEventListener("default-address-changed", sync);
  }, []);

  const rawAddresses = data?.data ?? data?.addresses ?? [];

  const addresses = useMemo(() => {
    return (rawAddresses as any[]).map((address) => {
      const parsed = parseAddressName(address.name);

      return {
        id: address._id,
        rawName: address.name || "Address",
        name: parsed.fullName,
        phone: address.phone || "",
        details: address.details || "",
        city: address.city || "",
        label: parsed.label,
        customLabel: parsed.customLabel,
        displayLabel: parsed.displayLabel,
        isDefault: defaultAddressId ? defaultAddressId === address._id : false,
      };
    });
  }, [rawAddresses, defaultAddressId]);

  useEffect(() => {
    if (!defaultAddressId && addresses.length > 0) {
      setDefaultAddressId(addresses[0].id);
      setDefaultAddressState(addresses[0].id);
    }
  }, [addresses, defaultAddressId]);

  const [busyDeleteId, setBusyDeleteId] = useState<string | null>(null);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildPayloadName = () => {
    const trimmedName = form.name.trim();

    if (form.label === "Home") return `${trimmedName} - Home`;
    if (form.label === "Work") return `${trimmedName} - Work`;

    const custom = form.customLabel.trim();
    return custom ? `${trimmedName} - Other: ${custom}` : `${trimmedName} - Other`;
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingAddressId(null);
    setLabelMenuOpen(false);
  };

  const handleEdit = (address: (typeof addresses)[number]) => {
    setEditingAddressId(address.id);
    setLabelMenuOpen(false);
    setForm({
      name: address.name,
      phone: address.phone,
      details: address.details,
      city: address.city,
      label: address.label,
      customLabel: address.customLabel || "",
      isDefault: address.isDefault,
    });

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const handleSave = async () => {
    const trimmedName = form.name.trim();
    const trimmedPhone = form.phone.trim();
    const trimmedDetails = form.details.trim();
    const trimmedCity = form.city.trim();
    const trimmedCustomLabel = form.customLabel.trim();

    if (!trimmedName) {
      toast.error("Please enter address name.");
      return;
    }

    if (!trimmedPhone) {
      toast.error("Please enter phone number.");
      return;
    }

    if (!isEgyptianPhone(trimmedPhone)) {
      toast.error("Enter a valid Egyptian phone number.");
      return;
    }

    if (!trimmedDetails) {
      toast.error("Please enter address details.");
      return;
    }

    if (!trimmedCity) {
      toast.error("Please enter city.");
      return;
    }

    if (form.label === "Other" && !trimmedCustomLabel) {
      toast.error("Please enter a custom label for Other.");
      return;
    }

    try {
      setIsUpdatingAddress(Boolean(editingAddressId));

      if (editingAddressId) {
        await removeAddress(editingAddressId);
      }

      const response = await addAddress({
        name: buildPayloadName(),
        phone: trimmedPhone,
        details: trimmedDetails,
        city: trimmedCity,
      });

      const addedAddressId =
        response?.data?._id ||
        response?.address?._id ||
        response?._id ||
        null;

      if (form.isDefault && addedAddressId) {
        setDefaultAddressId(addedAddressId);
        setDefaultAddressState(addedAddressId);
      }

      resetForm();
      toast.success(
        editingAddressId ? "Address updated successfully." : "Address saved successfully."
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        (editingAddressId ? "Failed to update address." : "Failed to save address.");
      toast.error(message);
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    try {
      setBusyDeleteId(addressId);

      await removeAddress(addressId);

      if (defaultAddressId === addressId) {
        clearDefaultAddressId();
        setDefaultAddressState(null);
      }

      if (editingAddressId === addressId) {
        resetForm();
      }

      toast.success("Address deleted successfully.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete address.";
      toast.error(message);
    } finally {
      setBusyDeleteId(null);
    }
  };

  const handleSetDefault = (addressId: string) => {
    setDefaultAddressId(addressId);
    setDefaultAddressState(addressId);
    toast.success("Default address updated.");
  };

  const handleLogout = () => {
    clearDefaultAddressId();
    removeToken();
    toast.success("Logged out successfully.");
    router.push("/login");
  };

  return (
    <div className="space-y-8">
      <div className="text-sm text-zinc-500">
        <Link href="/" className="hover:text-[var(--brand-700)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/account" className="hover:text-[var(--brand-700)]">
          My Account
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700">Addresses</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-3">
        <GlassCard className="h-fit p-5">
          <div className="flex items-center gap-4 rounded-2xl border border-white/50 bg-white/60 p-4">
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-[var(--brand-50)] font-extrabold text-[var(--brand-700)]">
              {userInitials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-zinc-900">My Account</div>
              <div className="line-clamp-1 text-xs text-zinc-600">
                Manage your saved delivery addresses
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

        <div className="space-y-6 lg:col-span-2">
          <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--brand-700)]/30 to-[var(--brand-200)]/45" />
            <div className="relative p-6 sm:p-8">
              <h1 className="text-2xl font-extrabold text-zinc-900">Addresses</h1>
              <p className="mt-2 text-sm text-zinc-600">
                Manage your delivery addresses for faster checkout.
              </p>
            </div>
          </div>

          {isLoading ? (
            <GlassCard className="p-6 text-sm text-zinc-600">
              Loading your addresses...
            </GlassCard>
          ) : isError ? (
            <GlassCard className="p-6 text-sm text-red-600">
              Failed to load addresses.
            </GlassCard>
          ) : addresses.length === 0 ? (
            <GlassCard className="p-6 text-sm text-zinc-600">
              No addresses found yet. Add your first address below.
            </GlassCard>
          ) : (
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
                            {a.displayLabel} Address
                          </div>

                          {a.isDefault ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              <FontAwesomeIcon icon={faCheck} />
                              Default
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetDefault(a.id)}
                              className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-100)] bg-[var(--brand-50)] px-3 py-1 text-xs font-semibold text-[var(--brand-700)] transition hover:bg-[var(--brand-100)]"
                            >
                              <FontAwesomeIcon icon={faPlus} />
                              Set Default
                            </button>
                          )}
                        </div>

                        <div className="mt-2 text-sm font-semibold text-zinc-900">
                          {a.name}
                          <span className="font-normal text-zinc-500"> • {a.phone}</span>
                        </div>

                        <div className="mt-2 text-sm text-zinc-600">{a.details}</div>
                        <div className="mt-1 text-sm text-zinc-600">{a.city}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:pt-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(a)}
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]"
                      >
                        <FontAwesomeIcon icon={faPen} className="text-zinc-600" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(a.id)}
                        disabled={busyDeleteId === a.id}
                        className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white/80 text-zinc-700 backdrop-blur transition hover:border-transparent hover:bg-red-50 hover:text-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <FontAwesomeIcon
                          icon={busyDeleteId === a.id ? faSpinner : faTrash}
                          spin={busyDeleteId === a.id}
                        />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          <div ref={formRef}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-extrabold text-zinc-900">
                    {editingAddressId ? "Edit Address" : "Add New Address"}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    {editingAddressId
                      ? "Update the selected delivery address."
                      : "Fill the form below to add a new delivery address."}
                  </p>
                </div>

                <div className="hidden items-center gap-2 rounded-full border border-[var(--brand-100)] bg-[var(--brand-50)] px-4 py-2 text-xs font-semibold text-[var(--brand-700)] sm:flex">
                  <FontAwesomeIcon icon={faLocationDot} />
                  Shipping ready
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-zinc-700">Full Name</span>
                  <input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g., John Doe"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-zinc-700">Phone Number</span>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 11))
                    }
                    placeholder="01XXXXXXXXX"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-zinc-700">Address Line</span>
                  <input
                    value={form.details}
                    onChange={(e) => handleChange("details", e.target.value)}
                    placeholder="Street, building, apartment..."
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-zinc-700">City</span>
                  <input
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Cairo"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                  />
                </label>

                <div className="relative sm:col-span-2">
                  <span className="text-xs font-semibold text-zinc-700">Address Label</span>

                  <button
                    type="button"
                    onClick={() => setLabelMenuOpen((prev) => !prev)}
                    className="mt-2 flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-900 outline-none transition hover:border-[var(--brand-200)] focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                  >
                    <span>{form.label}</span>
                    <span className="text-xs text-zinc-500">{labelMenuOpen ? "▲" : "▼"}</span>
                  </button>

                  {labelMenuOpen ? (
                    <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.10)]">
                      {(["Home", "Work", "Other"] as FormState["label"][]).map((option) => {
                        const active = form.label === option;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              handleChange("label", option);
                              if (option !== "Other") {
                                handleChange("customLabel", "");
                              }
                              setLabelMenuOpen(false);
                            }}
                            className={[
                              "flex w-full items-center justify-between px-4 py-3 text-left text-sm transition",
                              active
                                ? "bg-[var(--brand-50)] font-semibold text-[var(--brand-700)]"
                                : "text-zinc-700 hover:bg-zinc-50",
                            ].join(" ")}
                          >
                            <span>{option}</span>
                            {active ? <FontAwesomeIcon icon={faCheck} /> : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                {form.label === "Other" ? (
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold text-zinc-700">Custom Label</span>
                    <input
                      value={form.customLabel}
                      onChange={(e) => handleChange("customLabel", e.target.value)}
                      placeholder="e.g., Gym, Sister House, Office 2"
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                    />
                  </label>
                ) : null}

                <label className="flex items-center gap-3 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => handleChange("isDefault", e.target.checked)}
                    className="h-4 w-4 accent-[var(--brand-600)]"
                  />
                  <span className="text-sm text-zinc-700">Set as default delivery address</span>
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || isUpdatingAddress || Boolean(busyDeleteId)}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FontAwesomeIcon
                    icon={
                      isSaving || isUpdatingAddress
                        ? faSpinner
                        : editingAddressId
                          ? faCheck
                          : faPlus
                    }
                    spin={isSaving || isUpdatingAddress}
                  />
                  {editingAddressId
                    ? isUpdatingAddress
                      ? "Updating..."
                      : "Update Address"
                    : isSaving
                      ? "Saving..."
                      : "Save Address"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]"
                >
                  {editingAddressId ? (
                    <>
                      <FontAwesomeIcon icon={faXmark} className="mr-2" />
                      Cancel Edit
                    </>
                  ) : (
                    "Reset"
                  )}
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
}