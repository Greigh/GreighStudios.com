export const site = {
  name: "Greigh Studios",
  legalName: "Greigh Studios LLC",
  domain: "greighstudios.com",
  url: "https://greighstudios.com",
  tagline: "Development | Design",
  description:
    "Greigh Studios builds products and client work — apps, websites, and digital experiences with precision engineering and deliberate design.",
  email: "hello@greighstudios.com",
  founder: "Daniel Hipskind",
  twitter: "@greighstudios",
  ogImage: "/og.png",
  // Profiles that reference this brand, used for schema.org sameAs.
  sameAs: ["https://x.com/greighstudios", "https://github.com/Greigh"],
  keywords: [
    "web development",
    "product design",
    "Next.js development",
    "web design studio",
    "design and development studio",
    "app development",
  ],
} as const;

export const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
