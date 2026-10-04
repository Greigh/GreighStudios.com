# Greigh Studios regular transparent icons

These exports use the original regular mark with its existing colors and transparency. The [source artwork](source-artwork.png) is **3503 × 4096 pixels**. The default saved master is included in this folder and the download bundle; it was cropped and reduced from the original 16,350 × 14,473 PNG embedded in the local `brand-assets/mark-source.svg`. [Source provenance](source-provenance.json) records that preparation. Every square rendition is independently resized from its source using Lanczos 3, with the original proportions preserved and fully transparent padding where needed. No artwork is repainted.

Every export fits within the original source resolution.

## PNG sizes

Every `greigh-studios-mark-{size}.png` is a square, 8-bit RGBA PNG:

```text
16, 20, 24, 29, 32, 40, 44, 48, 58, 60, 64, 72, 76, 80, 87, 96,
114, 120, 128, 144, 150, 152, 167, 180, 192, 256, 310, 384, 512,
768, 1024, 1536, 2048, 4096
```

Use these transparent versions wherever the mark should sit on an existing background. The [background icon set](../icons/README.md) is available separately for destinations that need an opaque square.

## Other formats

- [greigh-studios-mark-1024.webp](greigh-studios-mark-1024.webp): transparent 1024 × 1024 lossless WebP.
- [greigh-studios-mark.ico](greigh-studios-mark.ico): a 32-bit ICO container with transparent RGBA PNG frames at 16, 24, 32, 48, 64, 128, and 256 pixels.
- [greigh-studios-mark.icns](greigh-studios-mark.icns): transparent macOS icon container created with Apple's `iconutil`.
- `greigh-studios-mark.iconset/`: ten transparent macOS input PNGs, with 16, 32, 128, 256, and 512 point icons at 1× and 2×.
- [greigh-studios-transparent-icons.zip](greigh-studios-transparent-icons.zip): downloadable bundle of this directory, excluding ZIP archives. Any existing preview is included when the script runs.

## Reproduce exports

From the repository root, run:

```sh
node scripts/export-transparent-icons.mjs
```

To export a different transparent PNG, pass its absolute path:

```sh
node scripts/export-transparent-icons.mjs /absolute/path/to/transparent-source.png
```

This uses the existing `sharp` dependency. On macOS, `iconutil` creates the ICNS file and verifies it by decoding its ten images. If `iconutil` is unavailable, the complete iconset is kept and the skipped ICNS export is reported. The optional `zip` and `unzip` utilities package and check the bundle; their absence is reported. The script verifies dimensions, RGBA channels, transparency, transparent corners, visible artwork, lossless WebP encoding, ICO frame contents, and ICNS container structure. It leaves the original mark, existing website icons, and background exports untouched.
