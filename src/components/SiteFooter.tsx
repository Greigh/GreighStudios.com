import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { navLinks, site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-line-soft bg-ink-2/40">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_50%_100%_at_50%_100%,var(--glow),transparent_70%)] opacity-60"
        aria-hidden
      />

      <div className="container-page relative py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark size={44} className="h-9 w-9" />
              <span className="display text-sm leading-none tracking-[0.14em] text-paper uppercase">
                {site.name}
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper-dim">
              A development and design studio building its own products and partnering on client
              work — one team from first concept to production.
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-2 text-sm text-cyan-hi transition-colors hover:text-paper"
            >
              Start a project{" "}
              <span className="arrow" aria-hidden>
                →
              </span>
            </Link>
          </div>

          <div>
            <p className="eyebrow">Navigate</p>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-quiet">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Studio</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="link-quiet">
                  {site.email}
                </a>
              </li>
              <li>
                <Link href="/privacy" className="link-quiet">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="link-quiet">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="rule-dissolve mt-14" />

        <div className="mt-6 flex flex-col gap-2 text-xs text-paper-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="mono">
            © {year} {site.legalName}
          </p>
          <p className="mono">{site.domain}</p>
        </div>
      </div>
    </footer>
  );
}
