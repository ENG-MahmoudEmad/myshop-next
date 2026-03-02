import Link from "next/link";

import AuthMarketingSide from "@/features/auth/components/AuthMarketingSide";
import AuthSocialButtons from "@/features/auth/components/AuthSocialButtons";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginScreen() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* subtle brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[var(--brand-100)]/35 blur-3xl" />
        <div className="absolute -bottom-44 -left-44 h-[520px] w-[520px] rounded-full bg-[var(--brand-50)]/40 blur-3xl" />
        <div className="absolute -bottom-52 -right-52 h-[560px] w-[560px] rounded-full bg-[var(--brand-200)]/30 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 lg:py-8">
        <div className="grid gap-8 lg:min-h-[calc(100vh-64px)] lg:items-center lg:grid-cols-2">
          {/* Left side (desktop only) */}
          <div className="hidden lg:block">
            <AuthMarketingSide />
          </div>

          {/* Right side */}
          <section className="lg:justify-self-end">
            <div className="mx-auto w-full max-w-md rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-5 lg:p-5 xl:p-6 lg:mx-0">
              <header className="mb-6 text-center">
                <div className="mx-auto mb-3 w-fit rounded-full bg-white/65 backdrop-blur-md border border-white/20 px-5 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
                  <span className="text-lg font-semibold tracking-tight">
                    <span className="text-[var(--brand-600)]">my</span>
                    <span className="text-zinc-900">shop</span>
                  </span>
                </div>

                <h1 className="text-2xl font-semibold">Welcome back</h1>
                <p className="mt-2 text-sm text-zinc-600">
                  Sign in to continue shopping.
                </p>
              </header>

              <AuthSocialButtons />

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-xs text-zinc-500">
                  OR CONTINUE WITH EMAIL
                </span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              <LoginForm />

              <div className="mt-6 border-t border-zinc-200 pt-4 text-center">
                <p className="text-sm text-zinc-600">
                  New to myshop?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-[var(--brand-600)] underline underline-offset-4 hover:text-[var(--brand-700)] transition-all duration-300 ease-out"
                  >
                    Create an account
                  </Link>
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--brand-600)]" />
                    SSL Secured
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--brand-600)]" />
                    50K+ Users
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--brand-600)]" />
                    4.9 Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile marketing hint */}
            <div className="mt-6 lg:hidden mx-auto w-full max-w-md">
              <div className="rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-5">
                <p className="text-sm font-semibold text-zinc-900">
                  Fashion & tech, delivered fast
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Secure payment • Easy returns • 24/7 support
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}