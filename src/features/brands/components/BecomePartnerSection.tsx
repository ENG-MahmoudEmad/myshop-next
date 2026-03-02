export default function BecomePartnerSection() {
  return (
    <section className="mt-20">
      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-[var(--brand-100)]/60 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-10">
        
        <div className="space-y-4 max-w-xl">
          <h3 className="text-2xl font-extrabold text-[var(--brand-700)]">
            Want to become a brand partner?
          </h3>

          <p className="text-sm text-zinc-700 leading-relaxed">
            Join our growing marketplace and showcase your products to thousands of customers.
          </p>

          <ul className="space-y-2 text-sm text-zinc-700">
            <li>✔ Access to active customers</li>
            <li>✔ Dedicated brand support</li>
            <li>✔ Marketing opportunities</li>
            <li>✔ Streamlined fulfillment</li>
          </ul>

          <button className="mt-4 rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95">
            Apply as Partner
          </button>
        </div>
      </div>
    </section>
  );
}