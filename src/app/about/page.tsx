import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHeader } from "@/components/PageHeader";
import { SectionHead } from "@/components/SectionHead";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const githubUrl = site.sameAs.find((u) => u.includes("github")) ?? "";

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
        lede="A one-person development and design studio. I build my own products and take on client work — and the person you talk to is the person who ships it."
      />

      <section className="section-pad">
        <div className="container-page grid gap-14 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-20">
          <Reveal>
            <div className="md:sticky md:top-28">
              <SectionHead eyebrow="How I work" title="Principles" />
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

      <section className="section-pad border-t border-line-soft">
        <div className="container-page grid gap-12 md:grid-cols-[minmax(0,22rem)_1fr] md:items-start md:gap-20">
          <Reveal>
            <div className="md:sticky md:top-28">
              <SectionHead eyebrow="Who’s behind it" title="Founder" />
              <div className="mt-8 flex items-center gap-4">
                <Image
                  src="/founder-daniel.webp"
                  alt={site.founder}
                  width={80}
                  height={80}
                  className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-line"
                />
                <span>
                  <span className="display block text-lg text-paper">{site.founder}</span>
                  <span className="mono block text-paper-faint">
                    Founder · Developer &amp; Designer
                  </span>
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="max-w-2xl">
              <div className="prose-gs">
                <p className="lede">
                  “I’m {site.founder}. I started Greigh Studios because I’d rather own a product end
                  to end than hand it across a wall — between a team that draws it and a team that
                  builds it.”
                </p>
                <p>
                  Design and engineering live in the same head here. I decide how something should
                  work, then I write the code that ships it — so nothing gets lost in translation
                  and the thing you approve is the thing that goes live. That’s how {site.name}{" "}
                  products like FiHaven and Lgenia got built, and it’s the same bar I hold client
                  work to.
                </p>
                <p>
                  If you’re building something and want one person accountable for both the craft
                  and the code, I’d like to hear about it.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ButtonLink href="/contact">Get in touch</ButtonLink>
                {githubUrl ? (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-sm text-cyan-hi hover:text-paper"
                  >
                    GitHub
                    <span className="sr-only"> (opens in a new tab)</span>{" "}
                    <span className="arrow" aria-hidden>
                      →
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad border-t border-line-soft bg-ink-2/30">
        <div className="container-page grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <SectionHead eyebrow="What I build" title="Apps, websites, and digital products" />
            <p className="lede mt-6">
              From early concept through production. Studio products like FiHaven and Lgenia sit
              alongside client engagements under the {site.legalName} umbrella.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <SectionHead
              eyebrow="Who it’s for"
              title="One accountable person, not a chain of handoffs"
            />
            <p className="lede mt-6">
              Founders and teams who want one person owning both the product surface and the
              implementation — without the translation loss of split agencies.
            </p>
            <div className="mt-8">
              <ButtonLink href="/contact">Work with me</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
