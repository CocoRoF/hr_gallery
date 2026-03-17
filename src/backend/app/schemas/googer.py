"""Pydantic schemas for googer API."""

from pydantic import BaseModel, Field


# ─── Request ───


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="검색 쿼리")
    region: str = Field("us-en", description="검색 지역")
    safesearch: str = Field("moderate", description="세이프서치 수준 (on/moderate/off)")
    timelimit: str | None = Field(None, description="시간 제한 (d/w/m/y)")
    max_results: int = Field(10, ge=1, le=50, description="최대 결과 수")
    page: int = Field(1, ge=1, description="페이지 번호 (text only)")


class QueryBuilderRequest(BaseModel):
    base_query: str = Field(..., min_length=1, max_length=200)
    site: str | None = None
    filetype: str | None = None
    exact: str | None = None
    exclude: str | None = None
    intitle: str | None = None
    inurl: str | None = None
    date_from: str | None = None
    date_to: str | None = None


class ImageSearchRequest(SearchRequest):
    size: str | None = Field(None, description="이미지 크기 (small/medium/large/wallpaper)")
    color: str | None = Field(None, description="이미지 색상 필터")
    image_type: str | None = Field(None, description="이미지 유형 (photo/clipart/gif/transparent/line)")
    license_type: str | None = Field(None, description="라이선스 타입")


class VideoSearchRequest(SearchRequest):
    duration: str | None = Field(None, description="영상 길이 (short/medium/long)")


# ─── Response ───


class TextResultSchema(BaseModel):
    title: str
    href: str
    body: str


class ImageResultSchema(BaseModel):
    title: str
    image: str
    thumbnail: str
    url: str
    height: int
    width: int
    source: str


class NewsResultSchema(BaseModel):
    title: str
    url: str
    body: str
    source: str
    date: str
    image: str | None = None


class VideoResultSchema(BaseModel):
    title: str
    url: str
    body: str
    duration: str | None = None
    source: str
    date: str | None = None
    thumbnail: str | None = None


class SearchResponse(BaseModel):
    query: str
    type: str
    count: int
    results: list[dict]


class QueryBuilderResponse(BaseModel):
    original: str
    built_query: str
    operators: dict
