import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProductVisual } from "@/components/product/ProductVisual";

export async function OemCallout() {
  const t = await getTranslations("home.cta"); // reuse the cta-style copy minimally
  const locale = await getLocale();

  return (
    <section className="bg-bg border-t border-line">
      <div className="grid grid-cols-12 max-w-[1440px] mx-auto">
        <div className="col-span-12 lg:col-span-7 relative bg-ink min-h-[420px] lg:min-h-[560px]">
          <div className="absolute inset-0">
            <ProductVisual
              type="earring"
              palette={{ bg1: "#1A1A1A", bg2: "#3D332C", metal: "#C9A86A", accent: "#9A7D45" }}
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 flex items-center px-6 lg:px-16 py-16 lg:py-0 bg-bg">
          <div className="max-w-md">
            <p className="eyebrow">{locale === "zh" ? "OEM / ODM 主打定制" : "Custom OEM / ODM"}</p>

            <h2 className="mt-6 font-cnSerif text-[clamp(2rem,3.4vw,3rem)] text-ink leading-[1.15] font-medium">
              「定制系列」
            </h2>
            <p className="mt-3 font-serif italic text-ink-mute">
              Your design, our craftsmanship.
            </p>

            <p className={[
              "mt-7 text-[14px] text-ink-soft leading-loose",
              locale === "zh" ? "font-cn" : "",
            ].join(" ")}>
              {locale === "zh"
                ? "代工名创优品 · 迪士尼 · 三福 · 伶俐 · COBEN 等品牌，17 年制造经验。承接黄铜 / 紫铜耳饰、项链、手链等品类的 LOGO 印制、专属包装、原创设计全流程服务。"
                : "OEM partner of Miniso · Disney · Sanfu · Ling-Li · COBEN — 17 years of brass & copper manufacturing. Logo engraving, custom packaging and original design for earrings, necklaces, bracelets and more."}
            </p>

            <ul className="mt-7 space-y-2 text-[13px] text-ink-soft">
              <Row k="MOQ" v="120 pairs / 240 pcs" />
              <Row k={locale === "zh" ? "打样" : "Sampling"} v={locale === "zh" ? "14 天 · 30 打以上全退" : "14 days · refundable on 30+ doz orders"} />
              <Row k={locale === "zh" ? "生产" : "Production"} v={locale === "zh" ? "15–20 天 · 日产 1,500 打" : "15–20 days · daily output 1,500 doz"} />
              <Row k={locale === "zh" ? "电镀" : "Plating"} v={locale === "zh" ? "真金 · 0.03μm · 12 个月不变色" : "Real-gold · 0.03μm · 12-mo no tarnish"} />
            </ul>

            <Link href="/oem" className="btn btn-outline mt-10">
              {locale === "zh" ? "了解定制服务" : "Explore Custom Series"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex justify-between border-b border-line pb-2">
      <span>{k}</span><span className="font-medium">{v}</span>
    </li>
  );
}
