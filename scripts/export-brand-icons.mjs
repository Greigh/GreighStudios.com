import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);
const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "public/brand/icons");
const savedSource = path.join(output, "source-artwork.png");
const sourcePath = process.argv[2] ? path.resolve(process.argv[2]) : savedSource;
const source = await readFile(sourcePath);
const sourceMetadata = await sharp(source).metadata();

if (
  sourceMetadata.format !== "png" ||
  !sourceMetadata.width ||
  sourceMetadata.width !== sourceMetadata.height
) {
  throw new Error("Source artwork must be a square PNG.");
}
if (sourceMetadata.hasAlpha && !(await sharp(source).stats()).isOpaque) {
  throw new Error("Source artwork must already have an opaque background.");
}

const sizes = [
  16, 20, 24, 29, 32, 40, 44, 48, 58, 60, 64, 72, 76, 80, 87, 96, 114, 120, 128, 144, 150, 152, 167,
  180, 192, 256, 310, 384, 512, 768, 1024, 1536, 2048,
];
const icoSizes = [16, 24, 32, 48, 64, 128, 256];
const iconsetEntries = [
  ["icon_16x16.png", 16],
  ["icon_16x16@2x.png", 32],
  ["icon_32x32.png", 32],
  ["icon_32x32@2x.png", 64],
  ["icon_128x128.png", 128],
  ["icon_128x128@2x.png", 256],
  ["icon_256x256.png", 256],
  ["icon_256x256@2x.png", 512],
  ["icon_512x512.png", 512],
  ["icon_512x512@2x.png", 1024],
];
const pngName = (size) => `greigh-studios-icon-${size}.png`;

// Every rendition starts with the original image; no chained resampling.
const rendition = (size) =>
  sharp(source)
    .resize(size, size, { kernel: sharp.kernel.lanczos3 })
    .toColourspace("srgb")
    .removeAlpha();

await mkdir(output, { recursive: true });
await writeFile(savedSource, source);
const pngs = new Map();
for (const size of sizes) {
  const png = await rendition(size).png({ compressionLevel: 9, palette: false }).toBuffer();
  pngs.set(size, png);
  await writeFile(path.join(output, pngName(size)), png);
}

await rendition(1024)
  .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
  .toFile(path.join(output, "greigh-studios-icon-1024.jpg"));
await rendition(1024)
  .webp({ lossless: true, effort: 6 })
  .toFile(path.join(output, "greigh-studios-icon-1024.webp"));

// Next.js's ICO decoder requires RGBA PNG frames. Alpha is 255 everywhere.
const icoPngs = new Map();
for (const size of icoSizes) {
  icoPngs.set(
    size,
    await sharp(pngs.get(size))
      .ensureAlpha(1)
      .png({ compressionLevel: 9, palette: false })
      .toBuffer(),
  );
}

