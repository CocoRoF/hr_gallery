const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// ─── Generic Fetch ───

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `API error: ${res.status}`);
  }

  return res.json();
}

// ─── Health / Info ───

export async function getHealth() {
  return apiFetch<{ status: string }>("/health");
}

export async function getInfo() {
  return apiFetch<{ libraries: LibraryInfo[] }>("/info");
}

export async function getLibraries() {
  return apiFetch<{ libraries: LibraryDetailInfo[] }>("/libraries");
}

export interface LibraryDetailInfo {
  name: string;
  version: string;
  description: string;
  tagline: string;
  language: string;
  license: string;
  github: string;
  pypi?: string;
  color: string;
  features: string[];
  has_demo: boolean;
  demo_path: string;
  supported_formats?: string[];
  supported_languages?: string[];
}

// ─── Googer ───

export interface SearchParams {
  query: string;
  region?: string;
  safesearch?: string;
  timelimit?: string | null;
  max_results?: number;
  page?: number;
  engine?: string;
}

export interface ImageSearchParams extends SearchParams {
  size?: string | null;
  color?: string | null;
  image_type?: string | null;
  license_type?: string | null;
}

export interface VideoSearchParams extends SearchParams {
  duration?: string | null;
}

export interface QueryBuilderParams {
  base_query: string;
  site?: string;
  filetype?: string;
  exact?: string;
  exclude?: string;
  intitle?: string;
  inurl?: string;
  intext?: string;
  or_term?: string;
  related?: string;
  date_from?: string;
  date_to?: string;
}

export interface SearchResponse {
  query: string;
  type: string;
  count: number;
  results: Record<string, any>[];
}

export interface QueryBuilderResponse {
  original: string;
  built_query: string;
  operators: Record<string, string>;
}

export interface LibraryInfo {
  name: string;
  version: string;
  description: string;
  features: string[];
  supported_formats?: string[];
  supported_languages?: string[];
}

