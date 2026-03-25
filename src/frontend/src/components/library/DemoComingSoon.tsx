import Link from "next/link";
import { Construction, ArrowLeft, Github } from "lucide-react";
import type { LibraryMeta } from "@/types/library";

interface DemoComingSoonProps {
  meta: LibraryMeta;
}

const accentColor: Record<string, string> = {
  googer: "text-googer-light",
  f2a: "text-f2a-light",
  contextifier: "text-contextifier-light",
  playleft: "text-playleft-light",
  anweb: "text-anweb-light",
};

const btnClass: Record<string, string> = {
  googer: "btn-googer",
  f2a: "btn-f2a",
  contextifier: "btn-contextifier",
  playleft: "btn-playleft",
  anweb: "btn-anweb",
};

export function DemoComingSoon({ meta }: DemoComingSoonProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href={`/${meta.id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={14} />
        {meta.name} 소개 페이지로
      </Link>

      <div className="flex flex-col items-center justify-center py-24">
        <div className="card-glass text-center p-12 max-w-lg w-full">
          <Construction
            size={56}
            className={`mx-auto mb-6 ${accentColor[meta.color]}`}
          />
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            데모 준비중
          </h1>
          <p className="mt-4 text-text-secondary max-w-sm mx-auto">
            <span className={`font-semibold ${accentColor[meta.color]}`}>
              {meta.name}
            </span>{" "}
            인터랙티브 데모를 준비하고 있습니다.
            <br />
            곧 만나보실 수 있습니다!
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={`/${meta.id}`} className="btn-secondary">
              <ArrowLeft size={16} />
              소개 페이지
            </Link>
            <a
              href={meta.github}
              target="_blank"
              rel="noopener noreferrer"
              className={btnClass[meta.color]}
            >
              <Github size={16} />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
