"""Pydantic schemas for an-web API — v0.4.1."""

from typing import Any

from pydantic import BaseModel, Field


# ─── Request ───


class NavigateRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048, description="이동할 URL")


class ExtractRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048, description="대상 URL")
    mode: str = Field("css", description="추출 모드: css | structured | json | html")
    selector: str | None = Field(None, max_length=500, description="CSS 셀렉터")
    fields: dict[str, str] | None = Field(None, description="structured 모드의 필드 매핑")


class SnapshotRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048, description="대상 URL")


class PolicyCheckRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048, description="검사할 URL")
    policy: str = Field("default", description="정책 유형: default | strict | sandboxed")
    allowed_domains: list[str] | None = Field(None, description="허용 도메인 목록 (sandboxed 모드)")


# ─── Response ───


class NavigateResponse(BaseModel):
    success: bool
    url: str
    final_url: str = ""
    title: str = ""
    page_type: str = ""
    status: str = ""
    status_code: int = 0
    redirect_count: int = 0
    dom_ready: bool = False
    scripts_executed: int = 0
    error: str | None = None


class ExtractResponse(BaseModel):
    success: bool
    url: str
    mode: str = ""
    data: Any = None
    count: int = 0
    error: str | None = None


class SnapshotResponse(BaseModel):
    success: bool
    url: str
    title: str = ""
    page_type: str = ""
    snapshot_id: str = ""
    primary_actions: list[Any] = []
    inputs: list[Any] = []
    blocking_elements: list[Any] = []
    semantic_tree: Any = None
    error: str | None = None


class PolicyCheckResponse(BaseModel):
    success: bool
    url: str
    policy: str = ""
    allowed: bool = False
    reason: str = ""
    violation_type: str | None = None
    error: str | None = None
