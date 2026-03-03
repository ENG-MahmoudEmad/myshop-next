"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { saveToken } from "@/features/auth/utils/auth-storage";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  keepSignedIn: z.boolean().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const inputWrap =
    "flex h-11 lg:h-10 items-center gap-3 rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 transition-all duration-300 ease-out focus-within:shadow-xl";
  const input =
    "h-full w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 text-zinc-900";

  const { mutate, isPending, error } = useLogin();

  const apiErrorMessage = useMemo(() => {
    const msg =
      (error as any)?.response?.data?.message ||
      (error as any)?.response?.data?.errors?.[0]?.msg ||
      (error as any)?.message;
    return typeof msg === "string" ? msg : null;
  }, [error]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      keepSignedIn: true,
    },
    mode: "onTouched",
  });

  const onSubmit = (values: LoginValues) => {
    mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: (data) => {
          if (data?.token) saveToken(data.token);

          // ✅ success toast (ToastProvider will play success sound)
          toast.success("Welcome back 👋", { autoClose: 2500 });

          router.replace("/");
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            err?.response?.data?.errors?.[0]?.msg ||
            "Invalid email or password";

          // ✅ error toast (ToastProvider will play error sound)
          toast.error(String(message), { autoClose: 4000 });
        },
      }
    );
  };

  return (
    <form className="space-y-4 lg:space-y-3" onSubmit={handleSubmit(onSubmit)}>
      {/* (اختياري) لو بدك تعرض error داخل الفورم */}
      {apiErrorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiErrorMessage}
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900">Email Address</label>

        <div className={inputWrap}>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
          <input
            type="email"
            placeholder="Enter your email"
            className={input}
            autoComplete="email"
            {...register("email")}
          />
        </div>

        {errors.email?.message ? (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-zinc-900">Password</label>

          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
          >
            Forgot Password?
          </Link>
        </div>

        <div className={inputWrap}>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className={input}
            autoComplete="current-password"
            {...register("password")}
          />
        </div>

        {errors.password?.message ? (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-600">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[var(--brand-600)]"
          {...register("keepSignedIn")}
        />
        Keep me signed in
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="
          w-full rounded-full bg-[var(--brand-600)]
          px-6 py-3 lg:py-2.5 text-white font-semibold
          transition-all duration-300 ease-out
          hover:bg-[var(--brand-700)] hover:scale-105
          active:scale-95
          disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed
        "
      >
        {isPending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}