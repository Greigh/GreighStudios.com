import Image from "next/image";

type BrandMarkProps = {
  size?: number;
  className?: string;
  priority?: boolean;
  /**
   * True wherever the mark sits beside the wordmark or inside an already-named
   * link — repeating "Greigh Studios" there just makes the control announce
   * itself twice. Renders alt="" so the image drops out of the tree entirely.
   */
  decorative?: boolean;
  /** Passed through when the rendered size is driven by responsive classes. */
  sizes?: string;
};

/** Official Greigh Studios mark (from brand artwork). */
export function BrandMark({
  size = 32,
  className = "",
  priority = false,
  decorative = false,
  sizes,
}: BrandMarkProps) {
  return (
    <Image
      /* The ?v= query cache-busts when the artwork changes — and because it's
         part of the src it's also part of the image optimizer's cache key, so
         `unoptimized` was never needed to avoid stale /_next/image output.
         Carrying it meant the full 1MB source PNG was served to every use,
         including the 36px header logo. */
      src="/brand/mark.png?v=cropped-1"
      alt={decorative ? "" : "Greigh Studios"}
      width={size}
      height={size}
      priority={priority}
      sizes={sizes}
      className={`object-contain ${className}`}
    />
  );
}
