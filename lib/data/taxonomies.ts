// Taxonomy definitions — the master lists for categories, materials, etc.
// UI components import from here so labels stay consistent.

import type {
  Category, Collection, Material, Plating, Style, DecorationCode, CategoryCode,
} from "../types";

// `comingSoon: true` flags categories that have no SKUs yet — Nav can render
// a "Coming Soon" tag and link to a wait-list page.
export type ExtendedCategory = Category & { comingSoon?: boolean };

export const CATEGORIES: ExtendedCategory[] = [
  { code: "stud",     en: "Stud Earrings",  zh: "耳钉",  visual: "stud" },
  { code: "drop",     en: "Drop Earrings",  zh: "耳坠",  visual: "earring" },
  { code: "hoop",     en: "Hoop Earrings",  zh: "耳环",  visual: "earring" },
  { code: "necklace", en: "Necklaces",      zh: "项链",  visual: "necklace" },
  { code: "brooch",   en: "Brooches",       zh: "胸针",  visual: "brooch" },
  { code: "set",      en: "Sets",           zh: "套装",  visual: "set" },
  { code: "ring",     en: "Rings",          zh: "戒指",  visual: "ring",     comingSoon: true },
  { code: "bracelet", en: "Bracelets",      zh: "手链",  visual: "bracelet", comingSoon: true },
];

export const MATERIALS: Material[] = [
  { code: "925-silver",    en: "925 Sterling Silver",   zh: "925 银" },
  { code: "brass-gold",    en: "Brass · Gold-Plated",   zh: "铜镀金" },
  { code: "brass-silver",  en: "Brass · Silver-Plated", zh: "铜镀银" },
  { code: "copper",        en: "Copper",                zh: "紫铜" },
  { code: "alloy",         en: "Alloy",                 zh: "合金" },
  { code: "titanium-gold", en: "Titanium Steel · Gold", zh: "钛钢镀金" },
  { code: "stainless",     en: "Stainless Steel",       zh: "不锈钢" },
  { code: "mixed",         en: "Mixed Materials",       zh: "混合材质" },
];

// Decorative elements (multi-select filter) — distinct from base material.
export type Decoration = { code: DecorationCode; en: string; zh: string };

export const DECORATIONS: Decoration[] = [
  { code: "pearl",    en: "Pearl",    zh: "珍珠" },
  { code: "cz",       en: "Zircon / CZ", zh: "锆石" },
  { code: "shell",    en: "Mother-of-Pearl", zh: "贝母" },
  { code: "enamel",   en: "Enamel",   zh: "珐琅" },
  { code: "opal",     en: "Cat's-Eye / Opal", zh: "猫眼石" },
  { code: "crystal",  en: "Crystal",  zh: "水晶" },
  { code: "resin",    en: "Resin",    zh: "树脂" },
  { code: "rose-gold-plate", en: "Rose-Gold Accent", zh: "镀玫瑰金" },
];

export const findDecoration = (code: string) =>
  DECORATIONS.find((d) => d.code === code);

// Quick lookup: which categories are "active" (have products)?
export const ACTIVE_CATEGORIES = CATEGORIES.filter((c) => !c.comingSoon);
export const COMING_SOON_CATEGORIES = CATEGORIES.filter((c) => c.comingSoon);

// Earrings sub-group helper for Nav (耳钉 / 耳坠 / 耳环 grouped)
export const EARRING_CODES: CategoryCode[] = ["stud", "drop", "hoop"];

export const PLATINGS: Plating[] = [
  { code: "natural",   en: "Natural",       zh: "本色",   swatch: "#D9CDB8" },
  { code: "gold",      en: "Gold Plated",   zh: "镀金",   swatch: "#C9A86A" },
  { code: "rose-gold", en: "Rose Gold",     zh: "玫瑰金", swatch: "#D9A78F" },
  { code: "rhodium",   en: "Rhodium",       zh: "白金/铑",swatch: "#E8E4DA" },
  { code: "black",     en: "Black",         zh: "黑色",   swatch: "#2C2420" },
  { code: "antique",   en: "Antique",       zh: "古铜",   swatch: "#7C5A3C" },
];

