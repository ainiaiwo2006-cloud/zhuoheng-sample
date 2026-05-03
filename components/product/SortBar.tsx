"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export function SortBar({ total }: { total: number }) {
  const t = useTranslations("sort");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("sort") ?? "best";

  const SORTS: { value: string; label: string }[] = [
    { value: "best",    label: t("best") },
    { value: "newest",  label: t("newest") },
    { value: "moq-asc", label: t("moqAsc") },
  ];

  function setSort(v: string) {
    const next = new URLSearchParams(params.toString());
    if (v === "best") next.delete("sort");
    else next.set("sort", v);
    next.delete("page");
    const qs = next.toString();
    router.push((qs ? `${pathname}?${qs}` : pathname) as any);
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-4">
      <p className="num text-[13px] text-ink">
        <span className="font-medium">{total.toLocaleString()}</span>
        <span className="text-ink-mute"> {t("stylesFound")}</span>
      </p>

      <div className="flex items-center gap-2 text-[12px]">
        <span className="text-ink-mute hidden sm:inline">{t("label")}</span>
        <select
          value={current}
          onChange={(e) => setSort(e.target.value)}
          className="input h-9 pr-8 pl-3 text-[13px] border-line bg-bg cursor-pointer"
          style={{ minWidth: 160 }}
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
    </div>
  );
}
