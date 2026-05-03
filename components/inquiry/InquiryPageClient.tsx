"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useInquiry } from "./InquiryProvider";
import { DEMO_PRODUCTS } from "@/lib/data/products";
import { ProductVisual } from "@/components/product/ProductVisual";
import { getProductI18n, getProductSubName } from "@/lib/i18n/productI18n";

const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France", "Italy", "Spain",
  "Australia", "Canada", "Japan", "South Korea", "United Arab Emirates",
  "Saudi Arabia", "Brazil", "Mexico", "India", "Other",
];

export function InquiryPageClient() {
  const { items, hydrated, setQty, setNote, toggleCustomisation, remove, clear } = useInquiry();
  const locale = useLocale();
  const t = useTranslations("inquiryPage");
  const tCommon = useTranslations("common");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      items,
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      country: String(fd.get("country") ?? ""),
      message: String(fd.get("message") ?? ""),
      hp: String(fd.get("website") ?? ""),
      locale,
      source: typeof window !== "undefined" ? window.location.href : "/inquiry",
      submittedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Network");
      clear();
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(t("errors.submitFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <section className="bg-bg min-h-[60vh] flex items-center justify-center">
        <p className="text-ink-mute text-sm">{tCommon("loading")}</p>
      </section>
    );
  }

  if (done) {
    return (
      <section className="bg-bg py-32 text-center px-6">
        <div className="max-w-xl mx-auto">
          <p className="eyebrow">{t("thank.eyebrow")}</p>
          <h1 className="mt-7 font-cnSerif text-4xl lg:text-5xl text-ink leading-tight">{t("thank.title")}</h1>
          <p className="mt-3 font-serif italic text-ink-mute">{t("thank.subtitle")}</p>
          <p className="mt-7 text-ink-soft leading-loose">{t("thank.body")}</p>
          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="btn btn-outline">{t("thank.continueBtn")}</Link>
            <Link href="/" className="btn">{t("thank.homeBtn")}</Link>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-bg py-32 text-center px-6">
        <div className="max-w-xl mx-auto">
          <p className="eyebrow">{t("empty.eyebrow")}</p>
          <h1 className="mt-7 font-cnSerif text-4xl text-ink">{t("empty.title")}</h1>
          <p className="mt-3 font-serif italic text-ink-mute">{t("empty.subtitle")}</p>
          <p className="mt-7 text-ink-soft leading-loose">{t("empty.body")}</p>
          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="btn">{t("empty.browse")}</Link>
            <Link href="/oem" className="btn btn-outline">{t("empty.oem")}</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-bg border-b border-line py-14 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-5 font-cnSerif text-4xl lg:text-5xl text-ink">{t("title")}</h1>
          <p className="mt-3 font-serif italic text-ink-mute">{t("items", { n: items.length })}</p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-bg">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-serif text-xl text-ink">{t("itemsSection")}</h2>
              <button onClick={clear} className="text-[11px] text-ink-mute hover:text-red tracking-wide2 uppercase">
                {tCommon("clearAll")}
              </button>
            </div>

            <ul className="border-t border-line">
              {items.map((it) => {
                const product = DEMO_PRODUCTS.find((p) => p.sku === it.sku);
                if (!product) return null;
                const productName = getProductI18n(product, locale).name;
                const subName = getProductSubName(product, locale);
                return (
                  <li key={it.sku} className="py-6 border-b border-line grid grid-cols-12 gap-4 lg:gap-6">
                    <div className="col-span-3 sm:col-span-2 aspect-square bg-paper border border-line overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image src={product.images[0]} alt={productName}
                          width={120} height={120}
                          className="w-full h-full object-cover" unoptimized />
                      ) : (
                        <ProductVisual type={product.visualType} palette={product.palette} />
                      )}
                    </div>

                    <div className="col-span-9 sm:col-span-10 flex flex-col gap-2">
                      <div className="flex items-baseline justify-between gap-3">
                        <Link href={`/products/${product.slug}` as any}
                          className="font-serif text-[16px] text-ink hover:text-red transition-colors">
                          {productName}
                        </Link>
                        <button onClick={() => remove(it.sku)}
                          className="text-[11px] text-ink-mute hover:text-red tracking-wide2 uppercase">
                          {tCommon("remove")}
                        </button>
                      </div>
                      {subName && <p className="font-serif italic text-[12px] text-ink-mute">{subName}</p>}
                      <p className="text-[11px] text-ink-mute">SKU {product.sku} · MOQ {Math.floor(product.moq/2)} {tCommon("pairs")}</p>

                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-ink-mute mr-1">{t("qty")}</span>
                        <button onClick={() => setQty(it.sku, Math.max(0, it.qty - product.moq))}
                          className="w-8 h-8 border border-line text-ink hover:border-ink">−</button>
                        <input type="number" min={0} value={it.qty}
                          onChange={(e) => setQty(it.sku, Math.max(0, Number(e.target.value)))}
                          className="num w-20 h-8 text-center border border-line bg-bg" />
                        <button onClick={() => setQty(it.sku, it.qty + product.moq)}
                          className="w-8 h-8 border border-line text-ink hover:border-ink">+</button>
                        <span className="text-[11px] text-ink-mute ml-1">{tCommon("pcs")}</span>

                        <label className="ml-4 flex items-center gap-2 text-[11px] text-ink cursor-pointer">
                          <input type="checkbox" checked={!!it.customisation}
                            onChange={() => toggleCustomisation(it.sku)}
                            className="w-3.5 h-3.5 accent-red" />
                          {t("needOem")}
                        </label>
                      </div>

                      <input type="text" value={it.note ?? ""}
                        onChange={(e) => setNote(it.sku, e.target.value)}
                        placeholder={t("noteHint")}
                        className="mt-2 input h-10 text-[13px]" />
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 text-right text-[12px] text-ink-mute">
              {t("totalLine", { pcs: items.reduce((s, i) => s + i.qty, 0), skus: items.length })}
            </div>
          </div>

          <form onSubmit={onSubmit} className="col-span-12 lg:col-span-5 lg:sticky lg:top-32 lg:self-start space-y-5 bg-paper border border-line p-8">
            <h2 className="font-serif text-xl text-ink">{t("form.title")}</h2>
            <input type="text" name="website" autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t("form.name")} name="name" required />
              <Field label={t("form.company")} name="company" />
              <Field label={t("form.email")} name="email" type="email" required />
              <Field label={t("form.phone")} name="phone" type="tel" />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wide3 uppercase text-ink mb-2">
                {t("form.country")}
              </label>
              <select name="country" required defaultValue="" className="input">
                <option value="" disabled>{t("form.countryHint")}</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wide3 uppercase text-ink mb-2">
                {t("form.additionalNotes")}
              </label>
              <textarea name="message" rows={4}
                placeholder={t("form.additionalHint")}
                className="input" />
            </div>

            {error && <p className="text-[13px] text-red">{error}</p>}

            <button type="submit" disabled={submitting} className="btn w-full">
              {submitting ? tCommon("sending") : t("form.submit")} <span aria-hidden>→</span>
            </button>
            <p className="text-[11px] text-ink-mute text-center">
              {tCommon("replies24h")} · {tCommon("neverShare")}
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-wide3 uppercase text-ink mb-2">{label}</label>
      <input className="input" {...rest} />
    </div>
  );
}
