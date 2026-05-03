import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/api/products";
import { routing } from "@/i18n/routing";
import { COLLECTIONS } from "@/lib/data/taxonomies";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://zhuoheng.com").replace(/\/$/, "");

const STATIC_PATHS = [
  "/",
  "/products",
  "/oem",
  "/about",
  "/contact",
  "/inquiry",
  "/collections",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Static pages × locales
  for (const path of STATIC_PATHS) {
    for (const locale of routing.locales) {
      const url = `${SITE_URL}/${locale}${path === "/" ? "" : path}`;
      entries.push({
        url,
        lastModified: now,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1.0 : path === "/products" ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${SITE_URL}/${l}${path === "/" ? "" : path}`])
          ),
        },
      });
    }
  }

  // Collection landing pages
  for (const c of COLLECTIONS) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/collections/${c.code}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${SITE_URL}/${l}/collections/${c.code}`])
          ),
        },
      });
    }
  }

  // Product detail pages × locales
  for (const p of products) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/products/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: p.isHot ? 0.8 : 0.5,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${SITE_URL}/${l}/products/${p.slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
