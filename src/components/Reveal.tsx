"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  /**
   * The wrapper element. Defaults to a div, but a Reveal placed directly
   * inside a <ul> has to render the <li> itself — an intervening div breaks
   * the list out of its own semantics and screen readers stop counting items.
   */
  as?: "div" | "li";
};

export function Reveal({ children, className = "", y = 28, delay = 0, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !ref.current) return;

      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>} className={className}>
      {children}
    </Tag>
  );
}
