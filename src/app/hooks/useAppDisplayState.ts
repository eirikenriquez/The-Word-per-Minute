import { useMemo } from "react";
import type { AppMode, PracticeSource } from "../../types/appMode";
import type { PassageResponse } from "../../types/featuredPassage";
import type { SavedPassage } from "../../types/savedPassage";
import type { BookSummary, Translation } from "../../types/verse";
import { formatChapterReference, formatSelectedVerseReference } from "../../utils/passageReference";

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
  selectedBook?: BookSummary;
  selectedChapter: number;
  selectedSavedPassage?: SavedPassage;
  selectedTranslationId: string;
  selectedVerseNumbers: number[];
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
  selectedBook,
  selectedChapter,
  selectedSavedPassage,
  selectedTranslationId,
  selectedVerseNumbers,
  translations,
}: UseAppDisplayStateParams) {
  return useMemo(() => {
    const bibleReference = selectedBook
      ? selectedVerseNumbers.length
        ? formatSelectedVerseReference(selectedBook.name, selectedChapter, selectedVerseNumbers)
        : formatChapterReference(selectedBook.name, selectedChapter)
      : "";

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
      practiceReference: getPracticeReference({
        appMode,
        bibleReference,
        featuredPassageResponse,
        practiceSource,
        savedPassageCount,
        selectedSavedPassage,
      }),
      practiceSubtitle: getPracticeSubtitle({
        appMode,
        featuredPassageResponse,
        practiceSource,
      }),
      practiceTitle: getPracticeTitle({
        appMode,
        featuredPassageResponse,
        selectedBook,
        selectedChapter,
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
    selectedBook,
    selectedChapter,
    selectedSavedPassage,
    selectedTranslationId,
    selectedVerseNumbers,
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

function getPracticeTitle({
  appMode,
  featuredPassageResponse,
  selectedBook,
  selectedChapter,
  selectedSavedPassage,
}: Pick<
  UseAppDisplayStateParams,
  "appMode" | "featuredPassageResponse" | "selectedBook" | "selectedChapter" | "selectedSavedPassage"
>) {
  if (appMode === "home") return "Welcome";
  if (appMode === "bible") return `${selectedBook?.name ?? "Bible"} ${selectedChapter}`;
  if (appMode === "library") return "Saved Library";

  return featuredPassageResponse?.passage.title ?? selectedSavedPassage?.title ?? "Saved Passage";
}

function getPracticeReference({
  appMode,
  bibleReference,
  featuredPassageResponse,
  practiceSource,
  savedPassageCount,
  selectedSavedPassage,
}: Pick<
  UseAppDisplayStateParams,
  "appMode" | "featuredPassageResponse" | "practiceSource" | "savedPassageCount" | "selectedSavedPassage"
> & {
  bibleReference: string;
}) {
  if (appMode === "home") return "";
  if (appMode === "bible") return bibleReference;
  if (appMode === "library") return `${savedPassageCount} saved`;

  return practiceSource === "featured"
    ? featuredPassageResponse?.reference ?? ""
    : selectedSavedPassage?.reference ?? "";
}

function getPracticeSubtitle({
  appMode,
  featuredPassageResponse,
  practiceSource,
}: Pick<UseAppDisplayStateParams, "appMode" | "featuredPassageResponse" | "practiceSource">) {
  if (appMode === "home") return "The Word per Minute";
  if (appMode === "bible") return "Bible reader";
  if (appMode === "library") return "Saved library";

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
