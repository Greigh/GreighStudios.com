import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    useTypeScriptCli: true,
  },
  images: {
    /* Next 16 refuses to optimize a local src carrying a query string unless
       it's listed here — that restriction, not stale output, is the real
       reason BrandMark was marked `unoptimized`.

       Defining localPatterns BLOCKS every local path not listed, so all four
       optimized images have to appear. `search` is compared with strict
       equality against url.search and includes the leading "?"; an exact
       value (rather than omitting the field) keeps the optimizer from being
       pointed at arbitrary query strings. */
    localPatterns: [
      { pathname: "/brand/**", search: "?v=cropped-1" },
      { pathname: "/work/**", search: "" },
      { pathname: "/founder-daniel.webp", search: "" },
    ],
  },
  /* Bare hostnames only — no scheme, no port. Next compares these against
     `new URL(origin).hostname` with string equality (or a dot-segment
     wildcard like "*.example.com"), so "http://host:3000" can never match.
     localhost and *.localhost are always allowed and don't need listing. */
  allowedDevOrigins: ["192.168.7.210", "192.168.7.201"],
};

export default nextConfig;
