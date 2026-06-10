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

export function formatChapterReference(bookName: string, chapter: number) {
  return `${bookName} ${chapter}`;
}
