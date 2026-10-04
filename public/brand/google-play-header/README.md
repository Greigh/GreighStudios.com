# Greigh Studios Google Play header

[Ready-to-upload JPEG](greigh-studios-google-play-header-4096x2304.jpg): **4096 × 2304 pixels (16:9)**, RGB with no alpha, **387,288 bytes**. JPEG quality 80, below the requested 1,000,000-byte cap.

The artwork follows the atmospheric, text-free studio brief: indigo and teal, stylized clouds, subtle radar and blueprint/data contours, and a single warm amber horizon accent. It was created with the built-in image generator. The selected [source artwork](source-artwork.png) is 1672 × 941; the final JPEG is resized and center-cropped to the exact upload dimensions. The source PNG is an editable original and is not the capped upload file.

[Google Play's official developer profile documentation](https://support.google.com/googleplay/android-developer/answer/9873827?hl=en) specifies 4096 × 2304 and JPG or 24-bit PNG without alpha for the header. The 1 MB cap here follows the requested brief.

The [generation brief](design-prompt.txt) records the prompts. [Export details](export-details.json) record the exact dimensions, file size, and quality setting.

Regenerate the upload file from the saved source:

```sh
node scripts/export-google-play-header.mjs
```
