# Contextifier Demo — Sample Markdown Document

## Introduction

Contextifier is a production-ready Python document processing library that converts documents of various formats into structured, AI-ready text. This document demonstrates key features of the extraction pipeline.

## Architecture Overview

The system follows a 5-stage pipeline:

1. **Converter** — Binary to format object
2. **Preprocessor** — Normalization and cleanup
3. **Metadata Extractor** — Document properties
4. **Content Extractor** — Text, tables, images, charts
5. **Postprocessor** — Assembly and tagging

## Supported Formats

| Category | Formats | Notes |
|----------|---------|-------|
| Documents | PDF, DOCX, DOC, HWP, RTF | Full structure preservation |
| Presentations | PPTX, PPT | Slides and speaker notes |
| Spreadsheets | XLSX, XLS, CSV, TSV | Multi-sheet, merged cells |
| Text & Code | TXT, MD, PY, JS, TS + 20 more | Auto encoding detection |
| Images | JPG, PNG, GIF, BMP, WebP, TIFF | OCR via 5 Vision LLMs |
| Config | JSON, YAML, TOML, XML, INI | Structure preservation |

## Code Example

```python
from contextifier import DocumentProcessor

processor = DocumentProcessor()
text = processor.extract_text("report.pdf")
chunks = processor.extract_chunks("report.pdf")

for i, chunk in enumerate(chunks.chunks):
    print(f"Chunk {i+1}: {chunk[:100]}...")
```

## Use Cases

- **RAG Pipelines**: Extract and chunk documents for retrieval-augmented generation
- **Document Archival**: Convert legacy documents to searchable text
- **Data Extraction**: Pull structured data from unstructured PDFs
- **LLM Fine-tuning**: Prepare document corpora for model training

## Performance Metrics

| Format | Avg. Speed | Accuracy | Table Preservation |
|--------|-----------|----------|-------------------|
| PDF | 2.3s/page | 98.5% | Full rowspan/colspan |
| DOCX | 0.8s/page | 99.2% | Complete |
| XLSX | 0.5s/sheet | 99.8% | Full merged cells |
| PPTX | 1.1s/slide | 98.9% | Layout preserved |
| HTML | 0.3s/page | 99.5% | Nested tables OK |

## Conclusion

Contextifier provides a unified, format-agnostic document processing pipeline that ensures consistent, high-quality text extraction across 80+ file formats. Its intelligent chunking system automatically selects the optimal strategy for each document type.
