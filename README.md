# HR Gallery — Library Playground

> **googer** 0.2.5 · **f2a** 1.0.3 데모 & 갤러리 플레이그라운드

## 프로젝트 구조

```
hr_gallery/
├── docker-compose.yml          # Production
├── docker-compose.dev.yml      # Development (hot-reload)
├── .env.example
├── nginx/
│   ├── nginx.conf              # Production
│   └── nginx.dev.conf          # Development
├── src/
│   ├── backend/                # FastAPI (Python 3.12)
│   │   ├── Dockerfile
│   │   ├── Dockerfile.dev
│   │   ├── requirements.txt
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── config.py
│   │   │   ├── routers/
│   │   │   │   ├── googer.py
│   │   │   │   └── f2a.py
│   │   │   └── schemas/
│   │   │       ├── googer.py
│   │   │       └── f2a.py
│   │   └── uploads/
│   └── frontend/               # Next.js 14 (App Router)
│       ├── Dockerfile
│       ├── Dockerfile.dev
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       ├── postcss.config.js
│       ├── public/
│       └── src/
│           ├── app/
│           │   ├── layout.tsx
│           │   ├── page.tsx
│           │   ├── googer/
│           │   │   └── page.tsx
│           │   └── f2a/
│           │       └── page.tsx
│           ├── components/
│           │   ├── layout/
│           │   ├── googer/
│           │   └── f2a/
│           └── lib/
│               └── api.ts
```

## Quick Start

### Development

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs
- Gallery (via Nginx): http://localhost:80

### Production

```bash
cp .env.example .env
# Edit .env for production values
docker compose up --build -d
```

- Gallery: http://localhost:80

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.12 |
| Proxy | Nginx |
| Container | Docker Compose |

## Libraries

- **[googer](https://pypi.org/project/googer/)** 0.2.5 — Type-safe Google Search (Rust-powered)
- **[f2a](https://pypi.org/project/f2a/)** 1.0.3 — Automatic statistical analysis from any data source (Rust-powered)

## License

MIT
