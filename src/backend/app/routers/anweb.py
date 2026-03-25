"""an-web browser engine API router — v0.1.1."""

import logging

from fastapi import APIRouter, HTTPException

from app.schemas.anweb import (
    NavigateRequest,
    NavigateResponse,
    ExtractRequest,
    ExtractResponse,
    SnapshotRequest,
    SnapshotResponse,
    PolicyCheckRequest,
    PolicyCheckResponse,
)

logger = logging.getLogger("anweb")
router = APIRouter()


@router.post("/navigate", response_model=NavigateResponse)
async def navigate(req: NavigateRequest):
    """Navigate to a URL and return page info."""
    try:
        from an_web import ANWebEngine

        async with ANWebEngine() as engine:
            session = await engine.create_session()
            result = await session.navigate(req.url)
            snap = await session.snapshot()
            await session.close()

        return NavigateResponse(
            success=True,
            url=req.url,
            title=snap.title,
            page_type=snap.page_type,
            status=result.get("status", "ok"),
        )
    except Exception as e:
        logger.exception("navigate failed")
        return NavigateResponse(success=False, url=req.url, error=str(e))


@router.post("/snapshot", response_model=SnapshotResponse)
async def snapshot(req: SnapshotRequest):
    """Take a semantic snapshot of a page."""
    try:
        from an_web import ANWebEngine

        async with ANWebEngine() as engine:
            session = await engine.create_session()
            await session.navigate(req.url)
            snap = await session.snapshot()
            await session.close()

        return SnapshotResponse(
            success=True,
            url=req.url,
            title=snap.title,
            page_type=snap.page_type,
            primary_actions=[str(a) for a in (snap.primary_actions or [])],
            inputs=[str(i) for i in (snap.inputs or [])],
            semantic_tree=str(snap.semantic_tree) if snap.semantic_tree else "",
        )
    except Exception as e:
        logger.exception("snapshot failed")
        return SnapshotResponse(success=False, url=req.url, error=str(e))


@router.post("/extract", response_model=ExtractResponse)
async def extract(req: ExtractRequest):
    """Extract data from a page using specified mode."""
    try:
        from an_web import ANWebEngine

        async with ANWebEngine() as engine:
            session = await engine.create_session()
            await session.navigate(req.url)

            query: dict
            if req.mode == "css":
                query = {"mode": "css", "selector": req.selector or "body"}
            else:
                query = {"mode": req.mode}

            result = await session.act({"tool": "extract", "query": query})
            await session.close()

        data = result.get("data", result.get("effects", {}))
        count = len(data) if isinstance(data, list) else 1

        return ExtractResponse(
            success=True,
            url=req.url,
            mode=req.mode,
            data=data,
            count=count,
        )
    except Exception as e:
        logger.exception("extract failed")
        return ExtractResponse(success=False, url=req.url, error=str(e))


@router.post("/policy-check", response_model=PolicyCheckResponse)
async def policy_check(req: PolicyCheckRequest):
    """Check if a URL is allowed by a policy."""
    try:
        from an_web.policy import PolicyRules, PolicyChecker

        if req.policy == "strict":
            rules = PolicyRules.strict()
        elif req.policy == "sandboxed":
            domains = req.allowed_domains or []
            rules = PolicyRules.sandboxed(allowed_domains=domains)
        else:
            rules = PolicyRules.default()

        checker = PolicyChecker(rules)
        result = checker.check_navigate(req.url)

        return PolicyCheckResponse(
            success=True,
            url=req.url,
            policy=req.policy,
            allowed=result.allowed,
            reason=result.reason,
        )
    except Exception as e:
        logger.exception("policy_check failed")
        return PolicyCheckResponse(success=False, url=req.url, error=str(e))
