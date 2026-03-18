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
  Wrench,
  AlertCircle,
  ArrowLeft,
  Github,
  Package,
} from "lucide-react";
import {
  googerSearch,
  googerImages,
  googerNews,
  googerVideos,
  googerQueryBuilder,
} from "@/lib/api";

type SearchType = "text" | "images" | "news" | "videos";

const TABS: { id: SearchType; label: string; icon: React.ReactNode }[] = [
  { id: "text", label: "웹 검색", icon: <Search size={16} /> },
  { id: "images", label: "이미지", icon: <Image size={16} /> },
  { id: "news", label: "뉴스", icon: <Newspaper size={16} /> },
  { id: "videos", label: "비디오", icon: <Video size={16} /> },
];

const REGIONS = [
  { value: "us-en", label: "US (English)" },
  { value: "ko-kr", label: "KR (한국어)" },
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

const SAFESEARCH_OPTIONS = [
  { value: "moderate", label: "보통" },
  { value: "on", label: "켜기" },
  { value: "off", label: "끄기" },
];

const IMAGE_SIZES = [
  { value: "", label: "전체" },
  { value: "large", label: "Large" },
  { value: "medium", label: "Medium" },
  { value: "icon", label: "Icon" },
];

const IMAGE_COLORS = [
  { value: "", label: "전체" },
  { value: "color", label: "컬러" },
  { value: "gray", label: "흑백" },
  { value: "mono", label: "모노" },
  { value: "trans", label: "투명" },
];

const IMAGE_TYPES = [
  { value: "", label: "전체" },
  { value: "face", label: "얼굴" },
  { value: "photo", label: "사진" },
  { value: "clipart", label: "클립아트" },
  { value: "lineart", label: "라인아트" },
  { value: "animated", label: "애니메이션" },
];

const VIDEO_DURATIONS = [
  { value: "", label: "전체" },
  { value: "short", label: "짧은 영상 (<4분)" },
  { value: "medium", label: "보통 (4-20분)" },
  { value: "long", label: "긴 영상 (>20분)" },
];

export default function GoogerPage() {
  const [searchType, setSearchType] = useState<SearchType>("text");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("us-en");
  const [safesearch, setSafesearch] = useState("moderate");
  const [timelimit, setTimelimit] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showQueryBuilder, setShowQueryBuilder] = useState(false);

  // Image-specific
  const [imageSize, setImageSize] = useState("");
  const [imageColor, setImageColor] = useState("");
  const [imageType, setImageType] = useState("");

  // Video-specific
  const [videoDuration, setVideoDuration] = useState("");

  // Query Builder
  const [qbSite, setQbSite] = useState("");
  const [qbFiletype, setQbFiletype] = useState("");
  const [qbExact, setQbExact] = useState("");
  const [qbExclude, setQbExclude] = useState("");
  const [qbIntitle, setQbIntitle] = useState("");
  const [qbInurl, setQbInurl] = useState("");
  const [qbIntext, setQbIntext] = useState("");
  const [qbOrTerm, setQbOrTerm] = useState("");
  const [qbRelated, setQbRelated] = useState("");
  const [qbDateFrom, setQbDateFrom] = useState("");
  const [qbDateTo, setQbDateTo] = useState("");
  const [builtQuery, setBuiltQuery] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, any>[] | null>(null);
  const [resultMeta, setResultMeta] = useState<{
    query: string;
    type: string;
    count: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasQueryBuilderOperators =
    qbSite || qbFiletype || qbExact || qbExclude || qbIntitle || qbInurl ||
    qbIntext || qbOrTerm || qbRelated || (qbDateFrom && qbDateTo);

  async function handleBuildQuery() {
    if (!query.trim()) return;
    try {
      const res = await googerQueryBuilder({
        base_query: query.trim(),
        site: qbSite || undefined,
        filetype: qbFiletype || undefined,
        exact: qbExact || undefined,
        exclude: qbExclude || undefined,
        intitle: qbIntitle || undefined,
        inurl: qbInurl || undefined,
        intext: qbIntext || undefined,
        or_term: qbOrTerm || undefined,
        related: qbRelated || undefined,
        date_from: qbDateFrom || undefined,
        date_to: qbDateTo || undefined,
      });
      setBuiltQuery(res.built_query);
    } catch {
      setBuiltQuery(null);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);
    setResultMeta(null);

    const baseParams = {
      query: query.trim(),
      region,
      safesearch,
      timelimit: timelimit || null,
      max_results: maxResults,
    };

    try {
      let res;
      switch (searchType) {
        case "text":
          res = await googerSearch(baseParams);
          break;
        case "images":
          res = await googerImages({
            ...baseParams,
            size: imageSize || null,
            color: imageColor || null,
            image_type: imageType || null,
          });
          break;
        case "news":
          res = await googerNews(baseParams);
          break;
        case "videos":
          res = await googerVideos({
            ...baseParams,
            duration: videoDuration || null,
          });
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

  function getCodePreview(): string {
    const methodName = searchType === "text" ? "search" : searchType;
    const args: string[] = [`"${query || "..."}"`];
    if (region !== "us-en") args.push(`region="${region}"`);
    if (safesearch !== "moderate") args.push(`safesearch="${safesearch}"`);
    if (timelimit) args.push(`timelimit="${timelimit}"`);
    if (maxResults !== 10) args.push(`max_results=${maxResults}`);

    if (searchType === "images") {
      if (imageSize) args.push(`size="${imageSize}"`);
      if (imageColor) args.push(`color="${imageColor}"`);
      if (imageType) args.push(`image_type="${imageType}"`);
    }
    if (searchType === "videos" && videoDuration) {
      args.push(`duration="${videoDuration}"`);
    }

    let code = `from googer import Googer\n\n`;

    if (hasQueryBuilderOperators) {
      code += `from googer import Query\n\n`;
      const qbParts = [`Query("${query || "..."}")`,];
      if (qbExact) qbParts.push(`.exact("${qbExact}")`);
      if (qbSite) qbParts.push(`.site("${qbSite}")`);
      if (qbFiletype) qbParts.push(`.filetype("${qbFiletype}")`);
      if (qbExclude) qbParts.push(`.exclude("${qbExclude}")`);
      if (qbIntitle) qbParts.push(`.intitle("${qbIntitle}")`);
      if (qbInurl) qbParts.push(`.inurl("${qbInurl}")`);
      if (qbIntext) qbParts.push(`.intext("${qbIntext}")`);
      if (qbOrTerm) qbParts.push(`.or_term("${qbOrTerm}")`);
      if (qbRelated) qbParts.push(`.related("${qbRelated}")`);
      if (qbDateFrom && qbDateTo) qbParts.push(`.date_range("${qbDateFrom}", "${qbDateTo}")`);

      code += `q = (\n    ${qbParts.join("\n    ")}\n)\n\n`;
      code += `with Googer() as g:\n    results = g.${methodName}(q`;
      const extraArgs = args.slice(1);
      if (extraArgs.length) code += `, ${extraArgs.join(", ")}`;
      code += `)`;
    } else {
      code += `with Googer() as g:\n    results = g.${methodName}(${args.join(", ")})`;
    }

    code += `\n    for r in results:\n        print(r.title)`;
    return code;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Link */}
      <a href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-gray-300 transition-colors">
        <ArrowLeft size={16} />
        갤러리로 돌아가기
      </a>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-googer/15 text-googer">
          <Search size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">googer 데모</h1>
          <p className="text-sm text-gray-400">
            primp + lxml 기반의 빠르고 안전한 Google 검색 라이브러리
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="https://github.com/CocoRoF/googer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-300 px-3 py-1.5 text-xs text-gray-400 hover:border-googer/50 hover:text-googer-light transition-colors"
          >
            <Github size={14} /> GitHub
          </a>
          <a
            href="https://pypi.org/project/googer/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-300 px-3 py-1.5 text-xs text-gray-400 hover:border-googer/50 hover:text-googer-light transition-colors"
          >
            <Package size={14} /> PyPI
          </a>
          <span className="badge-googer">v0.4.0</span>
        </div>
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

        {/* Toggle buttons */}
        <div className="mt-3 flex gap-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-gray-400"
          >
            <Settings2 size={14} />
            고급 옵션 {showAdvanced ? "▲" : "▼"}
          </button>
          <button
            type="button"
            onClick={() => setShowQueryBuilder(!showQueryBuilder)}
            className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-gray-400"
          >
            <Wrench size={14} />
            Query Builder {showQueryBuilder ? "▲" : "▼"}
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="mt-3 grid grid-cols-1 gap-4 rounded-lg border border-surface-300 bg-surface-50 p-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">지역</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="select-field">
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">기간</label>
              <select value={timelimit} onChange={(e) => setTimelimit(e.target.value)} className="select-field">
                {TIME_LIMITS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">세이프서치</label>
              <select value={safesearch} onChange={(e) => setSafesearch(e.target.value)} className="select-field">
                {SAFESEARCH_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">결과 수</label>
              <input
                type="number"
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                min={1}
                max={50}
                className="input-field"
              />
            </div>

            {/* Image-specific options */}
            {searchType === "images" && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">이미지 크기</label>
                  <select value={imageSize} onChange={(e) => setImageSize(e.target.value)} className="select-field">
                    {IMAGE_SIZES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">색상</label>
                  <select value={imageColor} onChange={(e) => setImageColor(e.target.value)} className="select-field">
                    {IMAGE_COLORS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">유형</label>
                  <select value={imageType} onChange={(e) => setImageType(e.target.value)} className="select-field">
                    {IMAGE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Video-specific options */}
            {searchType === "videos" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">영상 길이</label>
                <select value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} className="select-field">
                  {VIDEO_DURATIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Query Builder Panel */}
        {showQueryBuilder && (
          <div className="mt-3 rounded-lg border border-surface-300 bg-surface-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Google 고급 검색 연산자</h3>
              <button
                type="button"
                onClick={handleBuildQuery}
                disabled={!query.trim()}
                className="rounded-md bg-googer/20 px-3 py-1.5 text-xs font-medium text-googer-light hover:bg-googer/30 disabled:opacity-50"
              >
                쿼리 빌드
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <QbField label="site:" value={qbSite} onChange={setQbSite} placeholder="arxiv.org" />
              <QbField label="filetype:" value={qbFiletype} onChange={setQbFiletype} placeholder="pdf" />
              <QbField label='exact ""' value={qbExact} onChange={setQbExact} placeholder="정확히 일치하는 구문" />
              <QbField label="exclude -" value={qbExclude} onChange={setQbExclude} placeholder="제외할 단어" />
              <QbField label="intitle:" value={qbIntitle} onChange={setQbIntitle} placeholder="제목에 포함될 텍스트" />
              <QbField label="inurl:" value={qbInurl} onChange={setQbInurl} placeholder="URL에 포함될 텍스트" />
              <QbField label="intext:" value={qbIntext} onChange={setQbIntext} placeholder="본문에 포함될 텍스트" />
              <QbField label="OR" value={qbOrTerm} onChange={setQbOrTerm} placeholder="대안 검색어" />
              <QbField label="related:" value={qbRelated} onChange={setQbRelated} placeholder="관련 사이트 URL" />
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="mb-1 block text-xs font-medium text-gray-500">date_range</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={qbDateFrom}
                    onChange={(e) => setQbDateFrom(e.target.value)}
                    className="input-field flex-1 text-xs"
                  />
                  <span className="flex items-center text-xs text-gray-500">~</span>
                  <input
                    type="date"
                    value={qbDateTo}
                    onChange={(e) => setQbDateTo(e.target.value)}
                    className="input-field flex-1 text-xs"
                  />
                </div>
              </div>
            </div>
            {builtQuery && (
              <div className="mt-3 rounded-md bg-surface-200 p-2">
                <p className="text-xs text-gray-500">빌드된 쿼리:</p>
                <p className="mt-1 font-mono text-sm text-googer-light">{builtQuery}</p>
              </div>
            )}
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
          <code>{getCodePreview()}</code>
        </pre>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">검색 오류</p>
            <p className="mt-1">{error}</p>
          </div>
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
            {results && results.length > 0 ? (
              results.map((r, i) => (
                <ResultCard key={i} result={r} type={searchType} />
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-surface-300 bg-surface-50 py-12 text-center">
                <Search size={32} className="text-surface-500" />
                <p className="text-sm text-gray-400">검색 결과가 없습니다.</p>
                <p className="text-xs text-surface-500">
                  다른 검색어나 옵션으로 다시 시도해보세요.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Query Builder Field Component ─── */

function QbField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field text-xs"
      />
    </div>
  );
}

/* ─── Result Card Component ─── */

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
            {result.width && result.height ? `${result.width}×${result.height}` : ""}{result.source ? ` · ${result.source}` : ""}
          </p>
          <a
            href={result.image || result.url}
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
          {result.image && (
            <img
              src={result.image}
              alt=""
              className="ml-auto h-12 w-16 rounded object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
}
