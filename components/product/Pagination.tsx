"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const t = useTranslations("pagination");
  const pathname = usePathname();
  const params = useSearchParams();

  if (pageCount <= 1) return null;

  function urlFor(p: number) {
    const next = new URLSearchParams(params.toString());
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  const pages: (number | "…")[] = [];
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-12" aria-label="Pagination">
      <PaginationLink href={urlFor(page - 1)} disabled={page === 1}>
        {t("prev")}
      </PaginationLink>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="num px-3 py-2 text-ink-mute text-[13px]">…</span>
        ) : (
          <PaginationLink key={p} href={urlFor(p)} active={p === page}>
            {p}
          </PaginationLink>
        )
      )}
      <PaginationLink href={urlFor(page + 1)} disabled={page === pageCount}>
        {t("next")}
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href, children, active, disabled,
}: {
  href: string; children: React.ReactNode;
  active?: boolean; disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className="num px-3 py-2 text-[13px] text-ink-faint cursor-not-allowed">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={[
        "num px-3 py-2 text-[13px] transition-colors",
        active ? "text-red font-semibold border-b border-red" : "text-ink hover:text-red",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
