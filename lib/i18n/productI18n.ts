// Per-locale product copy lookup with sensible fallback chain.
//
// Order of preference:
//   1. requested locale (if real translation, not a __TODO__ placeholder)
//   2. en (if real translation)
//   3. zh (always present — source of truth)
//
// This means: if a SKU's English / Spanish / Arabic translation hasn't been
// filled in yet, the user sees the Chinese original (a real product
// description) rather than a "__TODO_en__" debug marker.

import type { Product, Locale, ProductI18n } from "../types";

// Detects the placeholder format the import script writes for missing
// translations: "__TODO_en__ 中文原文"
function isPlaceholder(s?: string): boolean {
  return !!s && s.startsWith("__TODO_");
}

function isRealI18n(b: ProductI18n | undefined): boolean {
  return !!b && !isPlaceholder(b.name) && !isPlaceholder(b.desc);
}

export function getProductI18n(p: Product, locale: string): ProductI18n {
  const l = locale as Locale;
  const requested = p.i18n[l];
  if (isRealI18n(requested)) return requested!;
  if (isRealI18n(p.i18n.en)) return p.i18n.en;
  return p.i18n.zh;
}

/** For detail page subtitle: show contrast in OTHER language (en if current is
 *  zh, otherwise zh). Skips placeholder fallbacks. */
export function getProductNamePair(p: Product, locale: string) {
  const primary = getProductI18n(p, locale).name;
  const altRaw = locale === "zh" ? p.i18n.en?.name : p.i18n.zh?.name;
  const fallback = altRaw && !isPlaceholder(altRaw) ? altRaw : undefined;
  return { primary, fallback };
}

/** Get a subline (alternate language) — returns undefined if it would be a
 *  placeholder so the caller can skip rendering the subline entirely. */
export function getProductSubName(p: Product, locale: string): string | undefined {
  const raw = locale === "zh" ? p.i18n.en?.name : p.i18n.zh?.name;
  return raw && !isPlaceholder(raw) ? raw : undefined;
}
export function getProductSubDesc(p: Product, locale: string): string | undefined {
  const raw = locale === "zh" ? p.i18n.en?.desc : p.i18n.zh?.desc;
  return raw && !isPlaceholder(raw) ? raw : undefined;
}
