"""Pydantic schemas for an-web API — v0.2.1."""

from pydantic import BaseModel, Field


# ─── Request ───


class NavigateRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048, description="이동할 URL")


class ExtractRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048, description="대상 URL")
    mode: str = Field("text", description="추출 모드: text | css | table | auto")
    selector: str | None = Field(None, max_length=500, description="CSS 셀렉터 (css 모드에서 사용)")


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
    title: str = ""
    page_type: str = ""
    status: str = ""
    error: str | None = None


class ExtractResponse(BaseModel):
    success: bool
    url: str
    mode: str = ""
    data: object = None
    count: int = 0
    error: str | None = None


class SnapshotResponse(BaseModel):
    success: bool
    url: str
    title: str = ""
    page_type: str = ""
    primary_actions: list[str] = []
    inputs: list[str] = []
    semantic_tree: str = ""
    error: str | None = None


class PolicyCheckResponse(BaseModel):
    success: bool
    url: str
    policy: str = ""
    allowed: bool = False
    reason: str = ""
    error: str | None = None
