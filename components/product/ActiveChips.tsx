"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  findCategory, findMaterial, findPlating, findStyle, findCollection,
} from "@/lib/data/taxonomies";

export function ActiveChips() {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const cat        = params.get("cat") ?? params.get("category");
  const material   = params.get("material");
  const plating    = params.get("plating");
  const style      = params.get("style");
  const collection = params.get("collection");
  const q          = params.get("q");

  function clear(key: string | string[]) {
    const next = new URLSearchParams(params.toString());
    (Array.isArray(key) ? key : [key]).forEach((k) => next.delete(k));
    next.delete("page");
    const qs = next.toString();
    router.push((qs ? `${pathname}?${qs}` : pathname) as any);
  }

  const lbl = (zh: string, en: string) => (locale === "zh" ? zh : en);

  const chips: { key: string; label: string; onClear: () => void }[] = [];
  if (cat) {
    const c = findCategory(cat);
    if (c) chips.push({ key: cat, label: lbl(c.zh, c.en), onClear: () => clear(["cat", "category"]) });
  }
  if (material) {
    const m = findMaterial(material);
    if (m) chips.push({ key: material, label: lbl(m.zh, m.en), onClear: () => clear("material") });
  }
  if (plating) {
    const p = findPlating(plating);
    if (p) chips.push({ key: plating, label: lbl(p.zh, p.en), onClear: () => clear("plating") });
  }
  if (style) {
    const s = findStyle(style);
    if (s) chips.push({ key: style, label: lbl(s.zh, s.en), onClear: () => clear("style") });
  }
  if (collection) {
    const c = findCollection(collection);
    if (c) chips.push({ key: collection, label: lbl(c.zh, c.en), onClear: () => clear("collection") });
  }
  if (q) chips.push({ key: q, label: `"${q}"`, onClear: () => clear("q") });

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center flex-wrap gap-2 pb-4 border-b border-line">
      <span className="text-[11px] uppercase tracking-wide3 text-ink-mute mr-1">{t("filters")}:</span>
      {chips.map((c) => (
        <button key={c.key} onClick={c.onClear}
          className="tag tag-pill text-ink hover:text-red transition-colors group">
          {c.label}
          <span className="ml-1.5 text-ink-mute group-hover:text-red">×</span>
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={() => clear(["cat", "category", "material", "plating", "style", "collection", "q"])}
          className="text-[11px] tracking-wide2 uppercase text-ink-mute hover:text-red ml-2"
        >
          {t("clearAll")}
        </button>
      )}
    </div>
  );
}
