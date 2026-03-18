"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  BarChart3,
  Upload,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Code2,
  ChevronDown,
  ChevronRight,
  Beaker,
  ExternalLink,
  Link2,
  Rows3,
  Columns3,
  AlertTriangle,
  HardDrive,
  ArrowLeft,
  Github,
  Package,
} from "lucide-react";
import {
  analyzeFile,
  analyzeUrl,
  analyzeSample,
  getReportUrl,
  type AnalysisResult,
  type AnalysisResponse,
} from "@/lib/api";

const PRESETS = [
  { id: "full", name: "Full Analysis", desc: "23개 전체 분석 모듈 (기본 13 + 고급 10)" },
  { id: "fast", name: "Fast", desc: "PCA, 피처 중요도, 고급 분석 제외" },
  { id: "basic_only", name: "Basic Only", desc: "기본 13개 모듈만" },
  { id: "minimal", name: "Minimal", desc: "기술 통계만" },
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ko", name: "한국어" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
];

const SAMPLES = [
  {
    id: "iris",
    name: "Iris Dataset",
    desc: "붓꽃 데이터 — 150행 × 5열 (분류)",
    rows: 150,
    cols: 5,
  },
  {
    id: "titanic",
    name: "Titanic Dataset",
    desc: "타이타닉 승객 — 891행 × 15열 (결측치 포함)",
    rows: 891,
    cols: 15,
  },
  {
    id: "housing",
    name: "California Housing",
    desc: "캘리포니아 주택 가격 — 20,640행 × 9열 (회귀)",
    rows: 20640,
    cols: 9,
  },
];

const URL_EXAMPLES = [
  { label: "HuggingFace", value: "hf://datasets/scikit-learn/iris" },
  { label: "CSV URL", value: "https://raw.githubusercontent.com/..." },
];

type SourceMode = "file" | "url" | "sample";

