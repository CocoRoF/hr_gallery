import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6 py-6 flex items-center gap-4">
        {/* Brand — links to main site */}
        <Link
          href="https://hrletsgo.me"
          className="flex items-center gap-1.5 text-text-primary font-semibold text-sm tracking-tight hover:text-accent-light transition-colors shrink-0"
        >
          <Image src="/favicon.png" alt="AI Engineer Jang" width={16} height={16} className="rounded-sm" />
          <span>AI Engineer Jang</span>
        </Link>

        <span className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Haryeom Jang. All rights reserved.
        </span>

        <div className="flex-1" />

        <div className="flex items-center gap-2.5">
          <a
            href="https://github.com/CocoRoF"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="https://huggingface.co/CocoRoF"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label="Hugging Face"
          >
            <svg viewBox="0 0 120 120" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M37.6 62.7a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm44.8 0a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
              <path d="M60 10a50 50 0 1 0 0 100 50 50 0 0 0 0-100Zm0 90a40 40 0 1 1 0-80 40 40 0 0 1 0 80Z" />
              <path d="M38 74s6 12 22 12 22-12 22-12" strokeWidth="4" stroke="currentColor" fill="none" strokeLinecap="round" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/hr-jang-85ba78327/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
