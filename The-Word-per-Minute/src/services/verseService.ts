import translationsData from "../data/translations.json";
import webVersesData from "../data/verses/web.json";
import type { Translation, TranslationListResponse, Verse, VerseListResponse } from "../types/verse";

const translations = translationsData.translations as Translation[];
const verseDataByTranslation: Record<string, { translationId: string; verses: Verse[] }> = {
  web: webVersesData as { translationId: string; verses: Verse[] },
};

function findTranslation(translationId: string) {
  return translations.find((translation) => translation.id === translationId);
}

export const verseService = {
  async getTranslations(): Promise<TranslationListResponse> {
    return {
      translations,
    };
  },

  async getVerses(translationId: string): Promise<VerseListResponse> {
    const translation = findTranslation(translationId);
    const verseData = verseDataByTranslation[translationId];

    if (!translation || !verseData) {
      throw new Error(`Translation not found: ${translationId}`);
    }

    return {
      translation,
      verses: verseData.verses,
    };
  },
};
