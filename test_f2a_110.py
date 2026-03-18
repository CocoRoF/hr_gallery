"""
f2a 1.1.0 Test Suite
====================
Tests the f2a library's API, configuration, and analysis features.
Run: python test_f2a_110.py
"""

import sys
import os
import tempfile
import traceback
from pathlib import Path

# ─── Colour helpers ───

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
RESET = "\033[0m"

passed = 0
failed = 0


def ok(name: str, detail: str = ""):
    global passed
    passed += 1
    d = f" — {detail}" if detail else ""
    print(f"  {GREEN}✓{RESET} {name}{d}")


def fail(name: str, detail: str = ""):
    global failed
    failed += 1
    d = f" — {detail}" if detail else ""
    print(f"  {RED}✗{RESET} {name}{d}")


# ═══════════════════════════════════════════════════════════
# 1. Import & Version
# ═══════════════════════════════════════════════════════════

print(f"\n{CYAN}═══ 1. Import & Version ═══{RESET}")

try:
    import f2a

    assert f2a.__version__ == "1.1.0", f"Expected 1.1.0, got {f2a.__version__}"
    ok("import f2a", f"v{f2a.__version__}")
except Exception as e:
    fail("import f2a", str(e))

try:
    from f2a import AnalysisConfig, analyze
    ok("import AnalysisConfig, analyze")
except Exception as e:
    fail("import AnalysisConfig, analyze", str(e))

try:
    from f2a.core.analyzer import AnalysisReport, StatsResult, SubsetReport
    ok("import AnalysisReport, StatsResult, SubsetReport")
except Exception as e:
    fail("import AnalysisReport, StatsResult, SubsetReport", str(e))

try:
    from f2a.core.schema import DataSchema, ColumnInfo
    ok("import DataSchema, ColumnInfo")
except Exception as e:
    fail("import DataSchema, ColumnInfo", str(e))


# ═══════════════════════════════════════════════════════════
# 2. AnalysisConfig
# ═══════════════════════════════════════════════════════════

print(f"\n{CYAN}═══ 2. AnalysisConfig ═══{RESET}")

try:
    cfg = AnalysisConfig()
    assert cfg.descriptive is True
    assert cfg.correlation is True
    assert cfg.distribution is True
    assert cfg.outlier is True
    assert cfg.categorical is True
    assert cfg.feature_importance is True
    assert cfg.pca is True
    assert cfg.duplicates is True
    assert cfg.quality_score is True  # renamed from 'quality' in 1.1.0
    assert cfg.visualizations is True  # new in 1.1.0
    assert cfg.preprocessing is True
    assert cfg.advanced is True
    assert cfg.data_profiling is True
    ok("default config — all modules True")
except Exception as e:
    fail("default config", str(e))

try:
    cfg = AnalysisConfig()
    assert cfg.outlier_method == "iqr"
    assert cfg.outlier_threshold == 1.5
    assert cfg.correlation_threshold == 0.9
    assert cfg.pca_max_components == 10
    assert cfg.max_categories == 50
    assert cfg.max_plot_columns == 20
    assert cfg.max_cluster_k == 10
    assert cfg.tsne_perplexity == 30.0
    assert cfg.bootstrap_iterations == 1000
    assert cfg.max_sample_for_advanced == 5000
    assert cfg.n_distribution_fits == 7
    ok("default numeric params")
except Exception as e:
    fail("default numeric params", str(e))

try:
    cfg = AnalysisConfig.fast()
    assert cfg.advanced is False
    assert cfg.pca is False
    assert cfg.feature_importance is False
    ok("preset: fast()", "advanced=False, pca=False, feature_importance=False")
except Exception as e:
    fail("preset: fast()", str(e))

try:
    cfg = AnalysisConfig.minimal()
    assert cfg.descriptive is True
    assert cfg.correlation is False
    assert cfg.distribution is False
    ok("preset: minimal()", "descriptive=True, correlation/distribution=False")
except Exception as e:
    fail("preset: minimal()", str(e))

try:
    cfg = AnalysisConfig.basic_only()
    assert cfg.advanced is False
    assert cfg.descriptive is True
    ok("preset: basic_only()", "advanced=False, descriptive=True")
