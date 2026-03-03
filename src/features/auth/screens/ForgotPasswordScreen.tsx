// "use client";

// import { FaLock } from "react-icons/fa";
// import { FaHeadset, FaCircleQuestion } from "react-icons/fa6";
// import { MdEmail } from "react-icons/md";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useMemo } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { api } from "@/lib/axios";
// import { toastError, toastSuccess } from "@/lib/toast";

// const schema = z.object({
//   email: z.string().email("Enter a valid email"),
// });

// type Values = z.infer<typeof schema>;

// function extractApiMessage(err: any) {
//   const data = err?.response?.data;

//   const msg =
//     data?.message ||
//     data?.msg ||
//     (Array.isArray(data?.errors) ? data.errors?.[0]?.msg : null) ||
//     err?.message ||
//     null;

//   return typeof msg === "string" ? msg : "Failed to send code. Please try again.";
// }

// function isEmailNotRegistered(message: string) {
//   const m = message.toLowerCase();

//   // ✅ دعم أكبر عدد ممكن من صياغات السيرفر
//   return (
//     m.includes("no user") ||
//     m.includes("not found") ||
//     m.includes("doesn't exist") ||
//     m.includes("does not exist") ||
//     m.includes("not registered") ||
//     m.includes("registered with this email") ||
//     m.includes("email is not registered")
//   );
// }

// export default function ForgotPasswordScreen() {
//   const router = useRouter();

//   const glassCard =
//     "rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]";
//   const helpCard =
//     "group rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl flex flex-col h-full";

