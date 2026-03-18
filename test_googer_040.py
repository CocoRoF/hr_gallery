"""googer 0.4.0 실사용 테스트

googer가 Rust → Pure Python으로 전환된 v0.4.0의 전체 API를 검증합니다.
이 테스트 결과를 기반으로 playground 로직을 재개편합니다.

Usage:
    pip install googer==0.4.0
    python test_googer_040.py
"""

import json
import sys
import traceback
from dataclasses import fields


def divider(title: str) -> None:
    print(f"\n{'=' * 70}")
    print(f"  {title}")
    print(f"{'=' * 70}\n")


def section(title: str) -> None:
    print(f"\n--- {title} ---\n")


# ─── 0. Import & Version ───

def test_imports():
    """v0.4.0 import 구조 검증"""
    divider("0. Import & Version 검증")

    # 메인 import
    from googer import Googer, Query
    print(f"[OK] from googer import Googer, Query")

    # Result 타입 import
    from googer import TextResult, ImageResult, NewsResult, VideoResult
    print(f"[OK] from googer import TextResult, ImageResult, NewsResult, VideoResult")

    # 예외 클래스 import — v0.4.0에서는 __init__에 없으므로 exceptions에서 직접
    from googer.exceptions import (
        GoogerException,
        HttpException,
        TimeoutException,
        RateLimitException,
        ParseException,
        QueryBuildException,
        NoResultsException,
    )
    print(f"[OK] from googer.exceptions import 모든 예외 클래스")

    # 버전 확인
    import googer
    print(f"[OK] googer.__version__ = {googer.__version__}")

    # __all__ 확인
    print(f"[OK] googer.__all__ = {googer.__all__}")

    return True


# ─── 1. 기본 웹 검색 ───

def test_basic_search():
    """기본 텍스트 검색 + 결과 객체 구조 검증"""
    divider("1. 기본 웹 검색 (TextResult)")

    from googer import Googer, TextResult

    g = Googer()
    results = g.search("Python programming", region="us-en", max_results=5)

    print(f"결과 수: {len(results)}")
    print(f"결과 타입: {type(results[0])}")
    print(f"TextResult 맞는지: {isinstance(results[0], TextResult)}")
    print()

    r = results[0]

    # 필드 접근 방식 검증
    section("속성 접근")
    print(f"  r.title = {r.title!r}")
    print(f"  r.href  = {r.href!r}")
    print(f"  r.body  = {r.body[:100]!r}")

    section("dict-like 접근")
    print(f"  r['title']     = {r['title']!r}")
    print(f"  r.get('title') = {r.get('title')!r}")
    print(f"  r.get('없는키', 'default') = {r.get('없는키', 'default')!r}")
    print(f"  'title' in r   = {'title' in r}")
    print(f"  'fake' in r    = {'fake' in r}")

    section("to_dict() 직렬화")
    d = r.to_dict()
    print(f"  type: {type(d)}")
    print(f"  keys: {list(d.keys())}")
    print(f"  JSON 가능: {bool(json.dumps(d, ensure_ascii=False))}")

    section("keys/values/items")
    print(f"  r.keys()   = {r.keys()}")
    print(f"  len(r)     = {len(r)}")
    print(f"  dict(r)    = { {k: v[:50] if isinstance(v, str) and len(v)>50 else v for k,v in r.items()} }")

    section("dataclass fields")
    print(f"  fields: {[f.name for f in fields(r)]}")

    # 전체 결과 출력
    section("전체 결과")
    for i, r in enumerate(results, 1):
        print(f"[{i}] {r.title}")
        print(f"    URL:  {r.href}")
        print(f"    Body: {r.body[:120]}")
        print()

    return True


# ─── 2. 이미지 검색 ───

def test_image_search():
    """이미지 검색 + ImageResult 필드 타입 검증"""
    divider("2. 이미지 검색 (ImageResult)")

    from googer import Googer, ImageResult

    g = Googer()
    results = g.images("cute cats", max_results=5, size="large")

    print(f"결과 수: {len(results)}")
    print(f"타입: {type(results[0])}")
    print(f"ImageResult 맞는지: {isinstance(results[0], ImageResult)}")
    print()

    r = results[0]
    section("ImageResult 필드")
    print(f"  title:     {r.title!r}")
    print(f"  image:     {r.image[:80]!r}")
    print(f"  thumbnail: {r.thumbnail[:80]!r}")
    print(f"  url:       {r.url[:80]!r}")
    print(f"  height:    {r.height!r} (type={type(r.height).__name__})")
    print(f"  width:     {r.width!r}  (type={type(r.width).__name__})")
    print(f"  source:    {r.source!r}")

    section("to_dict()")
    d = r.to_dict()
    print(f"  keys: {list(d.keys())}")
    print(f"  height type in dict: {type(d['height']).__name__}")
    print(f"  width type in dict:  {type(d['width']).__name__}")

    return True


# ─── 3. 뉴스 검색 ───

