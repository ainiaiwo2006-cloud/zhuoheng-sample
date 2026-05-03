import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

type Props = {
  products: Product[];
  title: string;
  titleEn?: string;
  more?: { label: string; href: string };
};

export function BestsellerStrip({ products, title, titleEn, more }: Props) {
  return (
    <section className="py-24 lg:py-32 bg-bg">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <SectionHeader title={title} titleEn={titleEn} />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-8 lg:gap-y-16 mt-16">
          {products.slice(0, 8).map((p, i) => (
            <ProductCard key={p.sku} product={p} index={i} />
          ))}
        </div>

        {more && (
          <div className="mt-16 flex justify-center">
            <Link href={more.href as any} className="btn btn-outline">
              {more.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionHeader({ title, titleEn }: { title: string; titleEn?: string }) {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="flex items-center gap-3 text-ink-faint mb-7">
        <span className="w-20 h-px bg-line-strong" />
        <span className="w-1.5 h-1.5 rounded-full border border-ink-faint" />
        <span className="w-20 h-px bg-line-strong" />
      </div>
      <h2 className="font-cnSerif text-[30px] lg:text-[42px] font-medium text-ink leading-tight">
        {title}
      </h2>
      {titleEn && (
        <p className="mt-3 font-serif italic text-ink-mute tracking-wide">
          {titleEn}
        </p>
      )}
    </header>
  );
}
