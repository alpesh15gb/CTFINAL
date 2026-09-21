import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import path from "path";

const SRC = "D:/Cartunez/vibe_images";
const HERO_OUT = "D:/Cartunez/storefront/public/sequences/hero";
const SVC_OUT = "D:/Cartunez/storefront/public/images/services";
const PROD_OUT = "D:/Cartunez/medusa/uploads-seed"; // staging for medusa seed uploads

const files = await readdir(SRC);
await mkdir(HERO_OUT, { recursive: true });
await mkdir(SVC_OUT, { recursive: true });
await mkdir(PROD_OUT, { recursive: true });

for (const f of files) {
  const src = path.join(SRC, f);
  if (f.startsWith("frame-")) {
    const num = f.match(/frame-(\d+)/)[1];
    await sharp(src)
      .resize(1600, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(HERO_OUT, `frame-${num}.webp`));
  } else if (f.startsWith("service-")) {
    const name = f.match(/service-([a-z]+)/)[1];
    const buf = sharp(src).resize(1024, null, { withoutEnlargement: true }).webp({ quality: 82 });
    await buf.toFile(path.join(SVC_OUT, `${name}.webp`));
    await sharp(src).resize(1024, null, { withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(PROD_OUT, `${name}.webp`));
  }
}
console.log("done:", (await readdir(HERO_OUT)).length, "hero,", (await readdir(SVC_OUT)).length, "service");
