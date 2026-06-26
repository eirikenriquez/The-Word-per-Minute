import type { PracticeSource } from "../../../types/app";
import type { SavedPassage } from "../../../types/savedPassage";

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
    <div className="grid gap-1">
      <span className="text-sm font-medium text-ink-muted">Practice source</span>
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
          ? "bg-accent-soft text-accent-ink"
          : "text-ink-subtle hover:bg-accent-soft hover:text-accent-ink"
      } disabled:cursor-not-allowed disabled:text-ink-subtle`}
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      {label}
    </button>
  );
}
