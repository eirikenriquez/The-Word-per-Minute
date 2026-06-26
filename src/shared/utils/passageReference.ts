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
 * Builds display references for selected verse lists, including non-contiguous picks.
 * Examples: "Genesis 1:1-3" or "Genesis 1:1,3,5".
 */
export function formatSelectedVerseReference(bookName: string, chapter: number, selectedVerses: number[]) {
  if (!selectedVerses.length) return formatChapterReference(bookName, chapter);

  const sortedVerses = [...new Set(selectedVerses)].sort((firstVerse, secondVerse) => firstVerse - secondVerse);
  const isContiguous = sortedVerses.every((verseNumber, index) => {
    if (index === 0) return true;
    return verseNumber === sortedVerses[index - 1] + 1;
  });

  return isContiguous
    ? formatPassageReference(bookName, chapter, sortedVerses[0], sortedVerses[sortedVerses.length - 1])
    : `${bookName} ${chapter}:${sortedVerses.join(",")}`;
}

/**
 * Builds display references like "Matthew 5" for a whole Bible chapter.
 */
export function formatChapterReference(bookName: string, chapter: number) {
  return `${bookName} ${chapter}`;
}
