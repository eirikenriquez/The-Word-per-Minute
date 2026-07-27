import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { BookSummary, Translation } from '../../../types/bible';
import {
  addVerseRange,
  toggleVerseSelection,
} from '../../../features/bible-reader/utils/readerSelection';
import {
  createBiblePath,
  readBibleRouteState,
  resolveBibleRouteState,
  type BibleRouteState,
} from './bibleRouteState';

type UseBibleRouteSelectionParams = {
  books: readonly BookSummary[];
  focusSelectedVerses: () => void;
  selectedBookId: string;
  selectedChapter: number;
  selectedTranslationId: string;
  selectedVerseNumbers: number[];
  selectBook: (bookId: string) => void;
  selectChapter: (chapterNumber: number) => void;
  selectTranslation: (translationId: string) => void;
  setSelectedVerseNumbers: (verseNumbers: number[]) => void;
  translations: readonly Translation[];
};

type SelectBibleRouteOptions = {
  preventScrollReset?: boolean;
  replace?: boolean;
};

/**
 * Keeps shareable Bible URL state and Bible-reader feature state synchronized.
 */
export function useBibleRouteSelection({
  books,
  focusSelectedVerses,
  selectedBookId,
  selectedChapter,
  selectedTranslationId,
  selectedVerseNumbers,
  selectBook,
  selectChapter,
  selectTranslation,
  setSelectedVerseNumbers,
  translations,
}: UseBibleRouteSelectionParams) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedVerseNumbersRef = useRef(selectedVerseNumbers);
  const routeState = useMemo(
    () => readBibleRouteState(new URLSearchParams(location.search)),
    [location.search],
  );
  const resolvedRouteState = useMemo(
    () =>
      resolveBibleRouteState({
        books,
        routeState,
        selectedBookId,
        selectedChapter,
        selectedTranslationId,
        translations,
      }),
    [
      books,
      routeState,
      selectedBookId,
      selectedChapter,
      selectedTranslationId,
      translations,
    ],
  );

  useEffect(() => {
    selectedVerseNumbersRef.current = selectedVerseNumbers;
  }, [selectedVerseNumbers]);

  const selectBibleRoute = useCallback(
    (
      nextRouteState: BibleRouteState,
      options: SelectBibleRouteOptions = {},
    ) => {
      const nextPath = createBiblePath(nextRouteState);
      const currentPath = `${location.pathname}${location.search}`;
      if (nextPath === currentPath) return;

      void navigate(nextPath, {
        preventScrollReset: options.preventScrollReset,
        replace: options.replace,
      });
    },
    [location.pathname, location.search, navigate],
  );

  useEffect(() => {
    if (!resolvedRouteState) return;

    if (selectedTranslationId !== resolvedRouteState.translationId) {
      selectTranslation(resolvedRouteState.translationId);
      return;
    }

    if (selectedBookId !== resolvedRouteState.bookId) {
      selectBook(resolvedRouteState.bookId);
      return;
    }

    if (selectedChapter !== resolvedRouteState.chapter) {
      selectChapter(resolvedRouteState.chapter);
      return;
    }

    if (
      !haveSameVerseNumbers(
        selectedVerseNumbers,
        resolvedRouteState.selectedVerseNumbers,
      )
    ) {
      selectedVerseNumbersRef.current = resolvedRouteState.selectedVerseNumbers;
      setSelectedVerseNumbers(resolvedRouteState.selectedVerseNumbers);
      if (resolvedRouteState.selectedVerseNumbers.length) {
        focusSelectedVerses();
      }
      return;
    }

    selectBibleRoute(resolvedRouteState, { replace: true });
  }, [
    focusSelectedVerses,
    resolvedRouteState,
    selectedBookId,
    selectedChapter,
    selectedTranslationId,
    selectedVerseNumbers,
    selectBibleRoute,
    selectBook,
    selectChapter,
    selectTranslation,
    setSelectedVerseNumbers,
  ]);

  const clearReaderSelection = useCallback(() => {
    selectedVerseNumbersRef.current = [];
    selectBibleRoute(
      createCurrentRouteState({
        bookId: selectedBookId,
        chapter: selectedChapter,
        selectedVerseNumbers: [],
        translationId: selectedTranslationId,
      }),
      { preventScrollReset: true, replace: true },
    );
  }, [
    selectBibleRoute,
    selectedBookId,
    selectedChapter,
    selectedTranslationId,
  ]);

  const selectReaderTranslation = useCallback(
    (translationId: string) => {
      selectedVerseNumbersRef.current = [];
      selectBibleRoute({
        bookId: null,
        chapter: null,
        selectedVerseNumbers: [],
        translationId,
      });
    },
    [selectBibleRoute],
  );

  const selectReaderBook = useCallback(
    (bookId: string) => {
      selectedVerseNumbersRef.current = [];
      selectBibleRoute({
        bookId,
        chapter: 1,
        selectedVerseNumbers: [],
        translationId: selectedTranslationId || null,
      });
    },
    [selectBibleRoute, selectedTranslationId],
  );

  const selectReaderChapter = useCallback(
    (chapter: number) => {
      selectedVerseNumbersRef.current = [];
      selectBibleRoute({
        bookId: selectedBookId || null,
        chapter,
        selectedVerseNumbers: [],
        translationId: selectedTranslationId || null,
      });
    },
    [selectBibleRoute, selectedBookId, selectedTranslationId],
  );

  const selectReaderVerse = useCallback(
    (verseNumber: number) => {
      const nextVerseNumbers = toggleVerseSelection(
        selectedVerseNumbersRef.current,
        verseNumber,
      );
      selectedVerseNumbersRef.current = nextVerseNumbers;
      selectBibleRoute(
        createCurrentRouteState({
          bookId: selectedBookId,
          chapter: selectedChapter,
          selectedVerseNumbers: nextVerseNumbers,
          translationId: selectedTranslationId,
        }),
        { preventScrollReset: true, replace: true },
      );
    },
    [selectBibleRoute, selectedBookId, selectedChapter, selectedTranslationId],
  );

  const selectReaderRange = useCallback(
    (startVerse: number, endVerse: number) => {
      const nextVerseNumbers = addVerseRange(
        selectedVerseNumbersRef.current,
        startVerse,
        endVerse,
      );
      selectedVerseNumbersRef.current = nextVerseNumbers;
      selectBibleRoute(
        createCurrentRouteState({
          bookId: selectedBookId,
          chapter: selectedChapter,
          selectedVerseNumbers: nextVerseNumbers,
          translationId: selectedTranslationId,
        }),
        { preventScrollReset: true, replace: true },
      );
    },
    [selectBibleRoute, selectedBookId, selectedChapter, selectedTranslationId],
  );

  return {
    clearReaderSelection,
    selectBibleRoute,
    selectReaderBook,
    selectReaderChapter,
    selectReaderRange,
    selectReaderTranslation,
    selectReaderVerse,
  };
}

function haveSameVerseNumbers(
  firstVerseNumbers: readonly number[],
  secondVerseNumbers: readonly number[],
) {
  return (
    firstVerseNumbers.length === secondVerseNumbers.length &&
    firstVerseNumbers.every(
      (verseNumber, index) => verseNumber === secondVerseNumbers[index],
    )
  );
}

function createCurrentRouteState({
  bookId,
  chapter,
  selectedVerseNumbers,
  translationId,
}: {
  bookId: string;
  chapter: number;
  selectedVerseNumbers: number[];
  translationId: string;
}): BibleRouteState {
  return {
    bookId: bookId || null,
    chapter,
    selectedVerseNumbers,
    translationId: translationId || null,
  };
}
