// Resizes & compresses the raw phone photos in "All images/" down to web-friendly
// sizes and writes them into public/images. Also strips EXIF (incl. GPS) for privacy.
// Run with: npm run optimize-images
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'All images');
const OUT_DIR = path.join(ROOT, 'public', 'images');

const FULL_WIDTH = 1920;
const THUMB_WIDTH = 700;
const FULL_QUALITY = 78;
const THUMB_QUALITY = 72;

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const entries = await readdir(SRC_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort(); // filenames are timestamp-based -> chronological order

  console.log(`Found ${files.length} photos. Optimizing...`);

  const manifest = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const index = String(i + 1).padStart(2, '0');
    const outName = `memory-${index}.jpg`;
    const thumbName = `memory-${index}-thumb.jpg`;
    const srcPath = path.join(SRC_DIR, file);

    const img = sharp(srcPath).rotate(); // auto-orient from EXIF, then strip metadata on output

    await img
      .clone()
      .resize({ width: FULL_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: FULL_QUALITY, progressive: true, mozjpeg: true })
      .toFile(path.join(OUT_DIR, outName));

    await img
      .clone()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: THUMB_QUALITY, progressive: true, mozjpeg: true })
      .toFile(path.join(OUT_DIR, thumbName));

    const meta = await sharp(path.join(OUT_DIR, outName)).metadata();
    manifest.push({
      src: `images/${outName}`,
      thumb: `images/${thumbName}`,
      width: meta.width,
      height: meta.height,
    });

    console.log(`  [${index}/${files.length}] ${file} -> ${outName}`);
  }

  const manifestPath = path.join(ROOT, 'src', 'assets', 'photoManifest.json');
  await mkdir(path.dirname(manifestPath), { recursive: true });
  const { writeFile } = await import('node:fs/promises');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\nDone. ${manifest.length} photos optimized.`);
  console.log(`Manifest written to src/assets/photoManifest.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
