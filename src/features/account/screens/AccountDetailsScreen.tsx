"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faBagShopping,
  faHeart,
  faLocationDot,
  faUserPen,
  faRightFromBracket,
  faCloudArrowUp,
  faTrash,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import { removeToken, saveToken } from "@/features/auth/utils/auth-storage";
import {
  getLoggedInUserData,
  getUserInitials,
} from "@/features/auth/utils/auth-user";
import { useChangeMyPassword } from "../hooks/useChangeMyPassword";
import { useUpdateLoggedUserData } from "../hooks/useUpdateLoggedUserData";

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

function isValidEgyptianPhone(value: string) {
  return /^01[0125][0-9]{8}$/.test(value);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isStrongPassword(value: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[!-~]{8,}$/.test(value);
}

export default function AccountDetailsScreen() {
  const router = useRouter();

  const { mutateAsync: changePassword, isPending: isUpdatingPassword } =
    useChangeMyPassword();
  const { mutateAsync: updateProfile, isPending: isSavingProfile } =
    useUpdateLoggedUserData();

  const user = useMemo(() => getLoggedInUserData(), []);
  const userInitials = getUserInitials(user.name);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [initialFirstName, setInitialFirstName] = useState("");
  const [initialLastName, setInitialLastName] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [initialPhone, setInitialPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  useEffect(() => {
  const parts = String(user.name || "").trim().split(/\s+/).filter(Boolean);
  const first = parts[0] || "";
  const last = parts.slice(1).join(" ");

  setFirstName(first);
  setLastName(last);
  setEmail(user.email || "");

  setInitialFirstName(first);
  setInitialLastName(last);
  setInitialEmail(user.email || "");
}, [user]);

  const fullName = `${firstName} ${lastName}`.trim();
  const liveInitials = getUserInitials(fullName);

  const handleLogout = () => {
    removeToken();
    toast.success("Logged out successfully.");
    router.push("/login");
  };

  const handleSaveProfile = async () => {
  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPhone = phone.trim();

  if (!trimmedFirst) {
    toast.error("Please enter your first name.");
    return;
  }

  if (!trimmedLast) {
    toast.error("Please enter your last name.");
    return;
  }

  if (!trimmedEmail) {
    toast.error("Please enter your email.");
    return;
  }

  if (!isValidEmail(trimmedEmail)) {
    toast.error("Please enter a valid email address.");
    return;
  }

  if (!trimmedPhone) {
    toast.error("Please enter your phone number.");
    return;
  }

  if (!isValidEgyptianPhone(trimmedPhone)) {
    toast.error("Enter a valid Egyptian phone number.");
    return;
  }

  try {
    const response = await updateProfile({
      name: `${trimmedFirst} ${trimmedLast}`.trim(),
      email: trimmedEmail,
      phone: trimmedPhone,
    });

    const returnedUser =
      response?.data ||
      response?.user ||
      response?.data?.user ||
      null;

    const returnedToken =
      response?.token ||
      response?.data?.token ||
      null;

    if (returnedToken) {
      saveToken(returnedToken);
    }

    setInitialFirstName(trimmedFirst);
    setInitialLastName(trimmedLast);
    setInitialEmail(trimmedEmail);
    setInitialPhone(trimmedPhone);

    if (returnedUser?.name) {
      const parts = String(returnedUser.name).trim().split(/\s+/).filter(Boolean);
      setFirstName(parts[0] || trimmedFirst);
      setLastName(parts.slice(1).join(" ") || trimmedLast);
    }

    if (returnedUser?.email) {
      setEmail(returnedUser.email);
      setInitialEmail(returnedUser.email);
    }

    if (returnedUser?.phone) {
      setPhone(returnedUser.phone);
      setInitialPhone(returnedUser.phone);
    }

    toast.success("Profile updated successfully.");
  } catch (error: any) {
    console.log("update profile error:", error?.response?.data || error);

    const message =
      error?.response?.data?.errors?.msg ||
      error?.response?.data?.errors?.[0]?.msg ||
      error?.response?.data?.message ||
      error?.response?.data?.statusMsg ||
      error?.message ||
      "Failed to update profile.";

    toast.error(message);
  }
};

  const handleCancelProfile = () => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setEmail(initialEmail);
    setPhone(initialPhone);
    toast.success("Changes reverted.");
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword.trim()) {
      toast.error("Please enter your current password.");
      return;
    }

    if (!newPassword.trim()) {
      toast.error("Please enter a new password.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      toast.error(
        "Password must be at least 8 characters and include upper, lower, number, and symbol."
      );
      return;
    }

    if (newPassword !== rePassword) {
      toast.error("Password confirmation does not match.");
      return;
    }

    try {
      const response = await changePassword({
        currentPassword: currentPassword.trim(),
        password: newPassword.trim(),
        rePassword: rePassword.trim(),
      });

      const token =
        response?.token ||
        response?.data?.token ||
        response?.userToken ||
        null;

      if (token) {
        saveToken(token);
      }

      setCurrentPassword("");
      setNewPassword("");
      setRePassword("");
      toast.success("Password updated successfully.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update password.";
      toast.error(message);
    }
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
        <span className="text-zinc-700">Account Details</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-3">
        <GlassCard className="h-fit p-5">
          <div className="flex items-center gap-4 rounded-2xl border border-white/50 bg-white/60 p-4">
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-[var(--brand-50)] font-extrabold text-[var(--brand-700)]">
              {liveInitials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-zinc-900">
                {fullName || user.name || "My Account"}
              </div>
              <div className="line-clamp-1 text-xs text-zinc-600">
                {email || user.email || "No email available"}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <SidebarLink href="/account" icon={faGaugeHigh} label="Dashboard" />
            <SidebarLink href="/orders" icon={faBagShopping} label="Orders" />
            <SidebarLink href="/wishlist" icon={faHeart} label="Wishlist" />
            <SidebarLink
              href="/account/addresses"
              icon={faLocationDot}
              label="Addresses"
            />
            <SidebarLink
              href="/account/details"
              icon={faUserPen}
              label="Account Details"
            />

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
          <GlassCard className="p-6">
            <h1 className="text-2xl font-extrabold text-zinc-900">
              Account Details
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Manage your profile information and password.
            </p>
          </GlassCard>

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
                  Image upload endpoint is not available in the current API docs.
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      toast.info("Profile image upload is not available in the current API.")
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-md active:scale-[0.98]"
                  >
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                    Upload New
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toast.info("Profile image removal is not available in the current API.")
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-zinc-600" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  Last Name
                </span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-zinc-700">
                  Email Address
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-zinc-700">
                  Phone Number
                </span>
                <input
  value={phone}
  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
  placeholder="010XXXXXXXX"
  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
/>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingProfile ? (
                  <>
                    Saving...
                    <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>

              <button
                type="button"
                onClick={handleCancelProfile}
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </GlassCard>

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
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
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
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  Confirm New Password
                </span>
                <input
                  type="password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingPassword ? (
                  <>
                    Updating...
                    <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}