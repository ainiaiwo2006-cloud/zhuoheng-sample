import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { isRtl } from "@/i18n/routing";
import "./globals.css";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://zhuoheng.com").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZHUOHENG · Brass & Copper Earrings Wholesale · Custom OEM/ODM",
    template: "%s | ZHUOHENG",
  },
  description:
    "ZHUOHENG (卓恒) — wholesale brass & copper fashion jewellery manufacturer, earrings specialist. " +
    "20,000+ styles, MOQ from 120 pairs, OEM for Miniso · Disney · Sanfu. Since 2008. Yiwu, China.",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "zh-CN": `${SITE_URL}/zh`,
      "en":    `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/en`,
    },
  },
  openGraph: {
    title: "ZHUOHENG · Brass & Copper Earrings Wholesale",
    description: "20,000+ styles. MOQ 120 pairs. OEM for Miniso · Disney. Since 2008.",
    type: "website",
    siteName: "ZHUOHENG",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZHUOHENG · Brass & Copper Earrings Wholesale",
    description: "20,000+ styles. MOQ 120 pairs. OEM for Miniso · Disney.",
  },
  robots: { index: true, follow: true },
};

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ZHUOHENG",
  alternateName: "卓恒",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Brass & copper fashion jewellery manufacturer in Yiwu, China. " +
    "20,000+ styles, MOQ from 120 pairs, OEM for Miniso · Disney · Sanfu. Since 2008.",
  foundingDate: "2008",
  address: {
    "@type": "PostalAddress",
    addressCountry: "CN",
    addressRegion: "Zhejiang",
    addressLocality: "Yiwu",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "sales@zhuoheng.com",
    availableLanguage: ["en", "zh"],
  },
  sameAs: [],
};

// Root layout — owns <html> and <body>. The lang attribute is set from the
// active locale (resolved by next-intl middleware). All chrome (Nav, Footer,
// InquiryProvider) lives in app/[locale]/layout.tsx so it can read the locale
// inside NextIntlClientProvider.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dir = isRtl(locale) ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* All Noto fonts are SIL Open Font License — free for commercial use. */}
        <link
          href={
            "https://fonts.googleapis.com/css2" +
            "?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400" +
            "&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500" +
            "&family=Noto+Sans+SC:wght@300;400;500;700" +
            "&family=Noto+Serif+SC:wght@300;400;500;600" +
            "&family=Noto+Sans+KR:wght@300;400;500;700" +
            "&family=Noto+Sans+JP:wght@300;400;500;700" +
            "&family=Noto+Sans+Arabic:wght@300;400;500;700" +
            "&family=Noto+Naskh+Arabic:wght@400;500;700" +
            "&display=swap"
          }
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-bg text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