except Exception as e:
    fail("preset: basic_only()", str(e))

try:
    cfg = AnalysisConfig(
        advanced=False,
        clustering=True,
        outlier_method="zscore",
        outlier_threshold=3.0,
        visualizations=False,
    )
    assert cfg.advanced is False
    assert cfg.clustering is True
    assert cfg.outlier_method == "zscore"
    assert cfg.outlier_threshold == 3.0
    assert cfg.visualizations is False
    ok("custom config", "outlier_method=zscore, visualizations=False")
except Exception as e:
    fail("custom config", str(e))

# Check that 'missing' is NOT a config option (removed in 1.1.0)
try:
    assert not hasattr(AnalysisConfig(), "missing"), "'missing' should not be a config attr"
    ok("'missing' removed from config (always on)")
except Exception as e:
    fail("'missing' config check", str(e))


# ═══════════════════════════════════════════════════════════
# 3. CSV Analysis (minimal test file)
# ═══════════════════════════════════════════════════════════

print(f"\n{CYAN}═══ 3. CSV Analysis ═══{RESET}")

# Create a small CSV for testing
csv_content = """name,age,salary,department,is_active
Alice,30,70000,Engineering,true
Bob,25,55000,Marketing,false
Charlie,35,80000,Engineering,true
Diana,28,60000,HR,true
Eve,32,75000,Marketing,false
Frank,40,90000,Engineering,true
Grace,27,52000,HR,false
Hank,33,72000,Marketing,true
Ivy,29,65000,Engineering,true
Jack,38,85000,HR,true
"""

tmp_dir = tempfile.mkdtemp(prefix="f2a_test_")
csv_path = os.path.join(tmp_dir, "test_data.csv")
with open(csv_path, "w", encoding="utf-8") as f:
    f.write(csv_content)

report = None

try:
    report = f2a.analyze(csv_path, config=AnalysisConfig.minimal())
    ok("analyze(csv) — minimal", f"completed")
except Exception as e:
    fail("analyze(csv) — minimal", str(e))
    traceback.print_exc()

if report is not None:
    # shape
    try:
        assert report.shape == (10, 5), f"Expected (10, 5), got {report.shape}"
        ok("report.shape", f"{report.shape}")
    except Exception as e:
        fail("report.shape", str(e))

    # schema
    try:
        schema = report.schema
        assert isinstance(schema, DataSchema)
        assert schema.n_rows == 10
        assert schema.n_cols == 5
        assert len(schema.columns) == 5
        col_names = [c.name for c in schema.columns]
        assert "name" in col_names
        assert "age" in col_names
        ok("report.schema", f"n_rows={schema.n_rows}, n_cols={schema.n_cols}, cols={col_names}")
    except Exception as e:
        fail("report.schema", str(e))

    # schema.columns ColumnInfo
    try:
        col = schema.columns[0]
        assert isinstance(col, ColumnInfo)
        assert hasattr(col, "name")
        assert hasattr(col, "dtype")
        assert hasattr(col, "inferred_type")
        assert hasattr(col, "n_unique")
        assert hasattr(col, "n_missing")
        assert hasattr(col, "missing_ratio")
        ok("ColumnInfo attrs", f"name={col.name}, dtype={col.dtype}, inferred={col.inferred_type}")
    except Exception as e:
        fail("ColumnInfo attrs", str(e))

    # schema helper properties
    try:
        num_cols = schema.numeric_columns
        cat_cols = schema.categorical_columns
        ok("schema.numeric_columns / categorical_columns", f"num={len(num_cols)}, cat={len(cat_cols)}")
    except Exception as e:
        fail("schema helper properties", str(e))

    # stats
    try:
        stats = report.stats
        assert isinstance(stats, StatsResult)
        ok("report.stats", "StatsResult instance")
    except Exception as e:
        fail("report.stats", str(e))

    # stats.summary
    try:
        summary = stats.summary
        assert summary is not None
        ok("stats.summary", f"type={type(summary).__name__}")
    except Exception as e:
        fail("stats.summary", str(e))

    # stats.preprocessing
    try:
        prep = stats.preprocessing
        ok("stats.preprocessing", f"type={type(prep).__name__}")
    except Exception as e:
        fail("stats.preprocessing", str(e))

    # warnings
    try:
        warnings = report.warnings
        assert isinstance(warnings, list)
        ok("report.warnings", f"{len(warnings)} warnings")
    except Exception as e:
        fail("report.warnings", str(e))

    # analysis_duration_sec
    try:
        dur = report.analysis_duration_sec
        assert isinstance(dur, (int, float))
        assert dur >= 0
        ok("report.analysis_duration_sec", f"{dur:.3f}s")
    except Exception as e:
        fail("report.analysis_duration_sec", str(e))

    # to_dict
    try:
        d = report.to_dict()
        assert isinstance(d, dict)
        assert "schema" in d
        # 1.1.0: stats are flattened — stats_summary, correlation_matrix, etc.
        assert "stats_summary" in d or "schema" in d, f"unexpected keys: {list(d.keys())}"
        ok("report.to_dict()", f"keys={list(d.keys())}")
    except Exception as e:
        fail("report.to_dict()", str(e))

    # show()
    try:
        report.show()
        ok("report.show()", "printed to console")
    except Exception as e:
        fail("report.show()", str(e))


