"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BrandMark } from "./BrandMark";
import { ButtonLink } from "./ButtonLink";
import { DissolveField } from "./DissolveField";
import { site } from "@/lib/site";

gsap.registerPlugin(useGSAP);

/* Capability facts, not invented metrics. Every one of these is true of the
   work actually in the repo. */
const facts = [
  { label: "Scope", value: "Design through deploy" },
  { label: "Stack", value: "Next.js · TypeScript" },
  { label: "Shipped in", value: "Healthcare · Finance" },
  { label: "Model", value: "Studio products + client work" },
];

export function HomeHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !root.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.6 })
        .from(".hero-line", { opacity: 0, y: 28, duration: 0.9, stagger: 0.08 }, "-=0.35")
        .from(".hero-lede", { opacity: 0, y: 16, duration: 0.7 }, "-=0.55")
        .from(".hero-cta", { opacity: 0, y: 14, duration: 0.6 }, "-=0.45")
        .from(".hero-mark", { opacity: 0, scale: 0.9, duration: 1.4, ease: "power2.out" }, 0.15)
        .from(".hero-fact", { opacity: 0, y: 14, duration: 0.6, stagger: 0.07 }, "-=0.8");
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate overflow-hidden">
      {/* Ambient depth: a cool wash behind the mark, violet only as the far
          shadow side so the cyan reads as a light source. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_72%_38%,var(--glow),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_50%_at_88%_78%,var(--glow-violet),transparent_70%)]"
        aria-hidden
      />
      {/* Masked off the headline side so the type sits on clean ground. */}
      <div
        className="pointer-events-none absolute inset-0 mask-[linear-gradient(to_right,transparent_8%,black_52%)]"
        aria-hidden
      >
        <DissolveField focus={{ x: 0.74, y: 0.38 }} intensity={0.6} />
      </div>

      <div className="container-page relative">
        <div className="grid items-center gap-8 pt-10 pb-16 md:min-h-[78svh] md:grid-cols-[1.15fr_0.85fr] md:gap-8 md:pt-24 md:pb-20">
          <div>
            <p className="hero-eyebrow eyebrow">{site.tagline}</p>

            <h1 className="display display-xl mt-7">
              <span className="hero-line block">We build</span>
              <span className="hero-line block">
                the <span className="accent-word">whole</span> thing.
              </span>
            </h1>

            <p className="hero-lede lede mt-7">
              Design and engineering from one studio — our own products, and client work held to the
              same bar.
            </p>

            <div className="hero-cta mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href="/contact">Start a project</ButtonLink>
              <ButtonLink href="/work" variant="ghost">
                See the work{" "}
                <span className="arrow" aria-hidden>
                  →
                </span>
              </ButtonLink>
            </div>
          </div>

          {/* The mark is the light source of the composition, not a badge. */}
          <div className="hero-mark relative order-first flex justify-center md:order-0 md:justify-end">
            <div className="relative">
              <div
                className="absolute -inset-16 bg-[radial-gradient(circle,var(--glow),transparent_65%)] blur-2xl"
                aria-hidden
              />
              {/* Decorative: this is the composition's light source, and the
                  studio is already named by the header and the h1 beside it.
                  A third "Greigh Studios" announcement mid-hero is noise. */}
              {/* Rendered size is driven by the responsive classes, so `sizes`
                  has to mirror them — otherwise phones download the 420px
                  variant for a 128px slot. */}
              <BrandMark
                size={420}
                className="relative h-32 w-32 sm:h-44 sm:w-44 md:h-76 md:w-76 lg:h-88 lg:w-88"
                sizes="(min-width: 1024px) 352px, (min-width: 768px) 304px, (min-width: 640px) 176px, 128px"
                priority
                decorative
              />
            </div>
          </div>
        </div>

        {/* Capability strip — grounds the claim above it with specifics. */}
        <div className="relative grid grid-cols-2 gap-px border-t border-line-soft bg-line-soft md:grid-cols-4">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="hero-fact bg-ink py-6 pr-4 pl-4 first:pl-0 md:pr-6 md:pl-6"
            >
              <p className="eyebrow">{fact.label}</p>
              <p className="mt-2 text-sm text-paper-dim">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
