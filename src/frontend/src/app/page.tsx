import Link from "next/link";
import {
  Search,
  BarChart3,
  FileText,
  Globe2,
  Globe,
  ArrowRight,
  ExternalLink,
  Github,
  Package,
  Layers,
  Cpu,
  Eye,
  Code2,
  Zap,
  Shield,
  BookOpen,
} from "lucide-react";
import VersionBadge from "@/components/VersionBadge";

const LIBRARIES = [
  {
    name: "googer",
    version: "0.7.0",
    tagline: "Multi-Engine Web Search",
    description:
      "7개 검색 엔진을 지원하는 타입 안전한 웹 검색 라이브러리. 멀티 엔진 동시 검색, 자동 랭킹, 캐싱을 제공합니다.",
    icon: <Search size={24} />,
    color: "googer",
    badge: "badge-googer",
    language: "Python",
    github: "https://github.com/CocoRoF/googer",
    pypi: "https://pypi.org/project/googer/",
    demoPath: "/googer",
    hasDemo: true,
    features: ["7개 엔진", "멀티 엔진", "이미지/뉴스/비디오", "캐싱", "쿼리 빌더"],
    code: `from googer import Googer

with Googer(engine="multi") as g:
    results = g.search("python")
    for r in results:
        print(r.title, r.provider)`,
  },
  {
    name: "f2a",
    version: "1.1.1",
    tagline: "File to Analysis",
    description:
      "어떤 데이터 소스에서든 자동으로 기술 통계 분석과 시각화를 수행합니다. 23가지 분석 모듈과 6개국어 HTML 리포트를 지원합니다.",
    icon: <BarChart3 size={24} />,
    color: "f2a",
    badge: "badge-f2a",
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
    icon: <FileText size={24} />,
    color: "contextifier",
    badge: "badge-contextifier",
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
    icon: <Globe2 size={24} />,
    color: "playleft",
    badge: "badge-playleft",
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
  {
    name: "an-web",
    version: "0.1.1",
    tagline: "AI-Native Web Browser Engine",
    description:
      "AI 에이전트를 위한 시맨틱 우선 헤드리스 브라우저 엔진. 픽셀 렌더링 없이 웹 페이지를 구조화된 데이터로 변환합니다.",
    icon: <Globe size={24} />,
    color: "anweb",
    badge: "badge-anweb",
    language: "Python",
    github: "https://github.com/CocoRoF/an-web",
    pypi: "https://pypi.org/project/an-web/",
    demoPath: "/an-web",
    hasDemo: true,
    features: ["시맨틱 추출", "11개 AI 도구", "정책 엔진", "쿠키/스토리지", "리플레이 엔진"],
    code: `from an_web import ANWebEngine

async with ANWebEngine() as engine:
    session = await engine.create_session()
    await session.navigate("https://example.com")
    snap = await session.snapshot()
    print(snap.title, snap.page_type)`,
  },
];

const STATS = [
  { label: "라이브러리", value: "5", icon: <Package size={18} /> },
  { label: "분석 모듈", value: "23+", icon: <Layers size={18} /> },
  { label: "지원 포맷", value: "80+", icon: <FileText size={18} /> },
  { label: "오픈소스", value: "100%", icon: <Github size={18} /> },
];

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-accent/[0.06] rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-accent-violet/[0.04] rounded-full blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-20 lg:pt-36 lg:pb-28">
          <div className="text-center animate-fade-in">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-text-secondary">CocoRoF Open Source Library Collection</span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-text-primary">Library </span>
              <span className="bg-gradient-to-r from-accent to-accent-cyan bg-clip-text text-transparent">
                Gallery
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary leading-relaxed">
              A versatile collection of open-source libraries for search, analysis,
              document processing, and browser automation.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/googer" className="btn-primary px-6 py-3">
                <Search size={16} />
                Explore Libraries
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://github.com/CocoRoF"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-6 py-3"
              >
                <Github size={16} />
                GitHub
              </a>
            </div>

            {/* Scroll indicator */}
            <p className="mt-16 text-xs font-medium tracking-[0.2em] text-text-muted uppercase">
              Scroll
            </p>
          </div>
        </div>

        {/* Gradient separator */}
        <div className="gradient-separator" />
      </section>

      {/* ─── Stats ─── */}
      <section className="bg-bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent-light">
                  {stat.icon}
                </div>
                <div className="text-2xl font-extrabold text-text-primary">{stat.value}</div>
                <div className="text-xs font-medium text-text-muted uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="gradient-separator" />
      </section>

      {/* ─── Library Cards ─── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="section-title">라이브러리 컬렉션</h2>
          <p className="section-subtitle mx-auto">
            각 라이브러리의 특징을 살펴보고, 인터랙티브 데모를 체험하세요.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {LIBRARIES.map((lib) => (
            <LibraryCard key={lib.name} lib={lib} />
          ))}
        </div>
      </section>

      <div className="gradient-separator" />

      {/* ─── Why Section ─── */}
      <section className="bg-bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="section-title">왜 HR Gallery인가?</h2>
            <p className="section-subtitle mx-auto">
              설치 없이 브라우저에서 바로 라이브러리를 체험할 수 있습니다.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <WhyCard icon={<Eye size={20} />} title="인터랙티브 데모" description="검색 쿼리를 입력하거나 파일을 업로드하여 실시간으로 결과를 확인하세요." />
            <WhyCard icon={<Cpu size={20} />} title="Rust-Powered 성능" description="playwLeft는 Rust 코어로, googer는 Python 최적화로 최대 성능을 발휘합니다." />
            <WhyCard icon={<Code2 size={20} />} title="코드 프리뷰" description="모든 API 호출에 대한 Python 코드를 실시간으로 생성하여 보여줍니다." />
            <WhyCard icon={<Zap size={20} />} title="원클릭 분석" description="f2a로 CSV, JSON, Parquet 등 24+ 포맷 파일을 한 번에 분석합니다." />
            <WhyCard icon={<Shield size={20} />} title="타입 안전" description="모든 라이브러리가 완전한 타입 힌트를 제공하여 IDE 지원이 뛰어납니다." />
            <WhyCard icon={<BookOpen size={20} />} title="문서 처리" description="Contextifier로 PDF, DOCX, HWP 등 80+ 포맷의 문서를 AI 컨텍스트로 변환합니다." />
          </div>
        </div>
      </section>

      <div className="gradient-separator" />

      {/* ─── CTA ─── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-2xl border border-border bg-bg-card p-12 sm:p-16 text-center">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
            지금 바로 시작하세요
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto">
            모든 라이브러리는 pip으로 설치할 수 있으며, GitHub에서 소스코드를 확인할 수 있습니다.
          </p>

          <div className="mt-6 code-block max-w-md mx-auto text-left">
            <span className="text-text-muted">$</span>{" "}
            <span className="text-accent-light">pip install</span>{" "}
            <span className="text-googer-light">googer</span>{" "}
            <span className="text-f2a-light">f2a</span>{" "}
            <span className="text-contextifier-light">contextifier</span>{" "}
            <span className="text-anweb-light">an-web</span>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com/CocoRoF"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-6 py-3"
            >
              <Github size={16} />
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
      </section>
    </>
  );
}

/* ─── Library Card ─── */

function LibraryCard({ lib }: { lib: (typeof LIBRARIES)[number] }) {
  const iconBgMap: Record<string, string> = {
    googer: "bg-googer/10 text-googer",
    f2a: "bg-f2a/10 text-f2a",
    contextifier: "bg-contextifier/10 text-contextifier",
    playleft: "bg-playleft/10 text-playleft",
    anweb: "bg-anweb/10 text-anweb",
  };

  const linkColorMap: Record<string, string> = {
    googer: "text-googer-light",
    f2a: "text-f2a-light",
    contextifier: "text-contextifier-light",
    playleft: "text-playleft-light",
    anweb: "text-anweb-light",
  };

  return (
    <div className="card-hover group">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBgMap[lib.color]} transition-transform duration-300 group-hover:scale-110`}>
          {lib.icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-text-primary">{lib.name}</h2>
            <VersionBadge name={lib.name} fallback={lib.version} className={lib.badge} />
          </div>
          <p className="mt-0.5 text-sm text-text-muted">{lib.tagline}</p>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-text-secondary leading-relaxed">{lib.description}</p>

      {/* Features */}
      <div className="mt-4 flex flex-wrap gap-2">
        {lib.features.map((f) => (
          <span key={f} className="rounded-md border border-border bg-bg-secondary px-2 py-0.5 text-xs text-text-muted">
            {f}
          </span>
        ))}
      </div>

      {/* Code Preview */}
      <div className="mt-4 code-block text-xs leading-relaxed text-text-muted">
        <pre>{lib.code}</pre>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href={lib.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <Github size={14} />
            GitHub
          </a>
          {lib.pypi && (
            <a
              href={lib.pypi}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              <Package size={14} />
              PyPI
            </a>
          )}
        </div>
        <Link
          href={lib.demoPath}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold ${linkColorMap[lib.color]} transition-all hover:gap-2.5`}
        >
          {lib.hasDemo ? "데모 & 소개" : "자세히 보기"} <ArrowRight size={14} />
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
    <div className="card-hover group">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent-light mb-4 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-base font-bold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
