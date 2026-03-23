import {
  FileText,
  Github,
  BookOpen,
  Eye,
  Table2,
  ScanLine,
  Scissors,
  Layers,
  FileCode2,
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

const meta = LIBRARY_META.contextifier;

const FEATURES: FeatureItem[] = [
  {
    icon: <FileText size={20} />,
    title: "80+ 포맷 지원",
    description:
      "PDF, DOCX, DOC, PPTX, PPT, XLSX, XLS, HWP, HWPX, RTF, CSV, TSV, TXT, MD, HTML, 이미지, 코드 파일 등 80가지 이상의 확장자를 지원합니다.",
  },
  {
    icon: <Eye size={20} />,
    title: "지능형 텍스트 추출",
    description:
      "문서 구조(제목, 테이블, 이미지 위치)를 유지하면서 자동 메타데이터 추출을 수행합니다.",
  },
  {
    icon: <ScanLine size={20} />,
    title: "OCR 5개 엔진",
    description:
      "OpenAI, Anthropic, Google Gemini, AWS Bedrock, vLLM — 5가지 Vision LLM 엔진으로 이미지에서 텍스트를 추출합니다.",
  },
  {
    icon: <Scissors size={20} />,
    title: "스마트 청킹",
    description:
      "테이블 인식, 페이지 경계, 보호 영역, 재귀 분할 등 4가지 전략을 자동으로 선택하여 최적의 청크를 생성합니다.",
  },
  {
    icon: <Table2 size={20} />,
    title: "테이블 처리",
    description:
      "rowspan/colspan이 포함된 병합 셀도 지원하며, HTML/Markdown/Text 형식으로 변환합니다.",
  },
  {
    icon: <Layers size={20} />,
    title: "LangChain 통합",
    description:
      "LangChain, LangGraph와 완벽하게 연동되어 AI 파이프라인에 바로 투입할 수 있습니다.",
  },
];

const SUPPORTED_FORMATS = [
  { category: "문서", formats: "PDF, DOCX, DOC, PPTX, PPT, HWP, HWPX, RTF" },
  { category: "스프레드시트", formats: "XLSX, XLS, CSV, TSV" },
  { category: "마크업", formats: "HTML, MD, TXT" },
  { category: "이미지", formats: "PNG, JPG, JPEG, WEBP, HEIF, TIFF, BMP" },
  { category: "코드", formats: "PY, JS, TS, JAVA, C, CPP, RS, GO 등 30+" },
];

const CODE_EXAMPLES: CodeExample[] = [
  {
    title: "기본 텍스트 추출",
    code: `from contextifier import DocumentProcessor

processor = DocumentProcessor()
result = processor.process("document.pdf")

print(result.text)
print(f"Pages: {result.metadata.page_count}")`,
  },
  {
    title: "OCR 처리",
    code: `from contextifier import DocumentProcessor, ProcessingConfig

config = ProcessingConfig(
    ocr_enabled=True,
    ocr_engine="openai",  # or anthropic, gemini, bedrock, vllm
)
processor = DocumentProcessor(config=config)
result = processor.process("scanned_doc.pdf")`,
  },
  {
    title: "스마트 청킹",
    code: `from contextifier import DocumentProcessor

processor = DocumentProcessor()
result = processor.process("long_document.pdf")

for chunk in result.chunks:
    print(f"[{chunk.type}] {chunk.text[:80]}...")
    # chunk.metadata contains page, position, etc.`,
  },
];

const INSTALL_LINES: InstallLine[] = [
  { comment: "# Installation", prefix: "$", command: "pip install", args: "contextifier" },
  { comment: "# or with uv", prefix: "$", command: "uv add", args: "contextifier" },
];

const CTA: CTAConfig = {
  icon: <Cpu size={32} className="text-contextifier-light" />,
  title: "Contextifier로 시작하세요",
  description: "pip install contextifier로 설치하고, 문서를 AI 컨텍스트로 변환하세요.",
  buttons: [
    {
      label: "GitHub",
      href: "https://github.com/CocoRoF/Contextifier",
      icon: <Github size={16} />,
      variant: "primary",
    },
    {
      label: "문서 보기",
      href: "https://github.com/CocoRoF/Contextifier#readme",
      icon: <BookOpen size={16} />,
      variant: "secondary",
    },
  ],
};

export default function ContextifierPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <IntroHero meta={meta} installLines={INSTALL_LINES} />

      {/* ─── Features ─── */}
      <FeatureGrid
        title="핵심 기능"
        subtitle="Contextifier가 제공하는 강력한 문서 처리 기능을 확인하세요."
        features={FEATURES}
        color="contextifier"
      />

      {/* ─── Supported Formats ─── */}
      <SectionWrapper>
        <h2 className="section-title text-center">지원 포맷</h2>
        <p className="section-subtitle text-center mx-auto">
          80가지 이상의 파일 확장자를 처리할 수 있습니다.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPORTED_FORMATS.map((group) => (
            <div key={group.category} className="card">
              <div className="flex items-center gap-2 mb-3">
                <FileCode2 size={16} className="text-contextifier-light" />
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
        subtitle="간단한 API로 복잡한 문서 처리를 수행하세요."
        examples={CODE_EXAMPLES}
        color="contextifier"
      />

      {/* ─── Pipeline ─── */}
      <SectionWrapper>
        <h2 className="section-title text-center">5단계 균일 파이프라인</h2>
        <p className="section-subtitle text-center mx-auto">
          모든 문서 포맷에 동일한 처리 파이프라인을 적용합니다.
        </p>

        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
          {["입력 감지", "텍스트 추출", "테이블 처리", "OCR 처리", "청킹"].map(
            (step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="card-glass flex items-center gap-3 px-5 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-contextifier/15 text-contextifier-light text-sm font-bold">
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
