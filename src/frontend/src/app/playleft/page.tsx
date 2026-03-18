import Link from "next/link";
import {
  Globe2,
  Github,
  ExternalLink,
  ArrowLeft,
  BookOpen,
  Cpu,
  Zap,
  Shield,
  Terminal,
  Code2,
  Workflow,
  Bot,
  CheckCircle2,
  Layers,
  Gauge,
  Lock,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Cpu size={20} />,
    title: "Rust 코어",
    description:
      "핵심 로직이 Rust로 구현되어 메모리 안전성과 최대 성능을 보장합니다. 네이티브 속도로 브라우저를 제어합니다.",
  },
  {
    icon: <Bot size={20} />,
    title: "에이전트 퍼스트",
    description:
      "AI 에이전트가 브라우저를 직접 제어할 수 있도록 설계되었습니다. 도구 호출 인터페이스를 기본 제공합니다.",
  },
  {
    icon: <Workflow size={20} />,
    title: "CDP 프로토콜",
    description:
      "Chrome DevTools Protocol을 직접 구현하여, 브라우저와 낮은 레벨에서 직접 통신합니다.",
  },
  {
    icon: <Zap size={20} />,
    title: "비동기 네이티브",
    description:
      "Tokio 기반의 완전한 비동기 아키텍처로, 여러 페이지와 브라우저를 동시에 효율적으로 관리합니다.",
  },
  {
    icon: <Terminal size={20} />,
    title: "Python 바인딩",
    description:
      "PyO3를 통해 Python에서 네이티브처럼 사용할 수 있습니다. 완전한 타입 힌트와 async/await를 지원합니다.",
  },
  {
    icon: <Shield size={20} />,
    title: "메모리 안전",
    description:
      "Rust의 소유권 시스템으로 메모리 누수와 경쟁 조건을 컴파일 타임에 방지합니다.",
  },
];

