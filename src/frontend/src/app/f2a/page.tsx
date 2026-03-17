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
} from "lucide-react";
import {
  analyzeFile,
  analyzeSample,
  type AnalysisResult,
  type AnalysisResponse,
} from "@/lib/api";

const PRESETS = [
  { id: "full", name: "Full Analysis", desc: "21개 전체 분석 모듈" },
  { id: "fast", name: "Fast", desc: "PCA, 피처 중요도, 고급 분석 제외" },
  { id: "basic_only", name: "Basic Only", desc: "기본 10개 모듈만" },
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
    desc: "붓꽃 데이터 — 150행 × 5열",
    rows: 150,
    cols: 5,
  },
  {
    id: "titanic",
    name: "Titanic Dataset",
    desc: "타이타닉 승객 — 891행 × 12열",
    rows: 891,
    cols: 12,
  },
  {
    id: "housing",
    name: "Boston Housing",
    desc: "주택 가격 — 506행 × 14열",
    rows: 506,
    cols: 14,
  },
];

export default function F2aPage() {
  const [preset, setPreset] = useState("fast");
  const [lang, setLang] = useState("en");
  const [advanced, setAdvanced] = useState(true);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((files: File[]) => {
    if (files.length > 0) setSelectedFile(files[0]);
  }, []);

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

  async function handleAnalyze() {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await analyzeFile(selectedFile, preset, lang, advanced);
      setResponse(res);
    } catch (err: any) {
      setError(err.message || "분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSample(sampleId: string) {
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-f2a/15 text-f2a">
          <BarChart3 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">f2a 데모</h1>
          <p className="text-sm text-gray-400">
            파일을 업로드하면 자동으로 21가지 통계 분석을 수행합니다.
          </p>
        </div>
        <span className="badge-f2a ml-auto">v1.0.3</span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left: Upload & Config */}
        <div className="space-y-6 lg:col-span-1">
          {/* File Drop Zone */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-100">
              파일 업로드
            </h3>
            <div
              {...getRootProps()}
              className={`mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all ${
                isDragActive
                  ? "border-f2a bg-f2a/5"
                  : "border-surface-300 hover:border-f2a/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload
                size={32}
                className={isDragActive ? "text-f2a" : "text-surface-400"}
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

            <button
              onClick={handleAnalyze}
              disabled={loading || !selectedFile}
              className="btn-f2a w-full"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <BarChart3 size={18} />
              )}
              분석 실행
            </button>
          </div>

          {/* Sample Datasets */}
          <div className="card">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-100">
              <Beaker size={16} />
              샘플 데이터셋
            </h3>
            <div className="mt-3 space-y-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSample(s.id)}
                  disabled={loading}
                  className="flex w-full items-center gap-3 rounded-lg border border-surface-300 px-3 py-2.5 text-left transition-all hover:border-f2a/50 hover:bg-surface-100 disabled:opacity-50"
                >
                  <Database size={16} className="shrink-0 text-f2a-light" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-200">
                      {s.name}
                    </p>
                    <p className="text-xs text-surface-500">{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Code Preview */}
          <div className="rounded-lg border border-surface-300 bg-surface-100 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-surface-500">
              <Code2 size={14} />
              Python 코드 미리보기
            </div>
            <pre className="mt-2 overflow-x-auto font-mono text-sm text-gray-400">
              <code>
                {`import f2a\n\n${preset !== "full" ? `config = f2a.AnalysisConfig.${preset === "basic_only" ? "basic_only" : preset}()\n` : ""}report = f2a.analyze(\n    "${selectedFile?.name || "data.csv"}"${preset !== "full" ? ",\n    config=config" : ""}\n)\nreport.to_html("output/", lang="${lang}")`}
              </code>
            </pre>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2">
          {/* Loading */}
          {loading && (
            <div className="card flex flex-col items-center justify-center py-16">
              <Loader2 size={40} className="animate-spin text-f2a" />
              <p className="mt-4 text-sm text-gray-400">
                분석을 실행 중입니다...
              </p>
              <p className="mt-1 text-xs text-surface-500">
                파일 크기에 따라 수 초에서 수 분이 소요될 수 있습니다.
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
                파일을 업로드하거나 샘플 데이터를 선택하세요.
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

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="card">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-100">
          <CheckCircle2 size={18} className="text-green-400" />
          분석 완료
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
            value={`${analysis.sections.length}개`}
            icon={<BarChart3 size={14} />}
          />
          <StatBox
            label="컬럼 수"
            value={`${analysis.schema_info.length}개`}
            icon={<Database size={14} />}
          />
        </div>

        {htmlAvailable && analysisId && (
          <button
            onClick={() => {
              const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api";
              window.open(`${apiBase}/f2a/report/${analysisId}`, "_blank");
            }}
            className="btn-f2a mt-4 w-full"
          >
            <ExternalLink size={16} />
            HTML 리포트 보기
          </button>
        )}
      </div>

      {/* Schema */}
      {analysis.schema_info.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-100">데이터 스키마</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-300 text-left text-xs text-surface-500">
                  <th className="pb-2 pr-4">컬럼명</th>
                  <th className="pb-2 pr-4">타입</th>
                  <th className="pb-2 pr-4">유니크</th>
                  <th className="pb-2 pr-4">결측</th>
                </tr>
              </thead>
              <tbody>
                {analysis.schema_info.map((col: any, i: number) => (
                  <tr
                    key={i}
                    className="border-b border-surface-300/50 text-gray-400"
                  >
                    <td className="py-2 pr-4 font-mono text-xs text-gray-200">
                      {col.name}
                    </td>
                    <td className="py-2 pr-4 text-xs">{col.inferred_type || col.dtype}</td>
                    <td className="py-2 pr-4 text-xs">{col.n_unique ?? "—"}</td>
                    <td className="py-2 pr-4 text-xs">
                      {col.n_missing != null
                        ? `${col.n_missing} (${((col.missing_ratio ?? 0) * 100).toFixed(1)}%)`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sections */}
      {analysis.sections.map((section) => (
        <div key={section} className="card">
          <button
            onClick={() => toggleSection(section)}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="text-sm font-semibold text-gray-100 capitalize">
              {section.replace(/_/g, " ")}
            </h3>
            {expandedSections.has(section) ? (
              <ChevronDown size={16} className="text-surface-500" />
            ) : (
              <ChevronRight size={16} className="text-surface-500" />
            )}
          </button>

          {expandedSections.has(section) && analysis.results[section] && (
            <div className="mt-4">
              <pre className="overflow-x-auto rounded-lg bg-surface-100 p-4 font-mono text-xs text-gray-400">
                {JSON.stringify(analysis.results[section], null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
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