export async function googerSearch(params: SearchParams) {
  return apiFetch<SearchResponse>("/googer/search", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function googerImages(params: ImageSearchParams) {
  return apiFetch<SearchResponse>("/googer/images", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function googerNews(params: SearchParams) {
  return apiFetch<SearchResponse>("/googer/news", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function googerVideos(params: VideoSearchParams) {
  return apiFetch<SearchResponse>("/googer/videos", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function googerQueryBuilder(params: QueryBuilderParams) {
  return apiFetch<QueryBuilderResponse>("/googer/query-builder", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

// ─── f2a ───

export interface F2aInfoResponse {
  formats: { ext: string; name: string; mime: string }[];
  max_file_size_mb: number;
  languages: { code: string; name: string }[];
  presets: { id: string; name: string; description: string }[];
}

export interface ColumnInfo {
  name: string;
  dtype: string;
  inferred_type: string;
  n_unique: number;
  n_missing: number;
  missing_ratio: number;
}

export interface SchemaInfo {
  n_rows: number;
  n_cols: number;
  memory_usage_mb: number;
  columns: ColumnInfo[];
}

export interface AnalysisResult {
  source: string;
  shape: number[];
  schema_info: SchemaInfo;
  stats_summary: Record<string, any>;
  correlation_matrix: Record<string, any>;
  outlier_summary: Record<string, any>;
  quality_scores: Record<string, any>;
  pca_summary: Record<string, any>;
  duplicate_stats: Record<string, any>;
  missing_info: Record<string, any>;
  distribution_info: Record<string, any>;
  categorical_analysis: Record<string, any>;
  feature_importance: Record<string, any>;
  preprocessing: Record<string, any>;
  advanced_stats: Record<string, any>;
  warnings: string[];
  duration_sec: number;
  started_at: string;
}

export interface AnalysisResponse {
  success: boolean;
  filename: string;
  analysis_id: string | null;
  analysis: AnalysisResult | null;
  html_available: boolean;
  error: string | null;
}

export interface SampleDataset {
  id: string;
  name: string;
  description: string;
  rows: number;
  cols: number;
  size_kb: number;
}

export async function getF2aInfo() {
  return apiFetch<F2aInfoResponse>("/f2a/info");
}

export async function analyzeFile(
  file: File,
  preset: string = "full",
  lang: string = "en",
  advanced: boolean = true
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("preset", preset);
  formData.append("lang", lang);
  formData.append("advanced", String(advanced));

  const res = await fetch(`${API_BASE}/f2a/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Analysis failed: ${res.status}`);
  }

  return (await res.json()) as AnalysisResponse;
}

export async function analyzeUrl(
  source: string,
  preset: string = "full",
  lang: string = "en",
  advanced: boolean = true
) {
  return apiFetch<AnalysisResponse>("/f2a/analyze-url", {
    method: "POST",
    body: JSON.stringify({ source, preset, lang, advanced }),
  });
}

export async function analyzeSample(
  datasetId: string,
  preset: string = "fast",
  lang: string = "en"
) {
  return apiFetch<AnalysisResponse>(
    `/f2a/analyze-sample/${datasetId}?preset=${preset}&lang=${lang}`,
    { method: "POST" }
  );
}

export async function getSampleDatasets() {
  return apiFetch<{ datasets: SampleDataset[] }>("/f2a/sample-datasets");
}

export function getReportUrl(analysisId: string) {
  return `${API_BASE}/f2a/report/${analysisId}`;
}

// ─── Contextifier ───

export interface ContextifierInfoResponse {
  extensions: string[];
  total_count: number;
  categories: Record<string, string[]>;
  max_file_size_mb: number;
}

export interface ExtractionResult {
  success: boolean;
  filename: string;
  file_extension: string;
  file_size_bytes: number;
  extracted_text: string;
  text_length: number;
  metadata_block: string | null;
  table_count: number;
  image_count: number;
  page_count: number;
  error: string | null;
}

export interface ChunkInfoItem {
  index: number;
  text: string;
  length: number;
}

export interface ChunkingResult {
  success: boolean;
  filename: string;
  file_extension: string;
  file_size_bytes: number;
  extracted_text: string;
  text_length: number;
  chunks: ChunkInfoItem[];
  chunk_count: number;
  chunk_size: number;
  chunk_overlap: number;
  avg_chunk_length: number;
  min_chunk_length: number;
  max_chunk_length: number;
  table_format: string;
  metadata_language: string;
  error: string | null;
}

export interface ContextifierSampleFile {
  id: string;
  name: string;
  description: string;
  extension: string;
  size_kb: number;
}

export async function getContextifierInfo() {
  return apiFetch<ContextifierInfoResponse>("/contextifier/info");
}

export async function contextifierExtract(
  file: File,
  tableFormat: string = "html",
  metadataLanguage: string = "ko",
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("table_format", tableFormat);
  formData.append("metadata_language", metadataLanguage);

  const res = await fetch(`${API_BASE}/contextifier/extract`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Extraction failed: ${res.status}`);
  }

  return (await res.json()) as ExtractionResult;
}

export async function contextifierExtractAndChunk(
  file: File,
  chunkSize: number = 1000,
  chunkOverlap: number = 200,
  tableFormat: string = "html",
  metadataLanguage: string = "ko",
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("chunk_size", String(chunkSize));
  formData.append("chunk_overlap", String(chunkOverlap));
  formData.append("table_format", tableFormat);
  formData.append("metadata_language", metadataLanguage);

  const res = await fetch(`${API_BASE}/contextifier/extract-and-chunk`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Extraction/chunking failed: ${res.status}`);
  }

  return (await res.json()) as ChunkingResult;
}

export async function getContextifierSamples() {
  return apiFetch<{ samples: ContextifierSampleFile[] }>("/contextifier/sample-files");
}

export async function contextifierExtractSample(
  sampleId: string,
  tableFormat: string = "html",
  metadataLanguage: string = "ko",
) {
  return apiFetch<ExtractionResult>(
    `/contextifier/extract-sample/${encodeURIComponent(sampleId)}?table_format=${tableFormat}&metadata_language=${metadataLanguage}`,
    { method: "POST" },
  );
}

export async function contextifierChunkSample(
  sampleId: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200,
  tableFormat: string = "html",
  metadataLanguage: string = "ko",
) {
  return apiFetch<ChunkingResult>(
    `/contextifier/chunk-sample/${encodeURIComponent(sampleId)}?chunk_size=${chunkSize}&chunk_overlap=${chunkOverlap}&table_format=${tableFormat}&metadata_language=${metadataLanguage}`,
    { method: "POST" },
  );
}

// ─── an-web ───

export interface AnwebNavigateParams {
  url: string;
}

export interface AnwebExtractParams {
  url: string;
  mode: "css" | "structured" | "json" | "html";
  selector?: string;
  fields?: Record<string, string>;
}

export interface AnwebSnapshotParams {
  url: string;
}

export interface AnwebPolicyCheckParams {
  url: string;
  policy: "default" | "strict" | "sandboxed";
  allowed_domains?: string[];
}

export interface AnwebNavigateResponse {
  success: boolean;
  url: string;
  final_url: string;
  title: string;
  page_type: string;
  status: string;
  status_code: number;
  redirect_count: number;
  dom_ready: boolean;
  scripts_executed: number;
  error: string | null;
}

export interface AnwebExtractResponse {
  success: boolean;
  url: string;
  mode: string;
  data: any;
  count: number;
  error: string | null;
}

export interface AnwebSnapshotResponse {
  success: boolean;
  url: string;
  title: string;
  page_type: string;
  snapshot_id: string;
  primary_actions: any[];
  inputs: any[];
  blocking_elements: any[];
  semantic_tree: any;
  error: string | null;
}

export interface AnwebPolicyCheckResponse {
  success: boolean;
  url: string;
  policy: string;
  allowed: boolean;
  reason: string;
  violation_type: string | null;
  error: string | null;
}

export async function anwebNavigate(params: AnwebNavigateParams) {
  return apiFetch<AnwebNavigateResponse>("/anweb/navigate", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function anwebExtract(params: AnwebExtractParams) {
  return apiFetch<AnwebExtractResponse>("/anweb/extract", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function anwebSnapshot(params: AnwebSnapshotParams) {
  return apiFetch<AnwebSnapshotResponse>("/anweb/snapshot", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function anwebPolicyCheck(params: AnwebPolicyCheckParams) {
  return apiFetch<AnwebPolicyCheckResponse>("/anweb/policy-check", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
