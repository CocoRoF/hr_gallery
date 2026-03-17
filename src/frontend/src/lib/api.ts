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

// ─── Googer ───

export interface SearchParams {
  query: string;
  region?: string;
  safesearch?: string;
  timelimit?: string | null;
  max_results?: number;
  page?: number;
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

export interface AnalysisResult {
  source: string;
  schema_info: Record<string, any>[];
  sections: string[];
  results: Record<string, any>;
  preprocessing: Record<string, any> | null;
  duration_sec: number;
  started_at: string;
}

export interface AnalysisResponse {
  success: boolean;
  filename: string;
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
