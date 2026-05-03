import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { COLLECTIONS } from "@/lib/data/taxonomies";
import { ProductVisual } from "@/components/product/ProductVisual";
import { SectionHeader } from "./BestsellerStrip";
import type { Locale } from "@/i18n/routing";

export async function CollectionsGrid() {
  const t = await getTranslations("home.collections");
  const locale = (await getLocale()) as Locale;

  return (
    <section className="py-24 lg:py-32 bg-bg border-t border-line">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <SectionHeader title={t("title")} titleEn={t("eyebrow")} />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-8">
          {COLLECTIONS.slice(0, 4).map((c) => (
            <Link
              key={c.code}
              href={`/collections/${c.code}` as any}
              className="group block text-center"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-paper">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                  <ProductVisual
                    type="necklace"
                    palette={{
                      bg1: c.heroPalette.bg1,
                      bg2: c.heroPalette.bg2,
                      metal: c.heroPalette.metal,
                      accent: c.heroPalette.accent,
                    }}
                  />
                </div>
              </div>
              <h3 className="mt-6 font-cnSerif text-[20px] text-ink group-hover:text-red transition-colors">
                {locale === "zh" ? c.zh : c.en}
              </h3>
              <p className="mt-1 font-serif italic text-[12px] text-ink-mute">
                {locale === "zh" ? c.en : c.zh}
              </p>
              <p className="mt-3 text-[12px] text-ink-mute leading-relaxed max-w-[240px] mx-auto">
                {locale === "zh" ? c.tagline.zh : c.tagline.en}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link href="/collections" className="btn btn-outline">
            {t("more")}
          </Link>
        </div>
      </div>
    </section>
  );
}
