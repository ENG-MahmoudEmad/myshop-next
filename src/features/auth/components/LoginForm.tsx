export default function LoginForm() {
    const inputWrap =
    "flex h-11 lg:h-10 items-center gap-3 rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 transition-all duration-300 ease-out focus-within:shadow-xl";
  const input =
    "h-full w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 text-zinc-900";

  return (
    <form className="space-y-4 lg:space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900">
          Email Address
        </label>
        <div className={inputWrap}>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
          <input type="email" placeholder="Enter your email" className={input} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-zinc-900">
            Password
          </label>
          <a
            href="/forgot-password"
            className="text-sm font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
          >
            Forgot Password?
          </a>
        </div>

        <div className={inputWrap}>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
          <input
            type="password"
            placeholder="Enter your password"
            className={input}
          />
          <button
            type="button"
            className="text-xs text-zinc-500 transition-all duration-300 ease-out hover:text-zinc-900"
            aria-label="Toggle password visibility"
          >
            👁
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-600">
        <input type="checkbox" className="h-4 w-4 accent-[var(--brand-600)]" />
        Keep me signed in
      </label>

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
        Sign In
      </button>
    </form>
  );
}