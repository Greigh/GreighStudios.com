import type { Metadata } from "next";
import { site } from "./site";

export function createMetadata({
  title,
  description,
  path = "/",
  image = site.ogImage,
  type = "website",
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
} = {}): Metadata {
  const pageTitle = title ? `${title} · ${site.name}` : `${site.name} — ${site.tagline}`;
  const desc = description ?? site.description;
  const url = `${site.url}${path}`;

  return {
    title: pageTitle,
    description: desc,
    metadataBase: new URL(site.url),
    applicationName: site.name,
    authors: [{ name: site.founder, url: site.url }],
    creator: site.founder,
    publisher: site.legalName,
    keywords: [...site.keywords],
    alternates: { canonical: path },
    openGraph: {
      title: pageTitle,
      description: desc,
      url,
      siteName: site.name,
      locale: "en_US",
      type,
      images: [{ url: image, width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: desc,
      site: site.twitter,
      creator: site.twitter,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
