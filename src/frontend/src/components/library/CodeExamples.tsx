import { CheckCircle2 } from "lucide-react";
import type { CodeExample } from "@/types/library";

interface CodeExamplesProps {
  title: string;
  subtitle: string;
  examples: CodeExample[];
  /** Library color key for accent */
  color: "googer" | "f2a" | "contextifier" | "playleft" | "anweb";
}

const iconColor: Record<string, string> = {
  googer: "text-googer-light",
  f2a: "text-f2a-light",
  contextifier: "text-contextifier-light",
  playleft: "text-playleft-light",
  anweb: "text-anweb-light",
};

export function CodeExamples({
  title,
  subtitle,
  examples,
  color,
}: CodeExamplesProps) {
  return (
    <section className="border-t border-border bg-bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="section-title text-center">{title}</h2>
        <p className="section-subtitle text-center mx-auto">{subtitle}</p>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {examples.map((ex) => (
            <div key={ex.title} className="flex flex-col">
              <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <CheckCircle2 size={14} className={iconColor[color]} />
                {ex.title}
              </h3>
              <div className="code-block flex-1 text-xs leading-relaxed text-text-secondary">
                <pre className="whitespace-pre-wrap">{ex.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
