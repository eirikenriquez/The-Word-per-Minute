import type { PracticeSource } from "../../../types/app";
import type { SavedPassage } from "../../../types/savedPassage";
import { FeaturedSaveAction } from "./FeaturedSaveAction";
import { PracticeActionButtons } from "./PracticeActionButtons";
import { SavedPassageSelect } from "./SavedPassageSelect";
import { SourcePicker } from "./SourcePicker";

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
  return (
    <section className="border-b border-slate-200 pb-5 dark:border-slate-800">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="grid gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Practice setup</p>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <SourcePicker
              hasSavedPassages={hasSavedPassages}
              practiceSource={practiceSource}
              savedPassages={savedPassages}
              selectedSavedPassageId={selectedSavedPassageId}
              onSelectFeaturedPractice={onSelectFeaturedPractice}
              onSelectSavedPractice={onSelectSavedPractice}
            />

            {practiceSource === "saved" && (
              <SavedPassageSelect
                savedPassages={savedPassages}
                selectedSavedPassageId={selectedSavedPassageId}
                onSelectSavedPractice={onSelectSavedPractice}
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          {practiceSource === "featured" && (
            <FeaturedSaveAction
              canSaveCurrentPassage={canSaveCurrentPassage}
              isCurrentPassageSaved={isCurrentPassageSaved}
              onSaveCurrentPassage={onSaveCurrentPassage}
            />
          )}

          <PracticeActionButtons
            practiceSource={practiceSource}
            onNextFeaturedPassage={onNextFeaturedPassage}
            onOpenLibrary={onOpenLibrary}
            onReset={onReset}
          />
        </div>
      </div>
    </section>
  );
}
