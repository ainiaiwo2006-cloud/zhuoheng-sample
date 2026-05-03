"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useInquiry } from "./InquiryProvider";
import { DEMO_PRODUCTS } from "@/lib/data/products";
import { getProductI18n } from "@/lib/i18n/productI18n";

export function InquiryDrawer() {
  const { items, drawerOpen, closeDrawer, setQty, remove, hydrated } = useInquiry();
  const locale = useLocale();
  const t = useTranslations("inquiryDrawer");
  const tCommon = useTranslations("common");

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  useEffect(() => {
    if (!drawerOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = orig; };
  }, [drawerOpen]);

  if (!hydrated) return null;

  return (
    <>
      <div onClick={closeDrawer}
        className={[
          "fixed inset-0 bg-ink/50 backdrop-blur-sm z-40 transition-opacity duration-300",
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!drawerOpen} />
      <aside role="dialog" aria-label={t("title")}
        className={[
          "fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[460px] bg-bg",
          "border-l border-line shadow-soft flex flex-col",
          "transition-transform duration-400",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        style={{ transitionTimingFunction: "cubic-bezier(0.2, 0.7, 0.2, 1)" }}>
        <header className="flex items-center justify-between p-6 border-b border-line">
          <div>
            <p className="eyebrow">{t("title")}</p>
            <h2 className="mt-1 font-serif text-2xl text-ink">{t("items", { n: items.length })}</h2>
          </div>
          <button onClick={closeDrawer} aria-label="Close"
            className="w-10 h-10 inline-flex items-center justify-center hover:bg-paper transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-serif text-xl text-ink">{t("empty")}</p>
              <p className="mt-2 text-sm text-ink-mute">{t("emptySub")}</p>
              <Link href="/products" onClick={closeDrawer} className="inline-block mt-6 link-arrow">
                {tCommon("browseCatalogue")} <span className="arrow">→</span>
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((it) => {
                const product = DEMO_PRODUCTS.find((p) => p.sku === it.sku);
                if (!product) return null;
                const productName = getProductI18n(product, locale).name;
                return (
                  <li key={it.sku} className="p-5 flex gap-4">
                    <div className="w-20 h-20 shrink-0 bg-paper border border-line overflow-hidden">
                      <svg viewBox="0 0 80 80" className="w-full h-full">
                        <rect width="80" height="80" fill="#F5EFE5" />
                        <circle cx="40" cy="40" r="20" fill={product.palette.metal} opacity="0.85" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <Link href={`/products/${product.slug}` as any} onClick={closeDrawer}
                          className="font-serif text-[15px] text-ink leading-snug truncate">
                          {productName}
                        </Link>
                        <button onClick={() => remove(it.sku)}
                          className="text-[11px] text-ink-mute hover:text-red tracking-wide2 uppercase">
                          {tCommon("remove")}
                        </button>
                      </div>
                      <p className="text-[11px] text-ink-mute mt-0.5">SKU {product.sku}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button onClick={() => setQty(it.sku, Math.max(0, it.qty - product.moq))}
                          className="w-8 h-8 border border-line text-ink hover:border-ink" aria-label="−">−</button>
                        <input type="number" min={0} value={it.qty}
                          onChange={(e) => setQty(it.sku, Math.max(0, Number(e.target.value)))}
                          className="num w-16 h-8 text-center border border-line bg-paper" />
                        <button onClick={() => setQty(it.sku, it.qty + product.moq)}
                          className="w-8 h-8 border border-line text-ink hover:border-ink" aria-label="+">+</button>
                        <span className="text-[11px] text-ink-mute ml-1">{tCommon("pcs")}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="p-6 border-t border-line bg-paper space-y-3">
          <Link href="/inquiry" onClick={closeDrawer}
            className={["btn w-full", items.length === 0 ? "opacity-40 pointer-events-none" : ""].join(" ")}>
            {t("submit")} <span aria-hidden>→</span>
          </Link>
          <p className="text-[11px] text-ink-mute text-center">{t("footnote")}</p>
        </footer>
      </aside>
    </>
  );
}
