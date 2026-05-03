"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const PRODUCT_TYPES = ["stud", "drop", "hoop", "necklace", "brooch", "set", "ring", "bracelet"];
const QTY_RANGES = [
  "200 – 500 pcs",
  "500 – 2,000 pcs",
  "2,000 – 10,000 pcs",
  "10,000+ pcs",
];
const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France", "Italy", "Spain",
  "Australia", "Canada", "Japan", "South Korea", "United Arab Emirates",
  "Saudi Arabia", "Brazil", "Mexico", "Other",
];

export function OemForm() {
  const locale = useLocale();
  const t = useTranslations("oemPage.form");
  const tCat = useTranslations("category");
  const tCommon = useTranslations("common");

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productTypes, setProductTypes] = useState<string[]>([]);

  function toggleType(code: string) {
    setProductTypes((prev) =>
      prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code],
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      country: String(fd.get("country") ?? ""),
      productTypes,
      estimatedQty: String(fd.get("qty") ?? ""),
      needsLogo: fd.get("needsLogo") === "on",
      needsPackaging: fd.get("needsPackaging") === "on",
      needsExclusiveDesign: fd.get("needsExclusiveDesign") === "on",
      budget: String(fd.get("budget") ?? ""),
      message: String(fd.get("message") ?? ""),
      hp: String(fd.get("website") ?? ""),
      locale,
      source: typeof window !== "undefined" ? window.location.href : "",
      submittedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/oem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Network");
      setDone(true);
    } catch {
      setError(t("errorMsg"));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section id="oem-form" className="py-20 lg:py-28 bg-ink text-white">
        <div className="max-w-[720px] mx-auto px-6 lg:px-10 text-center">
          <p className="eyebrow text-gold">{t("thankEyebrow")}</p>
          <h2 className="mt-5 h-display text-4xl lg:text-5xl text-white">{t("thankTitle")}</h2>
          <p className="mt-6 text-white/70 leading-relaxed">{t("thankBody")}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="oem-form" className="py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 grid grid-cols-12 gap-12">
        <div className="col-span-12 lg:col-span-4">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-5 h-display text-3xl lg:text-5xl">{t("title")}</h2>
          <p className="mt-5 text-ink-mute leading-relaxed">{t("body")}</p>
          <ul className="mt-10 space-y-3 text-[13px] text-ink-soft whitespace-pre-line">
            {t("ndaNote")}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="col-span-12 lg:col-span-8 space-y-6">
          <input type="text" name="website" autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label={t("name")} name="name" required />
            <Field label={t("company")} name="company" />
            <Field label={t("email")} name="email" type="email" required />
            <Field label={t("phone")} name="phone" type="tel" />
          </div>

          <Select label={t("country")} name="country" required options={COUNTRIES} hint={tCommon("submit")} />

          <div>
            <label className="block text-[11px] font-semibold tracking-wide3 uppercase text-ink mb-3">
              {t("productTypes")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRODUCT_TYPES.map((code) => {
                const active = productTypes.includes(code);
                return (
                  <button key={code} type="button" onClick={() => toggleType(code)}
                    className={[
                      "px-4 h-11 border text-[13px] transition-colors",
                      active ? "bg-ink text-white border-ink" : "bg-paper border-line hover:border-ink",
                    ].join(" ")}>
                    {tCat(code)}
                  </button>
                );
              })}
            </div>
          </div>

          <Select label={t("estimatedQty")} name="qty" required options={QTY_RANGES} />

          <div>
            <label className="block text-[11px] font-semibold tracking-wide3 uppercase text-ink mb-3">
              {t("needs")}
            </label>
            <div className="grid sm:grid-cols-3 gap-3">
              <Checkbox name="needsLogo" label={t("needsLogo")} />
              <Checkbox name="needsPackaging" label={t("needsPack")} />
              <Checkbox name="needsExclusiveDesign" label={t("needsDesign")} />
            </div>
          </div>

          <Field label={t("budget")} name="budget" placeholder={t("budgetHint")} />

          <div>
            <label className="block text-[11px] font-semibold tracking-wide3 uppercase text-ink mb-3">
              {t("message")}
            </label>
            <textarea name="message" required rows={5} placeholder={t("messageHint")} className="input" />
          </div>

          {error && <p className="text-[13px] text-red">{error}</p>}

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
            <button type="submit" disabled={submitting} className="btn btn-lg">
              {submitting ? tCommon("sending") : t("submit")} <span aria-hidden>→</span>
            </button>
            <p className="text-[11px] text-ink-mute">{tCommon("neverShare")}</p>
          </div>
        </form>
      </div>
    </section>
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

function Select(props: { label: string; name: string; required?: boolean; options: string[]; hint?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-wide3 uppercase text-ink mb-2">{props.label}</label>
      <select className="input" name={props.name} required={props.required} defaultValue="">
        <option value="" disabled>{props.hint ?? "Choose…"}</option>
        {props.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Checkbox({ name, label }: { name: string; label: string }) {
  return (
    <label className="inline-flex items-center gap-3 px-4 h-11 border border-line bg-paper cursor-pointer hover:border-ink transition-colors">
      <input type="checkbox" name={name} className="w-4 h-4 accent-ink" />
      <span className="text-[13px] text-ink">{label}</span>
    </label>
  );
}
