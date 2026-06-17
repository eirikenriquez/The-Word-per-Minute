import type { SavedPassage } from "../../../types/savedPassage";

type PracticeSource = "featured" | "saved";

type SourcePickerProps = {
  hasSavedPassages: boolean;
  practiceSource: PracticeSource;
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
  savedPassages,
  selectedSavedPassageId,
  onSelectFeaturedPractice,
  onSelectSavedPractice,
}: SourcePickerProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Practice source</span>
      <div className="inline-flex w-fit gap-1">
        <SourceButton
          isSelected={practiceSource === "featured"}
          label="Featured"
          onSelect={onSelectFeaturedPractice}
        />
        <SourceButton
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
  disabled?: boolean;
  isSelected: boolean;
  label: string;
  onSelect: () => void;
};

function SourceButton({ disabled = false, isSelected, label, onSelect }: SourceButtonProps) {
  return (
    <button
      className={`rounded-md px-3 py-2 text-sm font-medium transition ${
        isSelected
          ? "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
          : "text-slate-500 hover:bg-blue-50 hover:text-blue-800 dark:text-slate-400 dark:hover:bg-blue-950 dark:hover:text-blue-200"
      } disabled:cursor-not-allowed disabled:text-slate-400 dark:disabled:text-slate-600`}
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      {label}
    </button>
  );
}
