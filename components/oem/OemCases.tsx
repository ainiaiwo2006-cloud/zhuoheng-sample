import { getTranslations, getLocale } from "next-intl/server";

const SERVICES_DATA = [
  {
    tier: "Tier I",
    titleEn: "Logo & Stamp",
    titleZh: "Logo · 印记",
    moq: "200 pcs",
    bulletsEn: [
      "Laser-engrave your logo on existing styles",
      "Custom hallmark stamps",
      "Branded earring cards & pouches",
      "Fastest turnaround — 14 days",
    ],
    bulletsZh: [
      "在现有款式上激光刻印 Logo",
      "定制印记钢印",
      "品牌耳饰卡纸 / 收纳袋",
      "最快交期 — 14 天",
    ],
    accent: "border-line",
  },
  {
    tier: "Tier II",
    titleEn: "Packaging Customisation",
    titleZh: "包装定制",
    moq: "500 pcs",
    bulletsEn: [
      "Custom outer box, inner tray, dust bag",
      "Branded warranty cards & care guides",
      "Foil stamping / embossing options",
      "Eco-packaging available",
    ],
    bulletsZh: [
      "外盒 / 内托 / 防尘袋全套定制",
      "品牌质保卡 + 保养指南",
      "可烫金、压凸",
      "支持环保包装方案",
    ],
    accent: "border-red bg-red/5",
    featured: true,
  },
  {
    tier: "Tier III",
    titleEn: "Exclusive Design",
    titleZh: "专属设计",
    moq: "500 pcs / design",
    bulletsEn: [
      "From sketches to 3D renders to finished product",
      "Original moulds — yours exclusively",
      "Material & stone sourcing service",
      "30–45 days production cycle",
    ],
    bulletsZh: [
      "草图 → 3D 渲染 → 成品全流程",
      "独立开模 — 仅供您使用",
      "材料与宝石采购协助",
      "30–45 天生产周期",
    ],
    accent: "border-line",
  },
];

export async function OemCases() {
  const t = await getTranslations("oemPage.cases");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();

  return (
    <section className="py-20 lg:py-28 bg-paper border-y border-line">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <header className="max-w-3xl mb-16">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-5 h-display text-3xl lg:text-5xl">{t("title")}</h2>
          <p className="mt-4 text-ink-mute leading-relaxed">{t("body")}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SERVICES_DATA.map((s) => {
            const title = locale === "zh" ? s.titleZh : s.titleEn;
            const titleSub = locale === "zh" ? s.titleEn : s.titleZh;
            const bullets = locale === "zh" ? s.bulletsZh : s.bulletsEn;
            return (
              <div
                key={s.tier}
                className={[
                  "p-8 lg:p-10 bg-paper border-2 transition-all duration-300",
                  s.accent,
                  s.featured ? "lg:scale-[1.02]" : "",
                ].join(" ")}
              >
                <p className="font-serif italic text-red text-sm">{s.tier}</p>
                <h3 className="mt-3 font-serif text-2xl text-ink">{title}</h3>
                <p className="mt-1 text-[13px] text-ink-mute">{titleSub}</p>

                <div className="mt-6 pb-6 border-b border-line">
                  <p className="text-[10px] uppercase tracking-wide3 text-ink-mute">{tCommon("moqShort")}</p>
                  <p className="num mt-1 font-serif text-2xl text-ink">{s.moq}</p>
                </div>

                <ul className="mt-6 space-y-3">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[14px] text-ink-soft">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-red shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
