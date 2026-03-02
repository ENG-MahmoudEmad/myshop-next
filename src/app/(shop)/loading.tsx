export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999]">
      {/* Glass Backdrop */}
      <div className="absolute inset-0 bg-white/35 backdrop-blur-xl" />

      {/* Brand glow effects */}
      <div className="pointer-events-none absolute -top-24 -right-28 h-72 w-72 rounded-full bg-[var(--brand-100)]/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[var(--brand-50)]/60 blur-3xl" />

      {/* Animated Top Bar */}
      <div className="absolute left-0 top-0 h-[3px] w-full overflow-hidden">
        <div
          className="h-full w-1/3 animate-myshopbar"
          style={{
            background:
              "linear-gradient(90deg, var(--brand-600), var(--brand-700))",
            boxShadow: "0 0 14px rgba(216, 67, 21, 0.35)",
          }}
        />
      </div>

      {/* Center Loader Card */}
      <div className="grid h-full place-items-center px-4">
        <div className="relative w-full max-w-sm rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_18px_60px_rgba(0,0,0,0.12)] p-7 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-white/60 relative">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--brand-700)] border-r-[var(--brand-600)] animate-spin" />
          </div>

          <div className="text-lg font-extrabold text-zinc-900">Loading...</div>
          <div className="mt-1 text-sm text-zinc-600">
            Preparing your experience
          </div>

          {/* subtle skeleton lines */}
          <div className="mt-5 space-y-3">
            <div className="h-3 w-4/5 mx-auto rounded-full bg-white/70 animate-pulse" />
            <div className="h-3 w-3/5 mx-auto rounded-full bg-white/70 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}