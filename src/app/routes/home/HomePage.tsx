import {
  ArrowRightIcon,
  BookOpenIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
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
  savedPassageCount: number;
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
  savedPassageCount,
  onCreateAccount,
  onOpenBible,
  onPracticeFeaturedPassage,
  onSelectFeaturedCategory,
  onStartFeaturedPractice,
}: HomePageProps) {
  const totalFeaturedPassages = featuredHomeCategories.reduce(
    (total, category) => total + category.count,
    0,
  );
  const secondaryStat =
    savedPassageCount > 0
      ? { label: 'Saved passages', value: savedPassageCount }
      : { label: 'Themes', value: featuredHomeCategories.length };

  return (
    <section className="grid gap-10">
      <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center lg:py-12">
        <div className="rise-in mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-ink sm:text-5xl">
            Type a Bible passage,
            <span className="block">one word at a time.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
            Choose from curated passages, browse the Bible, or return to
            something you have saved. See your accuracy and progress as you
            type.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="primary" onClick={onStartFeaturedPractice}>
              <SparklesIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
              Start typing
            </Button>
            <Button variant="secondary" onClick={onOpenBible}>
              <BookOpenIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
              Browse the Bible
            </Button>
          </div>
        </div>

        <dl className="rise-in rise-in-delay-1 grid grid-cols-2 gap-6 border-t border-line pt-6 text-left lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <dt className="text-sm font-medium text-ink-subtle">
              Curated passages
            </dt>
            <dd className="mt-1 text-4xl font-bold text-ink">
              {totalFeaturedPassages}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-ink-subtle">
              {secondaryStat.label}
            </dt>
            <dd className="mt-1 text-4xl font-bold text-ink">
              {secondaryStat.value}
            </dd>
          </div>
        </dl>
      </section>

      <section className="grid">
        <FeaturedPassagePreview
          error={featuredPassageError}
          isLoading={isFeaturedPassageLoading}
          onPractice={onPracticeFeaturedPassage}
          passageResponse={featuredPassageResponse}
        />
      </section>

      <section className="rise-in rise-in-delay-2 grid gap-4 border-t border-line pt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
              Practice by theme
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Pick a theme when you want a more focused passage.
            </p>
          </div>
        </div>
        <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
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
        <section className="rise-in rise-in-delay-3 border-t border-line py-10">
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
    <article className="rise-in rise-in-delay-1 rounded-xl border border-line bg-surface p-6 shadow-lg shadow-black/5 dark:shadow-black/20 sm:p-8">
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
          <div className="mt-7 flex flex-col items-start gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-xs font-semibold text-ink-subtle">
              {passageResponse.translation.name}
            </p>
            <button
              className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink transition hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              type="button"
              onClick={onPractice}
            >
              Practice this passage
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
            </button>
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
