// Read 已通过清单.xlsx → produce:
//   1) scripts/sku-map.json     legacySku → newSku  (consumed by compress-images.ts)
//   2) lib/data/products.ts     production catalog (170 items)
//   3) scripts/translation-todo.csv  zh→en pairs awaiting human translation
//
// Material parsing rules: see materialFor() and decorationsFor() below — these
// are the mapping tables I derived from the 67 distinct material strings in
// the source xlsx.

import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as zlib from "node:zlib";
import { promisify } from "node:util";

const inflateRaw = promisify(zlib.inflateRaw);

// ── Constants ────────────────────────────────────────────
const XLSX_PATH = path.resolve("饰品网站/图片/已通过清单.xlsx");
const SKU_MAP_OUT = path.resolve("scripts/sku-map.json");
const PRODUCTS_OUT = path.resolve("lib/data/products.ts");
const TRANSLATION_TODO_OUT = path.resolve("scripts/translation-todo.csv");

const CATEGORY_MAP: Record<string, string> = {
  "耳钉": "stud",
  "耳坠": "drop",
  "耳环": "hoop",
  "项链": "necklace",
  "胸针": "brooch",
  "套装": "set",
};

const SKU_PREFIX: Record<string, string> = {
  stud: "ER-S",
  drop: "ED-S",
  hoop: "EH-S",
  necklace: "NK-S",
  brooch: "BC-S",
  set: "ST-S",
};

// ── Material/decoration mapping (manually derived from 67 source strings) ─
function materialFor(raw: string): string {
  const m = raw.toLowerCase();
  // 925 silver — including "S925银", "银", "银+...", "合金电镀银", "电镀银"
  if (m.includes("s925") || m.includes("925") || /^银/.test(raw) || raw.startsWith("银+")) return "925-silver";
  if (m.includes("合金电镀银") || m.includes("电镀银")) return "925-silver";
  // brass-gold
  if (raw.includes("铜镀金") || raw.includes("镀金") && raw.includes("铜")) return "brass-gold";
  // brass-silver
  if (raw.includes("铜镀银")) return "brass-silver";
  // titanium gold
  if (raw.includes("钛钢")) return "titanium-gold";
  // copper (pure)
  if (raw.includes("紫铜")) return "copper";
  // alloy
  if (raw.includes("合金")) return "alloy";
  // generic 镀金 with no base specified — treat as brass-gold (most common)
  if (raw.startsWith("镀金") || raw.startsWith("金属镀金")) return "brass-gold";
  // electroplate
  if (raw.startsWith("电镀")) return "alloy";
  // 鱼线 (fishing line) + others
  if (raw.includes("鱼线")) return "mixed";
  return "mixed";
}

function decorationsFor(raw: string): string[] {
  const out = new Set<string>();
  if (/(珍珠|淡水珍珠|合成珍珠|仿珍珠)/.test(raw)) out.add("pearl");
  if (/(锆石|合成锆石|水钻)/.test(raw)) out.add("cz");
  if (/(贝母|白贝母|贝壳)/.test(raw)) out.add("shell");
  if (/(珐琅)/.test(raw)) out.add("enamel");
  if (/(猫眼石|人造猫眼石|欧泊)/.test(raw)) out.add("opal");
  if (/(水晶|仿水晶)/.test(raw)) out.add("crystal");
  if (/(树脂)/.test(raw)) out.add("resin");
  if (/(玫瑰金)/.test(raw)) out.add("rose-gold-plate");
  return [...out];
}

function platingFor(raw: string): string[] {
  const out = new Set<string>();
  if (/(镀金|金属镀金)/.test(raw)) out.add("gold");
  if (/(玫瑰金)/.test(raw)) out.add("rose-gold");
  if (/(镀银|电镀银)/.test(raw)) out.add("silver");
  if (out.size === 0) {
    if (/^银/.test(raw) || /S925/.test(raw)) out.add("rhodium");
    else out.add("natural");
  }
  return [...out];
}

// ── Tag parsing ──────────────────────────────────────────
function parseTags(rawTagsStr: string): string[] {
  if (!rawTagsStr) return [];
  return rawTagsStr.split(/[,，、]/).map((s) => s.trim()).filter(Boolean);
}

