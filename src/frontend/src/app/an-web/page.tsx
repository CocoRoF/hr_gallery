import {
  Globe,
  Github,
  BookOpen,
  Eye,
  Shield,
  Workflow,
  Brain,
  Layers,
  Cookie,
  Cpu,
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

const meta = LIBRARY_META.anweb;

const FEATURES: FeatureItem[] = [
  {
    icon: <Brain size={20} />,
    title: "시맨틱 우선 설계",
    description:
      "픽셀 렌더링 없이 HTML을 파싱하여 페이지 유형, 제목, 입력 필드, 액션 버튼 등을 자동으로 추출합니다.",
  },
  {
    icon: <Workflow size={20} />,
    title: "11개 AI 도구",
    description:
      "navigate, snapshot, click, type, select, extract, scroll, wait_for, eval_js 등 11개 도구를 제공합니다.",
  },
  {
    icon: <Shield size={20} />,
    title: "정책 엔진",
    description:
      "도메인 화이트리스트, 샌드박스 모드, strict 모드 등으로 에이전트의 웹 접근 범위를 안전하게 제한합니다.",
  },
  {
    icon: <Eye size={20} />,
    title: "데이터 추출",
    description:
      "CSS 셀렉터, 텍스트, 테이블, 자동 모드 — 4가지 방식으로 웹 페이지에서 구조화된 데이터를 추출합니다.",
  },
  {
    icon: <Cookie size={20} />,
    title: "쿠키 & 스토리지",
    description:
      "쿠키 관리, localStorage/sessionStorage 상태 저장, 세션 간 컨텍스트 유지를 지원합니다.",
  },
  {
    icon: <Layers size={20} />,
    title: "리플레이 & 추적",
    description:
      "모든 액션을 기록하고 재생할 수 있는 ReplayEngine과 구조화된 로그/아티팩트 수집 기능을 제공합니다.",
  },
];

const TOOLS_LIST = [
  { tool: "navigate", description: "URL로 이동하고 페이지 로드 상태를 확인" },
  { tool: "snapshot", description: "현재 페이지의 시맨틱 스냅샷 생성" },
  { tool: "click", description: "시맨틱 타겟으로 요소 클릭" },
  { tool: "type", description: "입력 필드에 텍스트 입력" },
  { tool: "select", description: "드롭다운에서 옵션 선택" },
  { tool: "extract", description: "4가지 모드로 데이터 추출" },
  { tool: "scroll", description: "페이지 스크롤 (up/down/top/bottom)" },
  { tool: "wait_for", description: "조건 충족까지 대기" },
  { tool: "eval_js", description: "JavaScript 코드 실행" },
  { tool: "clear", description: "입력 필드 내용 삭제" },
  { tool: "submit", description: "폼 제출" },
];

const CODE_EXAMPLES: CodeExample[] = [
  {
    title: "기본 네비게이션 & 스냅샷",
    code: `from an_web import ANWebEngine

async with ANWebEngine() as engine:
    session = await engine.create_session()
    await session.navigate("https://example.com")

    snap = await session.snapshot()
    print(f"Title: {snap.title}")
    print(f"Type: {snap.page_type}")
    print(f"Actions: {snap.primary_actions}")`,
  },
  {
    title: "데이터 추출",
    code: `# CSS 셀렉터로 추출
result = await session.act({
    "tool": "extract",
    "query": {
        "mode": "css",
        "selector": "h1, h2, h3"
    }
})

# 텍스트 전체 추출
result = await session.act({
    "tool": "extract",
    "query": {"mode": "text"}
})`,
  },
  {
    title: "정책 기반 안전 제어",
    code: `from an_web.policy import PolicyRules, PolicyChecker

rules = PolicyRules.sandboxed(
    allowed_domains=["example.com", "api.example.com"]
)
checker = PolicyChecker(rules)

result = checker.check_navigate("https://example.com")
print(result.allowed)  # True

result = checker.check_navigate("https://evil.com")
print(result.allowed)  # False`,
  },
];

const INSTALL_LINES: InstallLine[] = [
  { comment: "# Installation", prefix: "$", command: "pip install", args: "an-web" },
  { comment: "# or with uv", prefix: "$", command: "uv add", args: "an-web" },
];

const CTA: CTAConfig = {
  icon: <Cpu size={32} className="text-anweb-light" />,
  title: "an-web으로 시작하세요",
  description: "pip install an-web으로 설치하고, AI 에이전트에 웹 탐색 능력을 부여하세요.",
  buttons: [
    {
      label: "GitHub",
      href: "https://github.com/CocoRoF/an-web",
      icon: <Github size={16} />,
      variant: "primary",
    },
    {
      label: "문서 보기",
      href: "https://github.com/CocoRoF/an-web#readme",
      icon: <BookOpen size={16} />,
      variant: "secondary",
    },
  ],
};

export default function AnWebPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <IntroHero meta={meta} installLines={INSTALL_LINES} />

      {/* ─── Features ─── */}
      <FeatureGrid
        title="핵심 기능"
        subtitle="AI 에이전트를 위해 설계된 시맨틱 웹 브라우저 엔진의 기능을 확인하세요."
        features={FEATURES}
        color="anweb"
      />

      {/* ─── AI Tools ─── */}
      <SectionWrapper>
        <h2 className="section-title text-center">11개 AI 도구</h2>
        <p className="section-subtitle text-center mx-auto">
          Claude, GPT 등 LLM의 도구 호출 형식과 완벽하게 호환됩니다.
        </p>

        <div className="mt-14 max-w-2xl mx-auto">
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-anweb-light font-semibold">
                    도구
                  </th>
                  <th className="text-left py-3 px-4 text-text-muted font-semibold">
                    설명
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {TOOLS_LIST.map(({ tool, description }) => (
                  <tr key={tool}>
                    <td className="py-2.5 px-4 font-mono text-anweb-light text-xs">
                      {tool}
                    </td>
                    <td className="py-2.5 px-4 text-text-muted text-xs">
                      {description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      {/* ─── Code Examples ─── */}
      <CodeExamples
        title="코드 예제"
        subtitle="직관적인 Python API로 웹 페이지를 탐색하고 데이터를 추출하세요."
        examples={CODE_EXAMPLES}
        color="anweb"
      />

      {/* ─── Architecture ─── */}
      <SectionWrapper>
        <h2 className="section-title text-center">아키텍처</h2>
        <p className="section-subtitle text-center mx-auto">
          10개 서브패키지로 구성된 모듈러 아키텍처
        </p>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 max-w-4xl mx-auto">
          {[
            { name: "core", desc: "엔진, 세션", icon: <Cpu size={16} /> },
            { name: "dom", desc: "HTML 파서", icon: <Globe size={16} /> },
            { name: "actions", desc: "11개 도구", icon: <Workflow size={16} /> },
            { name: "semantic", desc: "페이지 분석", icon: <Brain size={16} /> },
            { name: "policy", desc: "보안 정책", icon: <Shield size={16} /> },
          ].map((mod) => (
            <div key={mod.name} className="card-glass text-center p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-anweb/10 text-anweb-light mx-auto mb-2">
                {mod.icon}
              </div>
              <div className="text-xs font-mono text-anweb-light">{mod.name}</div>
              <div className="text-xs text-text-muted mt-1">{mod.desc}</div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ─── CTA ─── */}
      <CTASection cta={CTA} />
    </>
  );
}