def test_news_search():
    """뉴스 검색 + NewsResult 필드"""
    divider("3. 뉴스 검색 (NewsResult)")

    from googer import Googer, NewsResult

    g = Googer()
    results = g.news("artificial intelligence 2025", region="us-en", max_results=5)

    print(f"결과 수: {len(results)}")
    print(f"타입: {type(results[0])}")
    print(f"NewsResult 맞는지: {isinstance(results[0], NewsResult)}")
    print()

    for i, r in enumerate(results, 1):
        print(f"[{i}] {r.title}")
        print(f"    URL:    {r.url}")
        print(f"    Source: {r.source}")
        print(f"    Date:   {r.date}")
        print(f"    Body:   {r.body[:100]}")
        print(f"    Image:  {r.image[:80] if r.image else 'N/A'}")
        print()

    section("to_dict() 키")
    print(f"  {list(results[0].to_dict().keys())}")

    return True


# ─── 4. 비디오 검색 ───

def test_video_search():
    """비디오 검색 + VideoResult 필드"""
    divider("4. 비디오 검색 (VideoResult)")

    from googer import Googer, VideoResult

    g = Googer()
    results = g.videos("Python tutorial", max_results=5, duration="short")

    print(f"결과 수: {len(results)}")
    print(f"타입: {type(results[0])}")
    print(f"VideoResult 맞는지: {isinstance(results[0], VideoResult)}")
    print()

    for i, r in enumerate(results, 1):
        print(f"[{i}] {r.title}")
        print(f"    URL:       {r.url}")
        print(f"    Duration:  {r.duration}")
        print(f"    Source:    {r.source}")
        print(f"    Date:      {r.date}")
        print(f"    Body:      {r.body[:100]}")
        print(f"    Thumbnail: {r.thumbnail[:80] if r.thumbnail else 'N/A'}")
        print()

    return True


# ─── 5. Query Builder ───

def test_query_builder():
    """Query 빌더 체이닝 API 전체 검증"""
    divider("5. Query Builder 검증")

    from googer import Query
    from googer.exceptions import QueryBuildException

    section("기본 쿼리 빌드")
    q = Query("machine learning").site("arxiv.org").filetype("pdf")
    built = str(q)
    print(f"  Query: {built}")

    section("체이닝 전체 API")
    q2 = (
        Query("deep learning")
        .exact("neural network")
        .or_term("AI")
        .exclude("tutorial")
        .site("arxiv.org")
        .filetype("pdf")
        .intitle("transformer")
        .inurl("2024")
        .intext("attention mechanism")
        .date_range("2024-01-01", "2024-12-31")
    )
    built2 = str(q2)
    print(f"  Full query: {built2}")

    section("새로운 메서드 (v0.4.0)")
    q3 = Query("test").related("github.com")
    print(f"  related: {str(q3)}")

    q4 = Query("test").cache("example.com")
    print(f"  cache: {str(q4)}")

    q5 = Query("test").raw("custom:operator")
    print(f"  raw: {str(q5)}")

    section("빈 쿼리 예외")
    try:
        str(Query(""))
        print("  [FAIL] 예외가 발생하지 않았습니다")
    except QueryBuildException as e:
        print(f"  [OK] QueryBuildException: {e}")

    section("repr & bool")
    print(f"  repr: {repr(q)}")
    print(f"  bool(q): {bool(q)}")
    print(f"  bool(Query('')): {bool(Query(''))}")

    section("Query를 search()에 직접 전달")
    from googer import Googer
    q_search = Query("Python 3.12").exact("new features")
    results = Googer().search(q_search, max_results=3)
    print(f"  검색어: {str(q_search)}")
    print(f"  결과 수: {len(results)}")
    for i, r in enumerate(results, 1):
        print(f"  [{i}] {r.title}")

    return True


# ─── 6. Context Manager ───

def test_context_manager():
    """with 문 사용 검증"""
    divider("6. Context Manager 검증")

    from googer import Googer

    with Googer() as g:
        results = g.search("Python programming", max_results=3)

    print(f"결과 수: {len(results)}")
    for i, r in enumerate(results, 1):
        print(f"[{i}] {r.title}")
        print(f"    {r.href}")
    print()

    # 인스턴스 직접 사용 (with 없이)
    section("인스턴트 직접 사용")
    g2 = Googer()
    results2 = g2.search("FastAPI", max_results=3)
    print(f"결과 수: {len(results2)}")

    return True


# ─── 7. 예외 처리 ───

