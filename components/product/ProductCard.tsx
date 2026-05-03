"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { getProductI18n, getProductSubName } from "@/lib/i18n/productI18n";

type Props = {
  product: Product;
  index?: number;
};

export function ProductCard({ product: p, index = 0 }: Props) {
  const locale = useLocale();
  const name = getProductI18n(p, locale).name;
  const subName = getProductSubName(p, locale);

  return (
    <article
      className="group relative animate-fade-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <Link href={`/products/${p.slug}` as any} className="block">
        <div className="relative aspect-square bg-bg overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
            {p.images && p.images.length > 0 ? (
              <Image
                src={p.images[0]} alt={name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover" unoptimized
              />
            ) : (
              <ProductVisual type={p.visualType} palette={p.palette} sku={p.sku} />
            )}
          </div>
        </div>
      </Link>

      <div className="mt-6 text-center px-2">
        <Link href={`/products/${p.slug}` as any}>
          <h3 className="mt-2 font-cnSerif text-[15px] text-ink leading-snug hover:text-red transition-colors">
            {name}
          </h3>
        </Link>
        {subName && <p className="mt-1 font-serif italic text-[12px] text-ink-mute">{subName}</p>}
      </div>
    </article>
  );
}
