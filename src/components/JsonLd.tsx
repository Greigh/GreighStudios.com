/**
 * Renders a schema.org JSON-LD block. Server-only; the data is trusted (built
 * from our own site config), so dangerouslySetInnerHTML is safe here.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
