import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
export default function SignUpForm() {
  const inputWrap =
    "flex h-11 lg:h-10 items-center gap-3 rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 transition-all duration-300 ease-out focus-within:shadow-xl";
  const input =
    "h-full w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 text-zinc-900";

  const link =
    "font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]";

  return (
    <form className="space-y-4 lg:space-y-3">
        
      {/* Social buttons (side by side) */}
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

      {/* First + Last name */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-900">
            First Name <span className="text-[var(--brand-600)]">*</span>
          </label>
          <div className={inputWrap}>
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
            <input placeholder="John" className={input} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-900">
            Last Name <span className="text-[var(--brand-600)]">*</span>
          </label>
          <div className={inputWrap}>
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
            <input placeholder="Doe" className={input} />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900">
          Email Address <span className="text-[var(--brand-600)]">*</span>
        </label>
        <div className={inputWrap}>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
          <input type="email" placeholder="john.doe@example.com" className={input} />
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900">
          Phone Number
        </label>
        <div className={inputWrap}>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
          <input placeholder="+20 1xx xxx xxxx" className={input} />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900">
          Password <span className="text-[var(--brand-600)]">*</span>
        </label>
        <div className={inputWrap}>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
          <input type="password" placeholder="Create a strong password" className={input} />
          <button
            type="button"
            className="text-xs text-zinc-500 transition-all duration-300 ease-out hover:text-zinc-900"
            aria-label="Toggle password visibility"
          >
            👁
          </button>
        </div>

        {/* Strength hint (UI only) */}
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-[var(--brand-600)]/70" />
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Must be at least 8 characters</span>
            <span>Weak</span>
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900">
          Confirm Password <span className="text-[var(--brand-600)]">*</span>
        </label>
        <div className={inputWrap}>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
          <input type="password" placeholder="Confirm your password" className={input} />
          <button
            type="button"
            className="text-xs text-zinc-500 transition-all duration-300 ease-out hover:text-zinc-900"
            aria-label="Toggle password visibility"
          >
            👁
          </button>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 pt-1">
        <label className="flex items-start gap-2 text-sm text-zinc-600">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--brand-600)]" />
          <span>
            I&apos;d like to receive promotional emails about new products, discounts, and offers.
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm text-zinc-600">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--brand-600)]" />
          <span>
            I agree to the{" "}
            <a href="#" className={link}>Terms of Service</a>{" "}
            and{" "}
            <a href="#" className={link}>Privacy Policy</a>
            <span className="text-[var(--brand-600)]"> *</span>
          </span>
        </label>
      </div>

      {/* Primary CTA */}
      <button
        type="button"
        className="
          w-full rounded-full bg-[var(--brand-600)]
          px-6 py-3 lg:py-2.5 text-white font-semibold
          transition-all duration-300 ease-out
          hover:bg-[var(--brand-700)] hover:scale-105
          active:scale-95
        "
      >
        Create My Account
      </button>
    </form>
  );
}