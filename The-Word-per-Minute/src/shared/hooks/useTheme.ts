import { useEffect, useState } from "react";
import type { Theme } from "../../types/theme";

/**
 * Owns the browser theme preference and mirrors it onto the document root.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem("theme");
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

  return { theme, toggleTheme };
}
