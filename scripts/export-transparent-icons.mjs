import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);
const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "public/brand/transparent-icons");
const savedSource = path.join(output, "source-artwork.png");
const sourcePath = process.argv[2] ? path.resolve(process.argv[2]) : savedSource;
const source = await readFile(sourcePath);
const sourceMetadata = await sharp(source).metadata();

if (
  sourceMetadata.format !== "png" ||
  !sourceMetadata.width ||
  !sourceMetadata.height ||
  !sourceMetadata.hasAlpha ||
  (await sharp(source).stats()).isOpaque
) {
  throw new Error("Source artwork must be a PNG with transparency.");
}

const sizes = [
  16, 20, 24, 29, 32, 40, 44, 48, 58, 60, 64, 72, 76, 80, 87, 96, 114, 120, 128, 144, 150, 152, 167,
  180, 192, 256, 310, 384, 512, 768, 1024, 1536, 2048, 4096,
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
const pngName = (size) => `greigh-studios-mark-${size}.png`;

// Resize each rendition directly from the original, preserving its proportions.
const rendition = (size) =>
  sharp(source)
    .ensureAlpha()
    .resize(size, size, {
      fit: "contain",
      kernel: sharp.kernel.lanczos3,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toColourspace("srgb");

await mkdir(output, { recursive: true });
const pngs = new Map();
for (const size of sizes) {
  const png = await rendition(size).png({ compressionLevel: 9, palette: false }).toBuffer();
  pngs.set(size, png);
  await writeFile(path.join(output, pngName(size)), png);
}
const webpPath = path.join(output, "greigh-studios-mark-1024.webp");
await rendition(1024).webp({ lossless: true, effort: 6 }).toFile(webpPath);

// PNG frames preserve full RGBA transparency inside the 32-bit ICO container.
const directory = Buffer.alloc(6 + icoSizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(icoSizes.length, 4);
let offset = directory.length;
for (const [index, size] of icoSizes.entries()) {
  const png = pngs.get(size);
  const entry = 6 + index * 16;
  directory[entry] = size === 256 ? 0 : size;
  directory[entry + 1] = size === 256 ? 0 : size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(png.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += png.length;
}
const icoPath = path.join(output, "greigh-studios-mark.ico");
await writeFile(icoPath, Buffer.concat([directory, ...icoSizes.map((size) => pngs.get(size))]));

const iconset = path.join(output, "greigh-studios-mark.iconset");
await mkdir(iconset, { recursive: true });
for (const [name, size] of iconsetEntries) {
  await writeFile(path.join(iconset, name), pngs.get(size));
}
const icnsPath = path.join(output, "greigh-studios-mark.icns");
let hasIcns = true;
try {
  await run("iconutil", ["-c", "icns", "-o", icnsPath, iconset]);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  hasIcns = false;
  await rm(icnsPath, { force: true });
  console.warn("Skipped ICNS: iconutil is unavailable; the iconset is complete.");
}

async function verifyImage(input, size, format = "png") {
  const metadata = await sharp(input).metadata();
  if (
    metadata.width !== size ||
    metadata.height !== size ||
    metadata.format !== format ||
    !metadata.hasAlpha ||
    metadata.channels !== 4 ||
    (await sharp(input).stats()).isOpaque
  ) {
    throw new Error(`Invalid ${size}x${size} transparent RGBA ${format} export.`);
  }
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alphaOffset = info.channels - 1;
  const corners = [0, size - 1, (size - 1) * size, size * size - 1];
  if (corners.some((pixel) => data[pixel * info.channels + alphaOffset] !== 0)) {
    throw new Error(`Expected fully transparent corners in ${size}x${size} export.`);
  }
  if (!(await sharp(input).stats()).channels[3].max) {
    throw new Error(`Artwork is missing from ${size}x${size} export.`);
  }
}
for (const size of sizes) {
  await verifyImage(path.join(output, pngName(size)), size);
}
await verifyImage(webpPath, 1024, "webp");
const webp = await readFile(webpPath);
if (!webp.includes(Buffer.from("VP8L"))) {
  throw new Error("Expected lossless WebP encoding.");
}
for (const [name, size] of iconsetEntries) {
  await verifyImage(path.join(iconset, name), size);
}

const writtenIco = await readFile(icoPath);
if (
  writtenIco.readUInt16LE(0) !== 0 ||
  writtenIco.readUInt16LE(2) !== 1 ||
  writtenIco.readUInt16LE(4) !== icoSizes.length
) {
  throw new Error("Invalid ICO header.");
}
let frameEnd = directory.length;
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
    writtenIco.readUInt16LE(entry + 4) !== 1 ||
    writtenIco.readUInt16LE(entry + 6) !== 32 ||
    start !== frameEnd ||
    start + length > writtenIco.length ||
    !frame.equals(pngs.get(size))
  ) {
    throw new Error(`Invalid ICO frame: ${size}`);
  }
  await verifyImage(frame, size);
  frameEnd = start + length;
}
if (frameEnd !== writtenIco.length) throw new Error("Unexpected trailing ICO data.");

if (hasIcns) {
  const icns = await readFile(icnsPath);
  if (icns.toString("ascii", 0, 4) !== "icns" || icns.readUInt32BE(4) !== icns.length) {
    throw new Error("Invalid ICNS container.");
  }
  let chunkStart = 8;
  while (chunkStart < icns.length) {
    if (chunkStart + 8 > icns.length) throw new Error("Truncated ICNS chunk header.");
    const chunkLength = icns.readUInt32BE(chunkStart + 4);
    if (chunkLength < 8 || chunkStart + chunkLength > icns.length) {
      throw new Error("Invalid ICNS chunk length.");
    }
    chunkStart += chunkLength;
  }
  const decodedIconset = path.join(output, ".verify-mark.iconset");
  try {
    await run("iconutil", ["-c", "iconset", "-o", decodedIconset, icnsPath]);
    for (const [name, size] of iconsetEntries) {
      await verifyImage(path.join(decodedIconset, name), size);
    }
  } finally {
    await rm(decodedIconset, { recursive: true, force: true });
  }
}

const sourceLink = path.relative(output, sourcePath).split(path.sep).join("/");
const upscaled = sizes.filter(
  (size) => size > Math.max(sourceMetadata.width, sourceMetadata.height),
);
await writeFile(
  path.join(output, "README.md"),
  `# Greigh Studios regular transparent icons

These exports use the original regular mark with its existing colors and transparency. The [source artwork](${sourceLink}) is **${sourceMetadata.width} × ${sourceMetadata.height} pixels**. The default saved master is included in this folder and the download bundle; it was cropped and reduced from the original 16,350 × 14,473 PNG embedded in the local \`brand-assets/mark-source.svg\`. [Source provenance](source-provenance.json) records that preparation. Every square rendition is independently resized from its source using Lanczos 3, with the original proportions preserved and fully transparent padding where needed. No artwork is repainted.

${upscaled.length ? `The **${upscaled.map((size) => `${size} × ${size}`).join(" and ")} exports are upscaled**, so they do not contain additional original detail.` : "Every export fits within the original source resolution."}

## PNG sizes

Every \`greigh-studios-mark-{size}.png\` is a square, 8-bit RGBA PNG:

\`\`\`text
16, 20, 24, 29, 32, 40, 44, 48, 58, 60, 64, 72, 76, 80, 87, 96,
114, 120, 128, 144, 150, 152, 167, 180, 192, 256, 310, 384, 512,
768, 1024, 1536, 2048, 4096
\`\`\`

Use these transparent versions wherever the mark should sit on an existing background. The [background icon set](../icons/README.md) is available separately for destinations that need an opaque square.

## Other formats

- [greigh-studios-mark-1024.webp](greigh-studios-mark-1024.webp): transparent 1024 × 1024 lossless WebP.
- [greigh-studios-mark.ico](greigh-studios-mark.ico): a 32-bit ICO container with transparent RGBA PNG frames at 16, 24, 32, 48, 64, 128, and 256 pixels.
${hasIcns ? "- [greigh-studios-mark.icns](greigh-studios-mark.icns): transparent macOS icon container created with Apple's `iconutil`.\n" : ""}- \`greigh-studios-mark.iconset/\`: ten transparent macOS input PNGs, with 16, 32, 128, 256, and 512 point icons at 1× and 2×.
- [greigh-studios-transparent-icons.zip](greigh-studios-transparent-icons.zip): downloadable bundle of this directory, excluding ZIP archives. Any existing preview is included when the script runs.

## Reproduce exports

From the repository root, run:

\`\`\`sh
node scripts/export-transparent-icons.mjs
\`\`\`

To export a different transparent PNG, pass its absolute path:

\`\`\`sh
node scripts/export-transparent-icons.mjs /absolute/path/to/transparent-source.png
\`\`\`

This uses the existing \`sharp\` dependency. On macOS, \`iconutil\` creates the ICNS file and verifies it by decoding its ten images. If \`iconutil\` is unavailable, the complete iconset is kept and the skipped ICNS export is reported. The optional \`zip\` and \`unzip\` utilities package and check the bundle; their absence is reported. The script verifies dimensions, RGBA channels, transparency, transparent corners, visible artwork, lossless WebP encoding, ICO frame contents, and ICNS container structure. It leaves the original mark, existing website icons, and background exports untouched.
`,
);

if (!(await readFile(sourcePath)).equals(source)) {
  throw new Error("Source artwork changed during export.");
}
const zipPath = path.join(output, "greigh-studios-transparent-icons.zip");
await rm(zipPath, { force: true });
let hasZip = true;
try {
  await run("zip", ["-q", "-r", "-X", zipPath, ".", "-x", "*.zip"], { cwd: output });
  await run("unzip", ["-tq", zipPath]);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  hasZip = false;
  console.warn("Skipped ZIP packaging or verification: zip/unzip is unavailable.");
}

console.log(
  `Exported and verified ${sizes.length} transparent RGBA PNG sizes, lossless WebP, ` +
    `${icoSizes.length}-frame ICO, 10-file iconset${hasIcns ? ", ICNS" : ""}` +
    `${hasZip ? ", and the ZIP bundle" : ""}.`,
);
console.log(`Source: ${sourceMetadata.width}x${sourceMetadata.height}.`);
if (upscaled.length) {
  console.log(`Upscaled renditions: ${upscaled.join(", ")} (no extra source detail).`);
}
