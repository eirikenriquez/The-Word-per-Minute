export type Translation = {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  license: string;
  source: string;
};

export type Verse = {
  id: string;
  translationId: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  ref: string;
  text: string;
};

export type TranslationListResponse = {
  translations: Translation[];
};

export type VerseListResponse = {
  translation: Translation;
  verses: Verse[];
};
