import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "On orders over $50",
  },
  {
    icon: RotateCcw,
    title: "30 Days Return",
    desc: "Satisfaction guaranteed",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% protected checkout",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "We’re here to help",
  },
];

export default function FeaturesBar() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] transition group-hover:bg-[var(--brand-600)] group-hover:text-white">
              <Icon size={22} />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-zinc-900">
                {item.title}
              </h4>
              <p className="text-xs text-zinc-500">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}