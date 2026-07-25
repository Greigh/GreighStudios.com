/** Shared between the home page summary and the services page. */
export const capabilities = [
  {
    title: "Product development",
    body: "Web apps and product surfaces on a modern Next.js and TypeScript stack — from first working version through production hardening.",
    detail:
      "Architecture, data flow, auth, and the unglamorous parts that decide whether a product survives its first year of changes.",
  },
  {
    title: "Website design & build",
    body: "Brand-led marketing sites with a disciplined first screen, real content hierarchy, and motion that earns its place.",
    detail:
      "Design and build happen together, so what gets drawn is what gets shipped — no fidelity lost in a handoff.",
  },
  {
    title: "Design systems",
    body: "Tokens, components, and patterns that hold a product together as its surface area grows.",
    detail:
      "Built as code from the start, documented where the team already works, and sized to the product rather than to a style guide.",
  },
  {
    title: "Ongoing partnership",
    body: "Iteration after launch — features, performance, and UX polish from a studio that already knows the codebase.",
    detail:
      "Most of the value in a product shows up after the launch post. Staying on means the next change costs less than the last.",
  },
] as const;
