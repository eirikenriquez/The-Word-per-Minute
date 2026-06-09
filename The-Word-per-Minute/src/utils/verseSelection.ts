export function getRandomVerseIndex(verseCount: number, currentIndex: number) {
  if (verseCount <= 1) return 0;

  let nextIndex = currentIndex;
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * verseCount);
  }

  return nextIndex;
}
