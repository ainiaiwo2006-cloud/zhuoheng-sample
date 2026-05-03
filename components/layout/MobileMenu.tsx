"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LangSwitcher } from "./LangSwitcher";
import { useInquiry } from "@/components/inquiry/InquiryProvider";

// Hamburger button + slide-down drawer for screens below `lg` where the
// horizontal menu is hidden. Uses the same i18n keys as Nav so labels stay in
// sync.

export function MobileMenu() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const { count, hydrated, openDrawer } = useInquiry();

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = orig; };
  }, [open]);

  // Close on route change — hooks into popstate; for client-side route
  // changes we close on link click below.
  useEffect(() => {
    const onPop = () => setOpen(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const LINKS = [
    { label: t("newArrivals"), href: "/products?sort=newest", red: true },
    { label: t("stud"),        href: "/products?cat=stud" },
    { label: t("drop"),        href: "/products?cat=drop" },
    { label: t("hoop"),        href: "/products?cat=hoop" },
    { label: t("necklace"),    href: "/products?cat=necklace" },
    { label: t("brooch"),      href: "/products?cat=brooch" },
    { label: t("set"),         href: "/products?cat=set" },
    { label: t("ring"),        href: "/products?cat=ring",     comingSoon: true },
    { label: t("bracelet"),    href: "/products?cat=bracelet", comingSoon: true },
    { label: t("customOem"),   href: "/oem" },
    { label: t("about"),       href: "/about" },
    { label: t("contact"),     href: "/contact" },
  ];

  return (
    <>
      {/* Hamburger trigger — only visible below lg */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="lg:hidden w-9 h-9 inline-flex items-center justify-center text-ink hover:text-red transition-colors"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={[
          "lg:hidden fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Mobile menu"
        className={[
          "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-sm bg-bg",
          "border-r border-line shadow-soft flex flex-col",
          "transition-transform duration-400",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ transitionTimingFunction: "cubic-bezier(0.2, 0.7, 0.2, 1)" }}
      >
        <header className="flex items-center justify-between p-5 border-b border-line">
          <Link href="/" onClick={() => setOpen(false)} className="flex flex-col leading-none">
            <span className="font-serif text-[18px] tracking-[0.2em] text-ink">ZHUOHENG</span>
            <span className="font-cnSerif text-[10px] tracking-[0.4em] text-ink-mute mt-1">卓 恒</span>
          </Link>
          <button onClick={() => setOpen(false)} aria-label="Close" className="w-9 h-9 inline-flex items-center justify-center text-ink hover:text-red">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/* Main link list */}
        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="divide-y divide-line">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href as any}
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-center justify-between py-4 text-[15px] tracking-wide2",
                    (l as any).red ? "text-red font-medium" :
                    (l as any).comingSoon ? "text-ink-faint" :
                    "text-ink hover:text-red",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    {l.label}
                    {(l as any).comingSoon && (
                      <span className="text-[9px] uppercase tracking-wide3 text-ink-mute border border-line px-1.5 py-0.5">
                        {t("comingSoon")}
                      </span>
                    )}
                  </span>
                  <span aria-hidden className="text-ink-mute">→</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Inquiry shortcut */}
          <button
            onClick={() => { setOpen(false); openDrawer(); }}
            className="mt-8 w-full btn"
          >
            <span>{tCommon("addToInquiry")}</span>
            {hydrated && count > 0 && (
              <span className="num bg-red text-white text-[10px] rounded-full min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </nav>

        <footer className="p-5 border-t border-line bg-paper">
          <div className="flex items-center text-[12px] text-ink-soft">
            <LangSwitcher />
          </div>
          <p className="mt-3 text-[10px] text-ink-mute tracking-wide2 uppercase">
            sales@zhuoheng.com
          </p>
        </footer>
      </aside>
    </>
  );
}
