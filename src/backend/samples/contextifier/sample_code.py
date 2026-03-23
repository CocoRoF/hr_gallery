"""Contextifier Demo — Sample Python Source File

This module demonstrates how Contextifier extracts and processes
Python source code files while preserving structure and docstrings.
"""

from typing import Optional
from dataclasses import dataclass, field


@dataclass
class Document:
    """Represents a processed document with metadata.

    Attributes:
        title: Document title extracted from content
        author: Document author if available
        pages: Total number of pages
        text: Extracted plain text content
        tables: Number of tables found
        images: Number of images extracted
    """

    title: str
    author: Optional[str] = None
    pages: int = 0
    text: str = ""
    tables: int = 0
    images: int = 0
    tags: list[str] = field(default_factory=list)

    @property
    def word_count(self) -> int:
        """Calculate the total word count of extracted text."""
        return len(self.text.split())

    @property
    def is_empty(self) -> bool:
        """Check if the document has any content."""
        return len(self.text.strip()) == 0

    def summary(self) -> dict:
        """Return a summary of the document processing results."""
        return {
            "title": self.title,
            "author": self.author,
            "pages": self.pages,
            "word_count": self.word_count,
            "tables": self.tables,
            "images": self.images,
            "tags": self.tags,
        }


class DocumentProcessor:
    """High-level document processing facade.

    Provides a unified API for extracting text from various
    document formats with configurable processing options.

    Example:
        >>> processor = DocumentProcessor(chunk_size=1500)
        >>> result = processor.process("report.pdf")
        >>> print(f"Extracted {result.word_count} words")
    """

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
        table_format: str = "html",
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.table_format = table_format
        self._processed_count = 0

    def process(self, file_path: str) -> Document:
        """Process a single document file.

        Args:
            file_path: Path to the document file

        Returns:
            Document object with extracted content

        Raises:
            FileNotFoundError: If the file does not exist
            ValueError: If the format is not supported
        """
        self._processed_count += 1
        # Processing logic would go here
        return Document(title=file_path, pages=1)

    def batch_process(self, file_paths: list[str]) -> list[Document]:
        """Process multiple documents in sequence.

        Args:
            file_paths: List of paths to document files

        Returns:
            List of Document objects
        """
        return [self.process(fp) for fp in file_paths]

    @property
    def stats(self) -> dict:
        """Return processing statistics."""
        return {
            "total_processed": self._processed_count,
            "chunk_size": self.chunk_size,
            "chunk_overlap": self.chunk_overlap,
            "table_format": self.table_format,
        }


def extract_metadata(text: str) -> dict:
    """Extract metadata tags from processed text.

    Looks for [Document-Metadata]...[/Document-Metadata] blocks
    and parses key-value pairs from them.

    Args:
        text: Processed text containing metadata tags

    Returns:
        Dictionary of metadata key-value pairs
    """
    import re

    pattern = r"\[Document-Metadata\](.*?)\[/Document-Metadata\]"
    match = re.search(pattern, text, re.DOTALL)

    if not match:
        return {}

    metadata = {}
    for line in match.group(1).strip().split("\n"):
        line = line.strip()
        if ":" in line:
            key, value = line.split(":", 1)
            metadata[key.strip()] = value.strip()

    return metadata


# ─── Constants ───

SUPPORTED_FORMATS = {
    "documents": [".pdf", ".docx", ".doc", ".hwp", ".hwpx", ".rtf"],
    "presentations": [".pptx", ".ppt"],
    "spreadsheets": [".xlsx", ".xls", ".csv", ".tsv"],
    "text": [".txt", ".md", ".log", ".rst"],
    "code": [".py", ".js", ".ts", ".java", ".go", ".rs", ".cpp"],
    "config": [".json", ".yaml", ".toml", ".xml", ".ini"],
    "images": [".jpg", ".png", ".gif", ".bmp", ".webp", ".tiff"],
}

MAX_FILE_SIZE_MB = 100
DEFAULT_CHUNK_SIZE = 1000
DEFAULT_CHUNK_OVERLAP = 200
