import {
  BarChart3,
  Github,
  BookOpen,
  FileSpreadsheet,
  Globe2,
  Languages,
  Gauge,
  Cpu,
  Sparkles,
  TableProperties,
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

const meta = LIBRARY_META.f2a;

const FEATURES: FeatureItem[] = [
  {
    icon: <BarChart3 size={20} />,
    title: "23가지 분석 모듈",
    description:
      "기술 통계, 상관 분석, 분포 분석, 이상치 탐지, PCA, 피처 중요도 등 23가지 분석 모듈을 자동으로 실행합니다.",
  },
  {
    icon: <FileSpreadsheet size={20} />,
    title: "24+ 파일 포맷",
    description:
      "CSV, TSV, JSON, JSONL, Parquet, Excel, Feather, ORC 등 24가지 이상의 데이터 파일 형식을 지원합니다.",
  },
  {
    icon: <Globe2 size={20} />,
    title: "HuggingFace 통합",
    description:
      "hf:// 프로토콜로 HuggingFace 데이터셋을 직접 분석할 수 있습니다. URL 기반 원격 데이터도 지원합니다.",
  },
  {
    icon: <Languages size={20} />,
    title: "6개국어 리포트",
    description:
      "English, 한국어, 日本語, 中文, Deutsch, Français — 6개 언어로 분석 리포트를 생성합니다.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "50+ 시각화",
    description:
      "히스토그램, 박스플롯, 상관 히트맵, QQ플롯, 산점도 등 50가지 이상의 인터랙티브 시각화를 생성합니다.",
  },
  {
    icon: <TableProperties size={20} />,
    title: "HTML 리포트",
    description:
      "분석 결과를 단일 HTML 파일로 출력합니다. 브라우저에서 바로 열어볼 수 있는 인터랙티브 리포트입니다.",
  },
];

const SUPPORTED_FORMATS = [
  { category: "구분자 기반", formats: "CSV, TSV" },
  { category: "구조화", formats: "JSON, JSONL" },
  { category: "바이너리", formats: "Parquet, Feather, ORC" },
  { category: "스프레드시트", formats: "XLSX, XLS" },
  { category: "원격", formats: "HTTP/HTTPS URL, HuggingFace datasets" },
];

const CODE_EXAMPLES: CodeExample[] = [
  {
    title: "기본 분석",
    code: `import f2a

report = f2a.analyze("data.csv")
report.to_html("./output")

# 자동으로 23가지 분석 + 50가지 시각화 생성`,
  },
  {
    title: "URL / HuggingFace 분석",
    code: `import f2a

# HuggingFace 데이터셋 직접 분석
report = f2a.analyze(
    "hf://datasets/scikit-learn/iris",
    lang="ko"
)
report.to_html("output/")`,
  },
  {
    title: "분석 프리셋",
    code: `import f2a

# Fast 프리셋 (PCA, 피처 중요도 제외)
config = f2a.AnalysisConfig.fast()

report = f2a.analyze(
    "large_data.parquet",
    config=config
)`,
  },
];

const INSTALL_LINES: InstallLine[] = [
  { comment: "# Installation", prefix: "$", command: "pip install", args: "f2a" },
  { comment: "# or with uv", prefix: "$", command: "uv add", args: "f2a" },
];

const CTA: CTAConfig = {
  icon: <Cpu size={32} className="text-f2a-light" />,
  title: "f2a로 시작하세요",
  description: "pip install f2a로 설치하고, 데이터를 자동으로 분석하세요.",
  buttons: [
    {
      label: "GitHub",
      href: "https://github.com/CocoRoF/f2a",
      icon: <Github size={16} />,
      variant: "primary",
    },
    {
      label: "문서 보기",
      href: "https://github.com/CocoRoF/f2a#readme",
      icon: <BookOpen size={16} />,
      variant: "secondary",
    },
  ],
};

export default function F2aPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <IntroHero meta={meta} installLines={INSTALL_LINES} />

      {/* ─── Features ─── */}
      <FeatureGrid
        title="핵심 기능"
        subtitle="f2a가 제공하는 자동 데이터 분석 기능을 확인하세요."
        features={FEATURES}
        color="f2a"
      />

      {/* ─── Supported Formats ─── */}
      <SectionWrapper>
        <h2 className="section-title text-center">지원 포맷</h2>
        <p className="section-subtitle text-center mx-auto">
          24가지 이상의 데이터 파일 형식을 처리할 수 있습니다.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPORTED_FORMATS.map((group) => (
            <div key={group.category} className="card">
              <div className="flex items-center gap-2 mb-3">
                <FileSpreadsheet size={16} className="text-f2a-light" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  {group.category}
                </h3>
              </div>
              <p className="text-sm text-text-muted font-mono">{group.formats}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ─── Code Examples ─── */}
      <CodeExamples
        title="코드 예제"
        subtitle="3줄의 코드로 전체 데이터 분석을 수행하세요."
        examples={CODE_EXAMPLES}
        color="f2a"
      />

      {/* ─── Analysis Pipeline ─── */}
      <SectionWrapper>
        <h2 className="section-title text-center">분석 파이프라인</h2>
        <p className="section-subtitle text-center mx-auto">
          단일 함수 호출로 전체 분석 파이프라인이 실행됩니다.
        </p>

        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
          {["데이터 로드", "스키마 분석", "기술 통계", "시각화 생성", "리포트 출력"].map(
            (step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="card-glass flex items-center gap-3 px-5 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-f2a/15 text-f2a-light text-sm font-bold">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                    {step}
                  </span>
                </div>
                {i < 4 && (
                  <span className="text-text-muted hidden sm:block">→</span>
                )}
              </div>
            )
          )}
        </div>
      </SectionWrapper>

      {/* ─── CTA ─── */}
      <CTASection cta={CTA} />
    </>
  );
}
