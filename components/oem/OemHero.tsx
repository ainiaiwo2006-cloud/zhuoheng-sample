import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProductVisual } from "@/components/product/ProductVisual";

export async function OemHero() {
  const t = await getTranslations("oemPage.hero");
  return (
    <section className="relative bg-bg overflow-hidden border-b border-line">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="col-span-12 lg:col-span-7">
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-red" />
              {t("eyebrow")}
            </p>
            <h1 className="mt-6 h-display text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[1]">
              {t("titleA")}
              <span className="block text-red italic">{t("titleB")}</span>
              {t("titleC") && <span className="block">{t("titleC")}</span>}
            </h1>
            <p className="mt-8 text-base lg:text-lg text-ink-soft max-w-2xl leading-relaxed">
              {t("body")}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#oem-form" className="btn">
                {t("startBtn")} <span aria-hidden>→</span>
              </a>
              <Link href="/contact" className="btn btn-ghost">
                {t("talkBtn")}
              </Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 hidden lg:grid grid-cols-2 gap-3">
            {[
              { type: "ring" as const,    palette: { bg1: "#F5EFE5", bg2: "#D9C19A", metal: "#9A7D45", accent: "#5A3625" } },
              { type: "earring" as const, palette: { bg1: "#F8E8E0", bg2: "#E8C9B4", metal: "#D9A78F", accent: "#8E5436" } },
              { type: "pendant" as const, palette: { bg1: "#F4ECDD", bg2: "#C5A881", metal: "#7C5A3C", accent: "#3F2A18" } },
              { type: "necklace" as const, palette: { bg1: "#E8E5DF", bg2: "#9A8878", metal: "#3D332C", accent: "#2C2420" } },
            ].map((v, i) => (
              <div key={i} className="aspect-square bg-paper border border-line overflow-hidden">
                <ProductVisual type={v.type} palette={v.palette} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
