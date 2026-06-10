import type { BibleVerse } from "./verse";

export type PracticeBatch = {
  startVerse: number;
  endVerse: number;
  ref: string;
  text: string;
  verses: BibleVerse[];
};