def test_exceptions():
    """예외 계층 구조 검증"""
    divider("7. 예외 처리 검증")

    from googer.exceptions import (
        GoogerException,
        HttpException,
        TimeoutException,
        RateLimitException,
        ParseException,
        QueryBuildException,
        NoResultsException,
    )

    section("예외 상속 관계")
    print(f"  HttpException → GoogerException: {issubclass(HttpException, GoogerException)}")
    print(f"  TimeoutException → GoogerException: {issubclass(TimeoutException, GoogerException)}")
    print(f"  RateLimitException → GoogerException: {issubclass(RateLimitException, GoogerException)}")
    print(f"  ParseException → GoogerException: {issubclass(ParseException, GoogerException)}")
    print(f"  QueryBuildException → GoogerException: {issubclass(QueryBuildException, GoogerException)}")
    print(f"  NoResultsException → GoogerException: {issubclass(NoResultsException, GoogerException)}")

    section("NoResultsException 트리거")
    from googer import Googer
    try:
        # 존재할 수 없는 검색어로 NoResultsException 유도
        Googer().search("asdfqwerzxcv123456789noresult", max_results=1)
        print("  [INFO] 예외 미발생 — 결과가 있었음")
    except NoResultsException as e:
        print(f"  [OK] NoResultsException caught: {e}")
    except GoogerException as e:
        print(f"  [OK] GoogerException caught: {type(e).__name__}: {e}")

    return True


# ─── 8. 검색 옵션 조합 ───

def test_search_options():
    """다양한 검색 옵션 조합 테스트"""
    divider("8. 검색 옵션 조합 테스트")

    from googer import Googer

    g = Googer()

    section("region=ko-kr")
    results = g.search("파이썬 프로그래밍", region="ko-kr", max_results=3)
    print(f"  결과 수: {len(results)}")
    for r in results:
        print(f"  - {r.title}")

    section("timelimit='d' (최근 24시간)")
    results = g.news("technology", timelimit="d", max_results=3)
    print(f"  결과 수: {len(results)}")
    for r in results:
        print(f"  - {r.title} ({r.date})")

    section("safesearch='off'")
    results = g.search("programming tutorial", safesearch="off", max_results=3)
    print(f"  결과 수: {len(results)}")

    section("rank=False (랭킹 비활성화)")
    results = g.search("Python web framework", max_results=5, rank=False)
    print(f"  결과 수: {len(results)}")
    for r in results:
        print(f"  - {r.title}")

    return True


# ─── 9. 직렬화 호환성 (API 응답용) ───

def test_serialization():
    """FastAPI 응답에 쓸 수 있는지 직렬화 검증"""
    divider("9. 직렬화 호환성 (API 응답용)")

    from googer import Googer

    g = Googer()

    section("Text 검색 → JSON")
    results = g.search("Python", max_results=3)
    dicts = [r.to_dict() for r in results]
    json_str = json.dumps(dicts, ensure_ascii=False, indent=2)
    print(f"  JSON 변환 성공: {len(json_str)} bytes")
    print(f"  첫 결과 키: {list(dicts[0].keys())}")

    section("Image 검색 → JSON")
    results = g.images("sunset", max_results=3)
    dicts = [r.to_dict() for r in results]
    json_str = json.dumps(dicts, ensure_ascii=False, indent=2)
    print(f"  JSON 변환 성공: {len(json_str)} bytes")
    print(f"  첫 결과 키: {list(dicts[0].keys())}")

    section("News 검색 → JSON")
    results = g.news("AI", max_results=3)
    dicts = [r.to_dict() for r in results]
    json_str = json.dumps(dicts, ensure_ascii=False, indent=2)
    print(f"  JSON 변환 성공: {len(json_str)} bytes")
    print(f"  첫 결과 키: {list(dicts[0].keys())}")

    section("Video 검색 → JSON")
    results = g.videos("coding", max_results=3)
    dicts = [r.to_dict() for r in results]
    json_str = json.dumps(dicts, ensure_ascii=False, indent=2)
    print(f"  JSON 변환 성공: {len(json_str)} bytes")
    print(f"  첫 결과 키: {list(dicts[0].keys())}")

    return True


# ─── Main ───

def main():
    print("=" * 70)
    print("  googer 0.4.0 실사용 테스트")
    print("  Pure Python 전환 후 API 호환성 & 기능 검증")
    print("=" * 70)

    tests = [
        ("Import & Version", test_imports),
        ("기본 웹 검색", test_basic_search),
        ("이미지 검색", test_image_search),
        ("뉴스 검색", test_news_search),
        ("비디오 검색", test_video_search),
        ("Query Builder", test_query_builder),
        ("Context Manager", test_context_manager),
        ("예외 처리", test_exceptions),
        ("검색 옵션 조합", test_search_options),
        ("직렬화 호환성", test_serialization),
    ]

    passed = 0
    failed = 0
    errors = []

    for name, test_fn in tests:
        try:
            test_fn()
            print(f"\n  >>> ✅ PASS: {name}")
            passed += 1
        except Exception as e:
            print(f"\n  >>> ❌ FAIL: {name}")
            print(f"      Error: {type(e).__name__}: {e}")
            traceback.print_exc()
            failed += 1
            errors.append((name, e))

    divider("테스트 요약")
    print(f"  PASS:  {passed}")
    print(f"  FAIL:  {failed}")
    print(f"  TOTAL: {passed + failed}")
    if errors:
        print(f"\n  실패 목록:")
        for name, e in errors:
            print(f"    - {name}: {type(e).__name__}: {e}")
    print()

    return failed == 0


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