export default function F2aPage() {
  // Source
  const [sourceMode, setSourceMode] = useState<SourceMode>("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");

  // Config
  const [preset, setPreset] = useState("fast");
  const [lang, setLang] = useState("en");
  const [advanced, setAdvanced] = useState(true);

  // Result
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        setSelectedFile(files[0]);
        if (sourceMode !== "file") setSourceMode("file");
      }
    },
    [sourceMode]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "text/tab-separated-values": [".tsv"],
      "application/json": [".json", ".jsonl"],
      "application/octet-stream": [".parquet"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
  });

  const canAnalyze =
    !loading &&
    ((sourceMode === "file" && selectedFile !== null) ||
      (sourceMode === "url" && urlInput.trim() !== ""));

  async function handleAnalyze() {
    if (!canAnalyze) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let res: AnalysisResponse;
      if (sourceMode === "file" && selectedFile) {
        res = await analyzeFile(selectedFile, preset, lang, advanced);
      } else if (sourceMode === "url") {
        res = await analyzeUrl(urlInput.trim(), preset, lang, advanced);
      } else {
        return;
      }
      setResponse(res);
    } catch (err: any) {
      setError(err.message || "분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSample(sampleId: string) {
    setSourceMode("sample");
    setLoading(true);
    setError(null);
    setResponse(null);
    setSelectedFile(null);

    try {
      const res = await analyzeSample(sampleId, preset, lang);
      setResponse(res);
    } catch (err: any) {
      setError(err.message || "분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  // Code preview source string
  const sourceStr =
    sourceMode === "url" && urlInput.trim()
      ? urlInput.trim()
      : selectedFile?.name || "data.csv";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Link */}
      <a href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-gray-300 transition-colors">
        <ArrowLeft size={16} />
        갤러리로 돌아가기
      </a>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-f2a/15 text-f2a">
          <BarChart3 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">f2a 데모</h1>
          <p className="text-sm text-gray-400">
            파일, URL, HuggingFace 데이터셋을 업로드하면 자동으로 23가지 통계
            분석 + 50가지 시각화를 생성합니다.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="https://github.com/CocoRoF/f2a"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-300 px-3 py-1.5 text-xs text-gray-400 hover:border-f2a/50 hover:text-f2a-light transition-colors"
          >
            <Github size={14} /> GitHub
          </a>
          <a
            href="https://pypi.org/project/f2a/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-300 px-3 py-1.5 text-xs text-gray-400 hover:border-f2a/50 hover:text-f2a-light transition-colors"
          >
            <Package size={14} /> PyPI
          </a>
          <span className="badge-f2a">v1.1.0</span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* ─── Left: Source & Config ─── */}
        <div className="space-y-6 lg:col-span-1">
          {/* Source Tabs */}
          <div className="card">
            <div className="flex gap-1 rounded-lg bg-surface-100 p-1">
              {(
                [
                  { mode: "file" as SourceMode, icon: Upload, label: "파일" },
                  { mode: "url" as SourceMode, icon: Link2, label: "URL" },
                  {
                    mode: "sample" as SourceMode,
                    icon: Beaker,
                    label: "샘플",
                  },
                ] as const
              ).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setSourceMode(mode)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                    sourceMode === mode
                      ? "bg-f2a/20 text-f2a"
                      : "text-surface-500 hover:text-gray-300"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* File Source */}
            {sourceMode === "file" && (
              <div className="mt-4">
                <div
                  {...getRootProps()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all ${
                    isDragActive
                      ? "border-f2a bg-f2a/5"
                      : "border-surface-300 hover:border-f2a/50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload
                    size={32}
                    className={
                      isDragActive ? "text-f2a" : "text-surface-400"
                    }
                  />
                  <p className="mt-3 text-sm text-gray-400">
                    {isDragActive
                      ? "여기에 놓으세요"
                      : "파일을 드래그하거나 클릭하세요"}
                  </p>
                  <p className="mt-1 text-xs text-surface-500">
                    CSV, TSV, JSON, Parquet, Excel (최대 50MB)
                  </p>
                </div>

                {selectedFile && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-f2a/10 px-3 py-2 text-sm text-f2a-light">
                    <FileSpreadsheet size={16} />
                    <span className="truncate">{selectedFile.name}</span>
                    <span className="ml-auto text-xs text-surface-500">
                      {(selectedFile.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* URL Source */}
            {sourceMode === "url" && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">
                    데이터 소스
                  </label>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="URL 또는 HuggingFace dataset ID"
                    className="w-full rounded-lg border border-surface-300 bg-surface-100 px-3 py-2.5 text-sm text-gray-200 placeholder-surface-500 outline-none transition-colors focus:border-f2a/50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAnalyze();
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-surface-500">
                    예시:
                  </p>
                  {URL_EXAMPLES.map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => setUrlInput(ex.value)}
                      className="block w-full truncate rounded px-2 py-1 text-left text-xs text-surface-500 transition-colors hover:bg-surface-100 hover:text-f2a-light"
                    >
                      <span className="font-medium text-gray-400">
                        {ex.label}:
                      </span>{" "}
                      {ex.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Source */}
            {sourceMode === "sample" && (
              <div className="mt-4 space-y-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSample(s.id)}
                    disabled={loading}
                    className="flex w-full items-center gap-3 rounded-lg border border-surface-300 px-3 py-2.5 text-left transition-all hover:border-f2a/50 hover:bg-surface-100 disabled:opacity-50"
                  >
                    <Database
                      size={16}
                      className="shrink-0 text-f2a-light"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-200">
                        {s.name}
                      </p>
                      <p className="text-xs text-surface-500">{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Config */}
          <div className="card space-y-4">
            <h3 className="text-sm font-semibold text-gray-100">분석 설정</h3>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">
                프리셋
              </label>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="select-field"
              >
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.desc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">
                리포트 언어
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="select-field"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={advanced}
                onChange={(e) => setAdvanced(e.target.checked)}
                className="rounded bg-surface-200 border-surface-300"
              />
              고급 분석 포함
            </label>

            {sourceMode !== "sample" && (
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className="btn-f2a w-full"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <BarChart3 size={18} />
                )}
                분석 실행
              </button>
            )}
          </div>

          {/* Code Preview */}
          <div className="rounded-lg border border-surface-300 bg-surface-100 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-surface-500">
              <Code2 size={14} />
              Python 코드 미리보기
            </div>
            <pre className="mt-2 overflow-x-auto font-mono text-sm text-gray-400">
              <code>
                {`import f2a\n\n${preset !== "full" ? `config = f2a.AnalysisConfig.${preset === "basic_only" ? "basic_only" : preset}()\n` : ""}report = f2a.analyze(\n    "${sourceStr}"${preset !== "full" ? ",\n    config=config" : ""}\n)\nreport.to_html("output/")`}
              </code>
            </pre>
          </div>
        </div>

        {/* ─── Right: Results ─── */}
        <div className="lg:col-span-2">
          {/* Loading */}
          {loading && (
            <div className="card flex flex-col items-center justify-center py-16">
              <Loader2 size={40} className="animate-spin text-f2a" />
              <p className="mt-4 text-sm text-gray-400">
                분석을 실행 중입니다...
              </p>
              <p className="mt-1 text-xs text-surface-500">
                데이터 크기에 따라 수 초에서 수 분이 소요될 수 있습니다.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="card border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-400">
                <XCircle size={18} />
                <span className="font-medium">분석 실패</span>
              </div>
              <p className="mt-2 text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Results */}
          {response?.success && response.analysis && (
            <AnalysisResults
              analysis={response.analysis}
              filename={response.filename}
              analysisId={response.analysis_id}
              htmlAvailable={response.html_available}
            />
          )}

          {/* Empty State */}
          {!loading && !error && !response && (
            <div className="card flex flex-col items-center justify-center py-16">
              <BarChart3 size={48} className="text-surface-400" />
              <p className="mt-4 text-gray-400">
                파일을 업로드하거나 URL을 입력하세요.
              </p>
              <p className="mt-1 text-xs text-surface-500">
                분석 결과가 여기에 표시됩니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section Metadata ───

const ANALYSIS_SECTIONS: {
  key: keyof Pick<
    AnalysisResult,
    | "stats_summary"
    | "correlation_matrix"
    | "missing_info"
    | "distribution_info"
    | "outlier_summary"
    | "categorical_analysis"
    | "feature_importance"
    | "pca_summary"
    | "duplicate_stats"
    | "quality_scores"
    | "preprocessing"
    | "advanced_stats"
  >;
  label: string;
  category: "basic" | "advanced";
}[] = [
  { key: "stats_summary", label: "기술 통계", category: "basic" },
  { key: "correlation_matrix", label: "상관 분석", category: "basic" },
  { key: "distribution_info", label: "분포 분석", category: "basic" },
  { key: "missing_info", label: "결측치 분석", category: "basic" },
  { key: "outlier_summary", label: "이상치 탐지", category: "basic" },
  { key: "categorical_analysis", label: "범주형 분석", category: "basic" },
  { key: "feature_importance", label: "피처 중요도", category: "basic" },
  { key: "pca_summary", label: "PCA 분석", category: "basic" },
  { key: "duplicate_stats", label: "중복 검출", category: "basic" },
  { key: "quality_scores", label: "데이터 품질", category: "basic" },
  { key: "preprocessing", label: "전처리", category: "basic" },
  { key: "advanced_stats", label: "고급 분석", category: "advanced" },
];

// ─── Results Component ───

function AnalysisResults({
  analysis,
  filename,
  analysisId,
  htmlAvailable,
}: {
  analysis: AnalysisResult;
  filename: string;
  analysisId: string | null;
  htmlAvailable: boolean;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  function toggleSection(section: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  }

  const schema = analysis.schema_info;
  const activeSections = ANALYSIS_SECTIONS.filter((s) => {
    const val = analysis[s.key];
    return val && typeof val === "object" && Object.keys(val).length > 0;
  });

  return (
    <div className="space-y-6">
      {/* Summary + HTML Report Button */}
      <div className="card">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-100">
          <CheckCircle2 size={18} className="text-green-400" />
          분석 완료
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatBox
            label="파일"
            value={filename}
            icon={<FileSpreadsheet size={14} />}
          />
          <StatBox
            label="소요 시간"
            value={`${analysis.duration_sec.toFixed(2)}s`}
            icon={<Clock size={14} />}
          />
          <StatBox
            label="분석 모듈"
            value={`${activeSections.length}개`}
            icon={<BarChart3 size={14} />}
          />
          <StatBox
            label="행"
            value={`${(schema.n_rows || analysis.shape[0]).toLocaleString()}`}
            icon={<Rows3 size={14} />}
          />
          <StatBox
            label="열"
            value={`${schema.n_cols || analysis.shape[1]}`}
            icon={<Columns3 size={14} />}
          />
        </div>

        {schema.memory_usage_mb > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-surface-500">
            <HardDrive size={12} />
            메모리: {schema.memory_usage_mb < 1
              ? `${(schema.memory_usage_mb * 1024).toFixed(0)} KB`
              : `${schema.memory_usage_mb.toFixed(1)} MB`}
          </div>
        )}

        {htmlAvailable && analysisId && (
          <button
            onClick={() => window.open(getReportUrl(analysisId), "_blank")}
            className="btn-f2a mt-4 w-full"
          >
            <ExternalLink size={16} />
            HTML 리포트 열기 (인터랙티브)
          </button>
        )}
      </div>

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <div className="card border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-center gap-2 text-sm font-semibold text-yellow-400">
            <AlertTriangle size={16} />
            분석 경고 ({analysis.warnings.length})
          </div>
          <ul className="mt-2 space-y-1">
            {analysis.warnings.map((w, i) => (
              <li key={i} className="text-xs text-yellow-300/80">
                • {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Schema */}
      {schema.columns.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-100">데이터 스키마</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-300 text-left text-xs text-surface-500">
                  <th className="pb-2 pr-4">컬럼명</th>
                  <th className="pb-2 pr-4">타입</th>
                  <th className="pb-2 pr-4">추론 타입</th>
                  <th className="pb-2 pr-4">유니크</th>
                  <th className="pb-2 pr-4">결측</th>
                </tr>
              </thead>
              <tbody>
                {schema.columns.map((col, i) => (
                  <tr
                    key={i}
                    className="border-b border-surface-300/50 text-gray-400"
                  >
                    <td className="py-2 pr-4 font-mono text-xs text-gray-200">
                      {col.name}
                    </td>
                    <td className="py-2 pr-4 text-xs">{col.dtype || "—"}</td>
                    <td className="py-2 pr-4 text-xs">
                      <span className="rounded bg-surface-100 px-1.5 py-0.5 text-xs">
                        {col.inferred_type || "—"}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-xs">{col.n_unique ?? "—"}</td>
                    <td className="py-2 pr-4 text-xs">
                      {col.n_missing != null
                        ? `${col.n_missing} (${(col.missing_ratio * 100).toFixed(1)}%)`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analysis Sections */}
      {activeSections.length > 0 && (
        <>
          {/* Basic Sections */}
          {activeSections.filter((s) => s.category === "basic").length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                기본 분석
              </h3>
              {activeSections
                .filter((s) => s.category === "basic")
                .map((section) => (
                  <div key={section.key} className="card">
                    <button
                      onClick={() => toggleSection(section.key)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <h3 className="text-sm font-semibold text-gray-100">
                        {section.label}
                      </h3>
                      {expandedSections.has(section.key) ? (
                        <ChevronDown size={16} className="text-surface-500" />
                      ) : (
                        <ChevronRight size={16} className="text-surface-500" />
                      )}
                    </button>

                    {expandedSections.has(section.key) && (
                      <div className="mt-4">
                        <pre className="overflow-x-auto rounded-lg bg-surface-100 p-4 font-mono text-xs text-gray-400">
                          {JSON.stringify(analysis[section.key], null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Advanced Sections */}
          {activeSections.filter((s) => s.category === "advanced").length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                고급 분석
              </h3>
              {activeSections
                .filter((s) => s.category === "advanced")
                .map((section) => {
                  const data = analysis[section.key] as Record<string, any>;
                  const subKeys = Object.keys(data);

                  return (
                    <div key={section.key} className="card">
                      <button
                        onClick={() => toggleSection(section.key)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <h3 className="text-sm font-semibold text-gray-100">
                          {section.label}
                          <span className="ml-2 text-xs font-normal text-surface-500">
                            ({subKeys.length}개 모듈)
                          </span>
                        </h3>
                        {expandedSections.has(section.key) ? (
                          <ChevronDown
                            size={16}
                            className="text-surface-500"
                          />
                        ) : (
                          <ChevronRight
                            size={16}
                            className="text-surface-500"
                          />
                        )}
                      </button>

                      {expandedSections.has(section.key) && (
                        <div className="mt-4 space-y-3">
                          {subKeys.map((sk) => (
                            <div key={sk}>
                              <button
                                onClick={() =>
                                  toggleSection(`${section.key}.${sk}`)
                                }
                                className="flex w-full items-center gap-2 text-left text-xs"
                              >
                                {expandedSections.has(
                                  `${section.key}.${sk}`
                                ) ? (
                                  <ChevronDown
                                    size={12}
                                    className="text-surface-500"
                                  />
                                ) : (
                                  <ChevronRight
                                    size={12}
                                    className="text-surface-500"
                                  />
                                )}
                                <span className="font-medium capitalize text-gray-300">
                                  {sk.replace(/_/g, " ")}
                                </span>
                              </button>
                              {expandedSections.has(
                                `${section.key}.${sk}`
                              ) && (
                                <pre className="mt-2 overflow-x-auto rounded-lg bg-surface-100 p-3 font-mono text-xs text-gray-400">
                                  {JSON.stringify(data[sk], null, 2)}
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-surface-100 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-xs text-surface-500">
        {icon} {label}
      </div>
      <p className="mt-1 truncate text-sm font-medium text-gray-200">
        {value}
      </p>
    </div>
  );
}
