import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SkyTheme = "night" | "day";
export type SkyMode = "auto" | "day" | "night";

/** Daytime runs 06:00 – 18:00 local time. */
export function themeForNow(d = new Date()): SkyTheme {
  const hour = d.getHours();
  return hour >= 6 && hour < 18 ? "day" : "night";
}

const ThemeContext = createContext<{
  theme: SkyTheme;
  mode: SkyMode;
  setMode: (m: SkyMode) => void;
  toggle: () => void;
}>({ theme: "night", mode: "night", setMode: () => {}, toggle: () => {} });

export function useSkyTheme() {
  return useContext(ThemeContext);
}

export function SkyThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<SkyMode>("night");
  const [autoTheme, setAutoTheme] = useState<SkyTheme>("night");

  useEffect(() => {
    const saved = window.localStorage.getItem("sky-mode");
    if (saved === "day" || saved === "night" || saved === "auto") setModeState(saved);
    setAutoTheme(themeForNow());
  }, []);

  // Re-evaluate local time every minute while in auto mode.
  useEffect(() => {
    if (mode !== "auto") return;
    setAutoTheme(themeForNow());
    const id = window.setInterval(() => setAutoTheme(themeForNow()), 60_000);
    return () => window.clearInterval(id);
  }, [mode]);

  const theme: SkyTheme = mode === "auto" ? autoTheme : mode;

  useEffect(() => {
    document.documentElement.classList.toggle("day-mode", theme === "day");
  }, [theme]);

  const setMode = useCallback((m: SkyMode) => {
    setModeState(m);
    try {
      window.localStorage.setItem("sky-mode", m);
    } catch {
      // ignore
    }
  }, []);

  // Cycle: auto -> day -> night -> auto
  const toggle = useCallback(() => {
    setModeState((m) => {
      const next: SkyMode = m === "auto" ? "day" : m === "day" ? "night" : "auto";
      try {
        window.localStorage.setItem("sky-mode", next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, mode, setMode, toggle }), [theme, mode, setMode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
