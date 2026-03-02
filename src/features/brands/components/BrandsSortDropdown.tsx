"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type Option = { label: string; value: string };

type Props = {
  label?: string;
  options: Option[];
  value?: string; // controlled
  defaultValue?: string; // uncontrolled
  onChange?: (value: string) => void;
  className?: string;
};

export default function BrandsSortDropdown({
  label = "Sort by:",
  options,
  value,
  defaultValue,
  onChange,
  className = "",
}: Props) {
  const initial = useMemo<Option>(() => {
    const v = value ?? defaultValue;
    return (
      options.find((o) => o.value === v) ??
      options[0] ??
      { label: "Featured", value: "featured" }
    );
  }, [options, value, defaultValue]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option>(initial);

  const wrapRef = useRef<HTMLDivElement | null>(null);

  // keep in sync for controlled mode
  useEffect(() => {
    if (value == null) return;
    const next = options.find((o) => o.value === value);
    if (next) setSelected(next);
  }, [value, options]);

  // close on outside click / esc
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative z-50 flex w-full items-center gap-3 sm:w-auto ${className}`}
    >
      <span className="shrink-0 text-sm text-zinc-600">{label}</span>

      {/* ✅ button + menu container (controls width) */}
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={[
            "relative h-12 w-full sm:min-w-[190px] rounded-full",
            "bg-white/70 backdrop-blur-md border border-white/40",
            "px-4 pr-10 text-sm font-semibold text-zinc-900 text-left",
            "shadow-[0_8px_32px_rgba(0,0,0,0.05)] outline-none",
            "transition-all duration-300 ease-out hover:shadow-xl",
            "focus:ring-4 focus:ring-[var(--brand-50)]",
          ].join(" ")}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {selected.label}

          <span
            className={[
              "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--brand-700)]",
              "transition-transform duration-300",
              open ? "rotate-180" : "rotate-0",
            ].join(" ")}
          >
            <ChevronDown size={18} />
          </span>
        </button>

        {/* ✅ menu width = button width (left-0 right-0) */}
        <div
          className={[
            "absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl",
            "bg-white border border-zinc-200",
            "shadow-[0_18px_60px_rgba(0,0,0,0.12)]",
            "transition-all duration-300 ease-out origin-top",
            open
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-[0.98] pointer-events-none",
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
                    onChange?.(opt.value);
                  }}
                  className={[
                    "w-full rounded-xl px-3 py-2 text-sm text-left transition-all duration-200",
                    "flex items-center justify-between",
                    active
                      ? "bg-[var(--brand-50)] text-[var(--brand-700)]"
                      : "text-zinc-700 hover:bg-[var(--brand-50)]/70 hover:text-[var(--brand-700)]",
                  ].join(" ")}
                >
                  <span>{opt.label}</span>
                  {active && (
                    <span className="text-[var(--brand-700)]">
                      <Check size={16} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}