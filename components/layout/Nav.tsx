"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { LangSwitcher } from "./LangSwitcher";
import { MobileMenu } from "./MobileMenu";

// CTF-style nav: logo dead-centre, currency switch on far left, icons on far right.
// Main menu sits in a row beneath. Single highlighted item in red.

export function Nav() {
  const t = useTranslations("nav");
  const { count, hydrated, openDrawer } = useInquiry();
  const [scrolled, setScrolled] = useState(false);

  const MAIN_LINKS = [
    { label: t("newArrivals"), href: "/products?sort=newest", red: true },
    { label: t("stud"),        href: "/products?cat=stud" },
    { label: t("drop"),        href: "/products?cat=drop" },
    { label: t("necklace"),    href: "/products?cat=necklace" },
    { label: t("brooch"),      href: "/products?cat=brooch" },
    { label: t("customOem"),   href: "/oem" },
    { label: t("about"),       href: "/about" },
    { label: t("contact"),     href: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "sticky top-0 z-40 bg-bg transition-shadow duration-300",
        scrolled ? "shadow-soft" : "",
      ].join(" ")}
    >
      <div className="border-b border-line">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 grid grid-cols-3 items-center">
          <div className="flex items-center gap-3 text-[12px] text-ink-soft">
            <MobileMenu />
            <div className="hidden lg:block"><LangSwitcher /></div>
          </div>

          <Link href="/" className="justify-self-center flex flex-col items-center leading-none">
            <span className="font-serif text-[22px] tracking-[0.2em] text-ink">ZHUOHENG</span>
            <span className="font-cnSerif text-[11px] tracking-[0.4em] text-ink-mute mt-1">卓 恒</span>
          </Link>

          <div className="justify-self-end flex items-center gap-4 text-ink">
            <IconBtn ariaLabel={t("account")}><AccountIcon /></IconBtn>
            <IconBtn ariaLabel={t("search")}><SearchIcon /></IconBtn>
            <IconBtn ariaLabel={t("stores")}><PinIcon /></IconBtn>
            <IconBtn ariaLabel={t("wishlist")}><HeartIcon /></IconBtn>
            <button onClick={openDrawer} className="relative inline-flex" aria-label={t("inquiry")}>
              <BagIcon />
              {hydrated && count > 0 && (
                <span className="absolute -top-1 -right-1 num bg-red text-white text-[9px]
                                 rounded-full min-w-[16px] h-4 px-1 inline-flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-12 hidden lg:flex items-center justify-center">
          <ul className="flex items-center gap-12">
            {MAIN_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href as any}
                  className={[
                    "text-[13px] tracking-wide2 transition-colors relative inline-flex items-center pb-3 -mb-3",
                    l.red
                      ? "text-red font-medium"
                      : "text-ink hover:text-red",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function IconBtn({ children, ariaLabel }: { children: React.ReactNode; ariaLabel: string }) {
  return (
    <button aria-label={ariaLabel} className="w-8 h-8 inline-flex items-center justify-center hover:text-red transition-colors">
      {children}
    </button>
  );
}

function AccountIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 22s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13z" /><circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
