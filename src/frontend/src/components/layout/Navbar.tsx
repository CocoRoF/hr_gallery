"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Gallery" },
  { href: "/googer", label: "googer", color: "text-googer-light" },
  { href: "/f2a", label: "f2a", color: "text-f2a-light" },
  { href: "/contextifier", label: "Contextifier", color: "text-contextifier-light" },
  { href: "/playleft", label: "playwLeft", color: "text-playleft-light" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-surface/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-f2a shadow-lg shadow-accent/20 transition-transform group-hover:scale-105">
            <span className="text-lg font-black text-white">H</span>
          </div>
          <span className="text-lg font-bold text-gray-100 tracking-tight">
            HR Gallery
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/[0.06] ${
                item.color ? `text-gray-400 hover:${item.color}` : "text-gray-400 hover:text-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2 h-5 w-px bg-surface-300/50" />
          <a
            href="https://hrletsgo.me"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-1.5 rounded-xl bg-accent/10 px-3.5 py-2 text-sm font-semibold text-accent-light transition-all duration-200 hover:bg-accent/20 border border-accent/20"
          >
            hrletsgo.me
            <ExternalLink size={13} />
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="lg:hidden rounded-xl p-2 text-gray-400 hover:bg-white/[0.06] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-white/[0.06] bg-surface-50/95 backdrop-blur-2xl px-4 py-4 lg:hidden space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/[0.06] hover:text-gray-100 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/[0.06]">
            <a
              href="https://hrletsgo.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-accent-light hover:bg-accent/10 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              hrletsgo.me
              <ExternalLink size={13} />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
