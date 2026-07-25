import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/MdxContent";
import { ButtonLink } from "@/components/ButtonLink";
import { DissolveField } from "@/components/DissolveField";
import { WorkCard } from "@/components/WorkCard";
import { Reveal } from "@/components/Reveal";
import { getAllWork, getWorkBySlug } from "@/lib/mdx";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

const statusLabel = {
  live: "Live",
  "in-progress": "In progress",
  archived: "Archived",
} as const;

export function generateStaticParams() {
  return getAllWork().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return {};
  return createMetadata({
    title: work.meta.title,
    description: work.meta.summary,
    path: `/work/${slug}`,
  });
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();

  const { meta } = work;
  const others = getAllWork().filter((item) => item.slug !== slug);

  return (
    <article>
      <header className="relative isolate overflow-hidden border-b border-line-soft">
        <div
          className="pointer-events-none absolute inset-0 mask-[linear-gradient(to_right,transparent_25%,black_80%)]"
          aria-hidden
        >
          <DissolveField focus={{ x: 0.85, y: 0.35 }} intensity={0.45} />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_65%_at_85%_30%,var(--glow),transparent_70%)]"
          aria-hidden
        />

        <div className="container-page relative pt-14 pb-16 md:pt-20 md:pb-20">
          <Link href="/work" className="group mono inline-flex items-center gap-2 text-paper-dim">
            <span className="arrow inline-block rotate-180" aria-hidden>
              →
            </span>{" "}
            All work
          </Link>

          <h1 className="display display-lg mt-8 max-w-3xl">{meta.title}</h1>
          <p className="lede mt-5">{meta.summary}</p>

          {/* Project facts as a data row — the mono voice used consistently. */}
          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-px border-t border-line-soft bg-line-soft sm:grid-cols-4">
            <div className="bg-ink py-5 pr-4 first:pl-0 sm:pl-5">
              <dt className="eyebrow">Type</dt>
              <dd className="mt-2 text-sm text-paper-dim capitalize">{meta.category}</dd>
            </div>
            <div className="bg-ink py-5 pr-4 pl-4 sm:pl-5">
              <dt className="eyebrow">Year</dt>
              <dd className="mt-2 text-sm text-paper-dim">{meta.year}</dd>
            </div>
            <div className="bg-ink py-5 pr-4 pl-4 sm:pl-5">
              <dt className="eyebrow">Status</dt>
              <dd className="mt-2 flex items-center gap-2 text-sm text-paper-dim">
                <span
                  className={`h-1.5 w-1.5 ${meta.status === "live" ? "bg-cyan" : "bg-paper-faint"}`}
                  aria-hidden
                />
                {statusLabel[meta.status]}
              </dd>
            </div>
            <div className="bg-ink py-5 pr-4 pl-4 sm:pl-5">
              <dt className="eyebrow">Stack</dt>
              <dd className="mt-2 text-sm text-paper-dim">{meta.tags.slice(-1)[0] ?? "—"}</dd>
            </div>
          </dl>

          {meta.url ? (
            <div className="mt-8">
              <ButtonLink href={meta.url} variant="ghost">
                Visit live site{" "}
                <span className="arrow" aria-hidden>
                  →
                </span>
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </header>

      {meta.image ? (
        <div className="container-page relative -mt-2">
          <div className="relative overflow-hidden rounded-md border border-line-soft bg-ink-2">
            <div
              className="pointer-events-none absolute -inset-x-10 -top-24 h-40 bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,var(--glow),transparent_70%)]"
              aria-hidden
            />
            <Image
              src={meta.image}
              alt={`${meta.title} — screenshot`}
              width={1600}
              height={900}
              priority
              sizes="(max-width: 1200px) 100vw, 1160px"
              className="relative block h-auto w-full"
            />
          </div>
        </div>
      ) : null}

      {/* Measure is capped for reading, but the column stays flush with the
          masthead above it rather than re-centring. */}
      <div className="section-pad">
        <div className="container-page">
          <div className="max-w-[68ch]">
            <MdxContent source={work.content} />
          </div>
        </div>
      </div>

      {others.length ? (
        <section className="section-pad border-t border-line-soft bg-ink-2/30">
          <div className="container-page">
            <div className="flex items-center gap-5">
              <h2 className="eyebrow shrink-0">Next project</h2>
              <hr className="rule-dissolve flex-1" />
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {others.map((item, i) => (
                <Reveal key={item.slug} delay={i * 0.06}>
                  <WorkCard item={item} index={i + 1} />
                </Reveal>
              ))}

              {/* Keeps the row whole when only one other project exists, and
                  gives the end of the case study somewhere to go. */}
              {others.length % 2 === 1 ? (
                <Reveal delay={0.12}>
                  <div className="surface flex h-full flex-col justify-between gap-8 rounded-sm p-8">
                    <div>
                      <p className="eyebrow">Working on something?</p>
                      <p className="display display-sm mt-4 text-paper">
                        Tell us what you’re building
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                        Studio products and client work run through the same team. Send the problem,
                        the timeline, and what success looks like.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <ButtonLink href="/contact">Start a project</ButtonLink>
                      <ButtonLink href="/work" variant="ghost">
                        All work{" "}
                        <span className="arrow" aria-hidden>
                          →
                        </span>
                      </ButtonLink>
                    </div>
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
