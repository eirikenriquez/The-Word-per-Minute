import type { useAppActions } from "../hooks/useAppActions";
import type { useSavedPassages } from "../../features/saved-passages/hooks/useSavedPassages";
import type { LibraryPageProps } from "../../pages/LibraryPage";

type UseLibraryPageControllerParams = {
  appActions: ReturnType<typeof useAppActions>;
  savedLibrary: ReturnType<typeof useSavedPassages>;
};

/**
 * Prepares the props for the saved passage library page.
 */
export function useLibraryPageController({
  appActions,
  savedLibrary,
}: UseLibraryPageControllerParams): LibraryPageProps {
  return {
    savedPassages: savedLibrary.savedPassages,
    selectedSavedPassageId: savedLibrary.selectedSavedPassageId,
    onRemoveSavedPassage: appActions.removeSavedPractice,
    onSelectSavedPassage: appActions.selectSavedPractice,
    onUpdateSavedPassage: savedLibrary.updatePassage,
  };
}
