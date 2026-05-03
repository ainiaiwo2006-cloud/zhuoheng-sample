import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="bg-bg min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-serif italic text-6xl text-red leading-none">{t("code")}</p>
        <h1 className="mt-8 font-cnSerif text-3xl text-ink">{t("title")}</h1>
        <p className="mt-2 font-serif italic text-ink-mute">{t("subtitle")}</p>
        <p className="mt-6 text-[14px] text-ink-soft leading-loose">{t("body")}</p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-outline">{t("homeBtn")}</Link>
          <Link href="/oem" className="btn btn-red">{t("oemBtn")}</Link>
        </div>
      </div>
    </section>
  );
}
