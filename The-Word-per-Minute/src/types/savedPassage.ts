export type SavedPassageSource = "featured" | "chapter";

export type SavedPassage = {
  id: string;
  title: string;
  category: string;
  theme: string;
  reference: string;
  translationId: string;
  translationAbbreviation: string;
  bookId: string;
  bookName: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  selectedVerses?: number[];
  source: SavedPassageSource;
  createdAt: string;
};

export type SavePassageInput = Omit<SavedPassage, "createdAt" | "id">;
