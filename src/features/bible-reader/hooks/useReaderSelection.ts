import { useState } from "react";

/**
 * Owns Bible-reader verse selection.
 * Click toggles individual verses; drag selection adds a continuous range.
 */
export function useReaderSelection() {
  const [selectedVerseNumbers, setSelectedVerseNumbers] = useState<number[]>([]);
  const [focusSelectedVerseKey, setFocusSelectedVerseKey] = useState(0);

  function clearSelection() {
    setSelectedVerseNumbers([]);
  }

  function focusSelectedVerses() {
    setFocusSelectedVerseKey((currentKey) => currentKey + 1);
  }

  function selectVerse(verseNumber: number) {
    setSelectedVerseNumbers((currentVerseNumbers) => {
      if (currentVerseNumbers.includes(verseNumber)) {
        return currentVerseNumbers.filter((currentVerseNumber) => currentVerseNumber !== verseNumber);
      }

      return [...currentVerseNumbers, verseNumber].sort(sortVerseNumbers);
    });
  }

  function selectRange(startVerse: number, endVerse: number) {
    const firstVerse = Math.min(startVerse, endVerse);
    const lastVerse = Math.max(startVerse, endVerse);
    const verseRange = Array.from(
      { length: lastVerse - firstVerse + 1 },
      (_, index) => firstVerse + index,
    );

    setSelectedVerseNumbers((currentVerseNumbers) => {
      return [...new Set([...currentVerseNumbers, ...verseRange])].sort(sortVerseNumbers);
    });
  }

  return {
    clearSelection,
    focusSelectedVerseKey,
    focusSelectedVerses,
    selectRange,
    selectedVerseNumbers,
    selectVerse,
    setSelectedVerseNumbers,
  };
}

function sortVerseNumbers(firstVerse: number, secondVerse: number) {
  return firstVerse - secondVerse;
}
