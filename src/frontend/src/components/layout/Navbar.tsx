"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Gallery" },
  { href: "/googer", label: "googer" },
  { href: "/f2a", label: "f2a" },
  { href: "/contextifier", label: "Contextifier" },
  { href: "/playleft", label: "playwLeft" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-secondary border-b border-border">
        <nav className="flex items-center justify-between px-8 py-3">
          {/* Logo — matching blog style */}
          <Link
            href="https://hrletsgo.me"
            className="flex items-center gap-2 text-text-primary font-semibold text-lg tracking-tight transition-colors hover:text-accent-light"
          >
            <Image src="/favicon.png" alt="AI Engineer Jang" width={22} height={22} className="rounded-sm" />
            <span>AI Engineer Jang</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-lg bg-accent/10 border border-accent/20" />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-3xl font-semibold transition-colors ${
                    isActive
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-[52px]" />
    </>
  );
}
