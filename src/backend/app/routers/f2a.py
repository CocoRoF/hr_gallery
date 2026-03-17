"""f2a analysis API router."""

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
    SupportedFormatsResponse,
    UrlAnalysisRequest,
)

router = APIRouter()

UPLOAD_DIR = Path(settings.f2a_upload_dir)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".csv", ".tsv", ".json", ".jsonl", ".parquet", ".xlsx", ".xls"}


# ─── Helpers ───


def _build_config(schema: AnalysisConfigSchema) -> _f2a.AnalysisConfig:
    """Convert API schema to f2a.AnalysisConfig."""
    if schema.preset == "minimal":
        return _f2a.AnalysisConfig.minimal()
    if schema.preset == "fast":
        return _f2a.AnalysisConfig.fast()
    if schema.preset == "basic_only":
        return _f2a.AnalysisConfig.basic_only()

    return _f2a.AnalysisConfig(
        descriptive=schema.descriptive,
        correlation=schema.correlation,
        distribution=schema.distribution,
        missing=schema.missing,
        outlier=schema.outlier,
        categorical=schema.categorical,
        feature_importance=schema.feature_importance,
        pca=schema.pca,
        duplicates=schema.duplicates,
        quality=schema.quality,
        preprocessing=schema.preprocessing,
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


def _serialize_results(results: dict) -> dict:
    """Make analysis results JSON-serializable."""
    import numpy as np
    import pandas as pd

    def _convert(obj):
        if isinstance(obj, (np.integer,)):
            return int(obj)
        if isinstance(obj, (np.floating,)):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, pd.DataFrame):
            return obj.to_dict(orient="records")
        if isinstance(obj, pd.Series):
            return obj.to_dict()
        if isinstance(obj, dict):
            return {k: _convert(v) for k, v in obj.items()}
        if isinstance(obj, (list, tuple)):
            return [_convert(v) for v in obj]
        return obj

    return _convert(results)


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
        raise HTTPException(status_code=422, detail=f"분석 실패: {e}")

    # Generate HTML report into per-analysis subdirectory (survives restart)
    html_available = False
    try:
        html_dir = UPLOAD_DIR / analysis_id
        html_dir.mkdir(parents=True, exist_ok=True)
        report.to_html(str(html_dir), lang=lang)
        html_available = True
    except Exception:
        pass

    # Extract schema
    schema_dict = report.schema if isinstance(report.schema, dict) else {}
    columns = schema_dict.get("columns", []) if isinstance(schema_dict, dict) else []

    serialized_results = _serialize_results(report.results)

    analysis_result = AnalysisResultSchema(
        source=source_name,
        n_rows=schema_dict.get("n_rows", 0),
        n_cols=schema_dict.get("n_cols", 0),
        schema_info=columns,
        sections=report.sections,
        results=serialized_results,
        preprocessing=report.preprocessing,
        duration_sec=report.analysis_duration_sec,
        started_at=report.analysis_started_at,
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
            {"id": "full", "name": "Full Analysis", "description": "21개 전체 분석 모듈"},
            {"id": "fast", "name": "Fast", "description": "PCA, 피처 중요도, 고급 분석 제외"},
            {"id": "basic_only", "name": "Basic Only", "description": "기본 10개 모듈만"},
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
        raise HTTPException(status_code=500, detail=f"파일 저장 실패: {e}")

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


@router.get("/sample-datasets")
async def sample_datasets():
    """데모용 샘플 데이터셋 목록"""
    return {
        "datasets": [
            {
                "id": "iris",
                "name": "Iris Dataset",
                "description": "붓꽃 데이터 — 150행 × 5열 (분류)",
                "rows": 150,
                "cols": 5,
                "size_kb": 4,
            },
            {
                "id": "titanic",
                "name": "Titanic Dataset",
                "description": "타이타닉 승객 데이터 — 891행 × 12열 (결측치 포함)",
                "rows": 891,
                "cols": 12,
                "size_kb": 60,
            },
            {
                "id": "housing",
                "name": "Boston Housing",
                "description": "보스턴 주택 가격 — 506행 × 14열 (회귀)",
                "rows": 506,
                "cols": 14,
                "size_kb": 35,
            },
        ]
    }


@router.post("/analyze-sample/{dataset_id}", response_model=AnalysisResponse)
async def analyze_sample(
    dataset_id: str,
    preset: str = "fast",
    lang: str = "en",
):
    """내장 샘플 데이터셋을 분석"""
    import pandas as pd
    from sklearn.datasets import load_iris

    sample_generators = {
        "iris": lambda: pd.DataFrame(
            data=load_iris().data,
            columns=load_iris().feature_names,
        ).assign(species=[load_iris().target_names[t] for t in load_iris().target]),
    }

    if dataset_id not in sample_generators:
        raise HTTPException(status_code=404, detail=f"샘플 데이터셋 '{dataset_id}'를 찾을 수 없습니다.")

    analysis_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{analysis_id}.csv"

    try:
        df = sample_generators[dataset_id]()
        df.to_csv(file_path, index=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"샘플 생성 실패: {e}")

    try:
        return _run_analysis(
            source=str(file_path),
            source_name=f"{dataset_id}.csv",
            analysis_id=analysis_id,
            preset=preset,
            lang=lang,
        )
    except HTTPException:
        file_path.unlink(missing_ok=True)
        raise
