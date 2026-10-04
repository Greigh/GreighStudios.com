# Greigh Studios background icons

This artwork gives the Greigh Studios mark an opaque navy background, brushed silver and cyan surfaces, cyan glow, violet accents, and subtle diagonal geometry. Use it for avatars, favicons, application tiles, and other places that need a self-contained background. The transparent `mark.png` remains available separately in `public/brand`.

The saved original is [source-artwork.png](source-artwork.png), **1254 × 1254 pixels**, opaque RGB. Each export is independently resized from that original with the Lanczos 3 filter; smaller exports are never used to create larger ones. The **1536 × 1536 and 2048 × 2048 exports are upscaled**, so they do not contain additional original detail. These are raster assets, including the SVG favicon wrapper.

## PNG sizes

Every `greigh-studios-icon-{size}.png` is a square, 8-bit RGB PNG with **no alpha channel**, no baked corner mask, and the same artwork:

```text
16, 20, 24, 29, 32, 40, 44, 48, 58, 60, 64, 72, 76, 80, 87, 96,
114, 120, 128, 144, 150, 152, 167, 180, 192, 256, 310, 384, 512,
768, 1024, 1536, 2048
```

The additional small sizes cover common legacy and device-specific image slots. Platform submission requirements vary; choose the export that matches the destination's requested dimensions.

| Destination | Included files |
| --- | --- |
| Website favicons | [16](greigh-studios-icon-16.png), [32](greigh-studios-icon-32.png), [48](greigh-studios-icon-48.png), and [favicon.ico](favicon.ico) |
| Apple web clips | [152](greigh-studios-icon-152.png), [167](greigh-studios-icon-167.png), [180](greigh-studios-icon-180.png) |
| Chromium web app icons | [192](greigh-studios-icon-192.png) and [512](greigh-studios-icon-512.png) |
| General avatars and application tiles | [128](greigh-studios-icon-128.png), [256](greigh-studios-icon-256.png), [512](greigh-studios-icon-512.png), [1024](greigh-studios-icon-1024.png) |
| Larger raster artwork | [1536](greigh-studios-icon-1536.png) and [2048](greigh-studios-icon-2048.png), both upscaled |

Apple's archived [web clip guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) documents the 152, 167, and 180 pixel variants. Google's [web app manifest guide](https://web.dev/articles/add-manifest) documents the 192 and 512 pixel icons. Use `purpose: "any"` when referencing these standard square icons in a web app manifest.

## Other formats

- [greigh-studios-icon-1024.jpg](greigh-studios-icon-1024.jpg): opaque 1024 × 1024 JPEG, quality 95 with 4:4:4 chroma sampling.
- [greigh-studios-icon-1024.webp](greigh-studios-icon-1024.webp): opaque 1024 × 1024 lossless WebP.
- [favicon.ico](favicon.ico): a real ICO container with PNG-encoded 16, 24, 32, 48, 64, 128, and 256 pixel frames. Its internal PNGs use RGBA for Next.js decoder compatibility, with alpha 255 at every pixel; the artwork remains fully opaque. Standalone PNG exports use RGB without an alpha channel.
- [greigh-studios.icns](greigh-studios.icns): macOS icon container generated with Apple's `iconutil`.
- `greigh-studios.iconset/`: the ten standard macOS input PNGs for 16, 32, 128, 256, and 512 point icons at 1× and 2×. Apple's archived [high resolution guide](https://developer.apple.com/library/archive/documentation/GraphicsAnimation/Conceptual/HighResolutionOSX/Optimizing/Optimizing.html) describes the paired resolution convention.
- `design-prompt.txt`: artwork generation brief for provenance.
- [greigh-studios-icons.zip](greigh-studios-icons.zip): downloadable bundle of this directory, excluding ZIP archives. Any existing preview is included when the script runs.

## Website and Forgejo copies

The export script updates the Next.js file icons (`src/app/icon.png` at 48 pixels, `src/app/apple-icon.png` at 180 pixels, and `src/app/favicon.ico`), as well as `public/brand/favicon-32.png` and `public/brand/apple-touch-icon.png`.

Forgejo's deployment assets receive the same design: `favicon-32.png` at 32 pixels, `favicon.png` at 256 pixels, `apple-touch-icon.png` at 180 pixels, `logo.png` at 512 pixels, and the multi-size `favicon.ico`. Its `favicon.svg` embeds the 256 pixel PNG; it does not provide vector scalability. The existing transparent `logo.svg` raster wrapper remains the header logo.

## Reproduce exports

From the repository root, run:

```sh
node scripts/export-brand-icons.mjs
```

To replace the saved original and regenerate all exports from a different opaque square PNG:

```sh
node scripts/export-brand-icons.mjs /absolute/path/to/source.png
```

This uses the repository's existing `sharp` dependency. On macOS, `iconutil` creates the ICNS file; if it is unavailable, the script keeps the complete iconset and reports the skipped ICNS export. The optional `zip` and `unzip` utilities package and check the downloadable bundle; their absence is reported. The script checks image dimensions, formats, RGB channels, opacity, ICO frame contents, ICNS container integrity when available, lossless WebP encoding, and matching website/Forgejo copies. No artwork is repainted during export. If the source changes, update the source-resolution note above and regenerate any preview and downloadable archive.
