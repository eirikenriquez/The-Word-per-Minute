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
 * First-screen category picker for choosing the next practice direction.
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
    <section className="grid gap-4">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-slate-500">Quiet typing practice</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Slow down with scripture and build your rhythm.
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-700">
              Start with a passage chosen for you, read through a chapter, or return to verses you have saved
              for memorisation.
            </p>
          </div>

          <button
            className="w-fit rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            type="button"
            onClick={onStartFeatured}
          >
            Start Practice
          </button>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        <HomeCard
          description="Start with a curated scripture prompt"
          label="Practice"
          meta={`${totalFeaturedPassages} passages`}
          onSelect={onStartFeatured}
        />
        <HomeCard
          description="Read and select verses"
          label="Bible"
          meta="Book and chapter"
          onSelect={onOpenBible}
        />
        <HomeCard
          description="Your practice library"
          disabled={!hasSavedPassages}
          label="Library"
          meta={`${savedPassageCount} saved`}
          onSelect={onOpenLibrary}
        />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Featured Categories</h3>
            <p className="mt-1 text-sm text-slate-600">Choose a theme when you want a more focused passage.</p>
          </div>
          <span className="text-sm font-medium text-slate-500">{featuredCategories.length} themes</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category) => (
            <HomeCard
              description="Featured passage set"
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

type HomeCardProps = {
  description: string;
  disabled?: boolean;
  label: string;
  meta: string;
  onSelect: () => void;
};

function HomeCard({ description, disabled = false, label, meta, onSelect }: HomeCardProps) {
  return (
    <button
      className="group min-h-32 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-400 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      <span className="mb-4 inline-flex rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700">
        {meta}
      </span>
      <span className="block text-lg font-bold text-slate-950 group-disabled:text-slate-400">{label}</span>
      <span className="mt-2 block text-sm text-slate-600">{description}</span>
    </button>
  );
}
