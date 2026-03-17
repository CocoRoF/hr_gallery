import Link from "next/link";
import {
  Search,
  BarChart3,
  Zap,
  Globe,
  Image,
  Newspaper,
  Video,
  FileSpreadsheet,
  Languages,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-accent via-f2a to-googer bg-clip-text text-transparent">
                HR Gallery
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
              Rust로 구동되는 Python 라이브러리{" "}
              <span className="font-semibold text-googer-light">googer</span>와{" "}
              <span className="font-semibold text-f2a-light">f2a</span>를
              <br />
              직접 체험할 수 있는 인터랙티브 플레이그라운드입니다.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/googer" className="btn-googer text-base">
                <Search size={18} />
                googer 데모
              </Link>
              <Link href="/f2a" className="btn-f2a text-base">
                <BarChart3 size={18} />
                f2a 데모
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Library Cards ─── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* googer */}
          <div className="card-hover group">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-googer/15 text-googer transition-transform group-hover:scale-110">
                <Search size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-100">googer</h2>
                  <span className="badge-googer">v0.2.5</span>
                  <span className="badge-rust">Rust</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  강력하고 타입 안전한 Google 검색 라이브러리. Rust 코어로 최대
                  성능을 발휘합니다.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <FeaturePill icon={<Globe size={14} />} text="웹 검색" />
              <FeaturePill icon={<Image size={14} />} text="이미지 검색" />
              <FeaturePill icon={<Newspaper size={14} />} text="뉴스 검색" />
              <FeaturePill icon={<Video size={14} />} text="비디오 검색" />
            </div>

            <div className="mt-6 rounded-lg bg-surface-100 p-4 font-mono text-sm text-gray-400">
              <div className="text-surface-500"># Quick start</div>
              <div>
                <span className="text-f2a-light">from</span>{" "}
                <span className="text-accent">googer</span>{" "}
                <span className="text-f2a-light">import</span> Googer
              </div>
              <div className="mt-1">
                results = Googer().search(
                <span className="text-googer-light">&quot;python&quot;</span>)
              </div>
            </div>

            <Link
              href="/googer"
              className="mt-6 flex items-center gap-2 text-sm font-medium text-googer-light transition-colors hover:text-googer"
            >
              데모 시작하기 <ArrowRight size={14} />
            </Link>
          </div>

          {/* f2a */}
          <div className="card-hover group">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-f2a/15 text-f2a transition-transform group-hover:scale-110">
                <BarChart3 size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-100">f2a</h2>
                  <span className="badge-f2a">v1.0.3</span>
                  <span className="badge-rust">Rust</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  File to Analysis — 어떤 데이터 소스에서든 자동으로 기술 통계
                  분석과 시각화를 수행합니다.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <FeaturePill
                icon={<FileSpreadsheet size={14} />}
                text="21가지 분석"
              />
              <FeaturePill icon={<Zap size={14} />} text="원클릭 분석" />
              <FeaturePill
                icon={<Languages size={14} />}
                text="6개국어 리포트"
              />
              <FeaturePill icon={<BarChart3 size={14} />} text="HTML 리포트" />
            </div>

            <div className="mt-6 rounded-lg bg-surface-100 p-4 font-mono text-sm text-gray-400">
              <div className="text-surface-500"># Quick start</div>
              <div>
                <span className="text-f2a-light">import</span>{" "}
                <span className="text-accent">f2a</span>
              </div>
              <div className="mt-1">
                report = f2a.analyze(
                <span className="text-googer-light">&quot;data.csv&quot;</span>)
              </div>
            </div>

            <Link
              href="/f2a"
              className="mt-6 flex items-center gap-2 text-sm font-medium text-f2a-light transition-colors hover:text-f2a"
            >
              데모 시작하기 <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="border-t border-surface-300 bg-surface-50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-100 sm:text-3xl">
            왜 HR Gallery인가?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-gray-400">
            라이브러리를 설치하지 않아도, 브라우저에서 바로 체험할 수 있습니다.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="인터랙티브 데모"
              description="검색 쿼리를 입력하거나 파일을 업로드하여 실시간으로 라이브러리 기능을 체험하세요."
            />
            <FeatureCard
              title="Rust-Powered 성능"
              description="googer와 f2a 모두 Rust 코어로 구동되어 빠른 속도를 제공합니다."
            />
            <FeatureCard
              title="다양한 검색 타입"
              description="웹, 이미지, 뉴스, 비디오 — 4가지 타입의 Google 검색을 지원합니다."
            />
            <FeatureCard
              title="21가지 분석 모듈"
              description="기술통계, 상관분석, 이상치 탐지, 클러스터링 등 21가지 분석을 한 번에."
            />
            <FeatureCard
              title="6개국어 리포트"
              description="f2a 분석 결과를 한국어, 영어, 일본어 등 6개 언어로 생성합니다."
            />
            <FeatureCard
              title="샘플 데이터"
              description="내장 샘플 데이터셋으로 설치 없이 바로 분석을 시작하세요."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturePill({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface-100 px-3 py-2 text-xs text-gray-400">
      {icon}
      {text}
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="card">
      <h3 className="text-base font-semibold text-gray-100">{title}</h3>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
}
