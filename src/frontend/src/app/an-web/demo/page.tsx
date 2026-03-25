"use client";

import { useState } from "react";
import {
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
  Play,
  Shield,
  Eye,
  FileText,
  Code,
  Copy,
  Check,
} from "lucide-react";
import {
  anwebNavigate,
  anwebExtract,
  anwebSnapshot,
  anwebPolicyCheck,
  type AnwebNavigateResponse,
  type AnwebExtractResponse,
  type AnwebSnapshotResponse,
  type AnwebPolicyCheckResponse,
} from "@/lib/api";
import { LIBRARY_META } from "@/config/libraries";
import { DemoPageHeader } from "@/components/library";

/* ─── Constants ─── */

const SAMPLE_URLS = [
  { url: "https://example.com", label: "example.com" },
  { url: "https://httpbin.org/html", label: "httpbin.org (HTML)" },
  { url: "https://jsonplaceholder.typicode.com/posts/1", label: "JSONPlaceholder API" },
];

const EXTRACT_MODES = [
  { id: "text", name: "Text", desc: "전체 텍스트 추출" },
  { id: "css", name: "CSS", desc: "CSS 셀렉터로 추출" },
  { id: "table", name: "Table", desc: "테이블 데이터 추출" },
  { id: "auto", name: "Auto", desc: "자동 감지" },
] as const;

const POLICY_TYPES = [
  { id: "default", name: "Default", desc: "기본 정책" },
  { id: "strict", name: "Strict", desc: "엄격한 제한" },
  { id: "sandboxed", name: "Sandboxed", desc: "도메인 화이트리스트" },
] as const;

type TabId = "navigate" | "snapshot" | "extract" | "policy";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "navigate", label: "Navigate", icon: <Globe size={14} /> },
  { id: "snapshot", label: "Snapshot", icon: <Eye size={14} /> },
  { id: "extract", label: "Extract", icon: <FileText size={14} /> },
  { id: "policy", label: "Policy", icon: <Shield size={14} /> },
];

const meta = LIBRARY_META.anweb;

/* ─── Main Component ─── */

