import {
  Search,
  BarChart3,
  FileText,
  Globe2,
  Globe,
} from "lucide-react";
import type { LibraryMeta } from "@/types/library";

/**
 * Centralized library metadata used across intro pages, demo pages, and navigation.
 * Add a new library here and the entire UI (intro page, demo routing, etc.) will pick it up.
 */
export const LIBRARY_META: Record<string, LibraryMeta> = {
  googer: {
    id: "googer",
    name: "googer",
    version: "0.7.0",
    tagline: "Multi-Engine Web Search",
    description:
      "7개 검색 엔진을 지원하는 타입 안전한 웹 검색 라이브러리. 멀티 엔진 동시 검색, 자동 랭킹, 캐싱을 제공합니다.",
    color: "googer",
    icon: <Search size={32} />,
    languages: [{ label: "Python ≥ 3.10", className: "badge-python" }],
    license: "Apache-2.0",
    github: "https://github.com/CocoRoF/googer",
    pypi: "https://pypi.org/project/googer/",
    hasDemo: true,
  },
  f2a: {
    id: "f2a",
    name: "f2a",
    version: "1.1.1",
    tagline: "File to Analysis",
    description:
      "어떤 데이터 소스에서든 자동으로 기술 통계 분석과 시각화를 수행합니다. 23가지 분석 모듈과 6개국어 HTML 리포트를 지원합니다.",
    color: "f2a",
    icon: <BarChart3 size={32} />,
    languages: [{ label: "Python ≥ 3.10", className: "badge-python" }],
    license: "Apache-2.0",
    github: "https://github.com/CocoRoF/f2a",
    pypi: "https://pypi.org/project/f2a/",
    hasDemo: true,
  },
  contextifier: {
    id: "contextifier",
    name: "Contextifier",
    version: "0.2.4",
    tagline: "Document → AI Context",
    description:
      "다양한 문서 포맷을 AI가 이해할 수 있는 구조화된 텍스트로 변환합니다. 5단계 균일 파이프라인으로 모든 문서 포맷에 일관된 결과를 제공합니다.",
    color: "contextifier",
    icon: <FileText size={32} />,
    languages: [{ label: "Python ≥ 3.12", className: "badge-python" }],
    license: "Apache-2.0",
    github: "https://github.com/CocoRoF/Contextifier",
    pypi: "https://pypi.org/project/contextifier/",
    hasDemo: true,
  },
  playleft: {
    id: "playleft",
    name: "playwLeft",
    version: "0.1.0",
    tagline: "Rust Browser Automation",
    description:
      "Rust로 구축된 에이전트 중심의 브라우저 자동화 툴킷. Playwright의 대안으로, CDP 프로토콜 기반의 네이티브 성능을 제공합니다.",
    color: "playleft",
    icon: <Globe2 size={32} />,
    languages: [
      { label: "Rust", className: "badge-rust" },
      { label: "Python ≥ 3.10", className: "badge-python" },
    ],
    license: "Apache-2.0",
    github: "https://github.com/CocoRoF/playwLeft",
    pypi: null,
    hasDemo: false,
    status: "Alpha",
  },
  anweb: {
    id: "an-web",
    name: "an-web",
    version: "0.4.1",
    tagline: "AI-Native Web Browser Engine",
    description:
      "AI 에이전트를 위한 시맨틱 우선 헤드리스 브라우저 엔진. 픽셀 렌더링 없이 웹 페이지를 구조화된 데이터로 변환합니다.",
    color: "anweb",
    icon: <Globe size={32} />,
    languages: [{ label: "Python ≥ 3.12", className: "badge-python" }],
    license: "Apache-2.0",
    github: "https://github.com/CocoRoF/an-web",
    pypi: "https://pypi.org/project/an-web/",
    hasDemo: true,
  },
};

/** Ordered list of library IDs for navigation and gallery display */
export const LIBRARY_ORDER = ["googer", "f2a", "contextifier", "playleft", "anweb"] as const;
