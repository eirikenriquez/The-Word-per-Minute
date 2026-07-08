type SavedPassageSource = "featured" | "bible";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      saved_passages: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string;
          theme: string;
          reference: string;
          translation_id: string;
          translation_abbreviation: string;
          book_id: string;
          book_name: string;
          chapter: number;
          start_verse: number;
          end_verse: number;
          selected_verses: number[];
          source: SavedPassageSource;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category: string;
          theme: string;
          reference: string;
          translation_id: string;
          translation_abbreviation: string;
          book_id: string;
          book_name: string;
          chapter: number;
          start_verse: number;
          end_verse: number;
          selected_verses?: number[];
          source: SavedPassageSource;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          category?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      practice_attempts: {
        Row: {
          id: string;
          user_id: string;
          saved_passage_id: string | null;
          featured_passage_id: string | null;
          passage_reference: string;
          translation_id: string;
          book_id: string;
          chapter: number;
          start_verse: number;
          end_verse: number;
          selected_verses: number[];
          wpm: number;
          accuracy: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          saved_passage_id?: string | null;
          featured_passage_id?: string | null;
          passage_reference: string;
          translation_id: string;
          book_id: string;
          chapter: number;
          start_verse: number;
          end_verse: number;
          selected_verses?: number[];
          wpm: number;
          accuracy: number;
          completed_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
