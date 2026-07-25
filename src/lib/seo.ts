import type { Metadata } from "next";
import { site } from "./site";

export function createMetadata({
  title,
  description,
  path = "/",
  image = "/brand/logo.png",
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
} = {}): Metadata {
  const pageTitle = title ? `${title} · ${site.name}` : `${site.name} — ${site.tagline}`;
  const desc = description ?? site.description;
  const url = `${site.url}${path}`;

  return {
    title: pageTitle,
    description: desc,
    metadataBase: new URL(site.url),
    alternates: { canonical: path },
    openGraph: {
      title: pageTitle,
      description: desc,
      url,
      siteName: site.name,
      type: "website",
      images: [{ url: image, alt: `${site.name} logo` }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: desc,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}
