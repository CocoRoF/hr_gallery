"use client";

import { useCallback, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    applyTheme,
    readDomTheme,
    readThemeFromCookie,
    writeThemeCookie,
    type Theme,
} from "@/lib/theme";

/**
 * 라이트/다크 모드 토글 (hr_blog2.0 과 동일 동작).
 *
 * - mount 시 <html>.dark 클래스 확인 (FOUC inline script 가 이미 동기 적용해둠)
 * - 클릭 → 반대 테마로 전환 + cookie 갱신 (Domain=.hrletsgo.me 자동)
 * - 다른 탭/도메인에서 변경 → window focus + visibilitychange 시 cookie 재확인
 * - hydration mismatch 방지: mount 전엔 placeholder
 */
export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        setTheme(readDomTheme());
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const sync = () => {
            const fromCookie = readThemeFromCookie();
            const current = readDomTheme();
            if (fromCookie && fromCookie !== current) {
                applyTheme(fromCookie);
                setTheme(fromCookie);
            }
        };
        const onVisibility = () => {
            if (document.visibilityState === "visible") sync();
        };
        window.addEventListener("focus", sync);
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            window.removeEventListener("focus", sync);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [mounted]);

    const toggle = useCallback(() => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        applyTheme(next);
        writeThemeCookie(next);
        setTheme(next);
    }, [theme]);

    if (!mounted) {
        return (
            <div
                aria-hidden="true"
                className="h-8 w-8 rounded-lg border border-border opacity-0"
            />
        );
    }

    const isDark = theme === "dark";
    const label = isDark ? "라이트 모드로 전환" : "다크 모드로 전환";

    return (
        <button
            type="button"
            onClick={toggle}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-card text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors overflow-hidden"
            aria-label={label}
            title={label}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.span
                        key="moon"
                        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Moon className="h-4 w-4" />
                    </motion.span>
                ) : (
                    <motion.span
                        key="sun"
                        initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Sun className="h-4 w-4" />
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
}
