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
