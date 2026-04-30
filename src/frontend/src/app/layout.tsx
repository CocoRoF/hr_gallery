import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getThemeBootstrapScript } from "@/lib/theme";

export const metadata: Metadata = {
  title: {
    default: "Gallery | AI Engineer Jang",
    template: "%s | Gallery — AI Engineer Jang",
  },
  description:
    "googer, f2a, Contextifier, playwLeft — CocoRoF 오픈소스 라이브러리 갤러리",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 초기 className="dark" 는 SSR 안전한 기본값. inline script 가 cookie/OS
    // 선호를 읽어 light 면 paint 직전에 className 을 light 로 즉시 조정.
    // suppressHydrationWarning: 클라이언트가 className 을 변형해도 React 무경고.
    <html lang="ko" className="dark" suppressHydrationWarning>
      <head>
        {/* FOUC 방지: paint-blocking inline script.
            Domain=.hrletsgo.me cookie 로 hr_blog2.0 와 양방향 동기화. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: getThemeBootstrapScript() }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-primary text-text-primary font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
