import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  zh: string;
  en: string;
  body?: string;
};

export async function ComingSoon({ zh, en, body }: Props) {
  const t = await getTranslations("comingSoon");
  return (
    <section className="bg-bg min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-7 font-cnSerif text-4xl lg:text-5xl text-ink leading-tight">{zh}</h1>
        <p className="mt-3 font-serif italic text-ink-mute text-lg">{en}</p>
        <p className="mt-7 text-[14px] text-ink-soft leading-loose">{body ?? t("body")}</p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-outline">{t("homeBtn")}</Link>
          <Link href="/oem" className="btn btn-red">{t("oemBtn")}</Link>
        </div>
      </div>
    </section>
  );
}