// ICONDIR and ICONDIRENTRY headers wrap full PNG images inside a real ICO file.
const directory = Buffer.alloc(6 + icoSizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(icoSizes.length, 4);
let offset = directory.length;
for (const [index, size] of icoSizes.entries()) {
  const png = icoPngs.get(size);
  const entry = 6 + index * 16;
  directory[entry] = size === 256 ? 0 : size;
  directory[entry + 1] = size === 256 ? 0 : size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(png.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += png.length;
}
const ico = Buffer.concat([directory, ...icoSizes.map((size) => icoPngs.get(size))]);
await writeFile(path.join(output, "favicon.ico"), ico);

const iconset = path.join(output, "greigh-studios.iconset");
await mkdir(iconset, { recursive: true });
for (const [name, size] of iconsetEntries) {
  await writeFile(path.join(iconset, name), pngs.get(size));
}
const icnsPath = path.join(output, "greigh-studios.icns");
let hasIcns = true;
try {
  await run("iconutil", ["-c", "icns", "-o", icnsPath, iconset]);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  hasIcns = false;
  await rm(icnsPath, { force: true });
  console.warn("Skipped ICNS: iconutil is unavailable; the iconset is complete.");
}

const forgejo = "deploy/forgejo/custom/public/assets/img";
const aliases = [
  ["public/brand/favicon-32.png", 32],
  ["public/brand/apple-touch-icon.png", 180],
  ["src/app/icon.png", 48],
  ["src/app/apple-icon.png", 180],
  [`${forgejo}/favicon-32.png`, 32],
  [`${forgejo}/favicon.png`, 256],
  [`${forgejo}/apple-touch-icon.png`, 180],
  [`${forgejo}/logo.png`, 512],
];
for (const [name, size] of aliases) {
  const destination = path.join(root, name);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, pngs.get(size));
}
for (const name of ["src/app/favicon.ico", `${forgejo}/favicon.ico`]) {
  await writeFile(path.join(root, name), ico);
}
await writeFile(
  path.join(root, forgejo, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><image width="256" height="256" href="data:image/png;base64,${pngs.get(256).toString("base64")}"/></svg>\n`,
);

async function verifyImage(filename, size, format = "png") {
  const metadata = await sharp(filename).metadata();
  if (
    metadata.width !== size ||
    metadata.height !== size ||
    metadata.format !== format ||
    metadata.hasAlpha ||
    metadata.channels !== 3
  ) {
    throw new Error(`Invalid ${size}x${size} opaque ${format} export: ${filename}`);
  }
}
for (const size of sizes) {
  await verifyImage(path.join(output, pngName(size)), size);
}
await verifyImage(path.join(output, "greigh-studios-icon-1024.jpg"), 1024, "jpeg");
await verifyImage(path.join(output, "greigh-studios-icon-1024.webp"), 1024, "webp");
for (const [name, size] of aliases) {
  await verifyImage(path.join(root, name), size);
  if (!(await readFile(path.join(root, name))).equals(pngs.get(size))) {
    throw new Error(`Icon alias differs from its export: ${name}`);
  }
}
for (const [name, size] of iconsetEntries) {
  await verifyImage(path.join(iconset, name), size);
}

const writtenIco = await readFile(path.join(output, "favicon.ico"));
if (
  writtenIco.readUInt16LE(0) !== 0 ||
  writtenIco.readUInt16LE(2) !== 1 ||
  writtenIco.readUInt16LE(4) !== icoSizes.length
) {
  throw new Error("Invalid ICO header.");
}
for (const [index, size] of icoSizes.entries()) {
  const entry = 6 + index * 16;
  const width = writtenIco[entry] || 256;
  const height = writtenIco[entry + 1] || 256;
  const length = writtenIco.readUInt32LE(entry + 8);
  const start = writtenIco.readUInt32LE(entry + 12);
  const frame = writtenIco.subarray(start, start + length);
  if (
    width !== size ||
    height !== size ||
    writtenIco.readUInt16LE(entry + 6) !== 32 ||
    !frame.equals(icoPngs.get(size))
  ) {
    throw new Error(`Invalid ICO frame: ${size}`);
  }
  const metadata = await sharp(frame).metadata();
  if (
    metadata.width !== size ||
    metadata.height !== size ||
    metadata.format !== "png" ||
    !metadata.hasAlpha ||
    metadata.channels !== 4 ||
    !(await sharp(frame).stats()).isOpaque
  ) {
    throw new Error(`ICO frame must be fully opaque RGBA: ${size}`);
  }
}
for (const name of ["src/app/favicon.ico", `${forgejo}/favicon.ico`]) {
  if (!(await readFile(path.join(root, name))).equals(writtenIco)) {
    throw new Error(`ICO alias differs from its export: ${name}`);
  }
}
if (hasIcns) {
  const icns = await readFile(icnsPath);
  if (icns.toString("ascii", 0, 4) !== "icns" || icns.readUInt32BE(4) !== icns.length) {
    throw new Error("Invalid ICNS container.");
  }
}
const webp = await readFile(path.join(output, "greigh-studios-icon-1024.webp"));
if (!webp.includes(Buffer.from("VP8L"))) {
  throw new Error("Expected lossless WebP encoding.");
}
if (!(await readFile(savedSource)).equals(source)) {
  throw new Error("Saved source artwork differs from the original.");
}

const zipPath = path.join(output, "greigh-studios-icons.zip");
await rm(zipPath, { force: true });
let hasZip = true;
try {
  await run("zip", ["-q", "-r", "-X", zipPath, ".", "-x", "*.zip"], {
    cwd: output,
  });
  await run("unzip", ["-tq", zipPath]);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  hasZip = false;
  console.warn("Skipped ZIP packaging or verification: zip/unzip is unavailable.");
}

const upscaled = sizes.filter((size) => size > sourceMetadata.width);
console.log(
  `Exported and verified ${sizes.length} opaque RGB PNG sizes, JPEG, lossless WebP, ` +
    `${icoSizes.length}-frame ICO, 10-file iconset, ${hasIcns ? "ICNS, " : ""}` +
    `and site/Forgejo aliases${hasZip ? ", plus the ZIP bundle" : ""}.`,
);
console.log(`Source: ${sourceMetadata.width}x${sourceMetadata.height}.`);
if (upscaled.length) {
  console.log(`Upscaled renditions: ${upscaled.join(", ")} (no extra source detail).`);
}
