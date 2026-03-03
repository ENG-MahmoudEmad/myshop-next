"use client";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { useSignup } from "@/features/auth/hooks/useSignup";
import { saveToken } from "@/features/auth/utils/auth-storage";

const passwordRules = {
  minLen: (s: string) => s.length >= 8,
  lower: (s: string) => /[a-z]/.test(s),
  upper: (s: string) => /[A-Z]/.test(s),
  number: (s: string) => /\d/.test(s),

  // ✅ special = ASCII symbols فقط (مش العربي)
  special: (s: string) =>
    /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]/.test(s),

  // ✅ ممنوع عربي/ايموجي/أي non-ASCII
  asciiOnly: (s: string) => /^[\x00-\x7F]*$/.test(s),

  // ✅ ممنوع مسافات
  noSpaces: (s: string) => !/\s/.test(s),
};

const stripNonAscii = (s: string) => s.replace(/[^\x00-\x7F]/g, "");

// ✅ Egyptian phone only: +2010XXXXXXXX / +2011XXXXXXXX / +2012XXXXXXXX / +2015XXXXXXXX
const egyptPhoneRegex = /^\+201[0125]\d{8}$/;

const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Enter a valid email"),

    phone: z
      .string()
      .min(1, "Phone number is required")
      .refine(
        (v) => egyptPhoneRegex.test(v),
        "Use Egyptian number like +2010XXXXXXXX"
      ),

    password: z
      .string()
      .min(8, "Must be at least 8 characters")
      .refine(
        (v) => passwordRules.asciiOnly(v),
        "Password must be English characters only (no Arabic)"
      )
      .refine((v) => passwordRules.noSpaces(v), "Password must not contain spaces")
      .refine((v) => passwordRules.lower(v), "Must contain lowercase letter")
      .refine((v) => passwordRules.upper(v), "Must contain uppercase letter")
      .refine((v) => passwordRules.number(v), "Must contain a number")
      .refine((v) => passwordRules.special(v), "Must contain special character"),

    confirmPassword: z.string().min(1, "Confirm your password"),

    promoEmails: z.boolean().optional(),

    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the Terms & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

function FieldError({ message }: { message?: string }) {
  return (
    <div className="min-h-[16px]">
      {message ? (
        <p className="text-xs text-red-600 leading-4">{message}</p>
      ) : null}
    </div>
  );
}

