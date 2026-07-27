import type { BookSummary, Translation } from '../../../types/bible';
import { APP_ROUTE_PATHS } from '../appRoutePaths';

export type BibleRouteState = {
  bookId: string | null;
  chapter: number | null;
  selectedVerseNumbers: number[];
  translationId: string | null;
};

export type ResolvedBibleRouteState = {
  bookId: string;
  chapter: number;
  selectedVerseNumbers: number[];
  translationId: string;
};

type ResolveBibleRouteStateParams = {
  books: readonly BookSummary[];
  routeState: BibleRouteState;
  selectedBookId: string;
  selectedChapter: number;
  selectedTranslationId: string;
  translations: readonly Translation[];
};

/**
 * Reads shareable Bible-reader state from URL search parameters.
 */
export function readBibleRouteState(
  searchParams: URLSearchParams,
): BibleRouteState {
  return {
    bookId: normaliseIdentifier(searchParams.get('book')),
    chapter: normalisePositiveInteger(searchParams.get('chapter')),
    selectedVerseNumbers: normaliseVerseNumbers(
      searchParams.get('verses')?.split(',') ?? [],
    ),
    translationId: normaliseIdentifier(searchParams.get('translation')),
  };
}

/**
 * Creates a canonical Bible-reader URL from a partial reader selection.
 */
export function createBiblePath({
  bookId,
  chapter,
  selectedVerseNumbers,
  translationId,
}: BibleRouteState) {
  const searchParams = new URLSearchParams();
  const normalisedTranslationId = normaliseIdentifier(translationId);
  const normalisedBookId = normaliseIdentifier(bookId);
  const normalisedChapter = normalisePositiveNumber(chapter);
  const normalisedVerseNumbers = normaliseVerseNumbers(selectedVerseNumbers);

  if (normalisedTranslationId) {
    searchParams.set('translation', normalisedTranslationId);
  }

  if (normalisedBookId) {
    searchParams.set('book', normalisedBookId);
  }

  if (normalisedChapter) {
    searchParams.set('chapter', String(normalisedChapter));
  }

  if (normalisedVerseNumbers.length) {
    searchParams.set('verses', normalisedVerseNumbers.join(','));
  }

  const search = searchParams.toString();
  return search ? `${APP_ROUTE_PATHS.bible}?${search}` : APP_ROUTE_PATHS.bible;
}

/**
 * Resolves requested reader state against the currently available Bible data.
 */
export function resolveBibleRouteState({
  books,
  routeState,
  selectedBookId,
  selectedChapter,
  selectedTranslationId,
  translations,
}: ResolveBibleRouteStateParams): ResolvedBibleRouteState | null {
  const translationId = resolveIdentifier(
    routeState.translationId,
    selectedTranslationId,
    translations,
  );
  if (!translationId) return null;

  const bookId = resolveIdentifier(routeState.bookId, selectedBookId, books);
  if (!bookId) return null;

  const selectedBook = books.find((book) => book.id === bookId);
  if (!selectedBook) return null;

  const chapter = resolveChapter(
    routeState.chapter,
    selectedChapter,
    selectedBook.chapterCount,
  );
  const verseCount = selectedBook.verseCounts[chapter - 1] ?? 0;

  return {
    bookId,
    chapter,
    selectedVerseNumbers: normaliseVerseNumbers(
      routeState.selectedVerseNumbers,
    ).filter((verseNumber) => verseNumber <= verseCount),
    translationId,
  };
}

function resolveIdentifier(
  requestedId: string | null,
  selectedId: string,
  options: readonly { id: string }[],
) {
  if (requestedId && options.some((option) => option.id === requestedId)) {
    return requestedId;
  }

  if (selectedId && options.some((option) => option.id === selectedId)) {
    return selectedId;
  }

  return options[0]?.id ?? null;
}

function resolveChapter(
  requestedChapter: number | null,
  selectedChapter: number,
  chapterCount: number,
) {
  if (
    requestedChapter &&
    requestedChapter > 0 &&
    requestedChapter <= chapterCount
  ) {
    return requestedChapter;
  }

  if (selectedChapter > 0 && selectedChapter <= chapterCount) {
    return selectedChapter;
  }

  return 1;
}

function normaliseIdentifier(identifier: string | null) {
  const trimmedIdentifier = identifier?.trim();
  return trimmedIdentifier || null;
}

function normalisePositiveInteger(value: string | null) {
  if (!value || !/^\d+$/.test(value.trim())) return null;
  return normalisePositiveNumber(Number(value));
}

function normalisePositiveNumber(value: number | null) {
  return value && Number.isSafeInteger(value) && value > 0 ? value : null;
}

function normaliseVerseNumbers(values: readonly (number | string)[]) {
  const verseNumbers = values
    .map((value) =>
      typeof value === 'number'
        ? normalisePositiveNumber(value)
        : normalisePositiveInteger(value),
    )
    .filter((value): value is number => value !== null);

  return [...new Set(verseNumbers)].sort(
    (firstVerse, secondVerse) => firstVerse - secondVerse,
  );
}
