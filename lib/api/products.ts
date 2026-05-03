// Data access layer — every page reads products through this file.
//
// MVP: returns from the local DEMO_PRODUCTS array.
// Future: swap each function body with `fetch(...)` to your CMS / DB.
//         The function signatures stay identical so callers don't change.

import { DEMO_PRODUCTS } from "../data/products";
import type {
  Product, ProductPage, ProductQuery, CategoryCode, CollectionCode,
} from "../types";

const DEFAULT_PER_PAGE = 24;

export async function getAllProducts(): Promise<Product[]> {
  return DEMO_PRODUCTS;
}

export async function getProduct(slugOrSku: string): Promise<Product | null> {
  const needle = slugOrSku.toLowerCase();
  return (
    DEMO_PRODUCTS.find(
      (p) => p.slug.toLowerCase() === needle || p.sku.toLowerCase() === needle,
    ) ?? null
  );
}

export async function queryProducts(q: ProductQuery = {}): Promise<ProductPage> {
  let items = DEMO_PRODUCTS;

  if (q.category)   items = items.filter((p) => p.category === q.category);
  if (q.material)   items = items.filter((p) => p.material === q.material);
  if (q.plating)    items = items.filter((p) => p.plating.includes(q.plating!));
  if (q.style)      items = items.filter((p) => p.style.includes(q.style!));
  if (q.collection) items = items.filter((p) => p.collection === q.collection);
  if (q.priceBand)  items = items.filter((p) => p._priceBand === q.priceBand);

  if (q.q) {
    const needle = q.q.toLowerCase();
    items = items.filter((p) =>
      p.sku.toLowerCase().includes(needle) ||
      p.i18n.en.name.toLowerCase().includes(needle) ||
      p.i18n.zh.name.includes(q.q!) ||
      p.i18n.en.desc.toLowerCase().includes(needle) ||
      p.i18n.zh.desc.includes(q.q!)
    );
  }

  switch (q.sort) {
    case "newest":
      items = [...items].sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    case "moq-asc":
      items = [...items].sort((a, b) => a.moq - b.moq);
      break;
    case "best":
    default:
      items = [...items].sort(
        (a, b) => Number(b.isHot) - Number(a.isHot) || Number(b.isNew) - Number(a.isNew),
      );
      break;
  }

  const page = Math.max(1, q.page ?? 1);
  const perPage = q.perPage ?? DEFAULT_PER_PAGE;
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const sliced = items.slice(start, start + perPage);

  return { items: sliced, total, page, perPage, pageCount };
}

// ── shortcuts used by the home page ───────────────────────────
export async function getBestsellers(limit = 8): Promise<Product[]> {
  return DEMO_PRODUCTS.filter((p) => p.isHot).slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return DEMO_PRODUCTS.filter((p) => p.isNew).slice(0, limit);
}

export async function getProductsByCategory(
  category: CategoryCode, limit = 8,
): Promise<Product[]> {
  return DEMO_PRODUCTS.filter((p) => p.category === category).slice(0, limit);
}

export async function getProductsByCollection(
  collection: CollectionCode, limit = 8,
): Promise<Product[]> {
  return DEMO_PRODUCTS.filter((p) => p.collection === collection).slice(0, limit);
}

export async function getRelated(
  product: Product, limit = 4,
): Promise<Product[]> {
  return DEMO_PRODUCTS.filter(
    (p) => p.sku !== product.sku &&
      (p.category === product.category || p.collection === product.collection),
  ).slice(0, limit);
}

// catalog summary — used by hero / footer / nav counters
export async function getCatalogSummary() {
  return {
    totalStyles: DEMO_PRODUCTS.length,
    // Display-friendly headline number — the eventual full catalogue ambition.
    displayTotalStyles: "10,000+",
    minMoq: Math.min(...DEMO_PRODUCTS.map((p) => p.moq)),
    countriesShipped: 80,
    yearsExperience: 15,
  };
}
