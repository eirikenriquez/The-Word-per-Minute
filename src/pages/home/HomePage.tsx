import { BookOpenIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Button } from "../../shared/ui/Button";

export type HomeCategory = {
  count: number;
  label: string;
};

export type HomePageProps = {
  featuredHomeCategories: HomeCategory[];
  isSignedIn: boolean;
  savedPassageCount: number;
  onCreateAccount: () => void;
  onOpenBible: () => void;
  onSelectFeaturedCategory: (category: string) => void;
  onStartFeaturedPractice: () => void;
};

/**
 * Home page for choosing a practice source or opening the reader/library.
 */
export function HomePage({
  featuredHomeCategories,
  isSignedIn,
  savedPassageCount,
  onCreateAccount,
  onOpenBible,
  onSelectFeaturedCategory,
  onStartFeaturedPractice,
}: HomePageProps) {
  const totalFeaturedPassages = featuredHomeCategories.reduce(
    (total, category) => total + category.count,
    0,
  );
  return (
    <section className="grid gap-10">
      <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center lg:py-12">
        <div className="rise-in max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
            Quiet typing practice
          </p>
          <h2 className="mt-3 text-4xl font-bold text-ink sm:text-5xl">
            Slow down with scripture and build your rhythm.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
            Start with a passage chosen for you, read through a chapter, or
            return to verses you have saved for memorisation.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="primary" onClick={onStartFeaturedPractice}>
              <SparklesIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
              Start practising
            </Button>
            <Button variant="secondary" onClick={onOpenBible}>
              <BookOpenIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
              Read the Bible
            </Button>
          </div>
        </div>

        <dl className="rise-in rise-in-delay-1 grid grid-cols-2 gap-6 border-t border-line pt-6 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <dt className="text-sm font-medium text-ink-subtle">Curated passages</dt>
            <dd className="mt-1 text-4xl font-bold text-ink">
              <CountUpNumber value={totalFeaturedPassages} />
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-ink-subtle">Saved passages</dt>
            <dd className="mt-1 text-4xl font-bold text-ink">
              <CountUpNumber value={savedPassageCount} />
            </dd>
          </div>
        </dl>
      </section>

      <section className="rise-in rise-in-delay-2 grid gap-4 border-t border-line pt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
              Practice by theme
            </h3>
            <p className="mt-2 text-sm text-ink-muted">
              Pick a theme when you want a more focused passage.
            </p>
          </div>
          <span className="text-sm font-medium text-ink-subtle">
            {featuredHomeCategories.length} themes
          </span>
        </div>
        <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
          {featuredHomeCategories.map((category) => (
            <HomeCategoryButton
              key={category.label}
              label={category.label}
              meta={`${category.count} ${category.count === 1 ? "passage" : "passages"}`}
              onSelect={() => onSelectFeaturedCategory(category.label)}
            />
          ))}
        </div>
      </section>

      {!isSignedIn && (
        <section className="rise-in rise-in-delay-3 mx-auto grid max-w-2xl justify-items-center gap-4 border-t border-line pt-8 text-center">
          <div className="grid gap-2">
            <h3 className="font-semibold text-ink">
              Keep your passages and progress with you.
            </h3>
            <p className="text-sm leading-6 text-ink-muted">
              Create a free account to sync saved passages and start keeping a
              cloud practice history.
            </p>
          </div>
          <Button variant="primary" onClick={onCreateAccount}>
            Create account
          </Button>
        </section>
      )}
    </section>
  );
}

type CountUpNumberProps = {
  durationMs?: number;
  value: number;
};

function CountUpNumber({ durationMs = 950, value }: CountUpNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId = 0;
    let startTime: number | null = null;

    function updateCount(currentTime: number) {
      startTime ??= currentTime;
      const progress = Math.min((currentTime - startTime) / durationMs, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1) animationFrameId = window.requestAnimationFrame(updateCount);
    }

    animationFrameId = window.requestAnimationFrame(updateCount);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [durationMs, value]);

  return displayValue;
}

type HomeCategoryButtonProps = {
  label: string;
  meta: string;
  onSelect: () => void;
};

function HomeCategoryButton({ label, meta, onSelect }: HomeCategoryButtonProps) {
  return (
    <button
      className="soft-hover group flex items-center justify-between gap-4 border-b border-line py-3 text-left hover:border-accent-line"
      type="button"
      onClick={onSelect}
    >
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="mt-1 block text-xs text-ink-subtle">{meta}</span>
      </span>
      <span className="text-sm text-ink-subtle transition group-hover:translate-x-1 group-hover:text-accent">
        Start
      </span>
    </button>
  );
}
