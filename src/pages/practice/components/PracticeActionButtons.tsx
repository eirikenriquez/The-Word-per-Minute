import {
  ArrowPathIcon,
  ArrowRightIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import type { PracticeSource } from "../../../types/app";
import { Button } from "../../../shared/ui/Button";

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
          <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
          Next Passage
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={onOpenLibrary}
        >
          <FolderOpenIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
          Manage Library
        </Button>
      )}
      <Button
        variant="ghost"
        onClick={onReset}
      >
        <ArrowPathIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
        Reset
      </Button>
    </>
  );
}
