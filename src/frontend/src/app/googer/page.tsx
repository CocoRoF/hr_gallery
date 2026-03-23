import {
  Search,
  Github,
  BookOpen,
  Globe,
  Zap,
  Shield,
  Layers,
  Filter,
  Cpu,
  Image,
  Newspaper,
  Crosshair,
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

const meta = LIBRARY_META.googer;

const FEATURES: FeatureItem[] = [
  {
    icon: <Layers size={20} />,
    title: "7개 검색 엔진",
    description:
      "DuckDuckGo, Brave, Google, Ecosia, Yahoo, AOL, Naver — 7가지 검색 엔진을 단일 API로 사용할 수 있습니다.",
  },
  {
    icon: <Zap size={20} />,
    title: "멀티 엔진 동시 검색",
    description:
      "여러 엔진에 동시에 요청을 보내고, 결과를 자동으로 랭킹하여 최적의 결과를 반환합니다.",
  },
  {
    icon: <Globe size={20} />,
    title: "자동 폴백",
    description:
      "하나의 엔진이 실패하면 자동으로 다음 엔진으로 전환합니다. 안정적인 검색을 보장합니다.",
  },
  {
    icon: <Image size={20} />,
    title: "이미지/뉴스/비디오",
    description:
      "텍스트 검색뿐 아니라 이미지, 뉴스, 비디오 검색까지 지원합니다. 각 타입별 필터를 제공합니다.",
  },
  {
    icon: <Filter size={20} />,
    title: "Query Builder",
    description:
      "site:, filetype:, intitle: 등 Google 고급 검색 연산자를 프로그래매틱하게 조합할 수 있습니다.",
  },
  {
    icon: <Shield size={20} />,
    title: "타입 안전",
    description:
      "완전한 타입 힌트와 Pydantic 모델로 IDE 자동완성과 런타임 검증을 지원합니다.",
  },
];

const SUPPORTED_ENGINES = [
  { name: "DuckDuckGo", status: "기본 엔진" },
  { name: "Brave", status: "추천" },
  { name: "Google", status: "지원" },
  { name: "Ecosia", status: "지원" },
  { name: "Yahoo", status: "지원" },
  { name: "AOL", status: "지원" },
  { name: "Naver", status: "한국 검색" },
];

const CODE_EXAMPLES: CodeExample[] = [
  {
    title: "기본 검색",
    code: `from googer import Googer

with Googer(engine="auto") as g:
    results = g.search("python web scraping")
    for r in results:
        print(r.title)
        print(r.href)
        print(r.body)`,
  },
  {
    title: "멀티 엔진 검색",
    code: `from googer import Googer

with Googer(engine="multi") as g:
    results = g.search(
        "machine learning",
        max_results=20,
        region="ko-kr"
    )
    for r in results:
        print(f"[{r.provider}] {r.title}")`,
  },
  {
    title: "Query Builder",
    code: `from googer import Googer, Query

q = (
    Query("deep learning")
    .site("arxiv.org")
    .filetype("pdf")
    .intitle("transformer")
)

with Googer() as g:
    results = g.search(q)`,
  },
];

const INSTALL_LINES: InstallLine[] = [
  { comment: "# Installation", prefix: "$", command: "pip install", args: "googer" },
  { comment: "# or with uv", prefix: "$", command: "uv add", args: "googer" },
];

const CTA: CTAConfig = {
  icon: <Cpu size={32} className="text-googer-light" />,
  title: "googer로 시작하세요",
  description: "pip install googer로 설치하고, 7개 엔진으로 웹을 검색하세요.",
  buttons: [
    {
      label: "GitHub",
      href: "https://github.com/CocoRoF/googer",
      icon: <Github size={16} />,
      variant: "primary",
    },
    {
      label: "문서 보기",
      href: "https://github.com/CocoRoF/googer#readme",
      icon: <BookOpen size={16} />,
      variant: "secondary",
    },
  ],
};

export default function GoogerPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <IntroHero meta={meta} installLines={INSTALL_LINES} />

      {/* ─── Features ─── */}
      <FeatureGrid
        title="핵심 기능"
        subtitle="googer가 제공하는 강력한 웹 검색 기능을 확인하세요."
        features={FEATURES}
        color="googer"
      />

      {/* ─── Supported Engines ─── */}
      <SectionWrapper>
        <h2 className="section-title text-center">지원 엔진</h2>
        <p className="section-subtitle text-center mx-auto">
          7개 검색 엔진을 단일 인터페이스로 사용할 수 있습니다.
        </p>

        <div className="mt-14 max-w-2xl mx-auto">
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-muted font-semibold">엔진</th>
                  <th className="text-right py-3 px-4 text-text-muted font-semibold">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {SUPPORTED_ENGINES.map((engine) => (
                  <tr key={engine.name}>
                    <td className="py-3 px-4 text-text-primary font-medium flex items-center gap-2">
                      <Crosshair size={14} className="text-googer-light" />
                      {engine.name}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="rounded-md bg-googer/10 px-2 py-0.5 text-xs text-googer-light">
                        {engine.status}
                      </span>
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
        subtitle="간단한 API로 강력한 웹 검색을 수행하세요."
        examples={CODE_EXAMPLES}
        color="googer"
      />

      {/* ─── Search Types ─── */}
      <SectionWrapper>
        <h2 className="section-title text-center">검색 유형</h2>
        <p className="section-subtitle text-center mx-auto">
          4가지 검색 유형을 지원합니다.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Search size={24} />, title: "웹 검색", desc: "일반 텍스트 검색 결과" },
            { icon: <Image size={24} />, title: "이미지 검색", desc: "크기, 색상, 유형 필터" },
            { icon: <Newspaper size={24} />, title: "뉴스 검색", desc: "최신 뉴스 기사 검색" },
            { icon: <Search size={24} />, title: "비디오 검색", desc: "영상 길이별 필터" },
          ].map((type) => (
            <div key={type.title} className="card-glass text-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-googer/10 text-googer-light mx-auto mb-3">
                {type.icon}
              </div>
              <h3 className="text-sm font-bold text-text-primary">{type.title}</h3>
              <p className="mt-1 text-xs text-text-muted">{type.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ─── CTA ─── */}
      <CTASection cta={CTA} />
    </>
  );
}
