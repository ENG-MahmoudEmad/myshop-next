export default function AuthSocialButtons() {
  const base =
    "w-full rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 py-3 text-sm font-semibold text-zinc-900 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl";

  return (
    <div className="space-y-3">
      <button type="button" className={base}>
        Continue with Google
      </button>
      <button type="button" className={base}>
        Continue with Facebook
      </button>
    </div>
  );
}