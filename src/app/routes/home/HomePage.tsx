import { ArrowRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import type { PassageResponse } from '../../../types/passage';
import { Button } from '../../../components/ui/Button';

export type HomeCategory = {
  count: number;
  label: string;
};

export type HomePageProps = {
  featuredHomeCategories: HomeCategory[];
  featuredPassageError: string | null;
  featuredPassageResponse: PassageResponse | null;
  isFeaturedPassageLoading: boolean;
  isSignedIn: boolean;
  onCreateAccount: () => void;
  onOpenBible: () => void;
  onPracticeFeaturedPassage: () => void;
  onSelectFeaturedCategory: (category: string) => void;
  onStartFeaturedPractice: () => void;
};

/**
 * Home page for choosing a practice source or opening the reader/library.
 */
export function HomePage({
  featuredHomeCategories,
  featuredPassageError,
  featuredPassageResponse,
  isFeaturedPassageLoading,
  isSignedIn,
  onCreateAccount,
  onOpenBible,
  onPracticeFeaturedPassage,
  onSelectFeaturedCategory,
  onStartFeaturedPractice,
}: HomePageProps) {
  const homePageRef = useRef<HTMLElement>(null);
  const totalFeaturedPassages = featuredHomeCategories.reduce(
    (total, category) => total + category.count,
    0,
  );

  useEffect(() => {
    const homePage = homePageRef.current;
    if (!homePage) return;

    const revealTargets = homePage.querySelectorAll<HTMLElement>(
      '[data-scroll-reveal]',
    );
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((target) =>
        target.classList.add('scroll-reveal-visible'),
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('scroll-reveal-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -60px', threshold: 0.12 },
    );

    revealTargets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={homePageRef} className="grid gap-10">
      <section className="grid items-center gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(26rem,32rem)] lg:gap-16 lg:py-12">
        <div className="rise-in max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-subtle">
            Scripture-first typing practice
          </p>
          <h1 className="text-4xl font-bold text-ink sm:text-5xl">
            Type a Bible passage,
            <span className="block">one word at a time.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
            Choose from curated passages, browse the Bible, or return to
            something you have saved. See your accuracy and progress as you
            type.
          </p>
          <dl className="rise-in rise-in-delay-1 mt-7 grid w-full max-w-sm grid-cols-2 gap-6 border-y border-line py-4">
            <div>
              <dt className="text-sm font-medium text-ink-subtle">
                Curated passages
              </dt>
              <dd className="mt-1 text-4xl font-bold text-ink">
                <CountUpNumber value={totalFeaturedPassages} />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-ink-subtle">Themes</dt>
              <dd className="mt-1 text-4xl font-bold text-ink">
                <CountUpNumber value={featuredHomeCategories.length} />
              </dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button
              className="min-h-[50px] !rounded-[9px] !border-accent !bg-accent px-5 !text-base !font-bold !text-white shadow-lg shadow-accent/20 hover:-translate-y-px hover:!border-accent-ink hover:!bg-accent-ink dark:!text-stone-950 dark:hover:!text-stone-950"
              variant="primary"
              onClick={onStartFeaturedPractice}
            >
              Start typing
              <ArrowRightIcon
                aria-hidden="true"
                className="h-[18px] w-[18px]"
              />
            </Button>
            <Button
              className="min-h-11 px-0"
              variant="ghost"
              onClick={onOpenBible}
            >
              <BookOpenIcon aria-hidden="true" className="h-4 w-4" />
              Browse the Bible
            </Button>
          </div>
        </div>

        <FeaturedPassagePreview
          error={featuredPassageError}
          isLoading={isFeaturedPassageLoading}
          onPractice={onPracticeFeaturedPassage}
          passageResponse={featuredPassageResponse}
        />
      </section>

      <section
        className="scroll-reveal grid gap-6 border-t border-line pt-8"
        data-scroll-reveal
      >
        <div className="grid gap-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,0.7fr)] lg:items-end lg:gap-8">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
            Practice by theme
          </h2>
          <p className="max-w-md text-sm leading-6 text-ink-muted lg:justify-self-end">
            Pick a theme when you want a more focused passage.
          </p>
        </div>
        <div className="grid border-t border-line lg:grid-cols-2 lg:gap-x-8">
          {featuredHomeCategories.map((category) => (
            <HomeCategoryButton
              key={category.label}
              label={category.label}
              meta={`${category.count} ${category.count === 1 ? 'passage' : 'passages'}`}
              onSelect={() => onSelectFeaturedCategory(category.label)}
            />
          ))}
        </div>
      </section>

      {!isSignedIn && (
        <section
          className="scroll-reveal border-t border-line py-10"
          data-scroll-reveal
        >
          <div className="mx-auto grid max-w-xl justify-items-center gap-5 text-center">
            <div className="grid gap-2">
              <h2 className="text-xl font-semibold text-ink">
                Keep your practice with you.
              </h2>
              <p className="text-base leading-7 text-ink-muted">
                Create a free account to sync saved passages and keep your
                practice history across devices.
              </p>
            </div>
            <Button variant="primary" onClick={onCreateAccount}>
              Create free account
            </Button>
          </div>
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
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let animationFrameId = 0;
    let startTime: number | null = null;

    function updateCount(currentTime: number) {
      startTime ??= currentTime;
      const progress = Math.min((currentTime - startTime) / durationMs, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1)
        animationFrameId = window.requestAnimationFrame(updateCount);
    }

    animationFrameId = window.requestAnimationFrame(updateCount);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [durationMs, value]);

  return displayValue;
}

type FeaturedPassagePreviewProps = {
  error: string | null;
  isLoading: boolean;
  onPractice: () => void;
  passageResponse: PassageResponse | null;
};

function FeaturedPassagePreview({
  error,
  isLoading,
  onPractice,
  passageResponse,
}: FeaturedPassagePreviewProps) {
  const passageText = passageResponse?.verses
    .map((verse) => verse.text)
    .join(' ');
  const [firstWord, ...remainingWords] = passageText?.split(' ') ?? [];

  return (
    <article className="rise-in rise-in-delay-1 mx-auto w-full max-w-5xl rounded-xl border border-line bg-surface p-6 shadow-lg shadow-black/5 dark:shadow-black/20 sm:p-8">
      {passageResponse ? (
        <>
          <div className="flex min-w-0 items-center justify-between gap-2">
            <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Featured passage
            </p>
            <p className="max-w-[55%] shrink-0 truncate rounded-full border border-line px-2 py-1 text-xs font-semibold text-ink-subtle">
              {passageResponse.passage.theme}
            </p>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-ink">
            {passageResponse.passage.title}
          </h2>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            {passageResponse.reference}
          </p>
          <blockquote className="mt-6 line-clamp-6 max-h-[14rem] max-w-prose overflow-hidden font-reading text-[1.375rem] leading-[1.6] tracking-[-0.012em] text-ink">
            <span className="relative whitespace-nowrap before:absolute before:top-[0.18em] before:bottom-[0.12em] before:-left-2 before:w-[3px] before:rounded-full before:bg-accent">
              {firstWord}
            </span>
            {remainingWords.length > 0 && ` ${remainingWords.join(' ')}`}
          </blockquote>
          <div className="mt-7 flex flex-col items-start gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-xs font-semibold text-ink-subtle">
              {passageResponse.translation.name}
            </p>
            <Button className="min-h-12" variant="primary" onClick={onPractice}>
              Practice this passage
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="grid min-h-64 place-content-center gap-2 text-center">
          <p className="text-sm font-semibold text-ink-subtle">
            {isLoading
              ? 'Loading a featured passage...'
              : 'Featured passage unavailable'}
          </p>
          {error && <p className="text-sm text-ink-muted">{error}</p>}
        </div>
      )}
    </article>
  );
}

type HomeCategoryButtonProps = {
  label: string;
  meta: string;
  onSelect: () => void;
};

function HomeCategoryButton({
  label,
  meta,
  onSelect,
}: HomeCategoryButtonProps) {
  return (
    <button
      className="group grid min-h-[76px] min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-b border-line px-1 text-left transition-colors duration-150 hover:border-accent-line hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas motion-reduce:transition-none"
      type="button"
      onClick={onSelect}
    >
      <span className="min-w-0 whitespace-nowrap text-sm font-semibold text-ink">
        {label}
      </span>
      <span className="text-sm text-ink-subtle">{meta}</span>
      <ArrowRightIcon
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-ink-subtle transition-transform duration-150 group-hover:translate-x-1 group-hover:text-accent motion-reduce:transform-none motion-reduce:transition-none"
      />
    </button>
  );
}
