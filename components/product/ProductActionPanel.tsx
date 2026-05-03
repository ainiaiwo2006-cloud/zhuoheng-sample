"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/lib/types";
import { findCollection } from "@/lib/data/taxonomies";
import { getProductI18n, getProductSubName, getProductSubDesc } from "@/lib/i18n/productI18n";

export function ProductActionPanel({ product: p }: { product: Product }) {
  const locale = useLocale();
  const tProduct = useTranslations("product");
  const tMaterial = useTranslations("material");

  const collection = p.collection ? findCollection(p.collection) : undefined;
  const i18n = getProductI18n(p, locale);
  const name = i18n.name;
  const desc = i18n.desc;
  const subName = getProductSubName(p, locale);
  const subDesc = getProductSubDesc(p, locale);

  return (
    <div className="lg:sticky lg:top-32">
      {collection && (
        <p className="text-[11px] tracking-wide3 uppercase text-red">
          {locale === "zh" ? collection.zh : collection.en}
        </p>
      )}
      <h1 className="mt-3 font-cnSerif text-3xl lg:text-4xl text-ink leading-tight">{name}</h1>
      {subName && <p className="mt-2 font-serif italic text-ink-mute text-lg">{subName}</p>}

      <p className="mt-6 text-[14px] text-ink-soft leading-loose">{desc}</p>
      {subDesc && (
        <p className={["mt-2 text-[13px] text-ink-mute leading-loose", locale === "zh" ? "" : "font-cn"].join(" ")}>
          {subDesc}
        </p>
      )}

      <ul className="mt-8 border-t border-ink">
        <Spec label={tProduct("specs.sku")}        value={p.sku} mono />
        <Spec label={tProduct("specs.material")}   value={tMaterial(p.material)} />
        <Spec label={tProduct("specs.plating")}    value={p.plating.join(" · ")} />
      </ul>
    </div>
  );
}

function Spec({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <li className="flex items-center justify-between gap-3 py-3 border-b border-line">
      <span className="text-[11px] uppercase tracking-wide3 text-ink-mute">{label}</span>
      <span className={["text-[13px] text-ink text-right", mono ? "font-mono" : ""].join(" ")}>{value}</span>
    </li>
  );
}
