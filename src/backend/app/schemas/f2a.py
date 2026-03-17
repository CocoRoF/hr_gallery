"""Pydantic schemas for f2a API."""

from pydantic import BaseModel, Field


class AnalysisConfigSchema(BaseModel):
    """Analysis configuration — mirrors f2a.AnalysisConfig."""

    # Basic analyses
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

    # Advanced master toggle
    advanced: bool = True

    # Parameters
    outlier_threshold: float = Field(1.5, ge=0.5, le=5.0)
    correlation_threshold: float = Field(0.9, ge=0.5, le=1.0)
    pca_max_components: int = Field(10, ge=1, le=50)
    max_categories: int = Field(50, ge=5, le=200)

    # Preset
    preset: str | None = Field(
        None,
        description="프리셋: 'minimal', 'fast', 'basic_only', None(full)",
    )


class AnalysisRequest(BaseModel):
    config: AnalysisConfigSchema = Field(default_factory=AnalysisConfigSchema)
    lang: str = Field("en", description="리포트 언어 (en/ko/ja/zh/de/fr)")


class AnalysisResultSchema(BaseModel):
    source: str
    schema_info: list[dict]
    sections: list[str]
    results: dict
    preprocessing: dict | None = None
    duration_sec: float
    started_at: str


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
