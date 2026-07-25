import { WorkCard } from "@/components/WorkCard";
import { Reveal } from "@/components/Reveal";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink } from "@/components/ButtonLink";
import { getAllWork } from "@/lib/mdx";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Work",
  description:
    "Products and case studies from Greigh Studios — FiHaven, Lgenia, and client builds.",
  path: "/work",
});

export default function WorkPage() {
  const work = getAllWork();

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Products & case studies"
        lede="Studio products and client engagements, held to the same bar for design quality and engineering rigor."
      />

      <section className="section-pad">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2">
            {work.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.06}>
                <WorkCard item={item} index={i} headingLevel={2} />
              </Reveal>
            ))}
          </div>

          {/* Honest about the shelf being short, and turns it into an opening. */}
          <Reveal delay={0.1}>
            <div className="surface mt-6 flex flex-col items-start gap-5 rounded-sm p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div>
                <p className="eyebrow">Next</p>
                <p className="display display-sm mt-3 text-paper">More is on the way</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-paper-dim">
                  New studio products and client case studies get published here as they ship.
                </p>
              </div>
              <ButtonLink href="/contact" variant="ghost">
                Start a project{" "}
                <span className="arrow" aria-hidden>
                  →
                </span>
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
