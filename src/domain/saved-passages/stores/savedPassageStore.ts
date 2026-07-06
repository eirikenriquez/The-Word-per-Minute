import type { SavedPassage, SavePassageInput, SavedPassageUpdate } from "../../../shared/types/savedPassage";

export type SavedPassageStore = {
  list: () => Promise<SavedPassage[]>;
  save: (input: SavePassageInput) => Promise<SavedPassage>;
  update: (passageId: string, update: SavedPassageUpdate) => Promise<SavedPassage | null>;
  remove: (passageId: string) => Promise<void>;
};
