import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// Static dispatch — avoids template-literal dynamic import which compiles to
// __dirname-based code that breaks in Vercel Edge runtime.
const loaders = {
  zh: () => import("../messages/zh.json"),
  en: () => import("../messages/en.json"),
  es: () => import("../messages/es.json"),
  it: () => import("../messages/it.json"),
  pt: () => import("../messages/pt.json"),
  ko: () => import("../messages/ko.json"),
  ja: () => import("../messages/ja.json"),
  ar: () => import("../messages/ar.json"),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? (requested as keyof typeof loaders)
    : (routing.defaultLocale as keyof typeof loaders);
  const mod = await loaders[locale]();
  return { locale, messages: mod.default };
});
