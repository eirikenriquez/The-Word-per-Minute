import { useMemo } from "react";
import type { AppMode, PracticeSource } from "../../types/app";
import type { PassageResponse } from "../../types/featuredPassage";
import type { SavedPassage } from "../../types/savedPassage";
import type { Translation } from "../../types/verse";

type UseAppDisplayStateParams = {
  appMode: AppMode;
  bibleError: string | null;
  bibleIsLoading: boolean;
  featuredError: string | null;
  featuredIsLoading: boolean;
  featuredPassageResponse: PassageResponse | null;
  practiceSource: PracticeSource;
  savedError: string | null;
  savedIsLoading: boolean;
  savedPassageCount: number;
  selectedSavedPassage?: SavedPassage;
  selectedTranslationId: string;
  translations: Translation[];
};

/**
 * Derives labels and load/error state for the app shell.
 * This keeps display decisions near each other instead of spread through App.
 */
export function useAppDisplayState({
  appMode,
  bibleError,
  bibleIsLoading,
  featuredError,
  featuredIsLoading,
  featuredPassageResponse,
  practiceSource,
  savedError,
  savedIsLoading,
  savedPassageCount,
  selectedSavedPassage,
  selectedTranslationId,
  translations,
}: UseAppDisplayStateParams) {
  return useMemo(() => {
    const selectedTranslation =
      translations.find((translation) => translation.id === selectedTranslationId)?.abbreviation ??
      selectedTranslationId.toUpperCase();

    return {
      error: getModeError({
        appMode,
        bibleError,
        featuredError,
        practiceSource,
        savedError,
      }),
      isLoading: getModeLoadingState({
        appMode,
        bibleIsLoading,
        featuredIsLoading,
        practiceSource,
        savedIsLoading,
      }),
      headerReference: getHeaderReference({
        appMode,
        featuredPassageResponse,
        practiceSource,
        savedPassageCount,
        selectedSavedPassage,
      }),
      headerSubtitle: getHeaderSubtitle({
        appMode,
        featuredPassageResponse,
        practiceSource,
      }),
      headerTitle: getHeaderTitle({
        appMode,
        featuredPassageResponse,
        practiceSource,
        selectedSavedPassage,
      }),
      translationName: getTranslationName({
        appMode,
        featuredPassageResponse,
        practiceSource,
        selectedSavedPassage,
        selectedTranslation,
      }),
    };
  }, [
    appMode,
    bibleError,
    bibleIsLoading,
    featuredError,
    featuredIsLoading,
    featuredPassageResponse,
    practiceSource,
    savedError,
    savedIsLoading,
    savedPassageCount,
    selectedSavedPassage,
    selectedTranslationId,
    translations,
  ]);
}

function getModeLoadingState({
  appMode,
  bibleIsLoading,
  featuredIsLoading,
  practiceSource,
  savedIsLoading,
}: Pick<
  UseAppDisplayStateParams,
  "appMode" | "bibleIsLoading" | "featuredIsLoading" | "practiceSource" | "savedIsLoading"
>) {
  if (appMode === "home") return featuredIsLoading;
  if (appMode === "bible") return bibleIsLoading;
  if (appMode === "practice") return practiceSource === "featured" ? featuredIsLoading : savedIsLoading;
  return false;
}

function getModeError({
  appMode,
  bibleError,
  featuredError,
  practiceSource,
  savedError,
}: Pick<UseAppDisplayStateParams, "appMode" | "bibleError" | "featuredError" | "practiceSource" | "savedError">) {
  if (appMode === "home") return featuredError;
  if (appMode === "bible") return bibleError;
  if (appMode === "practice") return practiceSource === "featured" ? featuredError : savedError;
  return null;
}

function getHeaderTitle({
  appMode,
  featuredPassageResponse,
  practiceSource,
  selectedSavedPassage,
}: Pick<
  UseAppDisplayStateParams,
  "appMode" | "featuredPassageResponse" | "practiceSource" | "selectedSavedPassage"
>) {
  if (appMode === "home") return "Welcome";
  if (appMode === "bible") return "Bible Reader";
  if (appMode === "library") return "Saved Library";

  return practiceSource === "featured"
    ? featuredPassageResponse?.passage.title ?? "Featured Passage"
    : selectedSavedPassage?.title ?? "Saved Passage";
}

function getHeaderReference({
  appMode,
  featuredPassageResponse,
  practiceSource,
  savedPassageCount,
  selectedSavedPassage,
}: Pick<
  UseAppDisplayStateParams,
  "appMode" | "featuredPassageResponse" | "practiceSource" | "savedPassageCount" | "selectedSavedPassage"
>) {
  if (appMode === "home") return "";
  if (appMode === "bible") return "";
  if (appMode === "library") return `${savedPassageCount} saved`;

  return practiceSource === "featured"
    ? featuredPassageResponse?.reference ?? ""
    : selectedSavedPassage?.reference ?? "";
}

function getHeaderSubtitle({
  appMode,
  featuredPassageResponse,
  practiceSource,
}: Pick<UseAppDisplayStateParams, "appMode" | "featuredPassageResponse" | "practiceSource">) {
  if (appMode === "home") return "The Word per Minute";
  if (appMode === "bible") return "Read and save scripture";
  if (appMode === "library") return "Manage your saved passages";

  return practiceSource === "featured"
    ? `Practice - ${featuredPassageResponse?.passage.theme ?? "Discovery"}`
    : "Practice - Saved passage";
}

function getTranslationName({
  appMode,
  featuredPassageResponse,
  practiceSource,
  selectedSavedPassage,
  selectedTranslation,
}: Pick<
  UseAppDisplayStateParams,
  "appMode" | "featuredPassageResponse" | "practiceSource" | "selectedSavedPassage"
> & {
  selectedTranslation: string;
}) {
  if (appMode === "home") return "WEB";
  if (appMode === "bible") return selectedTranslation;
  if (appMode === "library") return "WEB";

  return practiceSource === "featured"
    ? featuredPassageResponse?.translation.abbreviation ?? "WEB"
    : selectedSavedPassage?.translationAbbreviation ?? "WEB";
}