//   const inputWrap =
//     "flex h-11 items-center gap-3 rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 transition-all duration-300 ease-out focus-within:shadow-xl";
//   const input =
//     "h-full w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 text-zinc-900";

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<Values>({
//     resolver: zodResolver(schema),
//     defaultValues: { email: "" },
//     mode: "onSubmit",
//     reValidateMode: "onChange",
//     shouldFocusError: true,
//   });

//   const submit = async (values: Values) => {
//     try {
//       // Route API: POST /auth/forgotPasswords
//       await api.post("/auth/forgotPasswords", { email: values.email });

//       toastSuccess("Code sent to your email ✅", { autoClose: 2500 });

//       const encoded = encodeURIComponent(values.email);
//       router.push(`/verify-reset-code?email=${encoded}`);
//     } catch (err: any) {
//       const msg = extractApiMessage(err);

//       // ✅ Email غير مسجل → رسالة خاصة + تحويل Signup
//       if (isEmailNotRegistered(msg)) {
//         toastError("This email is not registered. Create an account first.", {
//           autoClose: 4500,
//         });

//         // تحويل خفيف بعد لحظة (بدون ما يحسها عدوانية)
//         setTimeout(() => {
//           router.push(`/signup?email=${encodeURIComponent(values.email)}`);
//         }, 900);

//         return;
//       }

//       toastError(String(msg), { autoClose: 4500 });
//     }
//   };

//   const securityText = useMemo(() => {
//     return "For your security, the verification code will expire after 30 minutes.";
//   }, []);

//   return (
//     <div className="py-16">
//       {/* Main Card */}
//       <div className={`mx-auto w-full max-w-md p-6 text-center ${glassCard}`}>
//         <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
//           <FaLock size={18} />
//         </div>

//         <h1 className="text-xl font-semibold">Forgot your password?</h1>

//         <p className="mt-2 text-sm text-zinc-600">
//           Enter your registered email address and we’ll send you a verification code.
//         </p>

//         <form className="mt-6 space-y-4 text-left" onSubmit={handleSubmit(submit)}>
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-zinc-900">
//               Email Address
//             </label>

//             <div className={inputWrap}>
//               <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
//               <input
//                 type="email"
//                 placeholder="Your registered email"
//                 className={input}
//                 autoComplete="email"
//                 {...register("email")}
//               />
//             </div>

//             <div className="min-h-[16px]">
//               {errors.email?.message ? (
//                 <p className="text-xs text-red-600 leading-4">
//                   {errors.email.message}
//                 </p>
//               ) : null}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="
//               w-full rounded-full bg-[var(--brand-600)] px-6 py-3 text-white font-semibold
//               transition-all duration-300 ease-out hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95
//               disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed
//             "
//           >
//             {isSubmitting ? "Sending..." : "Send Code"}
//           </button>

//           <p className="text-center text-sm text-zinc-600">
//             Remember your password?{" "}
//             <Link
//               href="/login"
//               className="font-semibold text-[var(--brand-600)] underline underline-offset-4 hover:text-[var(--brand-700)] transition-all duration-300 ease-out"
//             >
//               Sign in
//             </Link>
//           </p>
//         </form>
//       </div>

//       {/* Security Notice */}
//       <div className={`mx-auto mt-6 w-full max-w-md p-4 ${glassCard}`}>
//         <p className="text-sm font-semibold text-zinc-900">Security Notice</p>
//         <p className="mt-1 text-sm text-zinc-600">{securityText}</p>
//       </div>

//       {/* Need additional help */}
//       <div className="mx-auto mt-14 w-full max-w-6xl px-4">
//         <h2 className="text-center text-lg font-semibold text-zinc-900">
//           Need additional help?
//         </h2>

//         <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           <div className={helpCard}>
//             <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
//               <FaHeadset size={18} />
//             </div>

//             <p className="text-center text-sm font-semibold text-zinc-900">
//               Contact Support
//             </p>
//             <p className="mt-2 text-center text-sm text-zinc-600">
//               Our support team is available 24/7 to assist you.
//             </p>

//             <div className="mt-auto pt-4 text-center">
//               <Link
//                 href="/contact"
//                 className="inline-flex items-center justify-center font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
//               >
//                 Contact Us →
//               </Link>
//             </div>
//           </div>

//           <div className={helpCard}>
//             <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
//               <FaCircleQuestion size={18} />
//             </div>

//             <p className="text-center text-sm font-semibold text-zinc-900">FAQs</p>
//             <p className="mt-2 text-center text-sm text-zinc-600">
//               Find answers to frequently asked questions about your account.
//             </p>

//             <div className="mt-auto pt-4 text-center">
//               <Link
//                 href="/faqs"
//                 className="inline-flex items-center justify-center font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
//               >
//                 View FAQs →
//               </Link>
//             </div>
//           </div>

//           <div className={`${helpCard} sm:col-span-2 lg:col-span-1`}>
//             <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
//               <MdEmail size={18} />
//             </div>

//             <p className="text-center text-sm font-semibold text-zinc-900">
//               Email Not Received?
//             </p>
//             <p className="mt-2 text-center text-sm text-zinc-600">
//               Check your spam folder or request a new code.
//             </p>

//             <div className="mt-auto pt-4 text-center">
//               <Link
//                 href="/forgot-password"
//                 className="inline-flex items-center justify-center font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
//               >
//                 Resend from here →
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }













"use client";

import { FaLock } from "react-icons/fa";
import { FaHeadset, FaCircleQuestion } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/axios";
import { toastError, toastSuccess } from "@/lib/toast";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type Values = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const glassCard =
    "rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]";
  const helpCard =
    "group rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl flex flex-col h-full";

  const inputWrap =
    "flex h-11 items-center gap-3 rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 transition-all duration-300 ease-out focus-within:shadow-xl";
  const input =
    "h-full w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 text-zinc-900";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const submit = async (values: Values) => {
    try {
      // Route API: POST /auth/forgotPasswords
      await api.post("/auth/forgotPasswords", { email: values.email });

      toastSuccess("Code sent to your email ✅", { autoClose: 2500 });

      const encoded = encodeURIComponent(values.email);
      router.push(`/verify-reset-code?email=${encoded}`);
    } catch (err: any) {
      const data = err?.response?.data;
      const msg =
        data?.message ||
        data?.msg ||
        (Array.isArray(data?.errors) ? data.errors?.[0]?.msg : null) ||
        "Failed to send code. Please try again.";
      toastError(String(msg), { autoClose: 4500 });
    }
  };

  const securityText = useMemo(() => {
    // خليها “code” بدل “link” عشان متوافق مع Route
    return "For your security, the verification code will expire after 30 minutes.";
  }, []);

  return (
    <div className="py-16">
      {/* Main Card */}
      <div className={`mx-auto w-full max-w-md p-6 text-center ${glassCard}`}>
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
          <FaLock size={18} />
        </div>

        <h1 className="text-xl font-semibold">Forgot your password?</h1>

        <p className="mt-2 text-sm text-zinc-600">
          Enter your registered email address and we’ll send you a verification code.
        </p>

        <form className="mt-6 space-y-4 text-left" onSubmit={handleSubmit(submit)}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-900">
              Email Address
            </label>

            <div className={inputWrap}>
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
              <input
                type="email"
                placeholder="Your registered email"
                className={input}
                autoComplete="email"
                {...register("email")}
              />
            </div>

            <div className="min-h-[16px]">
              {errors.email?.message ? (
                <p className="text-xs text-red-600 leading-4">{errors.email.message}</p>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full rounded-full bg-[var(--brand-600)] px-6 py-3 text-white font-semibold
              transition-all duration-300 ease-out hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95
              disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? "Sending..." : "Send Code"}
          </button>

          <p className="text-center text-sm text-zinc-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-[var(--brand-600)] underline underline-offset-4 hover:text-[var(--brand-700)] transition-all duration-300 ease-out"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>

      {/* Security Notice */}
      <div className={`mx-auto mt-6 w-full max-w-md p-4 ${glassCard}`}>
        <p className="text-sm font-semibold text-zinc-900">Security Notice</p>
        <p className="mt-1 text-sm text-zinc-600">{securityText}</p>
      </div>

      {/* Need additional help */}
      <div className="mx-auto mt-14 w-full max-w-6xl px-4">
        <h2 className="text-center text-lg font-semibold text-zinc-900">
          Need additional help?
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className={helpCard}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
              <FaHeadset size={18} />
            </div>

            <p className="text-center text-sm font-semibold text-zinc-900">
              Contact Support
            </p>
            <p className="mt-2 text-center text-sm text-zinc-600">
              Our support team is available 24/7 to assist you.
            </p>

            <div className="mt-auto pt-4 text-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
              >
                Contact Us →
              </Link>
            </div>
          </div>

          <div className={helpCard}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
              <FaCircleQuestion size={18} />
            </div>

            <p className="text-center text-sm font-semibold text-zinc-900">FAQs</p>
            <p className="mt-2 text-center text-sm text-zinc-600">
              Find answers to frequently asked questions about your account.
            </p>

            <div className="mt-auto pt-4 text-center">
              <Link
                href="/faqs"
                className="inline-flex items-center justify-center font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
              >
                View FAQs →
              </Link>
            </div>
          </div>

          <div className={`${helpCard} sm:col-span-2 lg:col-span-1`}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
              <MdEmail size={18} />
            </div>

            <p className="text-center text-sm font-semibold text-zinc-900">
              Email Not Received?
            </p>
            <p className="mt-2 text-center text-sm text-zinc-600">
              Check your spam folder or request a new code.
            </p>

            <div className="mt-auto pt-4 text-center">
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
              >
                Resend from here →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}