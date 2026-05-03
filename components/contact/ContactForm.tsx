"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France", "Italy", "Spain",
  "Australia", "Canada", "Japan", "South Korea", "United Arab Emirates",
  "Saudi Arabia", "Brazil", "Mexico", "India", "Other",
];

export function ContactForm() {
  const locale = useLocale();
  const t = useTranslations("contactPage.form");
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
      items: [],
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      country: String(fd.get("country") ?? ""),
      message: String(fd.get("message") ?? ""),
      hp: String(fd.get("website") ?? ""),
      locale,
      source: typeof window !== "undefined" ? window.location.href : "/contact",
      submittedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/inquiry", {
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
      <div className="bg-bg border border-line p-12 text-center">
        <p className="eyebrow">{t("thankEyebrow")}</p>
        <h3 className="mt-5 font-cnSerif text-2xl text-ink">{t("thankTitle")}</h3>
        <p className="mt-4 text-ink-mute leading-relaxed">{t("thankBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 bg-bg border border-line p-8 lg:p-10">
      <input type="text" name="website" autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label={t("name")} name="name" required />
        <Field label={t("company")} name="company" />
        <Field label={t("email")} name="email" type="email" required />
        <Field label={t("phone")} name="phone" type="tel" />
      </div>

      <div>
        <label className="block text-[11px] font-semibold tracking-wide3 uppercase text-ink mb-2">
          {t("country")}
        </label>
        <select name="country" required defaultValue="" className="input">
          <option value="" disabled>—</option>
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold tracking-wide3 uppercase text-ink mb-2">
          {t("message")}
        </label>
        <textarea name="message" required rows={6} placeholder={t("messageHint")} className="input" />
      </div>

      {error && <p className="text-[13px] text-red">{error}</p>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <button type="submit" disabled={submitting} className="btn">
          {submitting ? tCommon("sending") : t("submit")} <span aria-hidden>→</span>
        </button>
        <p className="text-[11px] text-ink-mute">{tCommon("neverShare")}</p>
      </div>
    </form>
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
