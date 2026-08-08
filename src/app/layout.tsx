import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

const orgSchema = {
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}/brand/mark.png`,
  image: `${site.url}${site.ogImage}`,
  description: site.description,
  email: site.email,
  founder: { "@type": "Person", name: site.founder },
  sameAs: [...site.sameAs],
  contactPoint: {
    "@type": "ContactPoint",
    email: site.email,
    contactType: "customer support",
  },
};

const siteSchema = {
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: site.url,
  publisher: { "@id": `${site.url}/#organization` },
};

/* Display voice. The `wdth` axis is loaded so headlines can be set slightly
   expanded — it gives the type a built quality that a fixed grotesque can't. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

/* Body + utility are a designed superfamily, so data labels and running text
   share proportions without needing to match by eye. */
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  ...createMetadata(),
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/mark.png", sizes: "2048x2048", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  applicationName: site.name,
};

export const viewport: Viewport = {
  themeColor: "#0b0e12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink font-sans text-paper">
        <JsonLd data={{ "@context": "https://schema.org", "@graph": [orgSchema, siteSchema] }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded focus:bg-cyan focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#06131a]"
        >
          Skip to content
        </a>
        <SiteHeader />
        {/* tabindex="-1" is what makes the skip link actually work: without it
            Safari (and others) move the scroll position but leave focus at the
            top of the document, so the next Tab lands back in the header. */}
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
