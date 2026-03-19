"""googer search API router — v0.7.0."""

from fastapi import APIRouter, HTTPException
from googer import Googer, Query
from googer.exceptions import GoogerException, NoResultsException

from app.config import settings
from app.schemas.googer import (
    SearchRequest,
    ImageSearchRequest,
    VideoSearchRequest,
    QueryBuilderRequest,
    SearchResponse,
    QueryBuilderResponse,
    VALID_ENGINES,
)

router = APIRouter()


def _get_client(engine: str | None = None) -> Googer:
    kwargs: dict = dict(timeout=settings.googer_timeout, max_retries=settings.googer_max_retries)
    if engine and engine in VALID_ENGINES:
        kwargs["engine"] = engine
    return Googer(**kwargs)


def _empty_response(query: str, search_type: str) -> SearchResponse:
    """NoResultsException 발생 시 빈 결과 반환."""
    return SearchResponse(query=query, type=search_type, count=0, results=[])


# ─── Text Search ───


@router.post("/search", response_model=SearchResponse)
async def text_search(req: SearchRequest):
    """웹 텍스트 검색 — googer.search()"""
    try:
        with _get_client(req.engine) as g:
            results = g.search(
                req.query,
                region=req.region,
                safesearch=req.safesearch,
                timelimit=req.timelimit,
                max_results=req.max_results,
                page=req.page,
            )
        return SearchResponse(
            query=req.query,
            type="text",
            count=len(results),
            results=[r.to_dict() for r in results],
        )
    except NoResultsException:
        return _empty_response(req.query, "text")
    except GoogerException as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


# ─── Image Search ───


@router.post("/images", response_model=SearchResponse)
async def image_search(req: ImageSearchRequest):
    """이미지 검색 — googer.images()"""
    try:
        with _get_client(req.engine) as g:
            results = g.images(
                req.query,
                region=req.region,
                safesearch=req.safesearch,
                timelimit=req.timelimit,
                max_results=req.max_results,
                size=req.size,
                color=req.color,
                image_type=req.image_type,
                license_type=req.license_type,
            )
        return SearchResponse(
            query=req.query,
            type="images",
            count=len(results),
            results=[r.to_dict() for r in results],
        )
    except NoResultsException:
        return _empty_response(req.query, "images")
    except GoogerException as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


# ─── News Search ───


@router.post("/news", response_model=SearchResponse)
async def news_search(req: SearchRequest):
    """뉴스 검색 — googer.news()"""
    try:
        with _get_client(req.engine) as g:
            results = g.news(
                req.query,
                region=req.region,
                safesearch=req.safesearch,
                timelimit=req.timelimit,
                max_results=req.max_results,
            )
        return SearchResponse(
            query=req.query,
            type="news",
            count=len(results),
            results=[r.to_dict() for r in results],
        )
    except NoResultsException:
        return _empty_response(req.query, "news")
    except GoogerException as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


# ─── Video Search ───


@router.post("/videos", response_model=SearchResponse)
async def video_search(req: VideoSearchRequest):
    """비디오 검색 — googer.videos()"""
    try:
        with _get_client(req.engine) as g:
            results = g.videos(
                req.query,
                region=req.region,
                safesearch=req.safesearch,
                timelimit=req.timelimit,
                max_results=req.max_results,
                duration=req.duration,
            )
        return SearchResponse(
            query=req.query,
            type="videos",
            count=len(results),
            results=[r.to_dict() for r in results],
        )
    except NoResultsException:
        return _empty_response(req.query, "videos")
    except GoogerException as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


# ─── Query Builder ───


@router.post("/query-builder", response_model=QueryBuilderResponse)
async def query_builder(req: QueryBuilderRequest):
    """Google 고급 검색 쿼리 빌더 — googer.Query()"""
    q = Query(req.base_query)
    operators: dict = {}

    if req.site:
        q = q.site(req.site)
        operators["site"] = req.site
    if req.filetype:
        q = q.filetype(req.filetype)
        operators["filetype"] = req.filetype
    if req.exact:
        q = q.exact(req.exact)
        operators["exact"] = req.exact
    if req.exclude:
        q = q.exclude(req.exclude)
        operators["exclude"] = req.exclude
    if req.intitle:
        q = q.intitle(req.intitle)
        operators["intitle"] = req.intitle
    if req.inurl:
        q = q.inurl(req.inurl)
        operators["inurl"] = req.inurl
    if req.intext:
        q = q.intext(req.intext)
        operators["intext"] = req.intext
    if req.or_term:
        q = q.or_term(req.or_term)
        operators["or_term"] = req.or_term
    if req.related:
        q = q.related(req.related)
        operators["related"] = req.related
    if req.date_from and req.date_to:
        q = q.date_range(req.date_from, req.date_to)
        operators["date_range"] = f"{req.date_from} ~ {req.date_to}"

    return QueryBuilderResponse(
        original=req.base_query,
        built_query=str(q),
        operators=operators,
    )
