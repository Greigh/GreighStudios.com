import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { DissolveField } from "@/components/DissolveField";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[70svh] items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <DissolveField focus={{ x: 0.5, y: 0.45 }} intensity={0.45} />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_50%_45%,var(--glow),transparent_70%)]"
        aria-hidden
      />

      <div className="container-page relative py-24 text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="display display-lg mt-6">This page didn’t make it</h1>
        <p className="lede mx-auto mt-5 text-center">
          The route doesn’t exist. Head back to the studio, or take a look at the work.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/work" variant="ghost">
            See the work{" "}
            <span className="arrow" aria-hidden>
              →
            </span>
          </ButtonLink>
        </div>
        <p className="mt-10 text-sm text-paper-dim">
          Think something should be here?{" "}
          <Link href="/contact" className="text-cyan-hi hover:underline">
            Let us know
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
