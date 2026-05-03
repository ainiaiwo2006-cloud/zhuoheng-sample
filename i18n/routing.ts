import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // ── 8 supported locales ──────────────────────────────
  // zh = Simplified Chinese (default)
  // en = English (international)
  // es = Spanish (Spain + Latin America)
  // it = Italian (Italy — 18-year buyer relationship)
  // pt = Portuguese (Brazil + Portugal)
  // ko = Korean (South Korea)
  // ja = Japanese (Japan)
  // ar = Arabic (Middle East — RTL)
  locales: ["zh", "en", "es", "it", "pt", "ko", "ja", "ar"] as const,
  defaultLocale: "zh",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

// RTL locales — used by layout to set <html dir="rtl">
export const RTL_LOCALES: readonly Locale[] = ["ar"];
export function isRtl(locale: string): boolean {
  return RTL_LOCALES.includes(locale as Locale);
}

// Native display names for the language switcher
export const LOCALE_LABELS: Record<Locale, string> = {
  zh: "简体中文",
  en: "English",
  es: "Español",
  it: "Italiano",
  pt: "Português",
  ko: "한국어",
  ja: "日本語",
  ar: "العربية",
};

// Short labels (for compact switchers)
export const LOCALE_SHORT: Record<Locale, string> = {
  zh: "中",
  en: "EN",
  es: "ES",
  it: "IT",
  pt: "PT",
  ko: "KO",
  ja: "JA",
  ar: "ع",
};