export default function AnWebDemoPage() {
  const [activeTab, setActiveTab] = useState<TabId>("navigate");

  // Navigate state
  const [navUrl, setNavUrl] = useState("https://example.com");
  const [navResult, setNavResult] = useState<AnwebNavigateResponse | null>(null);
  const [navLoading, setNavLoading] = useState(false);
  const [navError, setNavError] = useState<string | null>(null);

  // Snapshot state
  const [snapUrl, setSnapUrl] = useState("https://example.com");
  const [snapResult, setSnapResult] = useState<AnwebSnapshotResponse | null>(null);
  const [snapLoading, setSnapLoading] = useState(false);
  const [snapError, setSnapError] = useState<string | null>(null);

  // Extract state
  const [extUrl, setExtUrl] = useState("https://example.com");
  const [extMode, setExtMode] = useState<string>("text");
  const [extSelector, setExtSelector] = useState("h1, h2, h3");
  const [extResult, setExtResult] = useState<AnwebExtractResponse | null>(null);
  const [extLoading, setExtLoading] = useState(false);
  const [extError, setExtError] = useState<string | null>(null);

  // Policy state
  const [polUrl, setPolUrl] = useState("https://example.com");
  const [polType, setPolType] = useState<string>("default");
  const [polDomains, setPolDomains] = useState("example.com");
  const [polResult, setPolResult] = useState<AnwebPolicyCheckResponse | null>(null);
  const [polLoading, setPolLoading] = useState(false);
  const [polError, setPolError] = useState<string | null>(null);

  // Code preview
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ── Handlers ── */

  async function handleNavigate() {
    setNavLoading(true);
    setNavError(null);
    setNavResult(null);
    try {
      const res = await anwebNavigate({ url: navUrl });
      setNavResult(res);
    } catch (e: any) {
      setNavError(e.message || "Navigation failed");
    } finally {
      setNavLoading(false);
    }
  }

  async function handleSnapshot() {
    setSnapLoading(true);
    setSnapError(null);
    setSnapResult(null);
    try {
      const res = await anwebSnapshot({ url: snapUrl });
      setSnapResult(res);
    } catch (e: any) {
      setSnapError(e.message || "Snapshot failed");
    } finally {
      setSnapLoading(false);
    }
  }

  async function handleExtract() {
    setExtLoading(true);
    setExtError(null);
    setExtResult(null);
    try {
      const res = await anwebExtract({
        url: extUrl,
        mode: extMode as any,
        selector: extMode === "css" ? extSelector : undefined,
      });
      setExtResult(res);
    } catch (e: any) {
      setExtError(e.message || "Extraction failed");
    } finally {
      setExtLoading(false);
    }
  }

  async function handlePolicy() {
    setPolLoading(true);
    setPolError(null);
    setPolResult(null);
    try {
      const res = await anwebPolicyCheck({
        url: polUrl,
        policy: polType as any,
        allowed_domains: polType === "sandboxed" ? polDomains.split(",").map((s) => s.trim()) : undefined,
      });
      setPolResult(res);
    } catch (e: any) {
      setPolError(e.message || "Policy check failed");
    } finally {
      setPolLoading(false);
    }
  }

  /* ── Code generation ── */

  function generateCode(): string {
    switch (activeTab) {
      case "navigate":
        return `from an_web import ANWebEngine

async with ANWebEngine() as engine:
    session = await engine.create_session()
    result = await session.navigate("${navUrl}")
    print(result)`;
      case "snapshot":
        return `from an_web import ANWebEngine

async with ANWebEngine() as engine:
    session = await engine.create_session()
    await session.navigate("${snapUrl}")
    snap = await session.snapshot()
    print(f"Title: {snap.title}")
    print(f"Type: {snap.page_type}")
    print(f"Actions: {snap.primary_actions}")`;
      case "extract":
        if (extMode === "css") {
          return `from an_web import ANWebEngine

async with ANWebEngine() as engine:
    session = await engine.create_session()
    await session.navigate("${extUrl}")
    result = await session.act({
        "tool": "extract",
        "query": {"mode": "css", "selector": "${extSelector}"}
    })
    print(result)`;
        }
        return `from an_web import ANWebEngine

async with ANWebEngine() as engine:
    session = await engine.create_session()
    await session.navigate("${extUrl}")
    result = await session.act({
        "tool": "extract",
        "query": {"mode": "${extMode}"}
    })
    print(result)`;
      case "policy":
        if (polType === "sandboxed") {
          return `from an_web.policy import PolicyRules, PolicyChecker

rules = PolicyRules.sandboxed(
    allowed_domains=[${polDomains
      .split(",")
      .map((s) => `"${s.trim()}"`)
      .join(", ")}]
)
checker = PolicyChecker(rules)
result = checker.check_navigate("${polUrl}")
print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason}")`;
        }
        return `from an_web.policy import PolicyRules, PolicyChecker

rules = PolicyRules.${polType}()
checker = PolicyChecker(rules)
result = checker.check_navigate("${polUrl}")
print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason}")`;
      default:
        return "";
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <DemoPageHeader
        meta={meta}
        title="an-web Interactive Demo"
        description="AI-Native 브라우저 엔진의 핵심 기능을 직접 체험하세요"
      />

      {/* ─── Tabs ─── */}
      <div className="mt-8 flex gap-1 border-b border-border pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? "bg-anweb/10 text-anweb-light border-b-2 border-anweb"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* ─── Left: Controls ─── */}
        <div className="card space-y-5">
          {/* Navigate Tab */}
          {activeTab === "navigate" && (
            <>
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Globe size={16} className="text-anweb-light" />
                Navigate — URL로 이동
              </h3>

              <div>
                <label className="text-xs text-text-muted block mb-1.5">URL</label>
                <input
                  type="url"
                  value={navUrl}
                  onChange={(e) => setNavUrl(e.target.value)}
                  className="input-field font-mono text-sm"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="text-xs text-text-muted block mb-1.5">샘플 URL</label>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_URLS.map((s) => (
                    <button
                      key={s.url}
                      onClick={() => setNavUrl(s.url)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        navUrl === s.url
                          ? "border-anweb/50 bg-anweb/10 text-anweb-light"
                          : "border-border text-text-muted hover:text-text-primary hover:border-border-hover"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNavigate}
                disabled={navLoading || !navUrl}
                className="btn-anweb w-full"
              >
                {navLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                Navigate 실행
              </button>
            </>
          )}

          {/* Snapshot Tab */}
          {activeTab === "snapshot" && (
            <>
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Eye size={16} className="text-anweb-light" />
                Snapshot — 시맨틱 스냅샷
              </h3>

              <div>
                <label className="text-xs text-text-muted block mb-1.5">URL</label>
                <input
                  type="url"
                  value={snapUrl}
                  onChange={(e) => setSnapUrl(e.target.value)}
                  className="input-field font-mono text-sm"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {SAMPLE_URLS.map((s) => (
                  <button
                    key={s.url}
                    onClick={() => setSnapUrl(s.url)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      snapUrl === s.url
                        ? "border-anweb/50 bg-anweb/10 text-anweb-light"
                        : "border-border text-text-muted hover:text-text-primary hover:border-border-hover"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSnapshot}
                disabled={snapLoading || !snapUrl}
                className="btn-anweb w-full"
              >
                {snapLoading ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                Snapshot 생성
              </button>
            </>
          )}

          {/* Extract Tab */}
          {activeTab === "extract" && (
            <>
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <FileText size={16} className="text-anweb-light" />
                Extract — 데이터 추출
              </h3>

              <div>
                <label className="text-xs text-text-muted block mb-1.5">URL</label>
                <input
                  type="url"
                  value={extUrl}
                  onChange={(e) => setExtUrl(e.target.value)}
                  className="input-field font-mono text-sm"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="text-xs text-text-muted block mb-1.5">추출 모드</label>
                <div className="grid grid-cols-2 gap-2">
                  {EXTRACT_MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setExtMode(m.id)}
                      className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors ${
                        extMode === m.id
                          ? "border-anweb/50 bg-anweb/10 text-anweb-light"
                          : "border-border text-text-muted hover:text-text-primary hover:border-border-hover"
                      }`}
                    >
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-text-muted mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {extMode === "css" && (
                <div>
                  <label className="text-xs text-text-muted block mb-1.5">CSS 셀렉터</label>
                  <input
                    type="text"
                    value={extSelector}
                    onChange={(e) => setExtSelector(e.target.value)}
                    className="input-field font-mono text-sm"
                    placeholder="h1, h2, .content"
                  />
                </div>
              )}

              <button
                onClick={handleExtract}
                disabled={extLoading || !extUrl}
                className="btn-anweb w-full"
              >
                {extLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                Extract 실행
              </button>
            </>
          )}

          {/* Policy Tab */}
          {activeTab === "policy" && (
            <>
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Shield size={16} className="text-anweb-light" />
                Policy Check — 정책 검사
              </h3>

              <div>
                <label className="text-xs text-text-muted block mb-1.5">검사할 URL</label>
                <input
                  type="url"
                  value={polUrl}
                  onChange={(e) => setPolUrl(e.target.value)}
                  className="input-field font-mono text-sm"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="text-xs text-text-muted block mb-1.5">정책 유형</label>
                <div className="grid grid-cols-3 gap-2">
                  {POLICY_TYPES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPolType(p.id)}
                      className={`text-center px-3 py-2 rounded-lg border text-xs transition-colors ${
                        polType === p.id
                          ? "border-anweb/50 bg-anweb/10 text-anweb-light"
                          : "border-border text-text-muted hover:text-text-primary hover:border-border-hover"
                      }`}
                    >
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-text-muted mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {polType === "sandboxed" && (
                <div>
                  <label className="text-xs text-text-muted block mb-1.5">
                    허용 도메인 (콤마 구분)
                  </label>
                  <input
                    type="text"
                    value={polDomains}
                    onChange={(e) => setPolDomains(e.target.value)}
                    className="input-field font-mono text-sm"
                    placeholder="example.com, api.example.com"
                  />
                </div>
              )}

              <button
                onClick={handlePolicy}
                disabled={polLoading || !polUrl}
                className="btn-anweb w-full"
              >
                {polLoading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                Policy 검사
              </button>
            </>
          )}

          {/* Code Preview */}
          <div className="border-t border-border pt-4">
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              <Code size={14} />
              {showCode ? "코드 숨기기" : "Python 코드 보기"}
            </button>
            {showCode && (
              <div className="mt-3 relative">
                <div className="code-block text-xs leading-relaxed text-text-secondary">
                  <pre className="whitespace-pre-wrap">{generateCode()}</pre>
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-bg-secondary border border-border text-text-muted hover:text-text-primary transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right: Results ─── */}
        <div className="card">
          <h3 className="text-sm font-bold text-text-primary mb-4">결과</h3>

          {/* Navigate Result */}
          {activeTab === "navigate" && (
            <>
              {navLoading && (
                <div className="flex items-center justify-center py-16 text-text-muted">
                  <Loader2 size={24} className="animate-spin mr-2" />
                  네비게이팅...
                </div>
              )}
              {navError && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <XCircle size={16} />
                  {navError}
                </div>
              )}
              {navResult && (
                <div className="space-y-3">
                  <StatusBadge success={navResult.success} />
                  <InfoRow label="URL" value={navResult.url} />
                  <InfoRow label="Title" value={navResult.title} />
                  <InfoRow label="Page Type" value={navResult.page_type} />
                  <InfoRow label="Status" value={navResult.status} />
                </div>
              )}
              {!navLoading && !navError && !navResult && <EmptyState />}
            </>
          )}

          {/* Snapshot Result */}
          {activeTab === "snapshot" && (
            <>
              {snapLoading && (
                <div className="flex items-center justify-center py-16 text-text-muted">
                  <Loader2 size={24} className="animate-spin mr-2" />
                  스냅샷 생성중...
                </div>
              )}
              {snapError && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <XCircle size={16} />
                  {snapError}
                </div>
              )}
              {snapResult && (
                <div className="space-y-3">
                  <StatusBadge success={snapResult.success} />
                  <InfoRow label="Title" value={snapResult.title} />
                  <InfoRow label="Page Type" value={snapResult.page_type} />
                  {snapResult.primary_actions?.length > 0 && (
                    <div>
                      <span className="text-xs text-text-muted">Primary Actions</span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {snapResult.primary_actions.map((a, i) => (
                          <span key={i} className="badge-anweb text-[10px]">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {snapResult.inputs?.length > 0 && (
                    <div>
                      <span className="text-xs text-text-muted">Inputs</span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {snapResult.inputs.map((inp, i) => (
                          <span key={i} className="badge bg-bg-secondary text-text-secondary border border-border text-[10px]">{inp}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {snapResult.semantic_tree && (
                    <div>
                      <span className="text-xs text-text-muted">Semantic Tree</span>
                      <div className="mt-1 code-block text-xs max-h-64 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{snapResult.semantic_tree}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {!snapLoading && !snapError && !snapResult && <EmptyState />}
            </>
          )}

          {/* Extract Result */}
          {activeTab === "extract" && (
            <>
              {extLoading && (
                <div className="flex items-center justify-center py-16 text-text-muted">
                  <Loader2 size={24} className="animate-spin mr-2" />
                  데이터 추출중...
                </div>
              )}
              {extError && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <XCircle size={16} />
                  {extError}
                </div>
              )}
              {extResult && (
                <div className="space-y-3">
                  <StatusBadge success={extResult.success} />
                  <InfoRow label="Mode" value={extResult.mode} />
                  <InfoRow label="Count" value={String(extResult.count)} />
                  <div>
                    <span className="text-xs text-text-muted">Extracted Data</span>
                    <div className="mt-1 code-block text-xs max-h-80 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">
                        {typeof extResult.data === "string"
                          ? extResult.data
                          : JSON.stringify(extResult.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
              {!extLoading && !extError && !extResult && <EmptyState />}
            </>
          )}

          {/* Policy Result */}
          {activeTab === "policy" && (
            <>
              {polLoading && (
                <div className="flex items-center justify-center py-16 text-text-muted">
                  <Loader2 size={24} className="animate-spin mr-2" />
                  정책 검사중...
                </div>
              )}
              {polError && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <XCircle size={16} />
                  {polError}
                </div>
              )}
              {polResult && (
                <div className="space-y-3">
                  <StatusBadge success={polResult.success} />
                  <InfoRow label="URL" value={polResult.url} />
                  <InfoRow label="Policy" value={polResult.policy} />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">Allowed</span>
                    <span className={`badge text-xs ${polResult.allowed ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                      {polResult.allowed ? "✓ 허용" : "✗ 차단"}
                    </span>
                  </div>
                  <InfoRow label="Reason" value={polResult.reason} />
                </div>
              )}
              {!polLoading && !polError && !polResult && <EmptyState />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatusBadge({ success }: { success: boolean }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
      success
        ? "bg-green-500/10 text-green-400 border border-green-500/20"
        : "bg-red-500/10 text-red-400 border border-red-500/20"
    }`}>
      {success ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
      {success ? "성공" : "실패"}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-text-muted">{label}</span>
      <div className="mt-0.5 text-sm text-text-primary font-mono break-all">{value}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-text-muted">
      <Globe size={32} className="mb-3 opacity-30" />
      <p className="text-sm">왼쪽에서 설정 후 실행하세요</p>
    </div>
  );
}