// ── XLSX reading (zero-dependency, just zip + inline strings) ─────────────
type Row = {
  legacySku: string;
  category: string;
  name: string;
  material: string;
  desc: string;
  refFrame: string;
  tags: string;
};

async function parseXlsx(file: string): Promise<Row[]> {
  const buf = await fs.readFile(file);
  const sheetXml = await readZipEntry(buf, "xl/worksheets/sheet1.xml");
  // Cells use `t="inlineStr"` with `<is><t>...</t></is>` for our file
  return parseSheet(sheetXml);
}

function parseSheet(xml: string): Row[] {
  const rows: Row[] = [];
  // Match <row r="N">...</row>
  const rowRegex = /<row[^>]*\br="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
  let m: RegExpExecArray | null;
  while ((m = rowRegex.exec(xml)) !== null) {
    const rowNum = Number(m[1]);
    if (rowNum === 1) continue; // header
    const cells = parseCells(m[2]);
    if (!cells.A) continue;
    rows.push({
      legacySku: cells.A,
      category:  cells.C ?? "",
      name:      cells.D ?? "",
      material:  cells.E ?? "",
      desc:      cells.F ?? "",
      refFrame:  cells.G ?? "",
      tags:      cells.H ?? "",
    });
  }
  return rows;
}

function parseCells(rowXml: string): Record<string, string> {
  const out: Record<string, string> = {};
  const cellRegex = /<c[^>]*\br="([A-Z]+)\d+"[^>]*>([\s\S]*?)<\/c>/g;
  let m: RegExpExecArray | null;
  while ((m = cellRegex.exec(rowXml)) !== null) {
    const col = m[1];
    const inner = m[2];
    // <is><t>value</t></is>  or  <is><t xml:space="preserve">value</t></is>
    const tMatch = /<t[^>]*>([\s\S]*?)<\/t>/.exec(inner);
    if (tMatch) out[col] = decodeXml(tMatch[1]);
  }
  return out;
}

function decodeXml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

async function readZipEntry(buf: Buffer, name: string): Promise<string> {
  // ZIP central directory parsing — minimal
  // Locate end-of-central-directory record (signature 0x06054b50)
  let eocdr = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocdr = i; break; }
  }
  if (eocdr === -1) throw new Error("EOCDR not found");
  const cdSize   = buf.readUInt32LE(eocdr + 12);
  const cdOffset = buf.readUInt32LE(eocdr + 16);
  let p = cdOffset;
  const end = cdOffset + cdSize;
  while (p < end) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break; // CDFH signature
    const nameLen   = buf.readUInt16LE(p + 28);
    const extraLen  = buf.readUInt16LE(p + 30);
    const commentLen= buf.readUInt16LE(p + 32);
    const localOff  = buf.readUInt32LE(p + 42);
    const fileName  = buf.subarray(p + 46, p + 46 + nameLen).toString("utf-8");
    p += 46 + nameLen + extraLen + commentLen;
    if (fileName === name) {
      // Read local file header at localOff
      const sig = buf.readUInt32LE(localOff);
      if (sig !== 0x04034b50) throw new Error("Local file header signature mismatch");
      const compMethod = buf.readUInt16LE(localOff + 8);
      const compSize   = buf.readUInt32LE(localOff + 18);
      const lfNameLen  = buf.readUInt16LE(localOff + 26);
      const lfExtraLen = buf.readUInt16LE(localOff + 28);
      const dataStart  = localOff + 30 + lfNameLen + lfExtraLen;
      const compressed = buf.subarray(dataStart, dataStart + compSize);
      let raw: Buffer;
      if (compMethod === 0) raw = compressed;
      else if (compMethod === 8) raw = await inflateRaw(compressed);
      else throw new Error(`Unsupported compression method: ${compMethod}`);
      return raw.toString("utf-8");
    }
  }
  throw new Error(`Entry not found: ${name}`);
}

// ── Slug helper ──────────────────────────────────────────
function toSlug(sku: string): string {
  return sku.toLowerCase();
}

