"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MenuItem =
  | { type: "item"; label: string; onClick: () => void; danger?: boolean }
  | { type: "sep" };

type Props = {
  items: MenuItem[];
  children: React.ReactNode;
  disabled?: boolean;
};

export default function ContextMenu({ items, children, disabled }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  // cursor position (where user right-clicked)
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  // actual menu position (after smart placement)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const onlyItems = useMemo(
    () =>
      items.filter((x) => x.type === "item") as Extract<
        MenuItem,
        { type: "item" }
      >[],
    [items]
  );

  // Close on outside click / ESC / scroll / resize
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    const onAnyScroll = () => setOpen(false);
    const onResize = () => setOpen(false);

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    window.addEventListener("scroll", onAnyScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
      window.removeEventListener("scroll", onAnyScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Smart placement like Chrome: left/right + up/down based on cursor & menu size
  useEffect(() => {
    if (!open) return;
    const el = menuRef.current;
    if (!el) return;

    const pad = 12;
    const rect = el.getBoundingClientRect();

    // Prefer:
    // - open to the right of cursor unless it overflows → then open to the left
    // - open below cursor unless it overflows → then open above
    let x =
      cursor.x + rect.width + pad > window.innerWidth
        ? cursor.x - rect.width
        : cursor.x;

    let y =
      cursor.y + rect.height + pad > window.innerHeight
        ? cursor.y - rect.height
        : cursor.y;

    // Clamp to viewport with padding
    x = Math.max(pad, Math.min(x, window.innerWidth - rect.width - pad));
    y = Math.max(pad, Math.min(y, window.innerHeight - rect.height - pad));

    if (x !== menuPos.x || y !== menuPos.y) {
      setMenuPos({ x, y });
    }
  }, [open, cursor.x, cursor.y, menuPos.x, menuPos.y, onlyItems.length]);

  function onContextMenu(e: React.MouseEvent) {
    if (disabled) return;
    e.preventDefault(); // ✅ hide browser menu

    const x = e.clientX;
    const y = e.clientY;

    setCursor({ x, y });
    // set an initial position quickly (so it appears instantly)
    setMenuPos({ x, y });
    setOpen(true);
  }

  return (
    <div ref={wrapRef} onContextMenu={onContextMenu} className="relative">
      {children}

      {open && (
        <div
          ref={menuRef}
          className={[
            "fixed z-[9999] w-[240px] overflow-hidden rounded-2xl",
            "bg-white/75 backdrop-blur-xl border border-white/30",
            "shadow-[0_18px_60px_rgba(0,0,0,0.18)]",
          ].join(" ")}
          style={{ left: menuPos.x, top: menuPos.y }}
          role="menu"
        >
          <div className="p-3 space-y-2">
            {items.map((it, idx) => {
              if (it.type === "sep") {
                return <div key={idx} className="my-1 h-px bg-zinc-200/70" />;
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    it.onClick();
                  }}
                  className={[
                    "w-full rounded-xl px-3 py-3 text-sm font-semibold text-left transition-all duration-200",
                    it.danger
                      ? "text-red-600 hover:bg-red-50"
                      : "text-zinc-800 hover:bg-[var(--brand-50)]/70 hover:text-[var(--brand-700)]",
                  ].join(" ")}
                >
                  {it.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}