import { ExternalLink } from "lucide-react";

const LIBRARIES = [
  { name: "googer", version: "0.4.1", badge: "badge-googer", github: "https://github.com/CocoRoF/googer" },
  { name: "f2a", version: "1.1.1", badge: "badge-f2a", github: "https://github.com/CocoRoF/f2a" },
  { name: "Contextifier", version: "0.2.2", badge: "badge-contextifier", github: "https://github.com/CocoRoF/Contextifier" },
  { name: "playwLeft", version: "0.1.0", badge: "badge-playleft", github: "https://github.com/CocoRoF/playwLeft" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-50/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-f2a">
                <span className="text-sm font-black text-white">H</span>
              </div>
              <span className="text-lg font-bold text-gray-100">HR Gallery</span>
            </div>
            <p className="mt-3 text-sm text-surface-500 leading-relaxed">
              CocoRoF 오픈소스 라이브러리 갤러리.
              <br />
              인터랙티브 데모와 문서를 제공합니다.
            </p>
            <a
              href="https://hrletsgo.me"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-light hover:text-accent transition-colors"
            >
              hrletsgo.me <ExternalLink size={12} />
            </a>
          </div>

          {/* Libraries */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Libraries</h3>
            <div className="flex flex-wrap gap-2">
              {LIBRARIES.map((lib) => (
                <a
                  key={lib.name}
                  href={lib.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${lib.badge} hover:opacity-80 transition-opacity cursor-pointer`}
                >
                  {lib.name} v{lib.version}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Links</h3>
            <div className="space-y-2">
              <a
                href="https://github.com/CocoRoF"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-gray-300 transition-colors"
              >
                GitHub <ExternalLink size={11} />
              </a>
              <a
                href="https://pypi.org/user/CocoRoF/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-gray-300 transition-colors"
              >
                PyPI <ExternalLink size={11} />
              </a>
              <a
                href="https://hrletsgo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-gray-300 transition-colors"
              >
                Main Site <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-surface-500">
            © 2026 CocoRoF — HR Gallery
          </p>
          <p className="text-xs text-surface-500">
            Built with Next.js · FastAPI · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
