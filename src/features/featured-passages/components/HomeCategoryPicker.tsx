type HomeCategory = {
  count: number;
  label: string;
};

type HomeCategoryPickerProps = {
  featuredCategories: HomeCategory[];
  hasSavedPassages: boolean;
  savedPassageCount: number;
  onOpenBible: () => void;
  onOpenLibrary: () => void;
  onStartFeatured: () => void;
  onStartFeaturedCategory: (category: string) => void;
};

/**
 * First-screen entry point for the app.
 * The page uses open sections for the main content and reserves card-like styling for selectable items.
 */
export function HomeCategoryPicker({
  featuredCategories,
  hasSavedPassages,
  savedPassageCount,
  onOpenBible,
  onOpenLibrary,
  onStartFeatured,
  onStartFeaturedCategory,
}: HomeCategoryPickerProps) {
  const totalFeaturedPassages = featuredCategories.reduce((total, category) => total + category.count, 0);

  return (
    <section className="grid gap-10">
      <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center lg:py-12">
        <div className="rise-in max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Quiet typing practice</p>
          <h2 className="mt-3 text-4xl font-bold text-slate-950 sm:text-5xl dark:text-slate-100">
            Slow down with scripture and build your rhythm.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300">
            Start with a passage chosen for you, read through a chapter, or return to verses you have saved
            for memorisation.
          </p>
        </div>

        <dl className="rise-in rise-in-delay-1 grid grid-cols-2 gap-6 border-t border-slate-200 pt-6 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-slate-800">
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Curated passages</dt>
            <dd className="mt-1 text-4xl font-bold text-slate-950 dark:text-slate-100">{totalFeaturedPassages}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Saved passages</dt>
            <dd className="mt-1 text-4xl font-bold text-slate-950 dark:text-slate-100">{savedPassageCount}</dd>
          </div>
        </dl>
      </section>

      <section className="rise-in rise-in-delay-2 grid gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Practice paths</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Choose the kind of session you want to start.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <HomePathButton
            description="Start with a curated scripture prompt"
            label="Featured"
            meta={`${totalFeaturedPassages} passages`}
            onSelect={onStartFeatured}
          />
          <HomePathButton
            description="Read and select verses"
            label="Bible"
            meta="Book and chapter"
            onSelect={onOpenBible}
          />
          <HomePathButton
            description="Your practice library"
            disabled={!hasSavedPassages}
            label="Library"
            meta={`${savedPassageCount} saved`}
            onSelect={onOpenLibrary}
          />
        </div>
      </section>

      <section className="rise-in rise-in-delay-3 grid gap-4 border-t border-slate-200 pt-8 dark:border-slate-800">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Featured categories</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Pick a theme when you want a more focused passage.</p>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{featuredCategories.length} themes</span>
        </div>
        <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category) => (
            <HomeCategoryButton
              key={category.label}
              label={category.label}
              meta={`${category.count} ${category.count === 1 ? "passage" : "passages"}`}
              onSelect={() => onStartFeaturedCategory(category.label)}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

type HomePathButtonProps = {
  description: string;
  disabled?: boolean;
  label: string;
  meta: string;
  onSelect: () => void;
};

function HomePathButton({ description, disabled = false, label, meta, onSelect }: HomePathButtonProps) {
  return (
    <button
      className="soft-hover group rounded-lg border border-slate-200 bg-white p-4 text-left hover:border-blue-200 hover:shadow-sm disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:shadow-none dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800 dark:disabled:bg-slate-900/60"
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      <span className="block text-base font-bold text-slate-950 group-disabled:text-slate-400 dark:text-slate-100">{label}</span>
      <span className="mt-2 block text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</span>
      <span className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{meta}</span>
    </button>
  );
}

type HomeCategoryButtonProps = {
  label: string;
  meta: string;
  onSelect: () => void;
};

function HomeCategoryButton({ label, meta, onSelect }: HomeCategoryButtonProps) {
  return (
    <button
      className="soft-hover group flex items-center justify-between gap-4 border-b border-slate-200 py-3 text-left hover:border-blue-200 dark:border-slate-800 dark:hover:border-blue-800"
      type="button"
      onClick={onSelect}
    >
      <span>
        <span className="block text-sm font-semibold text-slate-950 dark:text-slate-100">{label}</span>
        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{meta}</span>
      </span>
      <span className="text-sm text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700 dark:group-hover:text-blue-300">Start</span>
    </button>
  );
}
