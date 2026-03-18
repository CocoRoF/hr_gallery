import Link from "next/link";
import {
  Search,
  BarChart3,
  FileText,
  Globe2,
  ArrowRight,
  ExternalLink,
  Github,
  Package,
  Sparkles,
  Layers,
  Cpu,
  Eye,
  Code2,
  Zap,
  Shield,
  BookOpen,
} from "lucide-react";

const LIBRARIES = [
  {
    name: "googer",
    version: "0.4.1",
    tagline: "Type-safe Google Search",
    description:
      "강력하고 타입 안전한 Google 검색 라이브러리. 텍스트, 이미지, 뉴스, 비디오 검색을 하나의 인터페이스로 제공합니다.",
    icon: <Search size={28} />,
    color: "googer",
    badge: "badge-googer",
    license: "Apache-2.0",
    language: "Python",
    github: "https://github.com/CocoRoF/googer",
    pypi: "https://pypi.org/project/googer/",
    demoPath: "/googer",
    hasDemo: true,
    features: ["웹 검색", "이미지 검색", "뉴스 검색", "비디오 검색", "쿼리 빌더"],
    code: `from googer import Googer

results = Googer().search("python")
for r in results:
    print(r.title, r.href)`,
  },
  {
    name: "f2a",
    version: "1.1.1",
    tagline: "File to Analysis",
    description:
      "어떤 데이터 소스에서든 자동으로 기술 통계 분석과 시각화를 수행합니다. 23가지 분석 모듈과 6개국어 HTML 리포트를 지원합니다.",
    icon: <BarChart3 size={28} />,
    color: "f2a",
    badge: "badge-f2a",
    license: "MIT",
    language: "Python",
    github: "https://github.com/CocoRoF/f2a",
    pypi: "https://pypi.org/project/f2a/",
    demoPath: "/f2a",
    hasDemo: true,
    features: ["23가지 분석", "HTML 리포트", "6개국어", "24+ 파일 포맷", "HuggingFace 지원"],
    code: `import f2a

report = f2a.analyze("data.csv")
report.to_html("./output")`,
  },
  {
    name: "Contextifier",
    version: "0.2.2",
    tagline: "Document → AI Context",
    description:
      "다양한 문서 포맷을 AI가 이해할 수 있는 구조화된 텍스트로 변환합니다. OCR 5개 엔진, 스마트 청킹, 테이블 처리를 지원합니다.",
    icon: <FileText size={28} />,
    color: "contextifier",
    badge: "badge-contextifier",
    license: "Apache-2.0",
    language: "Python",
    github: "https://github.com/CocoRoF/Contextifier",
    pypi: "https://pypi.org/project/contextifier/",
    demoPath: "/contextifier",
    hasDemo: false,
    features: ["80+ 포맷 지원", "OCR 5개 엔진", "스마트 청킹", "테이블 처리", "LangChain 통합"],
    code: `from contextifier import DocumentProcessor

processor = DocumentProcessor()
result = processor.process("document.pdf")
print(result.text)`,
  },
  {
    name: "playwLeft",
    version: "0.1.0",
    tagline: "Rust Browser Automation",
    description:
      "Rust로 구축된 에이전트 중심의 브라우저 자동화 툴킷. CDP 프로토콜 기반, Python 바인딩을 통한 비동기 네이티브 지원.",
    icon: <Globe2 size={28} />,
    color: "playleft",
    badge: "badge-playleft",
    license: "Apache-2.0",
    language: "Rust + Python",
    github: "https://github.com/CocoRoF/playwLeft",
    pypi: null,
    demoPath: "/playleft",
    hasDemo: false,
    features: ["Rust 코어", "CDP 프로토콜", "에이전트 퍼스트", "비동기 네이티브", "Python 바인딩"],
    code: `import playleft

async with playleft.Browser() as browser:
    page = await browser.new_page()
    await page.goto("https://example.com")`,
  },
];

