import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import type { PracticeSource } from "../../../shared/types/app";
import type { SavedPassage } from "../../../shared/types/savedPassage";
import { Button } from "../../../shared/ui/Button";
import { FeaturedSaveAction } from "./FeaturedSaveAction";
import { PracticeActionButtons } from "./PracticeActionButtons";
import { SavedPassageSelect } from "./SavedPassageSelect";
import { SourcePicker } from "./SourcePicker";

type PracticeControlsProps = {
  canSaveCurrentPassage: boolean;
  hasSavedPassages: boolean;
  isCurrentPassageSaved: boolean;
  isSetupOpen: boolean;
  practiceSource: PracticeSource;
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onNextFeaturedPassage: () => void;
  onOpenLibrary: () => void;
  onReset: () => void;
  onSaveCurrentPassage: () => void;
  onSelectFeaturedPractice: () => void;
  onSelectSavedPractice: (passageId: string) => void;
  onToggleSetup: () => void;
};

/**
 * Source controls for the central typing page.
 * Keeps Practice focused while still letting the user switch between curated and saved passages.
 */
export function PracticeControls({
  canSaveCurrentPassage,
  hasSavedPassages,
  isCurrentPassageSaved,
  isSetupOpen,
  practiceSource,
  savedPassages,
  selectedSavedPassageId,
  onNextFeaturedPassage,
  onOpenLibrary,
  onReset,
  onSaveCurrentPassage,
  onSelectFeaturedPractice,
  onSelectSavedPractice,
  onToggleSetup,
}: PracticeControlsProps) {
  const ToggleIcon = isSetupOpen ? ChevronUpIcon : ChevronDownIcon;

  return (
    <section>
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Practice setup</h2>
          <Button
            aria-expanded={isSetupOpen}
            aria-label={isSetupOpen ? "Hide practice setup" : "Show practice setup"}
            className="px-2"
            variant="ghost"
            onClick={onToggleSetup}
          >
            <ToggleIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
          </Button>
        </div>

        {isSetupOpen && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="grid gap-3 xl:min-h-16 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-end">
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
        )}
      </div>
    </section>
  );
}
