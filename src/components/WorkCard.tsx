import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { DissolveField } from "./DissolveField";
import type { WorkMeta } from "@/lib/mdx";

const statusLabel: Record<WorkMeta["status"], string> = {
  live: "Live",
  "in-progress": "In progress",
  archived: "Archived",
};

/* Plates differ by where their dissolve originates rather than by colour —
   variation stays systematic instead of arbitrary. */
const focalPoints = [
  { x: 0.78, y: 0.3 },
  { x: 0.24, y: 0.68 },
  { x: 0.5, y: 0.22 },
];

type Props = {
  item: WorkMeta;
  index?: number;
  /** Set to 2 when the cards sit directly under the page h1 with no section heading. */
  headingLevel?: 2 | 3;
};

export function WorkCard({ item, index = 0, headingLevel = 3 }: Props) {
  const focus = focalPoints[index % focalPoints.length];
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <Link href={`/work/${item.slug}`} className="card group flex flex-col rounded-sm">
      {/* Plate: a real product screenshot when we have one, otherwise the
          dissolve motif so future entries still look intentional. */}
      <div className="relative h-40 overflow-hidden border-b border-line-soft md:h-48">
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt={`${item.title} — screenshot`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {/* Bottom scrim so the mark reads and the plate seats into the card. */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10"
              aria-hidden
            />
          </>
        ) : (
          <>
            <div className="cell-texture absolute inset-0 opacity-25" aria-hidden />
            <div className="absolute inset-0" aria-hidden>
              <DissolveField focus={focus} cell={4} gap={11} intensity={0.42} />
            </div>
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_var(--fx)_var(--fy),var(--glow),transparent_70%)] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
              style={
                {
                  "--fx": `${focus.x * 100}%`,
                  "--fy": `${focus.y * 100}%`,
                } as React.CSSProperties
              }
              aria-hidden
            />
            <span
              className="display pointer-events-none absolute -bottom-4 left-5 text-[6.5rem] leading-none text-paper opacity-[0.075] md:text-[8rem]"
              aria-hidden
            >
              {item.year}
            </span>
          </>
        )}

        <BrandMark
          size={64}
          className="absolute right-4 top-4 h-8 w-8 opacity-70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <span className="eyebrow">{item.category}</span>
          <span className="h-px flex-1 bg-line-soft" aria-hidden />
          <span className="mono flex items-center gap-1.5 text-paper-faint">
            <span
              className={`h-1.5 w-1.5 ${item.status === "live" ? "bg-cyan" : "bg-paper-faint"}`}
              aria-hidden
            />
            {statusLabel[item.status]}
          </span>
        </div>

        <Heading className="display display-sm mt-4 text-paper transition-colors duration-300 group-hover:text-cyan-hi">
          {item.title}
        </Heading>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-paper-dim">{item.summary}</p>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <span className="mono shrink-0 text-cyan-hi opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="arrow" aria-hidden>
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
