import type { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  /** Alternate background variant */
  variant?: "default" | "alt";
}

/**
 * A consistent section wrapper with border-top and optional alternating background.
 * Use for custom sections between features/code/cta in intro pages.
 */
export function SectionWrapper({
  children,
  variant = "default",
}: SectionWrapperProps) {
  return (
    <section
      className={`border-t border-border ${
        variant === "alt" ? "bg-bg-secondary/30" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
