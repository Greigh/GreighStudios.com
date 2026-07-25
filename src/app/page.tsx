import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { WorkCard } from "@/components/WorkCard";
import { ButtonLink } from "@/components/ButtonLink";
import { DissolveField } from "@/components/DissolveField";
import { capabilities } from "@/lib/services";
import { getFeaturedWork } from "@/lib/mdx";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ path: "/" });

export default function HomePage() {
  const featured = getFeaturedWork();

  return (
    <>
      <HomeHero />

      <section className="section-pad">
        <div className="container-page">
          <Reveal>
            <SectionHead
              eyebrow="Selected work"
              title="Products we own, and work we were trusted with"
              link={{ href: "/work", label: "All work" }}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {featured.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.08}>
                <WorkCard item={item} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities as a read-down list rather than a grid of equal boxes —
          four identical cards flatten the hierarchy and say nothing. */}
      <section className="section-pad border-t border-line-soft bg-ink-2/30">
        <div className="container-page">
          <Reveal>
            <SectionHead
              eyebrow="What we do"
              title="One team accountable for the design and the code"
              lede="No handoff between an agency that draws it and a shop that builds it. The people who decide how it should work are the people who ship it."
              link={{ href: "/services", label: "Services in detail" }}
            />
          </Reveal>

          <ul className="mt-12 border-t border-line-soft">
            {capabilities.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <li className="group grid gap-2 border-b border-line-soft py-7 md:grid-cols-[minmax(0,20rem)_1fr] md:items-baseline md:gap-10">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 bg-cyan opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden
                    />
                    <h3 className="display display-sm text-paper">{item.title}</h3>
                  </div>
                  <p className="text-paper-dim md:pt-1">{item.body}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1fr] md:items-center md:gap-16">
          <Reveal>
            <SectionHead
              eyebrow="The studio"
              title="Small on purpose"
              lede="Greigh Studios ships its own products and takes on client work with the same standard of craft. Staying small is what keeps design and engineering in the same conversation."
            />
            <div className="mt-8">
              <ButtonLink href="/about" variant="ghost">
                About the studio{" "}
                <span className="arrow" aria-hidden>
                  →
                </span>
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="surface relative overflow-hidden rounded-sm p-8">
              <div className="cell-texture absolute inset-0 opacity-30" aria-hidden />
              <div className="relative">
                <p className="eyebrow">In the studio now</p>
                <ul className="mt-6 divide-y divide-line-soft border-y border-line-soft">
                  {featured.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/work/${item.slug}`}
                        className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4"
                      >
                        <span className="mono w-10 shrink-0 text-paper-faint">{item.year}</span>
                        <span className="flex-1 text-paper transition-colors group-hover:text-cyan-hi">
                          {item.title}
                        </span>
                        <span className="mono flex shrink-0 items-center gap-2 text-paper-faint">
                          <span
                            className={`h-1.5 w-1.5 ${item.status === "live" ? "bg-cyan" : "bg-paper-faint"}`}
                            aria-hidden
                          />
                          {item.status === "live" ? "Live" : "In progress"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-relaxed text-paper-dim">
                  More products and case studies land here as they ship.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-line-soft">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <DissolveField focus={{ x: 0.5, y: 0.5 }} intensity={0.4} />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_70%_at_50%_50%,var(--glow),transparent_70%)]"
          aria-hidden
        />
        <div className="container-page relative py-24 text-center md:py-32">
          <Reveal>
            <h2 className="display display-lg mx-auto max-w-3xl">Have something to build?</h2>
            <p className="lede mx-auto mt-5 text-center">
              Tell us what you’re shipping and where it’s stuck. You’ll get a straight answer on fit
              and a clear next step.
            </p>
            <div className="mt-10 flex justify-center">
              <ButtonLink href="/contact">Start a project</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
