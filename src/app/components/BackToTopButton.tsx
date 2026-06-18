import { useEffect, useState } from "react";

type BackToTopButtonProps = {
  isEnabled: boolean;
};

/**
 * Small helper for long reading/list pages.
 * It stays hidden until the page has scrolled far enough to make returning useful.
 */
export function BackToTopButton({ isEnabled }: BackToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isEnabled) {
      setIsVisible(false);
      return;
    }

    function updateVisibility() {
      setIsVisible(window.scrollY > 400);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, [isEnabled]);

  if (!isEnabled || !isVisible) return null;

  return (
    <button
      aria-label="Back to top"
      className="fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-slate-300 bg-white/90 text-lg font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950 dark:hover:text-blue-200"
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
}
