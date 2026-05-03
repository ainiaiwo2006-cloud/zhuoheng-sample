import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeader } from "./BestsellerStrip";

export async function CtaBlock() {
  const t = await getTranslations("home.cta");
  return (
    <section className="py-24 lg:py-32 bg-bg">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <SectionHeader title={t("title")} titleEn={t("eyebrow")} />

        <p className="mt-7 max-w-2xl mx-auto text-center text-ink-mute leading-loose">
          {t("body")}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="btn btn-red">
            {t("sample")}
          </Link>
          <Link href="/contact" className="btn btn-outline">
            {t("catalogue")}
          </Link>
        </div>
      </div>
    </section>
  );
}