const STATS = [
  { label: "라이브러리", value: "4", icon: <Package size={20} /> },
  { label: "분석 모듈", value: "23+", icon: <Layers size={20} /> },
  { label: "지원 포맷", value: "80+", icon: <FileText size={20} /> },
  { label: "오픈소스", value: "100%", icon: <Github size={20} /> },
];

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/[0.07] rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-f2a/[0.07] rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-googer/[0.04] rounded-full blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
          <div className="text-center animate-fade-in">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/[0.08] px-4 py-1.5 mb-8">
              <Sparkles size={14} className="text-accent-light" />
              <span className="text-xs font-medium text-surface-600">CocoRoF Open Source Library Collection</span>
            </div>

            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-8xl">
              <span className="bg-gradient-to-r from-accent via-f2a via-40% to-googer bg-300% bg-clip-text text-transparent animate-gradient-x">
                HR Gallery
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg text-surface-500 sm:text-xl leading-relaxed">
              <span className="text-gray-300 font-medium">4개의 오픈소스 라이브러리</span>를 한 곳에서.
              <br className="hidden sm:block" />
              인터랙티브 데모, 코드 예제, 실시간 분석을 제공하는 갤러리입니다.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/googer" className="btn-googer text-base px-6 py-3">
                <Search size={18} />
                googer 데모
              </Link>
              <Link href="/f2a" className="btn-f2a text-base px-6 py-3">
                <BarChart3 size={18} />
                f2a 데모
              </Link>
              <a
                href="https://hrletsgo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-base px-6 py-3"
              >
                hrletsgo.me
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="relative border-y border-white/[0.06] bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent-light">
                  {stat.icon}
                </div>
                <div className="text-2xl font-black text-gray-100">{stat.value}</div>
                <div className="text-xs font-medium text-surface-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Library Cards ─── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">라이브러리 컬렉션</h2>
          <p className="section-subtitle mx-auto">
            각 라이브러리의 특징을 살펴보고, 인터랙티브 데모를 체험하세요.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {LIBRARIES.map((lib) => (
            <LibraryCard key={lib.name} lib={lib} />
          ))}
        </div>
      </section>

      {/* ─── Why HR Gallery ─── */}
      <section className="border-t border-white/[0.06] bg-surface-50/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">왜 HR Gallery인가?</h2>
            <p className="section-subtitle mx-auto">
              설치 없이 브라우저에서 바로 라이브러리를 체험할 수 있습니다.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <WhyCard
              icon={<Eye size={22} />}
              title="인터랙티브 데모"
              description="검색 쿼리를 입력하거나 파일을 업로드하여 실시간으로 결과를 확인하세요."
            />
            <WhyCard
              icon={<Cpu size={22} />}
              title="Rust-Powered 성능"
              description="playwLeft는 Rust 코어로, googer는 Python 최적화로 최대 성능을 발휘합니다."
            />
            <WhyCard
              icon={<Code2 size={22} />}
              title="코드 프리뷰"
              description="모든 API 호출에 대한 Python 코드를 실시간으로 생성하여 보여줍니다."
            />
            <WhyCard
              icon={<Zap size={22} />}
              title="원클릭 분석"
              description="f2a로 CSV, JSON, Parquet 등 24+ 포맷 파일을 한 번에 분석합니다."
            />
            <WhyCard
              icon={<Shield size={22} />}
              title="타입 안전"
              description="모든 라이브러리가 완전한 타입 힌트를 제공하여 IDE 지원이 뛰어납니다."
            />
            <WhyCard
              icon={<BookOpen size={22} />}
              title="문서 처리"
              description="Contextifier로 PDF, DOCX, HWP 등 80+ 포맷의 문서를 AI 컨텍스트로 변환합니다."
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="card-glass text-center p-12 sm:p-16">
            <h2 className="text-2xl font-bold text-gray-100 sm:text-3xl">
              지금 바로 시작하세요
            </h2>
            <p className="mt-4 text-surface-500 max-w-xl mx-auto">
              모든 라이브러리는 pip으로 설치할 수 있으며, GitHub에서 소스코드를 확인할 수 있습니다.
            </p>

            <div className="mt-4 code-block max-w-md mx-auto text-left">
              <span className="text-surface-500">$</span>{" "}
              <span className="text-accent-light">pip install</span>{" "}
              <span className="text-googer-light">googer</span>{" "}
              <span className="text-f2a-light">f2a</span>{" "}
              <span className="text-contextifier-light">contextifier</span>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://github.com/CocoRoF"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-3"
              >
                <Github size={18} />
                GitHub 방문하기
              </a>
              <a
                href="https://hrletsgo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-6 py-3"
              >
                메인 사이트
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Library Card ─── */

function LibraryCard({ lib }: { lib: (typeof LIBRARIES)[number] }) {
  const colorMap: Record<string, string> = {
    googer: "from-googer/20 to-googer/5 border-googer/20 text-googer",
    f2a: "from-f2a/20 to-f2a/5 border-f2a/20 text-f2a",
    contextifier: "from-contextifier/20 to-contextifier/5 border-contextifier/20 text-contextifier",
    playleft: "from-playleft/20 to-playleft/5 border-playleft/20 text-playleft",
  };

  const glowMap: Record<string, string> = {
    googer: "group-hover:glow-googer",
    f2a: "group-hover:glow-f2a",
    contextifier: "group-hover:glow-contextifier",
    playleft: "group-hover:glow-playleft",
  };

  const textColorMap: Record<string, string> = {
    googer: "text-googer-light",
    f2a: "text-f2a-light",
    contextifier: "text-contextifier-light",
    playleft: "text-playleft-light",
  };

  return (
    <div className={`card-hover group ${glowMap[lib.color]}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colorMap[lib.color]} border transition-transform duration-300 group-hover:scale-110`}
          >
            {lib.icon}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-gray-100">{lib.name}</h2>
              <span className={lib.badge}>v{lib.version}</span>
              <span className="badge-python">{lib.language}</span>
            </div>
            <p className="mt-0.5 text-sm font-medium text-surface-500">{lib.tagline}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-gray-400 leading-relaxed">{lib.description}</p>

      {/* Features */}
      <div className="mt-5 flex flex-wrap gap-2">
        {lib.features.map((f) => (
          <span key={f} className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-xs text-surface-600">
            {f}
          </span>
        ))}
      </div>

      {/* Code Preview */}
      <div className="mt-5 code-block text-gray-500 text-xs leading-relaxed">
        <pre>{lib.code}</pre>
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href={lib.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-gray-300 transition-colors"
          >
            <Github size={14} />
            GitHub
          </a>
          {lib.pypi && (
            <a
              href={lib.pypi}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-gray-300 transition-colors"
            >
              <Package size={14} />
              PyPI
            </a>
          )}
        </div>
        <Link
          href={lib.demoPath}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold ${textColorMap[lib.color]} transition-all hover:gap-2.5`}
        >
          {lib.hasDemo ? "데모 시작하기" : "자세히 보기"} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

/* ─── Why Card ─── */

function WhyCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-glass group hover:bg-white/[0.05] transition-all duration-300">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent-light mb-4 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-base font-bold text-gray-100">{title}</h3>
      <p className="mt-2 text-sm text-surface-500 leading-relaxed">{description}</p>
    </div>
  );
}
