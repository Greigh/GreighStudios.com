export const site = {
  name: "Greigh Studios",
  legalName: "Greigh Studios LLC",
  domain: "greighstudios.com",
  url: "https://greighstudios.com",
  tagline: "Development | Design",
  description:
    "Greigh Studios builds products and client work — apps, websites, and digital experiences with precision engineering and deliberate design.",
  email: "hello@greighstudios.com",
  twitter: "@greighstudios",
} as const;

export const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