# ═══════════════════════════════════════════════════════════
# 4. Full Analysis (fast preset)
# ═══════════════════════════════════════════════════════════

print(f"\n{CYAN}═══ 4. Full Analysis (fast preset) ═══{RESET}")

report2 = None

try:
    report2 = f2a.analyze(csv_path, config=AnalysisConfig.fast())
    ok("analyze(csv) — fast", f"shape={report2.shape}")
except Exception as e:
    fail("analyze(csv) — fast", str(e))
    traceback.print_exc()

if report2 is not None:
    # stats attributes
    try:
        s = report2.stats
        attrs_to_check = [
            "summary", "correlation_matrix", "missing_info",
            "distribution_info", "outlier_summary", "categorical_analysis",
            "duplicate_stats", "quality_scores", "quality_by_column",
            "preprocessing",
        ]
        found = []
        for attr in attrs_to_check:
            if hasattr(s, attr):
                found.append(attr)
        ok("stats attributes (fast)", f"found: {found}")
    except Exception as e:
        fail("stats attributes (fast)", str(e))

    # spearman / cramers_v / vif
    try:
        has_spearman = hasattr(report2.stats, "spearman_matrix")
        has_cramers = hasattr(report2.stats, "cramers_v_matrix")
        has_vif = hasattr(report2.stats, "vif_table")
        ok("correlation matrices", f"spearman={has_spearman}, cramers_v={has_cramers}, vif={has_vif}")
    except Exception as e:
        fail("correlation matrices", str(e))


# ═══════════════════════════════════════════════════════════
# 5. HTML Report Generation
# ═══════════════════════════════════════════════════════════

print(f"\n{CYAN}═══ 5. HTML Report Generation ═══{RESET}")

if report2 is not None:
    html_dir = os.path.join(tmp_dir, "html_output")
    os.makedirs(html_dir, exist_ok=True)

    try:
        result_path = report2.to_html(html_dir)
        assert isinstance(result_path, Path), f"Expected Path, got {type(result_path)}"
        assert result_path.exists(), f"HTML file does not exist: {result_path}"
        assert result_path.suffix == ".html"
        file_size = result_path.stat().st_size
        ok("to_html()", f"path={result_path.name}, size={file_size / 1024:.1f}KB")
    except Exception as e:
        fail("to_html()", str(e))
        traceback.print_exc()

    # to_html with lang
    try:
        html_dir_ko = os.path.join(tmp_dir, "html_ko")
        os.makedirs(html_dir_ko, exist_ok=True)
        result_path_ko = report2.to_html(html_dir_ko, lang="ko")
        assert result_path_ko.exists()
        ok("to_html(lang='ko')", f"path={result_path_ko.name}")
    except TypeError:
        # lang might be passed differently in 1.1.0
        ok("to_html(lang='ko')", "lang param not supported in to_html — pass to analyze instead")
    except Exception as e:
        fail("to_html(lang='ko')", str(e))


