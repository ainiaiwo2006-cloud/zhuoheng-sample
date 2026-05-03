"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { routing, type Locale, LOCALE_LABELS, LOCALE_SHORT } from "@/i18n/routing";

// Compact language switcher: shows current locale as a short button,
// expands into a dropdown listing all 8 locales with their native names.

export function LangSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  // Close on click-outside
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        className="flex items-center gap-1 text-[12px] text-ink-soft hover:text-red transition-colors px-1"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{LOCALE_SHORT[locale]}</span>
        <span className="text-[9px]">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full mt-2 right-0 min-w-[180px] z-50 bg-bg border border-line shadow-soft py-1
                     [dir=rtl]:right-auto [dir=rtl]:left-0"
        >
          {routing.locales.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={l === locale}
              onClick={() => switchTo(l)}
              className={[
                "w-full text-left px-4 py-2 text-[13px] transition-colors flex items-center justify-between gap-3",
                l === locale ? "bg-paper text-ink font-medium" : "text-ink-soft hover:bg-paper hover:text-ink",
              ].join(" ")}
            >
              <span>{LOCALE_LABELS[l]}</span>
              <span className="text-[10px] text-ink-mute uppercase tracking-wide2">{l}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
