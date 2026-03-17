"""HR Gallery — FastAPI Backend"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import googer, f2a

app = FastAPI(
    title="HR Gallery API",
    description="googer & f2a 데모 플레이그라운드 API",
    version="1.0.0",
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


@app.get("/api/info")
async def info():
    """Return library versions and available features."""
    import googer as _googer
    import f2a as _f2a

    return {
        "libraries": [
            {
                "name": "googer",
                "version": _googer.__version__,
                "description": "A powerful, type-safe Google Search library for Python — powered by Rust.",
                "features": ["text", "images", "news", "videos", "query_builder"],
            },
            {
                "name": "f2a",
                "version": _f2a.__version__,
                "description": "File to Analysis — Automatically perform statistical analysis from any data source.",
                "features": [
                    "analyze",
                    "html_report",
                    "multi_language",
                    "21_analysis_modules",
                ],
                "supported_formats": [
                    "csv", "tsv", "json", "jsonl", "parquet", "excel",
                ],
                "supported_languages": ["en", "ko", "ja", "zh", "de", "fr"],
            },
        ]
    }
