import { FaLock } from "react-icons/fa";
import { FaHeadset, FaCircleQuestion } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function ForgotPasswordScreen() {
  const glassCard =
    "rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]";
          const helpCard =
        "group rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl flex flex-col h-full";
  
  return (
    <div className="py-16">
      {/* Main Card */}
      <div className={`mx-auto w-full max-w-md p-6 text-center ${glassCard}`}>
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
          <FaLock size={18} />
        </div>

        <h1 className="text-xl font-semibold">Forgot your password?</h1>

        <p className="mt-2 text-sm text-zinc-600">
          Enter your registered email address and we’ll send you a link to reset
          your password.
        </p>

        <form className="mt-6 space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-900">
              Email Address
            </label>

            <div className="flex h-11 items-center gap-3 rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 transition-all duration-300 ease-out focus-within:shadow-xl">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
              <input
                type="email"
                placeholder="Your registered email"
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 text-zinc-900"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-full bg-[var(--brand-600)] px-6 py-3 text-white font-semibold transition-all duration-300 ease-out hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95"
          >
            Send Reset Link
          </button>

          <p className="text-center text-sm text-zinc-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="font-semibold text-[var(--brand-600)] underline underline-offset-4 hover:text-[var(--brand-700)] transition-all duration-300 ease-out"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>

      {/* Security Notice */}
      <div className={`mx-auto mt-6 w-full max-w-md p-4 ${glassCard}`}>
        <p className="text-sm font-semibold text-zinc-900">Security Notice</p>
        <p className="mt-1 text-sm text-zinc-600">
          For your security, the reset link will expire after 30 minutes.
        </p>
      </div>

      {/* Need additional help */}
      <div className="mx-auto mt-14 w-full max-w-6xl px-4">
        <h2 className="text-center text-lg font-semibold text-zinc-900">
          Need additional help?
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Contact Support */}
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
              <a
                href="/contact"
                className="inline-flex items-center justify-center font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
              >
                Contact Us →
              </a>
            </div>
          </div>

          {/* FAQs */}
          <div className={helpCard}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
              <FaCircleQuestion size={18} />
            </div>

            <p className="text-center text-sm font-semibold text-zinc-900">
              FAQs
            </p>
            <p className="mt-2 text-center text-sm text-zinc-600">
              Find answers to frequently asked questions about your account.
            </p>

            <div className="mt-auto pt-4 text-center">
              <a
                href="/faqs"
                className="inline-flex items-center justify-center font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
              >
                View FAQs →
              </a>
            </div>
          </div>

          {/* Email Not Received */}
          <div className={`${helpCard} sm:col-span-2 lg:col-span-1`}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
              <MdEmail size={18} />
            </div>

            <p className="text-center text-sm font-semibold text-zinc-900">
              Email Not Received?
            </p>
            <p className="mt-2 text-center text-sm text-zinc-600">
              Check your spam folder or request a new reset link.
            </p>

            <div className="mt-auto pt-4 text-center">
              <button
                type="button"
                className="inline-flex items-center justify-center font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
              >
                Resend Email →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}