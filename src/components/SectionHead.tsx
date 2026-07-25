import Link from "next/link";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  link?: { href: string; label: string };
};

/**
 * Every section opens the same way: a mono label, a dissolving hairline, then
 * the headline. The rule is the section marker — it carries the pixel motif
 * from the mark across the whole page rather than being plain decoration.
 */
export function SectionHead({ eyebrow, title, lede, link }: Props) {
  return (
    <div>
      <div className="flex items-center gap-5">
        <p className="eyebrow shrink-0">{eyebrow}</p>
        <hr className="rule-dissolve flex-1" />
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
        <h2 className="display display-md max-w-2xl">{title}</h2>
        {link ? (
          <Link
            href={link.href}
            className="group shrink-0 text-sm text-cyan-hi transition-colors hover:text-paper"
          >
            {link.label}{" "}
            <span className="arrow" aria-hidden>
              →
            </span>
          </Link>
        ) : null}
      </div>

      {lede ? <p className="lede mt-5">{lede}</p> : null}
    </div>
  );
}
