"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale } from "next-intl";
import { ProductVisual } from "./ProductVisual";
import type { Product } from "@/lib/types";
import { getProductI18n } from "@/lib/i18n/productI18n";

export function ProductGallery({ product }: { product: Product }) {
  const locale = useLocale();
  const sources = (product.images && product.images.length > 0) ? product.images : [];
  const thumbs = sources.length === 0 ? [null] : sources;
  const [active, setActive] = useState(0);
  const activeSrc = thumbs[active];
  const name = getProductI18n(product, locale).name;

  return (
    <div>
      <div className="relative aspect-square bg-bg border border-line overflow-hidden">
        {activeSrc ? (
          <Image src={activeSrc} alt={name} fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover" priority unoptimized />
        ) : (
          <ProductVisual type={product.visualType} palette={product.palette} sku={product.sku} />
        )}
      </div>
      {thumbs.length > 1 && (
        <div className="mt-4 flex gap-2 lg:gap-3">
          {thumbs.map((src, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={[
                "relative aspect-square w-20 lg:w-24 overflow-hidden border transition-colors",
                i === active ? "border-ink" : "border-line hover:border-ink/40",
              ].join(" ")}>
              {src ? (
                <Image src={src} alt="" fill sizes="120px" className="object-cover" unoptimized />
              ) : (
                <ProductVisual type={product.visualType} palette={product.palette} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
