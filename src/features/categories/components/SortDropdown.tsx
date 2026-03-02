"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Option = { label: string; value: string };

type Props = {
  label?: string;
  options: Option[];
  defaultValue?: string;
};

export default function SortDropdown({
  label = "Sort by:",
  options,
  defaultValue,
}: Props) {
  const initial = useMemo(() => {
    return (
      options.find((o) => o.value === defaultValue) ??
      options[0] ??
      { label: "Featured", value: "Featured" }
    );
  }, [options, defaultValue]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option>(initial);

  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="flex items-center gap-3" ref={wrapRef}>
      <span className="text-sm text-zinc-600">{label}</span>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={[
            "h-10 min-w-[190px] rounded-full",
            "bg-white/65 backdrop-blur-md border border-white/20",
            "px-4 pr-10 text-sm font-semibold text-zinc-900 text-left",
            "shadow-[0_8px_32px_rgba(0,0,0,0.05)] outline-none",
            "transition-all duration-300 ease-out hover:shadow-xl",
            "focus:ring-4 focus:ring-[var(--brand-50)]",
          ].join(" ")}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {selected.label}
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--brand-700)]">
            ▾
          </span>
        </button>

        {open && (
          <div
            className={[
              "absolute right-0 z-50 mt-2 w-full overflow-hidden rounded-2xl",
              "bg-white/75 backdrop-blur-xl border border-white/30",
              "shadow-[0_18px_60px_rgba(0,0,0,0.12)]",
            ].join(" ")}
            role="listbox"
          >
            <div className="p-3 space-y-1.5">
              {options.map((opt) => {
                const active = opt.value === selected.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSelected(opt);
                      setOpen(false);
                    }}
                    className={[
                      "w-full rounded-xl px-3 py-2 text-sm text-left transition-all duration-200",
                      active
                        ? "bg-[var(--brand-50)] text-[var(--brand-700)]"
                        : "text-zinc-700 hover:bg-[var(--brand-50)]/70 hover:text-[var(--brand-700)]",
                    ].join(" ")}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}