"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, MATERIALS, PLATINGS, STYLES, COLLECTIONS } from "@/lib/data/taxonomies";
import { useCallback, useEffect, useState } from "react";

type Counts = {
  category?: Record<string, number>;
  material?: Record<string, number>;
  plating?:  Record<string, number>;
  style?:    Record<string, number>;
  collection?: Record<string, number>;
};

export function FilterSidebar({ counts }: { counts: Counts }) {
  const locale = useLocale();
  const t = useTranslations("filter");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  // close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname, params]);

  // lock body scroll when drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const setParam = useCallback((key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (!value || next.get(key) === value) next.delete(key);
    else next.set(key, value);
    next.delete("page");
    const qs = next.toString();
    router.push((qs ? `${pathname}?${qs}` : pathname) as any);
  }, [router, pathname, params]);

  const active = {
    category: params.get("category") ?? params.get("cat") ?? undefined,
    material: params.get("material") ?? undefined,
    plating: params.get("plating") ?? undefined,
    style: params.get("style") ?? undefined,
    collection: params.get("collection") ?? undefined,
  };

  // count active filters for the trigger button badge
  const activeCount = Object.values(active).filter(Boolean).length;

  const lbl = (zh: string, en: string) => (locale === "zh" ? zh : en);
  const sub = (zh: string, en: string) => (locale === "zh" ? en : zh);

  const filterContent = (
    <div className="space-y-9">
      <FilterGroup title={t("category")} titleEn={t("categoryEn")}>
        {CATEGORIES.map((c) => (
          <FilterRow key={c.code} label={lbl(c.zh, c.en)} sub={sub(c.zh, c.en)}
            count={counts.category?.[c.code]}
            checked={active.category === c.code}
            onClick={() => setParam("cat", c.code)} />
        ))}
      </FilterGroup>

      <FilterGroup title={t("material")} titleEn={t("materialEn")}>
        {MATERIALS.map((m) => (
          <FilterRow key={m.code} label={lbl(m.zh, m.en)} sub={sub(m.zh, m.en)}
            count={counts.material?.[m.code]}
            checked={active.material === m.code}
            onClick={() => setParam("material", m.code)} />
        ))}
      </FilterGroup>

    </div>
  );

  const triggerLabel = locale === "zh" ? "筛选" : "Filter";
  const closeLabel = locale === "zh" ? "关闭" : "Close";

  return (
    <>
      {/* Desktop sidebar — visible at lg+ */}
      <aside className="hidden lg:block">
        {filterContent}
      </aside>

      {/* Mobile trigger — visible below lg */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden sticky top-2 z-30 inline-flex items-center gap-2 px-4 py-2
                   bg-ink text-bg text-[13px] tracking-wide2 rounded-full shadow-soft
                   hover:bg-red transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 6h18M6 12h12M10 18h4" strokeLinecap="round" />
        </svg>
        <span>{triggerLabel}</span>
        {activeCount > 0 && (
          <span className="num bg-red text-white text-[10px] rounded-full
                           min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Mobile drawer (left-slide, full screen) */}
      <div
        className={[
          "lg:hidden fixed inset-0 z-50 overflow-hidden transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-ink/40"
          onClick={() => setOpen(false)}
        />
        <div
          className={[
            "absolute top-0 left-0 h-full w-[88vw] max-w-[380px] bg-bg shadow-soft",
            "transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
            "flex flex-col",
          ].join(" ")}
          role="dialog" aria-modal="true"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <span className="font-cnSerif text-[16px] text-ink">{triggerLabel}</span>
            <button
              type="button" aria-label={closeLabel}
              onClick={() => setOpen(false)}
              className="w-8 h-8 inline-flex items-center justify-center text-ink-soft hover:text-red"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            {filterContent}
          </div>
        </div>
      </div>
    </>
  );
}

function FilterGroup({ title, titleEn, children }: { title: string; titleEn: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-ink pb-3">
        <p className="text-[10px] tracking-wide3 uppercase text-ink font-semibold">{titleEn}</p>
        <p className="text-[11px] text-ink-mute">{title}</p>
      </div>
      <ul className="mt-3 space-y-1">{children}</ul>
    </div>
  );
}

function FilterRow({
  label, sub, count, checked, onClick, swatch,
}: {
  label: string; sub: string; count?: number;
  checked: boolean; onClick: () => void;
  swatch?: string;
}) {
  return (
    <li>
      <button
        type="button" onClick={onClick}
        className={[
          "w-full text-left flex items-center justify-between gap-2 py-2 px-1 text-[13px] rounded-sm",
          "hover:text-red transition-colors",
          checked ? "text-red font-medium" : "text-ink",
        ].join(" ")}
      >
        <span className="flex items-center gap-2 min-w-0">
          {swatch && (
            <span aria-hidden className="inline-block w-3 h-3 rounded-full border border-line"
              style={{ background: swatch }} />
          )}
          <span className="truncate">{label}</span>
          <span className="text-[11px] text-ink-mute truncate">{sub}</span>
        </span>
        {typeof count === "number" && (
          <span className="num text-[11px] text-ink-mute">({count})</span>
        )}
      </button>
    </li>
  );
}
