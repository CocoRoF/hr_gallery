import type { ReactNode } from "react";

// ─── Library Identity ───

export interface LibraryMeta {
  /** URL slug: googer, f2a, contextifier, playleft */
  id: string;
  /** Display name */
  name: string;
  /** Fallback version (overridden by API) */
  version: string;
  /** One-line tagline */
  tagline: string;
  /** Longer description (1-2 sentences) */
  description: string;
  /** Tailwind color key: googer | f2a | contextifier | playleft | anweb */
  color: "googer" | "f2a" | "contextifier" | "playleft" | "anweb";
  /** Lucide icon element */
  icon: ReactNode;
  /** Programming languages */
  languages: LanguageBadge[];
  /** License string */
  license: string;
  /** GitHub URL */
  github: string;
  /** PyPI URL (null if not published) */
  pypi: string | null;
  /** Documentation URL */
  docsUrl?: string;
  /** Whether interactive demo is available */
  hasDemo: boolean;
  /** Status badge: Alpha, Beta, Stable */
  status?: "Alpha" | "Beta" | "Stable";
}

export interface LanguageBadge {
  label: string;
  /** CSS class for the badge */
  className: string;
}

// ─── Intro Page Building Blocks ───

export interface FeatureItem {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface CodeExample {
  title: string;
  code: string;
}

export interface InstallLine {
  comment?: string;
  prefix?: string;
  command: string;
  args?: string;
}

export interface CTAConfig {
  icon: ReactNode;
  title: string;
  description: string;
  buttons: CTAButton[];
}

export interface CTAButton {
  label: string;
  href: string;
  icon: ReactNode;
  variant: "primary" | "secondary";
}

// ─── Intro Page Configuration ───

export interface IntroPageConfig {
  meta: LibraryMeta;
  features: FeatureItem[];
  codeExamples: CodeExample[];
  installLines: InstallLine[];
  cta: CTAConfig;
}

// ─── Demo Page ───

export interface DemoPageMeta {
  libraryId: string;
  title: string;
  description: string;
}
