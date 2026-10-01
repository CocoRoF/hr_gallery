# HR Gallery

CocoRoF 오픈소스 라이브러리(googer, f2a, Contextifier, an-web, playwLeft)를 브라우저에서 직접 써 볼 수 있는 데모 갤러리입니다. FastAPI 백엔드가 각 라이브러리를 호출하고, Next.js 프런트엔드가 소개 페이지와 데모 UI를 제공합니다.

## 무엇을 보여 주는가

| 라이브러리 | 고정 버전 | 데모 | 백엔드 라우트 |
|---|---|---|---|
| [googer](https://pypi.org/project/googer/) | 0.7.3 | 있음 (`/googer`) | `/api/googer` : `search`, `images`, `news`, `videos`, `query-builder` |
| [f2a](https://pypi.org/project/f2a/) | 1.1.0 | 있음 (`/f2a`) | `/api/f2a` : `info`, `analyze`, `analyze-url`, `report/{id}`, `sample-datasets`, `analyze-sample/{id}` |
| [Contextifier](https://pypi.org/project/contextifier/) | 0.2.5 | 있음 (`/contextifier`) | `/api/contextifier` : `info`, `extract`, `extract-and-chunk`, `sample-files`, `extract-sample/{id}`, `chunk-sample/{id}` |
| [an-web](https://pypi.org/project/an-web/) | 0.9.1 | 있음 (`/an-web`) | `/api/anweb` : `navigate`, `snapshot`, `extract`, `policy-check` |
| playwLeft | - | 소개 페이지만 (`/playleft`, 데모는 "준비 중") | 없음 |

버전은 `src/backend/requirements.txt`의 고정값이며, `GET /api/libraries`는 설치된 패키지에서 실제 버전을 읽어 반환합니다. 그 밖의 엔드포인트는 `GET /api/health`, `GET /api/info`(`/api/libraries`와 동일)입니다. 각 라이브러리 페이지는 `/<이름>`(소개)과 `/<이름>/demo`(데모)로 나뉩니다.

## 실행

### Docker Compose (개발, 핫 리로드)

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up --build
```

- 프런트엔드 직접: http://localhost:3000
- 백엔드 API 문서: http://localhost:8000/api/docs
- Nginx 경유: http://localhost:58443

### Docker Compose (운영)

```bash
cp .env.example .env   # 필요 시 값 수정
docker compose up --build -d
```

Nginx만 호스트 포트 `58900`(컨테이너 80)으로 열리고, 백엔드(8000)와 프런트엔드(3000)는 내부 네트워크에서만 노출됩니다. 접속은 http://localhost:58900 입니다. (저자의 운영 서버에서는 이 포트를 cloudflared가 `gallery.hrletsgo.me`로 연결합니다.)

### 로컬 직접 실행

Docker 없이 실행하는 스크립트는 저장소에 없습니다. 각 Dockerfile을 기준으로 다음과 같이 띄울 수 있습니다(이 방식 자체는 README 작성 시 실행해 보지 않았습니다).

```bash
# 백엔드 (Python 3.12)
cd src/backend
pip install -r requirements.txt
uvicorn app.main:app --port 8000

# 프런트엔드 (Node 20)
cd src/frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000/api npm run dev
```

## 구성

```
hr_gallery/
├── docker-compose.yml / docker-compose.dev.yml
├── .env.example
├── nginx/                      # nginx.conf (운영), nginx.dev.conf (개발)
├── src/
│   ├── backend/                # FastAPI, Python 3.12
│   │   ├── app/main.py         # 앱, CORS, /api/health, /api/libraries
│   │   ├── app/config.py       # 환경 변수 설정 (pydantic-settings)
│   │   ├── app/routers/        # googer, f2a, contextifier, anweb
│   │   ├── app/schemas/        # 요청/응답 모델
│   │   ├── samples/            # 데모용 샘플 (iris, titanic, housing CSV, contextifier 문서)
│   │   └── uploads/
│   └── frontend/               # Next.js 14 (App Router), Tailwind CSS
│       └── src/
│           ├── app/            # 홈, googer, f2a, contextifier, an-web, playleft (각 /demo 포함)
│           ├── components/     # layout, library(소개 페이지 공통 부품)
│           ├── config/libraries.tsx
│           └── lib/api.ts
├── test_gallery_libraries.py   # 라이브러리 import/버전 검사
├── test_f2a_110.py             # f2a 1.1.0 API 검사
└── test_googer_040.py          # googer 0.4.0 API 검사 (옛 버전 기준)
```

요청 흐름은 브라우저 → Nginx → `/api/*`는 백엔드, 나머지는 프런트엔드입니다. 운영 Nginx는 업로드 한도 50MB, 분석용 긴 타임아웃(300초), gzip, 보안 헤더, Cloudflare 실제 IP 복원을 설정합니다.

## 기능

- 홈에서 라이브러리 카드 목록과 라이브/예정 상태를 표시하고, 라이브러리별 소개 페이지(기능, 코드 예제, 설치 안내)를 제공합니다.
- 라이트/다크 테마 전환.
- f2a: 파일 업로드(csv, tsv, json, jsonl, parquet, xlsx, xls)·URL 분석, 번들 샘플 데이터셋 분석, HTML 리포트 조회, 언어 6종(en, ko, ja, zh, de, fr), 프리셋 4종(full, fast, basic_only, minimal).
- Contextifier: 문서 텍스트 추출, 추출 + 청킹, 번들 샘플 파일 사용.
- googer: 텍스트·이미지·뉴스·비디오 검색과 쿼리 빌더.
- an-web: 페이지 이동, 스냅샷, 추출, 정책 검사.

## 환경 변수

`.env.example` 기준(`src/backend/app/config.py`에서 읽음): `APP_NAME`, `APP_ENV`, `BACKEND_PORT`, `BACKEND_WORKERS`, `MAX_UPLOAD_SIZE_MB`, `ALLOWED_ORIGINS`(쉼표 구분 또는 JSON 배열), `NEXT_PUBLIC_API_URL`, `GOOGER_DEFAULT_REGION`, `GOOGER_DEFAULT_MAX_RESULTS`, `GOOGER_TIMEOUT`, `GOOGER_MAX_RETRIES`, `F2A_MAX_FILE_SIZE_MB`, `F2A_DEFAULT_LANG`, `F2A_UPLOAD_DIR`. Contextifier용 `CONTEXTIFIER_MAX_FILE_SIZE_MB`, `CONTEXTIFIER_UPLOAD_DIR`도 설정 클래스에는 있으나 `.env.example`에는 없습니다.

## 테스트

저장소 루트의 스크립트 3개를 직접 실행합니다(pytest 구성은 없음). 라이브러리가 설치된 가상환경이 필요합니다.

```bash
python test_gallery_libraries.py   # googer, f2a, contextifier import와 설치 버전 확인
python test_f2a_110.py
python test_googer_040.py
```

README 작성 시점에 이 스크립트들을 실행해 통과 여부를 확인하지는 않았습니다. `test_googer_040.py`는 googer 0.4.0을 전제로 하므로 현재 고정 버전(0.7.3)과 맞지 않을 수 있습니다.

## 관련 프로젝트

- [googer](https://github.com/CocoRoF/googer)
- [f2a](https://github.com/CocoRoF/f2a)
- [Contextifier](https://github.com/CocoRoF/Contextifier)
- [an-web](https://github.com/CocoRoF/an-web)
- [playwLeft](https://github.com/CocoRoF/playwLeft)

## License

Apache License 2.0. 자세한 내용은 [LICENSE](LICENSE)를 참고하세요.
