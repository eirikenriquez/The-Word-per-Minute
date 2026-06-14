import type { SavedPassage } from "../../../types/savedPassage";

type PracticeSource = "featured" | "saved";

type SourcePickerProps = {
  hasSavedPassages: boolean;
  practiceSource: PracticeSource;
  savedPassageLabel: string;
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onSelectFeaturedPractice: () => void;
  onSelectSavedPractice: (passageId: string) => void;
};

/**
 * Lets the user choose whether Practice pulls from curated passages or their saved library.
 */
export function SourcePicker({
  hasSavedPassages,
  practiceSource,
  savedPassageLabel,
  savedPassages,
  selectedSavedPassageId,
  onSelectFeaturedPractice,
  onSelectSavedPractice,
}: SourcePickerProps) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold uppercase text-slate-500">Practice Source</span>
      <div className="grid gap-2 sm:grid-cols-2">
        <SourceButton
          description="Random curated passages for discovery."
          isSelected={practiceSource === "featured"}
          label="Featured"
          onSelect={onSelectFeaturedPractice}
        />
        <SourceButton
          description={hasSavedPassages ? savedPassageLabel : "Save a passage from Bible first."}
          disabled={!hasSavedPassages}
          isSelected={practiceSource === "saved"}
          label="Saved"
          onSelect={() => {
            const passageId = selectedSavedPassageId || savedPassages[0]?.id;
            if (passageId) onSelectSavedPractice(passageId);
          }}
        />
      </div>
    </div>
  );
}

type SourceButtonProps = {
  description: string;
  disabled?: boolean;
  isSelected: boolean;
  label: string;
  onSelect: () => void;
};

function SourceButton({ description, disabled = false, isSelected, label, onSelect }: SourceButtonProps) {
  return (
    <button
      className={`grid min-h-20 gap-1 rounded-md border px-3 py-2 text-left transition ${
        isSelected
          ? "border-slate-900 bg-slate-950 text-white shadow-sm"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
      } disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400`}
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      <span className="text-sm font-semibold">{label}</span>
      <span className={`text-xs ${isSelected ? "text-slate-200" : "text-slate-500"}`}>{description}</span>
    </button>
  );
}
