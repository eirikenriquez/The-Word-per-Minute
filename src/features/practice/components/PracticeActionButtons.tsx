import type { PracticeSource } from "../../../types/app";
import { Button } from "../../../ui/Button";

type PracticeActionButtonsProps = {
  practiceSource: PracticeSource;
  onNextFeaturedPassage: () => void;
  onOpenLibrary: () => void;
  onReset: () => void;
};

/**
 * Secondary actions for the active Practice source.
 */
export function PracticeActionButtons({
  practiceSource,
  onNextFeaturedPassage,
  onOpenLibrary,
  onReset,
}: PracticeActionButtonsProps) {
  return (
    <>
      {practiceSource === "featured" ? (
        <Button
          variant="primary"
          onClick={onNextFeaturedPassage}
        >
          Next Passage
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={onOpenLibrary}
        >
          Manage Library
        </Button>
      )}
      <Button
        variant="ghost"
        onClick={onReset}
      >
        Reset
      </Button>
    </>
  );
}