// ── Output writers ───────────────────────────────────────
async function writeProductsFile(products: any[], skuMap: Record<string, string>) {
  const json = JSON.stringify(products, null, 2);
  const file = `// AUTO-GENERATED by scripts/import-products.ts — DO NOT EDIT BY HAND.
// To regenerate:  npm run import:products
//
// Source: 饰品网站/图片/已通过清单.xlsx (170 SKUs)
// Translations: pulled from scripts/translations-en.json (filled by hand, see scripts/translation-todo.csv)

import type { Product, Palette } from "../types";

export const P_SILVER: Palette  = { bg1: "#F5EFE5", bg2: "#E2D9CB", metal: "#D6CFC0", accent: "#6E6457" };
export const P_GOLD: Palette    = { bg1: "#F5EFE5", bg2: "#E5D2A8", metal: "#C9A86A", accent: "#9A7D45" };
export const P_ROSE: Palette    = { bg1: "#F8E8E0", bg2: "#E8C9B4", metal: "#D9A78F", accent: "#8E5436" };
export const P_COPPER: Palette  = { bg1: "#F4ECDD", bg2: "#D9C19A", metal: "#B6724B", accent: "#5A3625" };
export const P_BLACK: Palette   = { bg1: "#E8E5DF", bg2: "#9A8878", metal: "#3D332C", accent: "#2C2420" };
export const P_VINTAGE: Palette = { bg1: "#F4ECDD", bg2: "#C5A881", metal: "#7C5A3C", accent: "#3F2A18" };

export const DEMO_PRODUCTS: Product[] = ${json} as Product[];
`;
  await fs.writeFile(PRODUCTS_OUT, file, "utf-8");
}

