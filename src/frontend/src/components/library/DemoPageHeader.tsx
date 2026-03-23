import Link from "next/link";
import { Github, Package } from "lucide-react";
import VersionBadge from "@/components/VersionBadge";
import type { LibraryMeta } from "@/types/library";

interface DemoPageHeaderProps {
  meta: LibraryMeta;
  title: string;
  description: string;
  /** Override icon (defaults to meta.icon) */
  icon?: React.ReactNode;
}

const iconBg: Record<string, string> = {
  googer: "bg-googer/15 text-googer",
  f2a: "bg-f2a/15 text-f2a",
  contextifier: "bg-contextifier/15 text-contextifier",
  playleft: "bg-playleft/15 text-playleft",
};
const badgeClass: Record<string, string> = {
  googer: "badge-googer",
  f2a: "badge-f2a",
  contextifier: "badge-contextifier",
  playleft: "badge-playleft",
};
const linkHover: Record<string, string> = {
  googer: "hover:border-googer/50 hover:text-googer-light",
  f2a: "hover:border-f2a/50 hover:text-f2a-light",
  contextifier: "hover:border-contextifier/50 hover:text-contextifier-light",
  playleft: "hover:border-playleft/50 hover:text-playleft-light",
};

export function DemoPageHeader({
  meta,
  title,
  description,
  icon,
}: DemoPageHeaderProps) {
  return (
    <>
      {/* Back Link to intro page */}
      <Link
        href={`/${meta.id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        ← {meta.name} 소개 페이지로
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg[meta.color]}`}
        >
          {icon || meta.icon}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={meta.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary ${linkHover[meta.color]} transition-colors`}
          >
            <Github size={14} /> GitHub
          </a>
          {meta.pypi && (
            <a
              href={meta.pypi}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary ${linkHover[meta.color]} transition-colors`}
            >
              <Package size={14} /> PyPI
            </a>
          )}
          <VersionBadge
            name={meta.name}
            fallback={meta.version}
            className={badgeClass[meta.color]}
          />
        </div>
      </div>
    </>
  );
}
