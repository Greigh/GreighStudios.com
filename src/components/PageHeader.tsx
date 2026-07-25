import { DissolveField } from "./DissolveField";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
};

/** Shared masthead for interior pages, so every route opens the same way. */
export function PageHeader({ eyebrow, title, lede, children }: Props) {
  return (
    <header className="relative isolate overflow-hidden border-b border-line-soft">
      <div
        className="pointer-events-none absolute inset-0 mask-[linear-gradient(to_right,transparent_20%,black_75%)]"
        aria-hidden
      >
        <DissolveField focus={{ x: 0.88, y: 0.3 }} intensity={0.45} />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_65%_at_85%_25%,var(--glow),transparent_70%)]"
        aria-hidden
      />

      <div className="container-page relative pt-20 pb-16 md:pt-28 md:pb-20">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display display-lg mt-6 max-w-4xl">{title}</h1>
          {lede ? <p className="lede mt-6">{lede}</p> : null}
          {children}
        </Reveal>
      </div>
    </header>
  );
}
