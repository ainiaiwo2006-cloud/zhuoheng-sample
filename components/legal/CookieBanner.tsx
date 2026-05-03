"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "jf-cookie-ack-v1";

export function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed bottom-0 inset-x-0 z-50 bg-ink text-white border-t border-white/10"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1 text-[13px] leading-relaxed text-white/85">
          <span className="font-medium text-white">{t("title")}.</span>{" "}
          <span>{t("body")}</span>{" "}
          <Link href="/cookies" className="underline underline-offset-2 hover:text-white">
            {t("details")}
          </Link>
        </div>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 bg-red hover:bg-red-dark transition-colors text-white text-[12px] tracking-wide2 uppercase px-6 py-3"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
