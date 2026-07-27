import type { SavePassageInput } from '../types/savedPassage';
import { useSavedPassageCollection } from './useSavedPassageCollection';
import { useSelectedSavedPassage } from './useSelectedSavedPassage';

/**
 * Temporary compatibility facade for routes that still need both the saved
 * collection and a resolved selected passage.
 */
export function useSavedPassages(userId?: string | null) {
  const collection = useSavedPassageCollection(userId);
  const selection = useSelectedSavedPassage(collection.savedPassages);

  async function savePassage(input: SavePassageInput) {
    const savedPassage = await collection.savePassage(input);
    if (savedPassage) selection.selectSavedPassage(savedPassage.id);
    return savedPassage;
  }

  async function removePassage(passageId: string) {
    const wasRemoved = await collection.removePassage(passageId);
    if (wasRemoved && selection.selectedSavedPassageId === passageId) {
      selection.selectSavedPassage('');
    }
  }

  return {
    ...collection,
    ...selection,
    isLoading: collection.isLoading || selection.isLoading,
    isLoadingSavedPassages: collection.isLoading,
    removePassage,
    savePassage,
  };
}
