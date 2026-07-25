import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHeader } from "@/components/PageHeader";
import { SectionHead } from "@/components/SectionHead";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "About",
  description:
    "Greigh Studios LLC is a product studio and client partner for development and design.",
  path: "/about",
});

const principles = [
  {
    title: "Design and engineering stay in one conversation",
    body: "The person deciding how something should work is the person building it. Nothing gets lost explaining a comp to someone who wasn’t in the room.",
  },
  {
    title: "Real content early",
    body: "Layouts get built against the actual words and data, not placeholder text. It’s the fastest way to find out whether a structure holds.",
  },
  {
    title: "Motion for hierarchy, not decoration",
    body: "Animation earns its place when it tells you what changed or what matters. Everything else is noise that costs load time.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={site.legalName}
        lede="A development and design studio that ships its own products and takes on client work with the same standard of craft."
      />

      <section className="section-pad">
        <div className="container-page grid gap-14 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-20">
          <Reveal>
            <div className="md:sticky md:top-28">
              <SectionHead eyebrow="How we work" title="Principles" />
            </div>
          </Reveal>

          <div>
            {principles.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <article className="border-b border-line-soft py-8 first:pt-0 last:border-0">
                  <h3 className="display display-sm text-paper">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-paper-dim">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-line-soft bg-ink-2/30">
        <div className="container-page grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <SectionHead eyebrow="What we build" title="Apps, websites, and digital products" />
            <p className="lede mt-6">
              From early concept through production. Studio products like FiHaven and Lgenia sit
              alongside client engagements under the {site.legalName} umbrella.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <SectionHead eyebrow="Who it’s for" title="Teams who want one accountable partner" />
            <p className="lede mt-6">
              Founders and teams who want a studio that can own both the product surface and the
              implementation — without the translation loss of split agencies.
            </p>
            <div className="mt-8">
              <ButtonLink href="/contact">Work with us</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
