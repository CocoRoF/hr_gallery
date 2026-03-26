"""an-web browser engine API router — v0.4.1."""

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
    """Navigate to a URL and return page semantics."""
    try:
        from an_web import ANWebEngine

        async with ANWebEngine() as engine:
            session = await engine.create_session()
            result = await session.navigate(req.url)
            snap = await session.snapshot()
            await session.close()

        effects = result.get("effects", {})

        return NavigateResponse(
            success=True,
            url=req.url,
            final_url=effects.get("final_url", req.url),
            title=snap.title,
            page_type=snap.page_type,
            status=result.get("status", "ok"),
            status_code=effects.get("status_code", 0),
            redirect_count=effects.get("redirect_count", 0),
            dom_ready=effects.get("dom_ready", False),
            scripts_executed=effects.get("scripts_executed", 0),
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

        # Serialize primary_actions and inputs as structured dicts
        primary_actions = []
        for a in (snap.primary_actions or []):
            if isinstance(a, dict):
                primary_actions.append(a)
            elif hasattr(a, "to_dict"):
                primary_actions.append(a.to_dict())
            else:
                primary_actions.append({"text": str(a)})

        inputs = []
        for i in (snap.inputs or []):
            if isinstance(i, dict):
                inputs.append(i)
            elif hasattr(i, "to_dict"):
                inputs.append(i.to_dict())
            else:
                inputs.append({"text": str(i)})

        blocking = []
        for b in (getattr(snap, "blocking_elements", None) or []):
            if isinstance(b, dict):
                blocking.append(b)
            elif hasattr(b, "to_dict"):
                blocking.append(b.to_dict())
            else:
                blocking.append({"text": str(b)})

        semantic_tree = None
        if snap.semantic_tree:
            if hasattr(snap.semantic_tree, "to_dict"):
                semantic_tree = snap.semantic_tree.to_dict()
            else:
                semantic_tree = str(snap.semantic_tree)

        return SnapshotResponse(
            success=True,
            url=req.url,
            title=snap.title,
            page_type=snap.page_type,
            snapshot_id=getattr(snap, "snapshot_id", ""),
            primary_actions=primary_actions,
            inputs=inputs,
            blocking_elements=blocking,
            semantic_tree=semantic_tree,
        )
    except Exception as e:
        logger.exception("snapshot failed")
        return SnapshotResponse(success=False, url=req.url, error=str(e))


@router.post("/extract", response_model=ExtractResponse)
async def extract(req: ExtractRequest):
    """Extract data from a page (modes: css, structured, json, html)."""
    try:
        from an_web import ANWebEngine

        async with ANWebEngine() as engine:
            session = await engine.create_session()
            await session.navigate(req.url)

            query: str | dict
            if req.mode == "css":
                query = {"mode": "css", "selector": req.selector or "body"}
            elif req.mode == "structured":
                query = {
                    "mode": "structured",
                    "selector": req.selector or "body",
                    "fields": req.fields or {},
                }
            elif req.mode == "json":
                query = {
                    "mode": "json",
                    "selector": req.selector or "script[type='application/json']",
                }
            elif req.mode == "html":
                query = {"mode": "html", "selector": req.selector or "body"}
            else:
                query = req.selector or "body"

            result = await session.act({"tool": "extract", "query": query})
            await session.close()

        effects = result.get("effects", {})
        data = effects.get("results", effects)
        count = effects.get("count", len(data) if isinstance(data, list) else 1)
        mode = effects.get("mode", req.mode)

        return ExtractResponse(
            success=True,
            url=req.url,
            mode=mode,
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
            violation_type=getattr(result, "violation_type", None),
        )
    except Exception as e:
        logger.exception("policy_check failed")
        return PolicyCheckResponse(success=False, url=req.url, error=str(e))
