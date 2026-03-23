"""Contextifier document processing API router — v0.2.4."""

import uuid
import shutil
import re
import time
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File, Form

from contextifier import DocumentProcessor
from contextifier.config import (
    ProcessingConfig,
    ChunkingConfig,
    TagConfig,
    TableConfig,
    MetadataConfig,
)
from contextifier.types import OutputFormat

from app.config import settings
from app.schemas.contextifier import (
    ExtractionResponse,
    ChunkingResponse,
    ChunkInfo,
    SupportedFormatsResponse,
    SampleFileSchema,
)

router = APIRouter()

UPLOAD_DIR = Path(settings.contextifier_upload_dir)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Bundled sample files for contextifier demo
SAMPLES_DIR = Path(__file__).resolve().parent.parent.parent / "samples" / "contextifier"

# Map of table format strings → OutputFormat enum
TABLE_FORMAT_MAP = {
    "html": OutputFormat.HTML,
    "markdown": OutputFormat.MARKDOWN,
    "text": OutputFormat.TEXT,
}

# Extensions that contextifier supports (subset shown for demo upload validation)
ALLOWED_EXTENSIONS = {
    # Documents
    ".pdf", ".docx", ".doc", ".hwp", ".hwpx", ".rtf",
    # Presentations
    ".pptx", ".ppt",
    # Spreadsheets
    ".xlsx", ".xls", ".csv", ".tsv",
    # Text/Code
    ".txt", ".md", ".py", ".js", ".ts", ".java", ".go", ".rs", ".cpp", ".c",
    ".rb", ".php", ".swift", ".kt", ".scala", ".r", ".lua", ".sh", ".bash",
    ".sql", ".css", ".scss", ".html", ".htm", ".xml", ".svg",
    # Config
    ".json", ".yaml", ".yml", ".toml", ".ini", ".env", ".conf",
    # Data
    ".log", ".rst",
    # Images (OCR required — disabled in demo)
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff", ".tif",
}

FORMAT_CATEGORIES = {
    "문서": [".pdf", ".docx", ".doc", ".hwp", ".hwpx", ".rtf"],
    "프레젠테이션": [".pptx", ".ppt"],
    "스프레드시트": [".xlsx", ".xls", ".csv", ".tsv"],
    "텍스트 & 코드": [
        ".txt", ".md", ".py", ".js", ".ts", ".java", ".go", ".rs",
        ".cpp", ".c", ".rb", ".php", ".swift", ".kt", ".scala",
        ".r", ".lua", ".sh", ".bash", ".sql", ".css", ".scss",
    ],
    "웹": [".html", ".htm", ".xml", ".svg"],
    "설정": [".json", ".yaml", ".yml", ".toml", ".ini", ".env", ".conf"],
    "이미지 (OCR)": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff", ".tif"],
}


def _build_processor(
    table_format: str = "html",
    metadata_language: str = "ko",
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
    page_prefix: str | None = None,
    page_suffix: str | None = None,
    metadata_prefix: str | None = None,
    metadata_suffix: str | None = None,
) -> DocumentProcessor:
    """Build a DocumentProcessor with the given configuration."""
    tag_kwargs = {}
    if page_prefix is not None:
        tag_kwargs["page_prefix"] = page_prefix
    if page_suffix is not None:
        tag_kwargs["page_suffix"] = page_suffix
    if metadata_prefix is not None:
        tag_kwargs["metadata_prefix"] = metadata_prefix
    if metadata_suffix is not None:
        tag_kwargs["metadata_suffix"] = metadata_suffix

    config = ProcessingConfig(
        tags=TagConfig(**tag_kwargs) if tag_kwargs else TagConfig(),
        tables=TableConfig(
            output_format=TABLE_FORMAT_MAP.get(table_format, OutputFormat.HTML),
        ),
        metadata=MetadataConfig(language=metadata_language),
        chunking=ChunkingConfig(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        ),
    )
    return DocumentProcessor(config=config)


def _count_structure(text: str) -> dict:
    """Count structural elements (tables, images, pages) in extracted text."""
    table_count = len(re.findall(r"<table>.*?</table>", text, re.DOTALL))
    # Fallback: count markdown tables if no HTML tables found
    if table_count == 0:
        md_tables = re.findall(r"^\|.*\|$", text, re.MULTILINE)
        if len(md_tables) >= 2:
            table_count = 1

    image_count = len(re.findall(r"\[Image:.*?\]", text))
    page_count = len(re.findall(r"\[Page Number: \d+\]", text))

    # Extract metadata block
    metadata_match = re.search(
        r"\[Document-Metadata\](.*?)\[/Document-Metadata\]",
        text,
        re.DOTALL,
    )
    metadata_block = metadata_match.group(0) if metadata_match else None

    return {
        "table_count": table_count,
        "image_count": image_count,
        "page_count": page_count,
        "metadata_block": metadata_block,
    }


