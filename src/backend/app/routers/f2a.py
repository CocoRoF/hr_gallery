"""f2a analysis API router — v1.1.0."""

import uuid
import shutil
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import HTMLResponse
import f2a as _f2a

from app.config import settings
from app.schemas.f2a import (
    AnalysisConfigSchema,
    AnalysisResponse,
    AnalysisResultSchema,
    ColumnInfoSchema,
    SchemaInfoSchema,
    SampleDatasetSchema,
    SupportedFormatsResponse,
    UrlAnalysisRequest,
)

router = APIRouter()

UPLOAD_DIR = Path(settings.f2a_upload_dir)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Bundled sample datasets directory (relative to this file → ../../samples)
SAMPLES_DIR = Path(__file__).resolve().parent.parent.parent / "samples"

ALLOWED_EXTENSIONS = {".csv", ".tsv", ".json", ".jsonl", ".parquet", ".xlsx", ".xls"}


# ─── Helpers ───


def _build_config(schema: AnalysisConfigSchema) -> _f2a.AnalysisConfig:
    """Convert API schema to f2a.AnalysisConfig (v1.1.0)."""
    if schema.preset == "minimal":
        return _f2a.AnalysisConfig.minimal()
    if schema.preset == "fast":
        return _f2a.AnalysisConfig.fast()
    if schema.preset == "basic_only":
        return _f2a.AnalysisConfig.basic_only()

    return _f2a.AnalysisConfig(
        preprocessing=schema.preprocessing,
        descriptive=schema.descriptive,
        correlation=schema.correlation,
        distribution=schema.distribution,
        outlier=schema.outlier,
        categorical=schema.categorical,
        feature_importance=schema.feature_importance,
        pca=schema.pca,
        duplicates=schema.duplicates,
        quality_score=schema.quality_score,
        visualizations=schema.visualizations,
        advanced=schema.advanced,
        advanced_distribution=schema.advanced_distribution,
        advanced_correlation=schema.advanced_correlation,
        clustering=schema.clustering,
        advanced_dimreduction=schema.advanced_dimreduction,
        feature_insights=schema.feature_insights,
        advanced_anomaly=schema.advanced_anomaly,
        statistical_tests=schema.statistical_tests,
        data_profiling=schema.data_profiling,
        insight_engine=schema.insight_engine,
        cross_analysis=schema.cross_analysis,
        column_role=schema.column_role,
        ml_readiness=schema.ml_readiness,
        outlier_threshold=schema.outlier_threshold,
        outlier_method=schema.outlier_method,
        correlation_threshold=schema.correlation_threshold,
        pca_max_components=schema.pca_max_components,
        max_categories=schema.max_categories,
        max_plot_columns=schema.max_plot_columns,
        max_cluster_k=schema.max_cluster_k,
        tsne_perplexity=schema.tsne_perplexity,
        bootstrap_iterations=schema.bootstrap_iterations,
        max_sample_for_advanced=schema.max_sample_for_advanced,
        n_distribution_fits=schema.n_distribution_fits,
    )


