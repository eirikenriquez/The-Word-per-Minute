import { useEffect, useMemo, useState } from "react";
import { verseService } from "../services/verseService";
import type { BibleChapter, BookSummary, PracticeVerse, Translation } from "../types/verse";

export function useVerseLibrary() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [chapter, setChapter] = useState<BibleChapter | null>(null);
  const [selectedTranslationId, setSelectedTranslationId] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [practiceVerse, setPracticeVerse] = useState<PracticeVerse | null>(null);
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
        setSelectedVerse(1);
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
        setSelectedVerse((currentVerse) => Math.min(currentVerse, response.chapter.verses.length));
        setError(null);
      } catch (caughtError) {
        if (!isCurrent) return;

        setChapter(null);
        setPracticeVerse(null);
        setError(getErrorMessage(caughtError));
      }
    }

    loadChapter();

    return () => {
      isCurrent = false;
    };
  }, [selectedBookId, selectedChapter, selectedTranslationId]);

  useEffect(() => {
    if (!selectedTranslationId || !selectedBookId || !chapter) return;

    let isCurrent = true;

    async function loadPracticeVerse() {
      try {
        const response = await verseService.getPracticeVerse(
          selectedTranslationId,
          selectedBookId,
          selectedChapter,
          selectedVerse,
        );
        if (!isCurrent) return;

        setPracticeVerse(response.verse);
        setError(null);
      } catch (caughtError) {
        if (!isCurrent) return;

        setPracticeVerse(null);
        setError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadPracticeVerse();

    return () => {
      isCurrent = false;
    };
  }, [chapter, selectedBookId, selectedChapter, selectedTranslationId, selectedVerse]);

  function selectTranslation(translationId: string) {
    setSelectedTranslationId(translationId);
  }

  function selectBook(bookId: string) {
    setSelectedBookId(bookId);
    setSelectedChapter(1);
    setSelectedVerse(1);
  }

  function selectChapter(chapterNumber: number) {
    setSelectedChapter(chapterNumber);
    setSelectedVerse(1);
  }

  function selectVerse(verseNumber: number) {
    setSelectedVerse(verseNumber);
  }

  function selectRandomVerse() {
    const randomBook = books[Math.floor(Math.random() * books.length)];
    if (!randomBook) return;

    const chapterNumber = Math.floor(Math.random() * randomBook.chapterCount) + 1;
    const verseCount = randomBook.verseCounts[chapterNumber - 1] ?? 1;
    const verseNumber = Math.floor(Math.random() * verseCount) + 1;

    setSelectedBookId(randomBook.id);
    setSelectedChapter(chapterNumber);
    setSelectedVerse(verseNumber);
  }

  return {
    books,
    chapter,
    error,
    isLoading,
    practiceVerse,
    selectBook,
    selectChapter,
    selectRandomVerse,
    selectTranslation,
    selectVerse,
    selectedBook,
    selectedBookId,
    selectedChapter,
    selectedTranslationId,
    selectedVerse,
    translations,
  };
}

function getErrorMessage(caughtError: unknown) {
  return caughtError instanceof Error ? caughtError.message : "Something went wrong.";
}
