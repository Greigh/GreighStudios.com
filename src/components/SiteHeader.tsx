"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { navLinks, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* The header starts transparent over the hero and only earns its border and
     backdrop once the page has moved. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line-soft bg-ink/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <BrandMark size={44} className="h-9 w-9 transition-transform duration-500" />
          <span className="display text-sm leading-none tracking-[0.14em] text-paper uppercase">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-sm transition-colors ${
                  active ? "text-paper" : "text-paper-dim hover:text-paper"
                }`}
              >
                {link.label}
                {/* Active state: a small cell centered under the tab — same
                    vocabulary as the rest of the page. */}
                <span
                  className={`absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 bg-cyan transition-all duration-300 ${
                    active ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                  aria-hidden
                />
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="btn btn-ghost px-4! py-2! text-[0.8125rem]"
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            Start a project
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line-soft text-paper transition-colors hover:border-line md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex w-4 flex-col gap-1.25" aria-hidden>
            <span
              className={`h-px w-full bg-current transition-transform duration-300 ${open ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`h-px w-full bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-px w-full bg-current transition-transform duration-300 ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-line-soft md:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col py-3">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 border-b border-line-soft py-4 text-base last:border-0 ${
                    active ? "text-cyan-hi" : "text-paper-dim"
                  }`}
                >
                  <span className={`h-1 w-1 ${active ? "bg-cyan" : "bg-line"}`} aria-hidden />
                  {link.label}
                </Link>
              );
            })}
            <Link href="/contact" className="btn btn-primary mt-4 mb-2">
              Start a project
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
