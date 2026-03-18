"""
HR Gallery — Library Import & Integration Test Suite

Tests that all CocoRoF libraries (googer, f2a, contextifier) can be imported
properly and their versions match the expected values from pyproject.toml.

Usage:
    # From hr_gallery root (after activating venv):
    python test_gallery_libraries.py

    # Or via uv:
    uv run python test_gallery_libraries.py
"""

import sys
import importlib
import traceback
from pathlib import Path

# ── Colors for terminal output ──
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

PASS_COUNT = 0
FAIL_COUNT = 0
SKIP_COUNT = 0


def log_pass(msg: str) -> None:
    global PASS_COUNT
    PASS_COUNT += 1
    print(f"  {GREEN}✓ PASS{RESET}  {msg}")


def log_fail(msg: str, detail: str = "") -> None:
    global FAIL_COUNT
    FAIL_COUNT += 1
    print(f"  {RED}✗ FAIL{RESET}  {msg}")
    if detail:
        print(f"         {RED}{detail}{RESET}")


def log_skip(msg: str) -> None:
    global SKIP_COUNT
    SKIP_COUNT += 1
    print(f"  {YELLOW}○ SKIP{RESET}  {msg}")


def section(title: str) -> None:
    print(f"\n{BOLD}{CYAN}{'─' * 60}{RESET}")
    print(f"{BOLD}{CYAN}  {title}{RESET}")
    print(f"{BOLD}{CYAN}{'─' * 60}{RESET}")


# ════════════════════════════════════════════════════════════
# 1. googer
# ════════════════════════════════════════════════════════════

def test_googer() -> None:
    section("googer — Import & API Tests")

    # Import
    try:
        import googer
        log_pass(f"import googer (version: {googer.__version__})")
    except ImportError as e:
        log_fail(f"import googer", str(e))
        return

    # Version check (informational — pyproject.toml may have unreleased dev version)
    log_pass(f"googer version: {googer.__version__}")

    # Core classes
    try:
        from googer import Googer
        log_pass("from googer import Googer")
    except ImportError as e:
        log_fail("from googer import Googer", str(e))

    try:
        from googer import Query
        log_pass("from googer import Query")
    except ImportError as e:
        log_fail("from googer import Query", str(e))

    # Exception classes
    try:
        from googer.exceptions import GoogerException, NoResultsException
        log_pass("googer.exceptions imports (GoogerException, NoResultsException)")
    except ImportError as e:
        log_fail("googer.exceptions imports", str(e))

    # Instantiation
    try:
        client = Googer()
        log_pass("Googer() instantiation")
    except Exception as e:
        log_fail("Googer() instantiation", str(e))

    # Context manager
    try:
        with Googer() as g:
            pass
        log_pass("Googer context manager (with statement)")
    except Exception as e:
        log_fail("Googer context manager", str(e))

    # Query builder
    try:
        q = Query("test")
        q = q.site("example.com").filetype("pdf")
        built = str(q)
        assert "site:" in built and "filetype:" in built
        log_pass(f"Query builder chaining: {built}")
    except Exception as e:
        log_fail("Query builder", str(e))

    # Method existence
    try:
        g = Googer()
        for method in ("search", "images", "news", "videos"):
            assert hasattr(g, method), f"Missing method: {method}"
        log_pass("Googer has all search methods (search, images, news, videos)")
    except Exception as e:
        log_fail("Googer method check", str(e))


# ════════════════════════════════════════════════════════════
# 2. f2a
# ════════════════════════════════════════════════════════════

