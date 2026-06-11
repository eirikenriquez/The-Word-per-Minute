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
          tone="amber"
          onSelect={onStartFeatured}
        />
        <HomeCard
          description="Read and select verses"
          label="Bible"
          meta="Book and chapter"
          tone="emerald"
          onSelect={onOpenBible}
        />
        <HomeCard
          description="Your practice library"
          disabled={!hasSavedPassages}
          label="Saved"
          meta={`${savedPassageCount} saved`}
          tone="sky"
          onSelect={onOpenSaved}
        />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-950">Categories</h3>
          <span className="text-sm font-medium text-slate-500">{featuredCategories.length} themes</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category) => (
            <HomeCard
              description="Featured passage set"
              key={category.label}
              label={category.label}
              meta={`${category.count} ${category.count === 1 ? "passage" : "passages"}`}
              tone="slate"
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
  tone?: "amber" | "emerald" | "sky" | "slate";
  onSelect: () => void;
};

function HomeCard({ description, disabled = false, label, meta, tone = "slate", onSelect }: HomeCardProps) {
  const toneClassNames = {
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    sky: "border-sky-200 bg-sky-50 text-sky-900",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <button
      className="group min-h-32 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-400 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      <span className={`mb-4 inline-flex rounded-md border px-2 py-1 text-xs font-bold ${toneClassNames[tone]}`}>
        {meta}
      </span>
      <span className="block text-lg font-bold text-slate-950 group-disabled:text-slate-400">{label}</span>
      <span className="mt-2 block text-sm text-slate-600">{description}</span>
    </button>
  );
}
