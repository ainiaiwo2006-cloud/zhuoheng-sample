import { getTranslations } from "next-intl/server";

export async function OemProcess() {
  const t = await getTranslations("oemPage.process");
  const tSteps = await getTranslations("oemPage.process_steps");

  const STEPS = [
    { no: "01", title: tSteps("step1Title"), body: tSteps("step1Body"), days: "Day 0" },
    { no: "02", title: tSteps("step2Title"), body: tSteps("step2Body"), days: "Day 1–5" },
    { no: "03", title: tSteps("step3Title"), body: tSteps("step3Body"), days: "Day 6–14" },
    { no: "04", title: tSteps("step4Title"), body: tSteps("step4Body"), days: "Day 15–18" },
    { no: "05", title: tSteps("step5Title"), body: tSteps("step5Body"), days: "Day 19–45" },
    { no: "06", title: tSteps("step6Title"), body: tSteps("step6Body"), days: "Day 46+" },
  ];

  return (
    <section className="py-20 lg:py-28 border-t border-line">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <header className="max-w-3xl">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-5 h-display text-3xl lg:text-5xl">{t("title")}</h2>
          <p className="mt-4 text-ink-mute leading-relaxed">{t("body")}</p>
        </header>

        <ol className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {STEPS.map((s) => (
            <li key={s.no} className="relative">
              <div className="flex items-baseline gap-4 border-t border-ink pt-5">
                <span className="font-serif italic text-3xl text-red">{s.no}</span>
                <div className="flex-1">
                  <h3 className="font-serif text-xl text-ink leading-tight">{s.title}</h3>
                </div>
                <span className="text-[10px] uppercase tracking-wide3 text-ink-mute">{s.days}</span>
              </div>
              <p className="mt-4 text-[14px] text-ink-soft leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
