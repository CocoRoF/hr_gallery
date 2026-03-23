import {
  Github,
  ExternalLink,
  Cpu,
  Zap,
  Shield,
  Terminal,
  Workflow,
  Bot,
  Layers,
  Gauge,
} from "lucide-react";
import { LIBRARY_META } from "@/config/libraries";
import {
  IntroHero,
  FeatureGrid,
  CodeExamples,
  CTASection,
  SectionWrapper,
} from "@/components/library";
import type { FeatureItem, CodeExample, InstallLine, CTAConfig } from "@/types/library";

const meta = LIBRARY_META.playleft;

const FEATURES: FeatureItem[] = [
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

const CODE_EXAMPLES: CodeExample[] = [
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

const INSTALL_LINES: InstallLine[] = [
  { comment: "# Build from source (Rust required)", prefix: "$", command: "git clone", args: "https://github.com/CocoRoF/playwLeft" },
  { prefix: "$", command: "cd", args: "playwLeft" },
  { prefix: "$", command: "maturin develop", args: "--release" },
];

const CTA: CTAConfig = {
  icon: <Gauge size={32} className="text-playleft-light" />,
  title: "playwLeft에 기여하세요",
  description: "playwLeft는 현재 Alpha 단계입니다. 피드백과 기여를 환영합니다.",
  buttons: [
    {
      label: "GitHub",
      href: "https://github.com/CocoRoF/playwLeft",
      icon: <Github size={16} />,
      variant: "primary",
    },
    {
      label: "Issues",
      href: "https://github.com/CocoRoF/playwLeft/issues",
      icon: <ExternalLink size={16} />,
      variant: "secondary",
    },
  ],
};

export default function PlaywLeftPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <IntroHero meta={meta} installLines={INSTALL_LINES} />

      {/* ─── Features ─── */}
      <FeatureGrid
        title="핵심 기능"
        subtitle="Rust의 성능과 안전성으로 브라우저를 자동화하세요."
        features={FEATURES}
        color="playleft"
      />

      {/* ─── Architecture ─── */}
      <SectionWrapper>
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
                    <h3 className={`text-base font-bold ${arch.color}`}>
                      {arch.layer}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted">
                      {arch.description}
                    </p>
                  </div>
                  <Layers size={20} className={arch.color} />
                </div>
              </div>
              {i < ARCHITECTURE.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-px h-4 bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ─── Code Examples ─── */}
      <CodeExamples
        title="코드 예제"
        subtitle="직관적인 Python API로 브라우저를 제어하세요."
        examples={CODE_EXAMPLES}
        color="playleft"
      />

      {/* ─── Comparison ─── */}
      <SectionWrapper>
        <h2 className="section-title text-center">Playwright와의 차이점</h2>

        <div className="mt-14 max-w-2xl mx-auto">
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-muted font-semibold">
                    특성
                  </th>
                  <th className="text-center py-3 px-4 text-playleft-light font-semibold">
                    playwLeft
                  </th>
                  <th className="text-center py-3 px-4 text-text-muted font-semibold">
                    Playwright
                  </th>
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
                    <td className="py-3 px-4 text-text-primary font-medium">
                      {feature}
                    </td>
                    <td className="py-3 px-4 text-center text-playleft-light">
                      {pw}
                    </td>
                    <td className="py-3 px-4 text-center text-text-muted">
                      {pl}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      {/* ─── CTA ─── */}
      <CTASection cta={CTA} />
    </>
  );
}
