// ZHUOHENG core types — shared by data layer, API, and UI.
// Keep this small and stable; UI imports from here, never from data files.

// Top-level categories used throughout filters & nav.
// `ring` and `bracelet` are kept but currently empty (waitlist) — Nav shows
// "Coming Soon" for those.
export type CategoryCode =
  | "stud"        // 耳钉
  | "drop"        // 耳坠
  | "hoop"        // 耳环
  | "necklace"    // 项链
  | "brooch"      // 胸针
  | "set"         // 套装
  | "ring"        // 戒指 (waitlist)
  | "bracelet"    // 手链 (waitlist)
  | "pendant";    // 吊坠 (legacy slot)

export type MaterialCode =
  | "925-silver"     // 925 银 / 银
  | "brass-gold"     // 铜镀金
  | "brass-silver"   // 铜镀银
  | "copper"         // 紫铜
  | "alloy"          // 合金 / 合金电镀
  | "titanium-gold"  // 钛钢镀金
  | "stainless"      // 不锈钢
  | "mixed";         // 多材质混合 / 无法归类

// Decorative elements that appear with the base material — multi-select.
export type DecorationCode =
  | "pearl"      // 珍珠 / 合成珍珠 / 仿珍珠 / 淡水珍珠
  | "cz"         // 锆石 / 合成锆石 / 水钻
  | "shell"      // 贝母 / 白贝母 / 贝壳
  | "enamel"     // 珐琅
  | "opal"       // 猫眼石 / 人造猫眼石 / 欧泊
  | "crystal"    // 水晶 / 仿水晶
  | "resin"      // 树脂
  | "rose-gold-plate"; // 镀玫瑰金 (装饰电镀)

export type PlatingCode =
  | "natural"
  | "gold"
  | "rose-gold"
  | "rhodium"
  | "black"
  | "antique";

export type StyleCode =
  | "minimalist"
  | "vintage"
  | "y2k"
  | "boho"
  | "celestial"
  | "floral"
  | "geometric"
  | "statement"
  | "everyday"
  | "luxe";

export type CollectionCode =
  | "celestial"
  | "heritage"
  | "everyday"
  | "wedding"
  | "summer";

export type StockStatus = "ready" | "made-to-order";

export type VisualType =
  | "ring"
  | "stud"
  | "earring"
  | "necklace"
  | "bracelet"
  | "pendant"
  | "brooch"
  | "set";

export type Palette = {
  bg1: string;
  bg2: string;
  metal: string;
  accent: string;
};

export type ProductI18n = {
  name: string;
  desc: string;
  metaTitle?: string;
  metaDesc?: string;
};

// Internal price band — used for filtering / sorting only.
// **Never displayed in the UI** (B2B inquiry-based pricing).
export type PriceBand = "economy" | "standard" | "premium";

export type Product = {
  sku: string;            // "ER-S001" — re-coded from legacy ID
  legacySku?: string;     // "1000106328657" — original platform ID, kept for traceability
  slug: string;           // url-safe; same as sku lowercased
  category: CategoryCode;
  subCategory?: string;
  material: MaterialCode;          // primary material — used in filters
  decorations: DecorationCode[];   // decorative elements — multi-select filter
  tags: string[];                  // ORIGINAL strings from xlsx — for search & SEO
  plating: PlatingCode[];
  style: StyleCode[];
  collection?: CollectionCode;

  // B2B fields
  moq: number;            // min order qty per style
  packSize: number;       // pcs per inner pack
  weight?: number;        // grams
  dimensions?: string;    // "15 × 20 mm"
  leadTime: [number, number]; // [min, max] in business days
  stockStatus: StockStatus;
  isOemAvailable: boolean;

  // surface badges
  isNew: boolean;
  isHot: boolean;

  // visual
  visualType: VisualType;
  palette: Palette;
  images?: string[];      // /products/{sku}.webp etc.
  thumbnail?: string;     // /products/thumb/{sku}.webp

  // internal — never shown
  _priceBand: PriceBand;

  // i18n bundles — one entry per supported locale.
  // `en` and `zh` are always populated (zh = source). Other locales fall back
  // to en if a particular SKU's translation is still pending.
  i18n: Partial<Record<Locale, ProductI18n>> & { zh: ProductI18n; en: ProductI18n };
};

export type Category = {
  code: CategoryCode;
  en: string;
  zh: string;
  visual: VisualType;
};

export type Material = {
  code: MaterialCode;
  en: string;
  zh: string;
};

export type Plating = {
  code: PlatingCode;
  en: string;
  zh: string;
  swatch: string;        // hex — for the swatch dot in filters
};

export type Style = {
  code: StyleCode;
  en: string;
  zh: string;
};

export type Collection = {
  code: CollectionCode;
  en: string;
  zh: string;
  tagline: { en: string; zh: string };
  description: { en: string; zh: string };
  heroPalette: Palette;
};

// ── Inquiry (cart-equivalent for B2B) ────────────────────────────
export type InquiryItem = {
  sku: string;
  qty: number;            // requested quantity
  note?: string;          // buyer note: color preference, packaging, etc.
  customisation?: boolean;// flag for OEM/ODM interest on this line
};

export type InquiryFormFields = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country: string;
  message: string;
  // honeypot — must remain empty; anti-bot
  hp?: string;
};

export type InquirySubmission = InquiryFormFields & {
  items: InquiryItem[];
  locale: Locale;
  source: string;         // referring page
  submittedAt: string;    // ISO
};

// ── OEM ──────────────────────────────────────────────────────────
export type OemFormFields = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country: string;
  productTypes: string[]; // ["ring", "earring"]
  estimatedQty: string;   // "200-500" / "1000-5000" / "5000+"
  needsLogo: boolean;
  needsPackaging: boolean;
  needsExclusiveDesign: boolean;
  budget?: string;
  message: string;
  hp?: string;
};

// ── Listing query ────────────────────────────────────────────────
export type ProductSort = "best" | "newest" | "moq-asc";

export type ProductQuery = {
  category?: CategoryCode;
  material?: MaterialCode;
  plating?: PlatingCode;
  style?: StyleCode;
  collection?: CollectionCode;
  priceBand?: PriceBand;
  q?: string;             // free-text search
  sort?: ProductSort;
  page?: number;
  perPage?: number;
};

export type ProductPage = {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
};

export type Locale = "zh" | "en" | "es" | "it" | "pt" | "ko" | "ja" | "ar";