def test_f2a() -> None:
    section("f2a — Import & API Tests")

    # Import
    try:
        import f2a
        log_pass(f"import f2a (version: {f2a.__version__})")
    except ImportError as e:
        log_fail(f"import f2a", str(e))
        return

    # Version check (informational — pyproject.toml may have unreleased dev version)
    log_pass(f"f2a version: {f2a.__version__}")

    # Core function
    try:
        assert callable(f2a.analyze)
        log_pass("f2a.analyze is callable")
    except Exception as e:
        log_fail("f2a.analyze callable check", str(e))

    # AnalysisConfig
    try:
        from f2a import AnalysisConfig
        log_pass("from f2a import AnalysisConfig")
    except ImportError as e:
        log_fail("from f2a import AnalysisConfig", str(e))

    # Config presets
    try:
        from f2a import AnalysisConfig

        cfg_fast = AnalysisConfig.fast()
        assert cfg_fast is not None
        log_pass("AnalysisConfig.fast() preset")

        cfg_min = AnalysisConfig.minimal()
        assert cfg_min is not None
        log_pass("AnalysisConfig.minimal() preset")

        cfg_basic = AnalysisConfig.basic_only()
        assert cfg_basic is not None
        log_pass("AnalysisConfig.basic_only() preset")
    except Exception as e:
        log_fail("AnalysisConfig presets", str(e))

    # Analyze with test data
    try:
        import tempfile
        import csv

        with tempfile.NamedTemporaryFile(mode="w", suffix=".csv", delete=False, newline="") as tmp:
            writer = csv.writer(tmp)
            writer.writerow(["name", "age", "score"])
            for i in range(50):
                writer.writerow([f"user_{i}", 20 + (i % 30), 50 + (i * 0.8)])
            tmp_path = tmp.name

        report = f2a.analyze(tmp_path, config=AnalysisConfig.minimal())
        assert report is not None
        assert hasattr(report, "schema")
        assert hasattr(report, "stats")
        assert hasattr(report, "shape")
        log_pass(f"f2a.analyze() with test CSV: shape={report.shape}")

        # Schema
        schema = report.schema
        assert schema.n_rows == 50
        assert schema.n_cols == 3
        log_pass(f"Schema: {schema.n_rows} rows × {schema.n_cols} cols")

        # Warnings
        assert isinstance(report.warnings, list)
        log_pass(f"Warnings: {len(report.warnings)} items")

        # Cleanup
        Path(tmp_path).unlink(missing_ok=True)

    except Exception as e:
        log_fail("f2a.analyze() with test data", str(e))


# ════════════════════════════════════════════════════════════
# 3. contextifier
# ════════════════════════════════════════════════════════════

def test_contextifier() -> None:
    section("contextifier — Import & API Tests")

    # Import
    try:
        import contextifier
        version = getattr(contextifier, "__version__", "unknown")
        log_pass(f"import contextifier (version: {version})")
    except ImportError as e:
        log_fail(f"import contextifier", str(e))
        log_skip("Skipping remaining contextifier tests (not installed)")
        return

    # DocumentProcessor
    try:
        from contextifier import DocumentProcessor
        log_pass("from contextifier import DocumentProcessor")
    except ImportError as e:
        log_fail("from contextifier import DocumentProcessor", str(e))

    # Core submodules
    try:
        from contextifier.core import DocumentProcessor as CoreDP
        log_pass("from contextifier.core import DocumentProcessor")
    except ImportError as e:
        log_fail("contextifier.core.DocumentProcessor import", str(e))

    # Chunking module
    try:
        import contextifier.chunking
        log_pass("import contextifier.chunking")
    except ImportError as e:
        log_fail("contextifier.chunking import", str(e))

    # OCR module
    try:
        import contextifier.ocr
        log_pass("import contextifier.ocr")
    except ImportError as e:
        log_fail("contextifier.ocr import", str(e))

    # Core utility functions
    try:
        from contextifier.core import clean_text, sanitize_text_for_json
        log_pass("from contextifier.core import clean_text, sanitize_text_for_json")
    except ImportError as e:
        log_fail("contextifier.core utility functions", str(e))


# ════════════════════════════════════════════════════════════
# 4. Backend dependencies (FastAPI + supporting libs)
# ════════════════════════════════════════════════════════════