# ─── Info ───


@router.get("/info", response_model=SupportedFormatsResponse)
async def contextifier_info():
    """Contextifier 지원 포맷 및 설정 정보"""
    all_exts = sorted(ALLOWED_EXTENSIONS)
    return SupportedFormatsResponse(
        extensions=all_exts,
        total_count=len(all_exts),
        categories={k: sorted(v) for k, v in FORMAT_CATEGORIES.items()},
        max_file_size_mb=settings.contextifier_max_file_size_mb,
    )


# ─── Extract Text ───


@router.post("/extract", response_model=ExtractionResponse)
async def extract_text(
    file: UploadFile = File(..., description="텍스트를 추출할 문서 파일"),
    table_format: str = Form("html", description="테이블 출력 형식: html | markdown | text"),
    metadata_language: str = Form("ko", description="메타데이터 언어: ko | en"),
):
    """파일 업로드 → 텍스트 추출 → 결과 반환"""

    filename = file.filename or "unknown"
    ext = Path(filename).suffix.lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"지원하지 않는 파일 형식: {ext}",
        )

    # Check file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    size_mb = file_size / (1024 * 1024)

    if size_mb > settings.contextifier_max_file_size_mb:
        raise HTTPException(
            status_code=413,
            detail=f"파일 크기 {size_mb:.1f}MB가 제한({settings.contextifier_max_file_size_mb}MB)을 초과합니다.",
        )

    # Save temp file
    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}{ext}"

    try:
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 저장 실패: {e}") from e

    try:
        processor = _build_processor(
            table_format=table_format,
            metadata_language=metadata_language,
        )
        text = processor.extract_text(str(file_path))
        structure = _count_structure(text)

        return ExtractionResponse(
            success=True,
            filename=filename,
            file_extension=ext,
            file_size_bytes=file_size,
            extracted_text=text,
            text_length=len(text),
            metadata_block=structure["metadata_block"],
            table_count=structure["table_count"],
            image_count=structure["image_count"],
            page_count=structure["page_count"],
        )
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"텍스트 추출 실패: {e}") from e
    finally:
        file_path.unlink(missing_ok=True)


# ─── Extract + Chunk ───


@router.post("/extract-and-chunk", response_model=ChunkingResponse)
async def extract_and_chunk(
    file: UploadFile = File(..., description="추출 및 청킹할 문서 파일"),
    chunk_size: int = Form(1000, description="청크 크기", ge=50, le=10000),
    chunk_overlap: int = Form(200, description="청크 오버랩", ge=0, le=2000),
    table_format: str = Form("html", description="테이블 출력 형식"),
    metadata_language: str = Form("ko", description="메타데이터 언어"),
):
    """파일 업로드 → 텍스트 추출 → 청킹 → 결과 반환"""

    filename = file.filename or "unknown"
    ext = Path(filename).suffix.lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"지원하지 않는 파일 형식: {ext}",
        )

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    size_mb = file_size / (1024 * 1024)

    if size_mb > settings.contextifier_max_file_size_mb:
        raise HTTPException(
            status_code=413,
            detail=f"파일 크기 {size_mb:.1f}MB가 제한({settings.contextifier_max_file_size_mb}MB)을 초과합니다.",
        )

    if chunk_overlap >= chunk_size:
        raise HTTPException(
            status_code=400,
            detail="chunk_overlap은 chunk_size보다 작아야 합니다.",
        )

    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}{ext}"

    try:
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 저장 실패: {e}") from e

    try:
        processor = _build_processor(
            table_format=table_format,
            metadata_language=metadata_language,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

        # Extract text first
        text = processor.extract_text(str(file_path))

        # Then chunk
        chunk_result = processor.extract_chunks(str(file_path))
        chunks = chunk_result.chunks

        chunk_infos = [
            ChunkInfo(index=i, text=c, length=len(c))
            for i, c in enumerate(chunks)
        ]

        lengths = [len(c) for c in chunks]
        avg_len = sum(lengths) / len(lengths) if lengths else 0
        min_len = min(lengths) if lengths else 0
        max_len = max(lengths) if lengths else 0

        return ChunkingResponse(
            success=True,
            filename=filename,
            file_extension=ext,
            file_size_bytes=file_size,
            extracted_text=text,
            text_length=len(text),
            chunks=chunk_infos,
            chunk_count=len(chunks),
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            avg_chunk_length=round(avg_len, 1),
            min_chunk_length=min_len,
            max_chunk_length=max_len,
            table_format=table_format,
            metadata_language=metadata_language,
        )
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"추출/청킹 실패: {e}") from e
    finally:
        file_path.unlink(missing_ok=True)


