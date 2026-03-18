import Link from "next/link";
import {
  FileText,
  Github,
  Package,
  ExternalLink,
  ArrowLeft,
  BookOpen,
  Layers,
  Eye,
  Table2,
  ScanLine,
  Scissors,
  FileCode2,
  Cpu,
  CheckCircle2,
} from "lucide-react";

const FEATURES = [
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

const CODE_EXAMPLES = [
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

export default function ContextifierPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-contextifier/[0.08] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-contextifier/[0.05] rounded-full blur-[100px]" />
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
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-contextifier/20 to-contextifier/5 border border-contextifier/20 text-contextifier">
                  <FileText size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-gray-100 sm:text-4xl">
                      Contextifier
                    </h1>
                    <span className="badge-contextifier">v0.2.2</span>
                  </div>
                  <p className="text-sm text-surface-500 mt-1">Document → AI Context</p>
                </div>
              </div>

              <p className="text-lg text-gray-400 leading-relaxed">
                다양한 문서 포맷을 AI가 이해할 수 있는 구조화된 텍스트로 변환합니다.
                <br />
                5단계 균일 파이프라인으로 모든 문서 포맷에 일관된 결과를 제공합니다.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="badge-python">Python ≥ 3.12</span>
                <span className="badge bg-green-500/10 text-green-400 border border-green-500/20">Apache-2.0</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://github.com/CocoRoF/Contextifier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-contextifier"
                >
                  <Github size={16} />
                  GitHub
                </a>
                <a
                  href="https://pypi.org/project/contextifier/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <Package size={16} />
                  PyPI
                </a>
              </div>
            </div>

            {/* Quick Install */}
            <div className="lg:w-96">
              <div className="code-block">
                <div className="text-surface-500 text-xs mb-2"># Installation</div>
                <div className="text-gray-300">
                  <span className="text-surface-500">$</span>{" "}
                  <span className="text-accent-light">pip install</span>{" "}
                  <span className="text-contextifier-light">contextifier</span>
                </div>
                <div className="mt-3 text-surface-500 text-xs mb-2"># or with uv</div>
                <div className="text-gray-300">
                  <span className="text-surface-500">$</span>{" "}
                  <span className="text-accent-light">uv add</span>{" "}
                  <span className="text-contextifier-light">contextifier</span>
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
            Contextifier가 제공하는 강력한 문서 처리 기능을 확인하세요.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card-glass group hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-contextifier/10 text-contextifier-light mb-4 transition-transform group-hover:scale-110">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-100">{f.title}</h3>
                <p className="mt-2 text-sm text-surface-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Supported Formats ─── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">지원 포맷</h2>
          <p className="section-subtitle text-center mx-auto">
            80가지 이상의 파일 확장자를 처리할 수 있습니다.
          </p>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORTED_FORMATS.map((group) => (
              <div key={group.category} className="card">
                <div className="flex items-center gap-2 mb-3">
                  <FileCode2 size={16} className="text-contextifier-light" />
                  <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">{group.category}</h3>
                </div>
                <p className="text-sm text-surface-500 font-mono">{group.formats}</p>
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
            간단한 API로 복잡한 문서 처리를 수행하세요.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {CODE_EXAMPLES.map((ex) => (
              <div key={ex.title} className="flex flex-col">
                <h3 className="text-sm font-bold text-gray-200 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-contextifier-light" />
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

      {/* ─── Pipeline ─── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">5단계 균일 파이프라인</h2>
          <p className="section-subtitle text-center mx-auto">
            모든 문서 포맷에 동일한 처리 파이프라인을 적용합니다.
          </p>

          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
            {["입력 감지", "텍스트 추출", "테이블 처리", "OCR 처리", "청킹"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="card-glass flex items-center gap-3 px-5 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-contextifier/15 text-contextifier-light text-sm font-bold">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-200">{step}</span>
                </div>
                {i < 4 && (
                  <span className="text-surface-400 hidden sm:block">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-white/[0.06] bg-surface-50/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="card-glass text-center p-10">
            <Cpu size={32} className="mx-auto text-contextifier-light mb-4" />
            <h2 className="text-xl font-bold text-gray-100 sm:text-2xl">
              Contextifier로 시작하세요
            </h2>
            <p className="mt-3 text-surface-500 max-w-md mx-auto">
              pip install contextifier로 설치하고, 문서를 AI 컨텍스트로 변환하세요.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/CocoRoF/Contextifier"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-contextifier"
              >
                <Github size={16} />
                GitHub
              </a>
              <a
                href="https://github.com/CocoRoF/Contextifier#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <BookOpen size={16} />
                문서 보기
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