// ── Build product objects ────────────────────────────────
async function build(rows: Row[]) {
  const counters: Record<string, number> = {};
  const skuMap: Record<string, string> = {};
  const products: any[] = [];
  const translationRows: string[] = ["legacySku,newSku,zh_name,en_name_TODO,zh_desc,en_desc_TODO"];

  // Try load existing translation files for each non-source locale
  const LOCALES = ["en", "es", "it", "pt", "ko", "ja", "ar"] as const;
  type LocaleCode = (typeof LOCALES)[number];
  const translations: Record<LocaleCode, Record<string, { name?: string; desc?: string }>> = {
    en: {}, es: {}, it: {}, pt: {}, ko: {}, ja: {}, ar: {},
  };
  for (const l of LOCALES) {
    try {
      const raw = await fs.readFile(path.resolve(`scripts/translations-${l}.json`), "utf-8");
      translations[l] = JSON.parse(raw);
    } catch { /* file not present yet */ }
  }

  for (const r of rows) {
    const cat = CATEGORY_MAP[r.category];
    if (!cat) {
      console.warn(`! Unknown category "${r.category}" — skipping ${r.legacySku}`);
      continue;
    }
    const prefix = SKU_PREFIX[cat];
    counters[cat] = (counters[cat] ?? 0) + 1;
    const newSku = `${prefix}${String(counters[cat]).padStart(3, "0")}`;
    skuMap[r.legacySku] = newSku;

    const material = materialFor(r.material);
    const decorations = decorationsFor(r.material);
    const plating = platingFor(r.material);
    const tags = parseTags(r.tags);

    // Build i18n bundle from translation files (one per locale)
    const i18nBundle: Record<string, { name: string; desc: string }> = {
      zh: { name: r.name, desc: r.desc },
    };
    for (const l of LOCALES) {
      const tr = translations[l][newSku] ?? {};
      i18nBundle[l] = {
        name: tr.name ?? `__TODO_${l}__ ${r.name}`,
        desc: tr.desc ?? `__TODO_${l}__ ${r.desc}`,
      };
    }

    // Track whether any translation is still missing for this SKU (CSV report)
    const enName = i18nBundle.en.name;
    const enDesc = i18nBundle.en.desc;
    translationRows.push(
      [r.legacySku, newSku, csvEscape(r.name), csvEscape(enName), csvEscape(r.desc), csvEscape(enDesc)].join(",")
    );

    // pick palette by material
    const palette =
      material.includes("gold") ? "P_GOLD" :
      material === "925-silver" ? "P_SILVER" :
      material === "copper"     ? "P_COPPER" :
      material === "alloy"      ? "P_BLACK" :
      "P_VINTAGE";

    // Visual type by category
    const visualType =
      cat === "stud" ? "stud" :
      cat === "drop" || cat === "hoop" ? "earring" :
      cat === "necklace" ? "necklace" :
      cat === "brooch" ? "brooch" :
      cat === "set" ? "set" :
      "ring";

    products.push({
      sku: newSku,
      legacySku: r.legacySku,
      slug: toSlug(newSku),
      category: cat,
      material,
      decorations,
      tags,
      plating,
      style: [],            // not derivable from xlsx; leave empty
      moq: 240,
      packSize: 24,
      leadTime: [15, 20],
      stockStatus: "ready",
      isOemAvailable: true,
      isNew: false,
      isHot: false,
      visualType,
      palette: `__PAL__${palette}__`,  // sentinel — replaced post-stringify
      images: [`/products/${newSku}.webp`],
      thumbnail: `/products/thumb/${newSku}.webp`,
      _priceBand: "standard",
      i18n: i18nBundle,
    });
  }

  // Mark first 8 of each category as Hot for demo purposes
  for (const cat of Object.keys(counters)) {
    let hot = 0;
    for (const p of products) {
      if (p.category === cat && hot < 4) {
        p.isHot = true;
        hot++;
      }
    }
  }
  // Mark last 4 of stud as new for "新品" strip
  let newCount = 0;
  for (const p of [...products].reverse()) {
    if (p.category === "stud" && newCount < 4) {
      p.isNew = true;
      newCount++;
    }
  }

  // Stringify with palette-sentinel replacement
  let json = JSON.stringify(products, null, 2);
  json = json.replace(/"__PAL__([A-Z_]+)__"/g, "$1");
  // We need products array but JSON stringify already puts quotes — need to write the file with replaced sentinels
  // Re-parse trick won't work; write custom output
  const productsLiteral = json;
  const fileBody = `// AUTO-GENERATED by scripts/import-products.ts — DO NOT EDIT BY HAND.
// Source: 饰品网站/图片/已通过清单.xlsx
// To regenerate:  npm run import:products

import type { Product, Palette } from "../types";

export const P_SILVER: Palette  = { bg1: "#F5EFE5", bg2: "#E2D9CB", metal: "#D6CFC0", accent: "#6E6457" };
export const P_GOLD: Palette    = { bg1: "#F5EFE5", bg2: "#E5D2A8", metal: "#C9A86A", accent: "#9A7D45" };
export const P_ROSE: Palette    = { bg1: "#F8E8E0", bg2: "#E8C9B4", metal: "#D9A78F", accent: "#8E5436" };
export const P_COPPER: Palette  = { bg1: "#F4ECDD", bg2: "#D9C19A", metal: "#B6724B", accent: "#5A3625" };
export const P_BLACK: Palette   = { bg1: "#E8E5DF", bg2: "#9A8878", metal: "#3D332C", accent: "#2C2420" };
export const P_VINTAGE: Palette = { bg1: "#F4ECDD", bg2: "#C5A881", metal: "#7C5A3C", accent: "#3F2A18" };

export const DEMO_PRODUCTS: Product[] = ${productsLiteral} as Product[];
`;

  await fs.writeFile(PRODUCTS_OUT, fileBody, "utf-8");
  await fs.writeFile(SKU_MAP_OUT, JSON.stringify(skuMap, null, 2), "utf-8");
  await fs.writeFile(TRANSLATION_TODO_OUT, translationRows.join("\n"), "utf-8");

  return { products, skuMap, counters };
}

function csvEscape(s: string): string {
  if (!s) return "";
  if (/[,\n"]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// ── Main ────────────────────────────────────────────────
async function main() {
  console.log(`Reading ${XLSX_PATH}…`);
  const rows = await parseXlsx(XLSX_PATH);
  console.log(`  parsed ${rows.length} rows`);

  const { products, counters } = await build(rows);

  console.log("");
  console.log(`✓ Wrote ${PRODUCTS_OUT}  (${products.length} products)`);
  console.log(`✓ Wrote ${SKU_MAP_OUT}`);
  console.log(`✓ Wrote ${TRANSLATION_TODO_OUT}`);
  console.log("");
  console.log("Per-category counts:");
  for (const [k, v] of Object.entries(counters)) {
    console.log(`  ${k.padEnd(10)} ${v}`);
  }
  console.log("");
  console.log("Next:");
  console.log("  1. Translations are stubbed with __TODO__. Fill scripts/translations-en.json then re-run this script.");
  console.log("  2. Run image compression:  npm run compress:images");
}

main().catch((e) => { console.error(e); process.exit(1); });
