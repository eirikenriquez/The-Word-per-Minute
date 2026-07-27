import { useState } from 'react';

/**
 * Owns Bible-reader verse selection.
 * Click toggles individual verses; drag selection adds a continuous range.
 */
export function useReaderSelection() {
  const [selectedVerseNumbers, setSelectedVerseNumbers] = useState<number[]>(
    [],
  );
  const [focusSelectedVerseKey, setFocusSelectedVerseKey] = useState(0);

  function focusSelectedVerses() {
    setFocusSelectedVerseKey((currentKey) => currentKey + 1);
  }

  return {
    focusSelectedVerseKey,
    focusSelectedVerses,
    selectedVerseNumbers,
    setSelectedVerseNumbers,
  };
}
