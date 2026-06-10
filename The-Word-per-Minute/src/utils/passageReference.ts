/**
 * Builds display references like "Matthew 5:3-10" from structured passage data.
 * Keeping this in one place avoids slightly different reference formats across the UI.
 */
export function formatPassageReference(
  bookName: string,
  chapter: number,
  startVerse: number,
  endVerse = startVerse,
) {
  return startVerse === endVerse
    ? `${bookName} ${chapter}:${startVerse}`
    : `${bookName} ${chapter}:${startVerse}-${endVerse}`;
}

/**
 * Builds display references like "Matthew 5" for whole-chapter practice.
 */
export function formatChapterReference(bookName: string, chapter: number) {
  return `${bookName} ${chapter}`;
}
