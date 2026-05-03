// Compress full-resolution white-background PNGs from
//   饰品网站/图片/白底批量/{LEGACY_SKU}_白底.png
// into:
//   public/products/{NEW_SKU}.webp           — 1200×1200 q80, ~120 KB each
//   public/products/thumb/{NEW_SKU}.webp     — 400×400  q75, ~25  KB each
//
// Mapping legacy → new SKU is read from out of the import script's manifest
// (sku-map.json), so this script depends on import-products.ts being run
// first OR a manual map being present.
//
// Usage:  npm run compress:images

import * as fs from "node:fs/promises";
import * as path from "node:path";
import sharp from "sharp";

const SRC_DIR  = path.resolve("饰品网站/图片/白底批量");
const OUT_DIR  = path.resolve("public/products");
const THUMB_DIR = path.resolve("public/products/thumb");
const MAP_FILE = path.resolve("scripts/sku-map.json");

type SkuMap = Record<string, string>; // legacySku -> newSku

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(THUMB_DIR, { recursive: true });

  const map: SkuMap = await readSkuMap();

  const files = (await fs.readdir(SRC_DIR)).filter((f) => f.endsWith(".png"));
  console.log(`Found ${files.length} PNGs in ${SRC_DIR}`);
  console.log(`SKU map has ${Object.keys(map).length} entries`);

  let done = 0, skipped = 0, missing = 0;
  const startedAt = Date.now();

  for (const file of files) {
    // file looks like "1000106328657_白底.png" — strip suffix to get legacy SKU
    const legacy = file.replace(/_.*\.png$/, "").replace(/\.png$/, "");
    const newSku = map[legacy];
    if (!newSku) {
      missing++;
      continue;
    }
    const srcPath = path.join(SRC_DIR, file);
    const outPath   = path.join(OUT_DIR,   `${newSku}.webp`);
    const thumbPath = path.join(THUMB_DIR, `${newSku}.webp`);

    try {
      // already exists? skip (idempotent)
      try {
        await fs.stat(outPath);
        await fs.stat(thumbPath);
        skipped++;
        continue;
      } catch { /* not present, generate */ }

      // big version
      await sharp(srcPath)
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true, background: "#FFFFFF" })
        .webp({ quality: 80, effort: 4 })
        .toFile(outPath);

      // thumbnail
      await sharp(srcPath)
        .resize(400, 400, { fit: "inside", withoutEnlargement: true, background: "#FFFFFF" })
        .webp({ quality: 75, effort: 4 })
        .toFile(thumbPath);

      done++;
      if (done % 25 === 0) console.log(`  …${done} processed`);
    } catch (e) {
      console.error(`✗ ${file}:`, e);
    }
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log("");
  console.log(`✓ Compressed:  ${done}`);
  console.log(`↻ Skipped:     ${skipped} (already exist)`);
  console.log(`? No SKU map:  ${missing} (legacy IDs not in scripts/sku-map.json)`);
  console.log(`Elapsed: ${elapsed}s`);
}

async function readSkuMap(): Promise<SkuMap> {
  try {
    const raw = await fs.readFile(MAP_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    console.error(`! ${MAP_FILE} not found — run 'npm run import:products' first.`);
    console.error("  Falling back to identity map (legacy SKU = new SKU).");
    const files = (await fs.readdir(SRC_DIR)).filter((f) => f.endsWith(".png"));
    const map: SkuMap = {};
    for (const f of files) {
      const id = f.replace(/_.*\.png$/, "").replace(/\.png$/, "");
      map[id] = id;
    }
    return map;
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
