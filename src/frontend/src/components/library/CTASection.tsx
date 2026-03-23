import type { CTAConfig } from "@/types/library";

interface CTASectionProps {
  cta: CTAConfig;
}

export function CTASection({ cta }: CTASectionProps) {
  return (
    <section className="border-t border-border bg-bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card-glass text-center p-10">
          <div className="mx-auto mb-4">{cta.icon}</div>
          <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
            {cta.title}
          </h2>
          <p className="mt-3 text-text-muted max-w-md mx-auto">
            {cta.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {cta.buttons.map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  btn.variant === "primary" ? "btn-primary" : "btn-secondary"
                }
              >
                {btn.icon}
                {btn.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
