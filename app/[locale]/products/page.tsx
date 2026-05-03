import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { queryProducts, getAllProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { SortBar } from "@/components/product/SortBar";
import { Pagination } from "@/components/product/Pagination";
import { ActiveChips } from "@/components/product/ActiveChips";
import {
  findCategory, findMaterial, findPlating, findStyle, findCollection,
} from "@/lib/data/taxonomies";
import type {
  CategoryCode, MaterialCode, PlatingCode, StyleCode, CollectionCode, ProductSort,
} from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "listing.header" });
  return { title: t("all"), description: t("allSub") };
}

type Search = Record<string, string | string[] | undefined>;
type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Search> };

function pickStr(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  const cat        = pickStr(sp.cat) ?? pickStr(sp.category);
  const material   = pickStr(sp.material);
  const plating    = pickStr(sp.plating);
  const style      = pickStr(sp.style);
  const collection = pickStr(sp.collection);
  const q          = pickStr(sp.q);
  const sort       = (pickStr(sp.sort) ?? "best") as ProductSort;
  const page       = Number(pickStr(sp.page) ?? 1) || 1;

  const result = await queryProducts({
    category: cat as CategoryCode | undefined,
    material: material as MaterialCode | undefined,
    plating: plating as PlatingCode | undefined,
    style: style as StyleCode | undefined,
    collection: collection as CollectionCode | undefined,
    q, sort, page, perPage: 24,
  });

  const counts = await computeCounts();
  const heading = await headingFor({ locale, cat, material, plating, style, collection, q });
  const tBC = await getTranslations("listing.breadcrumb");
  const tList = await getTranslations("listing");

  return (
    <>
      <section className="bg-bg border-b border-line py-10 lg:py-14">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <nav className="text-[11px] uppercase tracking-wide3 text-ink-mute">
            <Link href="/products" className="hover:text-red">{tBC("catalogue")}</Link>
            {heading.subPath && (<>
              <span className="mx-2 text-line-strong">/</span>
              <span className="text-ink">{heading.subPath}</span>
            </>)}
          </nav>
          <h1 className="mt-5 font-cnSerif text-3xl lg:text-5xl text-ink">{heading.title}</h1>
          {heading.subtitle && (
            <p className="mt-2 font-serif italic text-ink-mute">{heading.subtitle}</p>
          )}
        </div>
      </section>

      <section className="py-10 lg:py-14 bg-bg">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-12 lg:col-span-3">
            <FilterSidebar counts={counts} />
          </div>
          <div className="col-span-12 lg:col-span-9">
            <ActiveChips />
            <SortBar total={result.total} />

            {result.items.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-cnSerif text-2xl text-ink">{tList("noResults")}</p>
                <p className="mt-3 text-ink-mute">{tList("noResultsSub")}</p>
                <Link href="/products" className="link-arrow mt-6 inline-flex">
                  {tList("clearFilters")} <span className="arrow">→</span>
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6 lg:gap-y-14">
                  {result.items.map((p, i) => (
                    <ProductCard key={p.sku} product={p} index={i} />
                  ))}
                </div>
                <Pagination page={result.page} pageCount={result.pageCount} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

async function computeCounts() {
  const all = await getAllProducts();
  const counts = {
    category:   {} as Record<string, number>,
    material:   {} as Record<string, number>,
    plating:    {} as Record<string, number>,
    style:      {} as Record<string, number>,
    collection: {} as Record<string, number>,
  };
  for (const p of all) {
    counts.category[p.category]   = (counts.category[p.category] ?? 0) + 1;
    counts.material[p.material]   = (counts.material[p.material] ?? 0) + 1;
    if (p.collection) counts.collection[p.collection] = (counts.collection[p.collection] ?? 0) + 1;
    for (const s of p.style)   counts.style[s]   = (counts.style[s] ?? 0) + 1;
    for (const pl of p.plating) counts.plating[pl] = (counts.plating[pl] ?? 0) + 1;
  }
  return counts;
}

async function headingFor({ locale, cat, material, plating, style, collection, q }: {
  locale: string;
  cat?: string; material?: string; plating?: string;
  style?: string; collection?: string; q?: string;
}) {
  const t = await getTranslations({ locale, namespace: "listing.header" });
  const lbl = (zh: string, en: string) => (locale === "zh" ? zh : en);

  if (cat) {
    const c = findCategory(cat);
    if (c) return { title: lbl(c.zh, c.en), subtitle: lbl(c.en, c.zh), subPath: lbl(c.zh, c.en) };
  }
  if (material) {
    const m = findMaterial(material);
    if (m) return { title: t("material", { label: lbl(m.zh, m.en) }), subtitle: lbl(m.en, m.zh), subPath: lbl(m.zh, m.en) };
  }
  if (collection) {
    const c = findCollection(collection);
    if (c) return { title: lbl(c.zh, c.en), subtitle: lbl(c.en, c.zh), subPath: lbl(c.zh, c.en) };
  }
  if (plating) {
    const p = findPlating(plating);
    if (p) return { title: t("plating", { label: lbl(p.zh, p.en) }), subtitle: lbl(p.en, p.zh), subPath: lbl(p.zh, p.en) };
  }
  if (style) {
    const s = findStyle(style);
    if (s) return { title: t("style", { label: lbl(s.zh, s.en) }), subtitle: lbl(s.en, s.zh), subPath: lbl(s.zh, s.en) };
  }
  if (q) return { title: t("search", { q }), subtitle: undefined, subPath: q };
  return { title: t("all"), subtitle: t("allSub"), subPath: undefined };
}
