"use client";

import { X } from "lucide-react";

const GLASS =
  "bg-white/75 backdrop-blur-xl border border-white/25 shadow-[0_18px_60px_rgba(0,0,0,0.12)]";

export default function FiltersDrawer({
  open,
  onClose,
  children,
  title = "Filters",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div
      className={[
        "fixed inset-0 z-[80] transition-all duration-300 ease-out",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-hidden={!open}
    >
      <div
        className={[
          "absolute inset-0 bg-black/30 transition-all duration-300 ease-out",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <div
        className={[
          "absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-[28px] p-4 transition-all duration-300 ease-out",
          GLASS,
          open ? "translate-y-0" : "translate-y-6",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between gap-3 pb-3">
          <h3 className="text-base font-extrabold text-zinc-900">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/60 text-zinc-800 ring-1 ring-white/25 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(85vh-72px)] overflow-auto pr-1">{children}</div>
      </div>
    </div>
  );
}