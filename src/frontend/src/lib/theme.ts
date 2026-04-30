/**
 * Theme — light / dark 모드 + 서브도메인 간 동기화
 *
 * hr_blog2.0 (hrletsgo.me) 와 동일한 cookie 정책으로 동기화됩니다.
 * Cookie: `hrletsgo_theme`, Domain=`.hrletsgo.me` → 양쪽에서 즉시 반영.
 *
 * FOUC 방지:
 *   layout 의 <head> 첫 자식으로 inline script 가 paint 이전에
 *   <html> 에 .dark 클래스를 동기 적용. React hydration 후 ThemeToggle 이
 *   그 결과를 useState 초깃값으로 사용 → hydration mismatch 없음.
 */

export type Theme = "light" | "dark";

export const COOKIE_NAME = "hrletsgo_theme";
export const COOKIE_MAX_AGE_S = 60 * 60 * 24 * 365; // 1 year

export function getCookieDomain(hostname: string | undefined): string | undefined {
    if (!hostname) return undefined;
    if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "0.0.0.0" ||
        /^\d+\.\d+\.\d+\.\d+$/.test(hostname) ||
        hostname.endsWith(".local")
    ) {
        return undefined;
    }
    if (hostname === "hrletsgo.me" || hostname.endsWith(".hrletsgo.me")) {
        return ".hrletsgo.me";
    }
    return undefined;
}

export function readThemeFromCookie(): Theme | null {
    if (typeof document === "undefined") return null;
    const m = document.cookie.match(
        new RegExp("(?:^|;\\s*)" + COOKIE_NAME + "=([^;]+)"),
    );
    if (!m) return null;
    try {
        const v = decodeURIComponent(m[1]);
        if (v === "light" || v === "dark") return v;
    } catch {
        /* ignore */
    }
    return null;
}

export function writeThemeCookie(theme: Theme): void {
    if (typeof document === "undefined") return;
    const host = window.location.hostname;
    const domain = getCookieDomain(host);
    const secure = window.location.protocol === "https:";
    const parts = [
        `${COOKIE_NAME}=${theme}`,
        `Path=/`,
        `Max-Age=${COOKIE_MAX_AGE_S}`,
        `SameSite=Lax`,
    ];
    if (domain) parts.push(`Domain=${domain}`);
    if (secure) parts.push("Secure");
    document.cookie = parts.join("; ");
}

export function getOsPreference(): Theme {
    if (typeof window === "undefined" || !window.matchMedia) return "dark";
    return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
}

export function resolveInitialTheme(): Theme {
    return readThemeFromCookie() ?? getOsPreference();
}

export function applyTheme(theme: Theme): void {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
    root.style.colorScheme = theme;
}

export function readDomTheme(): Theme {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function getThemeBootstrapScript(): string {
    return (
        "(function(){try{" +
        "var n='" + COOKIE_NAME + "';" +
        "var m=document.cookie.match(new RegExp('(?:^|;\\\\s*)'+n+'=([^;]+)'));" +
        "var t=null;if(m){try{var v=decodeURIComponent(m[1]);if(v==='light'||v==='dark')t=v;}catch(e){}}" +
        "if(t!=='light'&&t!=='dark'){" +
        "t=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark';" +
        "}" +
        "var r=document.documentElement;" +
        "if(t==='dark'){r.classList.add('dark');}else{r.classList.remove('dark');}" +
        "r.style.colorScheme=t;" +
        "}catch(e){document.documentElement.classList.add('dark');}})();"
    );
}
