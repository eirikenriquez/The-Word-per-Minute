import { useEffect, useMemo, useState } from "react";
import { verseService } from "../services/verseService";
import type { BibleChapter, BookSummary, Translation } from "../types/verse";
import { getErrorMessage } from "../utils/errors";

/**
 * Handles the manual library flow: translation, book, and chapter selection.
 * The UI can use this as a local-data version of future API-backed browsing.
 */
export function useVerseLibrary() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [chapter, setChapter] = useState<BibleChapter | null>(null);
  const [selectedTranslationId, setSelectedTranslationId] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId),
    [books, selectedBookId],
  );

  useEffect(() => {
    let isCurrent = true;

    async function loadTranslations() {
      try {
        const response = await verseService.getTranslations();
        if (!isCurrent) return;

        setTranslations(response.translations);
        setSelectedTranslationId(response.translations[0]?.id ?? "");
      } catch (caughtError) {
        if (isCurrent) setError(getErrorMessage(caughtError));
      }
    }

    loadTranslations();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedTranslationId) return;

    let isCurrent = true;
    setIsLoading(true);

    async function loadBooks() {
      try {
        const response = await verseService.getBooks(selectedTranslationId);
        if (!isCurrent) return;

        setBooks(response.books);
        setSelectedBookId(response.books[0]?.id ?? "");
        setSelectedChapter(1);
        setError(null);
      } catch (caughtError) {
        if (!isCurrent) return;

        setBooks([]);
        setError(getErrorMessage(caughtError));
      }
    }

    loadBooks();

    return () => {
      isCurrent = false;
    };
  }, [selectedTranslationId]);

  useEffect(() => {
    if (!selectedTranslationId || !selectedBookId) return;

    let isCurrent = true;
    setIsLoading(true);

    async function loadChapter() {
      try {
        const response = await verseService.getChapter(selectedTranslationId, selectedBookId, selectedChapter);
        if (!isCurrent) return;

        setChapter(response.chapter);
        setError(null);
      } catch (caughtError) {
        if (!isCurrent) return;

        setChapter(null);
        setError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadChapter();

    return () => {
      isCurrent = false;
    };
  }, [selectedBookId, selectedChapter, selectedTranslationId]);

  function selectTranslation(translationId: string) {
    setSelectedTranslationId(translationId);
  }

  function selectBook(bookId: string) {
    setSelectedBookId(bookId);
    setSelectedChapter(1);
  }

  function selectChapter(chapterNumber: number) {
    setSelectedChapter(chapterNumber);
  }

  function selectRandomChapter() {
    const randomBook = books[Math.floor(Math.random() * books.length)];
    if (!randomBook) return;

    const chapterNumber = Math.floor(Math.random() * randomBook.chapterCount) + 1;

    setSelectedBookId(randomBook.id);
    setSelectedChapter(chapterNumber);
  }

  return {
    books,
    chapter,
    error,
    isLoading,
    selectBook,
    selectChapter,
    selectRandomChapter,
    selectTranslation,
    selectedBook,
    selectedBookId,
    selectedChapter,
    selectedTranslationId,
    translations,
  };
}
