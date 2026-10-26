import { ArrowRightIcon, FolderOpenIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../components/ui/Button';
import type { PracticeSource } from '../types/practice';

type PracticeActionButtonsProps = {
  practiceSource: PracticeSource;
  onNextFeaturedPassage: () => void;
  onOpenLibrary: () => void;
};

/**
 * Secondary actions for the active Practice source.
 */
export function PracticeActionButtons({
  practiceSource,
  onNextFeaturedPassage,
  onOpenLibrary,
}: PracticeActionButtonsProps) {
  return (
    <>
      {practiceSource === 'featured' ? (
        <Button variant="primary" onClick={onNextFeaturedPassage}>
          <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
          Next Passage
        </Button>
      ) : (
        <Button variant="primary" onClick={onOpenLibrary}>
          <FolderOpenIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
          Manage Library
        </Button>
      )}
    </>
  );
}
