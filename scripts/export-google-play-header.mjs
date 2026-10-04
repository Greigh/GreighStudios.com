import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "public/brand/google-play-header");
const sourcePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(output, "source-artwork.png");
const source = await readFile(sourcePath);
const sourceMetadata = await sharp(source).metadata();
const byteLimit = 1_000_000;
const filename = "greigh-studios-google-play-header-4096x2304.jpg";
const canvas = await sharp(source)
  .rotate()
  .resize(4096, 2304, { fit: "cover", position: "centre", kernel: sharp.kernel.lanczos3 })
  .toColourspace("srgb")
  .removeAlpha()
  .png()
  .toBuffer();

let image;
let quality;
for (const candidate of [80, 78, 76, 74, 72, 70, 68, 65, 60]) {
  const buffer = await sharp(canvas)
    .jpeg({ quality: candidate, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();
  if (buffer.length < byteLimit) {
    image = buffer;
    quality = candidate;
    break;
  }
}
if (!image) throw new Error("Could not fit the header below the 1,000,000-byte limit.");
const metadata = await sharp(image).metadata();
if (
  metadata.format !== "jpeg" ||
  metadata.width !== 4096 ||
  metadata.height !== 2304 ||
  metadata.channels !== 3 ||
  metadata.hasAlpha
) {
  throw new Error("Expected a 4096x2304 RGB JPEG without alpha.");
}

await mkdir(output, { recursive: true });
await writeFile(path.join(output, filename), image);
const details = {
  file: filename,
  width: metadata.width,
  height: metadata.height,
  format: metadata.format,
  bytes: image.length,
  byteLimit,
  jpegQuality: quality,
  channels: metadata.channels,
  sourceWidth: sourceMetadata.width,
  sourceHeight: sourceMetadata.height,
  generatedWith: "Built-in image_gen tool",
};
await writeFile(path.join(output, "export-details.json"), `${JSON.stringify(details, null, 2)}\n`);
await writeFile(
  path.join(output, "README.md"),
  `# Greigh Studios Google Play header

[Ready-to-upload JPEG](${filename}): **4096 × 2304 pixels (16:9)**, RGB with no alpha, **${image.length.toLocaleString("en-US")} bytes**. JPEG quality ${quality}, below the requested 1,000,000-byte cap.

The artwork follows the atmospheric, text-free studio brief: indigo and teal, stylized clouds, subtle radar and blueprint/data contours, and a single warm amber horizon accent. It was created with the built-in image generator. The selected [source artwork](source-artwork.png) is ${sourceMetadata.width} × ${sourceMetadata.height}; the final JPEG is resized and center-cropped to the exact upload dimensions. The source PNG is an editable original and is not the capped upload file.

[Google Play's official developer profile documentation](https://support.google.com/googleplay/android-developer/answer/9873827?hl=en) specifies 4096 × 2304 and JPG or 24-bit PNG without alpha for the header. The 1 MB cap here follows the requested brief.

The [generation brief](design-prompt.txt) records the prompts. [Export details](export-details.json) record the exact dimensions, file size, and quality setting.

Regenerate the upload file from the saved source:

\`\`\`sh
node scripts/export-google-play-header.mjs
\`\`\`
`,
);
console.log(JSON.stringify(details, null, 2));
