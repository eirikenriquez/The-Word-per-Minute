type HomeCategory = {
  count: number;
  label: string;
};

type HomeCategoryPickerProps = {
  featuredCategories: HomeCategory[];
  hasSavedPassages: boolean;
  savedPassageCount: number;
  onOpenBible: () => void;
  onOpenSaved: () => void;
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
  onOpenSaved,
  onStartFeatured,
  onStartFeaturedCategory,
}: HomeCategoryPickerProps) {
  return (
    <section className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        <HomeCard
          description="Curated scripture prompts"
          label="Featured"
          meta={`${featuredCategories.reduce((total, category) => total + category.count, 0)} passages`}
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
          label="Saved"
          meta={`${savedPassageCount} saved`}
          onSelect={onOpenSaved}
        />
      </div>

      <section className="rounded-lg border bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">Categories</h3>
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
      className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      <span className="block text-base font-bold text-slate-900">{label}</span>
      <span className="mt-2 block text-sm text-slate-600">{description}</span>
      <span className="mt-4 block text-xs font-semibold uppercase text-slate-500">{meta}</span>
    </button>
  );
}
