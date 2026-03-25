import Link from "next/link";
import { ArrowLeft, Github, Package, Play, Lock } from "lucide-react";
import type { LibraryMeta, InstallLine } from "@/types/library";
import VersionBadge from "@/components/VersionBadge";

interface IntroHeroProps {
  meta: LibraryMeta;
  installLines: InstallLine[];
}

export function IntroHero({ meta, installLines }: IntroHeroProps) {
  const colorMap: Record<string, string> = {
    googer: "bg-googer/[0.08]",
    f2a: "bg-f2a/[0.08]",
    contextifier: "bg-contextifier/[0.08]",
    playleft: "bg-playleft/[0.08]",
    anweb: "bg-anweb/[0.08]",
  };
  const colorMapAlt: Record<string, string> = {
    googer: "bg-googer/[0.05]",
    f2a: "bg-f2a/[0.05]",
    contextifier: "bg-contextifier/[0.05]",
    playleft: "bg-playleft/[0.05]",
    anweb: "bg-anweb/[0.05]",
  };
  const iconBg: Record<string, string> = {
    googer: "from-googer/20 to-googer/5 border-googer/20 text-googer",
    f2a: "from-f2a/20 to-f2a/5 border-f2a/20 text-f2a",
    contextifier:
      "from-contextifier/20 to-contextifier/5 border-contextifier/20 text-contextifier",
    playleft:
      "from-playleft/20 to-playleft/5 border-playleft/20 text-playleft",
    anweb:
      "from-anweb/20 to-anweb/5 border-anweb/20 text-anweb",
  };
  const badgeClass: Record<string, string> = {
    googer: "badge-googer",
    f2a: "badge-f2a",
    contextifier: "badge-contextifier",
    playleft: "badge-playleft",
    anweb: "badge-anweb",
  };
  const btnClass: Record<string, string> = {
    googer: "btn-googer",
    f2a: "btn-f2a",
    contextifier: "btn-contextifier",
    playleft: "btn-playleft",
    anweb: "btn-anweb",
  };
  const installHighlight: Record<string, string> = {
    googer: "text-googer-light",
    f2a: "text-f2a-light",
    contextifier: "text-contextifier-light",
    playleft: "text-playleft-light",
    anweb: "text-anweb-light",
  };

  const statusBadgeMap: Record<string, string> = {
    Alpha: "bg-red-500/10 text-red-400 border border-red-500/20",
    Beta: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    Stable: "bg-green-500/10 text-green-400 border border-green-500/20",
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div
          className={`absolute top-0 right-1/4 w-96 h-96 ${colorMap[meta.color]} rounded-full blur-[120px]`}
        />
        <div
          className={`absolute bottom-0 left-1/3 w-72 h-72 ${colorMapAlt[meta.color]} rounded-full blur-[100px]`}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Gallery로 돌아가기
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Left: Identity */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${iconBg[meta.color]} border`}
              >
                {meta.icon}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-text-primary sm:text-4xl">
                    {meta.name}
                  </h1>
                  <VersionBadge
                    name={meta.name}
                    fallback={meta.version}
                    className={badgeClass[meta.color]}
                  />
                </div>
                <p className="text-sm text-text-muted mt-1">{meta.tagline}</p>
              </div>
            </div>

            <p className="text-lg text-text-secondary leading-relaxed">
              {meta.description}
            </p>

            {/* Language & license badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {meta.languages.map((lang) => (
                <span key={lang.label} className={lang.className}>
                  {lang.label}
                </span>
              ))}
              <span className="badge bg-green-500/10 text-green-400 border border-green-500/20">
                {meta.license}
              </span>
              {meta.status && (
                <span
                  className={`badge ${statusBadgeMap[meta.status] || ""}`}
                >
                  {meta.status}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={meta.github}
                target="_blank"
                rel="noopener noreferrer"
                className={btnClass[meta.color]}
              >
                <Github size={16} />
                GitHub
              </a>
              {meta.pypi && (
                <a
                  href={meta.pypi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <Package size={16} />
                  PyPI
                </a>
              )}
              {meta.hasDemo ? (
                <Link
                  href={`/${meta.id}/demo`}
                  className="btn-primary"
                >
                  <Play size={16} />
                  Demo
                </Link>
              ) : (
                <button
                  disabled
                  className="btn-secondary opacity-50 cursor-not-allowed"
                  title="데모 준비 중입니다"
                >
                  <Lock size={16} />
                  Demo 준비중
                </button>
              )}
            </div>
          </div>

          {/* Right: Install block */}
          <div className="lg:w-96">
            <div className="code-block">
              {installLines.map((line, i) => (
                <div key={i} className={i > 0 ? "mt-3" : ""}>
                  {line.comment && (
                    <div className="text-text-muted text-xs mb-2">
                      {line.comment}
                    </div>
                  )}
                  <div className="text-text-primary">
                    {line.prefix && (
                      <span className="text-text-muted">{line.prefix}</span>
                    )}{" "}
                    <span className="text-accent-light">{line.command}</span>{" "}
                    {line.args && (
                      <span className={installHighlight[meta.color]}>
                        {line.args}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