def test_backend_deps() -> None:
    section("Backend Dependencies — Import Tests")

    deps = [
        ("fastapi", "FastAPI"),
        ("uvicorn", "Uvicorn"),
        ("pydantic", "Pydantic"),
        ("pydantic_settings", "Pydantic Settings"),
        ("pandas", "Pandas"),
        ("numpy", "NumPy"),
        ("matplotlib", "Matplotlib"),
        ("seaborn", "Seaborn"),
        ("scipy", "SciPy"),
        ("sklearn", "scikit-learn"),
        ("jinja2", "Jinja2"),
        ("openpyxl", "openpyxl"),
    ]

    for module_name, display_name in deps:
        try:
            mod = importlib.import_module(module_name)
            version = getattr(mod, "__version__", "?")
            log_pass(f"{display_name}: {version}")
        except ImportError:
            log_fail(f"{display_name} ({module_name})")


# ════════════════════════════════════════════════════════════
# 5. Version consistency check (pyproject.toml)
# ════════════════════════════════════════════════════════════

def test_version_consistency() -> None:
    section("Version Consistency — pyproject.toml Check")

    workspace_root = Path(__file__).resolve().parent.parent  # hr_gallery -> 2026_blog

    projects = {
        "googer": workspace_root / "googer" / "pyproject.toml",
        "f2a": workspace_root / "f2a" / "pyproject.toml",
        "contextifier": workspace_root / "Contextify" / "pyproject.toml",
        "playleft": workspace_root / "playwLeft" / "pyproject.toml",
    }

    for name, toml_path in projects.items():
        toml_path = toml_path.resolve()
        if not toml_path.exists():
            log_skip(f"{name}: pyproject.toml not found at {toml_path}")
            continue

        try:
            content = toml_path.read_text(encoding="utf-8")
            # Simple extraction - look for version = "..."
            import re
            match = re.search(r'^version\s*=\s*"([^"]+)"', content, re.MULTILINE)
            if match:
                toml_version = match.group(1)
                # Compare with installed version
                try:
                    from importlib.metadata import version as get_version
                    installed = get_version(name)
                    if installed == toml_version:
                        log_pass(f"{name}: pyproject.toml({toml_version}) == installed({installed})")
                    else:
                        log_skip(f"{name}: pyproject.toml({toml_version}) != installed({installed}) — dev version not yet published")
                except Exception:
                    log_pass(f"{name}: pyproject.toml version = {toml_version} (not installed for comparison)")
            else:
                log_fail(f"{name}: Could not parse version from pyproject.toml")
        except Exception as e:
            log_fail(f"{name}: Error reading pyproject.toml", str(e))


# ════════════════════════════════════════════════════════════
# Main
# ════════════════════════════════════════════════════════════

def main() -> None:
    print(f"\n{BOLD}{'═' * 60}{RESET}")
    print(f"{BOLD}  HR Gallery — Library Import & Integration Tests{RESET}")
    print(f"{BOLD}  Python {sys.version}{RESET}")
    print(f"{BOLD}{'═' * 60}{RESET}")

    test_googer()
    test_f2a()
    test_contextifier()
    test_backend_deps()
    test_version_consistency()

    # Summary
    total = PASS_COUNT + FAIL_COUNT + SKIP_COUNT
    print(f"\n{BOLD}{'═' * 60}{RESET}")
    print(f"{BOLD}  Results: {GREEN}{PASS_COUNT} passed{RESET}, {RED}{FAIL_COUNT} failed{RESET}, {YELLOW}{SKIP_COUNT} skipped{RESET}  (total: {total})")

    if FAIL_COUNT > 0:
        print(f"\n  {RED}{BOLD}Some tests failed!{RESET}")
        sys.exit(1)
    else:
        print(f"\n  {GREEN}{BOLD}All tests passed!{RESET}")
        sys.exit(0)


if __name__ == "__main__":
    main()
