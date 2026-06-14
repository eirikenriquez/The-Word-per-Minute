import type { SavedPassage } from "../../../types/savedPassage";

type PracticeSource = "featured" | "saved";

type PracticeControlsProps = {
  canSaveCurrentPassage: boolean;
  hasSavedPassages: boolean;
  isCurrentPassageSaved: boolean;
  practiceSource: PracticeSource;
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onNextFeaturedPassage: () => void;
  onOpenLibrary: () => void;
  onReset: () => void;
  onSaveCurrentPassage: () => void;
  onSelectFeaturedPractice: () => void;
  onSelectSavedPractice: (passageId: string) => void;
};

/**
 * Source controls for the central typing page.
 * Keeps Practice focused while still letting the user switch between curated and saved passages.
 */
export function PracticeControls({
  canSaveCurrentPassage,
  hasSavedPassages,
  isCurrentPassageSaved,
  practiceSource,
  savedPassages,
  selectedSavedPassageId,
  onNextFeaturedPassage,
  onOpenLibrary,
  onReset,
  onSaveCurrentPassage,
  onSelectFeaturedPractice,
  onSelectSavedPractice,
}: PracticeControlsProps) {
  const selectedSavedPassage = savedPassages.find((passage) => passage.id === selectedSavedPassageId);
  const savedPassageLabel = selectedSavedPassage?.title ?? savedPassages[0]?.title ?? "No saved passages yet";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="grid gap-4">
          <SourcePicker
            hasSavedPassages={hasSavedPassages}
            practiceSource={practiceSource}
            savedPassageLabel={savedPassageLabel}
            savedPassages={savedPassages}
            selectedSavedPassageId={selectedSavedPassageId}
            onSelectFeaturedPractice={onSelectFeaturedPractice}
            onSelectSavedPractice={onSelectSavedPractice}
          />

          {practiceSource === "featured" && (
            <FeaturedSaveAction
              canSaveCurrentPassage={canSaveCurrentPassage}
              isCurrentPassageSaved={isCurrentPassageSaved}
              onSaveCurrentPassage={onSaveCurrentPassage}
            />
          )}

          {practiceSource === "saved" && (
            <SavedPassageSelect
              savedPassages={savedPassages}
              selectedSavedPassageId={selectedSavedPassageId}
              onSelectSavedPractice={onSelectSavedPractice}
            />
          )}
        </div>

        <PracticeActionButtons
          practiceSource={practiceSource}
          onNextFeaturedPassage={onNextFeaturedPassage}
          onOpenLibrary={onOpenLibrary}
          onReset={onReset}
        />
      </div>
    </section>
  );
}

type SourcePickerProps = {
  hasSavedPassages: boolean;
  practiceSource: PracticeSource;
  savedPassageLabel: string;
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onSelectFeaturedPractice: () => void;
  onSelectSavedPractice: (passageId: string) => void;
};

function SourcePicker({
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

type FeaturedSaveActionProps = {
  canSaveCurrentPassage: boolean;
  isCurrentPassageSaved: boolean;
  onSaveCurrentPassage: () => void;
};

function FeaturedSaveAction({
  canSaveCurrentPassage,
  isCurrentPassageSaved,
  onSaveCurrentPassage,
}: FeaturedSaveActionProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={!canSaveCurrentPassage || isCurrentPassageSaved}
        type="button"
        onClick={onSaveCurrentPassage}
      >
        {isCurrentPassageSaved ? "Saved" : "Save Passage"}
      </button>
      <span className="text-xs text-slate-500">
        {isCurrentPassageSaved ? "This featured passage is in your library." : "Add this passage to your library."}
      </span>
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

type SavedPassageSelectProps = {
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onSelectSavedPractice: (passageId: string) => void;
};

function SavedPassageSelect({
  savedPassages,
  selectedSavedPassageId,
  onSelectSavedPractice,
}: SavedPassageSelectProps) {
  return (
    <label className="grid gap-1 sm:max-w-md">
      <span className="text-sm font-medium text-slate-600">Saved Passage</span>
      <select
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        value={selectedSavedPassageId}
        onChange={(event) => onSelectSavedPractice(event.target.value)}
      >
        {savedPassages.map((passage) => (
          <option key={passage.id} value={passage.id}>
            {passage.title}
          </option>
        ))}
      </select>
    </label>
  );
}

type PracticeActionButtonsProps = {
  practiceSource: PracticeSource;
  onNextFeaturedPassage: () => void;
  onOpenLibrary: () => void;
  onReset: () => void;
};

function PracticeActionButtons({
  practiceSource,
  onNextFeaturedPassage,
  onOpenLibrary,
  onReset,
}: PracticeActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 lg:justify-end">
      {practiceSource === "featured" ? (
        <button
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          type="button"
          onClick={onNextFeaturedPassage}
        >
          Next Passage
        </button>
      ) : (
        <button
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          type="button"
          onClick={onOpenLibrary}
        >
          Manage Library
        </button>
      )}
      <button
        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
        type="button"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}
