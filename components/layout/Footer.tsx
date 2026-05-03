import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// CTF-style footer — deep red background, centered brand mark, multi-column.

export async function Footer() {
  const t = await getTranslations("footer");

  const SHOP_LINKS: [string, string][] = [
    [t("newArrivals"), "/products?sort=newest"],
    [t("earrings"),    "/products?cat=stud"],
    [t("brass"),       "/products?material=brass-gold"],
    [t("copper"),      "/products?material=copper"],
    [t("byCollection"), "/collections"],
    [t("customOem"),   "/oem"],
  ];
  const SERVICE_LINKS: [string, string][] = [
    [t("submitInquiry"), "/inquiry"],
    [t("requestSample"), "/oem"],
    [t("pricingMoq"),    "/contact"],
    [t("paymentTerms"),  "/contact"],
    [t("shippingInfo"),  "/contact"],
    [t("faq"),           "/contact"],
  ];

  return (
    <footer className="mt-32 bg-red-dark text-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-20 pb-12">
        <div className="flex items-center justify-center gap-6 mb-16">
          <span className="font-serif text-white/85 text-lg tracking-wider">19</span>
          <div className="w-16 h-16 rounded-sm border border-white/40 flex items-center justify-center">
            <span className="font-serif text-2xl text-white italic">ZH</span>
          </div>
          <span className="font-serif text-white/85 text-lg tracking-wider">29</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          <div className="md:col-span-3">
            <p className="text-[13px] leading-relaxed text-white/75 mb-8 max-w-sm">
              {t("tagline")}
            </p>
          </div>

          <FooterCol title={t("shop")} links={SHOP_LINKS} />
          <FooterCol title={t("service")} links={SERVICE_LINKS} />

          <div className="md:col-span-3">
            <h4 className="text-[13px] font-medium text-white mb-5">{t("hotline")}</h4>
            <p className="font-serif text-2xl text-white">+86 (020) 8888-8888</p>
            <div className="mt-6">
              <p className="text-[13px] font-medium text-white">{t("hoursTitle")}</p>
              <p className="text-[13px] text-white/75 mt-2 leading-relaxed whitespace-pre-line">
                {t("hoursVal")}
              </p>
            </div>

            <div className="mt-10">
              <h4 className="text-[13px] font-medium text-white mb-3 flex items-center gap-2">
                {t("newsletter")}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M3 7l9 7 9-7M3 7v10h18V7M3 7l9-4 9 4" />
                </svg>
              </h4>
              <form className="flex border-b border-white/40 pb-1">
                <input
                  type="email" placeholder={t("emailPlaceholder")}
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-white/50
                             text-[14px] focus:outline-none py-1"
                />
                <button type="submit" aria-label={t("subscribe")} className="text-white hover:text-white/70">
                  →
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-white/55">
          <div className="flex items-center gap-5 flex-wrap">
            <Link href="/privacy" className="hover:text-white">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-white">{t("terms")}</Link>
            <Link href="/cookies" className="hover:text-white">{t("cookies")}</Link>
          </div>
          <span>{t("copyright", { year: new Date().getFullYear() })}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="md:col-span-3">
      <h4 className="text-[13px] font-medium text-white mb-5">{title}</h4>
      <ul className="space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href as any} className="text-[13px] text-white/75 hover:text-white transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
