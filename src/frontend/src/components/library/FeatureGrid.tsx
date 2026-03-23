import type { FeatureItem } from "@/types/library";

interface FeatureGridProps {
  title: string;
  subtitle: string;
  features: FeatureItem[];
  /** Library color key for icon backgrounds */
  color: "googer" | "f2a" | "contextifier" | "playleft";
}

const iconBg: Record<string, string> = {
  googer: "bg-googer/10 text-googer-light",
  f2a: "bg-f2a/10 text-f2a-light",
  contextifier: "bg-contextifier/10 text-contextifier-light",
  playleft: "bg-playleft/10 text-playleft-light",
};

export function FeatureGrid({
  title,
  subtitle,
  features,
  color,
}: FeatureGridProps) {
  return (
    <section className="border-t border-border bg-bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="section-title text-center">{title}</h2>
        <p className="section-subtitle text-center mx-auto">{subtitle}</p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="card-glass group hover:bg-bg-card-hover transition-all duration-300"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg[color]} mb-4 transition-transform group-hover:scale-110`}
              >
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-text-primary">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