const ARCHITECTURE = [
  {
    layer: "Python Layer",
    description: "PyO3 바인딩, async/await API, 타입 힌트",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  {
    layer: "Rust Core",
    description: "브라우저 관리, CDP 통신, 이벤트 처리",
    color: "text-playleft-light",
    bgColor: "bg-playleft/10 border-playleft/20",
  },
  {
    layer: "CDP Protocol",
    description: "Chrome DevTools Protocol, WebSocket 통신",
    color: "text-green-400",
    bgColor: "bg-green-500/10 border-green-500/20",
  },
];

const CODE_EXAMPLES = [
  {
    title: "기본 네비게이션",
    code: `import playleft

async with playleft.Browser() as browser:
    page = await browser.new_page()
    await page.goto("https://example.com")

    title = await page.title()
    print(f"Title: {title}")`,
  },
  {
    title: "요소 상호작용",
    code: `async with playleft.Browser() as browser:
    page = await browser.new_page()
    await page.goto("https://example.com")

    # CSS 셀렉터로 요소 선택
    element = await page.query_selector("input#search")
    await element.type("hello world")
    await element.press("Enter")`,
  },
  {
    title: "에이전트 통합",
    code: `from playleft.tools import BrowserToolkit

# AI 에이전트용 도구 세트 생성
toolkit = BrowserToolkit()
tools = toolkit.get_tools()

# LangChain/LangGraph 에이전트에 연결
agent = create_agent(
    tools=tools,
    instructions="웹을 탐색하세요"
)`,
  },
];

export default function PlaywLeftPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-playleft/[0.08] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-playleft/[0.05] rounded-full blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-gray-300 transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Gallery로 돌아가기
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-playleft/20 to-playleft/5 border border-playleft/20 text-playleft">
                  <Globe2 size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-gray-100 sm:text-4xl">
                      playwLeft
                    </h1>
                    <span className="badge-playleft">v0.1.0</span>
                  </div>
                  <p className="text-sm text-surface-500 mt-1">Rust Browser Automation</p>
                </div>
              </div>

              <p className="text-lg text-gray-400 leading-relaxed">
                Rust로 구축된 에이전트 중심의 브라우저 자동화 툴킷.
                <br />
                Playwright의 대안으로, CDP 프로토콜 기반의 네이티브 성능을 제공합니다.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="badge-rust">Rust</span>
                <span className="badge-python">Python ≥ 3.10</span>
                <span className="badge bg-green-500/10 text-green-400 border border-green-500/20">Apache-2.0</span>
                <span className="badge bg-red-500/10 text-red-400 border border-red-500/20">Alpha</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://github.com/CocoRoF/playwLeft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-playleft"
                >
                  <Github size={16} />
                  GitHub
                </a>
                <a
                  href="https://github.com/CocoRoF/playwLeft#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <BookOpen size={16} />
                  문서
                </a>
              </div>
            </div>

            {/* Build from source */}
            <div className="lg:w-96">
              <div className="code-block">
                <div className="text-surface-500 text-xs mb-2"># Build from source (Rust required)</div>
                <div className="text-gray-300 space-y-1">
                  <div>
                    <span className="text-surface-500">$</span>{" "}
                    <span className="text-accent-light">git clone</span>{" "}
                    <span className="text-playleft-light text-xs">https://github.com/CocoRoF/playwLeft</span>
                  </div>
                  <div>
                    <span className="text-surface-500">$</span>{" "}
                    <span className="text-accent-light">cd</span>{" "}
                    playwLeft
                  </div>
                  <div>
                    <span className="text-surface-500">$</span>{" "}
                    <span className="text-accent-light">maturin develop</span>{" "}
                    <span className="text-surface-500">--release</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="border-t border-white/[0.06] bg-surface-50/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">핵심 기능</h2>
          <p className="section-subtitle text-center mx-auto">
            Rust의 성능과 안전성으로 브라우저를 자동화하세요.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card-glass group hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-playleft/10 text-playleft-light mb-4 transition-transform group-hover:scale-110">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-100">{f.title}</h3>
                <p className="mt-2 text-sm text-surface-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Architecture ─── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">아키텍처</h2>
          <p className="section-subtitle text-center mx-auto">
            3계층 구조로 성능과 사용성을 동시에 달성합니다.
          </p>

          <div className="mt-14 max-w-lg mx-auto space-y-4">
            {ARCHITECTURE.map((arch, i) => (
              <div key={arch.layer}>
                <div className={`card border ${arch.bgColor} p-5`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-base font-bold ${arch.color}`}>{arch.layer}</h3>
                      <p className="mt-1 text-sm text-surface-500">{arch.description}</p>
                    </div>
                    <Layers size={20} className={arch.color} />
                  </div>
                </div>
                {i < ARCHITECTURE.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-4 bg-surface-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Code Examples ─── */}
      <section className="border-t border-white/[0.06] bg-surface-50/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">코드 예제</h2>
          <p className="section-subtitle text-center mx-auto">
            직관적인 Python API로 브라우저를 제어하세요.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {CODE_EXAMPLES.map((ex) => (
              <div key={ex.title} className="flex flex-col">
                <h3 className="text-sm font-bold text-gray-200 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-playleft-light" />
                  {ex.title}
                </h3>
                <div className="code-block flex-1 text-xs leading-relaxed text-gray-400">
                  <pre className="whitespace-pre-wrap">{ex.code}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Comparison ─── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">Playwright와의 차이점</h2>

          <div className="mt-14 max-w-2xl mx-auto">
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-3 px-4 text-surface-500 font-semibold">특성</th>
                    <th className="text-center py-3 px-4 text-playleft-light font-semibold">playwLeft</th>
                    <th className="text-center py-3 px-4 text-surface-500 font-semibold">Playwright</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {[
                    ["코어 언어", "Rust", "Node.js"],
                    ["프로토콜", "CDP (직접 구현)", "CDP (래핑)"],
                    ["에이전트 퍼스트", "✓ 기본 제공", "✗ 별도 구현"],
                    ["메모리 안전성", "컴파일 타임 보장", "런타임 GC"],
                    ["Python 바인딩", "PyO3 (네이티브)", "서브프로세스"],
                    ["상태", "Alpha (v0.1.0)", "Stable"],
                  ].map(([feature, pw, pl]) => (
                    <tr key={feature}>
                      <td className="py-3 px-4 text-gray-300 font-medium">{feature}</td>
                      <td className="py-3 px-4 text-center text-playleft-light">{pw}</td>
                      <td className="py-3 px-4 text-center text-surface-500">{pl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-white/[0.06] bg-surface-50/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="card-glass text-center p-10">
            <Gauge size={32} className="mx-auto text-playleft-light mb-4" />
            <h2 className="text-xl font-bold text-gray-100 sm:text-2xl">
              playwLeft에 기여하세요
            </h2>
            <p className="mt-3 text-surface-500 max-w-md mx-auto">
              playwLeft는 현재 Alpha 단계입니다. 피드백과 기여를 환영합니다.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/CocoRoF/playwLeft"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-playleft"
              >
                <Github size={16} />
                GitHub
              </a>
              <a
                href="https://github.com/CocoRoF/playwLeft/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <ExternalLink size={16} />
                Issues
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
