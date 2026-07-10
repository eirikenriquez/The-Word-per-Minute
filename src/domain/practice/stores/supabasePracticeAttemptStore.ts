import { supabase } from "../../../shared/lib/supabaseClient";
import type { Database } from "../../../shared/types/database";
import type { PracticeAttempt, SavePracticeAttemptInput } from "../../../shared/types/practice";
import type { PracticeAttemptStore } from "./practiceAttemptStore";

type PracticeAttemptRow = Database["public"]["Tables"]["practice_attempts"]["Row"];
type PracticeAttemptInsert = Database["public"]["Tables"]["practice_attempts"]["Insert"];
type PracticeAttemptUpdate = Database["public"]["Tables"]["practice_attempts"]["Update"];

const PRACTICE_ATTEMPT_COLUMNS =
  "id,user_id,saved_passage_id,featured_passage_id,passage_reference,translation_id,book_id,chapter,start_verse,end_verse,selected_verses,duration_seconds,mistake_count,typed_character_count,wpm,accuracy,reflection,completed_at";

export function createSupabasePracticeAttemptStore(userId: string): PracticeAttemptStore {
  return {
    async listRecent(limit = 20) {
      const { data, error } = await supabase
        .from("practice_attempts")
        .select(PRACTICE_ATTEMPT_COLUMNS)
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data ?? []).map(mapPracticeAttemptRow);
    },

    async save(input: SavePracticeAttemptInput) {
      const { data, error } = await supabase
        .from("practice_attempts")
        .insert(mapSavePracticeAttemptInput(userId, input))
        .select(PRACTICE_ATTEMPT_COLUMNS)
        .single();

      if (error) throw error;

      return mapPracticeAttemptRow(data);
    },

    async updateReflection(attemptId: string, reflection: string) {
      const rowUpdate: PracticeAttemptUpdate = {
        reflection: reflection.trim() || null,
      };

      const { data, error } = await supabase
        .from("practice_attempts")
        .update(rowUpdate)
        .eq("id", attemptId)
        .eq("user_id", userId)
        .select(PRACTICE_ATTEMPT_COLUMNS)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return mapPracticeAttemptRow(data);
    },
  };
}

function mapSavePracticeAttemptInput(
  userId: string,
  input: SavePracticeAttemptInput,
): PracticeAttemptInsert {
  return {
    user_id: userId,
    saved_passage_id: input.savedPassageId ?? null,
    featured_passage_id: input.featuredPassageId ?? null,
    passage_reference: input.passageReference,
    translation_id: input.translationId,
    book_id: input.bookId,
    chapter: input.chapter,
    start_verse: input.startVerse,
    end_verse: input.endVerse,
    selected_verses: input.selectedVerses ?? [],
    duration_seconds: input.durationSeconds,
    mistake_count: input.mistakeCount,
    typed_character_count: input.typedCharacterCount,
    wpm: input.wpm,
    accuracy: input.accuracy,
    reflection: input.reflection ?? null,
  };
}

function mapPracticeAttemptRow(row: PracticeAttemptRow): PracticeAttempt {
  return {
    id: row.id,
    featuredPassageId: row.featured_passage_id ?? undefined,
    savedPassageId: row.saved_passage_id ?? undefined,
    passageReference: row.passage_reference,
    translationId: row.translation_id,
    bookId: row.book_id,
    chapter: row.chapter,
    startVerse: row.start_verse,
    endVerse: row.end_verse,
    selectedVerses: row.selected_verses.length ? row.selected_verses : undefined,
    durationSeconds: row.duration_seconds,
    mistakeCount: row.mistake_count,
    typedCharacterCount: row.typed_character_count,
    wpm: row.wpm,
    accuracy: row.accuracy,
    reflection: row.reflection ?? undefined,
    completedAt: row.completed_at,
  };
}