def _serialize(obj: object) -> object:
    """Make analysis results JSON-serializable."""
    import numpy as np
    import pandas as pd

    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        if np.isnan(obj) or np.isinf(obj):
            return None
        return float(obj)
    if isinstance(obj, np.ndarray):
        return [_serialize(v) for v in obj.tolist()]
    if isinstance(obj, pd.DataFrame):
        return {
            k: _serialize(v) for k, v in obj.to_dict(orient="records")[0].items()
        } if len(obj) == 1 else [
            {kk: _serialize(vv) for kk, vv in row.items()}
            for row in obj.to_dict(orient="records")
        ]
    if isinstance(obj, pd.Series):
        return {str(k): _serialize(v) for k, v in obj.to_dict().items()}
    if isinstance(obj, dict):
        return {str(k): _serialize(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [_serialize(v) for v in obj]
    if isinstance(obj, float) and (obj != obj or obj == float("inf") or obj == float("-inf")):
        return None
    return obj


def _extract_stats(report) -> dict:
    """Extract stats from AnalysisReport.stats into serializable dicts."""
    stats = report.stats
    result = {}

    for attr in (
        "summary", "correlation_matrix", "spearman_matrix", "cramers_v_matrix",
        "vif_table", "missing_info", "distribution_info", "outlier_summary",
        "categorical_analysis", "chi_square_matrix", "feature_importance",
        "pca_variance", "pca_loadings", "pca_summary", "duplicate_stats",
        "quality_scores", "quality_by_column", "preprocessing", "advanced_stats",
    ):
        val = getattr(stats, attr, None)
        if val is not None:
            result[attr] = _serialize(val)

    return result


def _run_analysis(
    source: str,
    source_name: str,
    analysis_id: str,
    preset: str,
    lang: str,
    advanced: bool = True,
) -> AnalysisResponse:
    """Common analysis logic shared by all endpoints."""
    config_schema = AnalysisConfigSchema(
        preset=preset if preset != "full" else None,
        advanced=advanced,
    )
    config = _build_config(config_schema)

    try:
        report = _f2a.analyze(source, config=config)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"분석 실패: {e}") from e

    # Generate HTML report into per-analysis subdirectory
    html_available = False
    try:
        html_dir = UPLOAD_DIR / analysis_id
        html_dir.mkdir(parents=True, exist_ok=True)
        report.to_html(str(html_dir))
        html_available = True
    except Exception:
        pass

    # Extract schema — v1.1.0 DataSchema
    schema = report.schema
    columns = [
        ColumnInfoSchema(
            name=c.name,
            dtype=str(c.dtype),
            inferred_type=str(c.inferred_type).split(".")[-1],
            n_unique=c.n_unique,
            n_missing=c.n_missing,
            missing_ratio=c.missing_ratio,
        )
        for c in schema.columns
    ]
    schema_info = SchemaInfoSchema(
        n_rows=schema.n_rows,
        n_cols=schema.n_cols,
        memory_usage_mb=float(schema.memory_usage_mb),
        columns=columns,
    )

    # Extract stats
    all_stats = _extract_stats(report)

    analysis_result = AnalysisResultSchema(
        source=source_name,
        shape=list(report.shape),
        schema_info=schema_info,
        stats_summary=all_stats.get("summary", {}),
        correlation_matrix=all_stats.get("correlation_matrix", {}),
        outlier_summary=all_stats.get("outlier_summary", {}),
        quality_scores=all_stats.get("quality_scores", {}),
        pca_summary=all_stats.get("pca_summary", {}),
        duplicate_stats=all_stats.get("duplicate_stats", {}),
        missing_info=all_stats.get("missing_info", {}),
        distribution_info=all_stats.get("distribution_info", {}),
        categorical_analysis=all_stats.get("categorical_analysis", {}),
        feature_importance=all_stats.get("feature_importance", {}),
        preprocessing=all_stats.get("preprocessing", {}),
        advanced_stats=all_stats.get("advanced_stats", {}),
        warnings=report.warnings,
        duration_sec=report.analysis_duration_sec,
        started_at=getattr(report, "analysis_started_at", ""),
    )

    return AnalysisResponse(
        success=True,
        filename=source_name,
        analysis_id=analysis_id,
        analysis=analysis_result,
        html_available=html_available,
    )


# ─── Info ───


@router.get("/info", response_model=SupportedFormatsResponse)
async def f2a_info():
    """f2a 지원 포맷 및 설정 정보"""
    return SupportedFormatsResponse(
        formats=[
            {"ext": ".csv", "name": "CSV", "mime": "text/csv"},
            {"ext": ".tsv", "name": "TSV", "mime": "text/tab-separated-values"},
            {"ext": ".json", "name": "JSON", "mime": "application/json"},
            {"ext": ".jsonl", "name": "JSON Lines", "mime": "application/jsonl"},
            {"ext": ".parquet", "name": "Parquet", "mime": "application/octet-stream"},
            {"ext": ".xlsx", "name": "Excel", "mime": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
        ],
        max_file_size_mb=settings.f2a_max_file_size_mb,
        languages=[
            {"code": "en", "name": "English"},
            {"code": "ko", "name": "한국어"},
            {"code": "ja", "name": "日本語"},
            {"code": "zh", "name": "中文"},
            {"code": "de", "name": "Deutsch"},
            {"code": "fr", "name": "Français"},
        ],
        presets=[
            {"id": "full", "name": "Full Analysis", "description": "23개 전체 분석 모듈 (기본 13 + 고급 10)"},
            {"id": "fast", "name": "Fast", "description": "PCA, 피처 중요도, 고급 분석 제외"},
            {"id": "basic_only", "name": "Basic Only", "description": "기본 13개 모듈만"},
            {"id": "minimal", "name": "Minimal", "description": "기술 통계만"},
        ],
    )


# ─── Upload & Analyze ───


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_file(
    file: UploadFile = File(..., description="분석할 데이터 파일"),
    preset: str = Form("full", description="분석 프리셋"),
    lang: str = Form("en", description="리포트 언어"),
    advanced: bool = Form(True, description="고급 분석 활성화"),
):
    """파일 업로드 → f2a 분석 실행 → 결과 반환"""

    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"지원하지 않는 파일 형식: {ext}. 지원: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    file.file.seek(0, 2)
    size_mb = file.file.tell() / (1024 * 1024)
    file.file.seek(0)
    if size_mb > settings.f2a_max_file_size_mb:
        raise HTTPException(
            status_code=413,
            detail=f"파일 크기 {size_mb:.1f}MB가 제한({settings.f2a_max_file_size_mb}MB)을 초과합니다.",
        )

    analysis_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{analysis_id}{ext}"

    try:
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 저장 실패: {e}") from e

    try:
        return _run_analysis(
            source=str(file_path),
            source_name=file.filename or "unknown",
            analysis_id=analysis_id,
            preset=preset,
            lang=lang,
            advanced=advanced,
        )
    except HTTPException:
        file_path.unlink(missing_ok=True)
        raise


# ─── URL / HuggingFace Analyze ───


@router.post("/analyze-url", response_model=AnalysisResponse)
async def analyze_url(req: UrlAnalysisRequest):
    """URL 또는 HuggingFace dataset ID → f2a 분석 실행 → 결과 반환"""
    analysis_id = str(uuid.uuid4())
    source_name = req.source.split("/")[-1] if "/" in req.source else req.source

    return _run_analysis(
        source=req.source,
        source_name=source_name,
        analysis_id=analysis_id,
        preset=req.preset,
        lang=req.lang,
        advanced=req.advanced,
    )


# ─── Get HTML Report ───


@router.get("/report/{analysis_id}")
async def get_report(analysis_id: str):
    """생성된 HTML 리포트 반환 (파일시스템 기반 — 재시작 후에도 동작)"""
    report_dir = UPLOAD_DIR / analysis_id
    if not report_dir.is_dir():
        raise HTTPException(status_code=404, detail="리포트를 찾을 수 없습니다.")

    html_files = sorted(report_dir.glob("*.html"))
    if not html_files:
        raise HTTPException(status_code=404, detail="리포트 파일이 존재하지 않습니다.")

    return HTMLResponse(content=html_files[0].read_text(encoding="utf-8"))


# ─── Sample Data ───


def _discover_samples() -> list[SampleDatasetSchema]:
    """Discover bundled sample CSV files from the samples/ directory."""
    if not SAMPLES_DIR.is_dir():
        return []

    meta = {
        "iris": ("Iris Dataset", "붓꽃 데이터 — 분류 분석에 적합"),
        "titanic": ("Titanic Dataset", "타이타닉 승객 데이터 — 결측치 포함"),
        "housing": ("California Housing", "캘리포니아 주택 가격 — 회귀 분석에 적합"),
    }

    samples = []
    for csv_file in sorted(SAMPLES_DIR.glob("*.csv")):
        import pandas as pd

        stem = csv_file.stem
        name, desc = meta.get(stem, (stem.replace("_", " ").title(), f"{stem} 데이터셋"))
        df = pd.read_csv(csv_file, nrows=0)
        n_cols = len(df.columns)

        # Count rows without loading full file
        with open(csv_file, encoding="utf-8") as f:
            n_rows = sum(1 for _ in f) - 1  # subtract header

        size_kb = csv_file.stat().st_size / 1024

        samples.append(SampleDatasetSchema(
            id=stem,
            name=name,
            description=f"{desc} — {n_rows:,}행 × {n_cols}열",
            rows=n_rows,
            cols=n_cols,
            size_kb=round(size_kb, 1),
        ))

    return samples


@router.get("/sample-datasets")
async def sample_datasets():
    """데모용 샘플 데이터셋 목록 (bundled CSV files)"""
    return {"datasets": [s.model_dump() for s in _discover_samples()]}


@router.post("/analyze-sample/{dataset_id}", response_model=AnalysisResponse)
async def analyze_sample(
    dataset_id: str,
    preset: str = "fast",
    lang: str = "en",
):
    """내장 샘플 데이터셋(CSV)을 분석"""
    sample_path = SAMPLES_DIR / f"{dataset_id}.csv"

    if not sample_path.is_file():
        available = [f.stem for f in SAMPLES_DIR.glob("*.csv")] if SAMPLES_DIR.is_dir() else []
        raise HTTPException(
            status_code=404,
            detail=f"샘플 데이터셋 '{dataset_id}'를 찾을 수 없습니다. 사용 가능: {available}",
        )

    analysis_id = str(uuid.uuid4())

    return _run_analysis(
        source=str(sample_path),
        source_name=f"{dataset_id}.csv",
        analysis_id=analysis_id,
        preset=preset,
        lang=lang,
    )