# ─── Sample Files ───


def _discover_samples() -> list[SampleFileSchema]:
    """Discover bundled sample files from the samples/contextifier directory."""
    if not SAMPLES_DIR.is_dir():
        return []

    meta = {
        "sample_document": ("Markdown 문서", "Contextifier 소개 문서 — 테이블, 코드 블록 포함", ".md"),
        "sales_data": ("CSV 데이터", "제품 판매 데이터 — 15행 × 7열 테이블", ".csv"),
        "sample_code": ("Python 소스코드", "클래스, 함수, 독스트링이 포함된 Python 파일", ".py"),
        "config_example": ("JSON 설정파일", "중첩 구조의 API 서버 설정 파일", ".json"),
        "business_report": ("HTML 보고서", "Q1 사업보고서 — 한국어, 테이블 2개 포함", ".html"),
    }

    samples = []
    for file_path in sorted(SAMPLES_DIR.iterdir()):
        if file_path.is_file():
            stem = file_path.stem
            name, desc, ext = meta.get(stem, (stem, f"{stem} 샘플 파일", file_path.suffix))
            size_kb = file_path.stat().st_size / 1024

            samples.append(SampleFileSchema(
                id=stem,
                name=name,
                description=desc,
                extension=ext,
                size_kb=round(size_kb, 1),
            ))

    return samples


@router.get("/sample-files")
async def sample_files():
    """데모용 샘플 파일 목록"""
    return {"samples": [s.model_dump() for s in _discover_samples()]}


@router.post("/extract-sample/{sample_id}", response_model=ExtractionResponse)
async def extract_sample(
    sample_id: str,
    table_format: str = "html",
    metadata_language: str = "ko",
):
    """내장 샘플 파일에서 텍스트 추출"""
    sample_path = _find_sample(sample_id)

    processor = _build_processor(
        table_format=table_format,
        metadata_language=metadata_language,
    )

    try:
        text = processor.extract_text(str(sample_path))
        structure = _count_structure(text)

        return ExtractionResponse(
            success=True,
            filename=sample_path.name,
            file_extension=sample_path.suffix,
            file_size_bytes=sample_path.stat().st_size,
            extracted_text=text,
            text_length=len(text),
            metadata_block=structure["metadata_block"],
            table_count=structure["table_count"],
            image_count=structure["image_count"],
            page_count=structure["page_count"],
        )
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"추출 실패: {e}") from e


@router.post("/chunk-sample/{sample_id}", response_model=ChunkingResponse)
async def chunk_sample(
    sample_id: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
    table_format: str = "html",
    metadata_language: str = "ko",
):
    """내장 샘플 파일에서 추출 + 청킹"""
    sample_path = _find_sample(sample_id)

    if chunk_overlap >= chunk_size:
        raise HTTPException(
            status_code=400,
            detail="chunk_overlap은 chunk_size보다 작아야 합니다.",
        )

    processor = _build_processor(
        table_format=table_format,
        metadata_language=metadata_language,
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )

    try:
        text = processor.extract_text(str(sample_path))
        chunk_result = processor.extract_chunks(str(sample_path))
        chunks = chunk_result.chunks

        chunk_infos = [
            ChunkInfo(index=i, text=c, length=len(c))
            for i, c in enumerate(chunks)
        ]

        lengths = [len(c) for c in chunks]
        avg_len = sum(lengths) / len(lengths) if lengths else 0
        min_len = min(lengths) if lengths else 0
        max_len = max(lengths) if lengths else 0

        return ChunkingResponse(
            success=True,
            filename=sample_path.name,
            file_extension=sample_path.suffix,
            file_size_bytes=sample_path.stat().st_size,
            extracted_text=text,
            text_length=len(text),
            chunks=chunk_infos,
            chunk_count=len(chunks),
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            avg_chunk_length=round(avg_len, 1),
            min_chunk_length=min_len,
            max_chunk_length=max_len,
            table_format=table_format,
            metadata_language=metadata_language,
        )
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"추출/청킹 실패: {e}") from e


def _find_sample(sample_id: str) -> Path:
    """Find a sample file by ID (stem name), raise 404 if not found."""
    if not SAMPLES_DIR.is_dir():
        raise HTTPException(status_code=404, detail="샘플 디렉토리를 찾을 수 없습니다.")

    for f in SAMPLES_DIR.iterdir():
        if f.is_file() and f.stem == sample_id:
            return f

    available = [f.stem for f in SAMPLES_DIR.iterdir() if f.is_file()]
    raise HTTPException(
        status_code=404,
        detail=f"샘플 '{sample_id}'를 찾을 수 없습니다. 사용 가능: {available}",
    )
