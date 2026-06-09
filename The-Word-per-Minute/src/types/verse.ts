export type Translation = {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  license: string;
  source: string;
  sourceUrl?: string;
};

export type BookSummary = {
  id: string;
  name: string;
  testament: "OT" | "NT";
  chapterCount: number;
  verseCounts: number[];
};

export type BibleVerse = {
  number: number;
  text: string;
};

export type BibleChapter = {
  chapter: number;
  verses: BibleVerse[];
};

export type BibleBook = {
  translationId: string;
  id: string;
  name: string;
  testament: "OT" | "NT";
  chapters: BibleChapter[];
};

export type PracticeVerse = {
  id: string;
  translationId: string;
  translationName: string;
  book: string;
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  ref: string;
  text: string;
};

export type TranslationListResponse = {
  translations: Translation[];
};

export type BookListResponse = {
  translation: Translation;
  books: BookSummary[];
};

export type ChapterResponse = {
  translation: Translation;
  book: BibleBook;
  chapter: BibleChapter;
};

export type PracticeVerseResponse = {
  translation: Translation;
  verse: PracticeVerse;
};
