"""HR Gallery — FastAPI Backend"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import googer, f2a

# ─── Logging ───
# Enable googer library logs so search diagnostics are visible in Docker logs
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)
logging.getLogger("googer").setLevel(logging.INFO)

app = FastAPI(
    title="HR Gallery API",
    description="CocoRoF 라이브러리 갤러리 — googer, f2a, Contextifier, playwLeft",
    version="2.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

# ─── CORS ───
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ───
app.include_router(googer.router, prefix="/api/googer", tags=["googer"])
app.include_router(f2a.router, prefix="/api/f2a", tags=["f2a"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}


def _get_version(package_name: str) -> str | None:
    """Safely get installed package version."""
    try:
        from importlib.metadata import version
        return version(package_name)
    except Exception:
        return None


@app.get("/api/libraries")
async def libraries():
    """Return all CocoRoF library information with dynamic versions."""
    return {
        "libraries": [
            {
                "name": "googer",
                "version": _get_version("googer") or "0.7.0",
                "description": "A multi-engine web search library for Python — 7 engines, multi-engine concurrent search, auto-fallback, caching.",
                "tagline": "Multi-Engine Web Search",
                "language": "Python",
                "license": "Apache-2.0",
                "github": "https://github.com/CocoRoF/googer",
                "pypi": "https://pypi.org/project/googer/",
                "color": "orange",
                "features": ["7_engines", "multi_engine", "text", "images", "news", "videos", "query_builder", "caching"],
                "has_demo": True,
                "demo_path": "/googer",
            },
            {
                "name": "f2a",
                "version": _get_version("f2a") or "1.1.1",
                "description": "File to Analysis — Automatically perform statistical analysis and visualization from any data source.",
                "tagline": "File to Analysis",
                "language": "Python",
                "license": "MIT",
                "github": "https://github.com/CocoRoF/f2a",
                "pypi": "https://pypi.org/project/f2a/",
                "color": "purple",
                "features": [
                    "23_analysis_modules",
                    "html_report",
                    "multi_language",
                    "50+_visualizations",
                    "24+_file_formats",
                ],
                "supported_formats": ["csv", "tsv", "json", "jsonl", "parquet", "excel"],
                "supported_languages": ["en", "ko", "ja", "zh", "de", "fr"],
                "has_demo": True,
                "demo_path": "/f2a",
            },
            {
                "name": "contextifier",
                "version": _get_version("contextifier") or "0.2.2",
                "description": "Convert raw documents into AI-understandable context with intelligent text extraction, table detection, and semantic chunking.",
                "tagline": "Document → AI Context",
                "language": "Python",
                "license": "Apache-2.0",
                "github": "https://github.com/CocoRoF/Contextifier",
                "pypi": "https://pypi.org/project/contextifier/",
                "color": "emerald",
                "features": [
                    "pdf_extraction",
                    "ocr_5_engines",
                    "smart_chunking",
                    "table_processing",
                    "80+_formats",
                    "langchain_integration",
                ],
                "has_demo": False,
                "demo_path": "/contextifier",
            },
            {
                "name": "playwLeft",
                "version": _get_version("playleft") or "0.1.0",
                "description": "Agent-first browser automation toolkit — Playwright alternative built in Rust with Python bindings.",
                "tagline": "Rust Browser Automation",
                "language": "Rust + Python",
                "license": "Apache-2.0",
                "github": "https://github.com/CocoRoF/playwLeft",
                "color": "amber",
                "features": [
                    "rust_core",
                    "cdp_protocol",
                    "agent_first",
                    "async_native",
                    "python_bindings",
                ],
                "has_demo": False,
                "demo_path": "/playleft",
            },
        ]
    }


@app.get("/api/info")
async def info():
    """Return library versions and available features (legacy endpoint)."""
    lib_data = await libraries()
    return lib_data
