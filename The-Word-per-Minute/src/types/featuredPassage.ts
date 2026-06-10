import type { BibleChapter, BibleVerse, Translation } from "./verse";

export type FeaturedPassage = {
  id: string;
  title: string;
  theme: string;
  translationId: string;
  bookId: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
};

export type FeaturedPassageListResponse = {
  passages: FeaturedPassage[];
};

export type PassageResponse = {
  passage: FeaturedPassage;
  reference: string;
  translation: Translation;
  bookName: string;
  chapter: BibleChapter;
  verses: BibleVerse[];
};