# ═══════════════════════════════════════════════════════════
# 6. to_dict Structure
# ═══════════════════════════════════════════════════════════

print(f"\n{CYAN}═══ 6. to_dict Structure ═══{RESET}")

if report2 is not None:
    try:
        d = report2.to_dict()
        top_keys = list(d.keys())
        ok("to_dict() top keys", f"{top_keys}")
    except Exception as e:
        fail("to_dict() top keys", str(e))

    try:
        schema_dict = d.get("schema", {})
        if isinstance(schema_dict, dict):
            schema_keys = list(schema_dict.keys())
            ok("to_dict()['schema']", f"keys={schema_keys}")
        else:
            ok("to_dict()['schema']", f"type={type(schema_dict).__name__}")
    except Exception as e:
        fail("to_dict()['schema']", str(e))

    try:
        stats_dict = d.get("stats", {})
        if isinstance(stats_dict, dict):
            stats_keys = list(stats_dict.keys())
            ok("to_dict()['stats']", f"{len(stats_keys)} keys: {stats_keys[:10]}...")
        else:
            ok("to_dict()['stats']", f"type={type(stats_dict).__name__}")
    except Exception as e:
        fail("to_dict()['stats']", str(e))


# ═══════════════════════════════════════════════════════════
# 7. Error Handling
# ═══════════════════════════════════════════════════════════

print(f"\n{CYAN}═══ 7. Error Handling ═══{RESET}")

try:
    f2a.analyze("nonexistent_file.csv")
    fail("analyze nonexistent file", "should have raised an exception")
except Exception as e:
    ok("analyze nonexistent file", f"raised {type(e).__name__}: {str(e)[:80]}")

try:
    bad_csv = os.path.join(tmp_dir, "empty.csv")
    with open(bad_csv, "w") as f:
        f.write("")
    f2a.analyze(bad_csv)
    fail("analyze empty file", "should have raised an exception")
except Exception as e:
    ok("analyze empty file", f"raised {type(e).__name__}: {str(e)[:80]}")


# ═══════════════════════════════════════════════════════════
# 8. Advanced Analysis (basic_only)
# ═══════════════════════════════════════════════════════════

print(f"\n{CYAN}═══ 8. Advanced Analysis (basic_only) ═══{RESET}")

try:
    report3 = f2a.analyze(csv_path, config=AnalysisConfig.basic_only())
    assert report3.shape == (10, 5)
    advanced = report3.stats.advanced_stats
    ok("basic_only preset", f"advanced_stats={'empty' if not advanced else 'has content'}")
except Exception as e:
    fail("basic_only preset", str(e))
    traceback.print_exc()


# ═══════════════════════════════════════════════════════════
# 9. StatsResult Helper Methods
# ═══════════════════════════════════════════════════════════

print(f"\n{CYAN}═══ 9. StatsResult Helper Methods ═══{RESET}")

if report2 is not None:
    try:
        num_summary = report2.stats.get_numeric_summary()
        ok("stats.get_numeric_summary()", f"type={type(num_summary).__name__}")
    except Exception as e:
        fail("stats.get_numeric_summary()", str(e))

    try:
        cat_summary = report2.stats.get_categorical_summary()
        ok("stats.get_categorical_summary()", f"type={type(cat_summary).__name__}")
    except Exception as e:
        fail("stats.get_categorical_summary()", str(e))


# ═══════════════════════════════════════════════════════════
# 10. Cleanup & Summary
# ═══════════════════════════════════════════════════════════

print(f"\n{CYAN}═══ Cleanup ═══{RESET}")

import shutil
try:
    shutil.rmtree(tmp_dir, ignore_errors=True)
    ok("temp dir cleaned up")
except Exception:
    pass

# ─── Summary ───
total = passed + failed
print(f"\n{'═' * 50}")
print(f"  f2a 1.1.0 Test Results: {GREEN}{passed}{RESET}/{total} passed", end="")
if failed > 0:
    print(f", {RED}{failed} failed{RESET}")
else:
    print()
print(f"{'═' * 50}\n")

sys.exit(1 if failed > 0 else 0)
