import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProduct, getRelated } from "@/lib/api/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActionPanel } from "@/components/product/ProductActionPanel";
import { ProductCard } from "@/components/product/ProductCard";
import { findCategory } from "@/lib/data/taxonomies";
import { routing } from "@/i18n/routing";
import { getProductI18n, getProductSubName, getProductSubDesc } from "@/lib/i18n/productI18n";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://zhuoheng.com").replace(/\/$/, "");

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, locale } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  const i18n = getProductI18n(p, locale);
  const canonical = `${SITE_URL}/${locale}/products/${slug}`;
  return {
    title: i18n.metaTitle ?? i18n.name,
    description: i18n.metaDesc ?? i18n.desc,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}/products/${slug}`])
      ),
    },
    openGraph: {
      title: i18n.name,
      description: i18n.desc,
      url: canonical,
      type: "website",
      images: p.images && p.images.length > 0
        ? [{ url: p.images[0].startsWith("http") ? p.images[0] : `${SITE_URL}${p.images[0]}` }]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await getRelated(product, 4);

  const tBC = await getTranslations("listing.breadcrumb");
  const tProduct = await getTranslations("product");
  const tTabs = await getTranslations("product.tabs");
  const tRelated = await getTranslations("product.related");

  const i18nProduct = getProductI18n(product, locale);
  const subName = getProductSubName(product, locale);
  const subDesc = getProductSubDesc(product, locale);
  const cat = findCategory(product.category);
  const catLabel = cat ? (locale === "zh" ? cat.zh : cat.en) : product.category;

  // Schema.org Product JSON-LD — helps Google show product cards in search results.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/${locale}/products/${product.slug}`,
    name: i18nProduct.name,
    description: i18nProduct.desc,
    sku: product.sku,
    brand: { "@type": "Brand", name: "ZHUOHENG" },
    manufacturer: { "@type": "Organization", name: "Yiwu Zhuoheng Jewellery Co., Ltd." },
    category: catLabel,
    material: product.material,
    image: product.images && product.images.length > 0
      ? product.images.map((src) => src.startsWith("http") ? src : `${SITE_URL}${src}`)
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/${locale}/products/${product.slug}`,
      availability: product.stockStatus === "ready"
        ? "https://schema.org/InStock"
        : "https://schema.org/MadeToOrder",
      priceCurrency: "USD",
      // No public price (B2B inquiry-based) — omit price, signals "request for quote"
      seller: { "@type": "Organization", name: "ZHUOHENG" },
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: product.moq,
        unitText: "pcs",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <section className="bg-bg border-b border-line py-5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <nav className="text-[11px] uppercase tracking-wide3 text-ink-mute">
            <Link href="/products" className="hover:text-red">{tBC("catalogue")}</Link>
            <span className="mx-2 text-line-strong">/</span>
            <Link href={`/products?cat=${product.category}` as any} className="hover:text-red">
              {catLabel}
            </Link>
            <span className="mx-2 text-line-strong">/</span>
            <span className="text-ink truncate">{product.sku}</span>
          </nav>
        </div>
      </section>

      <section className="py-6 lg:py-16 bg-bg">
        <div className="max-w-[1440px] mx-auto lg:px-12 grid grid-cols-12 gap-6 lg:gap-16">
          <div className="col-span-12 lg:col-span-7">
            <ProductGallery product={product} />
          </div>
          <div className="col-span-12 lg:col-span-5 px-6 lg:px-0">
            <ProductActionPanel product={product} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-paper border-y border-line">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-4">
            <h2 className="font-cnSerif text-2xl text-ink">{i18nProduct.name}</h2>
            {subName && <p className="mt-2 font-serif italic text-ink-mute">{subName}</p>}
          </div>
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <Block title={tTabs("specs")}>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                <Item k="SKU" v={product.sku} />
                <Item k={tProduct("specs.category")} v={catLabel} />
                <Item k={tProduct("specs.material")} v={product.material} />
                <Item k={tProduct("specs.plating")} v={product.plating.join(" · ")} />
                <Item k={tProduct("specs.style")} v={product.style.join(" · ")} />
              </ul>
            </Block>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20 lg:py-28 bg-bg">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <header className="flex items-end justify-between gap-6 mb-12">
              <div>
                <p className="eyebrow">{tRelated("eyebrow")}</p>
                <h2 className="mt-4 font-cnSerif text-2xl lg:text-3xl text-ink">{tRelated("title")}</h2>
              </div>
              <Link href={`/products?cat=${product.category}` as any} className="link-arrow">
                {tRelated("viewAll")} <span className="arrow">→</span>
              </Link>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6">
              {related.map((p, i) => (
                <ProductCard key={p.sku} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] tracking-wide3 uppercase font-semibold text-ink border-b border-ink pb-3 mb-5">{title}</h3>
      <div className="text-[14px] text-ink-soft leading-loose space-y-3">{children}</div>
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  // Hide entirely if value is empty, "—", or only whitespace
  const trimmed = (v ?? "").trim();
  if (!trimmed || trimmed === "—") return null;
  return (
    <li className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-line pb-2">
      <span className="text-[12px] text-ink-mute uppercase tracking-wide2">{k}</span>
      <span className="text-[13px] text-ink sm:text-right break-words">{trimmed}</span>
    </li>
  );
}
