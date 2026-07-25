import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { PageHeader } from "@/components/PageHeader";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Contact",
  description: "Start a project with Greigh Studios — product studio or client work.",
  path: "/contact",
});

const expect = [
  { label: "What to include", value: "The problem, the timeline, and what success looks like" },
  { label: "What you’ll get", value: "A straight answer on fit, and a clear next step" },
  { label: "Good fit", value: "Web products, marketing sites, design systems" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Start a project"
        lede="Whether you’re after a studio product partnership or a client engagement, tell us what you’re building."
      />

      <section className="section-pad">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">What to expect</p>
              <dl className="mt-6 border-t border-line-soft">
                {expect.map((item) => (
                  <div key={item.label} className="border-b border-line-soft py-4">
                    <dt className="mono text-paper-faint">{item.label}</dt>
                    <dd className="mt-1.5 text-sm text-paper-dim">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-8 text-sm text-paper-dim">
                Prefer email?{" "}
                <a href={`mailto:${site.email}`} className="text-cyan-hi hover:underline">
                  {site.email}
                </a>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="surface rounded-sm p-6 md:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
