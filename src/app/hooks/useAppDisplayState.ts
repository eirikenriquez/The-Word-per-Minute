import { useMemo } from "react";
import type { AppMode, PracticeSource } from "../../shared/types/app";
import type { PassageResponse } from "../../shared/types/featuredPassage";
import type { SavedPassage } from "../../shared/types/savedPassage";
import type { Translation } from "../../shared/types/verse";

type UseAppDisplayStateParams = {
  appMode: AppMode;
  bibleError: string | null;
  bibleIsLoading: boolean;
  featuredError: string | null;
  featuredIsLoading: boolean;
  featuredPassageResponse: PassageResponse | null;
  practiceSource: PracticeSource;
  savedPassageError: string | null;
  savedIsLoading: boolean;
  savedPassageResponse: PassageResponse | null;
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
  savedPassageError,
  savedIsLoading,
  savedPassageResponse,
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
        savedPassageError,
      }),
      isLoading: getModeLoadingState({
        appMode,
        bibleIsLoading,
        featuredIsLoading,
        featuredPassageResponse,
        practiceSource,
        savedIsLoading,
        savedPassageResponse,
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
    savedPassageError,
    savedIsLoading,
    savedPassageResponse,
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
  featuredPassageResponse,
  practiceSource,
  savedIsLoading,
  savedPassageResponse,
}: Pick<
  UseAppDisplayStateParams,
  | "appMode"
  | "bibleIsLoading"
  | "featuredIsLoading"
  | "featuredPassageResponse"
  | "practiceSource"
  | "savedIsLoading"
  | "savedPassageResponse"
>) {
  if (appMode === "home") return featuredIsLoading;
  if (appMode === "bible") return bibleIsLoading;
  if (appMode === "practice") {
    if (practiceSource === "featured") {
      return featuredIsLoading && !featuredPassageResponse;
    }

    return savedIsLoading && !savedPassageResponse;
  }

  return false;
}

function getModeError({
  appMode,
  bibleError,
  featuredError,
  practiceSource,
  savedPassageError,
}: Pick<UseAppDisplayStateParams, "appMode" | "bibleError" | "featuredError" | "practiceSource" | "savedPassageError">) {
  if (appMode === "home") return featuredError;
  if (appMode === "bible") return bibleError;
  if (appMode === "practice") return practiceSource === "featured" ? featuredError : savedPassageError;
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
  if (appMode === "profile") return "Profile";

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
  if (appMode === "profile") return "";

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
  if (appMode === "profile") return "Account and practice history";

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
  if (appMode === "profile") return "WEB";

  return practiceSource === "featured"
    ? featuredPassageResponse?.translation.abbreviation ?? "WEB"
    : selectedSavedPassage?.translationAbbreviation ?? "WEB";
}