export default function SignUpForm() {
  const router = useRouter();
  const { mutate, isPending } = useSignup();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputWrap =
    "flex h-11 lg:h-10 items-center gap-3 rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 transition-all duration-300 ease-out focus-within:shadow-xl";
  const input =
    "h-full w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 text-zinc-900";

  const link =
    "font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, touchedFields },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      promoEmails: false,
      acceptTerms: false,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const passwordValue = watch("password") || "";
  const confirmValue = watch("confirmPassword") || "";

  const pwChecks = useMemo(() => {
    const checks = [
      { ok: passwordRules.minLen(passwordValue), msg: "Must be at least 8 characters" },
      { ok: passwordRules.upper(passwordValue), msg: "Must contain uppercase letter" },
      { ok: passwordRules.lower(passwordValue), msg: "Must contain lowercase letter" },
      { ok: passwordRules.number(passwordValue), msg: "Must contain a number" },
      { ok: passwordRules.special(passwordValue), msg: "Must contain special character" },

      // اختياري: لو بدك تعرض شرط الإنجليزي:
      // { ok: passwordRules.asciiOnly(passwordValue), msg: "English characters only (no Arabic)" },
      // { ok: passwordRules.noSpaces(passwordValue), msg: "No spaces" },
    ];

    const passed = checks.filter((c) => c.ok).length;
    const total = checks.length;
    const percent = Math.round((passed / total) * 100);
    const firstFail = checks.find((c) => !c.ok)?.msg ?? "Strong password";
    return { passed, total, percent, firstFail };
  }, [passwordValue]);

  const strengthLabel =
    pwChecks.passed <= 2 ? "Weak" : pwChecks.passed <= 4 ? "Medium" : "Strong";

  const strengthBarClass =
    pwChecks.passed <= 2
      ? "bg-red-500/70"
      : pwChecks.passed <= 4
      ? "bg-orange-500/70"
      : "bg-green-600/70";

  // avoid duplicate password error line
  const passwordError =
    touchedFields.password && errors.password?.message ? errors.password.message : null;

  const showPasswordError = Boolean(passwordError && passwordError !== pwChecks.firstFail);

  const onValid = (values: SignUpValues) => {
    const name = `${values.firstName} ${values.lastName}`.trim();

    mutate(
      {
        name,
        email: values.email,
        password: values.password,
        rePassword: values.confirmPassword,
        phone: values.phone,
      },
      {
        onSuccess: (data) => {
          if (data?.token) saveToken(data.token);
          toast.success("Account created 🎉", { autoClose: 2500 });
          router.replace("/");
        },
        onError: (error: any) => {
          const data = error?.response?.data;

          const statusMsg = data?.statusMsg || data?.status || data?.error || null;
          const message =
            (typeof data?.message === "string" ? data.message : null) ||
            (typeof data?.msg === "string" ? data.msg : null) ||
            null;

          const errorsFromArray = Array.isArray(data?.errors)
            ? data.errors.map((e: any) => e?.msg).filter(Boolean)
            : [];

          const errorsFromObject =
            data?.errors && typeof data.errors === "object" && !Array.isArray(data.errors)
              ? Object.values(data.errors)
                  .flatMap((v: any) => {
                    if (Array.isArray(v)) return v;
                    if (typeof v === "string") return [v];
                    if (v?.msg) return [v.msg];
                    return [];
                  })
                  .filter(Boolean)
              : [];

          const finalMsg =
            [...errorsFromArray, ...errorsFromObject].join(" • ") ||
            (message && message !== "fail" ? message : null) ||
            (statusMsg && statusMsg !== "fail" ? statusMsg : null) ||
            "Signup failed. Please check your data and try again.";

          toast.error(finalMsg, { autoClose: 4500 });
        },
      }
    );
  };

  const onInvalid = (formErrors: typeof errors) => {
    const firstField = Object.keys(formErrors)[0] as keyof typeof formErrors | undefined;
    const firstMsg =
      firstField && (formErrors as any)[firstField]?.message
        ? (formErrors as any)[firstField].message
        : null;

    toast.error(firstMsg || "Please fix the highlighted fields.", { autoClose: 3500 });
  };

  return (
    <form className="space-y-4 lg:space-y-3" onSubmit={handleSubmit(onValid, onInvalid)}>
      {/* Social buttons (UI only) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 py-3 lg:py-2.5 text-sm font-semibold text-zinc-900 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2"
        >
          <FcGoogle size={18} />
          Google
        </button>

        <button
          type="button"
          className="rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 py-3 lg:py-2.5 text-sm font-semibold text-zinc-900 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2"
        >
          <FaFacebook size={18} className="text-[#1877F2]" />
          Facebook
        </button>
      </div>

      <div className="my-2 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs text-zinc-500">OR</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      {/* First + Last */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-900">
            First Name <span className="text-[var(--brand-600)]">*</span>
          </label>
          <div className={inputWrap}>
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
            <input placeholder="John" className={input} {...register("firstName")} />
          </div>
          <FieldError
            message={touchedFields.firstName ? errors.firstName?.message : undefined}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-900">
            Last Name <span className="text-[var(--brand-600)]">*</span>
          </label>
          <div className={inputWrap}>
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
            <input placeholder="Doe" className={input} {...register("lastName")} />
          </div>
          <FieldError
            message={touchedFields.lastName ? errors.lastName?.message : undefined}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900">
          Email Address <span className="text-[var(--brand-600)]">*</span>
        </label>
        <div className={inputWrap}>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
          <input
            type="email"
            placeholder="john.doe@example.com"
            className={input}
            autoComplete="email"
            {...register("email")}
          />
        </div>
        <FieldError message={touchedFields.email ? errors.email?.message : undefined} />
      </div>

      {/* Phone (Egypt only) */}
      {/* Phone (Egypt only) */}
<div className="space-y-2">
  <label className="text-sm font-semibold text-zinc-900">
    Phone Number <span className="text-[var(--brand-600)]">*</span>
  </label>

  <div className={inputWrap}>
    <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />

    <input
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      placeholder="+2010XXXXXXXX"
      className={input}
      value={watch("phone") || ""}
      onChange={(e) => {
        // يسمح فقط بـ + أول حرف + أرقام
        let v = e.target.value;

        // احذف أي شيء غير + أو رقم
        v = v.replace(/[^\d+]/g, "");

        // لو في أكثر من + خليه واحد وبأول النص
        const hasPlus = v.startsWith("+");
        v = v.replace(/\+/g, "");
        v = hasPlus ? `+${v}` : v;

        // لو المستخدم كتب + بمنتصف النص، بنرجعه لأول النص
        if (v.includes("+") && !v.startsWith("+")) {
          v = `+${v.replace(/\+/g, "")}`;
        }

        setValue("phone", v, { shouldDirty: true, shouldValidate: true });
        trigger("phone");
      }}
      onPaste={(e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text") || "";
        let v = text.replace(/[^\d+]/g, "");

        const hasPlus = v.startsWith("+");
        v = v.replace(/\+/g, "");
        v = hasPlus ? `+${v}` : v;

        setValue("phone", v, { shouldDirty: true, shouldValidate: true });
        trigger("phone");
      }}
    />
  </div>

  <FieldError message={touchedFields.phone ? errors.phone?.message : undefined} />
</div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900">
          Password <span className="text-[var(--brand-600)]">*</span>
        </label>

        <div className={inputWrap}>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            className={input}
            autoComplete="new-password"
            value={passwordValue}
            onChange={(e) => {
              const cleaned = stripNonAscii(e.target.value);
              setValue("password", cleaned, { shouldDirty: true, shouldValidate: true });
              // لو بدك التشييك يتحرك لحظيًا:
              trigger("password");
            }}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text");
              const next = stripNonAscii(passwordValue + text);
              setValue("password", next, { shouldDirty: true, shouldValidate: true });
              trigger("password");
            }}
          />
        </div>

        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden">
            <div
              className={`h-full rounded-full ${strengthBarClass} transition-all duration-300`}
              style={{ width: `${pwChecks.percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>{pwChecks.firstFail}</span>
            <span>{strengthLabel}</span>
          </div>
        </div>

        {showPasswordError ? (
          <p className="text-xs text-red-600">{passwordError}</p>
        ) : (
          <div className="min-h-[16px]" />
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900">
          Confirm Password <span className="text-[var(--brand-600)]">*</span>
        </label>

        <div className={inputWrap}>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />

          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your password"
            className={input}
            autoComplete="new-password"
            value={confirmValue}
            onChange={(e) => {
              const cleaned = stripNonAscii(e.target.value);
              setValue("confirmPassword", cleaned, {
                shouldDirty: true,
                shouldValidate: true,
              });
              trigger("confirmPassword");
            }}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text");
              const next = stripNonAscii(confirmValue + text);
              setValue("confirmPassword", next, {
                shouldDirty: true,
                shouldValidate: true,
              });
              trigger("confirmPassword");
            }}
          />
        </div>

        <FieldError
          message={
            touchedFields.confirmPassword ? errors.confirmPassword?.message : undefined
          }
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 pt-1">
        <label className="flex items-start gap-2 text-sm text-zinc-600">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--brand-600)]"
            {...register("promoEmails")}
          />
          <span>
            I&apos;d like to receive promotional emails about new products, discounts, and
            offers.
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm text-zinc-600">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--brand-600)]"
            {...register("acceptTerms")}
          />
          <span>
            I agree to the{" "}
            <a href="#" className={link}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className={link}>
              Privacy Policy
            </a>
            <span className="text-[var(--brand-600)]"> *</span>
          </span>
        </label>

        <FieldError
          message={touchedFields.acceptTerms ? errors.acceptTerms?.message : undefined}
        />
      </div>

      {/* CTA */}
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
        {isPending ? "Creating..." : "Create My Account"}
      </button>
    </form>
  );
}