import type { BibleChapter, BibleVerse, Translation } from "./verse";

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

export type FeaturedPassage = PassageReference & {
  id: string;
};

export type FeaturedPassageListResponse = {
  passages: FeaturedPassage[];
};

export type PassageResponse = {
  passage: PassageReference;
  reference: string;
  translation: Translation;
  bookName: string;
  chapter: BibleChapter;
  verses: BibleVerse[];
};
