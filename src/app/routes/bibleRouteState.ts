import { APP_ROUTE_PATHS } from './appRoutePaths';

export type BibleRouteState = {
  bookId: string | null;
  chapter: number | null;
  selectedVerseNumbers: number[];
  translationId: string | null;
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
