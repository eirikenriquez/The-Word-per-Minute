import { DEFAULT_SAVED_CATEGORY } from "../savedPassageCategories";
import { supabase } from "../../../shared/lib/supabaseClient";
import type { Database } from "../../../shared/types/database";
import type { SavedPassage, SavePassageInput, SavedPassageUpdate } from "../../../shared/types/savedPassage";
import type { SavedPassageStore } from "./savedPassageStore";

type SavedPassageRow = Database["public"]["Tables"]["saved_passages"]["Row"];
type SavedPassageInsert = Database["public"]["Tables"]["saved_passages"]["Insert"];
type SavedPassageRowUpdate = Database["public"]["Tables"]["saved_passages"]["Update"];

/**
 * Supabase-backed saved passage storage for signed-in users.
 */
export function createSupabaseSavedPassageStore(userId: string): SavedPassageStore {
  return {
    async list() {
      const { data, error } = await supabase
        .from("saved_passages")
        .select(SAVED_PASSAGE_COLUMNS)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data ?? []).map(mapSavedPassageRow);
    },

    async save(input: SavePassageInput) {
      const { data, error } = await supabase
        .from("saved_passages")
        .insert(mapSavePassageInput(userId, input))
        .select(SAVED_PASSAGE_COLUMNS)
        .single();

      if (error) throw error;

      return mapSavedPassageRow(data);
    },

    async update(passageId: string, update: SavedPassageUpdate) {
      const rowUpdate: SavedPassageRowUpdate = {
        category: update.category || DEFAULT_SAVED_CATEGORY,
        title: update.title,
      };

      const { data, error } = await supabase
        .from("saved_passages")
        .update(rowUpdate)
        .eq("id", passageId)
        .select(SAVED_PASSAGE_COLUMNS)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return mapSavedPassageRow(data);
    },

    async remove(passageId: string) {
      const { error } = await supabase
        .from("saved_passages")
        .delete()
        .eq("id", passageId);

      if (error) throw error;
    },
  };
}

const SAVED_PASSAGE_COLUMNS =
  "id,user_id,title,category,theme,reference,translation_id,translation_abbreviation,book_id,book_name,chapter,start_verse,end_verse,selected_verses,source,created_at,updated_at";

function mapSavePassageInput(userId: string, input: SavePassageInput): SavedPassageInsert {
  return {
    user_id: userId,
    title: input.title,
    category: input.category || DEFAULT_SAVED_CATEGORY,
    theme: input.theme,
    reference: input.reference,
    translation_id: input.translationId,
    translation_abbreviation: input.translationAbbreviation,
    book_id: input.bookId,
    book_name: input.bookName,
    chapter: input.chapter,
    start_verse: input.startVerse,
    end_verse: input.endVerse,
    selected_verses: input.selectedVerses ?? [],
    source: input.source,
  };
}

function mapSavedPassageRow(row: SavedPassageRow): SavedPassage {
  return {
    id: row.id,
    title: row.title,
    category: row.category ?? row.theme ?? DEFAULT_SAVED_CATEGORY,
    theme: row.theme,
    reference: row.reference,
    translationId: row.translation_id,
    translationAbbreviation: row.translation_abbreviation,
    bookId: row.book_id,
    bookName: row.book_name,
    chapter: row.chapter,
    startVerse: row.start_verse,
    endVerse: row.end_verse,
    selectedVerses: row.selected_verses.length ? row.selected_verses : undefined,
    source: row.source,
    createdAt: row.created_at,
  };
}
