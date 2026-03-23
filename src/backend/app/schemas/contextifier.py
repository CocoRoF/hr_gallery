"""Pydantic schemas for Contextifier API — v0.2.4."""

from typing import Any

from pydantic import BaseModel, Field


class ExtractionConfigSchema(BaseModel):
    """Extraction configuration — mirrors contextifier.ProcessingConfig."""

    # Chunking
    chunk_size: int = Field(1000, ge=50, le=10000, description="청크 크기 (글자 수)")
    chunk_overlap: int = Field(200, ge=0, le=2000, description="청크 오버랩")

    # Table output format
    table_format: str = Field("html", description="테이블 출력 형식: html | markdown | text")

    # Metadata
    metadata_language: str = Field("ko", description="메타데이터 언어: ko | en")

    # Tags (optional overrides)
    page_prefix: str | None = Field(None, description="페이지 태그 접두사")
    page_suffix: str | None = Field(None, description="페이지 태그 접미사")
    metadata_prefix: str | None = Field(None, description="메타데이터 태그 접두사")
    metadata_suffix: str | None = Field(None, description="메타데이터 태그 접미사")


class ExtractionResponse(BaseModel):
    """Text extraction result."""

    success: bool
    filename: str
    file_extension: str
    file_size_bytes: int
    extracted_text: str
    text_length: int
    metadata_block: str | None = None
    table_count: int = 0
    image_count: int = 0
    page_count: int = 0
    error: str | None = None


class ChunkInfo(BaseModel):
    """Single chunk metadata."""

    index: int
    text: str
    length: int


class ChunkingResponse(BaseModel):
    """Chunking result."""

    success: bool
    filename: str
    file_extension: str
    file_size_bytes: int
    extracted_text: str
    text_length: int
    chunks: list[ChunkInfo]
    chunk_count: int
    chunk_size: int
    chunk_overlap: int
    avg_chunk_length: float = 0.0
    min_chunk_length: int = 0
    max_chunk_length: int = 0
    table_format: str = "html"
    metadata_language: str = "ko"
    error: str | None = None


class SupportedFormatsResponse(BaseModel):
    """Supported file formats."""

    extensions: list[str]
    total_count: int
    categories: dict[str, list[str]]
    max_file_size_mb: int


class SampleFileSchema(BaseModel):
    """Built-in sample file info."""

    id: str
    name: str
    description: str
    extension: str
    size_kb: float
