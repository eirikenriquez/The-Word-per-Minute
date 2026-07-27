import type { BibleChapter, BibleVerse, Translation } from './bible';

export type PassageReference = {
  title: string;
  theme: string;
  translationId: string;
  bookId: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  selectedVerses?: number[];
};

export type PassageResponse = {
  passage: PassageReference;
  reference: string;
  translation: Translation;
  bookName: string;
  chapter: BibleChapter;
  verses: BibleVerse[];
};
