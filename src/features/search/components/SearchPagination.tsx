"use client";

export default function SearchPagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }).map((_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2">
      <PageBtn disabled={page === 1} onClick={() => onChange(Math.max(1, page - 1))}>
        ‹
      </PageBtn>

      {pages.map((p) => (
        <PageBtn key={p} active={p === page} onClick={() => onChange(p)}>
          {p}
        </PageBtn>
      ))}

      <PageBtn
        disabled={page === totalPages}
        onClick={() => onChange(Math.min(totalPages, page + 1))}
      >
        ›
      </PageBtn>
    </div>
  );
}

function PageBtn({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "grid h-10 min-w-10 place-items-center rounded-2xl px-3 text-sm font-semibold transition-all duration-300 ease-out",
        active
          ? "bg-[var(--brand-600)] text-white"
          : "bg-white/55 text-zinc-800 ring-1 ring-white/20 hover:-translate-y-1 hover:shadow-xl",
        disabled ? "opacity-40 cursor-not-allowed hover:translate-y-0 hover:shadow-none" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}