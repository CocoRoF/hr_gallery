"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  Code2,
  ChevronDown,
  ChevronRight,
  Beaker,
  Settings2,
  Layers,
  Hash,
  SplitSquareVertical,
  Table2,
  Globe,
  FileCode2,
  FileSpreadsheet,
  FileJson,
  FileType,
  Scissors,
  BarChart3,
  Copy,
  Check,
} from "lucide-react";
import {
  contextifierExtract,
  contextifierExtractAndChunk,
  contextifierExtractSample,
  contextifierChunkSample,
  type ExtractionResult,
  type ChunkingResult,
} from "@/lib/api";
import { LIBRARY_META } from "@/config/libraries";
import { DemoPageHeader } from "@/components/library";

/* ─── Constants ─── */

const TABLE_FORMATS = [
  { id: "html", name: "HTML", desc: "테이블을 HTML <table> 태그로" },
  { id: "markdown", name: "Markdown", desc: "| col | col | 마크다운 형식" },
  { id: "text", name: "Text", desc: "탭 구분 플레인 텍스트" },
];

const META_LANGUAGES = [
  { code: "ko", name: "한국어" },
  { code: "en", name: "English" },
];

const SAMPLES = [
  {
    id: "sample_document",
    name: "Markdown 문서",
    desc: "테이블, 코드 블록이 포함된 기술 문서",
    icon: FileText,
    ext: ".md",
  },
  {
    id: "sales_data",
    name: "CSV 데이터",
    desc: "15행 × 7열 — 제품 판매 데이터",
    icon: FileSpreadsheet,
    ext: ".csv",
  },
  {
    id: "sample_code",
    name: "Python 소스코드",
    desc: "클래스, 함수, 독스트링 포함",
    icon: FileCode2,
    ext: ".py",
  },
  {
    id: "config_example",
    name: "JSON 설정파일",
    desc: "중첩 구조의 API 서버 설정",
    icon: FileJson,
    ext: ".json",
  },
  {
    id: "business_report",
    name: "HTML 보고서",
    desc: "한국어 Q1 사업보고서 — 테이블 2개",
    icon: FileType,
    ext: ".html",
  },
];

const ACCEPT_TYPES: Record<string, string[]> = {
  "text/plain": [
    ".txt", ".md", ".log", ".rst", ".py", ".js", ".ts", ".java",
    ".go", ".rs", ".cpp", ".c", ".rb", ".sh", ".sql", ".css",
    ".r", ".lua", ".ini", ".env", ".conf", ".toml", ".yaml", ".yml",
  ],
  "text/csv": [".csv"],
  "text/tab-separated-values": [".tsv"],
  "text/html": [".html", ".htm"],
  "application/json": [".json"],
  "application/xml": [".xml"],
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/rtf": [".rtf"],
};

type DemoMode = "extract" | "chunk";
type SourceMode = "file" | "sample";

const CHUNK_COLORS = [
  "border-emerald-500/60 bg-emerald-500/8",
  "border-teal-500/60 bg-teal-500/8",
  "border-cyan-500/60 bg-cyan-500/8",
  "border-green-500/60 bg-green-500/8",
  "border-lime-500/60 bg-lime-500/8",
  "border-emerald-400/60 bg-emerald-400/8",
  "border-teal-400/60 bg-teal-400/8",
  "border-cyan-400/60 bg-cyan-400/8",
];

/* ─── Main Page ─── */

