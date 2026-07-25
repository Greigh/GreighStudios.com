import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHeader } from "@/components/PageHeader";
import { DissolveField } from "@/components/DissolveField";
import { capabilities } from "@/lib/services";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Services",
  description:
    "Development and design services from Greigh Studios — product engineering, website design and build, design systems, and ongoing partnership.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Development and design under one roof"
        lede="Hire Greigh Studios for end-to-end product work — not a handoff between disconnected teams."
      />

      <section className="section-pad">
        <div className="container-page">
          <div className="border-t border-line-soft">
            {capabilities.map((service, i) => (
              <Reveal key={service.title} delay={i * 0.05}>
                <article className="group grid gap-5 border-b border-line-soft py-10 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-12 md:py-12">
                  <div className="flex items-start gap-4">
                    <span
                      className="mt-3 h-1.5 w-1.5 shrink-0 bg-cyan opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden
                    />
                    <h2 className="display display-sm text-paper">{service.title}</h2>
                  </div>
                  <div>
                    <p className="text-paper-dim">{service.body}</p>
                    <p className="mt-3 text-sm leading-relaxed text-paper-faint">
                      {service.detail}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
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
        <div className="container-page relative py-24 text-center md:py-28">
          <Reveal>
            <h2 className="display display-md mx-auto max-w-2xl">Start a project</h2>
            <p className="lede mx-auto mt-5 text-center">
              Share the problem, the timeline, and what success looks like. You’ll get a reply on
              fit and next steps.
            </p>
            <div className="mt-10 flex justify-center">
              <ButtonLink href="/contact">Contact the studio</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
