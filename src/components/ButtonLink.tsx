import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const classNames = `btn ${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`;
  const external = /^https?:\/\//.test(href);

  if (external) {
    return (
      <a href={href} className={classNames} target="_blank" rel="noopener noreferrer">
        {children}
        {/* A new tab with no warning is disorienting for screen reader and
            magnifier users, who get no visual cue that the context changed. */}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classNames}>
      {children}
    </Link>
  );
}