export const STYLES: Style[] = [
  { code: "minimalist", en: "Minimalist", zh: "极简" },
  { code: "vintage",    en: "Vintage",    zh: "复古" },
  { code: "y2k",        en: "Y2K",        zh: "Y2K" },
  { code: "boho",       en: "Bohemian",   zh: "波西米亚" },
  { code: "celestial",  en: "Celestial",  zh: "星月" },
  { code: "floral",     en: "Floral",     zh: "花卉" },
  { code: "geometric",  en: "Geometric",  zh: "几何" },
  { code: "statement",  en: "Statement",  zh: "夸张" },
  { code: "everyday",   en: "Everyday",   zh: "日常" },
  { code: "luxe",       en: "Luxe",       zh: "轻奢" },
];

export const COLLECTIONS: Collection[] = [
  {
    code: "celestial",
    en: "Celestial Series",
    zh: "星月系列",
    tagline: {
      en: "Stars, moons & galaxies in 925 silver",
      zh: "925 银星月主题，428 款现货发货",
    },
    description: {
      en: "Star, moon and galaxy motifs in sterling silver and brass. 428 designs from Spring/Summer 2026.",
      zh: "星辰、月相、银河主题，925 银与黄铜精制。2026 春夏共 428 款。",
    },
    heroPalette: {
      bg1: "#1F2840", bg2: "#3D4A6B", metal: "#D9C8A0", accent: "#7B86A6",
    },
  },
  {
    code: "heritage",
    en: "Heritage Collection",
    zh: "传承系列",
    tagline: {
      en: "Hand-crafted brass with traditional motifs",
      zh: "手工錾刻黄铜，传统纹样",
    },
    description: {
      en: "Vintage-inspired brass and copper jewellery, hand-engraved by our Yiwu artisans.",
      zh: "复古风格黄铜与紫铜饰品，由义乌师傅手工錾刻。",
    },
    heroPalette: {
      bg1: "#F4ECDD", bg2: "#D9C19A", metal: "#9A7D45", accent: "#7C4A2C",
    },
  },
  {
    code: "everyday",
    en: "Everyday Essentials",
    zh: "日常基础",
    tagline: {
      en: "Minimalist staples your customers wear daily",
      zh: "极简日佩款，客户每日佩戴",
    },
    description: {
      en: "Stackable, layerable, year-round bestsellers. Low MOQ, fast turnaround.",
      zh: "可叠戴可分戴的常青款。低起订量，快速交货。",
    },
    heroPalette: {
      bg1: "#FAF7F3", bg2: "#EDE4D8", metal: "#BBAFA0", accent: "#7C6E60",
    },
  },
  {
    code: "wedding",
    en: "Wedding & Bridal",
    zh: "婚嫁系列",
    tagline: {
      en: "Wholesale bridal sets for Asian markets",
      zh: "亚洲市场婚嫁套装批发",
    },
    description: {
      en: "Bridal-ready necklace + earring + bracelet sets, popular in SE Asia and the Middle East.",
      zh: "项链+耳饰+手链套装，东南亚及中东市场热销。",
    },
    heroPalette: {
      bg1: "#F8E6E0", bg2: "#D9A78F", metal: "#C9A86A", accent: "#8E5436",
    },
  },
  {
    code: "summer",
    en: "Summer Drop",
    zh: "夏日新品",
    tagline: {
      en: "Resort-ready coastal & boho pieces",
      zh: "度假风海洋与波西米亚款",
    },
    description: {
      en: "Shells, pearls and bright stones for the warm season.",
      zh: "贝壳、珍珠、彩色宝石，专为暖季设计。",
    },
    heroPalette: {
      bg1: "#E8F0F2", bg2: "#A8C2C6", metal: "#D9C19A", accent: "#5A7E80",
    },
  },
];

// fast lookup helpers
export const findCategory = (code: string) =>
  CATEGORIES.find((c) => c.code === code);
export const findMaterial = (code: string) =>
  MATERIALS.find((m) => m.code === code);
export const findPlating = (code: string) =>
  PLATINGS.find((p) => p.code === code);
export const findStyle = (code: string) =>
  STYLES.find((s) => s.code === code);
export const findCollection = (code: string) =>
  COLLECTIONS.find((c) => c.code === code);
