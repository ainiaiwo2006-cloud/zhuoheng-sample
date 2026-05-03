import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { LangSwitcher } from "@/components/layout/LangSwitcher";
import { InquiryProvider } from "@/components/inquiry/InquiryProvider";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <InquiryProvider>
        {/* Floating language switcher (top-right) — replaces full Nav */}
        <div className="fixed top-2 right-3 lg:top-4 lg:right-6 z-50
                        bg-bg/85 backdrop-blur-sm rounded-full px-2 py-1 shadow-soft">
          <LangSwitcher />
        </div>
        <main>{children}</main>
      </InquiryProvider>
    </NextIntlClientProvider>
  );
}
