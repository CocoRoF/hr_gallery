"use client";

import { useState } from "react";
import {
  Search,
  Image,
  Newspaper,
  Video,
  Globe,
  Loader2,
  ExternalLink,
  Code2,
  Settings2,
} from "lucide-react";
import { googerSearch, googerImages, googerNews, googerVideos } from "@/lib/api";

type SearchType = "text" | "images" | "news" | "videos";

const TABS: { id: SearchType; label: string; icon: React.ReactNode }[] = [
  { id: "text", label: "웹 검색", icon: <Search size={16} /> },
  { id: "images", label: "이미지", icon: <Image size={16} /> },
  { id: "news", label: "뉴스", icon: <Newspaper size={16} /> },
  { id: "videos", label: "비디오", icon: <Video size={16} /> },
];

const REGIONS = [
  { value: "us-en", label: "US (English)" },
  { value: "kr-ko", label: "KR (한국어)" },
  { value: "jp-ja", label: "JP (日本語)" },
  { value: "gb-en", label: "UK (English)" },
  { value: "de-de", label: "DE (Deutsch)" },
  { value: "fr-fr", label: "FR (Français)" },
];

const TIME_LIMITS = [
  { value: "", label: "전체" },
  { value: "d", label: "최근 24시간" },
  { value: "w", label: "최근 1주" },
  { value: "m", label: "최근 1개월" },
  { value: "y", label: "최근 1년" },
];

export default function GoogerPage() {
  const [searchType, setSearchType] = useState<SearchType>("text");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("us-en");
  const [timelimit, setTimelimit] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, any>[] | null>(null);
  const [resultMeta, setResultMeta] = useState<{
    query: string;
    type: string;
    count: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);
    setResultMeta(null);

    const params = {
      query: query.trim(),
      region,
      timelimit: timelimit || null,
      max_results: maxResults,
    };

    try {
      let res;
      switch (searchType) {
        case "text":
          res = await googerSearch(params);
          break;
        case "images":
          res = await googerImages(params);
          break;
        case "news":
          res = await googerNews(params);
          break;
        case "videos":
          res = await googerVideos(params);
          break;
      }
      setResults(res.results);
      setResultMeta({ query: res.query, type: res.type, count: res.count });
    } catch (err: any) {
      setError(err.message || "검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-googer/15 text-googer">
          <Search size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">googer 데모</h1>
          <p className="text-sm text-gray-400">
            Google 검색을 Rust 기반으로 빠르고 안전하게 수행합니다.
          </p>
        </div>
        <span className="badge-googer ml-auto">v0.2.5</span>
      </div>

      {/* Search Tabs */}
      <div className="mt-8 flex gap-1 rounded-lg bg-surface-50 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchType(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
              searchType === tab.id
                ? "bg-googer/15 text-googer-light"
                : "text-gray-400 hover:bg-surface-200 hover:text-gray-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mt-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요..."
              className="input-field pl-10"
            />
          </div>
          <button type="submit" disabled={loading || !query.trim()} className="btn-googer">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            검색
          </button>
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-3 flex items-center gap-1.5 text-xs text-surface-500 hover:text-gray-400"
        >
          <Settings2 size={14} />
          고급 옵션 {showAdvanced ? "▲" : "▼"}
        </button>

        {showAdvanced && (
          <div className="mt-3 grid grid-cols-1 gap-4 rounded-lg border border-surface-300 bg-surface-50 p-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">
                지역
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="select-field"
              >
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">
                기간
              </label>
              <select
                value={timelimit}
                onChange={(e) => setTimelimit(e.target.value)}
                className="select-field"
              >
                {TIME_LIMITS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">
                결과 수
              </label>
              <input
                type="number"
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                min={1}
                max={50}
                className="input-field"
              />
            </div>
          </div>
        )}
      </form>

      {/* API Code Preview */}
      <div className="mt-6 rounded-lg border border-surface-300 bg-surface-100 p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-surface-500">
          <Code2 size={14} />
          Python 코드 미리보기
        </div>
        <pre className="mt-2 overflow-x-auto font-mono text-sm text-gray-400">
          <code>
            {`from googer import Googer\n\nwith Googer() as g:\n    results = g.${searchType === "text" ? "search" : searchType}("${query || "..."}"${region !== "us-en" ? `, region="${region}"` : ""}${timelimit ? `, timelimit="${timelimit}"` : ""}${maxResults !== 10 ? `, max_results=${maxResults}` : ""})\n    for r in results:\n        print(r.title)`}
          </code>
        </pre>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {resultMeta && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-100">
              검색 결과{" "}
              <span className="text-sm font-normal text-gray-400">
                ({resultMeta.count}건)
              </span>
            </h2>
            <span className="badge-googer">{resultMeta.type}</span>
          </div>

          <div className="mt-4 space-y-4">
            {results?.map((r, i) => (
              <ResultCard key={i} result={r} type={searchType} />
            ))}
            {results?.length === 0 && (
              <p className="text-center text-sm text-gray-400">
                검색 결과가 없습니다.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  result,
  type,
}: {
  result: Record<string, any>;
  type: SearchType;
}) {
  if (type === "images") {
    return (
      <div className="card-hover flex gap-4">
        {result.thumbnail && (
          <img
            src={result.thumbnail}
            alt={result.title}
            className="h-24 w-24 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-gray-100">
            {result.title}
          </h3>
          <p className="mt-1 text-xs text-surface-500">
            {result.width}×{result.height} · {result.source}
          </p>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline"
          >
            원본 보기 <ExternalLink size={10} />
          </a>
        </div>
      </div>
    );
  }

  if (type === "videos") {
    return (
      <div className="card-hover">
        <div className="flex items-start gap-4">
          {result.thumbnail && (
            <img
              src={result.thumbnail}
              alt={result.title}
              className="h-20 w-32 rounded-lg object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-100">{result.title}</h3>
            <p className="mt-1 text-sm text-gray-400 line-clamp-2">
              {result.body}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-surface-500">
              {result.duration && <span>{result.duration}</span>}
              {result.source && <span>{result.source}</span>}
              {result.date && <span>{result.date}</span>}
            </div>
          </div>
        </div>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:underline"
        >
          영상 보기 <ExternalLink size={10} />
        </a>
      </div>
    );
  }

  // text & news
  return (
    <div className="card-hover">
      <a
        href={result.href || result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <h3 className="font-medium text-accent group-hover:underline">
          {result.title}
        </h3>
      </a>
      <p className="mt-1 text-xs text-green-400/70 truncate">
        {result.href || result.url}
      </p>
      <p className="mt-2 text-sm text-gray-400 line-clamp-3">{result.body}</p>
      {type === "news" && (
        <div className="mt-2 flex items-center gap-3 text-xs text-surface-500">
          {result.source && <span>{result.source}</span>}
          {result.date && <span>{result.date}</span>}
        </div>
      )}
    </div>
  );
}