export default function ContextifierDemoPage() {
  /* source */
  const [sourceMode, setSourceMode] = useState<SourceMode>("sample");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  /* config */
  const [demoMode, setDemoMode] = useState<DemoMode>("chunk");
  const [chunkSize, setChunkSize] = useState(1000);
  const [chunkOverlap, setChunkOverlap] = useState(200);
  const [tableFormat, setTableFormat] = useState("html");
  const [metaLang, setMetaLang] = useState("ko");
  const [showConfig, setShowConfig] = useState(false);

  /* result */
  const [loading, setLoading] = useState(false);
  const [extractResult, setExtractResult] = useState<ExtractionResult | null>(null);
  const [chunkResult, setChunkResult] = useState<ChunkingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedChunks, setExpandedChunks] = useState<Set<number>>(new Set());
  const [showCode, setShowCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  /* handlers */
  const onDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setSourceMode("file");
      setSelectedSample(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT_TYPES,
    maxFiles: 1,
  });

  const canRun =
    !loading &&
    ((sourceMode === "file" && selectedFile !== null) ||
      (sourceMode === "sample" && selectedSample !== null));

  async function handleRun() {
    if (!canRun) return;
    setLoading(true);
    setError(null);
    setExtractResult(null);
    setChunkResult(null);
    setExpandedChunks(new Set());

    try {
      if (sourceMode === "file" && selectedFile) {
        if (demoMode === "extract") {
          const res = await contextifierExtract(selectedFile, tableFormat, metaLang);
          setExtractResult(res);
        } else {
          const res = await contextifierExtractAndChunk(
            selectedFile, chunkSize, chunkOverlap, tableFormat, metaLang,
          );
          setChunkResult(res);
        }
      } else if (sourceMode === "sample" && selectedSample) {
        if (demoMode === "extract") {
          const res = await contextifierExtractSample(selectedSample, tableFormat, metaLang);
          setExtractResult(res);
        } else {
          const res = await contextifierChunkSample(
            selectedSample, chunkSize, chunkOverlap, tableFormat, metaLang,
          );
          setChunkResult(res);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "처리 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleSample(sampleId: string) {
    setSelectedSample(sampleId);
    setSourceMode("sample");
    setSelectedFile(null);
    setError(null);
    setExtractResult(null);
    setChunkResult(null);
    setExpandedChunks(new Set());

    setLoading(true);
    try {
      if (demoMode === "extract") {
        const res = await contextifierExtractSample(sampleId, tableFormat, metaLang);
        setExtractResult(res);
      } else {
        const res = await contextifierChunkSample(
          sampleId, chunkSize, chunkOverlap, tableFormat, metaLang,
        );
        setChunkResult(res);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "처리 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function toggleChunk(idx: number) {
    setExpandedChunks((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  /* code preview */
  const fileName =
    sourceMode === "file" && selectedFile
      ? selectedFile.name
      : selectedSample
        ? SAMPLES.find((s) => s.id === selectedSample)?.name || "file"
        : "document.pdf";

  const codePreview =
    demoMode === "extract"
      ? `from contextifier import DocumentProcessor
from contextifier.config import ProcessingConfig, TableConfig, MetadataConfig
from contextifier.types import OutputFormat

config = ProcessingConfig(
    tables=TableConfig(output_format=OutputFormat.${tableFormat.toUpperCase()}),
    metadata=MetadataConfig(language="${metaLang}"),
)

processor = DocumentProcessor(config=config)
text = processor.extract_text("${fileName}")

print(f"Extracted {len(text)} characters")
print(text[:500])`
      : `from contextifier import DocumentProcessor
from contextifier.config import ProcessingConfig, ChunkingConfig, TableConfig, MetadataConfig
from contextifier.types import OutputFormat

config = ProcessingConfig(
    chunking=ChunkingConfig(
        chunk_size=${chunkSize},
        chunk_overlap=${chunkOverlap},
    ),
    tables=TableConfig(output_format=OutputFormat.${tableFormat.toUpperCase()}),
    metadata=MetadataConfig(language="${metaLang}"),
)

processor = DocumentProcessor(config=config)
result = processor.extract_chunks("${fileName}")

print(f"Created {len(result.chunks)} chunks")
for i, chunk in enumerate(result.chunks):
    print(f"Chunk {i+1} ({len(chunk)} chars): {chunk[:80]}...")`;

  async function handleCopyCode() {
    await navigator.clipboard.writeText(codePreview);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  const result = extractResult || chunkResult;
  const hasResult = result !== null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <DemoPageHeader
        meta={LIBRARY_META.contextifier}
        title="Contextifier 데모"
        description="문서를 업로드하면 AI-Ready 구조화 텍스트로 변환합니다. 80+ 포맷 지원, 지능형 청킹, 테이블/메타데이터 추출."
        icon={<FileText size={24} />}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* ─── Left Panel: Source & Config ─── */}
        <div className="space-y-6 lg:col-span-1">
          {/* Mode Toggle */}
          <div className="card">
            <h3 className="mb-3 text-sm font-medium text-text-secondary">처리 모드</h3>
            <div className="flex gap-1 rounded-lg bg-bg-secondary p-1">
              {([
                { mode: "extract" as DemoMode, icon: FileText, label: "텍스트 추출" },
                { mode: "chunk" as DemoMode, icon: Scissors, label: "추출 + 청킹" },
              ]).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setDemoMode(mode)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                    demoMode === mode
                      ? "bg-contextifier/20 text-contextifier shadow-sm"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Source: File Upload */}
          <div className="card">
            <h3 className="mb-3 text-sm font-medium text-text-secondary">
              <Upload size={14} className="mr-1.5 inline" />
              파일 업로드
            </h3>
            <div
              {...getRootProps()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                isDragActive
                  ? "border-contextifier bg-contextifier/5"
                  : selectedFile
                    ? "border-contextifier/50 bg-contextifier/5"
                    : "border-border hover:border-contextifier/30"
              }`}
            >
              <input {...getInputProps()} />
              {selectedFile ? (
                <div className="text-center">
                  <FileText size={28} className="mx-auto mb-2 text-contextifier" />
                  <p className="text-sm font-medium text-text-primary">
                    {selectedFile.name}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload size={28} className="mx-auto mb-2 text-text-muted" />
                  <p className="text-xs text-text-muted">
                    {isDragActive ? "파일을 놓으세요" : "클릭 또는 드래그로 업로드"}
                  </p>
                  <p className="mt-1 text-[10px] text-text-muted/60">
                    PDF, DOCX, XLSX, CSV, HTML, MD, PY, JSON + 70개 이상 포맷
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Source: Samples */}
          <div className="card">
            <h3 className="mb-3 text-sm font-medium text-text-secondary">
              <Beaker size={14} className="mr-1.5 inline" />
              샘플 파일
            </h3>
            <div className="space-y-2">
              {SAMPLES.map((sample) => {
                const Icon = sample.icon;
                const isActive = selectedSample === sample.id && sourceMode === "sample";
                return (
                  <button
                    key={sample.id}
                    onClick={() => handleSample(sample.id)}
                    disabled={loading}
                    className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
                      isActive
                        ? "border-contextifier/50 bg-contextifier/10"
                        : "border-border hover:border-contextifier/30 hover:bg-bg-secondary"
                    } ${loading ? "opacity-50" : ""}`}
                  >
                    <Icon
                      size={18}
                      className={isActive ? "mt-0.5 text-contextifier" : "mt-0.5 text-text-muted"}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-text-primary">
                          {sample.name}
                        </span>
                        <span className="rounded bg-bg-secondary px-1.5 py-0.5 text-[10px] text-text-muted">
                          {sample.ext}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-text-muted">{sample.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Config Panel */}
          <div className="card">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex w-full items-center justify-between text-sm font-medium text-text-secondary"
            >
              <span className="flex items-center gap-1.5">
                <Settings2 size={14} />
                추출 설정
              </span>
              {showConfig ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {showConfig && (
              <div className="mt-4 space-y-4">
                {/* Chunk Size */}
                {demoMode === "chunk" && (
                  <>
                    <div>
                      <label className="mb-1.5 flex items-center justify-between text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Hash size={12} />
                          청크 크기
                        </span>
                        <span className="font-mono text-contextifier">{chunkSize}</span>
                      </label>
                      <input
                        type="range"
                        min={100}
                        max={5000}
                        step={100}
                        value={chunkSize}
                        onChange={(e) => setChunkSize(Number(e.target.value))}
                        className="w-full accent-contextifier"
                      />
                      <div className="mt-0.5 flex justify-between text-[10px] text-text-muted/50">
                        <span>100</span>
                        <span>5000</span>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center justify-between text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <SplitSquareVertical size={12} />
                          청크 오버랩
                        </span>
                        <span className="font-mono text-contextifier">{chunkOverlap}</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={Math.min(chunkSize - 50, 2000)}
                        step={50}
                        value={chunkOverlap}
                        onChange={(e) => setChunkOverlap(Number(e.target.value))}
                        className="w-full accent-contextifier"
                      />
                      <div className="mt-0.5 flex justify-between text-[10px] text-text-muted/50">
                        <span>0</span>
                        <span>{Math.min(chunkSize - 50, 2000)}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Table Format */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1 text-xs text-text-muted">
                    <Table2 size={12} />
                    테이블 출력 형식
                  </label>
                  <div className="flex gap-1 rounded-lg bg-bg-secondary p-1">
                    {TABLE_FORMATS.map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => setTableFormat(fmt.id)}
                        className={`flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-all ${
                          tableFormat === fmt.id
                            ? "bg-contextifier/20 text-contextifier"
                            : "text-text-muted hover:text-text-secondary"
                        }`}
                      >
                        {fmt.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metadata Language */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1 text-xs text-text-muted">
                    <Globe size={12} />
                    메타데이터 언어
                  </label>
                  <div className="flex gap-1 rounded-lg bg-bg-secondary p-1">
                    {META_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setMetaLang(lang.code)}
                        className={`flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-all ${
                          metaLang === lang.code
                            ? "bg-contextifier/20 text-contextifier"
                            : "text-text-muted hover:text-text-secondary"
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Run Button */}
          {sourceMode === "file" && (
            <button
              onClick={handleRun}
              disabled={!canRun}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-contextifier px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-contextifier/25 transition-all hover:bg-contextifier-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  {demoMode === "extract" ? <FileText size={16} /> : <Scissors size={16} />}
                  {demoMode === "extract" ? "텍스트 추출" : "추출 + 청킹"}
                </>
              )}
            </button>
          )}

          {/* Code Preview */}
          <div className="card">
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex w-full items-center justify-between text-sm font-medium text-text-secondary"
            >
              <span className="flex items-center gap-1.5">
                <Code2 size={14} />
                Python 코드
              </span>
              {showCode ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {showCode && (
              <div className="relative mt-3">
                <button
                  onClick={handleCopyCode}
                  className="absolute right-2 top-2 rounded-md border border-border bg-bg-secondary p-1.5 text-text-muted hover:text-text-primary transition-colors"
                  title="복사"
                >
                  {copiedCode ? (
                    <Check size={12} className="text-contextifier" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
                <pre className="overflow-x-auto rounded-lg bg-bg-secondary p-4 text-[11px] leading-relaxed text-text-secondary font-mono">
                  {codePreview}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Panel: Results ─── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Loading */}
          {loading && (
            <div className="card flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 size={40} className="mx-auto mb-4 animate-spin text-contextifier" />
                <p className="text-sm text-text-secondary">문서를 처리하고 있습니다...</p>
                <p className="mt-1 text-xs text-text-muted">
                  5단계 파이프라인: 변환 → 전처리 → 메타데이터 → 콘텐츠 → 후처리
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="card border-red-500/30 bg-red-500/5">
              <div className="flex items-start gap-3">
                <XCircle size={20} className="mt-0.5 shrink-0 text-red-400" />
                <div>
                  <h3 className="text-sm font-medium text-red-400">처리 실패</h3>
                  <p className="mt-1 text-xs text-red-300/80">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !hasResult && !error && (
            <div className="card flex flex-col items-center justify-center py-20">
              <FileText size={48} className="mb-4 text-text-muted/30" />
              <h3 className="text-lg font-medium text-text-secondary">
                문서를 처리해 보세요
              </h3>
              <p className="mt-2 max-w-md text-center text-xs text-text-muted">
                샘플 파일을 클릭하거나 문서를 업로드하면, Contextifier가 5단계
                파이프라인을 통해 AI-Ready 구조화 텍스트로 변환합니다.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[".pdf", ".docx", ".xlsx", ".csv", ".html", ".md", ".py", ".json"].map(
                  (ext) => (
                    <span
                      key={ext}
                      className="rounded-full bg-contextifier/10 px-2.5 py-1 text-[10px] font-medium text-contextifier"
                    >
                      {ext}
                    </span>
                  ),
                )}
                <span className="rounded-full bg-bg-secondary px-2.5 py-1 text-[10px] text-text-muted">
                  +70 포맷
                </span>
              </div>
            </div>
          )}

          {/* Extraction Result */}
          {extractResult && !loading && <ExtractionResultView result={extractResult} />}

          {/* Chunking Result */}
          {chunkResult && !loading && (
            <ChunkingResultView
              result={chunkResult}
              expandedChunks={expandedChunks}
              toggleChunk={toggleChunk}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Extraction Result Component ─── */

function ExtractionResultView({ result }: { result: ExtractionResult }) {
  const [showFullText, setShowFullText] = useState(false);

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-contextifier" />
          <h3 className="text-sm font-semibold text-text-primary">추출 완료</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBox label="파일" value={result.filename} sub={result.file_extension} />
          <StatBox label="파일 크기" value={formatBytes(result.file_size_bytes)} />
          <StatBox label="추출된 텍스트" value={`${result.text_length.toLocaleString()} 자`} />
          <StatBox
            label="구조 요소"
            value={`테이블 ${result.table_count} · 이미지 ${result.image_count} · 페이지 ${result.page_count}`}
          />
        </div>
      </div>

      {/* Metadata Block */}
      {result.metadata_block && (
        <div className="card">
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <Layers size={13} />
            메타데이터
          </h4>
          <pre className="overflow-x-auto rounded-lg bg-bg-secondary p-3 text-[11px] leading-relaxed text-contextifier/80 font-mono">
            {result.metadata_block}
          </pre>
        </div>
      )}

      {/* Extracted Text */}
      <div className="card">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <FileText size={13} />
            추출된 텍스트
          </h4>
          {result.text_length > 2000 && (
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="text-[11px] text-contextifier hover:text-contextifier-light transition-colors"
            >
              {showFullText ? "접기" : "전체 보기"}
            </button>
          )}
        </div>
        <pre className="overflow-x-auto rounded-lg bg-bg-secondary p-4 text-[11px] leading-relaxed text-text-secondary font-mono whitespace-pre-wrap break-words">
          {showFullText || result.text_length <= 2000
            ? result.extracted_text
            : result.extracted_text.slice(0, 2000) + "\n\n... (더 보려면 '전체 보기' 클릭)"}
        </pre>
      </div>
    </div>
  );
}

/* ─── Chunking Result Component ─── */

function ChunkingResultView({
  result,
  expandedChunks,
  toggleChunk,
}: {
  result: ChunkingResult;
  expandedChunks: Set<number>;
  toggleChunk: (idx: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<"chunks" | "text">("chunks");
  const [showFullText, setShowFullText] = useState(false);

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-contextifier" />
          <h3 className="text-sm font-semibold text-text-primary">추출 + 청킹 완료</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatBox label="파일" value={result.filename} sub={result.file_extension} />
          <StatBox label="텍스트 길이" value={`${result.text_length.toLocaleString()} 자`} />
          <StatBox label="청크 수" value={String(result.chunk_count)} highlight />
          <StatBox label="평균 길이" value={`${Math.round(result.avg_chunk_length)} 자`} />
          <StatBox
            label="최소 / 최대"
            value={`${result.min_chunk_length} / ${result.max_chunk_length}`}
          />
          <StatBox
            label="설정"
            value={`${result.chunk_size} / ${result.chunk_overlap}`}
            sub="size / overlap"
          />
        </div>
      </div>

      {/* Chunk Distribution Chart */}
      {result.chunks.length > 1 && (
        <div className="card">
          <h4 className="mb-3 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <BarChart3 size={13} />
            청크 크기 분포
          </h4>
          <div className="flex items-end gap-1" style={{ height: 80 }}>
            {result.chunks.map((chunk, i) => {
              const maxLen = result.max_chunk_length || 1;
              const heightPct = (chunk.length / maxLen) * 100;
              const colorClass = CHUNK_COLORS[i % CHUNK_COLORS.length];
              return (
                <div
                  key={i}
                  className="group relative flex-1 cursor-pointer"
                  onClick={() => toggleChunk(i)}
                >
                  <div
                    className={`rounded-t border-t-2 transition-all hover:opacity-80 ${colorClass}`}
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                  />
                  <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-bg-elevated px-1.5 py-0.5 text-[9px] text-text-muted opacity-0 shadow transition-opacity group-hover:opacity-100">
                    {chunk.length} 자
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-text-muted/50">
            <span>Chunk 1</span>
            <span>Chunk {result.chunk_count}</span>
          </div>
        </div>
      )}

      {/* Tabs: Chunks vs Full Text */}
      <div className="card">
        <div className="mb-4 flex gap-1 rounded-lg bg-bg-secondary p-1">
          <button
            onClick={() => setActiveTab("chunks")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
              activeTab === "chunks"
                ? "bg-contextifier/20 text-contextifier shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <Scissors size={13} />
            청크 뷰 ({result.chunk_count})
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
              activeTab === "text"
                ? "bg-contextifier/20 text-contextifier shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <FileText size={13} />
            전체 텍스트
          </button>
        </div>

        {activeTab === "chunks" ? (
          <div className="space-y-2">
            {result.chunks.map((chunk, i) => {
              const isExpanded = expandedChunks.has(i);
              const colorClass = CHUNK_COLORS[i % CHUNK_COLORS.length];
              return (
                <div key={i} className={`rounded-lg border transition-all ${colorClass}`}>
                  <button
                    onClick={() => toggleChunk(i)}
                    className="flex w-full items-center justify-between px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-bg-secondary text-[10px] font-bold text-text-muted">
                        {i + 1}
                      </span>
                      <span className="shrink-0 text-xs text-text-secondary">
                        {chunk.length.toLocaleString()} 자
                      </span>
                      {!isExpanded && (
                        <span className="truncate text-[11px] text-text-muted">
                          {chunk.text.slice(0, 80)}
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronDown size={14} className="shrink-0 text-text-muted" />
                    ) : (
                      <ChevronRight size={14} className="shrink-0 text-text-muted" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border/50 px-3 py-3">
                      <pre className="overflow-x-auto rounded bg-bg-primary/50 p-3 text-[11px] leading-relaxed text-text-secondary font-mono whitespace-pre-wrap break-words">
                        {chunk.text}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="mb-2 flex justify-end">
              {result.text_length > 3000 && (
                <button
                  onClick={() => setShowFullText(!showFullText)}
                  className="text-[11px] text-contextifier hover:text-contextifier-light transition-colors"
                >
                  {showFullText ? "접기" : "전체 보기"}
                </button>
              )}
            </div>
            <pre className="overflow-x-auto rounded-lg bg-bg-secondary p-4 text-[11px] leading-relaxed text-text-secondary font-mono whitespace-pre-wrap break-words">
              {showFullText || result.text_length <= 3000
                ? result.extracted_text
                : result.extracted_text.slice(0, 3000) +
                  "\n\n... (더 보려면 '전체 보기' 클릭)"}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Helpers ─── */

function StatBox({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-bg-secondary px-3 py-2.5">
      <p className="text-[10px] text-text-muted">{label}</p>
      <p
        className={`mt-0.5 text-xs font-semibold truncate ${
          highlight ? "text-contextifier" : "text-text-primary"
        }`}
        title={value}
      >
        {value}
      </p>
      {sub && <p className="text-[9px] text-text-muted/60">{sub}</p>}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
