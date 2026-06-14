import type { SavedPassage } from "../../../types/savedPassage";
import { FeaturedSaveAction } from "./FeaturedSaveAction";
import { PracticeActionButtons } from "./PracticeActionButtons";
import { SavedPassageSelect } from "./SavedPassageSelect";
import { SourcePicker } from "./SourcePicker";

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
