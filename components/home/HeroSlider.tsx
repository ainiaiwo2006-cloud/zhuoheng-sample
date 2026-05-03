"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductVisual } from "@/components/product/ProductVisual";
import type { Palette, VisualType } from "@/lib/types";

// CTF-style hero. Per user pref 2B: keeps the bilingual «中文 / English» series
// pairing as decorative typography (always shows both). Body copy and CTA label
// switch by current locale.

type Slide = {
  series: string;        // Chinese decorative title
  seriesEn: string;      // English decorative subtitle
  descZh: string;
  descEn: string;
  ctaZh: string;
  ctaEn: string;
  href: string;
  visual: { type: VisualType; palette: Palette };
};

const SLIDES: Slide[] = [
  {
    series: "「定制系列」",
    seriesEn: "Custom OEM / ODM",
    descZh: "您的设计 · 我们的工艺。从草图到成品，为全球品牌代工黄铜 / 紫铜饰品。单款 120 对起订 · 14 天打样 · 30 打以上打样费全退。",
    descEn: "Your design, our craftsmanship. From sketch to finished pieces — we manufacture brass and copper jewellery for global brands. MOQ 120 pairs · 14-day sampling · sample fee refunded on 30+ doz orders.",
    ctaZh: "探索定制服务",
    ctaEn: "Explore Custom Series",
    href: "/oem",
    visual: {
      type: "earring",
      palette: { bg1: "#1A1A1A", bg2: "#2C2420", metal: "#C9A86A", accent: "#9A7D45" },
    },
  },
  {
    series: "「耳饰主营」",
    seriesEn: "Earrings Specialist",
    descZh: "20,000+ 款式现货 · 每月 2,000 新款。日产 1,500 打，最大产能 2,000 打。代工名创优品 · 迪士尼 · 三福 · COBEN 等品牌。",
    descEn: "20,000+ in-stock styles · 2,000 new designs monthly. Daily output 1,500 dozen, peak 2,000 dozen. OEM partner of Miniso · Disney · Sanfu · COBEN.",
    ctaZh: "浏览批发目录",
    ctaEn: "Browse Catalogue",
    href: "/products",
    visual: {
      type: "earring",
      palette: { bg1: "#1A1A1A", bg2: "#3A4A6B", metal: "#D6CFC0", accent: "#7B86A6" },
    },
  },
  {
    series: "「品质工艺」",
    seriesEn: "Quality & Craft",
    descZh: "环保铜材 · 真金电镀 · 镀层 0.03μm · 12 个月不变色。SGS / 国检 NGTC / 欧盟 REACH / ISO9001 全套认证。",
    descEn: "Eco brass & copper · real-gold electroplating · 0.03 μm coating · 12 months no tarnish. Certified by SGS, NGTC, EU REACH, ISO 9001.",
    ctaZh: "参观工厂",
    ctaEn: "Visit the Factory",
    href: "/about",
    visual: {
      type: "bracelet",
      palette: { bg1: "#1A1A1A", bg2: "#5A3625", metal: "#C9A86A", accent: "#9A7D45" },
    },
  },
];

export function HeroSlider() {
  const locale = useLocale();
  const t = useTranslations("hero.stat");
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 9000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  function go(i: number) {
    setActive(i);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setActive((j) => (j + 1) % SLIDES.length), 9000);
  }

  return (
    <section className="bg-bg">
      <div className="max-w-[1440px] mx-auto px-0 lg:px-12">
        <div className="relative min-h-[560px] lg:min-h-[640px]">
          {SLIDES.map((s, i) => {
            const desc = locale === "zh" ? s.descZh : s.descEn;
            const cta  = locale === "zh" ? s.ctaZh  : s.ctaEn;
            return (
              <div
                key={s.series}
                aria-hidden={i !== active}
                className={[
                  "absolute inset-0 grid grid-cols-12 items-stretch",
                  "transition-opacity duration-700",
                  i === active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none",
                ].join(" ")}
              >
                <div className="col-span-12 lg:col-span-7 relative bg-ink min-h-[360px] lg:min-h-0">
                  <div className="absolute inset-0">
                    <ProductVisual type={s.visual.type} palette={s.visual.palette} />
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-5 flex items-center px-6 lg:px-16 py-16 lg:py-0 bg-bg">
                  <div className="max-w-md animate-fade-up">
                    {/* ── bilingual decorative title (kept regardless of locale) */}
                    <h1 className="font-cnSerif text-[clamp(2.4rem,4.2vw,4rem)] text-ink font-medium leading-[1.1]">
                      {s.series}
                    </h1>
                    <p className="font-serif italic text-ink-mute text-[15px] mt-3 tracking-wide">
                      {s.seriesEn}
                    </p>

                    <p className={[
                      "mt-8 text-[14px] text-ink-soft leading-loose",
                      locale === "zh" ? "font-cn" : "",
                    ].join(" ")}>
                      {desc}
                    </p>

                    <Link href={s.href as any} className="btn btn-outline mt-10">
                      {cta}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* dot pagination + stats */}
        <div className="py-10 flex flex-col items-center gap-6">
          <div className="hairline w-full max-w-[200px]" />
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i} onClick={() => go(i)} aria-label={`Slide ${i + 1}`}
                className={[
                  "rounded-full transition-all",
                  i === active ? "w-2 h-2 bg-ink" : "w-1.5 h-1.5 bg-ink/30 hover:bg-ink/60",
                ].join(" ")}
              />
            ))}
          </div>
          <dl className="grid grid-cols-4 gap-8 lg:gap-12 max-w-2xl">
            {[
              [t("sinceVal"),     t("since")],
              [t("stylesVal"),    t("styles")],
              [t("countriesVal"), t("countries")],
              [t("minOrderVal"), t("minOrder")],
            ].map(([v, k]) => (
              <div key={k} className="text-center">
                <dd className="num font-serif text-xl lg:text-2xl text-ink">{v}</dd>
                <dt className="text-[10px] uppercase tracking-wide3 text-ink-mute mt-1">{k}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
