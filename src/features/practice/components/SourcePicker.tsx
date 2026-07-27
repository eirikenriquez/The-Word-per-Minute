import type { PracticePassageOption, PracticeSource } from '../types/practice';

type SourcePickerProps = {
  practiceSource: PracticeSource;
  savedPassageOptions: PracticePassageOption[];
  selectedSavedPassageId: string;
  onSelectFeaturedPractice: () => void;
  onSelectSavedPractice: (passageId: string) => void;
};

/**
 * Lets the user choose whether Practice pulls from curated passages or their saved library.
 */
export function SourcePicker({
  practiceSource,
  savedPassageOptions,
  selectedSavedPassageId,
  onSelectFeaturedPractice,
  onSelectSavedPractice,
}: SourcePickerProps) {
  return (
    <div className="grid gap-1">
      <span className="text-sm font-medium text-ink-muted">
        Practice source
      </span>
      <div className="inline-flex w-fit gap-1">
        <SourceButton
          isSelected={practiceSource === 'featured'}
          label="Featured"
          onSelect={onSelectFeaturedPractice}
        />
        <SourceButton
          disabled={savedPassageOptions.length === 0}
          isSelected={practiceSource === 'saved'}
          label="Saved"
          onSelect={() => {
            const passageId =
              selectedSavedPassageId || savedPassageOptions[0]?.id;
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

function SourceButton({
  disabled = false,
  isSelected,
  label,
  onSelect,
}: SourceButtonProps) {
  return (
    <button
      className={`rounded-md px-3 py-2 text-sm font-medium transition ${
        isSelected
          ? 'bg-accent-soft text-accent-ink'
          : 'text-ink-subtle hover:bg-accent-soft hover:text-accent-ink'
      } disabled:cursor-not-allowed disabled:text-ink-subtle`}
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      {label}
    </button>
  );
}
