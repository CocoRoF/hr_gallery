"""Pydantic schemas for f2a API."""

from pydantic import BaseModel, Field


class AnalysisConfigSchema(BaseModel):
    """Analysis configuration — mirrors f2a.AnalysisConfig."""

    # Basic modules
    descriptive: bool = True
    correlation: bool = True
    distribution: bool = True
    missing: bool = True
    outlier: bool = True
    categorical: bool = True
    feature_importance: bool = True
    pca: bool = True
    duplicates: bool = True
    quality: bool = True
    preprocessing: bool = True

    # Advanced master toggle
    advanced: bool = True

    # Advanced modules
    advanced_distribution: bool = True
    advanced_correlation: bool = True
    clustering: bool = True
    advanced_dimreduction: bool = True
    feature_insights: bool = True
    advanced_anomaly: bool = True
    statistical_tests: bool = True
    data_profiling: bool = True
    insight_engine: bool = True
    cross_analysis: bool = True
    column_role: bool = True
    ml_readiness: bool = True

    # Parameters
    outlier_threshold: float = Field(1.5, ge=0.5, le=5.0)
    outlier_method: str = Field("iqr")
    correlation_threshold: float = Field(0.9, ge=0.5, le=1.0)
    pca_max_components: int = Field(10, ge=1, le=50)
    max_categories: int = Field(50, ge=5, le=200)
    max_plot_columns: int = Field(20, ge=5, le=50)
    max_cluster_k: int = Field(10, ge=2, le=20)
    tsne_perplexity: float = Field(30.0, ge=5.0, le=100.0)
    bootstrap_iterations: int = Field(1000, ge=100, le=10000)
    max_sample_for_advanced: int = Field(5000, ge=1000, le=50000)
    n_distribution_fits: int = Field(7, ge=1, le=20)

    # Preset
    preset: str | None = Field(
        None,
        description="프리셋: 'minimal', 'fast', 'basic_only', None(full)",
    )


class UrlAnalysisRequest(BaseModel):
    """URL / HuggingFace dataset source analysis request."""

    source: str = Field(..., min_length=1, description="데이터 소스 (URL 또는 HuggingFace dataset ID)")
    preset: str = Field("full", description="분석 프리셋")
    lang: str = Field("en", description="리포트 언어")
    advanced: bool = Field(True, description="고급 분석 활성화")


class AnalysisResultSchema(BaseModel):
    source: str
    n_rows: int = 0
    n_cols: int = 0
    schema_info: list[dict] = []
    sections: list[str] = []
    results: dict = {}
    preprocessing: dict | None = None
    duration_sec: float = 0.0
    started_at: str = ""


class AnalysisResponse(BaseModel):
    success: bool
    filename: str
    analysis_id: str | None = None
    analysis: AnalysisResultSchema | None = None
    html_available: bool = False
    error: str | None = None


class SupportedFormatsResponse(BaseModel):
    formats: list[dict]
    max_file_size_mb: int
    languages: list[dict]
    presets: list[dict]
