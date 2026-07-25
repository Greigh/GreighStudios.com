import Image from "next/image";

type BrandMarkProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

/** Official Greigh Studios mark (from brand artwork). */
export function BrandMark({ size = 32, className = "", priority = false }: BrandMarkProps) {
  return (
    <Image
      // Cache-bust when the file changes; unoptimized avoids stale /_next/image outputs
      src="/brand/mark.png?v=cropped-1"
      alt="Greigh Studios"
      width={size}
      height={size}
      priority={priority}
      unoptimized
      className={`object-contain ${className}`}
    />
  );
}
