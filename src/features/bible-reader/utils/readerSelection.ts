export function toggleVerseSelection(
  selectedVerseNumbers: readonly number[],
  verseNumber: number,
) {
  if (selectedVerseNumbers.includes(verseNumber)) {
    return selectedVerseNumbers.filter(
      (selectedVerseNumber) => selectedVerseNumber !== verseNumber,
    );
  }

  return [...selectedVerseNumbers, verseNumber].sort(sortVerseNumbers);
}

export function addVerseRange(
  selectedVerseNumbers: readonly number[],
  startVerse: number,
  endVerse: number,
) {
  const firstVerse = Math.min(startVerse, endVerse);
  const lastVerse = Math.max(startVerse, endVerse);
  const verseRange = Array.from(
    { length: lastVerse - firstVerse + 1 },
    (_, index) => firstVerse + index,
  );

  return [...new Set([...selectedVerseNumbers, ...verseRange])].sort(
    sortVerseNumbers,
  );
}

function sortVerseNumbers(firstVerse: number, secondVerse: number) {
  return firstVerse - secondVerse;
}
