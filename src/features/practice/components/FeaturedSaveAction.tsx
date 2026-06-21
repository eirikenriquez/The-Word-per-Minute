import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../ui/Button";

type FeaturedSaveActionProps = {
  canSaveCurrentPassage: boolean;
  isCurrentPassageSaved: boolean;
  onSaveCurrentPassage: () => void;
};

/**
 * Saves the currently displayed featured passage into the user's local library.
 */
export function FeaturedSaveAction({
  canSaveCurrentPassage,
  isCurrentPassageSaved,
  onSaveCurrentPassage,
}: FeaturedSaveActionProps) {
  return (
    <Button
      disabled={!canSaveCurrentPassage || isCurrentPassageSaved}
      onClick={onSaveCurrentPassage}
    >
      <BookmarkIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
      {isCurrentPassageSaved ? "Saved" : "Save Passage"}
    </Button>
  );
}
