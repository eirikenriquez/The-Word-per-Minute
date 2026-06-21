import { ArrowUpIcon } from "@heroicons/react/24/outline";
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
      className="fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-surface/90 text-ink-muted shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-accent-line hover:bg-accent-soft hover:text-accent-ink"
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUpIcon aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}
